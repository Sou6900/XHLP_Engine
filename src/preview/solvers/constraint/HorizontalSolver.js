// HorizontalSolver.js
import { LogManager } from '../../core/LogManager.js';

export class HorizontalSolver {
    constructor(solver) {
        this.solver = solver;
        this.helper = solver.helper;
        this.TAG = 'HorizontalSolver';
    }

    solve(state, attr) {
        const id = state.id || 'unknown';
        
        if (state.node.type.includes('Barrier')) {
            this.solveBarrier(state, attr);
            return;
        }

        const startToStart = this.helper.getAttr(attr, 'layout_constraintStart_toStartOf');
        const startToEnd = this.helper.getAttr(attr, 'layout_constraintStart_toEndOf');
        const endToEnd = this.helper.getAttr(attr, 'layout_constraintEnd_toEndOf');
        const endToStart = this.helper.getAttr(attr, 'layout_constraintEnd_toStartOf');
        const leftToLeft = this.helper.getAttr(attr, 'layout_constraintLeft_toLeftOf');
        const leftToRight = this.helper.getAttr(attr, 'layout_constraintLeft_toRightOf');
        const rightToRight = this.helper.getAttr(attr, 'layout_constraintRight_toRightOf');
        const rightToLeft = this.helper.getAttr(attr, 'layout_constraintRight_toLeftOf');

        let anchorLeft = null, anchorRight = null;
        let targetLeftId = null, targetRightId = null;

        if (this.solver.isRTL) {
            const refRight = startToStart || startToEnd || rightToRight || rightToLeft;
            if (refRight) {
                targetRightId = refRight.replace(/@\+?id\//, '').trim();
                if (startToStart || rightToRight) anchorRight = this.solver.getPos(refRight, 'right');
                else if (startToEnd || rightToLeft) anchorRight = this.solver.getPos(refRight, 'left');
            }

            const refLeft = endToEnd || endToStart || leftToLeft || leftToRight;
            if (refLeft) {
                targetLeftId = refLeft.replace(/@\+?id\//, '').trim();
                if (endToEnd || leftToLeft) anchorLeft = this.solver.getPos(refLeft, 'left');
                else if (endToStart || leftToRight) anchorLeft = this.solver.getPos(refLeft, 'right');
            }
        } else {
            const refLeft = startToStart || startToEnd || leftToLeft || leftToRight;
            if (refLeft) {
                targetLeftId = refLeft.replace(/@\+?id\//, '').trim();
                if (startToStart || leftToLeft) anchorLeft = this.solver.getPos(refLeft, 'left');
                else if (startToEnd || leftToRight) anchorLeft = this.solver.getPos(refLeft, 'right');
            }

            const refRight = endToEnd || endToStart || rightToRight || rightToLeft;
            if (refRight) {
                targetRightId = refRight.replace(/@\+?id\//, '').trim();
                if (endToEnd || rightToRight) anchorRight = this.solver.getPos(refRight, 'right');
                else if (endToStart || rightToLeft) anchorRight = this.solver.getPos(refRight, 'left');
            }
        }

        // Margins
        let mL = 0, mR = 0;
        
        const leftState = this.solver.nodeMap.get(targetLeftId);
        if (leftState && leftState.isGone) {
            mL = this.helper.parsePx(this.helper.getAttr(attr, this.solver.isRTL ? 'layout_goneMarginEnd' : 'layout_goneMarginStart')) || 0;
            LogManager.v(this.TAG, `[GoneMargin] ${id} applied left goneMargin=${mL} (Target: ${targetLeftId})`);
        } else {
            mL = this.helper.parsePx(this.helper.getAttr(attr, this.solver.isRTL ? 'layout_marginEnd' : 'layout_marginStart')) || 
                 this.helper.parsePx(this.helper.getAttr(attr, 'layout_marginLeft')) || 0;
        }

        const rightState = this.solver.nodeMap.get(targetRightId);
        if (rightState && rightState.isGone) {
            mR = this.helper.parsePx(this.helper.getAttr(attr, this.solver.isRTL ? 'layout_goneMarginStart' : 'layout_goneMarginEnd')) || 0;
            LogManager.v(this.TAG, `[GoneMargin] ${id} applied right goneMargin=${mR} (Target: ${targetRightId})`);
        } else {
            mR = this.helper.parsePx(this.helper.getAttr(attr, this.solver.isRTL ? 'layout_marginStart' : 'layout_marginEnd')) || 
                 this.helper.parsePx(this.helper.getAttr(attr, 'layout_marginRight')) || 0;
        }

        // Size
        const wAttr = this.helper.getAttr(attr, 'layout_width');
        const minW = this.helper.parsePx(this.helper.getAttr(attr, 'minWidth')) || 0;
        const maxW = this.helper.parsePx(this.helper.getAttr(attr, 'maxWidth')) || Infinity;
        const widthPercent = this.helper.getAttr(attr, 'layout_constraintWidth_percent');

        if (widthPercent && wAttr === '0dp') {
            state.w = this.solver.parentW * parseFloat(widthPercent);
            LogManager.v(this.TAG, `[Percent] ${id} width set to ${state.w}px (${widthPercent * 100}%)`);
        } else if (wAttr === '0dp' || wAttr === 'match_constraint') {
            if (anchorLeft !== null && anchorRight !== null) {
                state.w = Math.abs(anchorRight - anchorLeft) - mL - mR;
                LogManager.v(this.TAG, `[MatchConstraint] ${id} width calculated: ${state.w}px`);
            }
        } else if (wAttr === 'match_parent') {
            state.w = this.solver.parentW - (this.solver.padding.left + this.solver.padding.right + mL + mR);
        }

        // Clamp
        if (state.w < minW) {
             state.w = minW;
             LogManager.v(this.TAG, `[Clamp] ${id} width clamped to minWidth ${minW}px`);
        }
        if (state.w > maxW) {
             state.w = maxW;
             LogManager.v(this.TAG, `[Clamp] ${id} width clamped to maxWidth ${maxW}px`);
        }
        
        state.boundW = state.w;

        // Position
        if (anchorLeft !== null && anchorRight !== null) {
            const bias = parseFloat(this.helper.getAttr(attr, 'layout_constraintHorizontal_bias') || '0.5');
            const availableSpace = (anchorRight - anchorLeft) - state.w - mL - mR;
            const effectiveBias = this.solver.isRTL ? (1 - bias) : bias;
            state.x = anchorLeft + mL + (availableSpace * effectiveBias);
            state.alignment = 'center';
            LogManager.v(this.TAG, `[Centered] ${id} horizontally centered. Bias=${bias}, X=${state.x}`);
        } else if (anchorLeft !== null) {
            state.x = anchorLeft + mL;
            state.alignment = 'start';
        } else if (anchorRight !== null) {
            state.x = anchorRight - state.w - mR;
            state.alignment = 'end';
        } else {
            if (this.solver.isRTL) state.x = (this.solver.parentW - this.solver.padding.right) - state.w - mR;
            else state.x = this.solver.padding.left + mL;
            
            state.alignment = 'start';
            LogManager.w(this.TAG, `[Unconstrained] View ${id} has no horizontal constraints. Jumping to start.`);
        }
    }
    
    solveBarrier(state, attr) {
        const direction = this.helper.getAttr(attr, 'barrierDirection');
        const referencedIds = this.helper.getAttr(attr, 'constraint_referenced_ids');
        
        if (!referencedIds) {
            LogManager.e(this.TAG, `Barrier ${state.id} missing 'constraint_referenced_ids'`);
            return;
        }

        if (['start', 'end', 'left', 'right'].includes(direction)) {
            const ids = referencedIds.split(',').map(id => id.trim());
            let maxVal = -Infinity;
            let minVal = Infinity;
            let hasTarget = false;
            
            ids.forEach(refId => {
                const refState = this.solver.nodeMap.get(refId);
                // Barrier ignores GONE views
                if (refState && !refState.isGone) {
                    hasTarget = true;
                    const rightEdge = refState.x + refState.w;
                    const leftEdge = refState.x;
                    
                    if (rightEdge > maxVal) maxVal = rightEdge;
                    if (leftEdge < minVal) minVal = leftEdge;
                } else if (!refState) {
                    LogManager.w(this.TAG, `Barrier reference ${refId} not found.`);
                }
            });
            
            if (hasTarget) {
                let isRightSide = false;
                if (direction === 'right') isRightSide = true;
                else if (direction === 'left') isRightSide = false;
                else if (direction === 'end') isRightSide = !this.solver.isRTL; 
                else if (direction === 'start') isRightSide = this.solver.isRTL;

                state.x = isRightSide ? maxVal : minVal;
                state.w = 0;
                state.solvedX = true;
                LogManager.d(this.TAG, `[Barrier] ${state.id} (${direction}) resolved at X=${state.x}`);
            }
        }
    }
}