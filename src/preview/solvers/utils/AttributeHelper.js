import { DensityConverter } from '../../device/DensityConverter.js';
import { LogManager } from '../../core/LogManager.js';

export class AttributeHelper {
    constructor(solver) {
        this.solver = solver;
        this.converter = new DensityConverter();
        this.TAG = 'AttributeHelper';
    }

    getAttr(attr, name) {
        if (!attr) return null;
        return attr[name] || attr[`android:${name}`] || attr[`app:${name}`];
    }

    parsePx(val) {
        if (!val) return 0;
        
        // Try parsing
        const parsedVal = this.converter.parse(val);
        const res = parseFloat(parsedVal);
        
        // ⚠ Invalid Dimension Warning
        if (isNaN(res)) {
            LogManager.w(this.TAG, `[Parse Error] Invalid dimension value: '${val}'. Defaulting to 0.`);
            return 0;
        }
        return res;
    }

    getId(node) {
        const rawId = node.attributes.id || node.attributes['android:id'] || node.attributes['android:attr/id'];
        return rawId ? rawId.replace(/@\+?id\//, '') : null;
    }

    getMargin(attr, type, targetId) {
        // Handle Gone Margins
        if (type && targetId && targetId !== 'parent') {
            const targetState = this.solver.nodeMap.get(targetId);
            
            // Check if target exists and is GONE
            if (targetState) {
                const vis = this.getAttr(targetState.node.attributes, 'visibility');
                if (vis === 'gone') {
                    const goneName = `layout_goneMargin${type}`;
                    const goneVal = this.getAttr(attr, goneName);
                    
                    if (goneVal) {
                        const pxVal = this.parsePx(goneVal);
                        LogManager.v(this.TAG, `[GoneMargin] Applied ${goneName}='${goneVal}' (${pxVal}px) because @id/${targetId} is GONE.`);
                        return pxVal;
                    }
                    return 0; // Default behavior when anchor is GONE and no goneMargin is set
                }
            }
        }

        // Standard Directional Margins (e.g., layout_marginTop)
        if (type) {
            const val = this.getAttr(attr, `layout_margin${type}`);
            if (val !== undefined && val !== null) {
                return this.parsePx(val);
            }
        }

        // Axis Margins (e.g., layout_marginHorizontal)
        if (['Left', 'Right', 'Start', 'End'].includes(type)) {
            const val = this.getAttr(attr, 'layout_marginHorizontal');
            if (val !== undefined && val !== null) return this.parsePx(val);
        }

        if (['Top', 'Bottom'].includes(type)) {
            const val = this.getAttr(attr, 'layout_marginVertical');
            if (val !== undefined && val !== null) return this.parsePx(val);
        }

        // Global Margin (e.g., layout_margin)
        const val = this.getAttr(attr, 'layout_margin');
        if (val !== undefined && val !== null) return this.parsePx(val);

        return 0;
    }
}