import { BaseView } from './BaseView.js';
import { LogManager } from '../../core/LogManager.js';

export class ViewGroup extends BaseView {
    constructor(resolver) {
        super(resolver);
    }

    //  Accept 'parentType' argument
    async render(node, renderChildCallback, parentType) {
        const attr = node.attributes;
        const viewId = attr.id ? attr.id.replace('@+id/', '') : 'NO_ID';
        
        // Use passed parentType (or default to 'ViewGroup' if root)
        const pType = parentType || 'ViewGroup';
        const baseStyle = await this.getBaseStyles(attr, pType);
        
        const currentType = this.constructor.name; 
        const childCount = node.children ? node.children.length : 0;

        LogManager.v('ViewGroup', `Inflating ${currentType} [${viewId}]. Children: ${childCount}`);

        let childrenHtml = '';
        if (childCount > 0) {
            const promises = node.children.map(child => renderChildCallback(child, currentType));
            const results = await Promise.all(promises);
            childrenHtml = results.join('');
        } else {
            LogManager.v('ViewGroup', `[${viewId}] No children to render.`);
        }

        return `
            <div class="android-view view-group" style="${baseStyle}">
                ${childrenHtml}
            </div>
        `;
    }
}