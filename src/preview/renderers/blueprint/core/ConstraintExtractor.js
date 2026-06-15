/**
 * ConstraintExtractor.js - V3.3 (Fix: Left Constraint Support)
 * Now supports layout_constraintLeft_... properly
 */

import { LogManager } from '../../../core/LogManager.js';

export class ConstraintExtractor {
    /**
     * Extract all constraint data
     */
    extract(nodeMap) {
        const constraintData = new Map();
        
        if (!nodeMap || nodeMap.size === 0) {
            LogManager.w('ConstraintExtractor', 'NodeMap is empty. Nothing to extract.');
            return constraintData;
        }

        LogManager.d('ConstraintExtractor', `Starting extraction for ${nodeMap.size} views...`);
        
        nodeMap.forEach((state, id) => {
            const attrs = state.node.attributes;
            
            const type = state.node.type || '';
            const isGuideline = state.isGuideline || type.endsWith('Guideline');
            const isBarrier = type.includes('Barrier');
            const barrierDir = this._getAttr(attrs, 'barrierDirection');

            // Clean ID ensures bubbles show up even with @+id/
            const cleanId = this._cleanId(id);

            const constraints = {
                id: cleanId,
                x: state.x, 
                y: state.y, 
                w: state.w, 
                h: state.h,
                
                isGuideline: isGuideline,
                isBarrier: isBarrier,
                
                guideX: state.guideX,
                guideY: state.guideY,
                barrierDir: barrierDir,
                
                baseline: state.baseline || (state.h * 0.8),
                
                // Circular Constraints
                circleTo: this._extractId(this._getAttr(attrs, 'layout_constraintCircle')),
                circleRadius: this._getAttr(attrs, 'layout_constraintCircleRadius'),
                circleAngle: this._getAttr(attrs, 'layout_constraintCircleAngle'),

                // Added Left fallbacks for Start
                startToStart: this._extractId(this._getAttr(attrs, 'layout_constraintStart_toStartOf') || 
                                            this._getAttr(attrs, 'layout_constraintLeft_toLeftOf')),
                                            
                startToEnd: this._extractId(this._getAttr(attrs, 'layout_constraintStart_toEndOf') || 
                                          this._getAttr(attrs, 'layout_constraintLeft_toRightOf')),

                endToStart: this._extractId(this._getAttr(attrs, 'layout_constraintEnd_toStartOf') || 
                                          this._getAttr(attrs, 'layout_constraintRight_toLeftOf')),
                                          
                endToEnd: this._extractId(this._getAttr(attrs, 'layout_constraintEnd_toEndOf') || 
                                        this._getAttr(attrs, 'layout_constraintRight_toRightOf')),
                
                // Vertical Constraints
                topToTop: this._extractId(this._getAttr(attrs, 'layout_constraintTop_toTopOf')),
                topToBottom: this._extractId(this._getAttr(attrs, 'layout_constraintTop_toBottomOf')),
                bottomToTop: this._extractId(this._getAttr(attrs, 'layout_constraintBottom_toTopOf')),
                bottomToBottom: this._extractId(this._getAttr(attrs, 'layout_constraintBottom_toBottomOf')),
                
                // Baseline
                baselineToBaseline: this._extractId(this._getAttr(attrs, 'layout_constraintBaseline_toBaselineOf')),

                // Bias & Chain Info
                horizontalBias: parseFloat(this._getAttr(attrs, 'layout_constraintHorizontal_bias') || '0.5'),
                verticalBias: parseFloat(this._getAttr(attrs, 'layout_constraintVertical_bias') || '0.5'),
                
                horizontalChainStyle: this._getAttr(attrs, 'layout_constraintHorizontal_chainStyle') || 'spread',
                verticalChainStyle: this._getAttr(attrs, 'layout_constraintVertical_chainStyle') || 'spread',

                // Chain Info
                inHorizontalChain: state.inHorizontalChain,
                inVerticalChain: state.inVerticalChain,
                
                // Dimension modes
                widthMode: this._getAttr(attrs, 'layout_width'),
                heightMode: this._getAttr(attrs, 'layout_height')
            };
            
            constraintData.set(cleanId, constraints);
        });
        
        LogManager.i('ConstraintExtractor', `Extraction complete. Processed ${constraintData.size} constraints.`);
        return constraintData;
    }

    _getAttr(attrs, name) {
        return attrs[name] || attrs[`android:${name}`] || attrs[`app:${name}`];
    }

    _extractId(attrValue) {
        if (!attrValue) return null;
        if (attrValue === 'parent') return 'parent';
        return attrValue.replace(/^@\+?id\//, '');
    }

    _cleanId(id) {
        return id ? id.replace(/^@\+?id\//, '') : null;
    }
}