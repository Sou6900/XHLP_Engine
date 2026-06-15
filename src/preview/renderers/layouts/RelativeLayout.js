import { ViewGroup } from '../widgets/ViewGroup.js';
import { RelativeSolver } from '../../solvers/RelativeSolver.js';
import { LogManager } from '../../core/LogManager.js';

export class RelativeLayout extends ViewGroup {
    constructor(resolver) {
        super(resolver);
        this.solver = new RelativeSolver();
    }

    render(node, renderChildCallback, parentType) {
        return this.renderWithBounds(node, 360, 640, renderChildCallback, parentType);
    }

    _getAttr(attr, name) {
        if (!attr) return null;
        return attr[name] || attr[`android:${name}`] || attr[`app:${name}`];
    }

    async renderWithBounds(node, width, height, renderChildCallback, parentType) {
        const TAG = 'RelativeLayout';
        const attr = node.attributes;
        const myId = this._getAttr(attr, 'id') || 'unknown';

        LogManager.d(TAG, `Initializing RelativeLayout (${myId})... Children count: ${node.children.length}`);

        const rawStyle = await this.getBaseStyles(attr, parentType || 'ViewGroup');
        
        // We want the Solver to handle all positioning (x, y) including padding.
        // If we keep CSS padding, it might shift absolute children incorrectly or cause double padding.
        const cleanStyle = rawStyle.split(';').filter(part => {
            const key = part.split(':')[0]?.trim();
            if (!key) return false;
            return !key.startsWith('padding') && // STRIP CSS PADDING
                   !key.startsWith('margin') && 
                   !key.startsWith('height') && 
                   (!key.startsWith('width') && !key.startsWith('min-') && !key.startsWith('max-')) &&
                   (!key.startsWith('border') || key.includes('radius') || key.includes('style') || key.includes('color') || key.includes('image')); 
        }).join('; ') + ';';

        let w = width || 360;
        let h = height || 640;

        // Respect Fixed Height/Width from XML explicitly
        const wAttr = this._getAttr(attr, 'layout_width');
        const hAttr = this._getAttr(attr, 'layout_height');

        LogManager.v(TAG, `Dimensions requested: W=${wAttr}, H=${hAttr}`);

        if (wAttr && wAttr !== 'match_parent' && wAttr !== 'wrap_content') {
            const parsed = this.parsePx(wAttr);
            if (parsed > 0) w = parsed;
        }
        if (hAttr && hAttr !== 'match_parent' && hAttr !== 'wrap_content') {
            const parsed = this.parsePx(hAttr);
            if (parsed > 0) h = parsed;
        }

        // Padding Logic for Solver
        const p = this._getAttr(attr, 'padding');
        const pl = this.parsePx(this._getAttr(attr, 'paddingLeft') || this._getAttr(attr, 'paddingStart') || p);
        const pt = this.parsePx(this._getAttr(attr, 'paddingTop') || p);
        const pr = this.parsePx(this._getAttr(attr, 'paddingRight') || this._getAttr(attr, 'paddingEnd') || p);
        const pb = this.parsePx(this._getAttr(attr, 'paddingBottom') || p);

        LogManager.v(TAG, `Padding Applied: [${pl}, ${pt}, ${pr}, ${pb}]`);

        const padding = { left: pl, top: pt, right: pr, bottom: pb };

        //️ SECURITY CHECK: Validate References (Android Studio Error Check)
        const childIds = new Set();
        node.children.forEach((child, i) => {
             const id = this._getAttr(child.attributes, 'id');
             if(id) childIds.add(id.replace(/@\+?id\//, ''));
        });

        // Auto IDs generation
        node.children.forEach((child, index) => {
            const hasId = child.attributes.id || child.attributes['android:id'];
            
            // Check references validity
            const rules = ['layout_below', 'layout_above', 'layout_toLeftOf', 'layout_toRightOf', 'layout_alignTop', 'layout_alignBottom'];
            rules.forEach(rule => {
                const target = this._getAttr(child.attributes, rule);
                if (target) {
                    const targetId = target.replace(/@\+?id\//, '');
                    if (!childIds.has(targetId) && targetId !== 'parent') {
                        LogManager.e(TAG, `❌ ERROR: View #${index} references non-existent ID '@id/${targetId}' in attribute '${rule}'`);
                    }
                }
            });

            if (!hasId) {
                child.attributes.id = `__auto_id_rel_${index}_${Date.now()}`;
                LogManager.v(TAG, `Auto-generated ID for child #${index}: ${child.attributes.id}`);
            }
        });

        const isWrapContent = hAttr === 'wrap_content';

        // SOLVE POSITIONS
        LogManager.d(TAG, 'Running RelativeSolver...');
        const solvedStyles = this.solver.solve(node.children, w, h, padding, isWrapContent);

        let cssHeight = '100%';
        if (isWrapContent) {
            let maxBottom = 0;
            solvedStyles.forEach(s => {
                const styleTop = s.css.match(/top:\s*([\d.]+)px/);
                const topVal = styleTop ? parseFloat(styleTop[1]) : 0;
                const bottom = topVal + s.height;
                if (bottom > maxBottom) maxBottom = bottom;
            });
            cssHeight = `${maxBottom + pb}px !important`;
            LogManager.i(TAG, `wrap_content calculated height: ${maxBottom + pb}px`);
        } 
        else if (hAttr !== 'match_parent' && hAttr !== 'fill_parent') {
            if (h > 0) cssHeight = `${h}px`;
        }

        const layoutStyle = `
            position: relative;
            overflow: hidden;
            width: 100%;
            height: ${cssHeight};
        `;

        const childrenHtmlArray = await Promise.all(node.children.map(async child => {
            const rawId = this._getAttr(child.attributes, 'id');
            const id = rawId?.replace(/@\+?id\//, '');
            
            let absStyle = 'position:absolute; left:0; top:0;';
            let childW = w; 
            let childH = h;

            if (id && solvedStyles.has(id)) {
                const solution = solvedStyles.get(id);
                absStyle = solution.css;
                childW = solution.width;
                childH = solution.height;
            } else {
                LogManager.w(TAG, `⚠️ Child '${id}' has no solved constraints. Defaulting to (0,0).`);
            }

            let html = await renderChildCallback(child, 'RelativeLayout', childW, childH); 
            
            return html.replace(/style="([^"]*)"/, (match, existingStyle) => {
                const cleanedStyle = existingStyle.replace(/margin[^;]+;/g, '');
                return `style="${absStyle} ${cleanedStyle}"`;
            });
        }));

        LogManager.i(TAG, 'RelativeLayout render complete.');

        return `
            <div class="android-layout relative-layout" style="${cleanStyle} ${layoutStyle}">
                ${childrenHtmlArray.join('')}
            </div>
        `;
    }

    parsePx(val) {
        if (!val) return 0;
        return parseFloat(this.converter.parse(val)) || 0;
    }
}