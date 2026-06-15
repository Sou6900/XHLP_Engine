/**
 * BlueprintRenderer.js
 * Main orchestrator for blueprint rendering
 */

import { ConstraintExtractor } from './core/ConstraintExtractor.js';
import { EventManager } from './core/EventManager.js';
import { SVGManager } from './core/SVGManager.js';
import { LineDrawer } from './drawers/LineDrawer.js';
import { GuidelineDrawer } from './drawers/GuidelineDrawer.js';
import { BarrierDrawer } from './drawers/BarrierDrawer.js';
import { AnchorDrawer } from './drawers/AnchorDrawer.js';
import { GeometryHelper } from './utils/GeometryHelper.js';

export class BlueprintRenderer {
    constructor() {
        this.constraintData = new Map();
        this.selectedId = null;
        this.rootElement = null;
        
        // Initialize sub-modules
        this.svgManager = new SVGManager();
        this.extractor = new ConstraintExtractor();
        this.eventManager = new EventManager(this);
        this.geometry = new GeometryHelper();
        
        // Drawers
        this.lineDrawer = new LineDrawer(this.svgManager);
        this.guidelineDrawer = new GuidelineDrawer(this.svgManager);
        this.barrierDrawer = new BarrierDrawer(this.svgManager);
        this.anchorDrawer = new AnchorDrawer(this.svgManager);
    }

    enableBlueprint(rootElement, constraintSolver) {
        if (!rootElement) return;
        this.rootElement = rootElement;

        // console.log('[Renderer] Enabled. (No class manipulation here)');
        
        this.eventManager.attach(rootElement);

        if (constraintSolver && constraintSolver.nodeMap) {
            this.constraintData = this.extractor.extract(constraintSolver.nodeMap);
            this.lineDrawer.setConstraintData(this.constraintData);
            this.draw();
        }
    }

    disableBlueprint(rootElement) {
        if (!rootElement) return;
        
        // console.log('[Renderer] Disabled.');

        this.eventManager.detach(rootElement);
        this.svgManager.removeSVG();
        this.selectedId = null;
    }

    /**
     * Main draw method
     */
    draw() {
        if (!this.rootElement) return;

        // Create SVG overlay
        const svg = this.svgManager.createSVG(this.rootElement);
        if (!svg) return;

        // Get scale factors
        const { scaleX, scaleY } = this.svgManager.getScaleFactors(this.rootElement);

        // Draw all constraints
        this.constraintData.forEach((constraint) => {
            if (constraint.isGuideline) {
                this.guidelineDrawer.draw(svg, constraint, this.rootElement);
            } else if (constraint.isBarrier) {
                this.barrierDrawer.draw(svg, constraint, this.rootElement);
            } else {
                // Draw regular constraints
                this.lineDrawer.draw(svg, constraint, this.rootElement, this.selectedId, scaleX, scaleY);
                
                // Draw anchors for selected view
                if (constraint.id === this.selectedId) {
                    const element = this.rootElement.querySelector(`[id="${constraint.id}"]`);
                    if (element) {
                        const rect = this.geometry.getRelativeRect(element, this.rootElement, scaleX, scaleY);
                        this.anchorDrawer.draw(svg, rect);
                    }
                }
            }
        });
    }

    /**
     * Inspect view (for debugging)
     */
    inspectView(id) {
        const data = this.constraintData.get(id);
        if (!data) return;
        
        // console.group(`%c Inspector: ${id}`, 'color: #00E5FF; font-weight: bold;');
        // console.log(data);
        // console.groupEnd();
    }
}
