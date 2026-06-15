import { BaseView } from './BaseView.js';
import { LogManager } from '../../core/LogManager.js';

export class Layer extends BaseView {
    async render(node) {
        const attr = node.attributes;
        const idStr = attr.id ? `id="${attr.id.replace('@+id/', '')}"` : '';
        const viewId = attr.id || 'NO_ID';
        
        const refIds = attr['app:constraint_referenced_ids'] || attr['constraint_referenced_ids'] || '';

        //  Read attributes with fallbacks
        const getAttr = (name) => attr[name] || attr[`android:${name}`] || '0';

        const rotation = getAttr('rotation');
        const scaleX = attr['android:scaleX'] || attr['scaleX'] || '1';
        const scaleY = attr['android:scaleY'] || attr['scaleY'] || '1';
        const transX = getAttr('translationX');
        const transY = getAttr('translationY');

        if (refIds) {
            LogManager.i('ConstraintHelper', `Layer [${viewId}] active. Controls: [${refIds}]`);
            LogManager.d('ConstraintHelper', `Layer [${viewId}] Transform: rot=${rotation}, scale=(${scaleX},${scaleY}), trans=(${transX},${transY})`);
        } else {
            LogManager.w('ConstraintHelper', `Layer [${viewId}] has no referenced IDs.`);
        }

        return `<div class="android-view android-layer" ${idStr} 
                    data-referenced-ids="${refIds}"
                    data-rotation="${rotation}"
                    data-scale-x="${scaleX}"
                    data-scale-y="${scaleY}"
                    data-translation-x="${transX}"
                    data-translation-y="${transY}"
                    style="display: none !important; width: 0px; height: 0px;">
                </div>`;
    }
}