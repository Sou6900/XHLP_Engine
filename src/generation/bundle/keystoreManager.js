import { writeShared } from '../../services/terminalManager.js';
import plugin from '../../../plugin.json';
import { getResolvedPaths } from '../../services/pathManager.js'; // Import Path Manager

const fs = acode.require('fs');

export class KeystoreManager {

    getSanitizedPath(rawPath) {
        let path = rawPath;
        if (path.includes('content://')) {
            const decoded = decodeURIComponent(path);
            if (decoded.includes('primary:')) {
                path = '/sdcard/' + decoded.split('primary:').pop();
            }
        } else if (path.startsWith('file://')) {
            path = path.replace('file://', '');
        }
        
        if (path.match(/\.(java|kt|xml|gradle|json)$/i)) {
             path = path.substring(0, path.lastIndexOf('/'));
             if(path.includes('/app/src')) path = path.split('/app/src')[0];
        }

        return path;
    }
    
    async createKeystore(info, onComplete) {
        const cleanRootPath = this.getSanitizedPath(info.path);
        const filename = info.filename || 'release.jks';
        const fullPath = `${cleanRootPath}/${filename}`;
        const checkUrl = `file://${fullPath}`;

        // --- Dynamic Path Resolution ---
        const paths = getResolvedPaths();
        const cleanPath = (p) => p ? p.replace('file://', '') : '';
        
        // Find 'keytool' inside the configured Java bin directory
        const javaBin = cleanPath(paths.java.path); // .../bin/java
        // Assuming keytool is in the same folder as java binary
        const keytoolPath = javaBin.replace(/\/java$/, '/keytool'); 

        const keytoolCmd = `"${keytoolPath}" -genkeypair -v -keystore "${fullPath}" -storepass "${info.password}" -alias "${info.alias}" -keypass "${info.aliasPass}" -keyalg RSA -keysize 2048 -validity 10000 -dname "CN=${info.dname.cn}, OU=${info.dname.ou}, O=${info.dname.o}, L=${info.dname.l}, ST=${info.dname.st}, C=${info.dname.c}"`;

        window.toast(`Generating Keystore...`, 3000);
        await writeShared(`${keytoolCmd}\r`);

        let attempts = 0;
        const checkInterval = setInterval(async () => {
            attempts++;
            try {
                if (await fs(checkUrl).exists()) {
                    clearInterval(checkInterval);
                    window.toast("Keystore Created! ✅", 3000);
                    if (onComplete) onComplete(fullPath);
                    return;
                }
            } catch (e) {}

            if (attempts > 30) {
                clearInterval(checkInterval);
                window.toast("Check terminal for errors.", 4000);
            }
        }, 500);
    }

    // Sign APK
    async signApk(unsignedApkPath, keystoreInfo, onSigned) {
        const paths = getResolvedPaths();
        const cleanPath = (p) => p ? p.replace('file://', '') : '';

        // 1. Get Build Tools Path
        const buildToolsDir = paths.buildTools ? cleanPath(paths.buildTools.path) : `${window.ANDRO_HOME}/build-tools/34.0.0`;
        const APKSIGNER_JAR = `${buildToolsDir}/lib/apksigner.jar`; 

        // 2. Get Java Path
        const javaBin = cleanPath(paths.java.path);
        const JAVA_CMD = `"${javaBin}" -jar "${APKSIGNER_JAR}"`;

        // 3. Prepare APK Paths
        const rawUnsignedPath = unsignedApkPath.replace('file://', '');
        
        let rawSignedPath;
        if (rawUnsignedPath.endsWith('-unsigned.apk')) {
            // app-release-unsigned.apk -> app-release.apk
            rawSignedPath = rawUnsignedPath.replace('-unsigned.apk', '.apk');
        } else {
            // Fallback (just in case)
            rawSignedPath = rawUnsignedPath.replace('.apk', '-signed.apk');
        }

        // Keystore Path Sanitize
        let rawKsPath = keystoreInfo.path;
        if (rawKsPath.includes('content://')) {
             rawKsPath = this.getSanitizedPath(rawKsPath);
        } else {
             rawKsPath = rawKsPath.replace('file://', '');
        }

        // 4. Prepare Path for FS Check
        const checkSignedUrl = `file://${rawSignedPath}`;

        // 5. Command
        const cmd = `${JAVA_CMD} sign --ks "${rawKsPath}" --ks-pass pass:${keystoreInfo.password} --ks-key-alias "${keystoreInfo.alias}" --key-pass pass:${keystoreInfo.aliasPass} --out "${rawSignedPath}" "${rawUnsignedPath}"`;

        window.toast("Signing APK...", 2000);
        await writeShared(`${cmd}\r`);

        // 6. Wait for Signed APK
        let attempts = 0;
        const checkInterval = setInterval(async () => {
            attempts++;
            try {
                if (await fs(checkSignedUrl).exists()) {
                    clearInterval(checkInterval);
                    // window.toast("APK Signed Successfully!", 3000); // Optional
                    if (onSigned) onSigned(checkSignedUrl); 
                    return;
                }
            } catch (e) {}

            if (attempts > 40) { 
                clearInterval(checkInterval);
                
                // Final Check
                try {
                    if (await fs(checkSignedUrl).exists()) {
                         if (onSigned) onSigned(checkSignedUrl);
                         return;
                    }
                } catch(e){}

                if (onSigned) onSigned(null); 
            }
        }, 500);
    }
}

export const keystoreManager = new KeystoreManager();