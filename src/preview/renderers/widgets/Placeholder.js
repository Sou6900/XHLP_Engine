import { BaseView } from './BaseView.js';
import { LogManager } from '../../core/LogManager.js';

export class Placeholder extends BaseView {
    async render(node) {
        const attr = node.attributes;
        const idStr = attr.id ? `id="${attr.id.replace('@+id/', '')}"` : '';
        const viewId = attr.id || 'NO_ID';
        
        const contentIdRaw = attr['app:content'] || attr['content'] || '';
        const contentId = contentIdRaw.replace('@+id/', '').replace('@id/', '');

        if (contentId) {
            LogManager.d('ConstraintHelper', `Placeholder [${viewId}] linked to content: @id/${contentId}`);
        } else {
            LogManager.w('ConstraintHelper', `Placeholder [${viewId}] has no content set.`);
        }

        return `<div class="android-view android-placeholder" ${idStr} 
                    data-content="${contentId}"
                    style="visibility: hidden;">
                </div>`;
    }
}