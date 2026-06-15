import { DensityConverter } from '../device/DensityConverter.js';
import { LogManager } from '../core/LogManager.js';

export class AttributeProcessor {
    constructor(resolver) {
        this.resolver = resolver;
        this.converter = new DensityConverter();
        this.TAG = 'AttributeProcessor';
    }

    process(attributes, parentType) { 
        const processed = {};
        const get = (key) => attributes[key] || attributes[`android:${key}`] || attributes[`app:${key}`];

        // 1. Core Dimensions
        processed.width = this._processSize(get('layout_width'), parentType, 'width');
        processed.height = this._processSize(get('layout_height'), parentType, 'height');

        processed.minWidth = this._processSize(get('minWidth'));
        processed.minHeight = this._processSize(get('minHeight'));
        processed.maxWidth = this._processSize(get('maxWidth'));
        processed.maxHeight = this._processSize(get('maxHeight'));

        // Check for missing mandatory attributes (Lint)
        if (!processed.width || !processed.height) {
            LogManager.w(this.TAG, `[Lint] View is missing layout_width or layout_height attributes.`);
        }

        // 2. Padding & Margin
        processed.padding = this._processPadding(attributes);
        processed.margin = this._processMargin(attributes);

        // 3. Background Processing
        const bg = get('background');
        if (bg) {
            const resolvedBg = this._resolveBackground(bg);
            if (resolvedBg.type === 'unknown') {
                LogManager.w(this.TAG, `[Resource] Could not resolve background: ${bg}`);
            }
            processed.background = resolvedBg;
        }
        
        // Capture Background Tint
        const bgTint = get('backgroundTint');
        if (bgTint) {
            processed.backgroundTint = this.resolver.resolveColor(bgTint);
        }
        
        // 4. Visibility & Alpha
        const visibility = get('visibility');
        if (visibility === 'gone') {
            processed.display = 'none';
            LogManager.v(this.TAG, 'View visibility set to GONE');
        } else if (visibility === 'invisible') {
            processed.visibility = 'hidden';
        }

        if (get('alpha')) processed.opacity = get('alpha');

        // 5. Gravity
        processed.gravity = get('gravity');
        processed.layout_gravity = get('layout_gravity');

        // 6. Elevation
        if (get('elevation')) {
            processed.elevation = get('elevation');
        }

        // 7. Transformation (Rotation, Scale, Translation)
        const rotation = get('rotation');
        const rotationX = get('rotationX');
        const rotationY = get('rotationY');
        const scaleX = get('scaleX');
        const scaleY = get('scaleY');
        const transX = get('translationX');
        const transY = get('translationY');

        let transform = '';
        if (rotation) transform += `rotate(${parseFloat(rotation)}deg) `;
        if (rotationX) transform += `rotateX(${parseFloat(rotationX)}deg) `;
        if (rotationY) transform += `rotateY(${parseFloat(rotationY)}deg) `;
        if (scaleX) transform += `scaleX(${parseFloat(scaleX)}) `;
        if (scaleY) transform += `scaleY(${parseFloat(scaleY)}) `;
        if (transX) transform += `translateX(${this.converter.parse(transX)}) `;
        if (transY) transform += `translateY(${this.converter.parse(transY)}) `;

        if (transform.length > 0) {
            processed.transform = transform.trim();
            LogManager.v(this.TAG, `Applied transform: ${processed.transform}`);
        }

        return processed;
    }

    // --- Helpers ---

    _processSize(val, parentType, dimension) {
        if (!val) return null;
        
        if (val.startsWith('?')) return null;
        
        if (val === 'match_parent' || val === 'fill_parent') return '100%';
        if (val === 'wrap_content') {
            if (parentType === 'LinearLayout') return 'auto';
            return 'max-content'; 
        }
        
        // Check for invalid values
        const parsed = this.converter.parse(val);
        if (parsed === '0px' && val !== '0dp' && val !== '0px') {
             // If parsing resulted in 0 but input wasn't 0, likely an error (e.g. "10dp" missing 'p')
             // LogManager.w(this.TAG, `[Lint] Invalid dimension format for ${dimension}: '${val}'.`);
        }
        return parsed;
    }

    _processPadding(attr) {
        const get = (k) => attr[k] || attr[`android:${k}`];
        const style = {};
        const p = get('padding');
        const pl = get('paddingLeft') || get('paddingStart');
        const pt = get('paddingTop');
        const pr = get('paddingRight') || get('paddingEnd');
        const pb = get('paddingBottom');
        const ph = get('paddingHorizontal');
        const pv = get('paddingVertical');

        if (p) style.all = this.converter.parse(p);
        if (pl) style.left = this.converter.parse(pl);
        if (pt) style.top = this.converter.parse(pt);
        if (pr) style.right = this.converter.parse(pr);
        if (pb) style.bottom = this.converter.parse(pb);
        if (ph) {
            const val = this.converter.parse(ph);
            style.left = val; style.right = val;
        }
        if (pv) {
            const val = this.converter.parse(pv);
            style.top = val; style.bottom = val;
        }
        return style;
    }

    _processMargin(attr) {
        const get = (k) => attr[k] || attr[`android:${k}`];
        const style = {};
        const m = get('layout_margin');
        const ml = get('layout_marginLeft') || get('layout_marginStart');
        const mt = get('layout_marginTop');
        const mr = get('layout_marginRight') || get('layout_marginEnd');
        const mb = get('layout_marginBottom');
        const mh = get('layout_marginHorizontal');
        const mv = get('layout_marginVertical');

        if (m) style.all = this.converter.parse(m);
        if (ml) style.left = this.converter.parse(ml);
        if (mt) style.top = this.converter.parse(mt);
        if (mr) style.right = this.converter.parse(mr);
        if (mb) style.bottom = this.converter.parse(mb);
        if (mh) {
            const val = this.converter.parse(mh);
            style.left = val; style.right = val;
        }
        if (mv) {
            const val = this.converter.parse(mv);
            style.top = val; style.bottom = val;
        }
        return style;
    }

    _resolveBackground(bgVal) {
        if (!bgVal) return null;
        if (bgVal.startsWith('#') || bgVal.startsWith('@color/') || bgVal.startsWith('@android:color/')) {
            return { type: 'color', value: this.resolver.resolveColor(bgVal) };
        }
        if (bgVal.startsWith('@drawable/')) {
            return { type: 'drawable', value: bgVal };
        }
        return { type: 'unknown', value: bgVal };
    }
}