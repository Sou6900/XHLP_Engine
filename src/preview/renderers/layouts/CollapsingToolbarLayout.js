import { FrameLayout } from './FrameLayout.js';

export class CollapsingToolbarLayout extends FrameLayout {
    constructor(resolver) {
        super(resolver);
    }

    createElement() {
        const el = super.createElement();
        const attr = this.attributes;

        // 1. Scrim & Background Logic
        const scrimColor = this.resolver.resolveColor(attr['app:contentScrim']) || 
                           this.resolver.resolveColor('?attr/colorPrimary') || '#6200EE';
        
        el.setAttribute('data-scrim-color', scrimColor);

        const hasImage = this.node.children.some(c => c.type.includes('ImageView'));
        if (!hasImage) {
            el.style.backgroundColor = scrimColor; 
        }

        // 2. Title Rendering
        const titleText = this.resolver.resolveString(attr['app:title'] || attr['android:title']);
        
        if (titleText) {
            const titleEl = document.createElement('div');
            titleEl.textContent = titleText;
            titleEl.className = 'collapsing-title';
            
            // Initial Styles (Expanded State)
            const expandedColor = this.resolver.resolveColor(attr['app:expandedTitleTextColor']) || '#FFFFFF';
            
            // Title Pos
            Object.assign(titleEl.style, {
                position: 'absolute',
                left: '16px',
                bottom: '16px',
                color: expandedColor,
                fontSize: '34px',
                fontWeight: '500',
                whiteSpace: 'nowrap',
                transformOrigin: '0% 50%',
                zIndex: '100', // above image but not top
                transition: 'none',
                fontFamily: 'Roboto, sans-serif'
            });

            el.appendChild(titleEl);
        }

        return el;
    }
}