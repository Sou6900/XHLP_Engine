import { BaseView } from '../widgets/BaseView.js';
import { LinearSolver } from '../../solvers/LinearSolver.js';
import { ActionMenuItemView } from '../widgets/ActionMenuItemView.js';
import { LogManager } from '../../core/LogManager.js';

export class Toolbar extends BaseView {
    constructor(resolver) {
        super(resolver);
        this.solver = new LinearSolver();
        this.menuItemRenderer = new ActionMenuItemView(resolver);
    }

    async render(node, renderChildCallback, parentType) {
        const TAG = 'Toolbar';
        const attr = node.attributes;
        
        let baseStyle = await this.getBaseStyles(attr, parentType);
        const get = (name) => attr[name] || attr[`android:${name}`] || attr[`app:${name}`];

        // 1. Properties
        // Note: In CollapsingToolbar, the layout wrapper controls the title usually.
        // We will render a hidden title here that shows up when collapsed.
        const titleText = get('title') || ''; // Default empty
        const navIcon = get('navigationIcon');
        const titleTextColor = this.resolver.resolveColor(get('titleTextColor') || '#FFFFFF');
        
        // 2. Dimensions
        let resolvedHeight = '56px';
        const h = get('layout_height');
        if (h && h.includes('actionBarSize')) resolvedHeight = '56px';
        
        // 3. Styling
        // If inside CollapsingToolbar, start transparent.
        if (parentType === 'CollapsingToolbarLayout') {
             baseStyle += 'background-color: transparent; ';
        } else if (!baseStyle.includes('background-color')) {
            baseStyle += 'background-color: #6200EE; ';
        }

        // Padding for Status Bar logic
        let paddingTop = '0px';
        if (parentType === 'AppBarLayout' || parentType === 'CoordinatorLayout') {
            paddingTop = '24px';
            resolvedHeight = `calc(${resolvedHeight} + 24px)`;
        }

        // 4. Navigation Icon
        let navHtml = '';
        if (navIcon) {
            const iconDrawable = await this.resolver.resolveDrawable(navIcon);
            let src = iconDrawable ? iconDrawable.value : ''; 
            if (src && src.includes('<svg')) src = `data:image/svg+xml;utf8,${encodeURIComponent(src)}`;
            navHtml = `<img src="${src}" style="width: 24px; height: 24px; margin: 0 16px; filter: brightness(0) invert(1);" />`;
        }

        // 5. Render Collapsed Title (Initially Hidden)
        // This works in tandem with CoordinatorLayout script
        let titleHtml = '';
        titleHtml = `
            <span class="collapsed-title" style="
                color: ${titleTextColor}; 
                font-size: 20px; 
                font-weight: 500; 
                white-space: nowrap; 
                overflow: hidden; 
                text-overflow: ellipsis; 
                opacity: 0; 
                transition: opacity 0.2s;
                flex: 1;
            ">
                ${titleText || 'My Title Here'} 
            </span>
        `;

        // 6. Actions (Menu)
        let actionsHtml = '';
        const layoutStyle = `
            display: flex;
            align-items: center;
            width: 100%;
            height: ${resolvedHeight};
            padding-top: ${paddingTop};
            box-sizing: border-box;
            z-index: 10;
        `;

        return `
            <div class="android-view android-toolbar" style="${baseStyle} ${layoutStyle}">
                ${navHtml}
                ${titleHtml}
                <div class="toolbar-actions" style="margin-left: auto; margin-right: 8px;">
                    ${actionsHtml}
                </div>
            </div>
        `;
    }
}