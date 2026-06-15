import { LogManager } from '../core/LogManager.js';

export class VectorDrawable {
    
    createSVG(vectorNode) {
        if (!vectorNode || vectorNode.type !== 'vector') return '';

        const attr = vectorNode.attributes || {};
        const getAttr = (name) => attr['android:' + name] || attr[name];

        const viewportW = getAttr('viewportWidth') || '24';
        const viewportH = getAttr('viewportHeight') || '24';
        const tint = getAttr('tint');

        LogManager.v('VectorDrawable', `Creating SVG: Viewport ${viewportW}x${viewportH}`);

        let svg = `<svg xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 ${viewportW} ${viewportH}" 
            width="100%" height="100%" 
            style="display:block;">`;

        svg += this._processChildren(vectorNode.children, tint);
        svg += `</svg>`;
        
        return svg;
    }

    _processChildren(children, globalTint) {
        let content = '';
        if (!children) return content;

        children.forEach(child => {
            if (child.type === 'path') {
                content += this._createPath(child.attributes, globalTint);
            } else if (child.type === 'group') {
                content += `<g>`;
                content += this._processChildren(child.children, globalTint);
                content += `</g>`;
            }
        });
        return content;
    }

    _createPath(attr, globalTint) {
        attr = attr || {};
        const getAttr = (name) => attr['android:' + name] || attr[name];

        const pathData = getAttr('pathData');
        if (!pathData) {
            LogManager.w('VectorDrawable', 'Path skipped: No pathData found');
            return '';
        }

        let fillColor = getAttr('fillColor');
        const strokeColor = getAttr('strokeColor');
        const strokeWidth = getAttr('strokeWidth') || '0';

        if (globalTint && fillColor) {
            fillColor = globalTint;
            LogManager.v('VectorDrawable', `Applying tint ${globalTint} to path`);
        }

        return `<path d="${pathData}" 
            fill="${fillColor || 'none'}" 
            stroke="${strokeColor || 'none'}" 
            stroke-width="${strokeWidth}" />`;
    }
}