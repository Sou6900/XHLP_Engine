// widgets/ActionMenuItemView.js
import { TextView } from './TextView.js';
import { LogManager } from '../../core/LogManager.js'; 

export class ActionMenuItemView extends TextView {
    
    async render(node, parentType) {
        const attr = node.attributes;
        const viewId = attr.id ? attr.id.replace('@+id/', '') : 'NO_ID';
        
        LogManager.v('ActionMenuItemView', `Inflating ActionMenuItem [${viewId}]`);

        // menu item usually -> wrap_content
        if (!node.attributes.layout_width) node.attributes.layout_width = 'wrap_content';
        if (!node.attributes.layout_height) node.attributes.layout_height = 'match_parent';

        // 1. Base Render (Text)
        let html = await super.render(node, parentType);
        
        const iconRef = attr['android:icon'] || attr['icon'];
        const title = attr['android:title'] || attr['title'] || '';
        
        // 2. Icon Processing
        let iconHtml = '';
        if (iconRef) {
            LogManager.d('ActionMenuItemView', `[${viewId}] Loading icon: ${iconRef}`);
            const tint = attr['app:iconTint'] || attr['android:iconTint'] || '#FFFFFF'; // Default White for Toolbar
            iconHtml = await this._renderDrawable(iconRef, tint, '24px', '24px');
        }

        // 3. Display Logic (Toolbar Mode vs Popup Mode)
        const content = iconRef 
            ? `<div class="icon-container">${iconHtml}</div>` 
            : `<span class="menu-title">${title}</span>`;

        // 4. Styles
        const itemStyle = `
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0 12px;
            min-width: 48px; /* Minimum touch target */
            height: 100%;
            cursor: pointer;
            background: transparent;
            transition: background-color 0.2s;
            border-radius: 50%;
        `;

        const rippleEffect = `onmousedown="this.style.backgroundColor='rgba(255,255,255,0.1)'" onmouseup="this.style.backgroundColor='transparent'" onmouseleave="this.style.backgroundColor='transparent'"`;

        // Override the inner HTML of the base TextView
        const idStr = attr.id ? `id="${attr.id.replace('@+id/', '')}"` : '';

        return `
            <div class="android-view action-menu-item" ${idStr} style="${itemStyle}" ${rippleEffect} title="${title}">
                ${content}
            </div>
        `;
    }
}