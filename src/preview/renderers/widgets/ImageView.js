// ImageView.js
import { BaseView } from './BaseView.js';
import { LogManager } from '../../core/LogManager.js';

export class ImageView extends BaseView {
    
    async render(node, parentType) {
        const attr = node.attributes;
        const baseStyle = await this.getBaseStyles(attr, parentType);
        
        const viewId = attr.id ? attr.id.replace('@+id/', '') : 'NO_ID';
        
        // 1. ScaleType Mapping
        const scaleType = attr.scaleType || attr['android:scaleType'] || 'fitCenter';
        // LogManager.v('ImageView', `[${viewId}] ScaleType: ${scaleType}`);
        
        let objectFit = 'contain'; 
        let objectPosition = 'center';
        let maskSize = 'contain';
        let maskPosition = 'center';

        switch (scaleType) {
            case 'centerCrop': 
                objectFit = 'cover'; maskSize = 'cover'; break;
            case 'fitXY': 
                objectFit = 'fill'; maskSize = '100% 100%'; break;
            case 'fitStart': 
                objectFit = 'contain'; objectPosition = 'left top'; 
                maskSize = 'contain'; maskPosition = 'left top'; break;
            case 'fitEnd': 
                objectFit = 'contain'; objectPosition = 'right bottom'; 
                maskSize = 'contain'; maskPosition = 'right bottom'; break;
            case 'center': 
                objectFit = 'none'; maskSize = 'auto'; break;
            case 'fitCenter':
            case 'centerInside':
            default: 
                objectFit = 'contain'; maskSize = 'contain'; break;
        }

        // 2. New Props Implementation

        // A. Handle AdjustViewBounds
        const adjustViewBounds = attr['android:adjustViewBounds'] === 'true' || attr['adjustViewBounds'] === 'true';
        const layoutW = attr['android:layout_width'] || attr['layout_width'];
        const layoutH = attr['android:layout_height'] || attr['layout_height'];

        let cssWidth = '100%';
        let cssHeight = '100%';

        if (adjustViewBounds) {
            if (layoutW === 'wrap_content') {
                cssWidth = 'auto';
                baseStyle.includes('max-width') ? null : (cssWidth += '; max-width: 100%'); 
            }
            if (layoutH === 'wrap_content') {
                cssHeight = 'auto';
                baseStyle.includes('max-height') ? null : (cssHeight += '; max-height: 100%');
            }
            LogManager.d('ImageView', `[${viewId}] adjustViewBounds enabled`);
        }

        // B. Handle CropToPadding
        const cropToPadding = attr['android:cropToPadding'] === 'true' || attr['cropToPadding'] === 'true';
        let cropStyle = '';
        if (cropToPadding) {
            cropStyle = `box-sizing: border-box; background-clip: content-box;`;
            if (!adjustViewBounds) { cropStyle += `padding: inherit;`; }
        }

        // C. Handle Alpha
        const alpha = attr['android:alpha'] || attr['alpha'];
        let alphaStyle = '';
        if (alpha !== undefined && alpha !== null) {
            const opacityVal = parseFloat(alpha);
            if (!isNaN(opacityVal)) {
                alphaStyle = `opacity: ${opacityVal};`;
            }
        }

        // 3. Tint & Source Processing
        const tint = attr['app:tint'] || attr['android:tint'] || attr.tint;
        const tintMode = attr['app:tintMode'] || attr['android:tintMode'] || 'src_in';
        
        let tintColor = null;
        if (tint) {
            tintColor = this.resolver.resolveColor(tint);
            LogManager.v('ImageView', `[${viewId}] Tint: ${tintColor} (${tintMode})`);
        }

        let src = '';
        let svgContent = null;
        let cssBackground = '';
        let isShape = false;

        // app:srcCompat and srcCompat
        const rawSrc = attr.src || attr['android:src'] || attr['app:srcCompat'] || attr['srcCompat'];
        
        if (rawSrc) {
            LogManager.d('Resources', `[${viewId}] Loading image resource: ${rawSrc}`);
            
            if (rawSrc.startsWith('@drawable/') || rawSrc.startsWith('@mipmap/') || rawSrc.startsWith('@android:drawable/') ) {
                const drawable = await this.resolver.resolveDrawable(rawSrc);
                
                if (drawable) {
                    if (drawable.type === 'svg') {
                        svgContent = drawable.value;
                    } 
                    else if (drawable.type === 'bitmap') {
                        src = drawable.value; 
                    }
                    else if (drawable.type === 'css') {
                        // Handle ShapeDrawable (Gradient/Solid) from second file logic
                        LogManager.v('ImageView', `[${viewId}] Rendering ShapeDrawable (CSS)`);
                        cssBackground = drawable.value;
                        isShape = true;
                    }
                } else {
                    LogManager.w('Resources', `[${viewId}] Failed to resolve drawable: ${rawSrc}`);
                }
            } 
            else if (rawSrc.startsWith('@color/') || rawSrc.startsWith('@android:color/') || rawSrc.startsWith('#')) {
                // Handle Color Resource as Shape
                const color = this.resolver.resolveColor(rawSrc);
                cssBackground = `background-color: ${color};`;
                isShape = true;
            }
            else {
                src = rawSrc;
            }
        } else {
            // Only warn if not a placeholder situation
            LogManager.w('ImageView', `[${viewId}] No source defined`);
        }
        
        // Default Placeholder if nothing resolved
        if (!src && !svgContent && !isShape) {
            svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#CCCCCC"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>`;
        }

        // 4. SVG Processing If applicable
        if (svgContent) {
            if (tintColor && tintMode === 'src_in') {
                svgContent = this.applySrcInTint(svgContent, tintColor);
            }
            if (scaleType === 'fitXY' && svgContent.includes('<svg') && !svgContent.includes('preserveAspectRatio')) {
                svgContent = svgContent.replace('<svg', '<svg preserveAspectRatio="none"');
            }
            src = `data:image/svg+xml;utf8,${encodeURIComponent(svgContent)}`;
        }

        // 5. Render
        const commonStyles = `
            ${alphaStyle}
            ${cropStyle}
            display: block;
            min-width: 0;
            min-height: 0;
            width: ${cssWidth};
            height: ${cssHeight};
        `;

        const idStr = attr.id ? `id="${attr.id.replace('@+id/', '')}"` : '';

        // Render Method A: Shape (Gradient/Solid Color) -> Use DIV
        if (isShape) {
            return `<div class="android-view image-view" ${idStr} style="${baseStyle} ${commonStyles} ${cssBackground}"></div>`;
        }

        // Render Method B: CSS Mask (For complex tints on Bitmaps/SVGs)
        if (tintColor && tintMode !== 'src_in') {
            const maskStyle = `
                background-color: ${tintColor};
                -webkit-mask-image: url('${src}');
                mask-image: url('${src}');
                -webkit-mask-size: ${maskSize};
                mask-size: ${maskSize};
                -webkit-mask-repeat: no-repeat;
                mask-repeat: no-repeat;
                -webkit-mask-position: ${maskPosition};
                mask-position: ${maskPosition};
                ${commonStyles}
            `;
            return `<div class="android-view image-view" ${idStr} style="${baseStyle} ${maskStyle}"></div>`;
        } 
        
        // Render Method C: Standard Image Tag
        const imgStyle = `
            object-fit: ${objectFit};
            object-position: ${objectPosition};
            ${commonStyles}
        `;
        return `<img src="${src}" class="android-view image-view" ${idStr} style="${baseStyle} ${imgStyle}" alt="ImageView" />`;
    }

    applySrcInTint(svgContent, tintColor) {
        try {
            let tinted = svgContent;
            tinted = tinted.replace(/android:fillColor="[^"]*"/g, `android:fillColor="${tintColor}"`);
            tinted = tinted.replace(/fill="[^"]*"/g, `fill="${tintColor}"`);
            if (!tinted.includes('fill=')) {
                tinted = tinted.replace(/<path/g, `<path fill="${tintColor}"`);
            }
            return tinted;
        } catch (e) {
            LogManager.e('ImageView', `Tint application failed: ${e.message}`);
            return svgContent;
        }
    }
}