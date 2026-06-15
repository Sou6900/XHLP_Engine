import { BaseView } from './BaseView.js';
import { LogManager } from '../../core/LogManager.js';

export class Guideline extends BaseView {
    async render(node, parentType) {
        const attr = node.attributes;
        const idStr = attr.id ? `id="${attr.id.replace('@+id/', '')}"` : '';
        const idLog = attr.id || 'NO_ID';
        
        const orientation = attr.orientation || attr['android:orientation'] || 'undefined';
        const percent = attr['app:layout_constraintGuide_percent'] || attr['layout_constraintGuide_percent'];
        const begin = attr['app:layout_constraintGuide_begin'] || attr['layout_constraintGuide_begin'];
        const end = attr['app:layout_constraintGuide_end'] || attr['layout_constraintGuide_end'];

        let detail = '';
        if (percent) detail = `percent=${percent}`;
        else if (begin) detail = `begin=${begin}`;
        else if (end) detail = `end=${end}`;

        LogManager.v('Guideline', `[${idLog}] Orientation: ${orientation}, ${detail}`);

        return `<div class="android-view android-guideline" ${idStr} style="visibility: hidden; position: absolute; width: 0px; height: 0px; top: 0; left: 0;"></div>`;
    }
}