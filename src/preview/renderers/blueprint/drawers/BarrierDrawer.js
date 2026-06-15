/**
 * BarrierDrawer.js
 */

import { LogManager } from '../../../core/LogManager.js';
import { ColorHelper } from '../utils/ColorHelper.js';

export class BarrierDrawer {
    constructor(svgManager) {
        this.svgManager = svgManager;
        this.colors = new ColorHelper();
    }

    /**
     * Draw barrier
     */
    draw(svg, constraint, rootElement) {
        if (!constraint.isBarrier) return;

        const parentW = rootElement.offsetWidth;
        const parentH = rootElement.offsetHeight;

        let x1, y1, x2, y2;
        const isVertical = ['start', 'end', 'left', 'right'].includes(constraint.barrierDir);

        if (isVertical) {
            // Vertical barrier
            x1 = constraint.x;
            y1 = 0;
            x2 = constraint.x;
            y2 = parentH;
        } else {
            // Horizontal barrier
            x1 = 0;
            y1 = constraint.y;
            x2 = parentW;
            y2 = constraint.y;
        }

        LogManager.v('BarrierDrawer', `Drawing Barrier (${constraint.barrierDir}) at ${Math.round(isVertical ? x1 : y1)}px`);

        const color = this.colors.getBarrierColor();

        // Draw dashed line
        const line = this.svgManager.createElement('path', {
            d: `M ${x1} ${y1} L ${x2} ${y2}`,
            stroke: color,
            'stroke-width': '2',
            'stroke-dasharray': '8, 4',
            opacity: '0.8'
        });
        svg.appendChild(line);

        // Draw directional marker (triangle)
        let markerPath;
        if (isVertical) {
            markerPath = `M ${x1 - 4} 10 L ${x1 + 4} 10 L ${x1} 18 Z`;
        } else {
            markerPath = `M 10 ${y1 - 4} L 10 ${y1 + 4} L 18 ${y1} Z`;
        }

        const marker = this.svgManager.createElement('path', {
            d: markerPath,
            fill: color
        });
        svg.appendChild(marker);
    }
}