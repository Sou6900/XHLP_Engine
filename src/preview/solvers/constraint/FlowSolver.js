// FlowSolver.js
import { LogManager } from '../../core/LogManager.js'; 

export class FlowSolver {
    constructor(solver) {
        this.solver = solver;
        this.helper = solver.helper;
        this.TAG = 'FlowSolver';
    }

    solve(children) {
        children.forEach(node => {
            if (!node.type.includes('Flow')) return;

            const flowId = this.helper.getId(node) || 'unknown_flow';
            const flowState = this.solver.nodeMap.get(flowId);
            
            if (!flowState) {
                LogManager.w(this.TAG, `Flow state not found for ${flowId}. Skipping.`);
                return;
            }

            const attr = node.attributes;
            const refIdsRaw = this.helper.getAttr(attr, 'constraint_referenced_ids');
            
            if (!refIdsRaw) {
                LogManager.e(this.TAG, `Flow ${flowId} is missing 'constraint_referenced_ids'. No views to arrange.`);
                return;
            }

            const refIds = refIdsRaw.split(',').map(id => id.trim());
            const views = [];
            
            // Validate referenced views
            refIds.forEach(id => {
                const viewState = this.solver.nodeMap.get(id);
                if (viewState) {
                    views.push(viewState);
                } else {
                    LogManager.w(this.TAG, `[ReferenceMissing] View '@id/${id}' referenced in Flow ${flowId} was not found.`);
                }
            });

            if (views.length === 0) {
                LogManager.w(this.TAG, `Flow ${flowId} has empty or invalid references. Skipping layout.`);
                return;
            }

            const wrapMode = this.helper.getAttr(attr, 'flow_wrapMode') || 'none';
            const hGap = this.helper.parsePx(this.helper.getAttr(attr, 'flow_horizontalGap'));
            const vGap = this.helper.parsePx(this.helper.getAttr(attr, 'flow_verticalGap'));
            
            const maxElementsWrap = parseInt(this.helper.getAttr(attr, 'flow_maxElementsWrap')) || 0;
            
            LogManager.v(this.TAG, `Layout Flow ${flowId}: Mode=${wrapMode}, Gap=[${hGap}, ${vGap}], MaxElements=${maxElementsWrap}`);

            // 1. Calculate Start/End Anchors (Horizontal)
            let startX = 0, endX = this.solver.parentW;
            const startToStart = this.helper.getAttr(attr, 'layout_constraintStart_toStartOf');
            const startToEnd = this.helper.getAttr(attr, 'layout_constraintStart_toEndOf');
            const endToEnd = this.helper.getAttr(attr, 'layout_constraintEnd_toEndOf');
            const endToStart = this.helper.getAttr(attr, 'layout_constraintEnd_toStartOf');

            // RTL Safe Anchor Resolution
            if (this.solver.isRTL) {
                if (startToStart) startX = this.solver.getPos(startToStart, 'right');
                else if (startToEnd) startX = this.solver.getPos(startToEnd, 'left');
                else startX = this.solver.parentW - this.solver.padding.right;

                if (endToEnd) endX = this.solver.getPos(endToEnd, 'left');
                else if (endToStart) endX = this.solver.getPos(endToStart, 'right');
                else endX = this.solver.padding.left;
            } else {
                if (startToStart) startX = this.solver.getPos(startToStart, 'left');
                else if (startToEnd) startX = this.solver.getPos(startToEnd, 'right');
                else startX = this.solver.padding.left;

                if (endToEnd) endX = this.solver.getPos(endToEnd, 'right');
                else if (endToStart) endX = this.solver.getPos(endToStart, 'left');
                else endX = this.solver.parentW - this.solver.padding.right;
            }

            // 2. Calculate Top Anchor (Vertical)
            let startY = 0;
            const topToTop = this.helper.getAttr(attr, 'layout_constraintTop_toTopOf');
            const topToBottom = this.helper.getAttr(attr, 'layout_constraintTop_toBottomOf');
            
            if (topToTop) startY = this.solver.getPos(topToTop, 'top');
            else if (topToBottom) startY = this.solver.getPos(topToBottom, 'bottom');
            else startY = this.solver.padding.top;

            // Apply Margin Top
            const mt = this.helper.parsePx(this.helper.getAttr(attr, 'layout_marginTop'));
            startY += mt;

            // 3. Determine Constraints
            const limitX = endX; 

            let currentX = startX;
            let currentY = startY;
            let rowMaxH = 0;
            let flowMaxW = 0;
            
            // RTL Direction Logic
            const dir = this.solver.isRTL ? -1 : 1;
            
            let visibleIndex = 0;
            let rowCount = 1;

            views.forEach((view, index) => {
                if (view.isGone) return;

                let shouldWrap = false;

                // 1. Check Wrap Mode (Width overflow)
                if (wrapMode !== 'none') {
                    const nextEdge = currentX + (view.w * dir);
                    const isOverflow = this.solver.isRTL 
                        ? (nextEdge < limitX) 
                        : (nextEdge > limitX); 
                    
                    if (isOverflow) {
                        shouldWrap = true;
                        LogManager.v(this.TAG, `[Wrap] Overflow detected at view ${view.id}. New Row started.`);
                    }
                }

                // 2. Check Max Elements Wrap
                if (maxElementsWrap > 0 && visibleIndex > 0 && visibleIndex % maxElementsWrap === 0) {
                    shouldWrap = true;
                    LogManager.v(this.TAG, `[Wrap] Max elements (${maxElementsWrap}) reached. New Row started.`);
                }

                if (shouldWrap) {
                    currentX = startX;
                    currentY += rowMaxH + vGap;
                    rowMaxH = 0;
                    rowCount++;
                }

                // Set Position
                view.x = this.solver.isRTL ? currentX - view.w : currentX;
                view.y = currentY;
                
                view.solvedX = true;
                view.solvedY = true;

                // Advance
                currentX += (view.w + hGap) * dir;
                rowMaxH = Math.max(rowMaxH, view.h);
                
                const widthUsed = Math.abs(currentX - startX);
                flowMaxW = Math.max(flowMaxW, widthUsed);
                
                visibleIndex++;
            });

            // Update Flow's own state
            flowState.w = flowMaxW;
            flowState.h = (currentY + rowMaxH) - startY;
            flowState.x = this.solver.isRTL ? startX - flowMaxW : startX;
            flowState.y = startY;
            
            LogManager.i(this.TAG, `Flow ${flowId} arranged ${visibleIndex} views in ${rowCount} rows.`);
        });
    }
}