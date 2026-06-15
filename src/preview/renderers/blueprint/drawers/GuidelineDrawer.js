/**
 * GuidelineDrawer.js
 * Draws guideline visuals
 */

import { LogManager } from '../../../core/LogManager.js';
import { ColorHelper } from '../utils/ColorHelper.js';

export class GuidelineDrawer {
    constructor(svgManager) {
        this.svgManager = svgManager;
        this.colors = new ColorHelper();
    }

    /**
     * Draw guideline
     */
    draw(svg, constraint, rootElement) {
        if (!constraint.isGuideline) return;

        const parentW = rootElement.offsetWidth;
        const parentH = rootElement.offsetHeight;

        let x1, y1, x2, y2;
        const isVertical = (constraint.guideX !== null && constraint.guideX !== undefined);

        if (isVertical) {
            // Vertical guideline
            x1 = constraint.guideX;
            y1 = 0;
            x2 = constraint.guideX;
            y2 = parentH;
        } else {
            // Horizontal guideline
            x1 = 0;
            y1 = constraint.guideY;
            x2 = parentW;
            y2 = constraint.guideY;
        }

        // Log drawing action
        LogManager.v('GuidelineDrawer', `Drawing ${isVertical ? 'Vertical' : 'Horizontal'} Guideline at ${Math.round(isVertical ? x1 : y1)}px`);

        const color = this.colors.getGuidelineColor();

        // Draw dashed line
        const line = this.svgManager.createElement('path', {
            d: `M ${x1} ${y1} L ${x2} ${y2}`,
            stroke: color,
            'stroke-width': '1',
            'stroke-dasharray': '5, 3',
            opacity: '0.8'
        });
        svg.appendChild(line);

        // Draw marker circle
        const markerCx = isVertical ? x1 : 12;
        const markerCy = isVertical ? 12 : y1;
        const marker = this.svgManager.createCircle(markerCx, markerCy, 4, color);
        svg.appendChild(marker);
    }
}