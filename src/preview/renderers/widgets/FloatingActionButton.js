import { ImageView } from './ImageView.js';
import { LogManager } from '../../core/LogManager.js';

export class FloatingActionButton extends ImageView {
    constructor(resolver) {
        super(resolver);
    }

    async render(node, renderChildCallback, parentType) {
        const attr = node.attributes;
        const viewId = attr.id ? attr.id.replace('@+id/', '') : 'NO_ID';
        
        // 1. Base Styles
        const baseStyle = await this.getBaseStyles(attr, parentType);
        
        // 2. FAB Size
        const sizeStr = attr['app:fabSize'] === 'mini' ? '40dp' : '56dp';
        const size = this.converter.parse(sizeStr); 

        // 3. Resolve Background Color
        // Priority: app:backgroundTint -> ?attr/colorSecondary -> Default Teal (#03DAC6)
        let bgTint = this.resolver.resolveColor(attr['app:backgroundTint']);
        if (!bgTint || bgTint === 'transparent') {
             bgTint = this.resolver.resolveColor('?attr/colorSecondary');
        }
        // Fallback if theme fails
        if (!bgTint || bgTint === 'transparent') {
            bgTint = '#03DAC6'; // Material Design Default Teal
        }

        // 4. Resolve Icon Tint
        // Priority: app:tint -> ?attr/colorOnSecondary -> White (#FFFFFF)
        let tintColor = this.resolver.resolveColor(attr['app:tint'] || attr['android:tint']);
        
        if (!tintColor || tintColor === 'transparent') {
             // Try to get 'colorOnSecondary' (content color for secondary background)
             tintColor = this.resolver.resolveColor('?attr/colorOnSecondary');
        }
        // Fallback: If background is dark, use white; else black. 
        // For simplicity, standard FABs usually have dark accents, so white is safe.
        if (!tintColor || tintColor === 'transparent') {
            tintColor = '#FFFFFF';
        }

        // 5. Elevation Shadow
        const elevation = attr['app:elevation'] || '6dp';
        const elevationPx = parseFloat(this.converter.parse(elevation));
        const shadow = elevationPx > 0 
            ? `box-shadow: 0px ${elevationPx/2}px ${elevationPx}px rgba(0,0,0,0.35);` 
            : '';

        // 6. Icon Resolution & Encoding
        const rawSrc = attr['app:srcCompat'] || attr['android:src'] || attr.src;
        let iconSrc = '';

        // Helper to encode SVG properly
        const encodeSvg = (svg) => `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

        // Default Plus Icon
        const defaultIcon = `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" fill="${tintColor}"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>`;

        if (rawSrc && !rawSrc.includes('ic_input_add')) {
            const drawable = await this.resolver.resolveDrawable(rawSrc);
            if (drawable) {
                if (drawable.type === 'svg') {
                    // Apply tint to the SVG string before encoding
                    let svg = drawable.value;
                    // Simple tint replacement
                    if (tintColor) {
                        svg = svg.replace(/fill="[^"]*"/g, `fill="${tintColor}"`);
                        if (!svg.includes('fill=')) svg = svg.replace(/<path/g, `<path fill="${tintColor}"`);
                    }
                    iconSrc = encodeSvg(svg);
                } else if (drawable.type === 'bitmap') {
                    iconSrc = drawable.value;
                }
            }
        }
        
        // If no icon found, use Default Plus
        if (!iconSrc) {
            iconSrc = encodeSvg(defaultIcon);
        }

        // 7. Styles
        const fabStyle = `
            display: flex;
            align-items: center;
            justify-content: center;
            width: ${size};
            height: ${size};
            min-width: ${size};
            min-height: ${size};
            border-radius: 50%;
            background-color: ${bgTint};
            ${shadow}
            cursor: pointer;
            z-index: 100;
        `;

        // Tint filter for Bitmaps (SVGs are already tinted above)
        let imgStyle = 'width: 24px; height: 24px; object-fit: contain;';
        if (rawSrc && !iconSrc.startsWith('data:image/svg')) {
             // Apply CSS filter for bitmaps if needed
             if (tintColor === '#FFFFFF') imgStyle += ' filter: brightness(0) invert(1);';
        }

        // 8. Render
        return `
            <div class="android-view floating-action-button" id="${viewId}" style="${baseStyle} ${fabStyle}">
                <img src="${iconSrc}" style="${imgStyle}" />
            </div>
        `;
    }
}