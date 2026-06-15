/**
 * PathGenerator.js
 * Generates SVG path strings for different constraint line types
 * - Straight lines
 * - Spring/Zigzag lines (for match_constraint)
 * - Elbow/U-turn lines (Android Studio style)
 */

export class PathGenerator {
    constructor() {
        this.config = {
            SPRING_SEGMENT_LENGTH: 4,
            SPRING_AMPLITUDE: 2.0,
            ELBOW_BREAK_PERCENTAGE: 0.7  // Where to bend (70% of the way)
        };
    }

    /**
     * Generate path based on type
     */
    generate(x1, y1, x2, y2, type, gap = 3, arrowBackOff = 5) {
        // Apply gap from view edge
        const angle = Math.atan2(y2 - y1, x2 - x1);
        const startX = x1 + gap * Math.cos(angle);
        const startY = y1 + gap * Math.sin(angle);
        
        // Back off from arrow
        const endX = x2 - arrowBackOff * Math.cos(angle);
        const endY = y2 - arrowBackOff * Math.sin(angle);

        switch(type) {
            case 'straight':
                return this.straight(startX, startY, endX, endY);
            case 'spring':
                return this.spring(startX, startY, endX, endY);
            case 'elbow':
                return this.elbow(startX, startY, endX, endY);
            default:
                return this.straight(startX, startY, endX, endY);
        }
    }

    /**
     * Straight line path
     */
    straight(x1, y1, x2, y2) {
        return `M ${x1} ${y1} L ${x2} ${y2}`;
    }

    /**
     * Spring/Zigzag path for match_constraint (0dp)
     */
    spring(x1, y1, x2, y2) {
        const segmentLen = this.config.SPRING_SEGMENT_LENGTH;
        const amplitude = this.config.SPRING_AMPLITUDE;
        const totalDist = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        
        // If too short, just draw straight
        if (totalDist < segmentLen * 2) {
            return this.straight(x1, y1, x2, y2);
        }

        const segments = Math.floor(totalDist / segmentLen);
        const dx = (x2 - x1) / totalDist;
        const dy = (y2 - y1) / totalDist;
        
        // Perpendicular direction for zigzag
        const nx = -dy;
        const ny = dx;

        let d = `M ${x1} ${y1}`;
        for (let i = 1; i < segments; i++) {
            const tx = x1 + dx * (i * segmentLen);
            const ty = y1 + dy * (i * segmentLen);
            const offset = (i % 2 === 0) ? amplitude : -amplitude;
            d += ` L ${tx + nx * offset} ${ty + ny * offset}`;
        }
        d += ` L ${x2} ${y2}`;
        return d;
    }

    /**
     * Elbow/U-turn path (Android Studio style)
     * Creates: __|--→ or |__ → depending on direction
     */
    elbow(x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        
        // Determine dominant direction
        const isHorizontalDominant = Math.abs(dx) > Math.abs(dy);
        
        if (isHorizontalDominant) {
            // Go horizontal first, then vertical
            const midX = x1 + dx * this.config.ELBOW_BREAK_PERCENTAGE;
            return `M ${x1} ${y1} L ${midX} ${y1} L ${midX} ${y2} L ${x2} ${y2}`;
        } else {
            // Go vertical first, then horizontal
            const midY = y1 + dy * this.config.ELBOW_BREAK_PERCENTAGE;
            return `M ${x1} ${y1} L ${x1} ${midY} L ${x2} ${midY} L ${x2} ${y2}`;
        }
    }

    /**
     * Generate arrow head path
     */
    generateArrowHead(tipX, tipY, tailX, tailY, size = 5) {
        const angle = Math.atan2(tipY - tailY, tipX - tailX);
        const x1 = tipX - size * Math.cos(angle - Math.PI / 6);
        const y1 = tipY - size * Math.sin(angle - Math.PI / 6);
        const x2 = tipX - size * Math.cos(angle + Math.PI / 6);
        const y2 = tipY - size * Math.sin(angle + Math.PI / 6);

        return `M ${x1} ${y1} L ${tipX} ${tipY} L ${x2} ${y2}`;
    }
}
