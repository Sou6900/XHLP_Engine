import { PreviewEngine } from '../core/PreviewEngine.js';
import { ToolbarControls } from './toolbar/ToolbarControls.js';
import { previewStyles , blueprintStyles , frameStyles , sideBarStyles} from '../../styles/styles.js';
import { DeviceConfig } from '../device/DeviceConfig.js';
import { StatusBar } from './StatusBar.js'; 
import { svgs } from '../../assets/icons/svg/svg.js';

import { LogcatUI } from './LogcatUI.js';
import { LogManager } from '../core/LogManager.js';
import { BlueprintRenderer } from '../renderers/blueprint/BlueprintRenderer.js';

let instance = null;

export class LayoutPreviewUI {
    constructor() {
        if (instance) return instance;
        instance = this;
        this.engine = new PreviewEngine();
        this.controls = new ToolbarControls(this);
        this.statusBar = new StatusBar(); 
        this.currentFileUri = null;
        this.isDark = this.controls.isDark; 
        
        // Initialize Blueprint Renderer
        this.blueprintRenderer = new BlueprintRenderer();
    }

    async show() {
        const activeFile = editorManager.activeFile;
        if (!activeFile || !activeFile.uri.endsWith('.xml')) {
            window.toast("❌ Please open an XML file", 2000);
            return;
        }
        
        // Safely remove previous preview screen
        try {
            if (window.XHLP_PREVIEW_SCREEN) {
                window.XHLP_PREVIEW_SCREEN.remove(true);
            }
        } catch (error) {
            console.error('Error removing previous preview screen:', error);
        }
        
        // Pass renderer to controls
        this.controls.blueprintRenderer = this.blueprintRenderer;
        
        const originalToggle = this.controls.toggleBlueprint.bind(this.controls);
        this.controls.toggleBlueprint = (force) => {
            originalToggle(force);
            this.updateThemeUI(this.$root, this.controls.isDark);
        };

        // --- TOOLBAR MANAGEMENT ---
        const quickTools = document.querySelector('#quick-tools');
        const quickToolsToggler = document.querySelector('#quicktools-toggler');
    
        function updateToolbarVisibility() {
            const file = editorManager.activeFile;
            if (file && (file.uri || file.location)) {
                if (quickTools) quickTools.style.display = '';
                if (quickToolsToggler) quickToolsToggler.style.display = '';
            } else {
                if (quickTools) quickTools.style.display = 'none';
                if (quickToolsToggler) quickToolsToggler.style.display = 'none';
            }
        }
    
        if (quickTools) quickTools.style.display = 'none';
        if (quickToolsToggler) quickToolsToggler.style.display = 'none';
        editorManager.on('switch-file', updateToolbarVisibility);
        
        this.currentFileUri = activeFile.uri;
        await this.engine.init(activeFile.uri);
        
        const EditorFile = acode.require('editorFile');
        const $content = document.createElement('div');
        $content.className = 'xml-preview-container';
        $content.style.cssText = "height: 100%; width: 100%; display: flex; flex-direction: column; background: var(--primary-color); position: relative; color: var(--primary-text-color);";
        
        // CAMERA PUNCH-HOLE HTML
        const cameraHtml = `
            <div class="hardware-camera" style="
                position: absolute;
                width: 14px; height: 14px;
                background: #000; border-radius: 50%;
                display: flex; align-items: center; justify-content: center;
                z-index: 9999; pointer-events: none;
                box-shadow: 0 0 0 2px rgba(0,0,0,0.1);
            ">
                <div style="width: 6px; height: 6px; border-radius: 50%; background: #1a1a1a; border: 1.5px solid #333;">
                    <div style="width: 2px; height: 2px; background: rgba(255,255,255,0.4); border-radius: 50%; margin: 0.5px;"></div>
                </div>
            </div>
        `;

        $content.innerHTML = `
            <div class="preview-toolbar" style="padding: 0 12px; border-bottom: 1px solid var(--border-color); background: var(--secondary-color); display: flex; justify-content: space-between; align-items: center; flex-shrink: 0; box-shadow: 0 2px 4px var(--box-shadow-color); position: relative; z-index: 999; color: var(--primary-text-color);">
                <div style="display:flex; gap:10px; align-items:center;height:23px;">
                    ${this.controls.render()} 
                </div>
            </div>
            
            <div class="frame-wrapper" style="flex: 1; overflow: auto; display: flex; align-items: flex-start; justify-content: center; padding: 18px 10px 10px 10px; position: relative; z-index: 1;">
                
                <div class="device-frame" style="
                    background: var(--bg-default); 
                    width: ${DeviceConfig.width}px; 
                    height: ${DeviceConfig.height}px; 
                    min-width: ${DeviceConfig.width}px; 
                    max-width: ${DeviceConfig.width}px;
                    min-height: ${DeviceConfig.height}px;
                    max-height: ${DeviceConfig.height}px;
                    border: 12px solid #333; 
                    border-radius: 24px; 
                    box-shadow: 0 20px 50px rgba(0,0,0,0.2); 
                    position: relative; 
                    flex-shrink: 0; 
                    overflow: hidden; 
                    display: flex; 
                    flex-direction: column;
                    color: var(--text-default);">
                    
                    ${cameraHtml}
                    
                    <div id="status-bar-container" style="height: 24px; width: 100%; position: absolute; top: 0; left: 0; z-index: 1000; pointer-events: none;"></div>

                    <div id="preview-root" style="flex: 1; width: 100%; overflow: auto; position: relative; background: var(--bg-default); color: var(--text-default); display: flex; flex-direction: column;">
                        <div style="padding: 20px; text-align: center; color: #888;">Loading...</div>
                    </div>
                </div>
            </div>
        `;

        this.$root = $content.querySelector('#preview-root');
        
        // Status Bar Attach
        const sbContainer = $content.querySelector('#status-bar-container');
        sbContainer.appendChild(this.statusBar.getElement());

        // Sidebar Attach Logic Added Here
        if (this.controls && this.controls.sidebar) {
            if (typeof this.controls.sidebar.attachTo === 'function') {
                this.controls.sidebar.attachTo($content);
            }
        }

        this.controls.bindEvents($content, (isDark) => {
            this.isDark = isDark;
            if(this.engine.context && this.engine.context.setDarkMode) {
                this.engine.context.setDarkMode(isDark);
            }
            this.updateThemeUI($content, isDark);
            this.manualRefresh();
        });

        $content.querySelector('#btn-refresh').onclick = () => this.manualRefresh();
        
       window.XHLP_PREVIEW_SCREEN  =  new EditorFile(`Preview`, {
            type: 'page', 
            content: $content, 
            id: 'js.xml.preview.engine',
            tabIcon: 'icon aid-xhlp-icon', 
            hideQuickTools: true ,
            stylesheets: [
                previewStyles || '', frameStyles , sideBarStyles , blueprintStyles
            ]
        });

        this.updateThemeUI($content, this.isDark); 

        this.observer = new ResizeObserver(() => this.manualRefresh());
        this.observer.observe($content.querySelector('.device-frame'));

        this.onSave = () => {
            if (editorManager.activeFile.uri === this.currentFileUri) this.manualRefresh();
        };
        editorManager.on('save-file', this.onSave);

        // Initialize logcat (will check if enabled and create/show accordingly)
        this._initLogcat($content);
        
        LogManager.d("PreviewEngine", "Engine Initialized successfully.");
        LogManager.i("DeviceConfig", `Device: ${DeviceConfig.width}x${DeviceConfig.height}`);
        
      this._initLogcat();
    }


    updateThemeUI(container, isDark) {
        const root = container; 
        // Shadow DOM root access (important!)
        const $previewRoot = container.querySelector('#preview-root') || this.$root;
        
        const viewMode = this.controls ? (this.controls.viewMode || 0) : 0;

        // console.group('[LayoutPreviewUI] updateThemeUI');
        // console.log(`Current ViewMode: ${viewMode} (0=Design, 1=Blue, 2=Hybrid)`);
        // console.log(`Target Element:`, $previewRoot);

        if (!$previewRoot) {
            console.warn('❌ #preview-root not found!');
            // console.groupEnd();
            return;
        }

        $previewRoot.classList.remove('blueprint-mode', 'blueprint-hybrid');
        // console.log('Classes Cleared');

        if (viewMode === 1) { 
            $previewRoot.classList.add('blueprint-mode');
            
            // Force Blue Theme Variables
            root.style.setProperty('--bg-default', '#1b4e8f');
            root.style.setProperty('--text-default', '#ffffff');
            root.style.setProperty('--btn-text-default', '#ffffff');
            this.statusBar.setTheme(true);

        } else if (viewMode === 2) {
            $previewRoot.classList.add('blueprint-hybrid');
            // console.log('Added class: .blueprint-hybrid');
            
            this._applyNormalTheme(root, isDark);

        } else {
            // console.log(' Applying Design Mode Theme');
            this._applyNormalTheme(root, isDark);
        }
        
        // console.log('Final Classes:', $previewRoot.className);
        // console.groupEnd();
    }

    _applyNormalTheme(root, isDark) {
        if (isDark) {
            root.style.setProperty('--bg-default', '#000000');
            root.style.setProperty('--text-default', '#ffffff'); 
            root.style.setProperty('--btn-text-default', '#ffffff');
            this.statusBar.setTheme(true);
        } else {
            root.style.setProperty('--bg-default', '#ffffff');
            root.style.setProperty('--text-default', '#000000'); 
            root.style.setProperty('--btn-text-default', '#000000');
            this.statusBar.setTheme(false);
        }
    }

    // Helper for normal theme application
    _applyNormalTheme(root, isDark) {
        if (isDark) {
            root.style.setProperty('--bg-default', '#000000');
            root.style.setProperty('--text-default', '#ffffff'); 
            root.style.setProperty('--btn-text-default', '#ffffff');
            this.statusBar.setTheme(true);
        } else {
            root.style.setProperty('--bg-default', '#ffffff');
            root.style.setProperty('--text-default', '#000000'); 
            root.style.setProperty('--btn-text-default', '#000000');
            this.statusBar.setTheme(false);
        }
    }

    manualRefresh() {
        if (!this.$root) return;
        const width = DeviceConfig.width;
        const height = DeviceConfig.height;
        
        const frame = this.$root.closest('.device-frame');
        if (frame) {
            frame.style.width = `${width}px`;
            frame.style.height = `${height}px`;
            frame.style.minWidth = `${width}px`;
            frame.style.maxWidth = `${width}px`;
            frame.style.minHeight = `${height}px`;
            frame.style.maxHeight = `${height}px`;
        }
        
        this.renderWithDimensions(width, height);
    }
    
    async renderWithDimensions(width, height) {
        if (!this.$root) return;
        
        // Clean previous render immediately
        this.$root.innerHTML = ''; 
        
        try {
            const xmlContent = editorManager.editor.getValue();
            
            const hasFitsTrue = xmlContent.match(/android:fitsSystemWindows\s*=\s*"true"/);
            const hasFitsFalse = xmlContent.match(/android:fitsSystemWindows\s*=\s*"false"/);
            const isFullScreen = xmlContent.match(/windowFullscreen\s*=\s*"true"/) || hasFitsFalse;

            let renderHeight = height;
            const isNormalMode = !isFullScreen && !hasFitsTrue;

            if (isNormalMode) {
                renderHeight = height - 24; 
            }

            const { html, statusBarColor } = await this.engine.render(xmlContent, width, renderHeight);
            
            this.$root.innerHTML = html;

            this.$root.style.height = '100%'; 
            this.$root.style.boxSizing = 'border-box';
            this.$root.style.display = 'flex';
            this.$root.style.flexDirection = 'column';
            this.$root.style.justifyContent = 'flex-start'; 

            if (isNormalMode) {
                this.$root.style.paddingTop = '24px'; 
            } else {
                this.$root.style.paddingTop = '0px';
            }

            const rootTagMatch = xmlContent.match(/<[^>]+xmlns:android[^>]*>/); 
            if (rootTagMatch) {
                const rootTagString = rootTagMatch[0];
                if (rootTagString.match(/android:layout_gravity\s*=\s*"[^"]*bottom[^"]*"/)) {
                    this.$root.style.justifyContent = 'flex-end'; 
                } 
                else if (rootTagString.match(/android:layout_gravity\s*=\s*"[^"]*center[^"]*"/)) {
                    this.$root.style.justifyContent = 'center'; 
                }
            }

            const scrim = this.$root.querySelector('.drawer-scrim');
            if (scrim) {
                scrim.onclick = () => this.closeAllDrawers(this.$root);
            }

            // Status Bar Color Logic
            const effectiveFullScreen = !!isFullScreen;
            const isBlueprint = this.controls && this.controls.showBlueprint;

            if (effectiveFullScreen) {
                this.statusBar.setBackground('transparent');
                setTimeout(() => { this._updateDynamicContrast(); }, 50);
            } else if (statusBarColor) {
                this.statusBar.setBackground(statusBarColor);
            } else {
                // Default Status Bar Colors
                if (isBlueprint) {
                    this.statusBar.setBackground('rgba(0,0,0,0.2)');
                } else {
                    this.statusBar.setBackground(this.isDark ? '#000000' : 'rgba(0,0,0,0.1)');
                }
            }

            // Force theme update after render to ensure variables are correct
            this.updateThemeUI(this.$root, this.isDark);
            
            if (isBlueprint) {
                setTimeout(() => {
                    const solver = window.__latestConstraintSolver;
                    this.blueprintRenderer.enableBlueprint(this.$root, solver);
                }, 50);
            }

        } catch (e) {
            this.showError(e);
        }
    }

    _updateDynamicContrast() {
        if (!this.$root) return;
        const frame = this.$root.closest('.device-frame');
        if (!frame) return;
        const rect = frame.getBoundingClientRect();
        const x = rect.left + 20; 
        const y = rect.top + 10; 
        const sbContainer = frame.querySelector('#status-bar-container');
        sbContainer.style.display = 'none';
        let element = document.elementFromPoint(x, y);
        sbContainer.style.display = 'block';
        let effectiveColor = 'rgba(0, 0, 0, 0)';
        while (element && element !== document.body) {
            const style = window.getComputedStyle(element);
            const bg = style.backgroundColor;
            if (bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
                effectiveColor = bg;
                break;
            }
            element = element.parentElement;
        }
        const isDark = this.statusBar._isColorDark(effectiveColor);
        this.statusBar.setTheme(isDark);
    }

    toggleDrawer(gravity = null) {
        const container = this.$root;
        if (!container) return;

        const openDrawer = Array.from(container.querySelectorAll('.android-drawer')).find(d => 
            d.style.transform === 'translateX(0%)' || d.style.transform === 'translateY(0%)'
        );

        if (!gravity) {
            if (openDrawer) {
                this.closeAllDrawers(container);
            } else {
                this.openSpecificDrawer(container, 'start');
            }
        } else {
            this.openSpecificDrawer(container, gravity);
        }
    }
    
    openSpecificDrawer(container, gravity) {
        let selector = '.drawer-start'; 
        if (gravity === 'end' || gravity === 'right') selector = '.drawer-end';
        if (gravity === 'bottom') selector = '.drawer-bottom';

        const drawer = container.querySelector(selector);
        const scrim = container.querySelector('.drawer-scrim');

        if (drawer) {
            if (gravity === 'bottom') drawer.style.transform = 'translateY(0%)';
            else if (gravity === 'end' || gravity === 'right') drawer.style.transform = 'translateX(0%)'; 
            else drawer.style.transform = 'translateX(0%)'; 

            if (scrim) {
                scrim.style.opacity = '1';
                scrim.style.pointerEvents = 'auto';
            }
        }
    }

    closeAllDrawers(container) {
        const drawers = container.querySelectorAll('.android-drawer');
        const scrim = container.querySelector('.drawer-scrim');
        
        drawers.forEach(d => {
            if (d.classList.contains('drawer-start')) d.style.transform = 'translateX(-100%)';
            if (d.classList.contains('drawer-end')) d.style.transform = 'translateX(100%)';
            if (d.classList.contains('drawer-bottom')) d.style.transform = 'translateY(100%)';
        });
        
        if (scrim) {
            scrim.style.opacity = '0';
            scrim.style.pointerEvents = 'none';
        }
    }

    showError(e) {
        if (this.$root) this.$root.innerHTML = '';
        
        this.$root.innerHTML = `
            <div style="padding: 20px; color: #D32F2F; font-family: monospace; background: #FFEBEE; height:100%;">
                <h3 style="margin-top:0;">🚫 Rendering Error</h3>
                <p>${e.message}</p>
                <div style="font-size:12px; background:#fff; padding:10px; border:1px solid #ffcdd2; margin-top:10px;">
                    ${e.stack ? e.stack.replace(/\n/g, '<br>') : ''}
                </div>
            </div>
        `;
    }
    
    _initLogcat(container) {
        // Check setting from LocalStorage
        const isLogcatEnabled = localStorage.getItem('aid_preview_logcat') !== 'false'; // Default true if null

        // Always create logcat instance if it doesn't exist
        // Clear logs before creating new logcat instance
        LogManager.clear();
        
        if (!this.logcat) {
            // Pass the root container where logcat should attach
            this.logcat = new LogcatUI(container);
        }
        
        // Show or hide based on setting
        if (isLogcatEnabled) {
            this.logcat.show();
        } else {
            this.logcat.hide();
        }
    }

    destroy() {
        try {
            if (this.onSave) editorManager.off('save-file', this.onSave);
            if (this.observer) this.observer.disconnect();
            if (this.logcat) {
                this.logcat.destroy();
                this.logcat = null;
            }
            if (this.$root && this.$root.parentNode) {
                this.$root.remove();
            }
        } catch (error) {
            console.error('Error destroying LayoutPreviewUI:', error);
        }
    }
}