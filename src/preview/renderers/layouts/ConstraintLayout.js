// c4 placeholder attributes injector 
import { BaseView } from '../widgets/BaseView.js';
import { ConstraintSolver } from '../../solvers/ConstraintSolver.js';
import { LogManager } from '../../core/LogManager.js';

export class ConstraintLayout extends BaseView {
    constructor(resolver) {
        super(resolver);
        this.solver = new ConstraintSolver(resolver);
    }

    render(node, renderChildCallback, parentType) {
        return this.renderWithBounds(node, 360, 640, renderChildCallback, parentType);
    }

    async renderWithBounds(node, width, height, renderChildCallback, parentType) {
        const TAG = 'ConstraintLayout';
        const attr = node.attributes;
        const myId = attr.id || attr['android:id'] || 'unknown';

        LogManager.d(TAG, `Initialize ConstraintLayout (${myId})...`);
        
        let baseStyle = await this.getBaseStyles(attr, parentType || 'ViewGroup'); 
        
        baseStyle = baseStyle
            .replace(/padding[^;]+;/g, '')
            .replace(/border-width[^;]+;/g, '')
            .replace(/border-style[^;]+;/g, '')
            .replace(/border-color[^;]+;/g, '')
            .replace(/margin[^;]+;/g, '')
            .replace(/height:[^;]+;/g, '')
            .replace(/width:[^;]+;/g, ''); 

        const w = width || (typeof window !== 'undefined' ? window.innerWidth : 360);
        const h = height || (typeof window !== 'undefined' ? window.innerHeight : 640);

        LogManager.v(TAG, `Solver bounds: ${w}x${h}`);

        const getAttr = (name) => attr[name] || attr[`android:${name}`] || attr[`app:${name}`];
        const hAttr = getAttr('layout_height');
        const isWrapContentH = hAttr === 'wrap_content';

        const p = getAttr('padding');
        const pl = this.parsePx(getAttr('paddingLeft') || getAttr('paddingStart') || p);
        const pt = this.parsePx(getAttr('paddingTop') || p);
        const pr = this.parsePx(getAttr('paddingRight') || getAttr('paddingEnd') || p);
        const pb = this.parsePx(getAttr('paddingBottom') || p);
        
        const padding = { left: pl, top: pt, right: pr, bottom: pb };

        // Generate Auto IDs
        node.children.forEach((child, index) => {
            const hasId = child.attributes.id || child.attributes['android:id'];
            if (!hasId) {
                child.attributes.id = `__auto_id_const_${index}_${Date.now()}`;
                LogManager.v(TAG, `Generated Auto-ID for child #${index}: ${child.attributes.id}`);
            }
        });


        // Placeholder Pre-processing
        node.children.forEach(child => {
            if (child.type.split('.').pop() === 'Placeholder') {
                const contentIdRaw = child.attributes['app:content'] || child.attributes['content'];
                if (contentIdRaw) {
                    const contentId = contentIdRaw.replace(/@\+?id\//, '').trim();
                    const contentNode = node.children.find(c => {
                        const cId = c.attributes.id || c.attributes['android:id'];
                        return cId && cId.replace(/@\+?id\//, '').trim() === contentId;
                    });
        
                    if (contentNode) {
                        LogManager.d(TAG, `Processing Placeholder: Swapping attributes with ${contentId}`);
                        // Try all possible keys for ratio
                        const ratio = contentNode.attributes['app:layout_constraintDimensionRatio'] || 
                                      contentNode.attributes['layout_constraintDimensionRatio'];
                                      
                        if (ratio) {
                            // Set both to be safe for AttributeHelper
                            child.attributes['app:layout_constraintDimensionRatio'] = ratio;
                            child.attributes['layout_constraintDimensionRatio'] = ratio; 
                        }
                        
                        // Copy min/max dims
                        ['minWidth', 'maxWidth', 'minHeight', 'maxHeight'].forEach(k => {
                            const val = contentNode.attributes[`android:${k}`] || contentNode.attributes[k];
                            if (val) {
                                child.attributes[`android:${k}`] = val;
                                child.attributes[k] = val;
                            }
                        });
                    }
                }
            }
        });

        const layerTransforms = new Map();
        const hiddenGroupIds = new Set();

        node.children.forEach(child => {
            const type = child.type.split('.').pop();
            const childAttr = child.attributes;
            const refIdsRaw = childAttr['app:constraint_referenced_ids'] || childAttr['constraint_referenced_ids'];

            if (!refIdsRaw) return;
            const refIds = refIdsRaw.split(',').map(id => id.trim());

            if (type === 'Layer') {
                const getVal = (name) => childAttr[name] || childAttr[`android:${name}`] || '0';
                const rot = parseFloat(getVal('rotation'));
                const scX = parseFloat(childAttr['android:scaleX'] || childAttr['scaleX'] || '1');
                const scY = parseFloat(childAttr['android:scaleY'] || childAttr['scaleY'] || '1');
                const trX = parseFloat(getVal('translationX'));
                const trY = parseFloat(getVal('translationY'));

                let transform = '';
                if (rot !== 0) transform += `rotate(${rot}deg) `;
                if (scX !== 1 || scY !== 1) transform += `scale(${scX}, ${scY}) `;
                if (trX !== 0 || trY !== 0) transform += `translate(${trX}px, ${trY}px) `;

                if (transform) {
                    LogManager.v(TAG, `Layer transform calculated: ${transform} for [${refIds.join(', ')}]`);
                    refIds.forEach(id => {
                        const prev = layerTransforms.get(id) || '';
                        layerTransforms.set(id, prev + transform);
                    });
                }
            }

            if (type === 'Group') {
                const visibility = childAttr['android:visibility'] || childAttr['visibility'];
                if (visibility === 'gone' || visibility === 'invisible') {
                    LogManager.v(TAG, `Group '${childAttr.id}' is hidden. Hiding referenced IDs: ${refIds.join(', ')}`);
                    refIds.forEach(id => hiddenGroupIds.add(id));
                }
            }
        });
        
        const direction = attr['android:layoutDirection'] || attr['layoutDirection'];
        
        if (direction === 'rtl') {
            this.solver.isRTL = true;
            LogManager.i(TAG, 'Layout Direction set to RTL');
        } else if (direction === 'ltr') {
            this.solver.isRTL = false;
        }

        LogManager.d(TAG, `Running ConstraintSolver for ${node.children.length} children...`);
        const solvedStyles = this.solver.solve(node.children, w, h, padding, this.solver.isRTL, isWrapContentH);

        // Placeholder Logic (Swapping)
        node.children.forEach(child => {
            const type = child.type.split('.').pop();
            
            if (type === 'Placeholder') {
                const phId = child.attributes.id?.replace(/@\+?id\//, '').trim();
                const targetIdRaw = child.attributes['app:content'] || child.attributes['content'];
                
                if (phId && targetIdRaw) {
                    const targetId = targetIdRaw.replace(/@\+?id\//, '').trim();
                    
                    const phSolution = solvedStyles.get(phId);
                    const targetSolution = solvedStyles.get(targetId);

                    if (phSolution && targetSolution) {
                        LogManager.v(TAG, `Placeholder: Moving content '${targetId}' to placeholder '${phId}' position.`);
                        targetSolution.x = phSolution.x;
                        targetSolution.y = phSolution.y;
                        targetSolution.width = phSolution.width;
                        targetSolution.height = phSolution.height;
                        
                        targetSolution.css = `
                            position: absolute !important;
                            left: ${phSolution.x}px !important;
                            top: ${phSolution.y}px !important;
                            width: ${phSolution.width}px !important;
                            height: ${phSolution.height}px !important;
                            margin: 0 !important;
                            display: flex;
                        `;
                        
                        phSolution.width = 0;
                        phSolution.height = 0;
                        phSolution.css += 'display: none !important;';
                    }
                }
            }
        });

        if (typeof window !== 'undefined') {
            window.__latestConstraintSolver = this.solver;
        }

        let cssHeight = hAttr === 'match_parent' ? '100%' : `${h}px`;
        if (isWrapContentH) {
            cssHeight = `${this.solver.parentH}px !important`;
            LogManager.v(TAG, `Height set to wrap_content: ${this.solver.parentH}px`);
        }

        const layoutStyle = `
            position: relative;
            overflow: hidden; 
            width: 100%;
            height: ${cssHeight};
            display: block; 
        `;

        const childrenHtmlArray = await Promise.all(node.children.map(async child => {
            const type = child.type.split('.').pop();
            const rawId = child.attributes.id || child.attributes['android:id'];
            const id = rawId?.replace(/@\+?id\//, '').trim();
            
            const solution = id ? solvedStyles.get(id) : null;

            if (type === 'Guideline') {
                if (!solution) return '';
                return `<div id="${id}" style="position:absolute; left:${solution.x}px; top:${solution.y}px; width:0; height:0; display:none;"></div>`;
            }

            let absStyle = 'position:absolute; left:0; top:0;';
            let childW = w, childH = h;

            if (solution) {
                absStyle = solution.css;
                childW = solution.width;
                childH = solution.height;
            }

            let html = await renderChildCallback(child, 'ConstraintLayout', childW, childH); 
            
            const transformCss = id ? layerTransforms.get(id) : null;
            const shouldHide = id && hiddenGroupIds.has(id);

            return html.replace(/style="([^"]*)"/, (match, existingStyle) => {
                const cleanedStyle = existingStyle
                    .replace(/margin[^;]+;/g, '')
                    .replace(/width[^;]+;/g, '')
                    .replace(/height[^;]+;/g, '');
                
                let extraStyle = '';
                if (transformCss) {
                    extraStyle += `transform: ${transformCss}; transform-origin: center center; `;
                }
                if (shouldHide) {
                    extraStyle += `display: none !important; `;
                }

                return `style="${absStyle} ${cleanedStyle} ${extraStyle}"`;
            });
        }));
        
        LogManager.i(TAG, 'ConstraintLayout render complete.');
        return `
            <div class="android-layout constraint-layout" id="${node.attributes.id?.replace(/@\+?id\//, '') || ''}" style="${baseStyle} ${layoutStyle}">
                ${childrenHtmlArray.join('')}
            </div>
        `;
    }

    parsePx(val) {
        if (!val) return 0;
        if (val === 'match_parent' || val === 'wrap_content') return 0;
        return parseFloat(this.converter.parse(val));
    }
}