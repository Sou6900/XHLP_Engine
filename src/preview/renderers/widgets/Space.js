// Space.js
import { BaseView } from './BaseView.js';

export class Space extends BaseView {
    async render(node, parentType) {
        const attr = node.attributes;
        const baseStyle = await this.getBaseStyles(attr, parentType);
        
        const spaceStyle = `${baseStyle} visibility: hidden !important; pointer-events: none !important;`;
        
        return `<div class="android-view space-view" style="${spaceStyle}"></div>`;
    }
}