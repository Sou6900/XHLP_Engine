/**
* EventManager.js
* Handles user interaction events (click, scroll) in blueprintmode
*/

import { LogManager } from '../../../core/LogManager.js';
import { openInspectorSidebar } from '../../../ui/sidebar/SideBar.js';

export class EventManager {
    constructor(renderer) {
        this.renderer = renderer;
        this.isScrolling = false;
        this.scrollTimeout = null;
        
        this._clickHandler = (e) => this.handleClick(e);
        this._scrollHandler = (e) => this.handleScroll(e);
    }

    attach(rootElement) {
        if (!rootElement) {
            LogManager.e('EventManager', 'Failed to attach: Root element is null.');
            return;
        }
        
        rootElement.removeEventListener('click', this._clickHandler);
        rootElement.addEventListener('click', this._clickHandler);
        
        // Optional: Enable scroll tracking
        // rootElement.removeEventListener('scroll', this._scrollHandler);
        // rootElement.addEventListener('scroll', this._scrollHandler, { passive: true });
        
        LogManager.d('EventManager', 'Event listeners attached to root.');
    }

    detach(rootElement) {
        if (!rootElement) return;
        
        rootElement.removeEventListener('click', this._clickHandler);
        rootElement.removeEventListener('scroll', this._scrollHandler);
        LogManager.d('EventManager', 'Event listeners detached.');
    }

    
    handleClick(e) {
        const targetView = e.target.closest('.android-view') || 
                          e.target.closest('.android-layout');
        
        if (!targetView || targetView === this.renderer.rootElement) {
            LogManager.v('EventManager', 'Click on background/root. Deselecting view.');
            this.renderer.selectedId = null;
            window.__selectedViewId = null;
            
            // Background click doesn't respect suppression, it should always clear selection
            // But i don't necessarily need to close sidebar if user wants it open.
            // For now, let's keep standard behavior or just do nothing ui wise.
        } else {
            const rawId = targetView.getAttribute('id');
            const cleanId = rawId ? rawId.replace(/@\+?id\//, '') : null;
            
            this.renderer.selectedId = cleanId;
            
            if (cleanId) {
                LogManager.i('EventManager', `View Selected: ${cleanId}`);
                
                // CHECK SUPPRESSION FLAG
                const toolbar = window.__toolbarControls;
                const sidebar = toolbar ? toolbar.sidebar : null;
                
                // Only open if sidebar exists AND suppression is FALSE
                // OR if the sidebar is ALREADY OPEN (allow switching views)
                const shouldOpen = sidebar && (!sidebar.suppressAutoOpen || sidebar.isOpen);

                if (shouldOpen) {
                    if (typeof openInspectorSidebar === 'function') {
                        openInspectorSidebar(cleanId); 
                    } else {
                        // Fallback logic
                        if(sidebar) {
                            const data = toolbar.buildInspectorData(cleanId);
                            sidebar.open(data);
                        }
                    }
                } else {
                    LogManager.d('EventManager', 'Sidebar auto-open suppressed by user.');
                }
                
                // Also inspect in Logcat (Always happens)
                this.inspectView(cleanId);
            } else {
                LogManager.w('EventManager', 'Clicked view has no ID.');
            }
        }
        
        this.renderer.draw();
    }

    handleScroll(e) {
        if (this.isScrolling) return;
        
        this.isScrolling = true;
        window.requestAnimationFrame(() => {
            this.renderer.draw();
            this.isScrolling = false;
        });
    }

    inspectView(id) {
        if (!this.renderer.constraintData) return;
        
        const data = this.renderer.constraintData.get(id);
        if (!data) {
            LogManager.w('EventManager', `No constraint data found for ID: ${id}`);
            return;
        }
        
        // console.group(`%c Inspector: ${id}`, 'color: #00E5FF; font-weight: bold;');
        console.log(data);
        console.groupEnd();
        
        // Log brief info to Logcat
        LogManager.d('Inspector', `Inspecting [${id}]: ${data.widthMode} x ${data.heightMode} (${Math.round(data.w)}x${Math.round(data.h)})`);
    }
}