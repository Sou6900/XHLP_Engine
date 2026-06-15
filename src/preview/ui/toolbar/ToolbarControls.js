import html2canvas from 'html2canvas';
import { svgs } from '../../../assets/icons/svg/svg.js';
import { DeviceConfig } from '../../device/DeviceConfig.js';
import { SideBar } from '../sidebar/SideBar.js';
import { LogManager } from '../../core/LogManager.js';

export class ToolbarControls {
    constructor(uiInstance) {
        this.ui = uiInstance;
        
        this.sidebar = new SideBar();
        
        window.__toolbarControls = this;
        
        // LOAD STATE FROM LOCALSTORAGE
        this.scale = parseFloat(localStorage.getItem('aid_preview_scale')) || 0.8;
        
        const savedRuler = localStorage.getItem('aid_preview_ruler');
        this.showRulers = savedRuler !== null ? savedRuler === 'true' : true; 

        this.showGrid = localStorage.getItem('aid_preview_grid') === 'true';
        this.isDark = localStorage.getItem('aid_preview_theme') === 'true';
        this.orientation = localStorage.getItem('aid_preview_orientation') || 'portrait';
        
        // Load Logcat state (default enabled)
        this.logcatEnabled = localStorage.getItem('aid_preview_logcat') !== 'false';
        
        // Blueprint Mode State load
        this.showBlueprint = localStorage.getItem('aid_preview_blueprint') === 'true';
        
        this.viewMode = parseInt(localStorage.getItem('aid_view_mode')) || 0;
        
        // Load Saved Device Dimensions
        const savedW = localStorage.getItem('aid_device_width');
        const savedH = localStorage.getItem('aid_device_height');
        
        if (savedW && savedH) {
            DeviceConfig.width = parseInt(savedW);
            DeviceConfig.height = parseInt(savedH);
        }

        this.themeBtn = null;
        this.menuOpen = false;
        
        // Will be assigned by LayoutPreviewUI
        this.blueprintRenderer = null;
    }

    render() {
        const themeIcon = this.isDark ? svgs.day : svgs.night;
        
        
        let blueprintColor = 'var(--primary-text-color)';
        if (this.viewMode === 1) blueprintColor = '#64C8FF'; // Blue
        else if (this.viewMode === 2) blueprintColor = '#AB47BC'; // Purple (Hybrid)
        
        // Use icons from svgs object
        const minusIcon = svgs.minus;
        const plusIcon = svgs.plus;
        const menuIcon = svgs.menuIcon; 
        const moreIcon = svgs.moreIcon || svgs.more; 
        const rotateIcon = svgs.rotateIcon || svgs.rotate; 
        const deviceIcon = svgs.deviceIcon || svgs.phone;
        const screenshotIcon = svgs.screenshotIcon || svgs.image;
        const exportIcon = svgs.exportIcon || svgs.upload || svgs.export;
        const settingsIcon = svgs.settingsIcon;
        const gridIcon = svgs.gridIcon || svgs.grid;
        const refreshIcon = svgs.refreshIcon;
        const copyIcon = svgs.copy || svgs.content_copy;
        const helpIcon = svgs.help || svgs.info;
        const rulerIcon = svgs.rulerIcon || svgs.ruler || '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/></svg>';
        
        const blueprintIcon = '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M3 5v14h18V5H3zm16 12H5V7h14v10zm-4-9h-2v2h2V8zm-4 4h-2v2h2v-2z"/></svg>';
        
        const sidebarIcon = '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><rect x="3" y="3" width="7" height="18" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/></svg>';
        
        const logcatIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 17l6-6-6-6M12 19h8"></path></svg>`;

        return `
            <div class="toolbar-group" style="display:flex; gap:6px; align-items:center; position: relative; color: var(--primary-text-color);">
                <button id="btn-sidebar" class="aid-icon-btn" title="Attributes Panel (Inspector)" 
                    style="border:none; background:transparent; cursor:pointer; padding:6px; border-radius:4px; display:flex; align-items:center; justify-content:center; color:var(--primary-text-color);">
                    ${sidebarIcon}
                </button>
                
                <button id="btn-menu" class="aid-icon-btn" title="Menu (More Options)" 
                    style="border:none; background:transparent; cursor:pointer; padding:6px; border-radius:4px; display:flex; align-items:center; justify-content:center; color:var(--primary-text-color);">
                    ${moreIcon}
                </button>

                <div id="toolbar-menu" style="
                    display: none;
                    position: absolute;
                    top: 100%;
                    left: 0;
                    margin-top: 4px;
                    background: var(--popup-background-color);
                    border: 1px solid var(--popup-border-color);
                    border-radius: 6px;
                    box-shadow: 0 4px 12px var(--box-shadow-color);
                    min-width: 240px;
                    z-index: 10000;
                    overflow: hidden;
                    color: var(--popup-text-color);
                    max-height: 80vh;
                    overflow-y: auto;
                ">
                    <div style="padding: 8px 12px; border-bottom: 1px solid var(--border-color); font-size: 11px; color: var(--secondary-text-color); font-weight: 600; text-transform: uppercase;">
                        Phone
                    </div>
                    <div class="menu-item" data-action="device-pixel7" style="padding: 8px 12px; cursor: pointer; font-size: 13px; display: flex; align-items: center; gap: 8px;">
                        <div style="width:18px;height:18px;fill:var(--popup-icon-color);">${deviceIcon}</div>
                        <span>Pixel 7 (412 × 915)</span>
                    </div>
                    <div class="menu-item" data-action="device-pixel6pro" style="padding: 8px 12px; cursor: pointer; font-size: 13px; display: flex; align-items: center; gap: 8px;">
                        <div style="width:18px;height:18px;fill:var(--popup-icon-color);">${deviceIcon}</div>
                        <span>Pixel 6 Pro (412 × 892)</span>
                    </div>
                    <div class="menu-item" data-action="device-pixel5" style="padding: 8px 12px; cursor: pointer; font-size: 13px; display: flex; align-items: center; gap: 8px;">
                        <div style="width:18px;height:18px;fill:var(--popup-icon-color);">${deviceIcon}</div>
                        <span>Pixel 5 (393 × 851)</span>
                    </div>
                    <div class="menu-item" data-action="device-pixel4a" style="padding: 8px 12px; cursor: pointer; font-size: 13px; display: flex; align-items: center; gap: 8px;">
                        <div style="width:18px;height:18px;fill:var(--popup-icon-color);">${deviceIcon}</div>
                        <span>Pixel 4a (393 × 851)</span>
                    </div>
                    <div class="menu-item" data-action="device-pixel3" style="padding: 8px 12px; cursor: pointer; font-size: 13px; display: flex; align-items: center; gap: 8px;">
                        <div style="width:18px;height:18px;fill:var(--popup-icon-color);">${deviceIcon}</div>
                        <span>Pixel 3 (393 × 786)</span>
                    </div>
                    <div class="menu-item" data-action="device-nexus6p" style="padding: 8px 12px; cursor: pointer; font-size: 13px; display: flex; align-items: center; gap: 8px;">
                        <div style="width:18px;height:18px;fill:var(--popup-icon-color);">${deviceIcon}</div>
                        <span>Nexus 6P (412 × 732)</span>
                    </div>
                    <div class="menu-item" data-action="device-nexus5" style="padding: 8px 12px; cursor: pointer; font-size: 13px; display: flex; align-items: center; gap: 8px;">
                        <div style="width:18px;height:18px;fill:var(--popup-icon-color);">${deviceIcon}</div>
                        <span>Nexus 5 (360 × 640)</span>
                    </div>

                    <div style="padding: 8px 12px; border-bottom: 1px solid var(--border-color); border-top: 1px solid var(--border-color); font-size: 11px; color: var(--secondary-text-color); font-weight: 600; text-transform: uppercase;">
                        Tablet & Other
                    </div>
                    <div class="menu-item" data-action="device-pixelc" style="padding: 8px 12px; cursor: pointer; font-size: 13px; display: flex; align-items: center; gap: 8px;">
                        <div style="width:18px;height:18px;fill:var(--popup-icon-color);">${deviceIcon}</div>
                        <span>Pixel C (900 × 1280)</span>
                    </div>
                    <div class="menu-item" data-action="device-nexus9" style="padding: 8px 12px; cursor: pointer; font-size: 13px; display: flex; align-items: center; gap: 8px;">
                        <div style="width:18px;height:18px;fill:var(--popup-icon-color);">${deviceIcon}</div>
                        <span>Nexus 9 (768 × 1024)</span>
                    </div>
                    <div class="menu-item" data-action="device-foldable" style="padding: 8px 12px; cursor: pointer; font-size: 13px; display: flex; align-items: center; gap: 8px;">
                        <div style="width:18px;height:18px;fill:var(--popup-icon-color);">${deviceIcon}</div>
                        <span>Foldable (673 × 841)</span>
                    </div>
                    
                    <div style="height: 1px; background: var(--border-color); margin: 4px 0;"></div>
                    
                    <div style="padding: 8px 12px; border-bottom: 1px solid var(--border-color); font-size: 11px; color: var(--secondary-text-color); font-weight: 600; text-transform: uppercase;">
                        View
                    </div>
                    <div class="menu-item" data-action="rotate" style="padding: 8px 12px; cursor: pointer; font-size: 13px; display: flex; align-items: center; gap: 8px;">
                        <div style="width:18px;height:18px;fill:var(--popup-icon-color);">${rotateIcon}</div>
                        <span>Rotate Device</span>
                        <span style="margin-left: auto; font-size: 11px; color: var(--secondary-text-color);">Ctrl+R</span>
                    </div>
                    <div class="menu-item" data-action="toggle-grid" style="padding: 8px 12px; cursor: pointer; font-size: 13px; display: flex; align-items: center; gap: 8px;">
                        <div style="width:18px;height:18px;fill:var(--popup-icon-color);">${gridIcon}</div>
                        <span>Show Grid</span>
                    </div>
                    
                    <div class="menu-item" data-action="toggle-rulers" style="padding: 8px 12px; cursor: pointer; font-size: 13px; display: flex; align-items: center; gap: 8px;">
                        <div style="width:18px;height:18px;fill:var(--popup-icon-color);">${rulerIcon}</div>
                        <span>Show Rulers</span>
                    </div>
                    
                    <div class="menu-item" data-action="toggle-blueprint" style="padding: 8px 12px; cursor: pointer; font-size: 13px; display: flex; align-items: center; gap: 8px;">
                        <div style="width:18px;height:18px;fill:var(--popup-icon-color);">${blueprintIcon}</div>
                        <span>Blueprint Mode <sup style="color:#3e711f;">beta</sup></span>
                        <span id="blueprint-indicator" style="margin-left:auto; font-size:14px; color: ${this.showBlueprint ? '#64C8FF' : 'var(--secondary-text-color)'}">${this.showBlueprint ? '●' : '○'}</span>
                    </div>
                    
                    
                    <div class="menu-item" data-action="toggle-logcat" style="padding: 8px 12px; cursor: pointer; font-size: 13px; display: flex; align-items: center; gap: 8px;">
                        ${logcatIcon} 
                        <span>Toggle Logcat</span>
                        <span id="logcat-indicator" style="margin-left:auto; font-size:14px; color: ${this.logcatEnabled ? '#6A8759' : '#FF6B68'}">${this.logcatEnabled ? '●' : '○'}</span>
                    </div>
                    
                    <div style="height: 1px; background: var(--border-color); margin: 4px 0;"></div>
                    
                    <div style="padding: 8px 12px; border-bottom: 1px solid var(--border-color); font-size: 11px; color: var(--secondary-text-color); font-weight: 600; text-transform: uppercase;">
                        Actions
                    </div>
                    <div class="menu-item" data-action="screenshot" style="padding: 8px 12px; cursor: pointer; font-size: 13px; display: none; align-items: center; gap: 8px;">
                        <div style="width:18px;height:18px;fill:var(--popup-icon-color);">${screenshotIcon}</div>
                        <span>Take Screenshot</span>
                    </div>
                    <div style="display:none;" class="menu-item" data-action="export-html" style="padding: 8px 12px; cursor: pointer; font-size: 13px; display: flex; align-items: center; gap: 8px;">
                        <div style="width:18px;height:18px;fill:var(--popup-icon-color);">${exportIcon}</div>
                        <span>Export as HTML</span>
                    </div>
                    <div class="menu-item" data-action="copy-xml" style="padding: 8px 12px; cursor: pointer; font-size: 13px; display: flex; align-items: center; gap: 8px;">
                        <div style="width:18px;height:18px;fill:var(--popup-icon-color);">${copyIcon}</div>
                        <span>Copy XML</span>
                    </div>
                    
                    <div style="height: 1px; background: var(--border-color); margin: 4px 0;"></div>
                    
                    <div class="menu-item" data-action="settings" style="padding: 8px 12px; cursor: pointer; font-size: 13px; display: flex; align-items: center; gap: 8px;">
                        <div style="width:18px;height:18px;fill:var(--popup-icon-color);">${settingsIcon}</div>
                        <span>Settings</span>
                    </div>
                    <div class="menu-item" data-action="help" style="padding: 8px 12px; cursor: pointer; font-size: 13px; display: flex; align-items: center; gap: 8px;">
                        <div style="width:18px;height:18px;fill:var(--popup-icon-color);">${helpIcon}</div>
                        <span>Help & Shortcuts</span>
                    </div>
                </div>

                <div style="width:1px; height:18px; background:var(--border-color); margin:0 4px;"></div>

                <button id="btn-toggle-drawer" class="aid-icon-btn" title="Toggle Navigation Drawer" 
                    style="border:none; background:transparent; cursor:pointer; padding:6px; border-radius:4px; display:flex; align-items:center; justify-content:center; color:var(--primary-text-color);">
                    ${menuIcon}
                </button>

                <button id="btn-refresh" class="aid-icon-btn" title="Refresh Layout (F5)" 
                    style="border:none; background:transparent; cursor:pointer; padding:6px; border-radius:4px; display:flex; align-items:center; justify-content:center; color:var(--primary-text-color);">
                    ${refreshIcon}
                </button>

                <div style="width:1px; height:18px; background:var(--border-color); margin:0 4px;"></div>

                <button id="btn-zoom-out" class="aid-icon-btn" title="Zoom Out (Ctrl + -)" 
                    style="border:none; background:transparent; cursor:pointer; padding:6px; border-radius:4px; display:flex; align-items:center; justify-content:center; color:var(--primary-text-color);">
                    ${minusIcon}
                </button>
                
                <span id="zoom-level" style="font-size:12px; min-width:40px; text-align:center; font-weight:500; font-variant-numeric: tabular-nums; user-select:none; color:var(--primary-text-color);">
                    100%
                </span>
                
                <button id="btn-zoom-in" class="aid-icon-btn" title="Zoom In (Ctrl + +)" 
                    style="border:none; background:transparent; cursor:pointer; padding:6px; border-radius:4px; display:flex; align-items:center; justify-content:center; color:var(--primary-text-color);">
                    ${plusIcon}
                </button>
                
                <div style="width:1px; height:18px; background:var(--border-color); margin:0 6px;"></div>
                
                <button id="btn-theme" class="aid-icon-btn" title="Toggle Theme (Ctrl + T)" 
                    style="outline:none; border:none; background:transparent; cursor:pointer; padding:6px; border-radius:4px; display:flex; align-items:center; justify-content:center; color:var(--primary-text-color);">
                    ${themeIcon}
                </button>
                
                <button id="btn-rotate" class="aid-icon-btn" title="Rotate Device (Ctrl + R)" 
                    style="border:none; background:transparent; cursor:pointer; padding:6px; border-radius:4px; display:flex; align-items:center; justify-content:center; color:var(--primary-text-color);">
                    ${rotateIcon}
                </button>
                
                <button id="btn-blueprint" class="aid-icon-btn" title="Toggle View Mode (Design / Blueprint / Hybrid)" 
            style="border:none; background:transparent; cursor:pointer; padding:6px; border-radius:4px; display:flex; align-items:center; justify-content:center; color:${blueprintColor};">
            ${blueprintIcon}
        </button>

                <button id="btn-screenshot" class="aid-icon-btn" title="Screenshot (Ctrl + S)" 
                    style="border:none; background:transparent; cursor:pointer; padding:6px; border-radius:4px; display:none; align-items: center; justify-content:center; color:var(--primary-text-color);">
                    ${screenshotIcon}
                </button>
            </div>
        `;
    }

    bindEvents(domRoot, onThemeChange) {
        this.themeBtn = domRoot.querySelector('#btn-theme');
        const zoomInBtn = domRoot.querySelector('#btn-zoom-in');
        const zoomOutBtn = domRoot.querySelector('#btn-zoom-out');
        const drawerBtn = domRoot.querySelector('#btn-toggle-drawer');
        const refreshBtn = domRoot.querySelector('#btn-refresh');
        const rotateBtn = domRoot.querySelector('#btn-rotate');
        // const logcatBtn = domRoot.querySelector('#btn-toggle-logcat');
        
        const blueprintBtn = domRoot.querySelector('#btn-blueprint');
        const screenshotBtn = domRoot.querySelector('#btn-screenshot');
        const menuBtn = domRoot.querySelector('#btn-menu');
        const menu = domRoot.querySelector('#toolbar-menu');
        const sidebarBtn = domRoot.querySelector('#btn-sidebar');
        this.blueprintIndicator = domRoot.querySelector('#blueprint-indicator');
        this.blueprintBtn = domRoot.querySelector('#btn-blueprint');
        
        this.zoomLabel = domRoot.querySelector('#zoom-level');
        this.menuElement = menu;
        
        setTimeout(() => {
            this.updateZoom(0);
            if (this.showRulers) { this.showRulers = false; this.toggleRulers(); }
            if (this.showGrid) { this.showGrid = false; this.toggleGrid(); }
            if (this.orientation === 'landscape') { this.orientation = 'portrait'; this.rotateDevice(); }
            
            if (this.showBlueprint) {
                if(this.ui && this.ui.$root) {
                    this.toggleBlueprint(true);
                }
            }
        }, 100);

        // Zoom
        if (zoomInBtn) zoomInBtn.onclick = () => this.updateZoom(0.1);
        if (zoomOutBtn) zoomOutBtn.onclick = () => this.updateZoom(-0.1);
        
        // Drawer
        if (drawerBtn) drawerBtn.onclick = () => this.ui && this.ui.toggleDrawer?.();

        // Refresh
        if (refreshBtn) refreshBtn.onclick = () => this.ui && this.ui.manualRefresh?.();

        // Rotate
        if (rotateBtn) rotateBtn.onclick = () => this.rotateDevice();
        
        // Blueprint 
        if (blueprintBtn) blueprintBtn.onclick = () => this.toggleBlueprint();
        
        // Sidebar Toggle
        if (sidebarBtn) {
            sidebarBtn.onclick = () => {
                if (this.sidebar.isOpen) {
                    this.sidebar.close();
                } else {
                    const viewId = window.__selectedViewId || window.__lastInspectedView;
                    if (viewId) {
                        const data = this.buildInspectorData(viewId);
                        this.sidebar.open(data);
                    } else {
                        this.sidebar.open(null);
                        window.toast('Select a view to see details', 2000);
                    }
                }
            };
        }
        
        // Screenshot
        if (screenshotBtn) screenshotBtn.onclick = () => this.takeScreenshot();
        
        // Theme
        if (this.themeBtn) {
            this.themeBtn.onclick = () => {
                this.toggleTheme();
                if (onThemeChange) onThemeChange(this.isDark); 
            };
        }

        // Menu toggle
        if (menuBtn) {
            menuBtn.onclick = (e) => {
                e.stopPropagation();
                this.toggleMenu();
            };
        }

        // Menu items
        if (menu) {
            menu.querySelectorAll('.menu-item').forEach(item => {
                item.onclick = (e) => {
                    e.stopPropagation();
                    const action = item.dataset.action;
                    this.handleMenuAction(action);
                    this.closeMenu();
                };
                item.onmouseenter = () => item.style.background = 'var(--popup-active-color)';
                item.onmouseleave = () => item.style.background = 'transparent';
            });
        }

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.menuOpen && !menu.contains(e.target) && e.target !== menuBtn) {
                this.closeMenu();
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'r') { e.preventDefault(); this.rotateDevice(); }
            if (e.ctrlKey && e.key === 't') { e.preventDefault(); this.themeBtn.click(); }
            if (e.key === 'F5') { e.preventDefault(); this.ui?.manualRefresh?.(); }
            if (e.ctrlKey && (e.key === '=' || e.key === '+')) { e.preventDefault(); this.updateZoom(0.1); }
            if (e.ctrlKey && (e.key === '-' || e.key === '_')) { e.preventDefault(); this.updateZoom(-0.1); }
        });
    }
    
    _save(key, value) {
        localStorage.setItem(key, value);
    }

    toggleMenu() {
        this.menuOpen = !this.menuOpen;
        if (this.menuElement) this.menuElement.style.display = this.menuOpen ? 'block' : 'none';
    }

    closeMenu() {
        this.menuOpen = false;
        if (this.menuElement) this.menuElement.style.display = 'none';
    }
    
    toggleLogcat() {
        // Check if logcat exists
        if (!this.ui || !this.ui.logcat) {
            console.error('Logcat not initialized');
            window.toast('⚠️ Logcat not available', 1000);
            this.toggleMenu();
            return;
        }
        
        try {
            // Toggle visibility
            const isVisible = this.ui.logcat.toggleVisibility();
            
            // Update internal state
            this.logcatEnabled = isVisible;
            
            // Save state to localStorage
            localStorage.setItem('aid_preview_logcat', isVisible ? 'true' : 'false');
            
            // Update indicator in menu
            const indicator = document.querySelector('#logcat-indicator');
            if (indicator) {
                indicator.textContent = isVisible ? '●' : '○';
                indicator.style.color = isVisible ? '#6A8759' : '#FF6B68';
            }
            
            // If hiding (disabling), clear all existing logs
            if (!isVisible) {
                LogManager.clear();
                if (this.ui.logcat && this.ui.logcat.logListEl) {
                    this.ui.logcat.logListEl.innerHTML = '';
                    if (typeof this.ui.logcat.updateLogCount === 'function') {
                        this.ui.logcat.updateLogCount();
                    }
                }
                window.toast('🚫 Logcat Disabled (Logging Stopped)', 1500);
            } else {
                window.toast('✅ Logcat Enabled (Logging Active)', 1500);
            }
        } catch (error) {
            console.error('Error toggling logcat:', error);
            window.toast('⚠️ Error toggling logcat', 1000);
        }
        
        this.toggleMenu();
    }
    

    handleMenuAction(action) {
        switch (action) {
            case 'device-pixel7': this.setDevice(412, 915, 'Pixel 7'); break;
            case 'device-pixel6pro': this.setDevice(412, 892, 'Pixel 6 Pro'); break;
            case 'device-pixel5': this.setDevice(393, 851, 'Pixel 5'); break;
            case 'device-pixel4a': this.setDevice(393, 851, 'Pixel 4a'); break;
            case 'device-pixel3': this.setDevice(393, 786, 'Pixel 3'); break;
            case 'device-nexus6p': this.setDevice(412, 732, 'Nexus 6P'); break;
            case 'device-nexus5': this.setDevice(360, 640, 'Nexus 5'); break;
            case 'device-pixelc': this.setDevice(900, 1280, 'Pixel C'); break;
            case 'device-nexus9': this.setDevice(768, 1024, 'Nexus 9'); break;
            case 'device-foldable': this.setDevice(673, 841, 'Foldable'); break;
            
            case 'rotate': this.rotateDevice(); break;
            case 'toggle-grid': this.toggleGrid(); break;
            case 'toggle-rulers': this.toggleRulers(); break;
            case 'toggle-blueprint': this.toggleBlueprint(); break;
            case 'toggle-logcat': this.toggleLogcat(); break;
            case 'screenshot': this.takeScreenshot(); break;
            case 'export-html': this.exportHTML(); break;
            case 'copy-xml': this.copyXML(); break;
            case 'settings': this.openSettings(); break;
            case 'help': this.showHelp(); break;
        }
    }

    setDevice(width, height, name) {
        if (this.orientation === 'landscape') {
            [width, height] = [height, width];
        }
        
        DeviceConfig.width = width;
        DeviceConfig.height = height;
        
        // Save to local storage
        this._save('aid_device_width', width);
        this._save('aid_device_height', height);

        const frame = this.ui.$root ? this.ui.$root.closest('.device-frame') : null;
        if (frame) {
            frame.style.width = width + 'px';
            frame.style.height = height + 'px';
        }
        this.ui?.manualRefresh?.();
        window.toast(`Device: ${name} (${width}×${height})`, 2000);
    }

    rotateDevice() {
        this.orientation = this.orientation === 'portrait' ? 'landscape' : 'portrait';
        this._save('aid_preview_orientation', this.orientation);
        const temp = DeviceConfig.width;
        DeviceConfig.width = DeviceConfig.height;
        DeviceConfig.height = temp;
        
        // Also update saved dimensions to match rotation
        this._save('aid_device_width', DeviceConfig.width);
        this._save('aid_device_height', DeviceConfig.height);

        const frame = this.ui.$root?.closest('.device-frame');
        if (frame) {
            frame.style.width = DeviceConfig.width + 'px';
            frame.style.height = DeviceConfig.height + 'px';
            this.orientation === 'landscape' ? frame.classList.add('landscape') : frame.classList.remove('landscape');
        }
        this.ui?.manualRefresh?.();
    }

    toggleGrid() {
        this.showGrid = !this.showGrid;
        this._save('aid_preview_grid', this.showGrid);
        const root = this.ui.$root;
        if (this.showGrid) {
            if (!root.querySelector('.grid-overlay')) {
                const gridColor = 'var(--border-color)'; 
                const grid = document.createElement('div');
                grid.className = 'grid-overlay';
                grid.style.cssText = `position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-image: linear-gradient(${gridColor} 1px, transparent 1px), linear-gradient(90deg, ${gridColor} 1px, transparent 1px); background-size: 20px 20px; pointer-events: none; z-index: 9999; opacity: 0.5;`;
                root.appendChild(grid);
            }
        } else {
            root.querySelector('.grid-overlay')?.remove();
        }
    }

    toggleRulers() {
        this.showRulers = !this.showRulers;
        this._save('aid_preview_ruler', this.showRulers);
        const wrapper = this.ui.$root ? this.ui.$root.closest('.frame-wrapper') : null;
        if (!wrapper) return;
        const parent = wrapper.parentElement; 
        const toolbar = parent.querySelector('.preview-toolbar');

        if (this.showRulers) {
            if (!parent.querySelector('.ruler-container')) {
                const rulerBg = 'var(--popup-background-color)';
                const tickColor = 'var(--border-color)';
                const textColor = 'var(--secondary-text-color)';
                
                const topOffset = toolbar ? toolbar.offsetHeight : 0;
                const container = document.createElement('div');
                container.className = 'ruler-container';
                container.style.cssText = `position: absolute; top: ${topOffset}px; left: 0; width: 100%; height: calc(100% - ${topOffset}px); pointer-events: none; z-index: 100; overflow: hidden;`;
                const hRuler = document.createElement('div');
                hRuler.style.cssText = `position: absolute; top: 0; left: 15px; width: calc(100% - 15px); height: 15px; background-color: ${rulerBg}; border-bottom: 1px solid ${tickColor}; background-image: repeating-linear-gradient(90deg, ${tickColor} 0, ${tickColor} 1px, transparent 1px, transparent 10px), repeating-linear-gradient(90deg, ${tickColor} 0, ${tickColor} 1px, transparent 1px, transparent 50px); background-size: 100% 4px, 100% 8px; background-repeat: repeat-x; background-position: bottom; font-family: 'Roboto Mono', monospace; font-size: 8px; color: ${textColor};`;
                hRuler.innerHTML = `<span style="position:absolute; left:2px; top:2px;">0</span><span style="position:absolute; left:52px; top:2px;">50</span><span style="position:absolute; left:102px; top:2px;">100</span><span style="position:absolute; left:202px; top:2px;">200</span><span style="position:absolute; left:302px; top:2px;">300</span>`;
                const vRuler = document.createElement('div');
                vRuler.style.cssText = `position: absolute; top: 15px; left: 0; width: 15px; height: calc(100% - 15px); background-color: ${rulerBg}; border-right: 1px solid ${tickColor}; background-image: repeating-linear-gradient(0deg, ${tickColor} 0, ${tickColor} 1px, transparent 1px, transparent 10px), repeating-linear-gradient(0deg, ${tickColor} 0, ${tickColor} 1px, transparent 1px, transparent 50px); background-size: 4px 100%, 8px 100%; background-repeat: repeat-y; background-position: right; font-family: 'Roboto Mono', monospace; font-size: 8px; color: ${textColor};`;
                vRuler.innerHTML = `<span style="position:absolute; top:2px; right:2px;">0</span><span style="position:absolute; top:52px; right:2px;">50</span><span style="position:absolute; top:102px; right:2px;">100</span><span style="position:absolute; top:202px; right:2px;">200</span><span style="position:absolute; top:402px; right:2px;">400</span>`;
                const corner = document.createElement('div');
                corner.style.cssText = `position: absolute; top: 0; left: 0; width: 15px; height: 15px; background-color: ${rulerBg}; border-right: 1px solid ${tickColor}; border-bottom: 1px solid ${tickColor}; z-index: 101;`;
                container.appendChild(hRuler); container.appendChild(vRuler); container.appendChild(corner);
                parent.appendChild(container);
            }
        } else {
            parent.querySelector('.ruler-container')?.remove();
        }
    }


    
    toggleBlueprint(forceState = null) {
        console.group('🔘 [Toolbar] toggleBlueprint');
        
        // 1. Current State Check
        console.log(`Before Toggle -> ViewMode: ${this.viewMode}`);

        // 2. Cycle Logic (0 -> 1 -> 2 -> 0)
        if (forceState !== null) {
            this.viewMode = typeof forceState === 'boolean' ? (forceState ? 1 : 0) : parseInt(forceState);
        } else {
            // If undefined, start at 0
            const current = this.viewMode || 0;
            this.viewMode = (current + 1) % 3;
        }
        
        // Save State
        this._save('aid_view_mode', this.viewMode);
        this.showBlueprint = this.viewMode !== 0; 
        this._save('aid_preview_blueprint', this.showBlueprint);

        // RESET SIDEBAR AUTO-OPEN WHEN MODE CHANGES
        // If switching TO Blueprint/Hybrid, reset the suppression
        if (this.viewMode !== 0 && this.sidebar) {
            this.sidebar.resetAutoOpen();
            console.log('Sidebar auto-open reset.');
        }

        console.log(`After Toggle -> New ViewMode: ${this.viewMode}`);

        // 3. Update Button UI
        let btnColor = 'var(--primary-text-color)';
        let msg = 'Design Mode';

        if (this.viewMode === 1) { 
            btnColor = '#64C8FF'; 
            msg = 'Blueprint Mode';
        } else if (this.viewMode === 2) { 
            btnColor = '#AB47BC'; 
            msg = 'Hybrid Mode';
        }

        if (this.blueprintBtn) this.blueprintBtn.style.color = btnColor;
        if (this.blueprintIndicator) {
            this.blueprintIndicator.textContent = (this.viewMode === 0) ? '○' : (this.viewMode === 1 ? '●' : '◑');
            this.blueprintIndicator.style.color = btnColor;
        }

        // 4. Trigger Layout Update
        if (this.ui && this.ui.$root) {
            const $root = this.ui.$root;
            
            // Renderer Enable/Disable Logic
            if (this.viewMode === 0) {
                if (this.blueprintRenderer) {
                    console.log('Disabling Renderer');
                    this.blueprintRenderer.disableBlueprint($root);
                }
            } else {
                if (this.blueprintRenderer) {
                    console.log('Enabling Renderer');
                    const solver = window.__latestConstraintSolver; 
                    this.blueprintRenderer.enableBlueprint($root, solver);
                }
            }

            // FORCE UI UPDATE
            if (this.ui.updateThemeUI) {
                console.log('Calling ui.updateThemeUI()...');
                const container = this.ui.$root.closest('.frame-wrapper') || this.ui.$root.parentElement;
                this.ui.updateThemeUI(container, this.isDark);
            }
        }

        window.toast(msg, 2000);
        console.groupEnd();
    }

    async takeScreenshot() {
        const frame = this.ui.$root ? this.ui.$root.closest('.device-frame') : null;
        if (!frame) { window.toast('⚠️ Nothing to capture!', 2000); return; }
        try {
            window.toast(' Capturing...', 1000);
            const canvas = await html2canvas(frame, { 
              useCORS: true, 
              allowTaint: true, 
              backgroundColor: null, 
              scale: 2, logging: false, 
              ignoreElements: (element) => { 
                if (element.tagName === 'CANVAS') { 
                  if (element.id === 'monitor-timeline' || element.classList.contains('metric-canvas')) return true; 
                } 
                  if (element.id === 'toolbar-menu' || element.classList.contains('aid-icon-btn')) return true; return false; 
              } 
            });
            canvas.toBlob((blob) => { 
              if (!blob) throw new Error('Canvas is empty'); 
              const url = URL.createObjectURL(blob); 
              const a = document.createElement('a'); 
              a.href = url; 
              a.download = `android-preview-${Date.now()}.png`; document.body.appendChild(a); 
              a.click(); 
              document.body.removeChild(a); 
              URL.revokeObjectURL(url); 
              window.toast('Screenshot Saved!', 2000); }, 'image/png');
        } catch (e) { 
          console.error('Screenshot Error:', e); window.toast('❌ Screenshot Failed: Check Console', 3000); 
        }
    }

    exportHTML() {
        const html = this.ui.$root ? this.ui.$root.innerHTML : '';
        const blob = new Blob([html], { 
          type: 'text/html' 
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = `export-${Date.now()}.html`; a.click(); URL.revokeObjectURL(url); window.toast('HTML exported!', 2000);
    }

    copyXML() {
        const xml = editorManager.editor.getValue();
        navigator.clipboard.writeText(xml).then(() => { window.toast('XML copied to clipboard!', 2000); });
    }

    openSettings() { 
      window.toast('Settings panel coming soon!', 2000); 
    }
    showHelp() { 
      alert(`Keyboard Shortcuts:\n• Ctrl+R - Rotate device\n• Ctrl+T - Toggle theme\n• Ctrl+\` - Toggle Logcat\n• F5 - Refresh layout\n• Ctrl+ +/- - Zoom in/out`); 
    }
    
    updateZoom(delta) {
        this.scale = Math.max(0.4, Math.min(3.0, this.scale + delta)); 
        this._save('aid_preview_scale', this.scale);
        const frame = this.ui.$root ? this.ui.$root.closest('.device-frame') : null;
        if(frame) { 
          frame.style.transform = `scale(${this.scale})`; frame.style.transformOrigin = 'top center'; frame.style.transition = 'transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)'; 
        }
        if (this.zoomLabel) this.zoomLabel.innerText = `${Math.round(this.scale * 100)}%`;
    }

    toggleTheme() {
        this.isDark = !this.isDark;
        if (this.themeBtn) {
            this.themeBtn.innerHTML = this.isDark ? svgs.day : svgs.night;
        }
    }

    // INSPECTOR DATA BUILDER
    buildInspectorData(viewId) {
        const solver = window.__latestConstraintSolver;
        if (!solver || !solver.nodeMap) return null;
        
        const state = solver.nodeMap.get(viewId);
        if (!state) return null;
        
        const attr = state.node?.attributes || {};
        const helper = solver.helper;
        const viewType = state.node?.type ? state.node.type.split('.').pop() : 'View';
        
        // --- Helpers ---
        const getAttr = (name) => attr[name] || attr[`android:${name}`] || attr[`app:${name}`];
        const parsePx = (val) => {
            if (!val) return 0;
            if (typeof val === 'number') return val;
            return parseFloat(String(val).replace(/[^\d.-]/g, '')) || 0;
        };
        const formatFloat = (val) => typeof val === 'number' ? val.toFixed(2) : val;

        //The OBJECT
        const data = {
            // Identity
            meta: {
                id: viewId,
                type: viewType,
                tag: state.node?.tagName || viewType,
                index: state.node?.index || 0,
                parentId: state.node?.parent?.attributes?.id?.replace('@+id/', '') || 'root'
            },

            // Geometry (Computed)
            bounds: {
                x: Math.round(state.x || 0),
                y: Math.round(state.y || 0),
                width: Math.round(state.w || 0),
                height: Math.round(state.h || 0),
                right: Math.round((state.x || 0) + (state.w || 0)),
                bottom: Math.round((state.y || 0) + (state.h || 0)),
                baselineY: state.baseline ? Math.round(state.y + state.baseline) : 'N/A'
            },

            // Dimensions (Declared)
            dimensions: {
                layout_width: getAttr('layout_width') || 'wrap_content',
                layout_height: getAttr('layout_height') || 'wrap_content',
                minWidth: getAttr('minWidth'),
                maxWidth: getAttr('maxWidth'),
                minHeight: getAttr('minHeight'),
                maxHeight: getAttr('maxHeight'),
                ratio: getAttr('layout_constraintDimensionRatio')
            },

            // Constraints (The Web)
            constraints: {
                // Horizontal
                startToStart: getAttr('layout_constraintStart_toStartOf'),
                startToEnd: getAttr('layout_constraintStart_toEndOf'),
                endToStart: getAttr('layout_constraintEnd_toStartOf'),
                endToEnd: getAttr('layout_constraintEnd_toEndOf'),
                leftToLeft: getAttr('layout_constraintLeft_toLeftOf'),
                leftToRight: getAttr('layout_constraintLeft_toRightOf'),
                rightToLeft: getAttr('layout_constraintRight_toLeftOf'),
                rightToRight: getAttr('layout_constraintRight_toRightOf'),
                
                // Vertical
                topToTop: getAttr('layout_constraintTop_toTopOf'),
                topToBottom: getAttr('layout_constraintTop_toBottomOf'),
                bottomToTop: getAttr('layout_constraintBottom_toTopOf'),
                bottomToBottom: getAttr('layout_constraintBottom_toBottomOf'),
                
                // Alignment
                baselineToBaseline: getAttr('layout_constraintBaseline_toBaselineOf'),
                centerXToCenterX: getAttr('layout_constraintCenterX_toCenterX'),
                centerYToCenterY: getAttr('layout_constraintCenterY_toCenterY'),
                
                // Bias
                horizontalBias: formatFloat(parseFloat(getAttr('layout_constraintHorizontal_bias')) || 0.5),
                verticalBias: formatFloat(parseFloat(getAttr('layout_constraintVertical_bias')) || 0.5),
                
                // Chain
                horizontalChainStyle: getAttr('layout_constraintHorizontal_chainStyle') || 'spread',
                verticalChainStyle: getAttr('layout_constraintVertical_chainStyle') || 'spread',
                horizontalWeight: getAttr('layout_constraintHorizontal_weight'),
                verticalWeight: getAttr('layout_constraintVertical_weight'),
                inHorizontalChain: !!state.inHorizontalChain,
                inVerticalChain: !!state.inVerticalChain,

                // Circular
                circleConstraint: getAttr('layout_constraintCircle'),
                circleRadius: getAttr('layout_constraintCircleRadius'),
                circleAngle: getAttr('layout_constraintCircleAngle')
            },

            //️ Spacing
            spacing: {
                // Margins
                margin: getAttr('layout_margin'),
                marginStart: getAttr('layout_marginStart') || getAttr('layout_marginLeft'),
                marginEnd: getAttr('layout_marginEnd') || getAttr('layout_marginRight'),
                marginTop: getAttr('layout_marginTop'),
                marginBottom: getAttr('layout_marginBottom'),
                
                // Gone Margins (Advanced)
                goneMarginStart: getAttr('layout_goneMarginStart'),
                goneMarginEnd: getAttr('layout_goneMarginEnd'),
                goneMarginTop: getAttr('layout_goneMarginTop'),
                goneMarginBottom: getAttr('layout_goneMarginBottom'),

                // Padding
                padding: getAttr('padding'),
                paddingStart: getAttr('paddingStart') || getAttr('paddingLeft'),
                paddingEnd: getAttr('paddingEnd') || getAttr('paddingRight'),
                paddingTop: getAttr('paddingTop'),
                paddingBottom: getAttr('paddingBottom'),
                paddingVertical: getAttr('paddingVertical'),
                paddingHorizontal: getAttr('paddingHorizontal')
            },

            // Appearance & Transforms
            appearance: {
                visibility: getAttr('visibility') || 'visible',
                alpha: getAttr('alpha') || '1.0',
                elevation: getAttr('elevation') || '0dp',
                background: getAttr('background'),
                backgroundTint: getAttr('backgroundTint'),
                foreground: getAttr('foreground'),
                
                // Transforms
                rotation: getAttr('rotation') || '0',
                rotationX: getAttr('rotationX'),
                rotationY: getAttr('rotationY'),
                scaleX: getAttr('scaleX') || '1',
                scaleY: getAttr('scaleY') || '1',
                translationX: getAttr('translationX') || '0',
                translationY: getAttr('translationY') || '0',
                pivotX: getAttr('pivotX'),
                pivotY: getAttr('pivotY')
            },

            // Specific Properties (Conditional)
            attributes: {}, // Will be filled below
            
            //️ Helper Status
            flags: {
                isGuideline: !!state.isGuideline,
                isBarrier: !!state.node?.type?.includes('Barrier'),
                isFlow: !!state.node?.type?.includes('Flow'),
                isGone: !!state.isGone
            }
        };

        // --- SPECIFIC ATTRIBUTE INJECTION ---

        // TextView / Button / EditText
        if (viewType.includes('Text') || viewType.includes('Button') || viewType === 'EditText') {
            data.attributes.text = {
                text: getAttr('text'),
                textSize: getAttr('textSize') || '14sp',
                textColor: getAttr('textColor'),
                textStyle: getAttr('textStyle') || 'normal',
                fontFamily: getAttr('fontFamily'),
                gravity: getAttr('gravity') || 'top|start',
                lines: getAttr('lines'),
                maxLines: getAttr('maxLines'),
                minLines: getAttr('minLines'),
                ellipsize: getAttr('ellipsize'),
                letterSpacing: getAttr('letterSpacing'),
                lineSpacingExtra: getAttr('lineSpacingExtra'),
                textAllCaps: getAttr('textAllCaps'),
                hint: getAttr('hint'),
                textColorHint: getAttr('textColorHint'),
                inputType: getAttr('inputType'),
                drawableStart: getAttr('drawableStart'),
                drawableEnd: getAttr('drawableEnd'),
                drawableTop: getAttr('drawableTop'),
                drawableBottom: getAttr('drawableBottom'),
                drawablePadding: getAttr('drawablePadding')
            };
        }

        //️ ImageView
        if (viewType.includes('Image')) {
            data.attributes.image = {
                src: getAttr('src'),
                scaleType: getAttr('scaleType'),
                tint: getAttr('tint'),
                adjustViewBounds: getAttr('adjustViewBounds'),
                cropToPadding: getAttr('cropToPadding')
            };
        }

        // Guideline
        if (state.isGuideline) {
            data.attributes.guideline = {
                orientation: getAttr('orientation'),
                percent: getAttr('layout_constraintGuide_percent'),
                begin: getAttr('layout_constraintGuide_begin'),
                end: getAttr('layout_constraintGuide_end')
            };
        }

        // Barrier
        if (data.flags.isBarrier) {
            data.attributes.barrier = {
                direction: getAttr('barrierDirection'),
                referencedIds: getAttr('constraint_referenced_ids'),
                allowsGoneWidget: getAttr('barrierAllowsGoneWidgets')
            };
        }

        // Flow
        if (data.flags.isFlow) {
            data.attributes.flow = {
                referencedIds: getAttr('constraint_referenced_ids'),
                wrapMode: getAttr('flow_wrapMode'),
                maxElementsWrap: getAttr('flow_maxElementsWrap'),
                horizontalStyle: getAttr('flow_horizontalStyle'),
                verticalStyle: getAttr('flow_verticalStyle'),
                horizontalGap: getAttr('flow_horizontalGap'),
                verticalGap: getAttr('flow_verticalGap'),
                horizontalBias: getAttr('flow_horizontalBias'),
                verticalBias: getAttr('flow_verticalBias'),
                firstHorizontalStyle: getAttr('flow_firstHorizontalStyle'),
                lastHorizontalStyle: getAttr('flow_lastHorizontalStyle')
            };
        }

        // LinearLayout
        if (viewType === 'LinearLayout') {
            data.attributes.linear = {
                orientation: getAttr('orientation'),
                weightSum: getAttr('weightSum'),
                gravity: getAttr('gravity')
            };
        }
        
        // ScrollView
        if (viewType.includes('ScrollView')) {
            data.attributes.scroll = {
                fillViewport: getAttr('fillViewport'),
                scrollbars: getAttr('scrollbars')
            };
        }
        
        // ProgressBar
        if (viewType.includes('Progress')) {
            data.attributes.progress = {
                progress: getAttr('progress'),
                max: getAttr('max'),
                indeterminate: getAttr('indeterminate'),
                progressTint: getAttr('progressTint')
            };
        }

        // CardView
        if (viewType.includes('Card')) {
            data.attributes.card = {
                cardCornerRadius: getAttr('cardCornerRadius'),
                cardElevation: getAttr('cardElevation'),
                cardBackgroundColor: getAttr('cardBackgroundColor'),
                contentPadding: getAttr('contentPadding')
            };
        }

        return data;
    }
}