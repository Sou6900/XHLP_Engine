/**
 * LineDrawer.js - COMPLETE VERSION
 * - Straight, Spring, Elbow, Detour paths
 * - Chain connections with link symbols
 * - Visualizes Horizontal/Vertical Bias (e.g., "30%")
 * - Proper arrow angle calculation & Guideline support
 */

import { LogManager } from '../../../core/LogManager.js';
import { PathGenerator } from '../utils/PathGenerator.js';
import { GeometryHelper } from '../utils/GeometryHelper.js';
import { ColorHelper } from '../utils/ColorHelper.js';

export class LineDrawer {
    constructor(svgManager) {
        this.svgManager = svgManager;
        this.pathGen = new PathGenerator();
        this.geometry = new GeometryHelper();
        this.colors = new ColorHelper();
        
        this.config = {
            SPRING_MIN_LENGTH: 25,
            ELBOW_THRESHOLD: 50,
            DETOUR_MIN_LENGTH: 30,
            DETOUR_OFFSET: 30,
            CHAIN_LINK_SIZE: 18,
            CHAIN_LINK_STEP: 14
        };
        
        this.constraintData = null;
    }

    /**
    * Draw all constraints for a view
    */
    draw(svg, constraint, rootElement, selectedId, scaleX = 1, scaleY = 1) {
        if (constraint.isGuideline || constraint.isBarrier) return;
        
        const element = rootElement.querySelector(`[id="${constraint.id}"]`);
        if (!element) return;
        
        const rect = this.geometry.getRelativeRect(element, rootElement, scaleX, scaleY);
        
        // Calculate opacity
        let opacity = 1.0;
        if (selectedId) {
            // Check if this view is the selected one, or targeted by circular constraint
            const circleTargetId = constraint.circleTo ? constraint.circleTo.replace(/@\+?id\//, '') : null;
            
            // Check if this view is a target of the selected view's constraints (Basic check)
            if (constraint.id === selectedId || circleTargetId === selectedId) {
                opacity = 1.0;
            } else {
                opacity = 0.15; // Dim others
            }
        }
        
        // Draw based on type
        if (constraint.circleTo) {
            this.drawCircular(svg, constraint, rect, rootElement, opacity, scaleX, scaleY);
        } else {
            this.drawHorizontal(svg, constraint, rect, rootElement, selectedId, opacity, scaleX, scaleY);
            this.drawVertical(svg, constraint, rect, rootElement, selectedId, opacity, scaleX, scaleY);
        }
    }

    /**
    * Draw horizontal constraints & Bias Text
    */
    drawHorizontal(svg, c, rect, root, selectedId, opacity, scaleX, scaleY) {
        const centerY = rect.top + rect.height / 2;
        
        const hasStart = c.startToStart || c.startToEnd;
        const hasEnd = c.endToStart || c.endToEnd;
        
        // ALIGNMENT CHECK
        let isAlignment = false;
        let t1 = null, t2 = null;

        if (c.startToStart && c.endToEnd) {
            t1 = this._extractId(c.startToStart);
            t2 = this._extractId(c.endToEnd);
            if (t1 === t2 && t1 !== 'parent') isAlignment = true;
        }

        const isMatchConstraint = (c.widthMode === '0dp' || c.widthMode === 'match_constraint');
        
        // Logic: Opposing constraints AND NOT 0dp AND NOT Alignment -> Spring
        const useSpring = hasStart && hasEnd && !isMatchConstraint && !c.inHorizontalChain && !isAlignment;
        
        const type = c.inHorizontalChain ? 'chain' : (useSpring ? 'spring' : 'straight');

        // Draw Lines
        const processConstraint = (attr, sourceEdge, targetEdge) => {
            if (!attr) return;
            const targetId = this._extractId(attr);
            if (selectedId && c.id !== selectedId && targetId !== selectedId) return;

            let anchorX, targetY;

            if (targetId === 'parent') {
                const parentW = root.offsetWidth;
                anchorX = (targetEdge === 'right') ? parentW : 0;
                targetY = centerY;
            } else {
                const targetData = this._getConstraintData(targetId);
                if (targetData && (targetData.isGuideline || targetData.isBarrier)) {
                    anchorX = (targetData.isGuideline && targetData.guideX !== null) ? targetData.guideX : targetData.x;
                    targetY = centerY;
                } else {
                    const targetRect = this.geometry.getTargetRect(attr, root, scaleX, scaleY);
                    if (!targetRect) return;
                    anchorX = (targetEdge === 'right') ? targetRect.right : targetRect.left;
                    targetY = targetRect.top + targetRect.height / 2;
                }
            }
            
            const startX = (sourceEdge === 'right') ? rect.right : rect.left;
            this._drawConstraintLine(svg, startX, centerY, anchorX, targetY, type, c.id, targetId, opacity, 'horizontal', sourceEdge, selectedId);
        };

        if (c.startToStart) processConstraint(c.startToStart, 'left', 'left');
        if (c.startToEnd) processConstraint(c.startToEnd, 'left', 'right');
        if (c.endToStart) processConstraint(c.endToStart, 'right', 'left');
        if (c.endToEnd) processConstraint(c.endToEnd, 'right', 'right');

        // Draw Bias Text
        if (useSpring && c.horizontalBias !== 0.5 && c.id === selectedId) {
            // Position above the view
            const biasX = rect.left + (rect.width * c.horizontalBias);
            this._drawBiasText(svg, biasX, rect.top - 15, c.horizontalBias);
        }
    }

    /**
    * Draw vertical constraints & Bias Text
    */
    drawVertical(svg, c, rect, root, selectedId, opacity, scaleX, scaleY) {
        const centerX = rect.left + rect.width / 2;
        
        const hasTop = c.topToTop || c.topToBottom;
        const hasBottom = c.bottomToTop || c.bottomToBottom;
        
        // ALIGNMENT CHECK
        let isAlignment = false;
        let t1 = null, t2 = null;

        if (c.topToTop && c.bottomToBottom) {
            t1 = this._extractId(c.topToTop);
            t2 = this._extractId(c.bottomToBottom);
            if (t1 === t2 && t1 !== 'parent') isAlignment = true;
        }

        const isMatchConstraint = (c.heightMode === '0dp' || c.heightMode === 'match_constraint');
        
        // Logic: Opposing constraints AND NOT 0dp AND NOT Alignment -> Spring
        const useSpring = hasTop && hasBottom && !isMatchConstraint && !c.inVerticalChain && !isAlignment;
        
        const type = c.inVerticalChain ? 'chain' : (useSpring ? 'spring' : 'straight');

        // Draw Lines
        const processConstraint = (attr, sourceEdge, targetEdge) => {
            if (!attr) return;
            const targetId = this._extractId(attr);
            if (selectedId && c.id !== selectedId && targetId !== selectedId) return;

            let anchorY, targetX;

            if (targetId === 'parent') {
                const parentH = root.offsetHeight;
                anchorY = (targetEdge === 'bottom') ? parentH : 0;
                targetX = centerX;
            } else {
                const targetData = this._getConstraintData(targetId);
                if (targetData && (targetData.isGuideline || targetData.isBarrier)) {
                    anchorY = (targetData.isGuideline && targetData.guideY !== null) ? targetData.guideY : targetData.y;
                    targetX = centerX;
                } else {
                    const targetRect = this.geometry.getTargetRect(attr, root, scaleX, scaleY);
                    if (!targetRect) return;
                    anchorY = (targetEdge === 'bottom') ? targetRect.bottom : targetRect.top;
                    targetX = targetRect.left + targetRect.width / 2;
                }
            }

            const startY = (sourceEdge === 'bottom') ? rect.bottom : rect.top;
            this._drawConstraintLine(svg, centerX, startY, targetX, anchorY, type, c.id, targetId, opacity, 'vertical', sourceEdge, selectedId);
        };

        if (c.topToTop) processConstraint(c.topToTop, 'top', 'top');
        if (c.topToBottom) processConstraint(c.topToBottom, 'top', 'bottom');
        if (c.bottomToTop) processConstraint(c.bottomToTop, 'bottom', 'top');
        if (c.bottomToBottom) processConstraint(c.bottomToBottom, 'bottom', 'bottom');

        // Baseline logic
        if (c.baselineToBaseline) {
            const targetRect = this.geometry.getTargetRect(c.baselineToBaseline, root, scaleX, scaleY);
            const targetId = this._extractId(c.baselineToBaseline);
            const targetData = this._getConstraintData(targetId);
            if (targetData && targetRect) {
                const sourceBaseY = rect.top + c.baseline;
                const targetBaseY = targetRect.top + targetData.baseline;
                const color = this.colors.getBaselineColor(c.id === selectedId);
                
                const path = this.svgManager.createPath(
                    `M ${rect.left} ${sourceBaseY} L ${targetRect.left} ${targetBaseY}`,
                    color, '1.5', 'none', opacity
                );
                svg.appendChild(path);
            }
        }

        // Draw Bias Text
        if (useSpring && c.verticalBias !== 0.5 && c.id === selectedId) {
            // Position to the right of the view
            const biasY = rect.top + (rect.height * c.verticalBias);
            this._drawBiasText(svg, rect.right + 25, biasY, c.verticalBias);
        }
    }

    /**
    * Draw circular constraint
    */
    drawCircular(svg, c, rect, root, opacity, scaleX, scaleY) {
        const targetId = this._extractId(c.circleTo);
        let targetRect;
        
        if (targetId === 'parent') {
            targetRect = { left: 0, top: 0, width: root.offsetWidth, height: root.offsetHeight };
        } else {
            targetRect = this.geometry.getTargetRect(c.circleTo, root, scaleX, scaleY);
        }

        if (!targetRect) return;

        const sourceCx = rect.left + rect.width / 2;
        const sourceCy = rect.top + rect.height / 2;
        
        const targetCx = targetRect.left + targetRect.width / 2;
        const targetCy = targetRect.top + targetRect.height / 2;

        const color = this.colors.getCircularColor(c.id === this.selectedId);

        // Line
        const linePath = this.svgManager.createPath(
            `M ${targetCx} ${targetCy} L ${sourceCx} ${sourceCy}`,
            color, '1.5', 'none', opacity
        );
        svg.appendChild(linePath);

        // Center circle
        const circle = this.svgManager.createCircle(targetCx, targetCy, 3, color, null, null, opacity);
        svg.appendChild(circle);

        // Arrow
        this._drawArrow(svg, sourceCx, sourceCy, targetCx, targetCy, color, opacity);
    }

    /**
    * Draw constraint line (main logic)
    */
    _drawConstraintLine(svg, x1, y1, x2, y2, type, sourceId, targetId, opacity, orientation, sourceEdge, selectedId) {
        const isSelected = (sourceId === selectedId);
        const finalOpacity = isSelected ? 1.0 : opacity;
        const color = this.colors.getConstraintColor(isSelected);

        const length = this.geometry.getDistance(x1, y1, x2, y2);
        if (length < 2) return;

        // Chain handling with link symbols
        if (type === 'chain') {
            this._drawChainConnection(svg, x1, y1, x2, y2, color, finalOpacity, orientation);
            return;
        }

        // Determine path type
        const isAngled = Math.abs(x2 - x1) > 10 && Math.abs(y2 - y1) > 10;
        const shouldUseElbow = (type === 'straight' && this.geometry.shouldUseElbow(x1, y1, x2, y2));
        const isSameAxis = (orientation === 'vertical' && Math.abs(y1 - y2) < 10) || 
                          (orientation === 'horizontal' && Math.abs(x1 - x2) < 10);
        const shouldUseDetour = isSameAxis && length > this.config.DETOUR_MIN_LENGTH;

        // Calculate arrow angle
        const arrowAngle = this._calculateArrowAngle(x1, y1, x2, y2, sourceEdge, orientation, shouldUseDetour, shouldUseElbow);

        // Draw arrow
        this._drawArrowWithAngle(svg, x2, y2, arrowAngle, color, finalOpacity);

        // Calculate end point
        const arrowBackOff = 5;
        const endX = x2 - arrowBackOff * Math.cos(arrowAngle);
        const endY = y2 - arrowBackOff * Math.sin(arrowAngle);

        // Generate path
        let d = '';
        if (type === 'spring' && length >= this.config.SPRING_MIN_LENGTH) {
            d = this.pathGen.spring(x1, y1, endX, endY);
        } else if (shouldUseDetour) {
            d = this._generateDetourPath(x1, y1, endX, endY, sourceEdge);
        } else if (shouldUseElbow) {
            d = this.pathGen.elbow(x1, y1, endX, endY);
        } else {
            const gap = 3;
            const startX = x1 + gap * Math.cos(arrowAngle);
            const startY = y1 + gap * Math.sin(arrowAngle);
            d = `M ${startX} ${startY} L ${endX} ${endY}`;
        }

        // Draw path
        const path = this.svgManager.createPath(d, color, isSelected ? '1.8' : '1.2', 'none', finalOpacity);
        svg.appendChild(path);
    }

    /**
     * Draws the bias text (e.g., "30%") with a small background
     */
    _drawBiasText(svg, x, y, bias) {
        const percent = Math.round(bias * 100) + '%';
        
        // Background Group
        const group = this.svgManager.createElement('g', { opacity: '0.9' });

        // Background Rect (Black pill)
        const bg = this.svgManager.createElement('rect', {
            x: x - 14, y: y - 8,
            width: 28, height: 16,
            fill: '#000000',
            rx: 4,
            stroke: '#555',
            'stroke-width': '1'
        });

        // Text
        const text = this.svgManager.createElement('text', {
            x: x, y: y,
            fill: '#FFFFFF',
            'font-size': '10',
            'font-family': 'monospace',
            'text-anchor': 'middle',
            'alignment-baseline': 'middle',
            'dy': '1' // this fixes subtle vertical centering
        });
        text.textContent = percent;

        group.appendChild(bg);
        group.appendChild(text);
        svg.appendChild(group);
    }

    /**
    * Calculate arrow angle
    */
    _calculateArrowAngle(x1, y1, x2, y2, sourceEdge, orientation, isDetour, isElbow) {
        if (isDetour) {
            if (sourceEdge === 'top') return Math.PI / 2;
            if (sourceEdge === 'bottom') return -Math.PI / 2;
            if (sourceEdge === 'left') return 0;
            if (sourceEdge === 'right') return Math.PI;
            
            return (orientation === 'horizontal') ? 
                ((x2 > x1) ? 0 : Math.PI) : 
                ((y2 > y1) ? Math.PI / 2 : -Math.PI / 2);
        }
        
        if (isElbow) {
            return (orientation === 'horizontal') ? 
                ((x2 > x1) ? 0 : Math.PI) : 
                ((y2 > y1) ? Math.PI / 2 : -Math.PI / 2);
        }
        
        return Math.atan2(y2 - y1, x2 - x1);
    }

    /**
    * Generate detour (U-turn) path
    */
    _generateDetourPath(x1, y1, x2, y2, edge) {
        const offset = this.config.DETOUR_OFFSET;
        
        if (edge === 'top') {
            const midY = y1 - offset;
            return `M ${x1} ${y1} L ${x1} ${midY} L ${x2} ${midY} L ${x2} ${y2}`;
        } 
        else if (edge === 'bottom') {
            const midY = y1 + offset;
            return `M ${x1} ${y1} L ${x1} ${midY} L ${x2} ${midY} L ${x2} ${y2}`;
        } 
        else if (edge === 'left') {
            const midX = x1 - offset;
            return `M ${x1} ${y1} L ${midX} ${y1} L ${midX} ${y2} L ${x2} ${y2}`;
        } 
        else if (edge === 'right') {
            const midX = x1 + offset;
            return `M ${x1} ${y1} L ${midX} ${y1} L ${midX} ${y2} L ${x2} ${y2}`;
        }
        
        return `M ${x1} ${y1} L ${x2} ${y2}`;
    }

    /**
    * Draw chain connection with link symbols
    */
    _drawChainConnection(svg, x1, y1, x2, y2, color, opacity, orientation) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        const distance = Math.hypot(dx, dy);
        const angleDeg = Math.atan2(dy, dx) * 180 / Math.PI;

        const linkSize = this.config.CHAIN_LINK_SIZE;
        const linkStep = this.config.CHAIN_LINK_STEP;
        const linkId = "chainLinkSymbol";

        // Create symbol if not exists
        if (!document.getElementById(linkId)) {
            const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
            const symbol = document.createElementNS("http://www.w3.org/2000/svg", "symbol");

            symbol.setAttribute("id", linkId);
            symbol.setAttribute("viewBox", "0 0 24 24");

            const paths = [
                "M3 3c-1.108 0-2 .892-2 2v4c0 1.108.892 2 2 2h3c1.108 0 2-.892 2-2V5c0-1.108-.892-2-2-2zm0 1h3c.554 0 1 .446 1 1v4c0 .554-.446 1-1 1H3c-.554 0-1-.446-1-1V5c0-.554.446-1 1-1z",
                "M3 13c-1.108 0-2 .892-2 2v4c0 1.108.892 2 2 2h3c1.108 0 2-.892 2-2v-4c0-1.108-.892-2-2-2zm0 1h3c.554 0 1 .446 1 1v4c0 .554-.446 1-1 1H3c-.554 0-1-.446-1-1v-4c0-.554.446-1 1-1z"
            ];

            paths.forEach(d => {
                const p = document.createElementNS("http://www.w3.org/2000/svg", "path");
                p.setAttribute("d", d);
                p.setAttribute("fill", color);
                symbol.appendChild(p);
            });

            defs.appendChild(symbol);
            svg.appendChild(defs);
        }

        // Create group and add links
        const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
        group.setAttribute("transform", `translate(${x1}, ${y1}) rotate(${angleDeg})`);
        group.setAttribute("opacity", opacity);

        const count = Math.floor(distance / linkStep);

        for (let i = 0; i < count; i++) {
            const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
            use.setAttributeNS("http://www.w3.org/1999/xlink", "href", `#${linkId}`);
            use.setAttribute("x", i * linkStep);
            use.setAttribute("y", -linkSize / 2);
            use.setAttribute("width", linkSize);
            use.setAttribute("height", linkSize);
            use.setAttribute("transform", `rotate(-90 ${i * linkStep + linkSize / 2} 0)`);
            group.appendChild(use);
        }

        svg.appendChild(group);
    }

    /**
    * Draw arrow head
    */
    _drawArrow(svg, tipX, tipY, tailX, tailY, color, opacity) {
        const arrowPath = this.pathGen.generateArrowHead(tipX, tipY, tailX, tailY);
        const arrow = this.svgManager.createElement('path', {
            d: arrowPath,
            stroke: color,
            'stroke-width': '1.5',
            fill: 'none',
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
            opacity: opacity.toString()
        });
        svg.appendChild(arrow);
    }

    /**
    * Draw arrow with specific angle
    */
    _drawArrowWithAngle(svg, tipX, tipY, angle, color, opacity) {
        const size = 5;
        const x1 = tipX - size * Math.cos(angle - Math.PI / 6);
        const y1 = tipY - size * Math.sin(angle - Math.PI / 6);
        const x2 = tipX - size * Math.cos(angle + Math.PI / 6);
        const y2 = tipY - size * Math.sin(angle + Math.PI / 6);

        const arrowPath = `M ${x1} ${y1} L ${tipX} ${tipY} L ${x2} ${y2}`;
        const arrow = this.svgManager.createElement('path', {
            d: arrowPath,
            stroke: color,
            'stroke-width': '1.5',
            fill: 'none',
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
            opacity: opacity.toString()
        });
        svg.appendChild(arrow);
    }

    /**
    * Set constraint data reference
    */
    setConstraintData(constraintData) {
        this.constraintData = constraintData;
    }

    /**
    * Extract ID
    */
    _extractId(attr) {
        return attr ? attr.replace(/@\+?id\//, '') : null;
    }

    /**
    * Get constraint data
    */
    _getConstraintData(id) {
        return this.constraintData ? this.constraintData.get(id) : null;
    }
}