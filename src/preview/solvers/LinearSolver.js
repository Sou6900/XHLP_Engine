import { DensityConverter } from '../device/DensityConverter.js';
import { LogManager } from '../core/LogManager.js';

export class LinearSolver {
    constructor() {
        this.converter = new DensityConverter();
        this.TAG = 'LinearSolver';
    }

    _getAttr(attr, name) {
        if (attr[name]) return attr[name];
        if (attr[`android:${name}`]) return attr[`android:${name}`];
        if (attr[`app:${name}`]) return attr[`app:${name}`];
        return undefined;
    }

    getFlexStyle(childAttributes, parentOrientation, parentGravity, totalWeight = 0) {
        const isVertical = parentOrientation === 'vertical';
        const id = this._getAttr(childAttributes, 'id') || 'unknown_view';
        
        LogManager.v(this.TAG, `Calculating flex style for @+id/${id} (Orientation: ${parentOrientation})`);

        const weightAttr = this._getAttr(childAttributes, 'layout_weight');
        const weight = parseFloat(weightAttr || '0');
        
        let style = '';

        const widthAttr = this._getAttr(childAttributes, 'layout_width');
        const heightAttr = this._getAttr(childAttributes, 'layout_height');

        // ⚠ Android Studio Lint Warning: Nested Weights
        if (weight > 0 && totalWeight === 0) {
            LogManager.w(this.TAG, `[Lint] Nested weights are bad for performance. View @+id/${id} has layout_weight=${weight} but parent has no weightSum defined.`);
        }

        // --- 1. Calculate Margins First (Needed for Width Calculation) ---
        const mAll = this._getAttr(childAttributes, 'layout_margin');
        const mHoriz = this._getAttr(childAttributes, 'layout_marginHorizontal');
        const mVert = this._getAttr(childAttributes, 'layout_marginVertical');

        const mtAttr = this._getAttr(childAttributes, 'layout_marginTop') || mVert || mAll;
        const mbAttr = this._getAttr(childAttributes, 'layout_marginBottom') || mVert || mAll;
        const mStartAttr = this._getAttr(childAttributes, 'layout_marginStart') || mHoriz || mAll;
        const mEndAttr = this._getAttr(childAttributes, 'layout_marginEnd') || mHoriz || mAll;
        const mLeftAttr = this._getAttr(childAttributes, 'layout_marginLeft') || mHoriz || mAll;
        const mRightAttr = this._getAttr(childAttributes, 'layout_marginRight') || mHoriz || mAll;

        // Convert to numeric values for calc() logic
        const mtVal = this.parsePxVal(mtAttr);
        const mbVal = this.parsePxVal(mbAttr);
        const mlVal = this.parsePxVal(mStartAttr || mLeftAttr);
        const mrVal = this.parsePxVal(mEndAttr || mRightAttr);

        // --- 2. Cross Axis Alignment & Match Parent Fix ---
        if (isVertical) {
            if (widthAttr === 'match_parent') {
                // Subtract margins from 100% to prevent overflow
                const widthCalc = `calc(100% - ${mlVal + mrVal}px)`;
                style += `width: ${widthCalc} !important; align-self: stretch !important; `;
            }
        } else {
            if (heightAttr === 'match_parent') {
                const heightCalc = `calc(100% - ${mtVal + mbVal}px)`;
                style += `height: ${heightCalc} !important; align-self: stretch !important; `;
            }
        }

        const sizeAttr = isVertical ? heightAttr : widthAttr;
        const isZeroSize = sizeAttr === '0dp' || sizeAttr === '0px' || sizeAttr === '0';

        // --- 3. Main Axis Sizing (Flex behavior) ---
        if (weight > 0) {
            let flexBasis = 'auto'; 
            
            // ⚠ Android Studio Lint: Zero Sizing with Weight
            if (!isZeroSize) {
                const dimen = isVertical ? 'layout_height' : 'layout_width';
                LogManager.w(this.TAG, `[Lint] Suspicious size: View @+id/${id} uses layout_weight but ${dimen} is not '0dp'. This may cause performance issues.`);
            }

            if (isZeroSize) flexBasis = '0px'; 
            
            style += `flex: ${weight} ${weight} ${flexBasis} !important; `;
            
            if (isVertical) {
                style += isZeroSize ? `min-height: 0px !important;` : `min-height: min-content;`;
            } else {
                style += isZeroSize ? `min-width: 0px !important;` : `min-width: min-content;`;
            }
        } else {
            // No Weight
            
            // Allow shrinking for match_parent to prevent overflow
            // If match_parent is used in a horizontal layout with siblings, it forces overflow.
            // We set flex-shrink: 1 (via '0 1 auto') so it yields space to siblings.
            
            const isMatchParentMain = (!isVertical && widthAttr === 'match_parent') || 
                                      (isVertical && heightAttr === 'match_parent');
            
            const isWrapContent = sizeAttr === 'wrap_content';

            if (isMatchParentMain || isWrapContent) {
                 // Allow shrink
                 style += `flex: 0 1 auto !important; `;
            } else {
                 // Fixed size (e.g. 50dp) -> Don't grow, Don't shrink
                 style += `flex: 0 0 auto !important; `; 
            }
            
            if (isVertical && heightAttr === 'wrap_content') style += `min-height: min-content; `;
            else if (!isVertical && widthAttr === 'wrap_content') style += `min-width: min-content; `;
        }

        // --- 4. Enforce Fixed Dimensions ---
        // I skip this for match_parent to allow the calc() above or flex-shrink to work
        if (widthAttr && widthAttr !== 'match_parent' && widthAttr !== 'wrap_content' && widthAttr !== '0dp') {
             const w = this.parsePx(widthAttr);
             style += `width: ${w} !important; min-width: ${w} !important; max-width: ${w} !important; `;
        }
        
        if (heightAttr && heightAttr !== 'match_parent' && heightAttr !== 'wrap_content' && heightAttr !== '0dp') {
             const h = this.parsePx(heightAttr);
             style += `height: ${h} !important; min-height: ${h} !important; max-height: ${h} !important; `;
        }

        // --- 5. Max Constraints ---
        if (isVertical && widthAttr === 'wrap_content') style += 'max-width: 100%; ';
        if (!isVertical && heightAttr === 'wrap_content') style += 'max-height: 100%; ';

        // --- 6. Gravity / Align Self ---
        const layoutGravity = this._getAttr(childAttributes, 'layout_gravity');
        if (layoutGravity) {
            LogManager.v(this.TAG, `Applying layout_gravity='${layoutGravity}' to @+id/${id}`);
            
            let selfAlign = '';
            if (isVertical) {
                if (layoutGravity.includes('left') || layoutGravity.includes('start')) selfAlign = 'flex-start';
                else if (layoutGravity.includes('right') || layoutGravity.includes('end')) selfAlign = 'flex-end';
                else if (layoutGravity.includes('center_horizontal') || layoutGravity.includes('center')) selfAlign = 'center';
                else if (layoutGravity.includes('fill_horizontal') || layoutGravity.includes('fill')) selfAlign = 'stretch';
            } else {
                if (layoutGravity.includes('top')) selfAlign = 'flex-start';
                else if (layoutGravity.includes('bottom')) selfAlign = 'flex-end';
                else if (layoutGravity.includes('center_vertical') || layoutGravity.includes('center')) selfAlign = 'center';
                else if (layoutGravity.includes('fill_vertical') || layoutGravity.includes('fill')) selfAlign = 'stretch';
            }
            if (selfAlign) style += `align-self: ${selfAlign} !important;`;
        }

        // --- 7. Apply Margins ---
        if (mtAttr) style += `margin-top: ${mtVal}px !important;`;
        if (mbAttr) style += `margin-bottom: ${mbVal}px !important;`;
        if (mStartAttr) style += `margin-inline-start: ${mlVal}px !important;`;
        if (mEndAttr) style += `margin-inline-end: ${mrVal}px !important;`;
        
        // Fallbacks for physical margins
        if (!mStartAttr && mLeftAttr) style += `margin-left: ${mlVal}px !important;`;
        if (!mEndAttr && mRightAttr) style += `margin-right: ${mrVal}px !important;`;

        return style;
    }
    
    // Returns string '10px'
    parsePx(val) {
        if (!val) return '0px';
        const num = this.parsePxVal(val);
        return `${num}px`;
    }

    // Returns number 10
    parsePxVal(val) {
        if (!val) return 0;
        if (typeof val === 'number') return val;
        
        let res = val;
        // Use DensityConverter if available
        if (this.converter && (val.endsWith('dp') || val.endsWith('sp'))) {
            res = this.converter.parse(val); 
        } else if (val.endsWith('px')) {
            // Standard behavior
            res = val;
        } else {
            LogManager.w(this.TAG, `Invalid dimension format: '${val}'. Expected dp, sp, or px.`);
        }
        
        // Strip 'px' and parse float
        const parsed = parseFloat(String(res).replace('px', ''));
        return isNaN(parsed) ? 0 : parsed;
    }
}