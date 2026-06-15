import { LogManager } from '../core/LogManager.js';
import {svgs} from '../../assets/icons/svg/svg.js';

export class LogcatUI {
    constructor(rootElement) {
        this.root = rootElement;
        this.isExpanded = false;
        this.isVisible = true;
        this.isFullscreen = false;
        LogManager.clear();
        this.filterText = '';
        this.selectedLevel = 'I'; // ALL, D, I, W, E
        this.autoScroll = true;
        this.height = 250; // Resizable height
        this.isDragging = false;
        this.render();
    }

    render() {
        const container = document.createElement('div');
        container.className = 'logcat-container';
        container.style.cssText = `
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 35px;
            background: var(--secondary-color);
            border-top: 1px solid var(--border-color);
            display: flex;
            flex-direction: column;
            transition: height 0.2s ease;
            z-index: 99999;
            font-family: 'JetBrains Mono', 'Consolas', 'Monaco', monospace;
            box-shadow: 0 -2px 10px var(--box-shadow-color);
            color: var(--primary-text-color);
        `;

        // 1. Drag Handle (for resizing)
        const dragHandle = document.createElement('div');
        dragHandle.className = 'logcat-drag-handle';
        dragHandle.style.cssText = `
            height: 12px; /* Increased hit area for touch */
            background: var(--secondary-color);
            cursor: ns-resize;
            position: relative;
            transition: background 0.2s;
            border-bottom: 1px solid var(--border-color);
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        dragHandle.innerHTML = `
            <div style="
                width: 40px;
                height: 4px;
                background: var(--border-color);
                border-radius: 2px;
            "></div>
        `;

        // 2. Toolbar (Header)
        const header = document.createElement('div');
        header.style.cssText = `
            height: 31px;
            display: flex;
            align-items: center;
            padding: 0 12px;
            background: var(--secondary-color);
            color: var(--secondary-text-color);
            border-bottom: 1px solid var(--border-color);
            gap: 8px;
            overflow-x: auto;
            flex-shrink: 0;
        `;
        
        header.innerHTML = `
            <!-- Title -->
            <div class="aid-logcat-btn-toggle" style="display: flex; align-items: center; gap: 6px; min-width: 80px; color: var(--primary-text-color);">
               ${svgs.cat}
                <span style="font-size: 12px; font-weight: 600;">Logcat</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="6 9 12 15 18 9"/>
            </div>

            <!-- Level Filter -->
            <div style="display: flex; gap: 4px; border-left: 1px solid var(--border-color); padding-left: 8px;">
                <button class="level-btn" data-level="ALL" style="
                    background: transparent; border: none; color: var(--active-text-color); padding: 4px 8px;
                    font-size: 11px; border-radius: 3px; cursor: pointer; font-weight: 600;
                    transition: all 0.2s;
                " title="Show All">ALL</button>
                
                <button class="level-btn" data-level="D" style="
                    background: transparent; border: none; color: var(--secondary-text-color); padding: 4px 8px;
                    font-size: 11px; border-radius: 3px; cursor: pointer;
                    transition: all 0.2s;
                " title="Debug">D</button>
                
                <button class="level-btn" data-level="I" style="
                    background: var(--active-color); border: none; color: #6A8759; padding: 4px 8px;
                    font-size: 11px; border-radius: 3px; cursor: pointer;
                    transition: all 0.2s;
                " title="Info">I</button>
                
                <button class="level-btn" data-level="W" style="
                    background: transparent; border: none; color: #BBB529; padding: 4px 8px;
                    font-size: 11px; border-radius: 3px; cursor: pointer;
                    transition: all 0.2s;
                " title="Warning">W</button>
                <button class="level-btn" data-level="E" style="
                    background: transparent; border: none; color: #FF6B68; padding: 4px 8px;
                    font-size: 11px; border-radius: 3px; cursor: pointer;
                    transition: all 0.2s;
                " title="Error">E</button>
            </div>

            <!-- Search Input -->
            <input type="text" id="log-search" placeholder="Filter logs (Ctrl+F)..." style="
                background: var(--primary-color);
                border: 1px solid var(--border-color);
                color: var(--primary-text-color);
                padding: 4px 8px;
                font-size: 11px;
                border-radius: 3px;
                flex: 1;
                max-width: 200px;
                outline: none;
                transition: border-color 0.2s;
                height:23px;
            ">

            <!-- Spacer -->
            <div style="flex: 1;"></div>

            <!-- Auto-scroll Toggle -->
            <button id="btn-autoscroll" style="
                background: var(--active-color);
                border: none;
                color: var(--active-text-color);
                padding: 4px 8px;
                font-size: 11px;
                border-radius: 3px;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 4px;
                transition: all 0.2s;
            " title="Auto-scroll (Ctrl+End)">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="7 13 12 18 17 13"/>
                    <polyline points="7 6 12 11 17 6"/>
                </svg>
                <span style="font-size: 10px;">Auto</span>
            </button>

            <!-- Copy All -->
            <button id="btn-copy-all" class="icon-btn" style="
                background: none;
                border: none;
                color: var(--secondary-text-color);
                cursor: pointer;
                padding: 4px;
                display: flex;
                align-items: center;
                transition: color 0.2s;
            " title="Copy All Logs (Ctrl+C)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                </svg>
            </button>

            <!-- Clear Logs -->
            <button id="btn-clear-log" class="icon-btn" style="
                background: none;
                border: none;
                color: var(--secondary-text-color);
                cursor: pointer;
                padding: 4px;
                display: flex;
                align-items: center;
                transition: color 0.2s;
            " title="Clear All (Ctrl+L)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                </svg>
            </button>

            <!-- Fullscreen Toggle -->
            <button id="btn-fullscreen" class="icon-btn" style="
                background: none;
                border: none;
                color: var(--secondary-text-color);
                cursor: pointer;
                padding: 4px;
                display: flex;
                align-items: center;
                transition: color 0.2s;
            " title="Fullscreen (F11)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
                </svg>
            </button>

            <!-- Collapse/Expand Toggle -->
         <!--   <button id="btn-toggle-log" class="icon-btn aid-logcat-btn-toggle" style="
                background: none;
                border: none;
                color: var(--secondary-text-color);
                cursor: pointer;
                padding: 4px;
                display: flex;
                align-items: center;
                transition: transform 0.3s, color 0.2s;
            " title="Toggle Panel (Ctrl+\`)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="6 9 12 15 18 9"/>
                </svg>
            </button> -->
        `;

        // 3. Log List (Scrollable Area)
        const logList = document.createElement('div');
        logList.id = 'log-list';
        logList.style.cssText = `
            flex: 1;
            overflow-y: auto;
            overflow-x: hidden;
            background: var(--primary-color);
            padding: 8px;
            font-size: 11px;
            line-height: 1.5;
            display: none;
            scroll-behavior: smooth;
            position: relative;
        `;

        // 4. Status Bar
        const statusBar = document.createElement('div');
        statusBar.id = 'log-status';
        statusBar.style.cssText = `
            height: 20px;
            display: none;
            align-items: center;
            padding: 0 12px;
            background: var(--secondary-color);
            color: var(--secondary-text-color);
            font-size: 10px;
            border-top: 1px solid var(--border-color);
            justify-content: space-between;
            flex-shrink: 0;
        `;
        statusBar.innerHTML = `
            <span id="log-count">0 logs</span>
            <span id="log-filtered" style="display: none;">Filtered</span>
        `;

        container.appendChild(dragHandle);
        container.appendChild(header);
        container.appendChild(logList);
        container.appendChild(statusBar);
        this.root.appendChild(container);

        // Store references
        this.logListEl = logList;
        this.containerEl = container;
        this.headerEl = header;
        this.statusBarEl = statusBar;
        this.dragHandleEl = dragHandle;
        this.toggleBtn = container.querySelector('.aid-logcat-btn-toggle');
        this.cat = container.querySelector('#aid-cat-logo');
        this.fullscreenBtn = container.querySelector('#btn-fullscreen');
        this.autoScrollBtn = container.querySelector('#btn-autoscroll');
        this.searchInput = container.querySelector('#log-search');
        this.logCountEl = statusBar.querySelector('#log-count');

        this.attachEvents();
        this.applyStyles();
    }

    attachEvents() {
        // Toggle expand/collapse
        this.toggleBtn.onclick = () => this.toggle();

        // Fullscreen toggle
        this.fullscreenBtn.onclick = () => this.toggleFullscreen();

        // Auto-scroll toggle
        this.autoScrollBtn.onclick = () => {
            this.autoScroll = !this.autoScroll;
            this.autoScrollBtn.style.background = this.autoScroll ? 'var(--active-color)' : 'transparent';
            this.autoScrollBtn.style.color = this.autoScroll ? 'var(--active-text-color)' : 'var(--secondary-text-color)';
        };

        // Clear logs
        this.containerEl.querySelector('#btn-clear-log').onclick = () => {
            LogManager.clear();
            this.logListEl.innerHTML = '';
            this.updateLogCount();
        };

        // Copy all logs
        this.containerEl.querySelector('#btn-copy-all').onclick = () => this.copyAllLogs();

        // Search filter
        this.searchInput.oninput = (e) => {
            this.filterText = e.target.value.toLowerCase();
            this.filterLogs();
        };

        // Level filter buttons
        this.containerEl.querySelectorAll('.level-btn').forEach(btn => {
            btn.onclick = () => {
                this.selectedLevel = btn.dataset.level;
                this.containerEl.querySelectorAll('.level-btn').forEach(b => {
                    b.style.background = 'transparent';
                    b.style.color = 'var(--secondary-text-color)';
                    b.style.fontWeight = 'normal';
                });
                btn.style.background = 'var(--active-color)';
                btn.style.color = 'var(--active-text-color)';
                btn.style.fontWeight = '600';
                this.filterLogs();
            };
        });

        // Unified Drag Logic (Mouse + Touch)
        
        const startDrag = (y) => {
            this.isDragging = true;
            this.startY = y;
            this.startHeight = this.height;
            // Disable transition for immediate response
            this.containerEl.style.transition = 'none';
            document.body.style.cursor = 'ns-resize';
            document.body.style.userSelect = 'none';
        };

        const onDragMove = (y) => {
            if (!this.isDragging) return;
            const delta = this.startY - y;
            // Limit height: Min 100px, Max 80% of window height
            const maxHeight = window.innerHeight * 0.8;
            this.height = Math.max(100, Math.min(maxHeight, this.startHeight + delta));
            
            if (this.isExpanded && !this.isFullscreen) {
                this.containerEl.style.height = this.height + 'px';
            }
        };

        const endDrag = () => {
            if (this.isDragging) {
                this.isDragging = false;
                // Re-enable transition
                this.containerEl.style.transition = 'height 0.2s ease';
                document.body.style.cursor = '';
                document.body.style.userSelect = '';
            }
        };

        // Mouse Events
        this.dragHandleEl.addEventListener('mousedown', (e) => startDrag(e.clientY));
        document.addEventListener('mousemove', (e) => {
            if(this.isDragging) {
                e.preventDefault(); // Prevent text selection
                onDragMove(e.clientY);
            }
        });
        document.addEventListener('mouseup', endDrag);

        // Touch Events (Passive: false needed to prevent scrolling if we want)
        this.dragHandleEl.addEventListener('touchstart', (e) => {
            startDrag(e.touches[0].clientY);
        }, { passive: false });

        document.addEventListener('touchmove', (e) => {
            if(this.isDragging) {
                e.preventDefault(); // Prevent page scrolling while resizing
                onDragMove(e.touches[0].clientY);
            }
        }, { passive: false });

        document.addEventListener('touchend', endDrag);


        // Drag handle hover effect
        this.dragHandleEl.onmouseenter = () => {
            this.dragHandleEl.style.background = 'var(--active-color)';
        };
        this.dragHandleEl.onmouseleave = () => {
            this.dragHandleEl.style.background = 'var(--secondary-color)';
        };

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Ctrl+` - Toggle
            if (e.ctrlKey && e.key === '`') {
                e.preventDefault();
                this.toggle();
            }
            // Ctrl+L - Clear
            if (e.ctrlKey && e.key === 'l') {
                e.preventDefault();
                LogManager.clear();
                this.logListEl.innerHTML = '';
            }
            // Ctrl+F - Focus search
            if (e.ctrlKey && e.key === 'f' && this.isExpanded) {
                e.preventDefault();
                this.searchInput.focus();
            }
            // Ctrl+C - Copy (when logcat focused)
            if (e.ctrlKey && e.key === 'c' && this.isExpanded && document.activeElement !== this.searchInput) {
                e.preventDefault();
                this.copyAllLogs();
            }
            // F11 - Fullscreen
            if (e.key === 'F11') {
                e.preventDefault();
                this.toggleFullscreen();
            }
            // Ctrl+End - Toggle auto-scroll
            if (e.ctrlKey && e.key === 'End') {
                e.preventDefault();
                this.autoScrollBtn.click();
            }
        });

        // Live Log Update Listener
        LogManager.subscribe((log, isClear) => {
            if (isClear) {
                this.logListEl.innerHTML = '';
                this.updateLogCount();
                return;
            }
            this.appendLog(log);
        });

        // Button hover effects for icon buttons
        this.containerEl.querySelectorAll('.icon-btn').forEach(btn => {
            btn.onmouseenter = () => btn.style.color = 'var(--primary-text-color)';
            btn.onmouseleave = () => btn.style.color = 'var(--secondary-text-color)';
        });
    }

    toggle() {
        this.isExpanded = !this.isExpanded;
        if (this.isExpanded) {
            this.containerEl.style.height = this.isFullscreen ? '100%' : this.height + 'px';
            this.logListEl.style.display = 'block';
            this.statusBarEl.style.display = 'flex';
            this.toggleBtn.style.transform = 'rotate(180deg)';
            this.cat.style.transform = 'rotate(180deg)';
            this.updateLogCount();
        } else {
            this.containerEl.style.height = '35px';
            this.logListEl.style.display = 'none';
            this.statusBarEl.style.display = 'none';
            this.toggleBtn.style.transform = 'rotate(0deg)';
            this.cat.style.transform = 'rotate(0deg)';
        }
    }

    toggleFullscreen() {
        this.isFullscreen = !this.isFullscreen;
        if (this.isFullscreen) {
            this.containerEl.style.height = '100%';
            this.containerEl.style.width = '100%';
            this.containerEl.style.left = '0';
            this.containerEl.style.bottom = '0';
            this.fullscreenBtn.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/>
                </svg>
            `;
        } else {
            this.containerEl.style.height = this.isExpanded ? this.height + 'px' : '35px';
            this.containerEl.style.width = '100%';
            this.fullscreenBtn.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
                </svg>
            `;
        }
    }
    
    toggleVisibility() {
        this.isVisible = !this.isVisible;
        if (this.containerEl) {
            this.containerEl.style.display = this.isVisible ? 'flex' : 'none';
        }
        return this.isVisible;
    }
    
    show() {
        this.isVisible = true;
        if (this.containerEl) {
            this.containerEl.style.display = 'flex';
        }
    }
    
    hide() {
        this.isVisible = false;
        if (this.containerEl) {
            this.containerEl.style.display = 'none';
        }
    }
    
    destroy() {
        try {
            if (this.containerEl && this.containerEl.parentNode) {
                this.containerEl.remove();
            }
            // Unsubscribe with defensive check
            if (this.appendLog) {
                LogManager.unsubscribe(this.appendLog);
            }
        } catch (error) {
            console.error('Error destroying LogcatUI:', error);
        }
    }

    appendLog(log) {
        if (!this.logListEl) return;

        // Color coding
        const colors = {
            'D': 'var(--secondary-text-color)', // Debug - Using variable for better theme adaptation
            'I': '#6A8759', // Info - Keep Green
            'W': '#BBB529', // Warn - Keep Yellow
            'E': '#FF6B68', // Error - Keep Red
            'V': 'var(--secondary-text-color)' // Verbose
        };

        const row = document.createElement('div');
        row.className = 'log-row';
        row.dataset.level = log.level;
        row.dataset.tag = log.tag.toLowerCase();
        row.dataset.msg = log.msg.toLowerCase();
        
        row.style.cssText = `
            color: ${colors[log.level] || 'var(--primary-text-color)'};
            white-space: pre-wrap;
            font-family: 'JetBrains Mono', 'Consolas', monospace;
            padding: 4px 8px;
            border-bottom: 1px solid var(--border-color);
            cursor: pointer;
            transition: background 0.1s;
            font-size: 11px;
        `;
        
        row.onmouseenter = () => row.style.background = 'var(--active-color)';
        row.onmouseleave = () => row.style.background = 'transparent';
        row.onclick = () => this.copyLogRow(log);
        
        // Format: Time PID Level/Tag: Message
        row.innerHTML = `<span style="color: var(--secondary-text-color);">${log.time}</span> <span style="color: var(--secondary-text-color);">${log.pid}</span> <span style="color: ${colors[log.level]}; font-weight: 600;">${log.level}/${log.tag}:</span> <span style="color: var(--primary-text-color);">${this.escapeHtml(log.msg)}</span>`;

        this.logListEl.appendChild(row);
        
        // Apply filter
        if (this.selectedLevel !== 'ALL' && log.level !== this.selectedLevel) {
            row.style.display = 'none';
        }
        if (this.filterText && !log.msg.toLowerCase().includes(this.filterText) && !log.tag.toLowerCase().includes(this.filterText)) {
            row.style.display = 'none';
        }

        // Auto scroll
        if (this.autoScroll) {
            this.logListEl.scrollTop = this.logListEl.scrollHeight;
        }

        this.updateLogCount();
    }

    filterLogs() {
        const rows = this.logListEl.querySelectorAll('.log-row');
        let visibleCount = 0;
        
        rows.forEach(row => {
            const matchLevel = this.selectedLevel === 'ALL' || row.dataset.level === this.selectedLevel;
            const matchText = !this.filterText || 
                             row.dataset.msg.includes(this.filterText) || 
                             row.dataset.tag.includes(this.filterText);
            
            if (matchLevel && matchText) {
                row.style.display = '';
                visibleCount++;
            } else {
                row.style.display = 'none';
            }
        });

        const filteredEl = this.statusBarEl.querySelector('#log-filtered');
        if (this.selectedLevel !== 'ALL' || this.filterText) {
            filteredEl.style.display = 'inline';
            filteredEl.textContent = `${visibleCount} / ${rows.length} logs`;
        } else {
            filteredEl.style.display = 'none';
        }
    }

    updateLogCount() {
        const total = this.logListEl.querySelectorAll('.log-row').length;
        this.logCountEl.textContent = `${total} log${total !== 1 ? 's' : ''}`;
    }

    copyLogRow(log) {
        const text = `${log.time} ${log.pid} ${log.level}/${log.tag}: ${log.msg}`;
        navigator.clipboard.writeText(text).then(() => {
            this.showToast('Log copied!');
        });
    }

    copyAllLogs() {
        const rows = Array.from(this.logListEl.querySelectorAll('.log-row:not([style*="display: none"])'));
        const text = rows.map(row => row.textContent.trim()).join('\n');
        
        navigator.clipboard.writeText(text).then(() => {
            this.showToast(`${rows.length} logs copied to clipboard!`);
        });
    }

    showToast(message) {
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 60px;
            right: 20px;
            background: var(--popup-background-color);
            color: var(--popup-text-color);
            padding: 10px 16px;
            border-radius: 4px;
            font-size: 12px;
            z-index: 10000;
            box-shadow: 0 4px 10px var(--box-shadow-color);
            border: 1px solid var(--popup-border-color);
            animation: slideIn 0.3s ease;
        `;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    applyStyles() {
        if (!document.querySelector('#logcat-animations')) {
            const style = document.createElement('style');
            style.id = 'logcat-animations';
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
                #log-search:focus {
                    border-color: var(--link-text-color) !important;
                    outline: none;
                }
                .logcat-container::-webkit-scrollbar {
                    width: 10px;
                }
                .logcat-container::-webkit-scrollbar-track {
                    background: var(--secondary-color);
                }
                .logcat-container::-webkit-scrollbar-thumb {
                    background: var(--scrollbar-color);
                    border-radius: 5px;
                }
                .logcat-container::-webkit-scrollbar-thumb:hover {
                    background: var(--active-color);
                }
            `;
            document.head.appendChild(style);
        }
    }
}