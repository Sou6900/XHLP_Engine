import { LinearLayout } from './LinearLayout.js';

export class AppBarLayout extends LinearLayout {
    constructor(resolver) {
        super(resolver);
        this.orientation = 'vertical'; // AppBarLayout always vertical
    }

    async onMeasure(wSpec, hSpec) {
        await super.onMeasure(wSpec, hSpec);
        // AppBarLayout usually wraps content height
    }

    createElement() {
        const el = super.createElement();
        
        // Default Material Styling
        // Android AppBar usually has a default elevation of 4dp
        const elevation = this.attributes['android:elevation'] || this.attributes['app:elevation'] || '4dp';
        const elevationPx = this.resolver.getDimensionPixelSize(elevation);
        
        if (elevationPx > 0) {
            el.style.boxShadow = `0px ${elevationPx / 2}px ${elevationPx}px rgba(0,0,0,0.24)`;
            el.style.zIndex = '10'; // Ensure it stays on top
        }

        // Background Logic
        // If no background is set, use colorPrimary from theme
        if (!this.attributes['android:background']) {
            const colorPrimary = this.resolver.resolveColor('?attr/colorPrimary') || '#6200EE';
            el.style.backgroundColor = colorPrimary;
        }

        return el;
    }
}