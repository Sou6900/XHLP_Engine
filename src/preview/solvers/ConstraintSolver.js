// ConstraintSolver.js
import { LogManager } from '../core/LogManager.js';
import { AttributeHelper } from './utils/AttributeHelper.js';
import { GuidelineResolver } from './constraint/GuidelineResolver.js';
import { DimensionEstimator } from './constraint/DimensionEstimator.js';
import { ChainSolver } from './constraint/ChainSolver.js';
import { HorizontalSolver } from './constraint/HorizontalSolver.js';
import { VerticalSolver } from './constraint/VerticalSolver.js';
import { CircularSolver } from './constraint/CircularSolver.js'; 
import { FlowSolver } from './constraint/FlowSolver.js'; 

export class ConstraintSolver {
    constructor(resourceResolver) {
        this.resolver = resourceResolver;
        this.nodeMap = new Map();
        this.parentW = 360;
        this.parentH = 640;
        this.padding = { left: 0, top: 0, right: 0, bottom: 0 };
        this.isRTL = false;
        
        // Android Standard TAG
        this.TAG = 'ConstraintLayout';

        this.helper = new AttributeHelper(this);
        this.guidelineResolver = new GuidelineResolver(this);
        this.estimator = new DimensionEstimator(this);
        this.chainSolver = new ChainSolver(this);
        this.horizontalSolver = new HorizontalSolver(this);
        this.verticalSolver = new VerticalSolver(this);
        this.circularSolver = new CircularSolver(this); 
        this.flowSolver = new FlowSolver(this);
    }

    solve(children, parentWidth, parentHeight, padding = { left: 0, top: 0, right: 0, bottom: 0 }, isRTL = false, isWrapContentHeight = false) {
        this.parentW = parentWidth || 360;
        this.parentH = parentHeight || 640;
        this.padding = padding;
        this.isRTL = isRTL;
        this.nodeMap.clear();

        // Standard Layout Pass Log
        LogManager.v(this.TAG, `START LAYOUT: parent=${this.parentW}x${this.parentH}, isRtl=${isRTL}, wrapHeight=${isWrapContentHeight}`);

        if (!children || children.length === 0) {
            LogManager.w(this.TAG, 'ConstraintLayout has no children. Skipping solve.');
            return new Map();
        }

        //️ Pre-check: Duplicate IDs (Common Android Error)
        const idSet = new Set();
        children.forEach((child, index) => {
            const id = this.helper.getId(child);
            if (id) {
                if (idSet.has(id)) {
                    LogManager.e(this.TAG, `Duplicate id @+id/${id}, tag null, or parent id used with View #${index}`);
                }
                idSet.add(id);
            }
        });

        // Phase 1: Guidelines
        this.guidelineResolver.resolve(children);

        // Phase 2: Estimates
        this.estimator.estimateAll(children);

        // Initialize Defaults
        this.nodeMap.forEach((state, id) => {
            state.x = (typeof state.x === 'number' && !isNaN(state.x)) ? state.x : 0;
            state.y = (typeof state.y === 'number' && !isNaN(state.y)) ? state.y : 0;
            state.w = (typeof state.w === 'number' && !isNaN(state.w)) ? state.w : 0;
            state.h = (typeof state.h === 'number' && !isNaN(state.h)) ? state.h : 0;
            
            const visibility = this.helper.getAttr(state.node.attributes, 'visibility');
            state.isGone = (visibility === 'gone');
            
            if (state.isGone) {
                LogManager.v(this.TAG, `View ${id} is GONE`);
            }

            state.solvedX = state.isGuideline || false;
            state.solvedY = state.isGuideline || false;
            state.boundW = state.w;
            state.boundH = state.h;
        });

        this.applyDimensionRatios(children);
        this.chainSolver.detectChains(children);
        this._runSolverLoop(children, isWrapContentHeight);

        // Sanitize & Error Logging for NaN
        this.nodeMap.forEach((state, id) => {
            if (isNaN(state.x) || isNaN(state.y) || isNaN(state.w) || isNaN(state.h)) {
                LogManager.e(this.TAG, `View ${id} has invalid dimensions (NaN). Resetting to 0.`);
                state.x = isNaN(state.x) ? 0 : state.x;
                state.y = isNaN(state.y) ? 0 : state.y;
                state.w = Math.max(0, isNaN(state.w) ? 0 : state.w);
                state.h = Math.max(0, isNaN(state.h) ? 0 : state.h);
            }
        });

        // Phase 5: Generate Results
        const resultStyles = new Map();
        this.nodeMap.forEach((state, id) => {
            const isGuide = state.isGuideline;
            const isGone = state.isGone;
            const finalW = Math.ceil(state.w);
            const finalH = Math.ceil(state.h);
            
            const css = `
                position: absolute !important;
                left: ${state.x}px !important;
                top: ${state.y}px !important;
                width: ${isGuide ? 0 : finalW}px !important;
                height: ${isGuide ? 0 : finalH}px !important;
                margin: 0 !important;
                display: ${(isGuide || isGone) ? 'none' : 'flex'};
            `;
            resultStyles.set(id, { css, width: finalW, height: finalH, x: state.x, y: state.y, isGuideline: isGuide });
        });

        LogManager.v(this.TAG, `Layout pass completed. Solved ${resultStyles.size} views.`);
        return resultStyles;
    }

    _runSolverLoop(children, isMeasuring) {
        if (!isMeasuring) {
            this.nodeMap.forEach(state => {
                if (!state.isGuideline && !state.node.type.includes('Barrier')) {
                    state.solvedY = false;
                    state.solvedX = false;
                }
            });
        }

        const passes = 12;
        for (let pass = 0; pass < passes; pass++) {
            
            // Move FlowSolver INSIDE the loop
            // This ensures Flow updates its position after its anchors (e.g. value view) are solved
            this.flowSolver.solve(children);

            // Pass 1: Barriers
            children.forEach(node => {
                const id = this.helper.getId(node);
                if (!id) return;
                const state = this.nodeMap.get(id);
                if (state.isGone || !node.type.includes('Barrier')) return;
                
                this.horizontalSolver.solve(state, node.attributes);
                this.verticalSolver.solve(state, node.attributes, isMeasuring);
            });
            
            // Pass 2: Views
            children.forEach(node => {
                const id = this.helper.getId(node);
                if (!id) return;
                const state = this.nodeMap.get(id);
                if (node.type.includes('Barrier')) return;
                
                // Allow GONE views to be solved for position
                if (state.isGone) {
                    state.w = 0;
                    state.h = 0;
                }

                if (state.solvedX && state.solvedY && !state.isGone) return;

                const hasCircle = this.helper.getAttr(node.attributes, 'layout_constraintCircle');
                
                if (hasCircle) {
                    this.circularSolver.solve(state, node.attributes);
                } else {
                    if (!state.inHorizontalChain) {
                        this.horizontalSolver.solve(state, node.attributes);
                    } else if (pass >= 0 && state.horizontalChain) {
                        this.chainSolver.solveChainHorizontal(state);
                    }
                    
                    if (!state.inVerticalChain) {
                        this.verticalSolver.solve(state, node.attributes, isMeasuring);
                    } else if (pass >= 0 && state.verticalChain) {
                        this.chainSolver.solveChainVertical(state);
                    }
                }

                if ((node.type.includes('TextView') || node.type.includes('Button')) && state.w > 0 && !state.isGone) {
                    const hAttr = this.helper.getAttr(node.attributes, 'layout_height');
                    if (hAttr === 'wrap_content') {
                        state.h = this.estimator.estimateHeight(node, state.w);
                    }
                }
                this.applySingleRatio(state, node.attributes);
                
                state.w = Math.max(0, isNaN(state.w) ? 0 : state.w);
                state.h = Math.max(0, isNaN(state.h) ? 0 : state.h);
            });
        }
    }

    getPos(ref, edge) {
        if (!ref || ref === 'parent') {
            if (edge === 'left' || edge === 'start') return this.padding.left;
            if (edge === 'right' || edge === 'end') return this.parentW - this.padding.right;
            if (edge === 'top') return this.padding.top;
            if (edge === 'bottom') return this.parentH - this.padding.bottom;
            return 0;
        }

        const id = ref.replace(/@\+?id\//, '').trim();
        const state = this.nodeMap.get(id);

        if (!state) {
            // ⚠ Android Studio "Missing Constraint" Warning Style
            LogManager.w(this.TAG, `MISSING ANCHOR: Target '@+id/${id}' not found. Check layout for typos or missing IDs.`);
            return 0; 
        }

        if (state.isGuideline) {
            return (state.guideX !== null) ? state.guideX : (state.guideY !== null ? state.guideY : 0);
        }

        switch (edge) {
            case 'left': case 'start': return state.x;
            case 'right': case 'end': return state.x + state.w;
            case 'top': return state.y;
            case 'bottom': return state.y + state.h;
            default: return 0;
        }
    }

    applyDimensionRatios(children) {
        children.forEach(node => {
            const id = this.helper.getId(node);
            const state = this.nodeMap.get(id);
            if (state) this.applySingleRatio(state, node.attributes);
        });
    }

    applySingleRatio(state, attr) {
        const ratioStr = this.helper.getAttr(attr, 'layout_constraintDimensionRatio');
        if (!ratioStr) return;

        const parts = ratioStr.split(',');
        let ratioVal = parts.length > 1 ? parts[1] : parts[0];
        if (ratioVal.includes(':') === false && parts.length > 1) ratioVal = parts[1];

        let side = null;
        if (parts.length > 1) side = parts[0];

        const dims = ratioVal.split(':');
        
        // ⚠ Invalid Ratio Warning
        if (dims.length !== 2) {
            LogManager.w(this.TAG, `Invalid dimension ratio format: '${ratioStr}'. Expected 'W,h:w' or 'h:w'.`);
            return;
        }

        const ratio = parseFloat(dims[0]) / parseFloat(dims[1]);
        if (isNaN(ratio) || ratio <= 0) {
            LogManager.w(this.TAG, `Ignored invalid ratio value: '${ratioStr}'`);
            return;
        }
        
        const wMode = this.helper.getAttr(attr, 'layout_width');
        const hMode = this.helper.getAttr(attr, 'layout_height');

        if (wMode === '0dp' && hMode === '0dp') {
            if (state.inHorizontalChain && state.w > 0) {
                state.h = state.w / ratio;
                return;
            }
            if (state.inVerticalChain && state.h > 0) {
                state.w = state.h * ratio;
                return;
            }
            const hasVConstraints = (this.helper.getAttr(attr, 'layout_constraintTop_toTopOf') || this.helper.getAttr(attr, 'layout_constraintTop_toBottomOf')) &&
                                    (this.helper.getAttr(attr, 'layout_constraintBottom_toBottomOf') || this.helper.getAttr(attr, 'layout_constraintBottom_toTopOf'));

            if (side === 'H') {
                state.w = state.boundW;
                state.h = state.w / ratio;
            } else if (side === 'W') {
                state.h = state.boundH;
                state.w = state.h * ratio;
            } else {
                let availableW = state.boundW || 0;
                let availableH = state.boundH || 0;

                if (availableW > 0 && !hasVConstraints) {
                    state.w = availableW;
                    state.h = state.w / ratio;
                } else {
                    if (availableW / availableH > ratio) {
                        state.h = availableH;
                        state.w = state.h * ratio;
                    } else {
                        state.w = availableW;
                        state.h = state.w / ratio;
                    }
                    const hBias = parseFloat(this.helper.getAttr(attr, 'layout_constraintHorizontal_bias') || '0.5');
                    const vBias = parseFloat(this.helper.getAttr(attr, 'layout_constraintVertical_bias') || '0.5');
                    state.x += (availableW - state.w) * (this.isRTL ? (1 - hBias) : hBias);
                    state.y += (availableH - state.h) * vBias;
                }
            }
        } else if (wMode === '0dp') {
            state.w = state.h * ratio;
        } else if (hMode === '0dp') {
            state.h = state.w / ratio;
        }
    }
}