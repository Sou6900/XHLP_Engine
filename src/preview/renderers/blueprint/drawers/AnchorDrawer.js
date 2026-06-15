/**
 * AnchorDrawer.js
 * Draws anchor points on selected views
 */

import { LogManager } from '../../../core/LogManager.js';
import { ColorHelper } from '../utils/ColorHelper.js';

export class AnchorDrawer {
    constructor(svgManager) {
        this.svgManager = svgManager;
        this.colors = new ColorHelper();
    }

    /**
     * Draw anchors (4 edge points)
     */
    draw(svg, rect) {
        if (!rect) return;

        LogManager.v('AnchorDrawer', `Drawing anchors at [${Math.round(rect.left)}, ${Math.round(rect.top)}]`);

        const anchorColors = this.colors.getAnchorColors();
        
        const anchors = [
            { cx: rect.left, cy: rect.top + rect.height / 2 },       // Left
            { cx: rect.right, cy: rect.top + rect.height / 2 },      // Right
            { cx: rect.left + rect.width / 2, cy: rect.top },        // Top
            { cx: rect.left + rect.width / 2, cy: rect.bottom }      // Bottom
        ];

        anchors.forEach(pos => {
            const circle = this.svgManager.createCircle(
                pos.cx,
                pos.cy,
                3.5,
                anchorColors.fill,
                anchorColors.stroke,
                '2'
            );
            svg.appendChild(circle);
        });
    }
}