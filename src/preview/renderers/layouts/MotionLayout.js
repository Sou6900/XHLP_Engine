import { ConstraintLayout } from './ConstraintLayout.js';
import { ConstraintSolver } from '../../solvers/ConstraintSolver.js';
import { MotionSceneParser } from '../../parsers/MotionSceneParser.js';
import { LogManager } from '../../core/LogManager.js';

export class MotionLayout extends ConstraintLayout {
    
    constructor(resolver) {
        super(resolver);
        this.sceneParser = new MotionSceneParser();
    }

    async renderWithBounds(node, width, height, renderChildCallback, parentType) {
        const TAG = 'MotionLayout';
        const attr = node.attributes || {};
        const getAttr = (name) => attr[name] || attr[`android:${name}`] || attr[`app:${name}`];

        const id = getAttr('id') || 'unknown';
        // console.group(`[MotionLayout] Rendering ID: ${id}`);
        LogManager.d(TAG, `Rendering MotionLayout (${id})`);

        const sceneRef = getAttr('layoutDescription');
        if (!sceneRef) {
            console.warn(`❌ Missing 'app:layoutDescription'.`);
            LogManager.e(TAG, `Missing 'app:layoutDescription' for ID: ${id}`);
            // console.groupEnd();
            return super.renderWithBounds(node, width, height, renderChildCallback, parentType);
        }

        LogManager.i(TAG, `Loading Scene XML: ${sceneRef}`);
        const sceneXml = await this.resolver.getXml(sceneRef);
        if (!sceneXml) {
            console.error(`❌ Scene XML NOT found: ${sceneRef}`);
            LogManager.e(TAG, `Scene XML file not found: ${sceneRef}`);
            // console.groupEnd();
            const html = await super.renderWithBounds(node, width, height, renderChildCallback, parentType);
            return html.replace('style="', 'style="border: 4px solid red; position: relative; '); 
        }

        const scene = this.sceneParser.parse(sceneXml);
        const transition = scene ? scene.transitions[0] : null;
        
        if (!transition) {
            console.warn(`⚠️ Invalid Scene or Transition.`);
            LogManager.w(TAG, 'MotionScene parsed but no valid Transitions found.');
            // console.groupEnd();
            return super.renderWithBounds(node, width, height, renderChildCallback, parentType);
        }

        // Solve States
        // console.log(' Solving START State...');
        LogManager.v(TAG, 'Solving ConstraintSet: START');
        const startStateStyles = await this._solveState(node, scene.constraintSets[transition.start], width, height, 'START');
        
        // console.log(' Solving END State...');
        LogManager.v(TAG, 'Solving ConstraintSet: END');
        const endStateStyles = await this._solveState(node, scene.constraintSets[transition.end], width, height, 'END');

        // Generate Children
        const childrenHtml = await Promise.all(node.children.map(async child => {
            const childId = this.solver.helper.getId(child);
            const startStyle = startStateStyles.get(childId);
            const endStyle = endStateStyles.get(childId);

            let html = await renderChildCallback(child, 'ConstraintLayout', null, null);

            if (startStyle && endStyle) {
                if (childId === 'button') {
                    // console.log(`[Button Animation] X: ${startStyle.x}px ➝ ${endStyle.x}px`);
                }

                LogManager.v(TAG, `Calculated Motion for '${childId}': Start[${startStyle.x},${startStyle.y}] -> End[${endStyle.x},${endStyle.y}]`);

                // Background Color Logic
                const startSet = scene.constraintSets[transition.start];
                const endSet = scene.constraintSets[transition.end];
                const getBg = (set) => set && set[childId] ? (set[childId]['android:background'] || set[childId]['background']) : null;
                
                const xmlBg = child.attributes['android:background'] || child.attributes['background'];
                const rawStartBg = getBg(startSet) || xmlBg;
                const rawEndBg = getBg(endSet) || rawStartBg;

                const bgStart = rawStartBg ? this.resolver.resolveColor(rawStartBg) : 'transparent';
                const bgEnd = rawEndBg ? this.resolver.resolveColor(rawEndBg) : bgStart;

                const motionCss = `
                    position: absolute !important;
                    transition: all ${transition.duration}ms cubic-bezier(0.4, 0.0, 0.2, 1);
                    margin: 0 !important;
                    
                    /* CSS Variables */
                    --x-start: ${startStyle.x}px; --y-start: ${startStyle.y}px;
                    --w-start: ${startStyle.width}px; --h-start: ${startStyle.height}px;
                    --bg-start: ${bgStart};

                    --x-end: ${endStyle.x}px; --y-end: ${endStyle.y}px;
                    --w-end: ${endStyle.width}px; --h-end: ${endStyle.height}px;
                    --bg-end: ${bgEnd};

                    /* Initial State with !important */
                    left: var(--x-start) !important;
                    top: var(--y-start) !important;
                    width: var(--w-start) !important;
                    height: var(--h-start) !important;
                    background-color: var(--bg-start) !important;
                `;

                html = html.replace(/style="([^"]*)"/, (match, existing) => {
                    //  Clean up existing layout styles (margin, width, height)
                    // This prevents double-margin and conflicts with the solver's absolute positioning
                    const cleanedStyle = existing
                        .replace(/margin[^;]+;/g, '')
                        .replace(/width:[^;]+;/g, '')
                        .replace(/height:[^;]+;/g, '')
                        .replace(/background-color:[^;]+;/g, '');

                    return `style="${cleanedStyle} ${motionCss}" data-motion-id="${childId}"`;
                });
            }
            return html;
        }));

        const motionId = `motion_${Math.random().toString(36).substr(2, 9)}`;
        const targetId = transition.onClick ? transition.onClick.targetId : null;
        
        LogManager.i(TAG, `Interaction initialized. OnClick Target: ${targetId || 'self'}`);

        const clickHandler = `
            (function(e) {
                e.stopPropagation();
                const container = e.currentTarget;
                const targetId = '${targetId}';
                
                if (targetId && targetId !== 'null') {
                    const target = container.querySelector('[id=\\'' + targetId + '\\']');
                    if (target) {
                        const elements = document.elementsFromPoint(e.clientX, e.clientY);
                        const isTargetClicked = Array.from(elements).includes(target);
                        if (!isTargetClicked && !target.contains(e.target)) return;
                    }
                }

                const isEnd = container.getAttribute('data-state') === 'end';
                const newState = isEnd ? 'start' : 'end';
                container.setAttribute('data-state', newState);
                
                // Logging for runtime debugging
                if(window.Log) window.Log.d('MotionLayout', 'Transitioning to state: ' + newState);

                const views = container.querySelectorAll('[data-motion-id]');
                views.forEach(view => {
                    view.style.setProperty('left', 'var(--x-' + newState + ')', 'important');
                    view.style.setProperty('top', 'var(--y-' + newState + ')', 'important');
                    view.style.setProperty('width', 'var(--w-' + newState + ')', 'important');
                    view.style.setProperty('height', 'var(--h-' + newState + ')', 'important');
                    view.style.setProperty('background-color', 'var(--bg-' + newState + ')', 'important');
                });
            })(event)
        `.replace(/\s+/g, ' ').replace(/"/g, '&quot;');

        const containerStyle = `
            position: relative; width: 100%; height: 100%; overflow: hidden;
            background-color: ${node.attributes['android:background'] || 'transparent'};
            cursor: pointer;
        `;

        // console.groupEnd();
        return `<div id="${motionId}" class="android-view motion-layout" style="${containerStyle}" onclick="${clickHandler}">
            ${childrenHtml.join('')}
        </div>`;
    }

    async _solveState(rootNode, constraintSet, w, h, stateLabel) {
        const clonedChildren = JSON.parse(JSON.stringify(rootNode.children));
        
        clonedChildren.forEach(child => {
            const id = this.solver.helper.getId(child);
            if (constraintSet && constraintSet[id]) {
                const overrides = constraintSet[id];
                
                const layoutRegex = /layout_constraint|layout_margin|layout_editor_absolute/;
                Object.keys(child.attributes).forEach(key => {
                    if (layoutRegex.test(key)) delete child.attributes[key];
                });

                Object.assign(child.attributes, overrides);
            }
        });

        const solver = new ConstraintSolver(this.resolver);
        return solver.solve(clonedChildren, w || 360, h || 640); 
    }

    _extractBg(css) {
        const match = css.match(/background-color:\s*([^;]+)/);
        return match ? match[1] : null;
    }
}