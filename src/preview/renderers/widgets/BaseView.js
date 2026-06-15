import { LogManager } from '../../core/LogManager.js';
import { DensityConverter } from '../../device/DensityConverter.js';
import { AttributeProcessor } from '../../resolvers/AttributeProcessor.js';

export class BaseView {
    constructor(resolver) {
        this.resolver = resolver;
        this.converter = new DensityConverter(); 
        this.processor = new AttributeProcessor(resolver); 
        this.interactiveEvents = ''; 
    }

    async getBaseStyles(nodeAttributes, parentType) {
        this.interactiveEvents = ''; 
        let finalAttrs = {};

        // Resolve Style Hierarchy
        if (nodeAttributes.style) {
            LogManager.v('StyleProcessor', `Resolving style hierarchy for: ${nodeAttributes.style}`);
            const styleAttrs = this.resolver.themeResolver.resolveStyleHierarchy(nodeAttributes.style);
            Object.assign(finalAttrs, styleAttrs);
        }
        Object.assign(finalAttrs, nodeAttributes);

        // Default dimensions check
        if (!finalAttrs.layout_width) {
            LogManager.w('View', `View missing layout_width, defaulting to wrap_content`);
            finalAttrs.layout_width = 'wrap_content';
        }
        if (!finalAttrs.layout_height) {
            LogManager.w('View', `View missing layout_height, defaulting to wrap_content`);
            finalAttrs.layout_height = 'wrap_content';
        }

        const viewId = finalAttrs['android:id'] || finalAttrs['id'] || 'NO_ID';
        // LogManager.v('View', `Processing attributes for ${viewId} (Parent: ${parentType})`);

        const props = this.processor.process(finalAttrs, parentType);

        const style = {
            'box-sizing': 'border-box',
            'position': 'relative', 
            'display': 'flex',
        };

        // Helper to get attribute values
        const getVal = (k) => finalAttrs[k] || finalAttrs[`android:${k}`];

        // ---------------------------------------------------------
        // 1. MARGINS & DIMENSIONS CALCULATION
        // ---------------------------------------------------------
        
        const mLeftVal = getVal('layout_marginLeft') || getVal('layout_marginStart') || getVal('layout_margin') || '0dp';
        const mRightVal = getVal('layout_marginRight') || getVal('layout_marginEnd') || getVal('layout_margin') || '0dp';
        const mTopVal = getVal('layout_marginTop') || getVal('layout_margin') || '0dp';
        const mBottomVal = getVal('layout_marginBottom') || getVal('layout_margin') || '0dp';

        const marginsH = `${this.converter.parse(mLeftVal)} + ${this.converter.parse(mRightVal)}`;
        const marginsV = `${this.converter.parse(mTopVal)} + ${this.converter.parse(mBottomVal)}`;

        // Handle Width
        if (finalAttrs.layout_width === 'match_parent') {
            style.width = `calc(100% - (${marginsH}))`;
        } else {
            style.width = props.width;
        }

        // Handle Height
        if (finalAttrs.layout_height === 'match_parent') {
            style.height = `calc(100% - (${marginsV}))`;
        } else {
            style.height = props.height;
        }

        // Apply Margins
        if (mTopVal !== '0dp') style['margin-top'] = this.converter.parse(mTopVal);
        if (mBottomVal !== '0dp') style['margin-bottom'] = this.converter.parse(mBottomVal);
        if (mLeftVal !== '0dp') style['margin-inline-start'] = this.converter.parse(mLeftVal);
        if (mRightVal !== '0dp') style['margin-inline-end'] = this.converter.parse(mRightVal);

        // ---------------------------------------------------------
        // 2. CONSTRAINTS & POSITIONING
        // ---------------------------------------------------------

        if (props.minWidth) style['min-width'] = `${props.minWidth} !important`;
        if (props.minHeight) style['min-height'] = `${props.minHeight} !important`;
        if (props.maxWidth) style['max-width'] = props.maxWidth;
        if (props.maxHeight) style['max-height'] = props.maxHeight;
        
        if (props.position) style.position = props.position;
        if (props.top) style.top = props.top;
        if (props.bottom) style.bottom = props.bottom;
        if (props.left) style.left = props.left;
        if (props.right) style.right = props.right;
        if (props.transform) style.transform = props.transform;
        
        if (props.opacity) style.opacity = props.opacity;

        const visibility = getVal('visibility');
        if (visibility === 'gone') {
            style.display = 'none !important';
            LogManager.v('View', `View ${viewId} set to GONE`);
        } else if (visibility === 'invisible') {
            style.visibility = 'hidden !important';
        }
        
        const fitsSystemWindows = getVal('fitsSystemWindows') === 'true';
        if (fitsSystemWindows) {
            // style['padding-top'] = '24px'; 
            LogManager.i('View', `Applied system window insets to ${viewId}`);
        }
        
        const layoutDir = getVal('layoutDirection');
        if (layoutDir === 'rtl') style.direction = 'rtl';
        if (layoutDir === 'ltr') style.direction = 'ltr';

        // Correct Gravity Parsing Logic
        if (props.layout_gravity) {
            const lg = props.layout_gravity;
            const isTrueCenter = /\bcenter\b/.test(lg); 
            const isCenterH = lg.includes('center_horizontal');

            if (lg.includes('center')) {
                style['align-self'] = 'center';
            } else if (lg.includes('right') || lg.includes('end')) {
                style['align-self'] = 'flex-end';
            }

            if (isTrueCenter || isCenterH) {
                style['margin-left'] = 'auto'; 
                style['margin-right'] = 'auto';
            } 
            else if (lg.includes('right') || lg.includes('end')) {
                style['margin-left'] = 'auto';
                style['margin-right'] = '0'; 
            }
        }

        // ---------------------------------------------------------
        // 3. PADDING
        // ---------------------------------------------------------

        const pAll = getVal('padding');
        const pStart = getVal('paddingStart');
        const pEnd = getVal('paddingEnd');
        const pLeft = getVal('paddingLeft');
        const pRight = getVal('paddingRight');
        const pTop = getVal('paddingTop');
        const pBottom = getVal('paddingBottom');
        const pH = getVal('paddingHorizontal');
        const pV = getVal('paddingVertical');

        if (pAll) style['padding'] = this.converter.parse(pAll);
        
        if (pH) {
            const v = this.converter.parse(pH);
            style['padding-left'] = v; style['padding-right'] = v;
        }
        if (pV) {
            const v = this.converter.parse(pV);
            style['padding-top'] = v; style['padding-bottom'] = v;
        }

        if (pTop) style['padding-top'] = this.converter.parse(pTop);
        if (pBottom) style['padding-bottom'] = this.converter.parse(pBottom);
        if (pStart) style['padding-inline-start'] = this.converter.parse(pStart);
        if (pEnd) style['padding-inline-end'] = this.converter.parse(pEnd);
        if (pLeft) style['padding-left'] = this.converter.parse(pLeft);
        if (pRight) style['padding-right'] = this.converter.parse(pRight);

        // ---------------------------------------------------------
        // 4. BACKGROUND & DECORATION
        // ---------------------------------------------------------
        
        const elevation = parseFloat(getVal('elevation') || '0');
        const translationZ = parseFloat(getVal('translationZ') || '0');
        const zIndex = parseInt(getVal('zIndex') || '0'); 
        
        const totalZ = elevation + translationZ + zIndex;
        if (totalZ > 0) {
            style['z-index'] = Math.round(10 + totalZ);
        }
        
        const isLayout = ['LinearLayout', 'FrameLayout', 'ConstraintLayout', 'ScrollView', 'CardView', 'RelativeLayout', 'ViewGroup'].includes(this.constructor.name);
        
        if (isLayout) {
            style['border-style'] = 'solid';
            style['border-color'] = 'transparent';
            style['background-clip'] = 'border-box';
            style['border-width'] = '0px'; 
        }

        if (props.background) {
            const bg = props.background;
            
            if (bg.type === 'color') {
                style['background-color'] = bg.value;
                const contrastColor = this._getContrastColor(bg.value);
                if (contrastColor) {
                    style['--auto-text'] = contrastColor;
                    style['color'] = contrastColor; 
                }
            } 
            else if (bg.type === 'drawable') {
                LogManager.d('ResourceManager', `Resolving background drawable for ${viewId}: ${bg.value}`);
                const drawable = await this.resolver.resolveDrawable(bg.value);
                
                if (drawable) {
                    this._applyDrawable(style, drawable);
                } else {
                    LogManager.w('ResourceManager', `Drawable resolution failed for: ${bg.value}`);
                }
            }
        }
        
        if (props.backgroundTint) {
            if (!style['background-color'] && !style['background-image']) {
                style['background-color'] = props.backgroundTint;
            } 
            else if (style['background-image']) {
                style['background-color'] = props.backgroundTint;
                style['background-blend-mode'] = 'multiply'; 
            }
        }

        if (props.elevation) {
            const el = parseFloat(props.elevation); 
            if (!isNaN(el) && el > 0 && props.background) {
                style['box-shadow'] = `0px ${el/2}px ${el}px rgba(0,0,0,0.24)`;
            }
        }
        
        // ---------------------------------------------------------
        // CIRCLE SHAPE PRESERVATION
        // ---------------------------------------------------------
        
        const rawCss = style['__raw_css__'] || '';
        
        // Padding fix for raw CSS
        if (rawCss.includes('padding')) {
            const pMatch = rawCss.match(/padding:\s*([\d.]+)px/);
            if (pMatch) style['padding'] = pMatch[1] + 'px';
             
            const plMatch = rawCss.match(/padding-left:\s*([\d.]+)px/);
            if (plMatch) style['padding-left'] = plMatch[1] + 'px';
             
            const ptMatch = rawCss.match(/padding-top:\s*([\d.]+)px/);
            if (ptMatch) style['padding-top'] = ptMatch[1] + 'px';
             
            const prMatch = rawCss.match(/padding-right:\s*([\d.]+)px/);
            if (prMatch) style['padding-right'] = prMatch[1] + 'px';
             
            const pbMatch = rawCss.match(/padding-bottom:\s*([\d.]+)px/);
            if (pbMatch) style['padding-bottom'] = pbMatch[1] + 'px';
        }
        
        // Check if border-radius is 50%
        const hasBorderRadius = (style['border-radius'] && style['border-radius'].includes('50%')) || 
                                rawCss.includes('border-radius: 50%') || 
                                rawCss.includes('border-radius:50%');
        
        // Check if there is a border-image (which ruins the circle shape)
        const hasBorderImage = rawCss.includes('border-image');

        if (hasBorderRadius && hasBorderImage) {
            LogManager.w('View', `Circle shape integrity check failed for ${viewId}. Removing border-image.`);
             
            // 1. Clean up the gradient border image
            style['__raw_css__'] = style['__raw_css__'].replace(/border-image:[^;]+;/g, '');
            style['__raw_css__'] = style['__raw_css__'].replace(/border:[^;]+;/g, '');
             
            // 2. Apply standard dashed border that works with border-radius
            style['border-style'] = 'dashed';
            style['border-width'] = '2px';
             
            // 3. Match theme color (Fallback logic)
            if (!style['border-color'] || style['border-color'] === 'transparent') {
                style['border-color'] = '#00E5FF'; 
            }
        }

        return this._objToCss(style);
    }

    _applyDrawable(style, drawable) {
        if (drawable.type === 'css') {
            style['__raw_css__'] = drawable.value;
        } 
        else if (drawable.type === 'svg') {
            const encoded = encodeURIComponent(drawable.value);
            style['background-image'] = `url('data:image/svg+xml;utf8,${encoded}')`;
            style['background-size'] = 'contain';
            style['background-repeat'] = 'no-repeat';
            style['background-position'] = 'center';
        }
        else if (drawable.type === 'selector') {
            const defaultItem = drawable.items.find(i => i.state === 'default') || drawable.items[0];
            const pressedItem = drawable.items.find(i => i.state === 'pressed');

            if (defaultItem) {
                if (defaultItem.type === 'css') {
                    const staticProps = this._extractStaticCss(defaultItem.value);
                    style['__raw_css__'] = staticProps;
                }
                const defVal = this._extractColor(defaultItem);
                const pressVal = pressedItem ? this._extractColor(pressedItem) : defVal;
                style['--bg-normal'] = defVal;
                style['--bg-pressed'] = pressVal;
                style['background'] = 'var(--bg-normal)';
                style['transition'] = 'background 0.2s ease';
                if (pressedItem) {
                    this.interactiveEvents = `onmousedown="this.style.background='var(--bg-pressed)'" onmouseup="this.style.background='var(--bg-normal)'" onmouseleave="this.style.background='var(--bg-normal)'" ontouchstart="this.style.background='var(--bg-pressed)'" ontouchend="this.style.background='var(--bg-normal)'"`;
                }
            }
        }
    }

    _extractColor(item) {
        if (!item) return 'transparent';
        if (item.type === 'color') return item.value;
        if (item.type === 'css') {
            const match = item.value.match(/background(?:-color)?\s*:\s*([^;]+)/i);
            return match ? match[1].trim() : 'transparent';
        }
        return 'transparent';
    }
    
    _getContrastColor(hex) {
        if (!hex || !hex.startsWith('#')) return null;
        hex = hex.replace('#', '');
        let r, g, b;
        if (hex.length === 3) {
            r = parseInt(hex[0] + hex[0], 16); g = parseInt(hex[1] + hex[1], 16); b = parseInt(hex[2] + hex[2], 16);
        } else if (hex.length === 6 || hex.length === 8) {
            r = parseInt(hex.substring(0, 2), 16); g = parseInt(hex.substring(2, 4), 16); b = parseInt(hex.substring(4, 6), 16);
        } else return null;
        const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
        return (yiq >= 128) ? '#3b3b3b' : '#FFFFFF';
    }
    
    _extractStaticCss(cssString) {
        return cssString.replace(/background(?:-color)?\s*:\s*[^;]+;/gi, '').replace(/background\s*:\s*[^;]+;/gi, '');
    }

    _objToCss(obj) {
        let css = '';
        Object.entries(obj).forEach(([k, v]) => {
            if (k === '__raw_css__') css += v;
            else css += `${k}:${v}; `;
        });
        return css;
    }
}