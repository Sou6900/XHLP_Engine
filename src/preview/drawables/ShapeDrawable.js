import { LogManager } from '../core/LogManager.js';
import { DensityConverter } from '../device/DensityConverter.js';

export class ShapeDrawable {
    constructor() {
        this.converter = new DensityConverter();
    }

    _getAttr(attr, name) {
        if (!attr) return null;
        return attr['android:' + name] || attr[name];
    }

    _normalizeColor(color) {
        if (!color) return null;
        
        if (color.startsWith('#')) {
            const hex = color.replace('#', '');
            if (hex.length === 8) {
                const alpha = hex.substring(0, 2);
                const rgb = hex.substring(2);
                return `#${rgb}${alpha}`;
            }
            if (hex.length === 4) {
                const alpha = hex.substring(0, 1);
                const rgb = hex.substring(1);
                return `#${rgb}${alpha}`;
            }
        }
        return color;
    }

    createStyle(shapeNode) {
        if (!shapeNode || shapeNode.type !== 'shape') return '';

        let style = '';
        const attr = shapeNode.attributes || {};
        const children = shapeNode.children || [];
        
        // 1. SHAPE TYPE
        const shapeType = this._getAttr(attr, 'shape') || 'rectangle';
        LogManager.v('ShapeDrawable', `Compiling shape type: ${shapeType}`);
        
        // RING Shape
        if (shapeType === 'ring') {
            const innerRadius = this._getAttr(attr, 'innerRadius');
            const innerRadiusRatio = this._getAttr(attr, 'innerRadiusRatio');
            const thickness = this._getAttr(attr, 'thickness');
            const thicknessRatio = this._getAttr(attr, 'thicknessRatio');
            
            let innerR = innerRadius ? parseFloat(this.converter.parse(innerRadius)) : null;
            let thick = thickness ? parseFloat(this.converter.parse(thickness)) : null;
            
            if (innerRadiusRatio && !innerR) innerR = 100 / parseFloat(innerRadiusRatio);
            if (thicknessRatio && !thick) thick = 100 / parseFloat(thicknessRatio);
            
            if (!innerR) innerR = 30;
            if (!thick) thick = 10;
            
            const totalSize = (innerR + thick) * 2;
            
            style += `
                width: ${totalSize}px;
                height: ${totalSize}px;
                border-radius: 50%;
                box-sizing: border-box;
            `;
            
        } else if (shapeType === 'oval') {
            style += `border-radius: 50%; `;
        } else if (shapeType === 'line') {
            style += `height: 1px; width: 100%; `;
        }

        // 2. SOLID
        const solid = children.find(c => c.type === 'solid');
        if (solid) {
            const color = this._normalizeColor(this._getAttr(solid.attributes, 'color'));
            if (color) {
                if (shapeType === 'ring') {
                    style += `background-color: transparent; `;
                } else {
                    style += `background-color: ${color}; `;
                }
            }
        }

        // 3. CORNERS
        const corners = children.find(c => c.type === 'corners');
        if (corners && shapeType !== 'oval' && shapeType !== 'ring') {
            const cAttr = corners.attributes;
            const radius = this._getAttr(cAttr, 'radius');
            
            if (radius) {
                style += `border-radius: ${this.converter.parse(radius)}; `;
            } else {
                const tl = this._getAttr(cAttr, 'topLeftRadius');
                const tr = this._getAttr(cAttr, 'topRightRadius');
                const bl = this._getAttr(cAttr, 'bottomLeftRadius');
                const br = this._getAttr(cAttr, 'bottomRightRadius');
                
                if (tl) style += `border-top-left-radius: ${this.converter.parse(tl)}; `;
                if (tr) style += `border-top-right-radius: ${this.converter.parse(tr)}; `;
                if (bl) style += `border-bottom-left-radius: ${this.converter.parse(bl)}; `;
                if (br) style += `border-bottom-right-radius: ${this.converter.parse(br)}; `;
            }
        }

        // 4. STROKE
        const stroke = children.find(c => c.type === 'stroke');
        if (stroke) {
            const sAttr = stroke.attributes;
            const width = this.converter.parse(this._getAttr(sAttr, 'width') || '1dp');
            const color = this._normalizeColor(this._getAttr(sAttr, 'color') || '#000000');
            const dashWidth = this._getAttr(sAttr, 'dashWidth');
            const dashGap = this._getAttr(sAttr, 'dashGap');
            
            if (dashWidth && dashGap) {
                const dw = this.converter.parse(dashWidth);
                const dg = this.converter.parse(dashGap);
                const dwNum = parseFloat(dw);
                const dgNum = parseFloat(dg);
                
                style += `
                    border: ${width} solid transparent;
                    border-image: repeating-linear-gradient(
                        90deg,
                        ${color} 0,
                        ${color} ${dw},
                        transparent ${dw},
                        transparent ${dwNum + dgNum}px
                    ) 1;
                    box-sizing: border-box;
                `;
            } else {
                style += `border: ${width} solid ${color}; box-sizing: border-box; `;
            }
        }

        // 5. GRADIENT
        const gradient = children.find(c => c.type === 'gradient');
        if (gradient) {
            LogManager.v('ShapeDrawable', 'Applying gradient shader...');
            style += this._parseGradient(gradient.attributes);
        }

        // 6. SIZE
        const size = children.find(c => c.type === 'size');
        if (size) {
            const sAttr = size.attributes;
            const w = this._getAttr(sAttr, 'width');
            const h = this._getAttr(sAttr, 'height');
            
            if (w) style += `width: ${this.converter.parse(w)}; `;
            if (h) style += `height: ${this.converter.parse(h)}; `;
        }

        // 7. PADDING
        const padding = children.find(c => c.type === 'padding');
        if (padding) {
            const pAttr = padding.attributes;
            const l = this._getAttr(pAttr, 'left');
            const t = this._getAttr(pAttr, 'top');
            const r = this._getAttr(pAttr, 'right');
            const b = this._getAttr(pAttr, 'bottom');
            
            if (l) style += `padding-left: ${this.converter.parse(l)}; `;
            if (t) style += `padding-top: ${this.converter.parse(t)}; `;
            if (r) style += `padding-right: ${this.converter.parse(r)}; `;
            if (b) style += `padding-bottom: ${this.converter.parse(b)}; `;
        }

        return style;
    }

    _parseGradient(attr) {
        if (!attr) return '';
        
        const startColor = this._normalizeColor(this._getAttr(attr, 'startColor'));
        const endColor = this._normalizeColor(this._getAttr(attr, 'endColor'));
        const centerColor = this._normalizeColor(this._getAttr(attr, 'centerColor'));
        
        if (!startColor || !endColor) return '';

        const type = this._getAttr(attr, 'type') || 'linear';
        const colors = centerColor ? `${startColor}, ${centerColor}, ${endColor}` : `${startColor}, ${endColor}`;

        if (type === 'radial') {
            const cx = parseFloat(this._getAttr(attr, 'centerX') || '0.5') * 100;
            const cy = parseFloat(this._getAttr(attr, 'centerY') || '0.5') * 100;
            let radius = this._getAttr(attr, 'gradientRadius');
            if (!radius) return '';
            
            let sizeKeyword = this.converter.parse(radius);
            if (radius.endsWith('%p')) sizeKeyword = 'closest-side'; 
            
            return `background: radial-gradient(circle ${sizeKeyword} at ${cx}% ${cy}%, ${colors}); `;
        }

        if (type === 'sweep') {
            const cx = parseFloat(this._getAttr(attr, 'centerX') || '0.5') * 100;
            const cy = parseFloat(this._getAttr(attr, 'centerY') || '0.5') * 100;
            return `background: conic-gradient(from 90deg at ${cx}% ${cy}%, ${colors}); `;
        }

        let angle = parseInt(this._getAttr(attr, 'angle') || '0');
        return `background: linear-gradient(${90 - angle}deg, ${colors}); `;
    }
}