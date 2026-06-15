import { TextView } from './TextView.js';
import { LogManager } from '../../core/LogManager.js';

export class CheckBox extends TextView {
    constructor(resolver) {
        super(resolver);
    }

    async render(node, parentType, parentWidth, parentHeight) {
        const attr = node.attributes;
        const viewId = attr.id ? attr.id.replace('@+id/', '') : 'NO_ID';
        
        LogManager.v('CheckBox', `Inflating CheckBox [${viewId}]`);

        let html = await super.render(node, parentType, parentWidth, parentHeight);

        const get = (name) => attr[name] || attr[`android:${name}`] || attr[`app:${name}`];

        // Property prsing 
        const isChecked = get('checked') === 'true';
        LogManager.d('CheckBox', `[${viewId}] State: ${isChecked ? 'Checked' : 'Unchecked'}`);
        
        let tintColor = get('buttonTint');
        if (tintColor) {
            tintColor = this.resolver.resolveColor(tintColor);
            LogManager.v('CheckBox', `[${viewId}] Button Tint: ${tintColor}`);
        }
        
        const activeColor = tintColor || '#00E5FF';
        const inactiveColor = tintColor || '#757575'; 
        const finalColor = isChecked ? activeColor : inactiveColor;

        // icon generation
        const customButton = get('button');
        let iconHtml = '';

        // rtl support
        const marginStyle = 'margin-inline-end: 12px;'; 

        if (customButton && customButton !== '@null') {
            LogManager.d('CheckBox', `[${viewId}] Loading custom button drawable: ${customButton}`);
            iconHtml = await this._renderDrawable(customButton, null, '24px', '24px');
            iconHtml = iconHtml.replace('style="', `style="${marginStyle} `);
        } else {
            const size = '24px';
            if (isChecked) {
                // ☑ Checked
                iconHtml = `
                <svg viewBox="0 0 24 24" style="width: ${size}; height: ${size}; min-width: ${size}; fill: ${finalColor}; ${marginStyle} flex-shrink: 0;">
                    <path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>`;
            } else {
                // Unchecked
                iconHtml = `
                <svg viewBox="0 0 24 24" style="width: ${size}; height: ${size}; min-width: ${size}; fill: ${finalColor}; ${marginStyle} flex-shrink: 0;">
                    <path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>
                </svg>`;
            }
        }

        // style and gravity fix 
        html = html.replace('class="android-view text-view"', 'class="android-view check-box"');
        html = html.replace('flex-direction: column;', ''); // Remove TextView default

        // Gravity Handling
        const gravity = get('gravity') || '';
        let justify = 'flex-start';
        
        if (gravity.includes('center')) justify = 'center';
        else if (gravity.includes('end') || gravity.includes('right')) justify = 'flex-end';
        
        // Flex Container Style
        const newStyle = `display: flex; flex-direction: row; align-items: center; justify-content: ${justify};`;
        html = html.replace('style="', `style="${newStyle} `);

        // Text Span Growth
        if (html.includes('<span')) {
            html = html.replace('<span', `${iconHtml}<span style="flex: 1;"`);
        } else {
            html = html.replace('</div>', `${iconHtml}</div>`);
        }

        return html;
    }
}