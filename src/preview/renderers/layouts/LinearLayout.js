import { BaseView } from '../widgets/BaseView.js';
import { LinearSolver } from '../../solvers/LinearSolver.js';

export class LinearLayout extends BaseView {
    constructor(resolver) {
        super(resolver);
        this.solver = new LinearSolver();
    }

    render(node, renderChildCallback, parentType) {
        return this.renderWithBounds(node, 360, 640, renderChildCallback, parentType);
    }

    async renderWithBounds(node, width, height, renderChildCallback, parentType) {
        const attr = node.attributes;
        const baseStyle = await this.getBaseStyles(attr, parentType || 'ViewGroup');
        const get = (name) => attr[name] || attr[`android:${name}`] || attr[`app:${name}`];

        const orientation = get('orientation') || 'horizontal';
        const isVert = orientation === 'vertical';

        // Padding calculation
        const p = attr.padding;
        const pl = this._parseVal(attr.paddingLeft || attr.paddingStart || p);
        const pr = this._parseVal(attr.paddingRight || attr.paddingEnd || p);
        const pt = this._parseVal(attr.paddingTop || p);
        const pb = this._parseVal(attr.paddingBottom || p);

        const childAvailableW = (width || 360) - pl - pr;
        const childAvailableH = (height || 640) - pt - pb;
        
        // --- Gravity Handling ---
        const gravity = get('gravity') || '';
        let justify = 'flex-start'; // Main Axis alignment
        let align = 'flex-start';   // Cross Axis alignment

        //  Regex to specifically match word 'center' 
        // This avoids matching 'center_vertical' as just 'center'
        const isTrueCenter = /\bcenter\b/.test(gravity); 
        const isCenterH = gravity.includes('center_horizontal');
        const isCenterV = gravity.includes('center_vertical');
        const isEnd = gravity.includes('end') || gravity.includes('right');
        const isBottom = gravity.includes('bottom');
        
        if (isVert) {
            // Vertical Orientation
            // Main Axis = Vertical (justify-content)
            if (isBottom) justify = 'flex-end';
            else if (isCenterV || isTrueCenter) justify = 'center';
            
            // Cross Axis = Horizontal (align-items)
            if (isEnd) align = 'flex-end';
            else if (isCenterH || isTrueCenter) align = 'center';
        } else {
            // Horizontal Orientation
            // Main Axis = Horizontal (justify-content)
            if (isEnd) justify = 'flex-end';
            else if (isCenterH || isTrueCenter) justify = 'center';
            
            // Cross Axis = Vertical (align-items)
            if (isBottom) align = 'flex-end';
            else if (isCenterV || isTrueCenter) align = 'center';
        }

        // Baseline Alignment check
        const baselineAligned = get('baselineAligned') !== 'false';
        if (!isVert) {
            const hasGraphics = node.children.some(c => c.type.includes('CardView') || c.type.includes('ImageView') || c.type.includes('Layout'));
            if (baselineAligned && align === 'flex-start' && !hasGraphics) {
                align = 'baseline'; 
            }
        }

        let layoutStyle = `
            display: flex;
            flex-direction: ${isVert ? 'column' : 'row'};
            overflow: hidden;
            justify-content: ${justify};
            align-items: ${align};
        `;

        // Weight Sum Handling
        let totalWeight = parseFloat(get('weightSum') || '0');
        if (totalWeight === 0) {
            node.children.forEach(child => {
                const w = parseFloat(child.attributes['android:layout_weight'] || child.attributes['layout_weight'] || '0');
                totalWeight += w;
            });
        }

        const childrenHtmlArray = await Promise.all(node.children.map(async child => {
            let childHtml = await renderChildCallback(child, 'LinearLayout', childAvailableW, childAvailableH);
            const flexStyle = this.solver.getFlexStyle(child.attributes, orientation, gravity, totalWeight);
            const safetyStyle = `max-width: 100%;`; 
            
            // Inject align-self if child has layout_gravity override
            const childGravity = child.attributes['android:layout_gravity'] || child.attributes['layout_gravity'];
            let selfAlign = '';
            if (childGravity) {
                if (isVert) {
                    if (childGravity.includes('center')) selfAlign = 'align-self: center !important;';
                    if (childGravity.includes('end')) selfAlign = 'align-self: flex-end !important;';
                } else {
                    if (childGravity.includes('center')) selfAlign = 'align-self: center !important;';
                    if (childGravity.includes('bottom')) selfAlign = 'align-self: flex-end !important;';
                }
            }

            return childHtml.replace('style="', `style="${flexStyle} ${selfAlign} ${safetyStyle} `);
        }));
        
        return `
            <div class="android-layout linear-layout" style="${baseStyle} ${layoutStyle}">
                ${childrenHtmlArray.join('')}
            </div>
        `;
    }

    _parseVal(val) {
        if (!val) return 0;
        return parseFloat(this.converter.parse(val));
    }
}