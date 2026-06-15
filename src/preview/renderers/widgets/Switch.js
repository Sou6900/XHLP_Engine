import { TextView } from './TextView.js';
import { LogManager } from '../../core/LogManager.js';

export class Switch extends TextView {
    
    async render(node, parentType, parentWidth, parentHeight) {
        const attr = node.attributes;
        const viewId = attr.id ? attr.id.replace('@+id/', '') : 'NO_ID';
        
        LogManager.v('Switch', `Inflating Switch [${viewId}]`);

        const get = (name) => attr[name] || attr[`android:${name}`] || attr[`app:${name}`];

        // 1. Force default gravity if not set (Text on left, Switch on right)
        if (!get('gravity')) {
            node.attributes['android:gravity'] = "center_vertical|start";
        }

        // 2. Get Base HTML from TextView (Handles Label)
        let html = await super.render(node, parentType, parentWidth, parentHeight);

        // 3. Resolve Switch Properties
        const checked = get('checked') === 'true';
        const switchPadding = this.converter.parse(get('switchPadding') || '16dp');
        
        LogManager.d('Switch', `[${viewId}] Checked: ${checked}`);

        // Colors (Material Design / AppCompat Defaults)
        const colorControlActivated = '#6200EE'; // Purple 500
        const colorSwitchThumbNormal = '#ECECEC'; // Grey 200
        const colorSwitchTrackNormal = '#B0BEC5'; // Blue Grey 200

        // Thumb Color
        let thumbColor = checked ? colorControlActivated : colorSwitchThumbNormal;
        const thumbTint = get('thumbTint');
        if (thumbTint) {
            thumbColor = this.resolver.resolveColor(thumbTint);
            LogManager.v('Switch', `[${viewId}] Thumb Tint: ${thumbColor}`);
        }

        // Track Color
        let trackColor = checked ? this._hexToRgba(thumbColor, 0.5) : colorSwitchTrackNormal;
        const trackTint = get('trackTint');
        if (trackTint) {
            const resolvedTrack = this.resolver.resolveColor(trackTint);
            if (resolvedTrack) trackColor = resolvedTrack;
            LogManager.v('Switch', `[${viewId}] Track Tint: ${trackColor}`);
        }

        // 4. Construct Switch CSS
        const trackW = 34;
        const trackH = 14;
        const thumbS = 20;
        
        // Thumb Animation Position
        const thumbTransform = checked ? `translateX(14px)` : `translateX(0px)`;

        const trackStyle = `
            width: ${trackW}px;
            height: ${trackH}px;
            background-color: ${trackColor};
            border-radius: ${trackH/2}px;
            transition: background-color 0.2s ease;
        `;

        const thumbStyle = `
            width: ${thumbS}px;
            height: ${thumbS}px;
            background-color: ${thumbColor};
            border-radius: 50%;
            box-shadow: 0px 2px 4px rgba(0,0,0,0.3);
            position: absolute;
            top: -3px; 
            left: 0;
            transform: ${thumbTransform};
            transition: transform 0.2s cubic-bezier(0.4, 0.0, 0.2, 1), background-color 0.2s;
        `;

        const switchContainerStyle = `
            position: relative;
            width: ${trackW}px;
            height: ${trackH}px;
            margin-inline-start: ${switchPadding};
            flex-shrink: 0;
            display: flex;
            align-items: center;
        `;

        const switchHtml = `
            <div class="android-switch" style="${switchContainerStyle}">
                <div class="track" style="${trackStyle}"></div>
                <div class="thumb" style="${thumbStyle}"></div>
            </div>
        `;

        // 5. Inject Switch into TextView Container
        
        // Remove conflicting block styles
        html = html.replace(/display:\s*[^;]+;/g, '')
                   .replace(/flex-direction:\s*[^;]+;/g, '');

        const flexStyle = `display: flex !important; flex-direction: row !important; align-items: center !important; justify-content: space-between !important;`;
        
        html = html.replace('style="', `style="${flexStyle} `);
        html = html.replace('class="android-view text-view"', 'class="android-view android-switch"');

        // Append switch before closing div
        const closeIndex = html.lastIndexOf('</div>');
        if (closeIndex !== -1) {
            html = html.substring(0, closeIndex) + switchHtml + html.substring(closeIndex);
        }

        return html;
    }

    _hexToRgba(hex, alpha) {
        if (!hex || !hex.startsWith('#')) return hex;
        let r=0, g=0, b=0;
        if (hex.length === 4) {
            r = parseInt(hex[1]+hex[1], 16);
            g = parseInt(hex[2]+hex[2], 16);
            b = parseInt(hex[3]+hex[3], 16);
        } else if (hex.length >= 7) {
            r = parseInt(hex.substring(1,3), 16);
            g = parseInt(hex.substring(3,5), 16);
            b = parseInt(hex.substring(5,7), 16);
        }
        return `rgba(${r},${g},${b},${alpha})`;
    }
}