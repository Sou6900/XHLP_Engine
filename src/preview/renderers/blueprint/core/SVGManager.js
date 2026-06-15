/**
 * SVGManager.js
 * Manages SVG overlay creation and lifecycle
 */

export class SVGManager {
    constructor() {
        this.svgOverlay = null;
    }

    createSVG(rootElement) {
        if (this.svgOverlay) {
            this.svgOverlay.remove();
            this.svgOverlay = null;
        }

        if (!rootElement) return null;

        const bounds = rootElement.getBoundingClientRect();
        const unscaledWidth = rootElement.offsetWidth;
        const unscaledHeight = rootElement.offsetHeight;
        
        if (unscaledWidth === 0 || bounds.width === 0) return null;

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('class', 'blueprint-springs-overlay');
        svg.style.cssText = `
            position: absolute; 
            top: 0; 
            left: 0; 
            width: 100%; 
            height: 100%; 
            pointer-events: none; 
            z-index: 9999;
        `;
        svg.setAttribute('width', unscaledWidth);
        svg.setAttribute('height', unscaledHeight);
        svg.setAttribute('viewBox', `0 0 ${unscaledWidth} ${unscaledHeight}`);

        rootElement.appendChild(svg);
        this.svgOverlay = svg;
        
        return svg;
    }

    getScaleFactors(rootElement) {
        const bounds = rootElement.getBoundingClientRect();
        const unscaledWidth = rootElement.offsetWidth;
        const unscaledHeight = rootElement.offsetHeight;

        return {
            scaleX: bounds.width / unscaledWidth,
            scaleY: bounds.height / unscaledHeight
        };
    }

    removeSVG() {
        if (this.svgOverlay) {
            this.svgOverlay.remove();
            this.svgOverlay = null;
        }
    }

    createElement(type, attributes = {}) {
        const element = document.createElementNS('http://www.w3.org/2000/svg', type);
        
        Object.entries(attributes).forEach(([key, value]) => {
            element.setAttribute(key, value);
        });
        
        return element;
    }

    createPath(d, stroke, strokeWidth = '1.2', fill = 'none', opacity = 1.0) {
        return this.createElement('path', {
            d,
            stroke,
            'stroke-width': strokeWidth,
            fill,
            opacity: opacity.toString()
        });
    }

    createCircle(cx, cy, r, fill, stroke = null, strokeWidth = null, opacity = 1.0) {
        const attrs = {
            cx: cx.toString(),
            cy: cy.toString(),
            r: r.toString(),
            fill,
            opacity: opacity.toString()
        };
        
        if (stroke) attrs.stroke = stroke;
        if (strokeWidth) attrs['stroke-width'] = strokeWidth;
        
        return this.createElement('circle', attrs);
    }
}
