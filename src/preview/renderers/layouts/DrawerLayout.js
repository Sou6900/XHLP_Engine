import { BaseView } from '../widgets/BaseView.js';
import { LogManager } from '../../core/LogManager.js';

export class DrawerLayout extends BaseView {
    constructor(resolver) {
        super(resolver);
    }

    render(node, renderChildCallback, parentType) {
        return this.renderWithBounds(node, null, null, renderChildCallback, parentType);
    }

    async renderWithBounds(node, width, height, renderChildCallback, parentType) {
        const TAG = 'DrawerLayout';
        const attr = node.attributes;
        
        LogManager.d(TAG, 'Initializing DrawerLayout render...');

        const baseStyle = await this.getBaseStyles(attr, parentType || 'ViewGroup');

        // Get tools:openDrawer attribute directly from the node
        // This is the standard way, no Regex needed!
        const openDrawerGravity = attr['tools:openDrawer'] || attr['openDrawer'];
        if(openDrawerGravity) {
            LogManager.i(TAG, `Preview Request: Open drawer with gravity '${openDrawerGravity}'`);
        }

        const layoutStyle = `
            position: relative;
            overflow: hidden;
            width: 100%;
            height: 100%;
        `;

        let mainContentHtml = '';
        let drawersHtml = '';
        let isAnyDrawerOpen = false;

        LogManager.v(TAG, `Processing ${node.children.length} children for Drawer/Content detection.`);

        for (const child of node.children) {
            const cAttr = child.attributes;
            const gravity = cAttr['android:layout_gravity'] || cAttr['layout_gravity'] || '';

            const isLeft = gravity.includes('start') || gravity.includes('left');
            const isRight = gravity.includes('end') || gravity.includes('right');
            const isBottom = gravity.includes('bottom');

            if (isLeft || isRight || isBottom) {
                // It's a Drawer
                const drawerType = isLeft ? 'Left/Start' : (isRight ? 'Right/End' : 'Bottom');
                LogManager.d(TAG, `Child found: Drawer (${drawerType})`);

                let html = await renderChildCallback(child, 'DrawerLayout', width, height);
                
                let drawerCss = `
                    position: absolute !important;
                    height: 100% !important;
                    z-index: 100 !important;
                    transition: transform 0.3s ease-out;
                    box-shadow: 0 0 15px rgba(0,0,0,0.3);
                `;
                
                let drawerClass = 'android-drawer';
                let initialTransform = '';
                let isOpen = false;

                // 櫨 Check if this drawer matches the openDrawer gravity
                if (openDrawerGravity) {
                    if ((isLeft && (openDrawerGravity === 'start' || openDrawerGravity === 'left')) ||
                        (isRight && (openDrawerGravity === 'end' || openDrawerGravity === 'right')) ||
                        (isBottom && openDrawerGravity === 'bottom')) {
                        isOpen = true;
                        isAnyDrawerOpen = true;
                        LogManager.w(TAG, `Forcing Drawer OPEN due to tools:openDrawer="${openDrawerGravity}"`);
                    }
                }

                if (isLeft) {
                    drawerCss += `top: 0; left: 0; bottom: 0; width: 300px;`; 
                    initialTransform = isOpen ? 'translateX(0%)' : 'translateX(-100%)'; // Initial State
                    drawerClass += ' drawer-start';
                } 
                else if (isRight) {
                    drawerCss += `top: 0; right: 0; bottom: 0; width: 300px;`;
                    initialTransform = isOpen ? 'translateX(0%)' : 'translateX(100%)'; // Initial State
                    drawerClass += ' drawer-end';
                }
                else if (isBottom) {
                    drawerCss += `bottom: 0; left: 0; right: 0; width: 100%; height: auto !important; max-height: 80%;`;
                    initialTransform = isOpen ? 'translateY(0%)' : 'translateY(100%)'; // Initial State
                    drawerClass += ' drawer-bottom';
                }

                drawerCss += `transform: ${initialTransform};`;

                drawersHtml += html
                    .replace('class="', `class="${drawerClass} `)
                    .replace('style="', `style="${drawerCss} `);

            } else {
                // Main Content
                LogManager.v(TAG, 'Child found: Main Content View');
                let html = await renderChildCallback(child, 'DrawerLayout', width, height);
                const mainCss = `
                    position: absolute !important;
                    top: 0; left: 0;
                    width: 100%; height: 100%;
                    z-index: 1;
                `;
                mainContentHtml += html.replace('style="', `style="${mainCss} `);
            }
        }

        //set Scrim Visibility based on open state
        const scrimOpacity = isAnyDrawerOpen ? '1' : '0';
        const scrimPointer = isAnyDrawerOpen ? 'auto' : 'none';

        if(isAnyDrawerOpen) LogManager.i(TAG, 'Scrim activated (Drawer is open).');

        const scrimHtml = `<div class="drawer-scrim" style="
            position: absolute; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.5); z-index: 90;
            opacity: ${scrimOpacity}; pointer-events: ${scrimPointer}; transition: opacity 0.3s;
        "></div>`;

        return `
            <div class="android-layout drawer-layout" style="${baseStyle} ${layoutStyle}">
                ${mainContentHtml}
                ${scrimHtml}
                ${drawersHtml}
            </div>
        `;
    }
}