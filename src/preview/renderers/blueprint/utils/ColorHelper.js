/**
 * ColorHelper.js
 * Manages colors for blueprint elements
 */

export class ColorHelper {
    constructor() {
        this.colors = {
            // Constraint lines
            CONSTRAINT_DEFAULT: '#64C8FF',
            CONSTRAINT_SELECTED: '#3E86F2',
            
            // Special elements
            GUIDELINE: '#E91E63',
            BARRIER: '#FF9800',
            BASELINE: '#FFB74D',
            BASELINE_SELECTED: '#FF6B00',
            CIRCULAR: '#64C8FF',
            
            // Anchors
            ANCHOR_FILL: '#ffffff',
            ANCHOR_STROKE: '#3E86F2'
        };
    }

    /**
     * Get constraint line color
     */
    getConstraintColor(isSelected) {
        return isSelected ? this.colors.CONSTRAINT_SELECTED : this.colors.CONSTRAINT_DEFAULT;
    }

    /**
     * Get guideline color
     */
    getGuidelineColor() {
        return this.colors.GUIDELINE;
    }

    /**
     * Get barrier color
     */
    getBarrierColor() {
        return this.colors.BARRIER;
    }

    /**
     * Get baseline color
     */
    getBaselineColor(isSelected) {
        return isSelected ? this.colors.BASELINE_SELECTED : this.colors.BASELINE;
    }

    /**
     * Get circular constraint color
     */
    getCircularColor(isSelected) {
        return isSelected ? this.colors.CONSTRAINT_SELECTED : this.colors.CIRCULAR;
    }

    /**
     * Get anchor colors
     */
    getAnchorColors() {
        return {
            fill: this.colors.ANCHOR_FILL,
            stroke: this.colors.ANCHOR_STROKE
        };
    }
}
