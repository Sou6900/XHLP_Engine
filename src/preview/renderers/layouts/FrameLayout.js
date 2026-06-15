import { BaseView } from '../widgets/BaseView.js';
import { LogManager } from '../../core/LogManager.js';

export class FrameLayout extends BaseView {
    
    render(node, renderChildCallback, parentType) {
        return this.renderWithBounds(node, null, null, renderChildCallback, parentType);
    }

    async renderWithBounds(node, width, height, renderChildCallback, parentType) {
        const TAG = 'FrameLayout';
        const attr = node.attributes;
        const id = attr.id || attr['android:id'] || 'NO_ID';

        LogManager.d(TAG, `Rendering FrameLayout (${id})...`);

        const baseStyle = await this.getBaseStyles(attr, parentType || 'ViewGroup');

        // 1. Parse Margins & Padding
        const mLeft = this._parseVal(attr.layout_marginLeft || attr.layout_marginStart || attr.layout_margin);
        const mRight = this._parseVal(attr.layout_marginRight || attr.layout_marginEnd || attr.layout_margin);
        const mTop = this._parseVal(attr.layout_marginTop || attr.layout_margin);
        const mBottom = this._parseVal(attr.layout_marginBottom || attr.layout_margin);

        const pLeft = this._parseVal(attr.paddingLeft || attr.paddingStart || attr.padding || attr['app:contentPadding'] || attr.contentPadding);
        const pRight = this._parseVal(attr.paddingRight || attr.paddingEnd || attr.padding || attr['app:contentPadding'] || attr.contentPadding);
        const pTop = this._parseVal(attr.paddingTop || attr.padding || attr['app:contentPadding'] || attr.contentPadding);
        const pBottom = this._parseVal(attr.paddingBottom || attr.padding || attr['app:contentPadding'] || attr.contentPadding);

        LogManager.v(TAG, `Margins: [${mLeft}, ${mTop}, ${mRight}, ${mBottom}], Padding: [${pLeft}, ${pTop}, ${pRight}, ${pBottom}]`);

        // 2. Calculate My Dimensions
        // Check if width/height are explicitly provided (Nested View) or null (Root View)
        const isRootWidth = (width === null || width === undefined);
        const isRootHeight = (height === null || height === undefined);

        let myW = width || 360;
        let myH = height || 640;

        const attrW = this.parsePx(attr.layout_width);
        const attrH = this.parsePx(attr.layout_height);

        // Width Logic
        if (attrW > 0) {
            myW = attrW; 
        } else if (attr.layout_width === 'match_parent') {
            // Double Gap Issue : should know
            // Only subtract margins if we are calculating from root/screen dimensions.
            // If 'width' was passed (e.g. from ConstraintSolver), it already accounts for constraints/margins.
            if (isRootWidth) {
                myW = Math.max(0, myW - mLeft - mRight);
            }
        }

        // Height Logic
        if (attrH > 0) {
            myH = attrH;
        } else if (attr.layout_height === 'match_parent') {
            // Same logic for height
            if (isRootHeight) {
                myH = Math.max(0, myH - mTop - mBottom);
            }
        }
        
        LogManager.v(TAG, `Final Dimensions: ${myW}px x ${myH}px`);

        // 3. Calculate Child Dimensions
        const childW = Math.max(0, myW - pLeft - pRight);
        const childH = Math.max(0, myH - pTop - pBottom);

        const frameStyle = `
            display: grid;
            grid-template-columns: 100%;
            grid-template-rows: 100%;
            justify-items: stretch; 
            align-items: stretch;
        `;

        LogManager.v(TAG, `Processing ${node.children.length} children with FrameLayout gravity rules.`);

        const childrenHtmlArray = await Promise.all(node.children.map(async (child, idx) => {
            let html = await renderChildCallback(child, 'FrameLayout', childW, childH);

            const gravity = child.attributes['android:layout_gravity'] || child.attributes['layout_gravity'] || '';
            
            let justify = 'stretch';
            let align = 'stretch';

            if (gravity.includes('left') || gravity.includes('start')) justify = 'start';
            if (gravity.includes('right') || gravity.includes('end')) justify = 'end';
            if (gravity.includes('center_horizontal')) justify = 'center';
            if (gravity.includes('top')) align = 'start';
            if (gravity.includes('bottom')) align = 'end';
            if (gravity.includes('center_vertical')) align = 'center';
            if (gravity.includes('center') && !gravity.includes('_')) { justify = 'center'; align = 'center'; }

            if (gravity) LogManager.v(TAG, `Child #${idx} Gravity: '${gravity}' -> justify:${justify}, align:${align}`);

            const childOverride = `
                grid-area: 1 / 1; 
                justify-self: ${justify} !important; 
                align-self: ${align} !important;
                z-index: auto;
            `;

            return html.replace('style="', `style="${childOverride} `);
        }));

        // Added ID so BlueprintRenderer can find it
        const idStr = node.attributes.id ? `id="${node.attributes.id.replace('@+id/', '')}"` : '';

        return `
            <div class="android-layout frame-layout" ${idStr} style="${baseStyle} ${frameStyle}">
                ${childrenHtmlArray.join('')}
            </div>
        `;
    }

    parsePx(val) {
        if (!val) return 0;
        if (val === 'match_parent' || val === 'wrap_content') return 0;
        return parseFloat(this.converter.parse(val));
    }

    _parseVal(val) {
        if (!val) return 0;
        return parseFloat(this.converter.parse(val));
    }
}