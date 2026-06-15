import { LogManager } from './LogManager.js';
const fs = acode.require('fs');

export class ProjectContext {
    constructor() {
        this.projectRoot = null;
        this.resPath = null;
        this.packageName = "";
        this.isDark = false; 
    }

    async initialize(activeFileUri) {
        LogManager.d('ProjectContext', `Initializing context analysis for: ${activeFileUri}`);
        this.projectRoot = await this._findProjectRoot(activeFileUri);
        
        if (this.projectRoot) {
            LogManager.i('ProjectContext', `Project Root identified: ${this.projectRoot}`);
            
            const candidates = [
                `${this.projectRoot}/app/src/main/res`,
                `${this.projectRoot}/src/main/res`,
                `${this.projectRoot}/res`
            ];

            let found = false;
            for (const path of candidates) {
                const prefix = this.projectRoot.startsWith('/') ? 'file://' : '';
                const fullPath = `${prefix}${path}`;
                
                // Check if path exists
                if (await fs(fullPath).exists().catch(() => false)) {
                    this.resPath = fullPath;
                    LogManager.i('ResourceManager', `Resource directory found: ${this.resPath}`);
                    found = true;
                    break;
                }
            }
            
            if (!found) {
                LogManager.w('ResourceManager', 'No standard resource directory found (res/). Resources may not load.');
            }
        } else {
            LogManager.w('ProjectContext', "Could not determine project root. Is this file inside an Android project?");
        }
    }

    async _findProjectRoot(uri) {
        if (!uri) return null;
        
        let path = uri;
        
        // Convert Content URI to File Path
        if (path.includes('primary:')) {
            const decoded = decodeURIComponent(path);
            const parts = decoded.split('primary:');
            if (parts.length > 1) {
                // Take the last part as the relative path
                const relativePath = parts.pop();
                // Map to standard Android storage path
                path = `/storage/emulated/0/${relativePath}`;
            }
        } else if (path.startsWith('file://')) {
            path = path.replace('file://', '');
        }

        let index = path.indexOf('/src/main');
        if (index === -1) index = path.indexOf('/res/layout');
        
        if (index > -1) {
            const appIndex = path.indexOf('/app/src/main');
            if (appIndex > -1) {
                return path.substring(0, appIndex); 
            }
            return path.substring(0, index); 
        }

        return null;
    }

    getResourcePath() {
        return this.resPath;
    }

    /**
     * Reads a drawable (XML or Bitmap)
     */
    async getDrawable(name) {
        if (!this.resPath) {
            LogManager.w('ResourceManager', 'getDrawable called but resPath is null.');
            return null;
        }

        const extensions = ['xml', 'png', 'jpg', 'jpeg', 'webp'];
        const dirs = [
            'drawable', 
            'drawable-anydpi',
            'drawable-nodpi', 
            'drawable-xxhdpi', 
            'drawable-xhdpi', 
            'drawable-hdpi', 
            'drawable-mdpi', 
            'drawable-v24'
        ];

        for (const dir of dirs) {
            for (const ext of extensions) {
                let path = `${this.resPath}/${dir}/${name}.${ext}`;
                let file = fs(path);
                
                // Existence check
                let exists = await file.exists().catch(() => false);
                if (!exists) {
                    path = `${this.resPath}/${dir}/${name}.${ext.toUpperCase()}`;
                    file = fs(path);
                    exists = await file.exists().catch(() => false);
                }

                if (exists) {
                    try {
                        if (ext === 'xml') {
                            LogManager.d('ResourceManager', `Loading Vector Drawable: ${name}.${ext}`);
                            return { type: 'xml', content: await file.readFile('utf-8') };
                        } else {
                            LogManager.d('ResourceManager', `Found Bitmap: ${name}.${ext}`);
                            
                            //  Convert Content URI to File Path for toInternalUrl
                            let cleanPath = path;
                            if (path.includes('primary:')) {
                                const decoded = decodeURIComponent(path);
                                const parts = decoded.split('primary:');
                                const relPath = parts.pop(); 
                                const safeRel = relPath.startsWith('/') ? relPath.substring(1) : relPath;
                                cleanPath = `file:///storage/emulated/0/${safeRel}`;
                                LogManager.v('ResourceManager', `Normalized Path for Bitmap: ${cleanPath}`);
                            }

                            // Attempt 1: toInternalUrl
                            try {
                                const toInternalUrl = acode.require('toInternalUrl');
                                if (toInternalUrl) {
                                    const url = await toInternalUrl(cleanPath); 
                                    LogManager.i('ResourceManager', `Generated Internal URL via Acode API.`);
                                    return { type: 'bitmap', content: url };
                                }
                            } catch (e) {
                                LogManager.w('ResourceManager', `toInternalUrl strategy failed: ${e.message}`);
                            }

                            // Attempt 2: fs.readFile('dataurl')
                            try {
                                const dataUrl = await file.readFile('dataurl');
                                if (dataUrl && dataUrl.startsWith('data:')) {
                                    LogManager.i('ResourceManager', `Read Data URL (${dataUrl.length} chars)`);
                                    return { type: 'bitmap', content: dataUrl };
                                }
                            } catch(e) {
                                LogManager.w('ResourceManager', `Data URL read strategy failed: ${e.message}`);
                            }

                            // Attempt 3: Manual Binary Fix (Last Resort)
                            try {
                                const buffer = await file.readFile('arraybuffer');
                                
                                let mimeType = 'image/png';
                                if (ext.toLowerCase().includes('jpg')) mimeType = 'image/jpeg';
                                else if (ext.toLowerCase().includes('webp')) mimeType = 'image/webp';

                                let finalBuffer;
                                if (typeof buffer === 'string') {
                                    const len = buffer.length;
                                    const bytes = new Uint8Array(len);
                                    for (let i = 0; i < len; i++) {
                                        bytes[i] = buffer.charCodeAt(i) & 0xFF; 
                                    }
                                    finalBuffer = bytes;
                                } else {
                                    finalBuffer = buffer;
                                }

                                const blob = new Blob([finalBuffer], { type: mimeType });
                                const blobUrl = URL.createObjectURL(blob);
                                LogManager.i('ResourceManager', `Generated Blob URL manually: ${blobUrl}`);
                                return { type: 'bitmap', content: blobUrl };

                            } catch(e) {
                                LogManager.e('ResourceManager', `All bitmap strategies failed for ${name}: ${e.message}`);
                            }
                        }
                    } catch (e) {
                        LogManager.e('ResourceManager', `Error processing drawable ${name}: ${e.message}`);
                    }
                }
            }
        }
        
        LogManager.w('ResourceManager', `Drawable not found: ${name}`);
        return null;
    }

    async getLayout(name) {
        if (!this.resPath) return null;
        const path = `${this.resPath}/layout/${name}.xml`;
        try {
            if (await fs(path).exists()) {
                LogManager.d('ResourceManager', `Loading included layout: ${name}`);
                return await fs(path).readFile('utf-8');
            }
        } catch (e) {
            LogManager.w('ResourceManager', `Layout not found: ${name} (Path: ${path})`);
        }
        return null;
    }
    
    async getXml(resourceName) {
        if (!this.resPath || !resourceName) return null;
        
        const name = resourceName.replace('@xml/', '');
        
        // Check both 'xml' folder
        const path = `${this.resPath}/xml/${name}.xml`;
        
        try {
            if (await fs(path).exists().catch(() => false)) {
                return await fs(path).readFile('utf-8');
            }
            LogManager.w('ResourceManager', `XML resource not found at: ${path}`);
        } catch (e) {
            LogManager.e('ResourceManager', `Error reading XML ${name}: ${e.message}`);
        }
        return null;
    }
    
    setDarkMode(enabled) { this.isDark = enabled; }
    isDarkMode() { return this.isDark; }
}