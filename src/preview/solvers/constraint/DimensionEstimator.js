// c2
import { TextMeasurer } from '../../text/TextMeasurer.js';
import { LogManager } from '../../core/LogManager.js'; 

export class DimensionEstimator {
    constructor(solver) {
        this.solver = solver;
        this.helper = solver.helper;
        this.measurer = new TextMeasurer();
        this.TAG = 'DimensionEstimator';
    }

    estimateAll(children) {
        LogManager.v(this.TAG, `Creating measurement estimates for ${children.length} views...`);

        children.forEach((node, index) => {
            const id = this.helper.getId(node);
            const state = this.solver.nodeMap.get(id);
            
            if (!state) {
                LogManager.w(this.TAG, `View #${index} (id: ${id}) has no state in Solver. Skipping.`);
                return;
            }
            
            if (state.isGuideline) {
                // Guidelines don't have dimension
                return;
            }

            // 1. Estimate Width (Clamp with maxWidth)
            state.w = this.estimateWidth(node);
            
            // 2. Estimate Height (Dynamic based on Text Size)
            state.h = this.estimateHeight(node, state.w); 
            
            // 3. Estimate Baseline (Robust logic for alignment)
            state.baseline = this.estimateBaseline(node, state.h);

            LogManager.v(this.TAG, `MEASURE: ${id} => [${state.w} x ${state.h}], baseline=${state.baseline}`);

            if (state.w === 0 && state.h === 0 && this.helper.getAttr(node.attributes, 'visibility') !== 'gone') {
                LogManager.w(this.TAG, `[Lint] View ${id} has 0x0 dimensions but is not GONE. It may not be visible.`);
            }
        });
    }

    estimateBaseline(node, containerH) {
        const type = node.type.split('.').pop();
        const attr = node.attributes;
        const id = this.helper.getId(node);
        
        // Logic 1: Text-based Views
        if (type === 'TextView' || type.includes('Button') || type.includes('EditText') || type.includes('RadioButton') || type.includes('CheckBox')) {
            const textSize = this.helper.parsePx(this.helper.getAttr(attr, 'textSize')) || 14;
            const p = this.helper.parsePx(this.helper.getAttr(attr, 'padding')) || 0;
            const pV = this.helper.parsePx(this.helper.getAttr(attr, 'paddingVertical')) || 0;
            const pt = this.helper.parsePx(this.helper.getAttr(attr, 'paddingTop')) || pV || p;

            const gravity = this.helper.getAttr(attr, 'gravity') || '';
            const isButton = type.includes('Button');
            const isCenterVertical = gravity.includes('center') || gravity.includes('center_vertical') || isButton;
            
            let baseline;
            if (isCenterVertical) {
                const ascent = textSize * 0.75; 
                baseline = (containerH / 2) + (ascent / 2); 
            } else {
                baseline = pt + (textSize * 0.75);
            }
            return baseline;
        }
        
        // Logic 2: Containers
        if (['ConstraintLayout', 'LinearLayout', 'FrameLayout', 'RelativeLayout'].includes(type)) {
            if (node.children && node.children.length > 0) {
                const pt = this.helper.parsePx(this.helper.getAttr(attr, 'paddingTop')) || 
                          this.helper.parsePx(this.helper.getAttr(attr, 'paddingVertical')) || 
                          this.helper.parsePx(this.helper.getAttr(attr, 'padding')) || 0;

                for (let child of node.children) {
                    if (child === node) continue;
                    if (this.helper.getAttr(child.attributes, 'visibility') === 'gone') continue;

                    const childAttr = child.attributes;
                    const mt = this.helper.parsePx(this.helper.getAttr(childAttr, 'layout_marginTop')) || 0;
                    const childH = this.estimateHeight(child, 0); 
                     
                    let childBase = this.estimateBaseline(child, childH);
                    if (childBase === undefined) childBase = childH; 

                    const topToTop = this.helper.getAttr(childAttr, 'layout_constraintTop_toTopOf');
                    const bottomToBottom = this.helper.getAttr(childAttr, 'layout_constraintBottom_toBottomOf');
                    const layoutGravity = this.helper.getAttr(childAttr, 'layout_gravity') || '';
                    const isLinearCenter = layoutGravity.includes('center') || layoutGravity.includes('center_vertical');

                    if ((topToTop === 'parent' && bottomToBottom === 'parent') || isLinearCenter) {
                        const childY = (containerH - childH) / 2;
                        LogManager.v(this.TAG, `Baseline for container ${id} determined by centered child.`);
                        return childY + childBase;
                    } else {
                        return pt + mt + childBase;
                    }
                }
            }
        }
        return containerH;
    }

    estimateWidth(node) {
        const type = node.type.split('.').pop();
        const id = this.helper.getId(node);
        
        if (type === 'Group' || type === 'Barrier' || type === 'Guideline' || type === 'Layer') return 0;

        const attr = node.attributes;
        if (this.helper.getAttr(attr, 'visibility') === 'gone') return 0;

        let measuredW = 100;

        // Container Width Logic
        if (['LinearLayout', 'ConstraintLayout', 'RelativeLayout', 'FrameLayout', 'CardView', 'ViewGroup', 'HorizontalScrollView', 'ScrollView', 'GridLayout'].includes(type)) {
            if (node.children) {
                let totalW = 0;
                let maxW = 0;
                const isVertical = (this.helper.getAttr(attr, 'orientation') || 'horizontal') === 'vertical';
                let isConstraintHorizontal = false;
                if (type === 'ConstraintLayout') {
                    isConstraintHorizontal = node.children.some(child => 
                        this.helper.getAttr(child.attributes, 'layout_constraintStart_toEndOf') || 
                        this.helper.getAttr(child.attributes, 'layout_constraintEnd_toStartOf') ||
                        this.helper.getAttr(child.attributes, 'layout_constraintLeft_toRightOf') ||
                        this.helper.getAttr(child.attributes, 'layout_constraintRight_toLeftOf')
                    );
                }

                const isStack = (type === 'LinearLayout' && !isVertical) || isConstraintHorizontal;

                node.children.forEach(child => {
                    if (child !== node && this.helper.getAttr(child.attributes, 'visibility') !== 'gone') {
                        const childW = this.estimateWidth(child);
                        const ml = this.helper.parsePx(this.helper.getAttr(child.attributes, 'layout_marginStart')) || 0;
                        const mr = this.helper.parsePx(this.helper.getAttr(child.attributes, 'layout_marginEnd')) || 0;
                        const actualChildW = childW + ml + mr;
                        
                        if (isStack) totalW += actualChildW;
                        else maxW = Math.max(maxW, actualChildW);
                    }
                });

                const p = this.helper.parsePx(this.helper.getAttr(attr, 'padding')) || 0;
                const pH = this.helper.parsePx(this.helper.getAttr(attr, 'paddingHorizontal')) || 0;
                const cp = this.helper.parsePx(this.helper.getAttr(attr, 'contentPadding')) || 0;
                const pl = this.helper.parsePx(this.helper.getAttr(attr, 'paddingLeft') || this.helper.getAttr(attr, 'paddingStart')) || pH || cp || p;
                const pr = this.helper.parsePx(this.helper.getAttr(attr, 'paddingRight') || this.helper.getAttr(attr, 'paddingEnd')) || pH || cp || p;

                const contentW = (isStack || type === 'GridLayout') ? totalW : maxW;
                
                if (type === 'GridLayout') {
                    const colCount = parseInt(this.helper.getAttr(attr, 'columnCount') || '1');
                    measuredW = Math.max(10, (maxW * colCount) + pl + pr);
                } else {
                    measuredW = Math.max(10, contentW + pl + pr);
                }
            } else {
                measuredW = 100;
            }
        }
        else if (type === 'ProgressBar') {
            measuredW = 50;
        }
        // Text/Button Width Logic
        else if (type === 'TextView' || type.includes('Button') || type.includes('Switch') || type.includes('CheckBox') || type.includes('RadioButton')) {
            let text = this._resolveText(node);
            const isButton = type.includes('Button');

            if (isButton || this.helper.getAttr(attr, 'textAllCaps') === 'true') {
                text = text ? text.toUpperCase() : '';
            }

            const result = this.measurer.measure(text, attr, this.solver.parentW);
            measuredW = result.width;

            if (isButton) {
                measuredW += 24; 
            } else if (type.includes('Switch') || type.includes('CheckBox') || type.includes('RadioButton')) {
                measuredW += 48; 
            }
        }

        // Apply explicit layout_width
        const wAttr = this.helper.getAttr(attr, 'layout_width');
        if (wAttr && wAttr !== 'wrap_content' && wAttr !== '0dp' && wAttr !== 'match_parent') {
            measuredW = this.helper.parsePx(wAttr);
        }

        // Apply Max Width Constraint
        const maxW = this.helper.parsePx(this.helper.getAttr(attr, 'maxWidth'));
        if (maxW && measuredW > maxW) {
            LogManager.d(this.TAG, `Constraint applied: ${id} maxWidth ${maxW}px < measured ${measuredW}px`);
            measuredW = maxW;
        }

        // Apply Min Width (Priority over Max)
        const minW = this.helper.parsePx(this.helper.getAttr(attr, 'minWidth'));
        if (minW && measuredW < minW) {
            LogManager.d(this.TAG, `Constraint applied: ${id} minWidth ${minW}px > measured ${measuredW}px`);
            measuredW = minW;
        }

        return Math.min(Math.max(0, Math.ceil(measuredW)), this.solver.parentW);
    }

    estimateHeight(node, calculatedWidth) {
        const type = node.type.split('.').pop();
        const id = this.helper.getId(node);
        
        if (type === 'Group' || type === 'Barrier' || type === 'Guideline' || type === 'Layer') return 0;

        const attr = node.attributes;
        if (this.helper.getAttr(attr, 'visibility') === 'gone') return 0;

        // Use explicit height if available
        const hAttr = this.helper.getAttr(attr, 'layout_height');
        if (hAttr && hAttr !== 'wrap_content' && hAttr !== 'match_parent' && hAttr !== '0dp') {
            return this.helper.parsePx(hAttr);
        }

        // Min Height for controls
        if (type.includes('Switch') || type.includes('CheckBox') || type.includes('RadioButton')) {
            const minH = this.helper.parsePx(this.helper.getAttr(attr, 'minHeight')) || 0;
            return Math.max(32, minH);
        }

        // Container Height Logic
        if (node.children && ['LinearLayout', 'ConstraintLayout', 'RelativeLayout', 'FrameLayout', 'CardView', 'ViewGroup', 'HorizontalScrollView', 'ScrollView', 'GridLayout'].includes(type)) {
            let totalH = 0;
            let maxH = 0;
            const isVertical = (this.helper.getAttr(attr, 'orientation') || 'horizontal') === 'vertical';
            const isStack = type === 'LinearLayout' && isVertical;

            const p = this.helper.parsePx(this.helper.getAttr(attr, 'padding')) || 0;
            const pV = this.helper.parsePx(this.helper.getAttr(attr, 'paddingVertical')) || 0;
            const cp = this.helper.parsePx(this.helper.getAttr(attr, 'contentPadding')) || 0;
            const pt = this.helper.parsePx(this.helper.getAttr(attr, 'paddingTop')) || pV || cp || p;
            const pb = this.helper.parsePx(this.helper.getAttr(attr, 'paddingBottom')) || pV || cp || p;

            if (isVertical && type === 'LinearLayout') {
                node.children.forEach(child => {
                    if (child !== node && this.helper.getAttr(child.attributes, 'visibility') !== 'gone') {
                        const childH = this.estimateHeight(child, calculatedWidth);
                        const mt = this.helper.parsePx(this.helper.getAttr(child.attributes, 'layout_marginTop')) || 0;
                        const mb = this.helper.parsePx(this.helper.getAttr(child.attributes, 'layout_marginBottom')) || 0;
                        totalH += childH + mt + mb;
                    }
                });
                return Math.max(20, totalH + pt + pb);
            }

            node.children.forEach(child => {
                if (child !== node && this.helper.getAttr(child.attributes, 'visibility') !== 'gone') {
                    const childH = this.estimateHeight(child, calculatedWidth);
                    const mt = this.helper.parsePx(this.helper.getAttr(child.attributes, 'layout_marginTop')) || 0;
                    const mb = this.helper.parsePx(this.helper.getAttr(child.attributes, 'layout_marginBottom')) || 0;
                    const actualChildH = childH + mt + mb;
                    if (isStack) totalH += actualChildH;
                    else maxH = Math.max(maxH, actualChildH);
                }
            });
            const contentH = isStack ? totalH : maxH;
            return Math.max(20, contentH + pt + pb);
        }

        if (type === 'ProgressBar') return 50;

        // Accurate Text Height Calculation (Instead of hardcoded 50)
        if (type === 'TextView' || type.includes('Button') || type.includes('EditText')) {
            const textSize = this.helper.parsePx(this.helper.getAttr(attr, 'textSize')) || 14;
            const p = this.helper.parsePx(this.helper.getAttr(attr, 'padding')) || 0;
            const pV = this.helper.parsePx(this.helper.getAttr(attr, 'paddingVertical')) || 0;
            const pt = this.helper.parsePx(this.helper.getAttr(attr, 'paddingTop')) || pV || p;
            const pb = this.helper.parsePx(this.helper.getAttr(attr, 'paddingBottom')) || pV || p;
            
            // Approximation: Line Height ~ 1.4x Text Size
            return Math.ceil((textSize * 1.4) + pt + pb);
        }

        return 50; // Ultimate fallback
    }

    _resolveText(node) {
        const raw = this.helper.getAttr(node.attributes, 'text') || '';
        
        // ⚠ Android Lint: Hardcoded text
        if (raw && !raw.startsWith('@string/') && raw.length > 0) {
            // LogManager.w(this.TAG, `[Lint] Hardcoded text found in ${this.helper.getId(node)}: "${raw}". Should use @string resource.`);
        }

        return this.solver.resolver ? this.solver.resolver.resolveString(raw) : raw;
    }
}