import { BaseView } from '../widgets/BaseView.js';
import { LogManager } from '../../core/LogManager.js';

export class GridLayout extends BaseView {
    constructor(resolver) {
        super(resolver);
    }

    render(node, renderChildCallback, parentType) {
        return this.renderWithBounds(node, null, null, renderChildCallback, parentType);
    }

    async renderWithBounds(node, width, height, renderChildCallback, parentType) {
        const TAG = 'GridLayout';
        const attr = node.attributes;
        
        LogManager.d(TAG, 'Rendering GridLayout structure...');

        const baseStyle = await this.getBaseStyles(attr, parentType || 'ViewGroup');
        const get = (name) => attr[name] || attr[`android:${name}`] || attr[`app:${name}`];

        // 1. Grid Configuration
        const columnCount = parseInt(get('columnCount') || '1');
        const rowCount = parseInt(get('rowCount') || '0');
        const orientation = get('orientation') || 'horizontal';

        LogManager.i(TAG, `Configuration: Columns=${columnCount}, Rows=${rowCount}, Orientation=${orientation}`);

        // 2. Weight Calculation (CSS Grid Template)
        let colTemplates = new Array(columnCount).fill('auto');
        
        let currentCol = 0;
        node.children.forEach((child, index) => {
            const childAttr = child.attributes;
            const cGet = (n) => childAttr[n] || childAttr[`android:${n}`] || childAttr[`app:${n}`];
            
            const explicitCol = parseInt(cGet('layout_column'));
            if (!isNaN(explicitCol)) currentCol = explicitCol;

            const weight = parseFloat(cGet('layout_columnWeight') || '0');
            const span = parseInt(cGet('layout_columnSpan') || '1');

            if (weight > 0) {
                LogManager.v(TAG, `Child #${index} has weight ${weight} at col ${currentCol}`);
                for (let i = 0; i < span; i++) {
                    if ((currentCol + i) < columnCount) {
                        colTemplates[currentCol + i] = `${weight}fr`; 
                    }
                }
            }
            
            currentCol += span;
            if (currentCol >= columnCount) currentCol = 0;
        });

        // If all columns are auto but we have items, default to 1fr to spread if needed, or keep auto
        // Better: layout_columnWeight usually implies equal width distribution if set to 1.
        
        const gridTemplateColumns = colTemplates.join(' ');
        LogManager.v(TAG, `Final Grid Template Columns: [${gridTemplateColumns}]`);

        const gridStyle = `
            display: grid;
            grid-template-columns: ${gridTemplateColumns};
            ${rowCount > 0 ? `grid-template-rows: repeat(${rowCount}, auto);` : ''}
            grid-auto-flow: ${orientation === 'vertical' ? 'column' : 'row'};
        `;

        // 3. Render Children
        const childrenHtmlArray = await Promise.all(node.children.map(async (child, idx) => {
            let html = await renderChildCallback(child, 'GridLayout');

            const cAttr = child.attributes;
            const cGet = (n) => cAttr[n] || cAttr[`android:${n}`] || cAttr[`app:${n}`];

            const row = cGet('layout_row');
            const col = cGet('layout_column');
            const rowSpan = cGet('layout_rowSpan') || '1';
            const colSpan = cGet('layout_columnSpan') || '1';
            const colWeight = parseFloat(cGet('layout_columnWeight') || '0');
            const rowWeight = parseFloat(cGet('layout_rowWeight') || '0');
            
            // --- Gravity Logic (Alignment) ---
            const gravity = cGet('layout_gravity') || '';
            let justify = 'stretch'; 
            let align = 'stretch';

            // Horizontal Gravity
            if (gravity.includes('left') || gravity.includes('start')) justify = 'start';
            else if (gravity.includes('right') || gravity.includes('end')) justify = 'end';
            else if (gravity.includes('center_horizontal')) justify = 'center';
            else if (gravity.includes('fill_horizontal') || gravity.includes('fill')) justify = 'stretch';
            
            // Vertical Gravity
            if (gravity.includes('top')) align = 'start';
            else if (gravity.includes('bottom')) align = 'end';
            else if (gravity.includes('center_vertical')) align = 'center';
            else if (gravity.includes('fill_vertical') || gravity.includes('fill')) align = 'stretch';

            if (gravity === 'center') { justify = 'center'; align = 'center'; }

            // Log positioning details for complex grids
            if (row || col || rowSpan !== '1' || colSpan !== '1') {
                LogManager.v(TAG, `Child #${idx} Position: Row=${row || 'auto'}, Col=${col || 'auto'}, RowSpan=${rowSpan}, ColSpan=${colSpan}, Gravity=${gravity}`);
            }

            // Android Weight Behavior
            // If weight is used and no specific gravity prevents it, force fill the cell.
            // This overrides 'wrap_content' max-width behavior from BaseView.
            let sizeOverride = '';
            
            if (colWeight > 0 && justify === 'stretch') {
                sizeOverride += 'width: 100% !important;';
            }
            if (rowWeight > 0 && align === 'stretch') {
                sizeOverride += 'height: 100% !important;';
            }

            let childStyle = `
                ${row ? `grid-row-start: ${parseInt(row) + 1};` : ''}
                ${col ? `grid-column-start: ${parseInt(col) + 1};` : ''}
                grid-row-end: span ${rowSpan};
                grid-column-end: span ${colSpan};
                justify-self: ${justify} !important;
                align-self: ${align} !important;
                max-width: 100%;
                ${sizeOverride}
            `;

            return html.replace('style="', `style="${childStyle} `);
        }));

        return `
            <div class="android-layout grid-layout" style="${baseStyle} ${gridStyle}">
                ${childrenHtmlArray.join('')}
            </div>
        `;
    }
}