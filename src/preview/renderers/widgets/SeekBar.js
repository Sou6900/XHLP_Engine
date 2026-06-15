import { BaseView } from './BaseView.js';
import { LogManager } from '../../core/LogManager.js';

export class SeekBar extends BaseView {
    
    async render(node, parentType) {
        const attr = node.attributes;
        const viewId = attr.id ? attr.id.replace('@+id/', '') : 'NO_ID';
        
        LogManager.v('SeekBar', `Inflating SeekBar [${viewId}]`);

        const baseStyle = await this.getBaseStyles(attr, parentType);
        
        const get = (name) => attr[name] || attr[`android:${name}`];

        // 1. Attributes
        const max = parseInt(get('max') || '100');
        const progress = parseInt(get('progress') || '0');
        
        LogManager.d('SeekBar', `[${viewId}] Range: 0 - ${max}, Progress: ${progress}`);

        // 2. Colors (Tinting)
        const thumbTint = this.resolver.resolveColor(get('thumbTint'));
        const progressTint = this.resolver.resolveColor(get('progressTint'));
        const progressBgTint = this.resolver.resolveColor(get('progressBackgroundTint'));

        if (thumbTint || progressTint) {
            LogManager.v('SeekBar', `[${viewId}] Tints -> Thumb: ${thumbTint}, Progress: ${progressTint}`);
        }

        // Use CSS accent-color for a quick native look (Thumb & Active Track)
        // If thumbTint is present, use it. otherwise use progressTint.
        const mainColor = (thumbTint && thumbTint !== 'transparent') ? thumbTint : 
                          (progressTint && progressTint !== 'transparent') ? progressTint : '#6200EE';

        // 3. Construct HTML
        // Note: I wrap input in a div to apply base styles (positioning/margins) 
        // while allowing the input to fill that space.
        
        const css = `
            display: flex; 
            align-items: center; 
            justify-content: center;
            ${baseStyle}
        `;

        const inputStyle = `
            width: 100%; 
            margin: 0; 
            cursor: pointer;
            accent-color: ${mainColor};
            background: transparent;
        `;

        // Native HTML Range Input simulates Android SeekBar well enough for preview
        return `
            <div class="android-view seek-bar" style="${css}">
                <input type="range" 
                    min="0" 
                    max="${max}" 
                    value="${progress}" 
                    disabled
                    style="${inputStyle}" 
                />
            </div>
        `;
    }
}