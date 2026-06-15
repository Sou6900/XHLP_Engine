// GuidelineResolver.js
import { LogManager } from '../../core/LogManager.js';

export class GuidelineResolver {
    constructor(solver) {
        this.solver = solver;
        this.helper = solver.helper;
        this.TAG = 'GuidelineResolver';
    }

    resolve(children) {
        LogManager.v(this.TAG, '─── Phase 1: Resolving Guidelines ───');

        children.forEach(node => {
            const rawId = this.helper.getId(node);
            const id = rawId ? rawId.trim() : null;
            
            if (!id) return;
            
            const isGuideline = node.type.split('.').pop() === 'Guideline';
            
            const state = {
                node, id, x: 0, y: 0, w: 0, h: 0,
                isGuideline, guideX: null, guideY: null,
                solvedX: false, solvedY: false
            };

            if (isGuideline) {
                const orient = this.helper.getAttr(node.attributes, 'orientation');
                const begin = this.helper.getAttr(node.attributes, 'layout_constraintGuide_begin');
                const end = this.helper.getAttr(node.attributes, 'layout_constraintGuide_end');
                const percent = this.helper.getAttr(node.attributes, 'layout_constraintGuide_percent');

                // Check for ambiguous definitions
                if ((begin && end) || (begin && percent) || (end && percent)) {
                    LogManager.w(this.TAG, `[Lint] Guideline ${id} has multiple position attributes (begin/end/percent). Using priority: begin > end > percent.`);
                }

                if (!orient) {
                     LogManager.e(this.TAG, `Guideline ${id} is missing 'android:orientation' attribute.`);
                }

                if (orient === 'vertical') {
                    if (begin) {
                        state.guideX = this.solver.isRTL 
                            ? this.solver.parentW - this.helper.parsePx(begin) 
                            : this.helper.parsePx(begin);
                        LogManager.v(this.TAG, `Guideline ${id} (Vertical) set at ${begin} from start.`);
                    } else if (end) {
                        state.guideX = this.solver.isRTL 
                            ? this.helper.parsePx(end) 
                            : this.solver.parentW - this.helper.parsePx(end);
                        LogManager.v(this.TAG, `Guideline ${id} (Vertical) set at ${end} from end.`);
                    } else if (percent) {
                        const pVal = parseFloat(percent);
                        state.guideX = this.solver.isRTL 
                            ? this.solver.parentW * (1 - pVal) 
                            : this.solver.parentW * pVal;
                        LogManager.v(this.TAG, `Guideline ${id} (Vertical) set at ${pVal * 100}%`);
                    } else {
                        LogManager.w(this.TAG, `Guideline ${id} (Vertical) has no position defined (begin/end/percent). Defaulting to 0.`);
                    }
                    
                    state.x = state.guideX || 0;
                    state.h = this.solver.parentH;
                    state.solvedX = true; 
                    state.solvedY = true;

                } else if (orient === 'horizontal') {
                    if (begin) {
                        state.guideY = this.helper.parsePx(begin);
                        LogManager.v(this.TAG, `Guideline ${id} (Horizontal) set at ${begin} from top.`);
                    } else if (end) {
                        state.guideY = this.solver.parentH - this.helper.parsePx(end);
                        LogManager.v(this.TAG, `Guideline ${id} (Horizontal) set at ${end} from bottom.`);
                    } else if (percent) {
                        state.guideY = this.solver.parentH * parseFloat(percent);
                        LogManager.v(this.TAG, `Guideline ${id} (Horizontal) set at ${parseFloat(percent) * 100}%`);
                    } else {
                        LogManager.w(this.TAG, `Guideline ${id} (Horizontal) has no position defined. Defaulting to 0.`);
                    }
                    
                    state.y = state.guideY || 0;
                    state.w = this.solver.parentW;
                    state.solvedY = true;
                    state.solvedX = true;
                } else {
                    LogManager.w(this.TAG, `Guideline ${id} has invalid orientation: '${orient}'. Expected 'vertical' or 'horizontal'.`);
                }
            }
            
            this.solver.nodeMap.set(id, state);
        });
    }
}