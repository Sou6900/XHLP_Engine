// VerticalSolver,js
import { LogManager } from '../../core/LogManager.js';

export class VerticalSolver {
    constructor(solver) {
        this.solver = solver;
        this.helper = solver.helper;
        this.TAG = 'VerticalSolver';
    }

    solve(state, attr, isMeasuring = false) {
        const id = state.id || 'unknown';
        // LogManager.v(this.TAG, `Solving Vertical constraints for ${id}...`);

        if (state.node.type.includes('Barrier')) {
            this.solveBarrier(state, attr);
            return;
        }

        // 1. Baseline (Priority)
        const baselineToBaseline = this.helper.getAttr(attr, 'layout_constraintBaseline_toBaselineOf');
        if (baselineToBaseline) {
            const targetId = baselineToBaseline.replace(/@\+?id\//, '');
            const targetState = this.solver.nodeMap.get(targetId);

            // Check if target is GONE. If so, ignore baseline constraint.
            if (targetState && targetState.solvedY && !targetState.isGone) {
                const targetBase = targetState.baseline !== undefined ? targetState.baseline : targetState.h;
                let myBase = state.baseline;
                if (myBase === undefined) myBase = state.h;

                state.y = (targetState.y + targetBase) - myBase;
                state.solvedY = true;
                
                LogManager.i(this.TAG, `[Baseline] Aligned ${id} baseline to ${targetId}. Y=${state.y}`);
                return;
            } else {
                // If target not ready, wait. If target is GONE, fall through to anchors.
                if (targetState && targetState.isGone) {
                    LogManager.w(this.TAG, `[Baseline] Target ${targetId} is GONE. Ignoring baseline constraint for ${id}.`);
                    // Fall through to anchors (GONE baseline is invalid)
                } else {
                     if (!targetState) LogManager.w(this.TAG, `[Baseline] Target ${targetId} not found for ${id}.`);
                    return; 
                }
            }
        }

        // 2. Anchors
        const topToTop = this.helper.getAttr(attr, 'layout_constraintTop_toTopOf');
        const topToBottom = this.helper.getAttr(attr, 'layout_constraintTop_toBottomOf');
        const bottomToBottom = this.helper.getAttr(attr, 'layout_constraintBottom_toBottomOf');
        const bottomToTop = this.helper.getAttr(attr, 'layout_constraintBottom_toTopOf');

        let top = null, bottom = null;
        
        const topRef = topToTop || topToBottom;
        const topTargetId = (topRef || '').replace(/@\+?id\//, '');
        const topState = this.solver.nodeMap.get(topTargetId);
        
        let mt = this.helper.getMargin(attr, 'Top', topTargetId) || 0;
        
        // Check visibility directly to be safe
        const isTopGone = topState && this.helper.getAttr(topState.node.attributes, 'visibility') === 'gone';
        if (isTopGone) {
            const gm = this.helper.parsePx(this.helper.getAttr(attr, 'layout_goneMarginTop'));
            if (gm !== null) {
                mt = gm;
                LogManager.v(this.TAG, `[GoneMargin] Applied layout_goneMarginTop=${mt} to ${id} (Target: ${topTargetId})`);
            }
        }

        if (topToTop) {
            if (topToTop === 'parent') top = this.solver.padding.top;
            else if (topState && topState.solvedY) top = topState.y;
        } else if (topToBottom) {
            if (topState && topState.solvedY) top = topState.y + topState.h;
        }

        const botRef = bottomToBottom || bottomToTop;
        const botTargetId = (botRef || '').replace(/@\+?id\//, '');
        const botState = this.solver.nodeMap.get(botTargetId);

        let mb = this.helper.getMargin(attr, 'Bottom', botTargetId) || 0;
        
        const isBotGone = botState && this.helper.getAttr(botState.node.attributes, 'visibility') === 'gone';
        if (isBotGone) {
            const gm = this.helper.parsePx(this.helper.getAttr(attr, 'layout_goneMarginBottom'));
            if (gm !== null) {
                mb = gm;
                LogManager.v(this.TAG, `[GoneMargin] Applied layout_goneMarginBottom=${mb} to ${id} (Target: ${botTargetId})`);
            }
        }

        if (bottomToBottom) {
            if (bottomToBottom === 'parent') bottom = this.solver.parentH - this.solver.padding.bottom;
            else if (botState && botState.solvedY) bottom = botState.y + botState.h;
        } else if (bottomToTop) {
            if (botState && botState.solvedY) bottom = botState.y;
        }

        // Height & Pos
        const hAttr = this.helper.getAttr(attr, 'layout_height');
        const hasRatio = this.helper.getAttr(attr, 'layout_constraintDimensionRatio');

        if (hAttr === '0dp' || hAttr === 'match_constraint') {
            if (!hasRatio && top !== null && bottom !== null) {
                state.h = Math.max(0, bottom - top - mt - mb);
                LogManager.v(this.TAG, `[MatchConstraint] Set height of ${id} to ${state.h}px`);
            }
        } else if (hAttr === 'match_parent') {
            state.h = this.solver.parentH - (this.solver.padding.top + this.solver.padding.bottom + mt + mb);
        }

        if (top !== null && bottom !== null) {
            const bias = parseFloat(this.helper.getAttr(attr, 'layout_constraintVertical_bias') || '0.5');
            const space = (bottom - top) - state.h - mt - mb;
            state.y = top + mt + (space * bias);
            state.solvedY = true;
            LogManager.v(this.TAG, `[Centered] ${id} vertically centered with bias ${bias}. Y=${state.y}`);
        } else if (top !== null) {
            state.y = top + mt;
            state.solvedY = true;
        } else if (bottom !== null) {
            state.y = bottom - state.h - mb;
            state.solvedY = true;
        } else {
            if (!state.solvedY) {
                LogManager.w(this.TAG, `[Unconstrained] View ${id} has no vertical constraints. Jumping to top.`);
                state.y = this.solver.padding.top + mt;
                state.solvedY = true;
            }
        }
    }
    
    solveBarrier(state, attr) {
        const direction = this.helper.getAttr(attr, 'barrierDirection');
        const referencedIds = this.helper.getAttr(attr, 'constraint_referenced_ids');
        
        if (!referencedIds) {
            LogManager.e(this.TAG, `Barrier ${state.id} missing 'constraint_referenced_ids'`);
            return;
        }
        
        if (['top', 'bottom'].includes(direction)) {
            const ids = referencedIds.split(',').map(id => id.trim());
            let maxVal = -Infinity;
            let minVal = Infinity;
            let hasTarget = false;
            
            ids.forEach(refId => {
                const refState = this.solver.nodeMap.get(refId);
                const isGone = refState && this.helper.getAttr(refState.node.attributes, 'visibility') === 'gone';

                if (refState && refState.solvedY && !isGone) {
                    hasTarget = true;
                    if (direction === 'bottom') {
                        const bottomEdge = refState.y + refState.h;
                        if (bottomEdge > maxVal) maxVal = bottomEdge;
                    } else {
                        if (refState.y < minVal) minVal = refState.y;
                    }
                } else if (!refState) {
                    LogManager.w(this.TAG, `Barrier reference ${refId} not found.`);
                }
            });

            if (hasTarget) {
                state.y = (direction === 'bottom') ? maxVal : minVal;
                state.h = 0;
                state.solvedY = true;
                LogManager.d(this.TAG, `[Barrier] ${state.id} (${direction}) resolved at Y=${state.y}`);
            }
        }
    }
}