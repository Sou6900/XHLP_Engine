import { BaseView } from './BaseView.js';
import { LogManager } from '../../core/LogManager.js';

export class RecyclerView extends BaseView {
    
    async render(node, parentType) {
        const attr = node.attributes;
        const viewId = attr.id ? attr.id.replace('@+id/', '') : 'NO_ID';
        
        LogManager.v('RecyclerView', `Inflating RecyclerView [${viewId}]`);

        const baseStyle = await this.getBaseStyles(attr, parentType);
        
        let contentHtml = '';

        // 1. Check tools:listitem
        const listItemRef = attr['tools:listitem'] || attr['listitem'];
        const itemCount = parseInt(attr['tools:itemCount'] || attr['itemCount'] || '5');

        if (listItemRef && listItemRef.startsWith('@layout/')) {
            const layoutName = listItemRef.replace('@layout/', '');
            LogManager.d('RecyclerView', `[${viewId}] Loading item layout: ${layoutName} (Count: ${itemCount})`);
            
            // Fetch Layout XML
            const layoutXml = await this.resolver.context.getLayout(layoutName);
            
            if (layoutXml) {
                if (this.renderSubLayout) {
                    const itemHtml = await this.renderSubLayout(layoutXml);
                    
                    LogManager.i('RecyclerView', `[${viewId}] Successfully inflated item layout: ${layoutName}`);
                    
                    // Repeat items
                    for(let i=0; i<itemCount; i++) {
                        contentHtml += `<div class="recycler-item" style="border-bottom:1px solid #eee;">${itemHtml}</div>`;
                    }
                } else {
                    LogManager.w('RecyclerView', `[${viewId}] PreviewEngine callback missing. Cannot render sub-layout.`);
                    contentHtml = `<div style="padding:20px; color:#888;">Loaded: ${layoutName} (Engine link missing)</div>`;
                }

            } else {
                LogManager.e('RecyclerView', `[${viewId}] Layout resource not found: ${layoutName}`);
                contentHtml = `<div style="padding:20px; text-align:center; color:#ccc;">Layout not found: ${layoutName}</div>`;
            }
        } else {
            LogManager.d('RecyclerView', `[${viewId}] No listitem defined. Using default placeholder.`);
            
            // Default placeholder
            for(let i=1; i<=itemCount; i++) {
                contentHtml += `
                    <div style="padding: 15px; border-bottom: 1px solid #eee; display: flex; align-items: center;">
                        <div style="width: 40px; height: 40px; background: #e0e0e0; border-radius: 50%; margin-right: 15px;"></div>
                        <div style="flex: 1;">
                            <div style="height: 12px; width: 60%; background: #e0e0e0; margin-bottom: 8px;"></div>
                            <div style="height: 10px; width: 40%; background: #f0f0f0;"></div>
                        </div>
                    </div>
                `;
            }
        }

        const id = attr.id ? `id="${attr.id.replace('@+id/', '')}"` : '';

        return `
            <div ${id} class="android-view recycler-view" style="${baseStyle} overflow-y: auto; display: block;">
                ${contentHtml}
            </div>
        `;
    }
}