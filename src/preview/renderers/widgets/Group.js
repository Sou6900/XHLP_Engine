import { BaseView } from './BaseView.js';
import { LogManager } from '../../core/LogManager.js';

export class Group extends BaseView {
    async render(node) {
        const attr = node.attributes;
        const idStr = attr.id ? `id="${attr.id.replace('@+id/', '')}"` : '';
        const viewId = attr.id || 'NO_ID';
        
        const refIds = attr['app:constraint_referenced_ids'] || attr['constraint_referenced_ids'] || '';
        
        LogManager.i('ConstraintHelper', `Group [${viewId}] initialized. Controls: [${refIds}]`);
        
        return `<div class="android-view android-group" ${idStr} 
                    data-referenced-ids="${refIds}"
                    style="display: none !important; width: 0px; height: 0px;">
                </div>`;
    }
}