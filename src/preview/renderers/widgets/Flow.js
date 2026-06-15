import { BaseView } from './BaseView.js';
import { LogManager } from '../../core/LogManager.js';

export class Flow extends BaseView {
    async render(node) {
        const attr = node.attributes;
        const idStr = attr.id ? `id="${attr.id.replace('@+id/', '')}"` : '';
        const viewId = attr.id || 'NO_ID';
        
        const refIds = attr['app:constraint_referenced_ids'] || attr['constraint_referenced_ids'] || '';
        
        LogManager.i('ConstraintHelper', `Flow [${viewId}] initialized. Referenced IDs: [${refIds}]`);

        return `<div class="android-view android-flow" ${idStr} 
                    style="display: none !important; width: 0px; height: 0px;">
                </div>`;
    }
}