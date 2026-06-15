import { TextView } from './TextView.js';
import { LogManager } from '../../core/LogManager.js';

export class Button extends TextView {
    
    async render(node, parentType) {
        const attr = node.attributes;
        const viewId = attr.id ? attr.id.replace('@+id/', '') : 'NO_ID';
        
        LogManager.v('Button', `Inflating Button [${viewId}]`);

        // 1. Get Base HTML
        let html = await super.render(node, parentType); 
        
        const resolver = this.resolver;

        // Robust Tint Check
        const bgTint = attr['android:backgroundTint'] || attr['app:backgroundTint'] || attr['backgroundTint'];
        
        let bgColor = '#bababa'; // Default gray
        
        if (bgTint) {
            bgColor = resolver.resolveColor(bgTint);
            LogManager.v('Button', `[${viewId}] Applied backgroundTint: ${bgColor}`);
        } 
        else if (attr['android:background']) {
             const bg = resolver.resolveColor(attr['android:background']);
             if (bg !== 'transparent') {
                 bgColor = bg;
                 LogManager.v('Button', `[${viewId}] Applied background color: ${bgColor}`);
             }
        }

        // --- Shadow Interaction Logic ---
        const shadowFilter = `drop-shadow(0px 1px 1px rgba(0,0,0,0.24))`;
        
        let insetStyle = '';
        let shadowStyle = '';
        
        if (bgColor !== 'transparent') {
            insetStyle = `border: 4px solid transparent; background-clip: padding-box;`;
            shadowStyle = `filter: ${shadowFilter};`;
        }

        // Padding & Dimensions Logic
        const px = this.converter.parse(attr.paddingHorizontal || attr.padding || '16dp');
        const py = this.converter.parse(attr.paddingVertical || attr.padding || '8dp');
        const hasUserPadding = attr.padding || attr.paddingHorizontal || attr.paddingVertical;
        
        const isFixedW = attr.layout_width && attr.layout_width !== 'wrap_content';

        const buttonStyle = `
            display: flex;
            justify-content: center;
            align-items: center;
            padding: ${hasUserPadding ? '0' : `${py} ${px}`}; 
            min-width: ${isFixedW ? '0px' : '64px'}; 
            min-height: 0;
            height: auto;
            
            /* Text Style */
            text-transform: uppercase;
            letter-spacing: 0.08em;
            font-weight: 500;
            white-space: nowrap !important; 
            
            /* Shape & Color */
            border-radius: 4px; 
            background-color: ${bgColor}; 
            color: white;
            
            /* Browser Reset */
            border: none;
            outline: none;
            box-shadow: none;
            
            /* Insets & Initial Shadow */
            ${insetStyle}
            ${shadowStyle}
            
            cursor: pointer;
            overflow: visible; 
            transition: filter 0.1s ease;
        `;
        
        // Interaction Events
        if (bgColor !== 'transparent') {
            const down = `this.style.filter='none'`;
            const up = `this.style.filter='${shadowFilter}'`;
            
            if (this.interactiveEvents) {
                this.interactiveEvents = this.interactiveEvents
                    .replace(/onmousedown="([^"]*)"/, `onmousedown="$1; ${down}"`)
                    .replace(/onmouseup="([^"]*)"/, `onmouseup="$1; ${up}"`)
                    .replace(/onmouseleave="([^"]*)"/, `onmouseleave="$1; ${up}"`)
                    .replace(/ontouchstart="([^"]*)"/, `ontouchstart="$1; ${down}"`)
                    .replace(/ontouchend="([^"]*)"/, `ontouchend="$1; ${up}"`);
            } else {
                // If no existing events (e.g. no selector), create new ones
                const events = `onmousedown="${down}" onmouseup="${up}" onmouseleave="${up}" ontouchstart="${down}" ontouchend="${up}"`;
                html = html.replace('style="', `${events} style="`);
            }
        }

        return html
            .replace('class="android-view text-view"', 'class="android-view android-button"')
            .replace('style="', `style="${buttonStyle} `);
    }
}