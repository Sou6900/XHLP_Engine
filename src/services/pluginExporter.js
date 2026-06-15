import plugin from '../../plugin.json';
import { writeShared } from './terminalManager.js'; 

const fs = acode.require('fs');

export async function exportPluginToZip() {
    try {
        window.toast('Initializing Terminal Export...', 2000);
        
        let pluginPath = '';
        
        if (window.PLUGIN_DIR) {
            pluginPath = `${window.PLUGIN_DIR}/${plugin.id}`;
        } else if (window.ACODE_DIR) {
            pluginPath = `${window.ACODE_DIR}/files/plugins/${plugin.id}`;
        }
        
        if (!pluginPath) {
            window.toast('Error: Could not determine plugin path', 3000);
            return;
        }

        if (pluginPath.startsWith('file://')) {
            pluginPath = pluginPath.replace('file://', '');
        }
        pluginPath = decodeURIComponent(pluginPath);

        console.log("Exporting from (Source):", pluginPath);

        const destPath = "/sdcard/Download/aidpro.zip";
        
        const cmd = `
            echo "--- STARTING EXPORT ---" && \
            echo "Installing ZIP tool..." && \
            apk add zip && \
            rm -f "${destPath}" && \
            echo "Archiving Plugin..." && \
            cd "${pluginPath}" && \
            zip -r "${destPath}" . && \
            echo "--- EXPORT COMPLETE ---" && \
            echo "Saved to: ${destPath}"
        `;

        await writeShared(cmd + "\r");
        
        window.toast('Command sent to Terminal!', 2000);
        
        acode.alert('Export Started', 
            `The export process is running in the terminal.\n\n` +
            `Please check the terminal output.\n` +
            `If successful, you will find "aidpro.zip" in your Download folder.`);

    } catch (e) {
        console.error(e);
        window.toast('Terminal Command Failed: ' + e.message, 4000);
    }
}
