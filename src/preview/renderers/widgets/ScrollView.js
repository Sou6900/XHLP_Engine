import { BaseView } from './BaseView.js';

export class ScrollView extends BaseView {
    
    async render(node, renderChildCallback) {
        return this.renderWithBounds(node, 360, 640, renderChildCallback, 'ViewGroup');
    }

    async renderWithBounds(node, width, height, renderChildCallback, parentType) {
        const attr = node.attributes;
        const baseStyle = await this.getBaseStyles(attr, parentType || 'ViewGroup');

        const p = attr.padding;
        const pl = this._parsePx(attr.paddingLeft || attr.paddingStart || p);
        const pr = this._parsePx(attr.paddingRight || attr.paddingEnd || p);
        const pt = this._parsePx(attr.paddingTop || p);
        const pb = this._parsePx(attr.paddingBottom || p);

        const innerWidth = (width || 360) - pl - pr;
        const innerHeight = (height || 640) - pt - pb; 

        const overScroll = attr.overScrollMode || attr['android:overScrollMode'];
        let cssOverscroll = 'auto';
        if (overScroll === 'never') cssOverscroll = 'none';

        const fillViewport = attr['android:fillViewport'] === 'true' || attr['fillViewport'] === 'true';

        const layoutStyle = `
            display: block;
            overflow-y: auto;
            overflow-x: hidden;
            overscroll-behavior-y: ${cssOverscroll}; 
            -webkit-overflow-scrolling: touch;
            scrollbar-width: thin; 
            height: 100%;
        `;

        const childrenHtmlArray = await Promise.all(node.children.map(async child => {
            // Pass Reduced Width to Children
            let childHtml = await renderChildCallback(child, 'ScrollView', innerWidth, innerHeight);
            
            if (fillViewport) {
                childHtml = childHtml.replace(/style="([^"]*)"/, `style="$1 min-height: ${innerHeight}px;"`);
            }
            return childHtml;
        }));

        return `
            <div class="android-view scroll-view" style="${baseStyle} ${layoutStyle}">
                ${childrenHtmlArray.join('')}
            </div>
        `;
    }

    _parsePx(val) {
        if (!val) return 0;
        return parseFloat(this.converter.parse(val));
    }
}