import { DensityConverter } from '../device/DensityConverter.js';
import { TextMeasurer } from '../text/TextMeasurer.js';
import { LogManager } from '../core/LogManager.js';

export class RelativeSolver {
    constructor() {
        this.converter = new DensityConverter();
        this.textMeasurer = new TextMeasurer();
        this.nodes = new Map();
        this.parentW = 0;
        this.parentH = 0;
        this.padding = { left: 0, top: 0, right: 0, bottom: 0 };
        this.TEXT_WIDTH_BIAS = 1.0; // Updated from 0.96
        
        // Android Logging Tag
        this.TAG = 'RelativeLayout';
        
        if (typeof document !== 'undefined') {
            this.canvas = document.createElement('canvas');
            this.ctx = this.canvas.getContext('2d');
        }
    }

    solve(children, parentW, parentH, padding, isWrapContentHeight = false) {
        this.parentW = parentW || 360;
        this.parentH = parentH || 640;
        this.padding = padding || { left: 0, top: 0, right: 0, bottom: 0 };
        this.nodes.clear();

        LogManager.v(this.TAG, `onMeasure: parent=[${this.parentW}, ${this.parentH}], children=${children.length}`);

        // 1. Measure & Register
        children.forEach(child => {
            const id = this._getId(child);
            const size = this._measureNode(child);
            const isGone = this._getAttr(child.attributes, 'visibility') === 'gone';
            
            const textSize = this._parsePx(this._getAttr(child.attributes, 'textSize') || '14sp');
            const baseline = this._estimateBaseline(child, textSize);

            // Check for Duplicate IDs (Android Lint)
            if (this.nodes.has(id)) {
                LogManager.e(this.TAG, `Duplicate id @+id/${id}, tag null, or parent id used with View.`);
            }

            this.nodes.set(id, {
                node: child,
                id: id,
                w: isGone ? 0 : size.w,
                h: isGone ? 0 : size.h,
                baseline: baseline,
                x: null, y: null,
                solvedX: false, solvedY: false,
                isGone: isGone,
                anchorRight: false, 
                rightMargin: 0,
                isStackX: false,
                isStackY: false
            });
        });

        // 2. Calculate Positions (X)
        this.nodes.forEach(node => {
            try {
                if (!node.solvedX) this._solveX(node);
            } catch (e) {
                LogManager.e(this.TAG, `Error solving Horizontal layout for ${node.id}: ${e.message}`);
            }
        });

        // 3. Constrain 'match_parent' width
        this.nodes.forEach(node => {
            if (node.isGone) return;
            const attr = node.node.attributes;
            const widthMode = this._getAttr(attr, 'layout_width');
            
            if (widthMode === 'match_parent') {
                const margins = this._getMargins(attr);
                const availableSpace = this.parentW - this.padding.right - node.x - margins.right;
                if (node.w > availableSpace) {
                    node.w = Math.max(0, availableSpace);
                }
            }
        });

        // 4. Re-measure Height
        this.nodes.forEach(node => {
            const attr = node.node.attributes;
            const widthMode = this._getAttr(attr, 'layout_width');
            const wasClamped = widthMode === 'match_parent'; 

            if (!node.isGone && (widthMode === 'wrap_content' || wasClamped)) {
                const pRight = this.parentW - this.padding.right;
                const availableSpace = pRight - node.x;
                
                if (node.w > availableSpace || wasClamped) {
                    const clampedWidth = Math.max(0, widthMode === 'wrap_content' ? availableSpace : node.w);
                    const newSize = this._measureNode(node.node, clampedWidth);
                    
                    node.w = clampedWidth; 
                    node.h = newSize.h;
                    const textSize = this._parsePx(this._getAttr(attr, 'textSize') || '14sp');
                    node.baseline = this._estimateBaseline(node.node, textSize);
                }
            }
        });

        // 5. Two-Pass Y Solving
        if (isWrapContentHeight) {
            this.nodes.forEach(node => {
                if (!this._isVerticalParentDependent(node)) {
                    this._solveY(node);
                }
            });

            let maxBottom = 0;
            // Pass 1: Check solved nodes
            this.nodes.forEach(node => {
                if (node.solvedY && !node.isGone) {
                    const margins = this._getMargins(node.node.attributes); // 🔥 Updated
                    const bottom = node.y + node.h + margins.bottom;
                    if (bottom > maxBottom) maxBottom = bottom;
                }
            });

            // Pass 2: Estimate dependent nodes
            this.nodes.forEach(node => {
                if (!node.isGone) {
                    const isDependent = this._isVerticalParentDependent(node);
                    if (isDependent) {
                        const margins = this._getMargins(node.node.attributes);
                        // Estimate minimal space needed
                        const minContentBottom = this.padding.top + margins.top + node.h + margins.bottom;
                        if (minContentBottom > maxBottom) maxBottom = minContentBottom;
                    }
                }
            });

            if (maxBottom > 0) {
                this.parentH = maxBottom + this.padding.bottom;
            }
        }

        this.nodes.forEach(node => {
            // Reset dependent nodes for final solve if height changed
            if (this._isVerticalParentDependent(node)) node.solvedY = false;
            try {
                if (!node.solvedY) this._solveY(node);
            } catch (e) {
                LogManager.e(this.TAG, `Error solving Vertical layout for ${node.id}: ${e.message}`);
            }
        });

        // 6. Generate CSS
        const styles = new Map();
        this.nodes.forEach(node => {
            // Validation Check
            if (isNaN(node.x) || isNaN(node.y)) {
                LogManager.w(this.TAG, `View ${node.id} has invalid coordinates (NaN). Defaulting to (0,0).`);
                node.x = node.x || 0;
                node.y = node.y || 0;
            }

            const display = node.isGone ? 'none !important' : 'flex';
            const attr = node.node.attributes;
            
            let cssLeft = `${node.x}px`;
            let cssTop = `${node.y}px`;
            let cssRight = 'auto'; 
            let cssWidth = `${node.w}px`;
            let cssHeight = `${node.h}px`;
            let cssMaxWidth = 'none';

            const widthMode = this._getAttr(attr, 'layout_width');
            const heightMode = this._getAttr(attr, 'layout_height');
            
            if (widthMode === 'wrap_content') {
                cssWidth = 'max-content';
                
                if (node.anchorRight) {
                    cssLeft = 'auto';
                    cssRight = `${this.padding.right + node.rightMargin}px`;
                    const availableSpace = this.parentW - this.padding.left - this.padding.right - node.rightMargin;
                    cssMaxWidth = `${Math.max(0, availableSpace)}px`;
                } else {
                    const availableSpace = this.parentW - this.padding.right - node.x;
                    cssMaxWidth = `${Math.max(0, availableSpace)}px`;
                }
            }

            if (heightMode === 'wrap_content') cssHeight = 'max-content';

            styles.set(node.id, {
                css: `
                    position: absolute !important;
                    left: ${cssLeft} !important;
                    right: ${cssRight} !important;
                    top: ${cssTop} !important;
                    width: ${cssWidth} !important;
                    max-width: ${cssMaxWidth} !important; 
                    height: ${cssHeight} !important;
                    margin: 0 !important;
                    transform: none !important; 
                    display: ${display};
                `,
                width: node.w,
                height: node.h
            });
        });

        LogManager.v(this.TAG, `onLayout: Solved ${styles.size} views.`);
        return styles;
    }

    _isVerticalParentDependent(node) {
        const attr = node.node.attributes;
        return this._getBool(attr, 'layout_centerVertical') ||
              this._getBool(attr, 'layout_centerInParent') ||
              this._getBool(attr, 'layout_alignParentBottom');
    }

    _measureNode(node, fixedWidthConstraint = null) {
        const attr = node.attributes;
        const wAttr = this._getAttr(attr, 'layout_width');
        const hAttr = this._getAttr(attr, 'layout_height');
        
        let w = fixedWidthConstraint || 0;
        let h = 0;

        const p = this._parsePx(this._getAttr(attr, 'padding'));
        const pH = this._parsePx(this._getAttr(attr, 'paddingHorizontal'));
        const pV = this._parsePx(this._getAttr(attr, 'paddingVertical'));

        const pl = this._parsePx(this._getAttr(attr, 'paddingLeft') || this._getAttr(attr, 'paddingStart')) || pH || p;
        const pr = this._parsePx(this._getAttr(attr, 'paddingRight') || this._getAttr(attr, 'paddingEnd')) || pH || p;
        const pt = this._parsePx(this._getAttr(attr, 'paddingTop')) || pV || p;
        const pb = this._parsePx(this._getAttr(attr, 'paddingBottom')) || pV || p;

        const margins = this._getMargins(attr);

        if (!fixedWidthConstraint) {
            if (wAttr === 'match_parent') {
                w = Math.max(0, this.parentW - (this.padding.left + this.padding.right) - margins.left - margins.right);
            } else if (wAttr && wAttr !== 'wrap_content') {
                w = this._parsePx(wAttr);
            }
        }
        
        if (hAttr === 'match_parent') {
            h = Math.max(0, this.parentH - (this.padding.top + this.padding.bottom) - margins.top - margins.bottom);
        } else if (hAttr && hAttr !== 'wrap_content') {
            h = this._parsePx(hAttr);
        }

        // --- MEASURE TEXT & BUTTONS ---
        if ((w === 0 || h === 0) && (node.type === 'TextView' || node.type === 'Button')) {
            let maxTextWidth = Number.MAX_SAFE_INTEGER;
            if (fixedWidthConstraint) maxTextWidth = fixedWidthConstraint;
            else if (wAttr === 'match_parent') maxTextWidth = w;
            else if (w > 0) maxTextWidth = w;

            let text = this._resolveText(node);
            text = text.replace(/\\n/g, '\n'); 
            const lines = text.split('\n');
            const lineCount = lines.length;

            let measureText = text;
            if (lineCount > 1) {
                measureText = lines.reduce((a, b) => a.length > b.length ? a : b);
            }

            const result = this.textMeasurer.measure(
                measureText, 
                attr, 
                maxTextWidth
            );

            if (w === 0) {
                w = Math.ceil(result.width) + 1; 
            }
            
            if (h === 0) {
                h = result.height;
                if (lineCount > 1) {
                    const textSizeVal = this._getAttr(attr, 'textSize') || '14sp';
                    const textSizePx = this._parsePx(textSizeVal);
                    const estimatedLineHeight = textSizePx * 1.35;
                    // Adjusted heuristic for multiline text height
                    if (h < (estimatedLineHeight * lineCount * 0.9)) {
                        h = estimatedLineHeight * lineCount;
                    }
                }
            }
            if (node.type === 'Button') {
                if (w < 88) w = 88;
                if (h < 48) h = 48;
            }
        }

        // --- MEASURE GROUPS (LinearLayout, RelativeLayout, etc) ---
        // Preserving this logic from the original file as it was missing in the simplified snippet
        if ((w === 0 || h === 0) && node.children && node.children.length > 0) {
            const type = node.type || '';
            
            if (type.includes('RelativeLayout')) {
                const availableW = (w > 0) ? w : this.parentW;
                const innerW = Math.max(0, availableW - pl - pr);
                
                // Recursively solve inner relative layout
                const simSolver = new this.constructor();
                simSolver.solve(node.children, innerW, Number.MAX_SAFE_INTEGER, {left:0, top:0, right:0, bottom:0});
                
                let maxBottom = 0; 
                let maxRight = 0;
                
                simSolver.nodes.forEach(n => {
                    if (!n.isGone) {
                        if (Number.isFinite(n.y) && n.y < 1000000) { 
                            const childMargins = this._getMargins(n.node.attributes);
                            const bottom = n.y + n.h + childMargins.bottom;
                            if (bottom > maxBottom) maxBottom = bottom;
                        }
                        if (Number.isFinite(n.x)) {
                            const childMargins = this._getMargins(n.node.attributes);
                            const right = n.x + n.w + childMargins.right;
                            if (right > maxRight) maxRight = right;
                        }
                    }
                });
                
                if (h === 0 && maxBottom > 0) h = pt + maxBottom + pb;
                if (w === 0 && maxRight > 0) w = pl + maxRight + pr;
            }
            else if (type.includes('LinearLayout')) {
                const orientation = this._getAttr(node.attributes, 'orientation') || 'horizontal';
                const isVert = orientation === 'vertical';
                let maxB = 0; let sumH = 0; let maxW = 0; let sumW = 0;
                
                node.children.forEach(c => {
                    const size = this._measureNode(c);
                    const childW = size.w;
                    const childH = size.h;
                    
                    const childMargins = this._getMargins(c.attributes);
                    const mt = childMargins.top;
                    const mb = childMargins.bottom;
                    const ml = childMargins.left;
                    const mr = childMargins.right;

                    const effectiveH = childH + mt + mb;
                    const effectiveW = childW + ml + mr;
                    
                    sumH += effectiveH;
                    if (effectiveH > maxB) maxB = effectiveH;
                    
                    sumW += effectiveW;
                    if (effectiveW > maxW) maxW = effectiveW;
                });
                
                if (h === 0) h = (isVert ? sumH : maxB) + pt + pb;
                if (w === 0) w = (isVert ? maxW : sumW) + pl + pr;
            }
        }

        if (w === 0) w = 50; 
        if (h === 0) h = 50;
        return { w, h };
    }

    _resolveText(node) {
        const raw = this._getAttr(node.attributes, 'text') || '';
        return this.textMeasurer ? raw : raw;
    }

    _solveX(node) {
        if (node.solvedX) return node.x;

        // Circular Dependency Detection
        if (node.isStackX) {
            LogManager.e(this.TAG, `Circular dependency detected (Horizontal) for view: ${node.id}`);
            return 0; // Break loop
        }
        node.isStackX = true;

        const attr = node.node.attributes;
        const availableWidth = (this.parentW - this.padding.right) - this.padding.left;
        
        let x = this.padding.left; 
        
        // Use centralized margins
        const margins = this._getMargins(attr);
        const ml = margins.left;
        const mr = margins.right;

        const toRightOf = this._getRef(attr, 'layout_toRightOf') || this._getRef(attr, 'layout_toEndOf');
        const toLeftOf = this._getRef(attr, 'layout_toLeftOf') || this._getRef(attr, 'layout_toStartOf');
        const alignLeft = this._getRef(attr, 'layout_alignLeft') || this._getRef(attr, 'layout_alignStart');
        const alignRight = this._getRef(attr, 'layout_alignRight') || this._getRef(attr, 'layout_alignEnd');
        const centerH = this._getBool(attr, 'layout_centerHorizontal');
        const centerInParent = this._getBool(attr, 'layout_centerInParent');
        const alignParentRight = this._getBool(attr, 'layout_alignParentRight') || this._getBool(attr, 'layout_alignParentEnd');
        const alignParentLeft = this._getBool(attr, 'layout_alignParentLeft') || this._getBool(attr, 'layout_alignParentStart');

        if (alignLeft) {
            const anchor = this._getNode(alignLeft);
            if(anchor) x = (anchor.solvedX ? anchor.x : this._solveX(anchor)) + ml;
            else x = this.padding.left + ml;
        }
        else if (alignRight) {
            const anchor = this._getNode(alignRight);
            if(anchor) x = (anchor.solvedX ? anchor.x : this._solveX(anchor)) + anchor.w - node.w - mr;
            else x = (this.parentW - this.padding.right) - node.w - mr;
        }
        else if (toRightOf) {
            const anchor = this._getNode(toRightOf);
            if(anchor) {
                const anchorX = anchor.solvedX ? anchor.x : this._solveX(anchor);
                x = anchorX + anchor.w + ml;
            }
            else x = this.padding.left + ml;
        }
        else if (toLeftOf) {
            const anchor = this._getNode(toLeftOf);
            if(anchor) x = (anchor.solvedX ? anchor.x : this._solveX(anchor)) - node.w - mr;
            else x = (this.parentW - this.padding.right) - node.w - mr;
        }
        else if (alignParentRight) {
            x = (this.parentW - this.padding.right) - node.w - mr;
            node.anchorRight = true;
            node.rightMargin = mr;
        }
        else if (alignParentLeft) {
            x = this.padding.left + ml;
        }
        else if (centerH || centerInParent) {
            const centerCalc = this.padding.left + (availableWidth - node.w) / 2;
            x = centerCalc + ml - mr;
        }
        else {
            x = this.padding.left + ml;
        }
        node.x = x;
        node.isStackX = false; // Reset Stack
        node.solvedX = true;
        return x;
    }

    _solveY(node) {
        if (node.solvedY) return node.y;

        if (node.isStackY) {
            LogManager.e(this.TAG, `Circular dependency detected (Vertical) for view: ${node.id}`);
            return 0; // Break loop
        }
        node.isStackY = true;

        const attr = node.node.attributes;
        const hAttr = this._getAttr(attr, 'layout_height');
        
        // centralized margins using
        const margins = this._getMargins(attr);
        const mt = margins.top;
        const mb = margins.bottom;

        const below = this._getRef(attr, 'layout_below');
        const above = this._getRef(attr, 'layout_above');
        const alignTop = this._getRef(attr, 'layout_alignTop');
        const alignBottom = this._getRef(attr, 'layout_alignBottom');
        const alignBaseline = this._getRef(attr, 'layout_alignBaseline');
        
        const parentTop = this._getBool(attr, 'layout_alignParentTop');
        const parentBottom = this._getBool(attr, 'layout_alignParentBottom');
        const centerV = this._getBool(attr, 'layout_centerVertical');
        const centerInParent = this._getBool(attr, 'layout_centerInParent');

        let topY = null;
        let bottomY = null;

        if (below) {
            const anchor = this._getNode(below);
            if (anchor) topY = (anchor.solvedY ? anchor.y : this._solveY(anchor)) + anchor.h + mt;
        } else if (alignTop) {
            const anchor = this._getNode(alignTop);
            if (anchor) topY = (anchor.solvedY ? anchor.y : this._solveY(anchor)) + mt;
        } else if (parentTop) {
            topY = this.padding.top + mt;
        }

        if (above) {
            const anchor = this._getNode(above);
            if (anchor) bottomY = (anchor.solvedY ? anchor.y : this._solveY(anchor)) - mb;
        } else if (alignBottom) {
            const anchor = this._getNode(alignBottom);
            if (anchor) bottomY = (anchor.solvedY ? anchor.y : this._solveY(anchor)) + anchor.h - mb;
        } else if (parentBottom) {
            bottomY = this.parentH - this.padding.bottom - mb;
        }

        if (hAttr === 'match_parent' && topY !== null && bottomY !== null) {
            node.y = topY;
            node.h = Math.max(0, bottomY - topY);
            node.isStackY = false;
            node.solvedY = true;
            return node.y;
        }

        if (topY !== null) {
            node.y = topY;
            node.isStackY = false;
            node.solvedY = true;
            return node.y;
        }
        
        if (bottomY !== null) {
            node.y = bottomY - node.h;
            node.isStackY = false;
            node.solvedY = true;
            return node.y;
        }

        if (alignBaseline) {
            const anchor = this._getNode(alignBaseline);
            if (anchor) {
                const anchorY = anchor.solvedY ? anchor.y : this._solveY(anchor);
                const anchorBaseline = anchor.baseline !== undefined ? anchor.baseline : this._estimateBaseline(anchor.node, 14);
                const myBaseline = node.baseline !== undefined ? node.baseline : this._estimateBaseline(node.node, 14);
                node.y = (anchorY + anchorBaseline) - myBaseline;
                node.isStackY = false;
                node.solvedY = true;
                return node.y;
            }
        }

        if (centerV || centerInParent) {
            const pTop = this.padding.top;
            const pBottom = this.parentH - this.padding.bottom;
            const availableHeight = pBottom - pTop;
            const centerCalc = pTop + (availableHeight - node.h) / 2;
            node.y = centerCalc + mt - mb;
            node.isStackY = false;
            node.solvedY = true;
            return node.y;
        }

        node.y = this.padding.top + mt;
        node.isStackY = false;
        node.solvedY = true;
        return node.y;
    }

    _estimateBaseline(node, textSize = 14) {
        const attr = node.attributes || {};
        const p = this._parsePx(this._getAttr(attr, 'padding'));
        const pV = this._parsePx(this._getAttr(attr, 'paddingVertical'));
        const pt = this._parsePx(this._getAttr(attr, 'paddingTop')) || pV || p;
        return pt + (textSize * 0.8);
    }

    _getMargins(attr) {
        const visibility = this._getAttr(attr, 'visibility');
        if (visibility === 'gone') return { left: 0, right: 0, top: 0, bottom: 0 };
        
        // Margin Horizontal/Vertical Support
        const mAll = this._parsePx(this._getAttr(attr, 'layout_margin'));
        const mHoriz = this._parsePx(this._getAttr(attr, 'layout_marginHorizontal'));
        const mVert = this._parsePx(this._getAttr(attr, 'layout_marginVertical'));

        const ml = this._parsePx(this._getAttr(attr, 'layout_marginStart') || this._getAttr(attr, 'layout_marginLeft')) || mHoriz || mAll;
        const mr = this._parsePx(this._getAttr(attr, 'layout_marginEnd') || this._getAttr(attr, 'layout_marginRight')) || mHoriz || mAll;
        const mt = this._parsePx(this._getAttr(attr, 'layout_marginTop')) || mVert || mAll;
        const mb = this._parsePx(this._getAttr(attr, 'layout_marginBottom')) || mVert || mAll;
        
        return { left: ml, right: mr, top: mt, bottom: mb };
    }

    _getNode(id) { 
        const node = this.nodes.get(id);
        if (!node) {
            LogManager.w(this.TAG, `No id found for view reference: @id/${id}. Make sure the ID is correct and the view exists in this RelativeLayout.`);
        }
        return node; 
    }
    _getId(node) {
        const raw = node.attributes.id || node.attributes['android:id'];
        return raw ? raw.replace(/@\+?id\//, '') : `__rel_unknown_${Math.random()}`;
    }
    _getAttr(attr, name) {
        if (!attr) return null;
        return attr[name] || attr[`android:${name}`];
    }
    _getBool(attr, name) { const val = this._getAttr(attr, name); return val === 'true'; }
    _getRef(attr, name) { const val = this._getAttr(attr, name); return val ? val.replace(/@\+?id\//, '') : null; }
    _parsePx(val) {
        if (!val) return 0;
        return parseFloat(this.converter.parse(val)) || 0;
    }
}