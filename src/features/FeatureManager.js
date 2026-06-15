const fs = acode.require('fs');

export class FeatureManager {
    constructor(projectRoot) {
        this.root = projectRoot;
    }

    // ==========================================
    // FILE SYSTEM OPERATIONS
    // ==========================================

    _resolvePath(path) {
        if (path.startsWith('content:') || path.startsWith('file:')) {
            return path;
        }
        return `${this.root}/${path}`.replace(/([^:]\/)\/+/g, "$1");
    }

    async getFileContent(path) {
        const fileUrl = this._resolvePath(path);
        try {
            if (await fs(fileUrl).exists()) {
                return await fs(fileUrl).readFile('utf-8');
            }
        } catch (e) { 
            console.warn("FeatureManager: File read error", e); 
        }
        return null;
    }

    async saveFileContent(path, content) {
        const fileUrl = this._resolvePath(path);
        await fs(fileUrl).writeFile(content);
    }

    async getProjectInfo() {
        let packageName = "Unknown Package";
        let modulePath = ""; // Default to root (e.g. if opened inside 'app')

        //  Detect Module Path
        // Check if 'app' folder exists, otherwise assume current root is module
        if (await fs(this._resolvePath("app/build.gradle")).exists()) {
            modulePath = "app/";
        } 

        // Read Gradle
        const gradleContent = await this.getFileContent(`${modulePath}build.gradle`);
        if (gradleContent) {
            const namespaceMatch = gradleContent.match(/namespace\s+['"]([^'"]+)['"]/);
            if (namespaceMatch) {
                packageName = namespaceMatch[1];
            } else {
                const appIdMatch = gradleContent.match(/applicationId\s+['"]([^'"]+)['"]/);
                if (appIdMatch) packageName = appIdMatch[1];
            }
        }

        // Fallback to Manifest
        if (packageName === "Unknown Package") {
            const manifestContent = await this.getFileContent(`${modulePath}src/main/AndroidManifest.xml`);
            if (manifestContent) {
                const pkgMatch = manifestContent.match(/package=['"]([^'"]+)['"]/);
                if (pkgMatch) packageName = pkgMatch[1];
            }
        }
        
        return { packageName, modulePath };
    }

    async getInstalledPermissions() {
        const { modulePath } = await this.getProjectInfo();
        const manifestContent = await this.getFileContent(`${modulePath}src/main/AndroidManifest.xml`);
        
        if (!manifestContent) return [];
        const permissions = [];
        const regex = /<uses-permission\s+android:name=['"]([^'"]+)['"]\s*\/>/g;
        let match;
        while ((match = regex.exec(manifestContent)) !== null) {
            permissions.push(match[1]);
        }
        return permissions;
    }

    // ==========================================
    //️ SAFETY & ROLLBACK
    // ==========================================

    async createBackup(path) {
        const fileUrl = this._resolvePath(path);
        try {
            const content = await this.getFileContent(path);
            if (!content) return false;

            const parts = fileUrl.split('/');
            const fileName = parts.pop(); 
            const parentUrl = parts.join('/');
            const backupName = fileName + ".bak";

            try {
                const list = await fs(parentUrl).lsDir();
                const existing = list.find(f => f.name === backupName);
                if(existing) await fs(existing.url).delete();
            } catch(e) {}

            await fs(parentUrl).createFile(backupName, content);
            console.log("✅ Backup created:", backupName);
            return true;
        } catch (e) {
            console.warn("⚠️ Backup creation failed:", e);
            return true; 
        }
    }

    async restoreBackup(path) {
        const fileUrl = this._resolvePath(path);
        const backupUrl = fileUrl + ".bak";
        try {
            if (await fs(backupUrl).exists()) {
                const content = await fs(backupUrl).readFile('utf-8');
                await fs(fileUrl).writeFile(content);
                return true;
            }
        } catch(e) { console.error(e); }
        return false;
    }

    // ==========================================
    // STATUS CHECKING
    // ==========================================

    async checkComponentStatus(component) {
        if (component.type === 'code_snippet') return { installed: false, version: null };

        const { modulePath } = await this.getProjectInfo();
        const realPath = component.file.replace(/^app\//, modulePath);

        const content = await this.getFileContent(realPath);
        if (!content) return { installed: false, version: null };

        if (component.content.includes('${version}')) {
            const parts = component.content.split('${version}');
            const prefix = this.escapeRegex(parts[0]);
            const suffix = this.escapeRegex(parts[1] || ""); 
            const regex = new RegExp(`${prefix}(.*?)${suffix ? suffix : "['\"]"}`); 
            
            const match = content.match(regex);
            if (match) return { installed: true, version: match[1] };
            return { installed: false, version: null };
        }

        let exists = false;
        if (component.type === 'dependency') exists = content.includes(component.content);
        else if (component.type === 'permission' || component.type === 'meta-data') exists = content.includes(component.uniqueKey);
        else if (component.type === 'string') exists = content.includes(`name="${component.key}"`);

        return { installed: exists, version: exists ? 'Fixed' : null };
    }

    async checkSnippetPartStatus(targetActivity, fileConfig, projectInfo) {
        if (fileConfig.type === 'activity_logic') {
            const content = await this.getFileContent(targetActivity);
            if (!content) return false;
            return content.includes(fileConfig.checkString.trim());
        }
        
        if (fileConfig.path) {
            let rawPath = fileConfig.path
                .replace('{packagePath}', projectInfo.packageName.replace(/\./g, '/'))
                .replace('{packageName}', projectInfo.packageName)
                .replace('{res}', `${projectInfo.modulePath}src/main/res`);
            
            const fullPath = this._resolvePath(rawPath);
            const content = await this.getFileContent(fullPath);
            if (!content) return false;
            
            const snippetContent = fileConfig.content.replace('{packageName}', projectInfo.packageName);
            return content.includes(snippetContent.trim());
        }
        return false;
    }

    // ==========================================
    // MULTI-FILE INJECTION SYSTEM
    // ==========================================

    async injectSnippetPackage(targetActivity, snippetData, projectInfo) {
        let success = true;

        // Inject into Target Activity
        if (targetActivity && (snippetData.java || snippetData.kotlin)) {
            const actResult = await this.injectActivityCode(targetActivity, snippetData, projectInfo);
            if (!actResult) success = false;
        }

        // Handle Additional Files
        if (snippetData.files && snippetData.files.length > 0) {
            const pkgPath = projectInfo.packageName.replace(/\./g, '/');
            
            for (const fileConfig of snippetData.files) {
                // Use dynamic modulePath
                let rawPath = fileConfig.path
                    .replace('{packagePath}', pkgPath)
                    .replace('{packageName}', projectInfo.packageName)
                    .replace('{res}', `${projectInfo.modulePath}src/main/res`);
                
                const fullPath = this._resolvePath(rawPath);
                const content = fileConfig.content.replace('{packageName}', projectInfo.packageName);

                try {
                    if (fileConfig.action === 'create') {
                        await this._createDeepFile(fullPath, content);
                        console.log(`✅ Created: ${rawPath}`);
                    } 
                    else if (fileConfig.action === 'inject_xml') {
                        await this._injectIntoXML(fullPath, content);
                        console.log(`✅ Injected XML: ${rawPath}`);
                    }
                } catch (e) {
                    console.error(`❌ Failed processing ${rawPath}:`, e);
                    success = false;
                }
            }
        }
        return success;
    }

    async injectSingleSnippetPart(targetActivity, partConfig, projectInfo) {
        if (partConfig.type === 'activity_logic') {
            return await this.injectActivityCode(targetActivity, partConfig.data, projectInfo);
        }

        if (partConfig.path) {
            const pkgPath = projectInfo.packageName.replace(/\./g, '/');
            let rawPath = partConfig.path
                .replace('{packagePath}', pkgPath)
                .replace('{packageName}', projectInfo.packageName)
                .replace('{res}', `${projectInfo.modulePath}src/main/res`);
            
            const fullPath = this._resolvePath(rawPath);
            const content = partConfig.content.replace('{packageName}', projectInfo.packageName);

            try {
                if (partConfig.action === 'create') {
                    await this._createDeepFile(fullPath, content);
                } else if (partConfig.action === 'inject_xml') {
                    await this._injectIntoXML(fullPath, content);
                }
                return true;
            } catch (e) {
                console.error(e);
                return false;
            }
        }
        return false;
    }

    // ==========================================
    //️ INTERNAL HELPER LOGIC
    // ==========================================

    async _createDeepFile(fullUrl, content) {
        try {
            if (await fs(fullUrl).exists()) {
                await fs(fullUrl).writeFile(content);
                return true;
            }
        } catch(e) {}

        const parts = fullUrl.split('/');
        const fileName = parts.pop();
        let currentUrl = parts.join('/'); 

        const pathStack = [];
        let folderExists = false;
        let loopLimit = 0;
        
        while(loopLimit < 15) {
            try {
                if(await fs(currentUrl).exists()) {
                    folderExists = true;
                    break;
                }
            } catch(e) {}
            
            const folder = parts.pop();
            if(!folder) break;
            pathStack.unshift(folder); 
            currentUrl = parts.join('/');
            loopLimit++;
        }

        if(!folderExists) throw new Error("Root path invalid");

        for(const folder of pathStack) {
            await fs(currentUrl).createDirectory(folder);
            currentUrl = `${currentUrl}/${folder}`;
        }

        await fs(currentUrl).createFile(fileName, content);
        return true;
    }

    async _injectIntoXML(path, snippet) {
        let content = await this.getFileContent(path);
        if (!content) return false;
        await this.createBackup(path);

        if (content.includes(snippet.trim())) return true;

        const lastIndex = content.lastIndexOf('</');
        if (lastIndex !== -1) {
            const newContent = content.slice(0, lastIndex) + "\n    " + snippet + "\n" + content.slice(lastIndex);
            await this.saveFileContent(path, newContent);
            return true;
        }
        return false;
    }

    // ==========================================
    // SMART ACTIVITY CODE INJECTOR
    // ==========================================

    async injectActivityCode(activityPath, config, projectInfo) {
        console.log("💉 Injecting into:", activityPath);
        await this.createBackup(activityPath);
        
        let content = await this.getFileContent(activityPath);
        if (!content) return false;

        const lang = activityPath.endsWith('.kt') ? 'kotlin' : 'java';
        const snippet = config[lang] || config; 

        const replacePlaceholders = (text) => {
            if (!text || !projectInfo) return text;
            return text.replace(/{packageName}/g, projectInfo.packageName);
        };

        if (snippet.imports) {
            const processedImports = snippet.imports.map(imp => replacePlaceholders(imp));
            content = this._mergeImports(content, processedImports);
        }
        
        if (snippet.lifecycle) {
            for (const [method, details] of Object.entries(snippet.lifecycle)) {
                const code = replacePlaceholders(details.code);
                content = this._injectIntoLifecycle(content, method, details.position, code, lang);
            }
        }
        
        if (snippet.methods) {
            const methods = replacePlaceholders(snippet.methods);
            content = this._injectExtraMethods(content, methods);
        }

        await this.saveFileContent(activityPath, content);
        return true;
    }

    _mergeImports(content, newImports) {
        const lines = content.split('\n');
        const existingImports = new Set();
        let lastImportIndex = -1;

        const importRegex = /import\s+(?:static\s+)?([\w\.]+)/;

        lines.forEach((line, index) => {
            const match = line.trim().match(importRegex);
            if (match) {
                existingImports.add(match[1]); 
                lastImportIndex = index;
            }
        });

        const importsToAdd = [];
        newImports.forEach(imp => {
            const cleanImp = imp.replace(';', '').trim();
            if (!existingImports.has(cleanImp)) {
                importsToAdd.push(`import ${cleanImp};`);
                existingImports.add(cleanImp); 
            }
        });
        
        if (importsToAdd.length === 0) return content;

        if (lastImportIndex !== -1) {
            lines.splice(lastImportIndex + 1, 0, ...importsToAdd);
        } else {
            const pkgIndex = lines.findIndex(l => l.trim().startsWith('package '));
            if(pkgIndex !== -1) lines.splice(pkgIndex + 1, 0, "", ...importsToAdd);
            else lines.unshift(...importsToAdd);
        }

        return lines.join('\n');
    }

    _injectIntoLifecycle(content, methodType, strategy, codeSnippet, language) {
        if(content.includes(codeSnippet.trim())) return content;

        let methodRegex = language === 'java' 
            ? new RegExp(`(protected|public)\\s+void\\s+${methodType}\\s*\\(.*?\\)\\s*\\{`, 's')
            : new RegExp(`override\\s+fun\\s+${methodType}\\s*\\(.*?\\)\\s*\\{?`, 's');

        const match = content.match(methodRegex);
        if (!match) return content; 

        const methodBodyStart = match.index + match[0].length;
        const methodEndIndex = this._findClosingBrace(content, methodBodyStart);
        
        if (strategy === 'after_setContentView') {
            const setContentViewRegex = /setContentView\s*\(.*?\)[;]?/;
            const body = content.substring(methodBodyStart, methodEndIndex);
            const setContentMatch = body.match(setContentViewRegex);
            
            if (setContentMatch) {
                const insertAt = methodBodyStart + setContentMatch.index + setContentMatch[0].length;
                return content.slice(0, insertAt) + "\n" + codeSnippet + content.slice(insertAt);
            }
        }
        return content.slice(0, methodEndIndex) + "\n" + codeSnippet + content.slice(methodEndIndex);
    }

    _injectExtraMethods(content, methodsCode) {
        const markerMatch = methodsCode.match(/\[AID_START:\s*([\w_]+)\]/);
        if (markerMatch && content.includes(`[AID_START: ${markerMatch[1]}]`)) return content;

        const lines = methodsCode.trim().split('\n');
        for(let line of lines) {
            line = line.trim();
            if(line.startsWith('@') || line.startsWith('//') || line.length < 5) continue;
            
            if(content.includes(line.replace('{', '').trim())) {
                return content;
            }
            break; 
        }

        const lastBraceIndex = content.lastIndexOf('}');
        if (lastBraceIndex !== -1) {
            return content.slice(0, lastBraceIndex) + "\n" + methodsCode + "\n" + content.slice(lastBraceIndex);
        }
        return content;
    }

    _findClosingBrace(content, startIndex) {
        let openCount = 1;
        for (let i = startIndex; i < content.length; i++) {
            if (content[i] === '{') openCount++;
            if (content[i] === '}') openCount--;
            if (openCount === 0) return i;
        }
        return -1;
    }

    // ==========================================
    // APPLY CHANGES (LEGACY / FEATURE APPLY)
    // ==========================================
    async applyChanges(changes) {
        const { modulePath } = await this.getProjectInfo();
        
        const fileGroups = {};
        const codeInjections = [];

        changes.forEach(change => {
            if (change.component.type === 'code_snippet') {
                codeInjections.push(change);
            } else {
                // If it says 'app/build.gradle' but we are flat, it becomes 'build.gradle'
                const realPath = change.component.file.replace(/^app\//, modulePath);
                
                if (!fileGroups[realPath]) fileGroups[realPath] = [];
                fileGroups[realPath].push(change);
            }
        });

        // Handle XML/Gradle Changes
        for (const [file, actions] of Object.entries(fileGroups)) {
            let content = await this.getFileContent(file);
            if (!content) continue;

            for (const action of actions) {
                if (action.action === 'add') {
                    content = this.injectCode(content, action.component, action.targetVersion);
                } else if (action.action === 'remove') {
                    content = this.removeCode(content, action.component);
                }
            }
            await this.saveFileContent(file, content);
        }

        // Handle Code Injections
        for (const change of codeInjections) {
            if (change.action === 'add' && change.targetActivity) {
                const projectInfo = await this.getProjectInfo();
                await this.injectActivityCode(change.targetActivity, change.component, projectInfo);
            }
        }
    }

    injectCode(content, comp, targetVersion) {
        let codeToInject = comp.content;
        if (targetVersion && codeToInject.includes('${version}')) {
            codeToInject = codeToInject.replace('${version}', targetVersion);
        }
        if (this.isPresent(content, comp)) return content; 
        if (comp.type === 'dependency') {
            const depRegex = /dependencies\s*\{/;
            if (depRegex.test(content)) return content.replace(depRegex, `dependencies {\n    ${codeToInject}`);
        } else if (comp.type === 'permission') {
            const manifestTag = /<manifest[\s\S]*?>/;
            const match = content.match(manifestTag);
            if (match) return content.replace(match[0], `${match[0]}\n    ${codeToInject}`);
        } else if (comp.type === 'meta-data') {
            const appTag = /<application[\s\S]*?>/;
            const match = content.match(appTag);
            if (match) return content.replace(match[0], `${match[0]}\n        ${codeToInject}`);
        } else if (comp.type === 'string') {
            return content.replace('</resources>', `    ${codeToInject}\n</resources>`);
        }
        return content;
    }

    removeCode(content, comp) {
        if (comp.content.includes('${version}')) {
            const parts = comp.content.split('${version}');
            const prefix = this.escapeRegex(parts[0]);
            const regex = new RegExp(`^.*${prefix}.*(\r\n|\r|\n)?`, 'gm');
            return content.replace(regex, '');
        }
        if (comp.type === 'string') {
            const regex = new RegExp(`\\s*<string name="${comp.key}">.*?</string>`, 'g');
            return content.replace(regex, '');
        }
        if ((comp.type === 'permission' || comp.type === 'meta-data') && comp.uniqueKey) {
            const safeKey = this.escapeRegex(comp.uniqueKey);
            const tagName = comp.type === 'permission' ? 'uses-permission' : 'meta-data';
            const regex = new RegExp(`\\s*<${tagName}[^>]*${safeKey}[^>]*\\/>`, 'gs');
            if (regex.test(content)) return content.replace(regex, '');
        }
        return content.replace(comp.content, '');
    }

    isPresent(content, comp) {
        if (comp.content.includes('${version}')) return content.includes(comp.content.split('${version}')[0]);
        if(comp.type === 'permission' || comp.type === 'meta-data') return content.includes(comp.uniqueKey);
        if(comp.type === 'string') return content.includes(`name="${comp.key}"`);
        return content.includes(comp.content);
    }

    escapeRegex(string) { return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
}