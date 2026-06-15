// SideBar.js

import { ConstraintWidgetRenderer } from './ConstraintWidgetRenderer.js';

export class SideBar {
    constructor() {
        this.isOpen = false;
        this.selectedViewData = null;
        this.sidebarElement = null;
        
        this.constraintRenderer = new ConstraintWidgetRenderer();
        
        this.suppressAutoOpen = false;
        
        this.expandedSections = {
            id: true,
            layout: true,
            common: true,
            transform: false,
            text: true,
            image: true,
            progress: true,
            linear: true
        };
        
        // Resize Variables (Width - Left Edge)
        this.isResizingWidth = false;
        this.startX = 0;
        this.startWidth = 0;

        // Resize Variables (Height - Top Edge)
        this.isResizingHeight = false;
        this.startY = 0;
        this.startTop = 0;
        
        // Load Saved Width
        const savedWidth = localStorage.getItem('aid_sidebar_width');
        this.currentWidth = savedWidth ? parseInt(savedWidth) : 250; 

        this.isCollapsed = localStorage.getItem('aid_sidebar_collapsed') === 'true';
        
        // Load saved 'top' positions for both states
        const savedCollapsedTop = localStorage.getItem('aid_sidebar_collapsed_top');
        this.collapsedTop = savedCollapsedTop ? parseInt(savedCollapsedTop) : null; // If null, defaults to 60%
        
        this.init();
    }

    init() {
        this.createSidebarDOM();
        this.attachEventListeners();
        
        // Apply initial vertical position
        this.updateVerticalPosition(false); 
    }

    createSidebarDOM() {
        this.sidebarElement = document.createElement('div');
        this.sidebarElement.id = 'attributes-sidebar';
        this.sidebarElement.className = 'attributes-sidebar hidden';
        
        // Apply Saved Width
        this.sidebarElement.style.width = `${this.currentWidth}px`;
        this.sidebarElement.style.minWidth = '280px'; 
        this.sidebarElement.style.maxWidth = '80vw';

        this.sidebarElement.innerHTML = `
            <div class="resize-handle-left" title="Drag to resize width"></div>
            <div style="height:3px !important;" class="resize-handle-top" title="Drag to resize height">
                <div class="resize-handle-visual"></div>
            </div>

            <div class="sidebar-header">
                <button class="sidebar-toggle-btn" title="Toggle Height">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </button>

                <div class="sidebar-title">Attributes</div>
                
                <button class="sidebar-close" title="Close">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
            
            <div class="sidebar-content">
                <div class="empty-state" style="padding: 20px; color: #888; text-align: center; display: none;">
                    Select a view to inspect properties
                </div>
                <div class="sidebar-data-container"></div>
            </div>
        `;
    }

    attachTo(parentElement) {
        if (parentElement && this.sidebarElement) {
            parentElement.appendChild(this.sidebarElement);
        } else {
            document.body.appendChild(this.sidebarElement);
        }
    }

    attachEventListeners() {
        const widthHandle = this.sidebarElement.querySelector('.resize-handle-left');
        const startWidthHandler = (e) => { e.preventDefault(); e.stopPropagation(); this.startResizeWidth(e); };
        widthHandle.addEventListener('mousedown', startWidthHandler);
        widthHandle.addEventListener('touchstart', startWidthHandler, { passive: false });

        const heightHandle = this.sidebarElement.querySelector('.resize-handle-top');
        const startHeightHandler = (e) => { e.preventDefault(); e.stopPropagation(); this.startResizeHeight(e); };
        heightHandle.addEventListener('mousedown', startHeightHandler);
        heightHandle.addEventListener('touchstart', startHeightHandler, { passive: false });

        this._moveHandler = (e) => this.resize(e);
        this._upHandler = () => this.stopResize();

        document.addEventListener('mousemove', this._moveHandler);
        document.addEventListener('mouseup', this._upHandler);
        document.addEventListener('touchmove', this._moveHandler, { passive: false });
        document.addEventListener('touchend', this._upHandler);

        const closeBtn = this.sidebarElement.querySelector('.sidebar-close');
        if (closeBtn) {
            const closeHandler = (e) => { 
                e.stopPropagation(); e.preventDefault(); 
                this.suppressAutoOpen = true;
                this.close(); 
            };
            closeBtn.addEventListener('click', closeHandler);
            closeBtn.addEventListener('touchend', closeHandler);
        }

        const toggleBtn = this.sidebarElement.querySelector('.sidebar-toggle-btn');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.isCollapsed = !this.isCollapsed;
                localStorage.setItem('aid_sidebar_collapsed', this.isCollapsed);
                this.updateVerticalPosition(true);
            });
        }
    }

    resetAutoOpen() {
        this.suppressAutoOpen = false;
    }

    //Helper to get dynamic top offset based on Acode settings
    _getTopOffset() {
        let topPx = 55; // Default (Fullscreen)
        try {
            if (typeof acode !== 'undefined') {
                const settings = acode.require('settings');
                // Check fullscreen setting
                if (settings && settings.value) {
                    topPx = settings.value.fullscreen ? 55 : 77;
                }
            }
        } catch (e) {
            console.warn('[SideBar] Error reading Acode settings:', e);
        }
        return topPx;
    }

    // Use saved position logic & Dynamic Top
    updateVerticalPosition(animate = true) {
        if (!this.sidebarElement) return;
        const toggleBtn = this.sidebarElement.querySelector('.sidebar-toggle-btn');
        
        if (this.isCollapsed) {
            // If we have a saved user preference for collapsed state, use it.
            // Otherwise default to 60%
            if (this.collapsedTop !== null) {
                this.sidebarElement.style.top = `${this.collapsedTop}px`;
            } else {
                this.sidebarElement.style.top = '60%';
            }
            if(toggleBtn) toggleBtn.classList.add('collapsed');
        } else {
            // Expanded state is always full height (minus header/toolbar)
            const topPx = this._getTopOffset();
            this.sidebarElement.style.top = `${topPx}px`; 
            if(toggleBtn) toggleBtn.classList.remove('collapsed');
        }
    }

    // --- Resize Logic ---
    getClientX(e) { return e.touches ? e.touches[0].clientX : e.clientX; }
    getClientY(e) { return e.touches ? e.touches[0].clientY : e.clientY; }
    
    startResizeWidth(e) {
        this.isResizingWidth = true;
        this.startX = this.getClientX(e);
        this.startWidth = this.sidebarElement.getBoundingClientRect().width;
        document.body.style.cursor = 'col-resize'; 
        this.sidebarElement.classList.add('resizing');
    }

    startResizeHeight(e) {
        this.isResizingHeight = true;
        this.startY = this.getClientY(e);
        this.startTop = this.sidebarElement.offsetTop;
        document.body.style.cursor = 'ns-resize'; 
        this.sidebarElement.classList.add('resizing');
    }
    
    resize(e) {
        if (!this.isResizingWidth && !this.isResizingHeight) return;
        if (e.type === 'touchmove') e.preventDefault();
        
        if (this.isResizingWidth) {
            const delta = this.startX - this.getClientX(e);
            const newWidth = this.startWidth + delta;
            if (newWidth > 200 && newWidth < window.innerWidth * 0.9) {
                this.sidebarElement.style.width = `${newWidth}px`;
                this.currentWidth = newWidth;
            }
        }

        // Save Height Logic
        if (this.isResizingHeight) {
            const delta = this.getClientY(e) - this.startY;
            let newTop = this.startTop + delta;
            
            // Constraints
            // Dynamic Min Top based on settings
            const minTop = this._getTopOffset(); 
            const maxTop = window.innerHeight - 100;

            if (newTop >= minTop && newTop <= maxTop) {
                this.sidebarElement.style.top = `${newTop}px`;
                
                // Smart Collapse Detection
                // If dragged below 50% of screen, consider it collapsed
                if (newTop > window.innerHeight * 0.5) {
                    this.isCollapsed = true;
                    this.collapsedTop = newTop; // Update the preferred collapsed position
                    const toggleBtn = this.sidebarElement.querySelector('.sidebar-toggle-btn');
                    if(toggleBtn) toggleBtn.classList.add('collapsed');
                } else {
                    this.isCollapsed = false;
                    const toggleBtn = this.sidebarElement.querySelector('.sidebar-toggle-btn');
                    if(toggleBtn) toggleBtn.classList.remove('collapsed');
                }
            }
        }
    }
    
    stopResize() {
        if (this.isResizingWidth || this.isResizingHeight) {
            this.isResizingWidth = false;
            this.isResizingHeight = false;
            document.body.style.cursor = ''; 
            this.sidebarElement.classList.remove('resizing');
            
            // Save settings
            localStorage.setItem('aid_sidebar_width', Math.round(this.currentWidth));
            localStorage.setItem('aid_sidebar_collapsed', this.isCollapsed);
            
            // Save the custom collapsed position if we are in collapsed mode
            if (this.isCollapsed && this.collapsedTop) {
                localStorage.setItem('aid_sidebar_collapsed_top', this.collapsedTop);
            }
        }
    }

    // --- Open/Close ---
    open(inspectorData) {
        this.selectedViewData = inspectorData;
        this.isOpen = true;
        this.render();
        this.sidebarElement.classList.remove('hidden');
        this.sidebarElement.classList.add('open');
        
        // Ensure we restore the correct position
        this.updateVerticalPosition(false);
        
        const sidebarBtn = document.getElementById('btn-sidebar');
        if (sidebarBtn) sidebarBtn.style.color = '#64C8FF';
    }

    close() {
        this.isOpen = false;
        if (this.sidebarElement) {
            this.sidebarElement.classList.remove('open');
            this.sidebarElement.classList.add('hidden');
        }
        const sidebarBtn = document.getElementById('btn-sidebar');
        if (sidebarBtn) sidebarBtn.style.color = '';
    }

    // --- UI Generation ---
    render() {
        const data = this.selectedViewData;
        const titleEl = this.sidebarElement.querySelector('.sidebar-title');
        const emptyState = this.sidebarElement.querySelector('.empty-state');
        const dataContainer = this.sidebarElement.querySelector('.sidebar-data-container');
        
        if (!data || !data.meta) {
            titleEl.textContent = 'Attributes';
            emptyState.style.display = 'block';
            dataContainer.innerHTML = '';
            return;
        }

        // Ensure sub-objects exist using || {}
        // This prevents crash when selecting non-ConstraintLayout views
        data.dimensions = data.dimensions || { layout_width: '?', layout_height: '?' };
        data.constraints = data.constraints || {};
        data.spacing = data.spacing || {};
        data.appearance = data.appearance || {};
        data.bounds = data.bounds || { x:0, y:0, width:0, height:0 };
        data.attributes = data.attributes || {};

        emptyState.style.display = 'none';
        titleEl.textContent = `${data.meta.type} (${data.meta.id})`;
        dataContainer.innerHTML = '';
        
        // 1. Identity
        dataContainer.appendChild(this.createSection('Declared Attributes', 'id', () => {
            const container = document.createElement('div');
            container.className = 'section-body';
            container.appendChild(this.createAttributeRow('id', data.meta.id));
            container.appendChild(this.createAttributeRow('layout_width', data.dimensions.layout_width));
            container.appendChild(this.createAttributeRow('layout_height', data.dimensions.layout_height));
            return container;
        }));
        
        // 2. Layout & Constraints
        dataContainer.appendChild(this.createSection('Layout', 'layout', () => {
            const container = document.createElement('div');
            container.className = 'section-body';
            
            const widget = this.constraintRenderer.createConstraintWidget(data);
            container.appendChild(widget);
            
            const constraintsDiv = document.createElement('div');
            constraintsDiv.style.marginTop = '16px';
            const subheader = document.createElement('div');
            subheader.className = 'section-subheader';
            subheader.textContent = 'Constraints';
            constraintsDiv.appendChild(subheader);
            
            const c = data.constraints;
            const s = data.spacing;

            if (c.startToStart) constraintsDiv.appendChild(this.createConstraintRow('Start → Start', c.startToStart, s.marginStart));
            if (c.startToEnd) constraintsDiv.appendChild(this.createConstraintRow('Start → End', c.startToEnd, s.marginStart));
            if (c.endToEnd) constraintsDiv.appendChild(this.createConstraintRow('End → End', c.endToEnd, s.marginEnd));
            if (c.endToStart) constraintsDiv.appendChild(this.createConstraintRow('End → Start', c.endToStart, s.marginEnd));
            if (c.topToTop) constraintsDiv.appendChild(this.createConstraintRow('Top → Top', c.topToTop, s.marginTop));
            if (c.topToBottom) constraintsDiv.appendChild(this.createConstraintRow('Top → Bottom', c.topToBottom, s.marginTop));
            if (c.bottomToTop) constraintsDiv.appendChild(this.createConstraintRow('Bottom → Top', c.bottomToTop, s.marginBottom));
            if (c.bottomToBottom) constraintsDiv.appendChild(this.createConstraintRow('Bottom → Bottom', c.bottomToBottom, s.marginBottom));
            if (c.baselineToBaseline) constraintsDiv.appendChild(this.createConstraintRow('Baseline → Baseline', c.baselineToBaseline, 0));
            
            if (parseFloat(c.horizontalBias) !== 0.5 && c.horizontalBias !== undefined) constraintsDiv.appendChild(this.createAttributeRow('H-Bias', c.horizontalBias));
            if (parseFloat(c.verticalBias) !== 0.5 && c.verticalBias !== undefined) constraintsDiv.appendChild(this.createAttributeRow('V-Bias', c.verticalBias));

            container.appendChild(constraintsDiv);
            return container;
        }));
        
        // 3. Common Attributes
        dataContainer.appendChild(this.createSection('Common Attributes', 'common', () => {
            const container = document.createElement('div');
            container.className = 'section-body';
            const a = data.appearance;
            const b = data.bounds;
            const s = data.spacing;

            if(a.visibility) container.appendChild(this.createAttributeRow('visibility', a.visibility));
            if(a.alpha !== '1.0' && a.alpha) container.appendChild(this.createAttributeRow('alpha', a.alpha));
            if(a.background) container.appendChild(this.createColorRow('background', a.background));
            if(a.elevation !== '0dp' && a.elevation) container.appendChild(this.createAttributeRow('elevation', a.elevation));
            
            const padHeader = document.createElement('div');
            padHeader.className = 'section-subheader';
            padHeader.textContent = 'Padding';
            container.appendChild(padHeader);
            
            if(s.padding) container.appendChild(this.createAttributeRow('padding', s.padding));
            if(s.paddingStart) container.appendChild(this.createAttributeRow('paddingStart', s.paddingStart));
            if(s.paddingTop) container.appendChild(this.createAttributeRow('paddingTop', s.paddingTop));
            if(s.paddingEnd) container.appendChild(this.createAttributeRow('paddingEnd', s.paddingEnd));
            if(s.paddingBottom) container.appendChild(this.createAttributeRow('paddingBottom', s.paddingBottom));

            const coordHeader = document.createElement('div');
            coordHeader.className = 'section-subheader';
            coordHeader.style.marginTop = '10px';
            coordHeader.textContent = 'Computed (Px)';
            container.appendChild(coordHeader);
            
            container.appendChild(this.createAttributeRow('x', b.x));
            container.appendChild(this.createAttributeRow('y', b.y));
            container.appendChild(this.createAttributeRow('width', b.width));
            container.appendChild(this.createAttributeRow('height', b.height));
            return container;
        }));

        // 4. Specific Attributes
        if (data.attributes && data.attributes.text) {
            dataContainer.appendChild(this.createSection('Text Appearance', 'text', () => {
                const container = document.createElement('div');
                container.className = 'section-body';
                const t = data.attributes.text;
                if(t.text) container.appendChild(this.createAttributeRow('text', t.text));
                if(t.textSize) container.appendChild(this.createAttributeRow('textSize', t.textSize));
                if(t.textColor) container.appendChild(this.createColorRow('textColor', t.textColor));
                if(t.fontFamily) container.appendChild(this.createAttributeRow('fontFamily', t.fontFamily));
                if(t.textStyle) container.appendChild(this.createAttributeRow('textStyle', t.textStyle));
                if(t.gravity) container.appendChild(this.createAttributeRow('gravity', t.gravity));
                return container;
            }));
        }

        if (data.attributes && data.attributes.image) {
            dataContainer.appendChild(this.createSection('Image Properties', 'image', () => {
                const container = document.createElement('div');
                container.className = 'section-body';
                const img = data.attributes.image;
                if(img.src) container.appendChild(this.createAttributeRow('src', img.src));
                if(img.scaleType) container.appendChild(this.createAttributeRow('scaleType', img.scaleType));
                if(img.tint) container.appendChild(this.createColorRow('tint', img.tint));
                return container;
            }));
        }

        // Transforms
        const trans = data.appearance;
        if (trans.rotation !== '0' || trans.scaleX !== '1' || trans.scaleY !== '1') {
            dataContainer.appendChild(this.createSection('Transforms', 'transform', () => {
                const container = document.createElement('div');
                container.className = 'section-body';
                if(trans.rotation !== '0' && trans.rotation) container.appendChild(this.createAttributeRow('rotation', `${trans.rotation}°`));
                if(trans.scaleX !== '1' && trans.scaleX) container.appendChild(this.createAttributeRow('scaleX', trans.scaleX));
                if(trans.scaleY !== '1' && trans.scaleY) container.appendChild(this.createAttributeRow('scaleY', trans.scaleY));
                return container;
            }));
        }
    }

    createSection(title, key, contentBuilder) {
        const section = document.createElement('div');
        section.className = 'sidebar-section';
        const header = document.createElement('div');
        header.className = 'section-header';
        header.innerHTML = `
            <svg class="chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="${this.expandedSections[key] ? '6 9 12 15 18 9' : '9 18 15 12 9 6'}"></polyline>
            </svg>
            <span class="section-title">${title}</span>
        `;
        header.addEventListener('click', () => {
            this.expandedSections[key] = !this.expandedSections[key];
            this.render();
        });
        section.appendChild(header);
        if (this.expandedSections[key]) section.appendChild(contentBuilder());
        return section;
    }

    createAttributeRow(label, value) {
        const row = document.createElement('div');
        row.className = 'attr-row';
        row.innerHTML = `<span class="attr-label">${label}</span><span class="attr-value">${value}</span>`;
        return row;
    }
    
    createColorRow(label, value) {
        const row = document.createElement('div');
        row.className = 'attr-row';
        let colorPreview = '';
        if (value && (value.startsWith('#') || value.startsWith('rgb'))) {
            colorPreview = `<span style="display:inline-block; width:12px; height:12px; background:${value}; border-radius:50%; border:1px solid #555; margin-right:6px;"></span>`;
        }
        row.innerHTML = `<span class="attr-label">${label}</span><span class="attr-value" style="display:flex;align-items:center;">${colorPreview}${value}</span>`;
        return row;
    }

    createConstraintRow(label, target, margin) {
        const row = document.createElement('div');
        row.className = 'constraint-row';
        const cleanTarget = target ? target.replace('@+id/', '') : 'null';
        const marginText = (margin !== undefined && margin !== 0) ? `<span class="margin-badge">${margin}</span>` : '';
        row.innerHTML = `<span>${label}</span><div style="display:flex;gap:8px;align-items:center"><span class="constraint-target">${cleanTarget}</span>${marginText}</div>`;
        return row;
    }
}

// Global Helper
export function openInspectorSidebar(viewId, inspectorData = null) {
    const toolbar = window.__toolbarControls;
    if (!toolbar || !toolbar.sidebar) {
        console.warn('[SideBar] Toolbar not initialized');
        return;
    }
    window.__selectedViewId = viewId;
    if (inspectorData) {
        toolbar.sidebar.open(inspectorData);
    } else if (viewId) {
        const data = toolbar.buildInspectorData(viewId);
        if (data) {
            toolbar.sidebar.open(data);
        } else {
            toolbar.sidebar.open({ 
                meta: { id: viewId, type: 'View' },
                dimensions: { layout_width: 'wrap_content', layout_height: 'wrap_content' },
                constraints: {},
                spacing: {},
                appearance: {},
                bounds: { x:0, y:0, width:0, height:0 },
                attributes: {}
            });
        }
    } else {
        toolbar.sidebar.close();
    }
}