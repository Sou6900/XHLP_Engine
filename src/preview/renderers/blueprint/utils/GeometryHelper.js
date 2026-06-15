/**
 * GeometryHelper.js
 * Handles geometric calculations for blueprint rendering
 * - Rectangle calculations
 * - Distance measurements
 * - Line type detection (should use elbow?)
 */

export class GeometryHelper {
    constructor() {
        this.config = {
            ELBOW_THRESHOLD: 50,  // Minimum distance to use elbow
            DIAGONAL_TOLERANCE: 5  // If dx or dy < 5px, consider it straight
        };
    }

    /**
     * Get relative rectangle coordinates (with scroll support)
     */
    getRelativeRect(element, rootElement, scaleX = 1, scaleY = 1) {
        if (!element || !rootElement) {
            return { left: 0, top: 0, right: 0, bottom: 0, width: 0, height: 0 };
        }
        
        const e = element.getBoundingClientRect();
        const r = rootElement.getBoundingClientRect();
        
        // Include scroll offset
        const scrollX = rootElement.scrollLeft || 0;
        const scrollY = rootElement.scrollTop || 0;
        
        return {
            left: (e.left - r.left) / scaleX + scrollX,
            top: (e.top - r.top) / scaleY + scrollY,
            right: (e.right - r.left) / scaleX + scrollX,
            bottom: (e.bottom - r.top) / scaleY + scrollY,
            width: e.width / scaleX,
            height: e.height / scaleY
        };
    }

    /**
     * Get target rectangle from ID
     */
    getTargetRect(targetIdRaw, rootElement, scaleX = 1, scaleY = 1) {
        const targetId = this._extractId(targetIdRaw);
        
        if (targetId === 'parent') {
            return { 
                left: 0, 
                top: 0, 
                right: rootElement.offsetWidth, 
                bottom: rootElement.offsetHeight, 
                width: rootElement.offsetWidth, 
                height: rootElement.offsetHeight 
            };
        }
        
        const targetElement = rootElement.querySelector(`[id="${targetId}"]`);
        return targetElement ? this.getRelativeRect(targetElement, rootElement, scaleX, scaleY) : null;
    }

    /**
     * Calculate distance between two points
     */
    getDistance(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    }

    /**
     * Check if line should use elbow style
     * Criteria: length > threshold AND line is diagonal
     */
    shouldUseElbow(x1, y1, x2, y2) {
        const dx = Math.abs(x2 - x1);
        const dy = Math.abs(y2 - y1);
        const distance = this.getDistance(x1, y1, x2, y2);
        
        // Must be long enough
        if (distance < this.config.ELBOW_THRESHOLD) {
            return false;
        }
        
        // Must be diagonal (not straight horizontal or vertical)
        if (dx < this.config.DIAGONAL_TOLERANCE || dy < this.config.DIAGONAL_TOLERANCE) {
            return false;
        }
        
        return true;
    }

    /**
     * Extract clean ID from attribute value
     */
    _extractId(idValue) {
        return idValue ? idValue.replace(/@\+?id\//, '') : null;
    }

    /**
     * Get center point of a rectangle
     */
    getRectCenter(rect) {
        return {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
        };
    }

    /**
     * Get edge coordinate of a rectangle
     */
    getRectEdge(rect, edge) {
        switch(edge) {
            case 'left':
            case 'start':
                return { x: rect.left, y: rect.top + rect.height / 2 };
            case 'right':
            case 'end':
                return { x: rect.right, y: rect.top + rect.height / 2 };
            case 'top':
                return { x: rect.left + rect.width / 2, y: rect.top };
            case 'bottom':
                return { x: rect.left + rect.width / 2, y: rect.bottom };
            default:
                return this.getRectCenter(rect);
        }
    }
}
