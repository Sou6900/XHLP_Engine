const fs = acode.require('fs');

class AndroidOperations {
    
    constructor() {
        this.cache = new Map();
    }

    // PROJECT SCANNER
    async isAndroidProject(rootPath) {
        let score = 0;
        let totalWeight = 0;
        let detectedType = 'unknown';

        // 1. Critical Files (High Weight)
        const criticalChecks = [
            { path: 'build.gradle', weight: 20 },
            { path: 'build.gradle.kts', weight: 20 }, // Kotlin DSL
            { path: 'settings.gradle', weight: 15 },
            { path: 'settings.gradle.kts', weight: 15 },
            { path: 'AndroidManifest.xml', weight: 25, deepSearch: true }, // Search in subfolders
            { path: 'gradlew', weight: 10 },
            { path: 'gradle.properties', weight: 10 }
        ];

        // 2. Folder Structure (Medium Weight)
        const folderChecks = [
            { path: 'app', weight: 10 },
            { path: 'src/main/java', weight: 10 },
            { path: 'src/main/res', weight: 10 },
            { path: 'gradle/wrapper', weight: 5 }
        ];

        // --- Execute Checks ---
        
        // Check Root Files
        for (const check of criticalChecks) {
            if (check.deepSearch) continue; // Skip deep search here
            if (await this._exists(rootPath, check.path)) {
                score += check.weight;
            }
        }

        // Check Folders
        for (const check of folderChecks) {
            if (await this._exists(rootPath, check.path)) {
                score += check.weight;
            }
        }

        // Deep Search for Manifest (If not found yet)
        const manifestInApp = await this._exists(rootPath, 'app/src/main/AndroidManifest.xml');
        const manifestInRoot = await this._exists(rootPath, 'src/main/AndroidManifest.xml');
        
        if (manifestInApp || manifestInRoot) {
            score += 25; // Manifest weight
            detectedType = manifestInApp ? 'standard' : 'flat';
        }

        // Calculate Percentage (Total max distinct weight approx 100-110 depending on kts/groovy)
        // Normalizing to 100 base
        const normalizedScore = Math.min(100, score);
        
        // console.log(` Android Scan: Score ${normalizedScore}% (${detectedType})`);

        return {
            isAndroid: normalizedScore >= 40, // 40% is fair baseline, strict mode requires >80%
            isStrictlyAndroid: normalizedScore >= 80,
            confidence: normalizedScore,
            structure: detectedType
        };
    }

    // =========================================================
    // PACKAGE ID EXTRACTOR
    // =========================================================

    async getAndroidPackageId(rootPath) {
        const modulePath = await this.detectModuleRoot(rootPath);
        let packageName = null;

        // Try 1: build.gradle (namespace or applicationId)
        const gradlePath = `${modulePath}/build.gradle`;
        if (await this._exists(rootPath, gradlePath)) {
            const content = await this._readFile(rootPath, gradlePath);
            // Check 'namespace' (New Gradle)
            const nsMatch = content.match(/namespace\s+['"]([^'"]+)['"]/);
            if (nsMatch) return nsMatch[1];

            // Check 'applicationId' (Old Gradle)
            const appMatch = content.match(/applicationId\s+['"]([^'"]+)['"]/);
            if (appMatch) return appMatch[1];
        }

        // Try 2: AndroidManifest.xml (package attribute)
        const manifestPath = `${modulePath}/src/main/AndroidManifest.xml`;
        if (await this._exists(rootPath, manifestPath)) {
            const content = await this._readFile(rootPath, manifestPath);
            const pkgMatch = content.match(/package=['"]([^'"]+)['"]/);
            if (pkgMatch) return pkgMatch[1];
        }

        return null;
    }

    // =========================================================
    // MAIN ACTIVITY PATH FINDER
    // =========================================================

    async getMainActivityPath(rootPath) {
        const packageName = await this.getAndroidPackageId(rootPath);
        if (!packageName) return null;

        const modulePath = await this.detectModuleRoot(rootPath);
        const packagePath = packageName.replace(/\./g, '/');
        
        const baseDirs = [
            `${modulePath}/src/main/java/${packagePath}`,
            `${modulePath}/src/main/kotlin/${packagePath}`,
            `${modulePath}/src/main/java` // Fallback
        ];

        for (const dir of baseDirs) {
            const fullDir = this._resolve(rootPath, dir);
            if (await fs(fullDir).exists()) {
                // 1. Try standard names
                if (await fs(this._resolve(rootPath, `${dir}/MainActivity.java`)).exists()) 
                    return `${dir}/MainActivity.java`;
                if (await fs(this._resolve(rootPath, `${dir}/MainActivity.kt`)).exists()) 
                    return `${dir}/MainActivity.kt`;

                // 2. Scan folder for ANY Activity
                const files = await fs(fullDir).lsDir(); // Pseudo method, needs real impl
                // Acode fs listing logic needed here to find *Activity.java
                // Since simpler fs is safer, stick to standard names or return directory
                return dir; // Return the package directory if exact file not found
            }
        }
        return null;
    }

    // =========================================================
    //️ USEFUL UTILITIES (REUSABLE)
    // =========================================================

    async detectModuleRoot(rootPath) {
        if (await this._exists(rootPath, 'app/build.gradle')) {
            return 'app';
        }
        if (await this._exists(rootPath, 'build.gradle')) {
            // Check if this build.gradle has 'com.android.application'
            const content = await this._readFile(rootPath, 'build.gradle');
            if (content.includes('com.android.application')) {
                return ''; // Root IS the module
            }
        }
        return 'app'; // Default safest guess
    }

    async getPermissions(rootPath) {
        const modulePath = await this.detectModuleRoot(rootPath);
        const manifestPath = `${modulePath}/src/main/AndroidManifest.xml`;
        
        if (!await this._exists(rootPath, manifestPath)) return [];

        const content = await this._readFile(rootPath, manifestPath);
        const permissions = [];
        const regex = /<uses-permission\s+android:name=['"]([^'"]+)['"]\s*\/>/g;
        let match;
        while ((match = regex.exec(content)) !== null) {
            permissions.push(match[1]);
        }
        return permissions;
    }

    // --- Private Helpers ---

    _resolve(root, path) {
        const cleanRoot = root.endsWith('/') ? root.slice(0, -1) : root;
        const cleanPath = path.startsWith('/') ? path.slice(1) : path;
        return `${cleanRoot}/${cleanPath}`;
    }

    async _exists(root, path) {
        try {
            return await fs(this._resolve(root, path)).exists();
        } catch (e) { return false; }
    }

    async _readFile(root, path) {
        try {
            return await fs(this._resolve(root, path)).readFile('utf-8');
        } catch (e) { return ""; }
    }
}

export const androidOps = new AndroidOperations();