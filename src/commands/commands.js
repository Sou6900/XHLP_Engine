import { getSettings } from '../services/settings.js';
import { showBuilderPage } from '../generation/bundle/builderPage.js';
import { FeatureStoreUI } from '../features/FeatureStoreUI.js';
import { androidOps } from '../operations/androidOperations.js';
import { LayoutPreviewUI } from '../preview/ui/LayoutPreviewUI.js';

export class CommandManager {
    
    static async init() {
        const editor = editorManager.editor;
        
        // Command 1: Open Android Builder (Settings/Build Page)
        editor.commands.addCommand({
            name: 'openAndroidBuilder',
            bindKey: { win: 'Ctrl-Alt-i', mac: 'Command-Alt-i' },
            exec: this.openBuilder.bind(this),
        });

        // Command 2: Open Feature Store
        editor.commands.addCommand({
            name: 'openAndroidFeatureStore',
            bindKey: { win: 'Ctrl-Alt-f', mac: 'Command-Alt-f' },
            exec: this.openFeatureStore.bind(this),
        });
        
        // Command 3: Open Preview
        editor.commands.addCommand({
            name: 'previewXmlLayout',
            bindKey: { win: 'Ctrl-Alt-p', mac: 'Command-Alt-p' }, // আপনার চাওয়া শর্টকাট
            exec: () => {
                new LayoutPreviewUI().show();
            },
        });
    }

    static destroy() {
        const editor = editorManager.editor;
        editor.commands.removeCommand('openAndroidBuilder');
        editor.commands.removeCommand('openAndroidFeatureStore');
    }

    //️ Action: Open Builder Page
    static openBuilder() {
        if (getSettings().disable_plugin) return;
        showBuilderPage();
    }

    // Action: Open Feature Store (With Smart Root Detection)
    static async openFeatureStore() {
        const activeFile = editorManager.activeFile;
        if (!activeFile) {
            window.toast('Open a file inside an Android project first!', 3000);
            return;
        }

        const filePath = activeFile.uri || activeFile.location;
        if (!filePath) return;

        window.toast('Scanning for project root...', 1000);

        // Find the root folder using androidOperations
        const projectRoot = await this.findProjectRoot(filePath);

        if (projectRoot) {
            new FeatureStoreUI(projectRoot).show();
        } else {
            window.toast('❌ Not a valid Android project!', 3000);
        }
    }

    /**
     * Traverses up from the file path to find the Android Project Root.
     * Uses androidOps.isAndroidProject for validation.
     */
    static async findProjectRoot(startPath) {
        let currentPath = startPath;
        
        // If it's a file, start from its directory
        if (!currentPath.endsWith('/')) {
            currentPath = currentPath.substring(0, currentPath.lastIndexOf('/'));
        }

        let depth = 0;
        const MAX_DEPTH = 10; // Prevent infinite loops

        while (currentPath.length > 10 && depth < MAX_DEPTH) {
            // Check if this folder is an Android project
            const result = await androidOps.isAndroidProject(currentPath);
            
            if (result.isAndroid) {
                console.log(`✅ Found Project Root: ${currentPath} (Confidence: ${result.confidence}%)`);
                return currentPath;
            }
            
            // Move Up
            const parent = currentPath.substring(0, currentPath.lastIndexOf('/'));
            if (parent === currentPath) break; // Reached system root
            currentPath = parent;
            depth++;
        }
        return null;
    }
}