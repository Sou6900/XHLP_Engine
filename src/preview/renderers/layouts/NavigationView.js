import { FrameLayout } from './FrameLayout.js';
import { LogManager } from '../../core/LogManager.js';

export class NavigationView extends FrameLayout {
    constructor(resolver) {
        super(resolver);
    }

    // NavigationView is basically a specialized FrameLayout usually used inside Drawer
    async renderWithBounds(node, width, height, renderChildCallback, parentType) {
        const TAG = 'NavigationView';
        const id = node.attributes.id || node.attributes['android:id'] || 'unknown';

        LogManager.d(TAG, `Rendering NavigationView (${id})...`);

        // default bg
        if (!node.attributes.background && !node.attributes['android:background']) {
            LogManager.w(TAG, `[Warning] No background specified for NavigationView (${id}). Defaulting to #FFFFFF.`);
            node.attributes['android:background'] = '#FFFFFF';
        } else {
            const bg = node.attributes.background || node.attributes['android:background'];
            LogManager.v(TAG, `Background resolved: ${bg}`);
        }
        
        let html = await super.renderWithBounds(node, width, height, renderChildCallback, parentType);
        
        LogManager.i(TAG, `NavigationView rendered successfully.`);

        // NavigationView clss replace
        return html.replace('class="android-layout frame-layout"', 'class="android-layout navigation-view"');
    }
}