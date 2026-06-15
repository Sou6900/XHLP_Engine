import { ViewGroup } from '../widgets/ViewGroup.js';
import { LogManager } from '../../core/LogManager.js';

export class CoordinatorLayout extends ViewGroup {
    constructor(resolver) {
        super(resolver);
    }

    async render(node, renderChildCallback, parentType) {
        const attr = node.attributes;
        const getAttr = (attrs, name) => attrs[name] || attrs[`android:${name}`] || attrs[`app:${name}`];

        let baseStyle = await this.getBaseStyles(attr, parentType);
        baseStyle = baseStyle.replace('display: flex;', 'display: block !important;');
        if (!baseStyle.includes('position: relative')) baseStyle += 'position: relative; ';

        let appBarHeight = 300; 

        node.children.forEach(child => {
            if (child.type.includes('AppBarLayout')) {
                const h = getAttr(child.attributes, 'layout_height');
                if (h && h.includes('dp')) {
                    appBarHeight = parseFloat(h);
                }
            }
        });

        const childrenHtmlArray = await Promise.all(node.children.map(async child => {
            let html = await renderChildCallback(child, 'CoordinatorLayout', null, null);
            const childAttr = child.attributes;
            const behavior = getAttr(childAttr, 'layout_behavior') || '';

            // A. AppBar Styling
            if (child.type.includes('AppBarLayout')) {
                const style = `position: absolute; top: 0; left: 0; width: 100%; z-index: 10; transition: background-color 0.2s; will-change: transform;`;
                html = html.replace(/class="([^"]*)"/, `class="$1 app-bar-layout"`);
                html = html.replace(/style="([^"]*)"/, `style="$1 ${style}"`);
            }
            
            // B. FAB Styling
            if (child.type.includes('FloatingActionButton')) {
                 const anchor = getAttr(childAttr, 'layout_anchor');
                 if (anchor) {
                    const style = `position: absolute; z-index: 20; top: ${appBarHeight}px; transform: translateY(-50%); right: 16px; transition: transform 0.2s cubic-bezier(0.4, 0.0, 0.2, 1), opacity 0.2s;`;
                    html = html.replace(/style="([^"]*)"/, `style="$1 ${style}"`);
                    html = html.replace(/class="([^"]*)"/, `class="$1 floating-action-button"`);
                 }
            }
            
            // C. NestedScrollView & Logic
            if (behavior.includes('scrolling_view_behavior')) {
                const style = `
                    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                    padding-top: ${appBarHeight}px; box-sizing: border-box;
                    z-index: 1; overflow-y: auto; scroll-behavior: smooth;
                `;
                
                const inlineScript = `
                    (function(scroller){
                        const parent = scroller.parentElement;
                        const appBar = parent.querySelector('.app-bar-layout');
                        const fab = parent.querySelector('.floating-action-button');
                        const title = parent.querySelector('.collapsing-title');
                        const image = parent.querySelector('.image-view');
                        const toolbar = parent.querySelector('.android-toolbar');

                        const collapsingToolbar = parent.querySelector('[data-scrim-color]');
                        const scrimColor = collapsingToolbar ? collapsingToolbar.getAttribute('data-scrim-color') : '#6200EE';

                        const APP_BAR_HEIGHT = ${appBarHeight};
                        const TOOLBAR_HEIGHT = 56;
                        const STATUS_BAR = 0; 
                        const COLLAPSED_HEIGHT = TOOLBAR_HEIGHT + STATUS_BAR; 
                        const MAX_SCROLL = APP_BAR_HEIGHT - COLLAPSED_HEIGHT; 

                        const EXPANDED_TEXT_SIZE = 34;
                        const COLLAPSED_TEXT_SIZE = 20;
                        const SCALE_FACTOR = COLLAPSED_TEXT_SIZE / EXPANDED_TEXT_SIZE;
                        const TITLE_TRAVEL_Y = MAX_SCROLL - (TOOLBAR_HEIGHT / 2) + 16;
                        const TITLE_TRAVEL_X = 56;

                        parent.onScrollStateChanged = () => {
                            const scrollTop = scroller.scrollTop;
                            const fraction = Math.min(1, scrollTop / MAX_SCROLL);

                            let newTop = -scrollTop;
                            if (scrollTop > MAX_SCROLL) newTop = -MAX_SCROLL;
                            if (appBar) appBar.style.transform = 'translateY(' + newTop + 'px)';

                            
                            if (toolbar) {
                                let toolbarY = scrollTop;
                                if (toolbarY > MAX_SCROLL) toolbarY = MAX_SCROLL;
                                toolbar.style.transform = 'translateY(' + toolbarY + 'px)';
                            }

                            if (collapsingToolbar) {
                                if (scrollTop > MAX_SCROLL - 20) {
                                    collapsingToolbar.style.backgroundColor = scrimColor;
                                    collapsingToolbar.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
                                    if(toolbar) toolbar.style.boxShadow = 'none';
                                } else {
                                    collapsingToolbar.style.backgroundColor = 'transparent';
                                    collapsingToolbar.style.boxShadow = 'none';
                                }
                            }

                            if (title) {
                                const currentScale = 1 - ((1 - SCALE_FACTOR) * fraction);
                                const transY = fraction * (TITLE_TRAVEL_Y); 
                                const transX = fraction * TITLE_TRAVEL_X;
                                title.style.transform = \`translate(\${transX}px, \${-transY}px) scale(\${currentScale})\`;
                            }

                            if (image) {
                                image.style.transform = 'translateY(' + (scrollTop * 0.5) + 'px)';
                                image.style.opacity = 1 - fraction;
                            }

                            if (fab) {
                                if (fraction > 0.7) {
                                    fab.style.transform = 'translateY(-50%) scale(0)';
                                    fab.style.opacity = '0';
                                } else {
                                    fab.style.transform = 'translateY(-50%) scale(1)';
                                    fab.style.opacity = '1';
                                }
                            }
                        };

                        scroller.addEventListener('scroll', parent.onScrollStateChanged);
                        parent.onScrollStateChanged();
                    })(this)
                `;

                html = html.replace(/style="([^"]*)"/, `style="$1 ${style}"`);
                html = html.replace('<div ', `<div onscroll="${inlineScript.replace(/"/g, "&quot;").replace(/\n/g, ' ')}" `);
            }
            
            return html;
        }));

        return `
            <div class="android-view view-group coordinator-layout" style="${baseStyle} width: 100%; height: 100%; overflow: hidden;">
                ${childrenHtmlArray.join('')}
            </div>
        `;
    }
}