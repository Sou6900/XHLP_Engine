import { BaseView } from './BaseView.js';
import { LogManager } from '../../core/LogManager.js';

export class View extends BaseView {
    async render(node, parentType) {
        const baseStyle = await this.getBaseStyles(node.attributes, parentType);
        
        const idStr = node.attributes.id ? `id="${node.attributes.id.replace('@+id/', '')}"` : '';
        const viewId = node.attributes.id || 'NO_ID';

        // Log general view inflation
        LogManager.v('View', `Inflating generic View [${viewId}] in ${parentType}`);

        return `<div class="android-view generic-view" ${idStr} style="${baseStyle}"></div>`;
    }
}