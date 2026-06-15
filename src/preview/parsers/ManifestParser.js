const fs = acode.require('fs');
import { LogManager } from '../core/LogManager.js';

export class ManifestParser {
    async getAppTheme(projectRoot) {
        const TAG = 'ManifestParser';
        LogManager.d(TAG, `Attempting to resolve App Theme from project: ${projectRoot}`);

        try {
            if (!fs) {
                console.warn("⚠️ [Manifest] fs module not available");
                LogManager.e(TAG, "FileSystem (fs) module not available in Acode environment.");
                return null;
            }

            const path = `${projectRoot}/app/src/main/AndroidManifest.xml`;
            const altPath = `${projectRoot}/src/main/AndroidManifest.xml`;
            
            let content = "";
            
            try {
                LogManager.v(TAG, `Checking primary path: ${path}`);
                const exists = await fs(path).exists();
                if (exists) {
                    content = await fs(path).readFile('utf-8');
                    LogManager.i(TAG, "AndroidManifest.xml found at primary path.");
                } else {
                    LogManager.v(TAG, "Primary path does not exist.");
                }
            } catch (e) {
                LogManager.w(TAG, `Error checking primary path: ${e.message}`);
                try {
                    LogManager.v(TAG, `Checking alternate path: ${altPath}`);
                    const altExists = await fs(altPath).exists();
                    if (altExists) {
                        content = await fs(altPath).readFile('utf-8');
                        LogManager.i(TAG, "AndroidManifest.xml found at alternate path.");
                    }
                } catch (e2) {
                    LogManager.e(TAG, `Failed to find AndroidManifest.xml in both paths.`);
                    return null;
                }
            }
            
            if (!content) {
                LogManager.w(TAG, "AndroidManifest content is empty.");
                return null;
            }

            const match = content.match(/android:theme="(@style\/[\w.]+)"/);
            if (match) {
                LogManager.i(TAG, `Theme detected: ${match[1]}`);
                return match[1];
            } else {
                LogManager.w(TAG, "android:theme attribute not found in Manifest.");
            }
        } catch (e) {
            console.warn("⚠️ [Manifest] Failed to parse theme:", e.message);
            LogManager.e(TAG, `Exception during theme parsing: ${e.message}`);
        }
        return null;
    }
}