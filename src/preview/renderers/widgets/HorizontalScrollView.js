import { BaseView } from './BaseView.js';
import { LogManager } from '../../core/LogManager.js';

export class HorizontalScrollView extends BaseView {
    
    async render(node, renderChildCallback) {
        const id = node.attributes.id || 'NO_ID';
        LogManager.v('HorizontalScrollView', `Rendering ScrollView [${id}]`);
        
        // We pass 'null' as width to indicate unconstrained horizontal space
        return this.renderWithBounds(node, null, null, renderChildCallback, 'ViewGroup');
    }

    async renderWithBounds(node, width, height, renderChildCallback, parentType) {
        const attr = node.attributes;
        const baseStyle = await this.getBaseStyles(attr, parentType || 'ViewGroup');

        // Padding Parsing
        const p = attr.padding;
        const pl = this._parsePx(attr.paddingLeft || attr.paddingStart || p);
        const pr = this._parsePx(attr.paddingRight || attr.paddingEnd || p);
        const pt = this._parsePx(attr.paddingTop || p);
        const pb = this._parsePx(attr.paddingBottom || p);

        // Height Constraint
        const innerHeight = height ? (height - pt - pb) : null; 

        // Overscroll Logic
        const overScroll = attr.overScrollMode || attr['android:overScrollMode'];
        let cssOverscroll = 'auto';
        if (overScroll === 'never') cssOverscroll = 'none';

        const layoutStyle = `
            display: block;
            overflow-x: auto;
            overflow-y: hidden;
            white-space: nowrap;
            overscroll-behavior-x: ${cssOverscroll};
            -webkit-overflow-scrolling: touch;
            scrollbar-width: thin;
            max-width: 100%;
        `;

        if (node.children.length > 1) {
            LogManager.w('HorizontalScrollView', 'ScrollView can host only one direct child');
        }

        const childrenHtmlArray = await Promise.all(node.children.map(async child => {
            return await renderChildCallback(child, 'HorizontalScrollView', null, innerHeight);
        }));

        return `
            <div class="android-view horizontal-scroll-view" style="${baseStyle} ${layoutStyle}">
                ${childrenHtmlArray.join('')}
            </div>
        `;
    }

    _parsePx(val) {
        if (!val) return 0;
        return parseFloat(this.converter.parse(val));
    }
}