// // ProgressBar.js
import { BaseView } from './BaseView.js';
import { LogManager } from '../../core/LogManager.js';

export class ProgressBar extends BaseView {
    
    async render(node, parentType) {
        const attr = node.attributes;
        const id = attr.id || 'no_id';
        const tag = 'ProgressBar';

        LogManager.d(tag, `Inflating ProgressBar (id: ${id})...`);

        const baseStyle = await this.getBaseStyles(attr, parentType);

        //  Android default = indeterminate is FALSE when progress is set.
        // Only TRUE if explicitly android:indeterminate="true"
        const rawIndeterminate = attr.indeterminate || attr['android:indeterminate'];
        const hasExplicitProgress = (attr.progress !== undefined || attr['android:progress'] !== undefined);

        let indeterminate;
        if (rawIndeterminate !== undefined && rawIndeterminate !== null) {
            // Explicitly set → trust the value
            indeterminate = (rawIndeterminate === 'true');
        } else if (hasExplicitProgress) {
            // progress is set but indeterminate is not mentioned → determinate
            indeterminate = false;
        } else {
            // Nothing set → default circular indeterminate (Android default)
            indeterminate = true;
        }
        
        const progress = parseInt(attr.progress || attr['android:progress'] || '0');
        const max = parseInt(attr.max || attr['android:max'] || '100');
        const progressPercent = Math.min(100, Math.max(0, (progress / max) * 100));

        LogManager.i(tag, `State: indeterminate=${indeterminate}, progress=${progress}/${max} (${progressPercent.toFixed(1)}%)`);

        const style = attr.style || '';
        
        // Smart horizontal vs circular detection
        const layoutWidth = attr.layout_width || attr['android:layout_width'];
        const layoutHeight = attr.layout_height || attr['android:layout_height'];
        
        let isHorizontal = false;
        
        // Check if it's a square (equal width/height) → ALWAYS circular
        if (layoutWidth && layoutHeight && 
            layoutWidth !== 'wrap_content' && layoutWidth !== 'match_parent' &&
            layoutHeight !== 'wrap_content' && layoutHeight !== 'match_parent') {
            
            const widthPx = parseFloat(this.converter.parse(layoutWidth));
            const heightPx = parseFloat(this.converter.parse(layoutHeight));
            
            // Square or nearly square (ratio < 1.5:1) → Circular
            if (widthPx > 0 && heightPx > 0 && widthPx / heightPx < 1.5) {
                isHorizontal = false; // Force circular for square sizes
            } else if (widthPx > heightPx * 2) {
                isHorizontal = true; // Very wide → horizontal bar
            } else if (style.includes('Horizontal')) {
                isHorizontal = true; // Style says horizontal and size allows it
            }
        } 
        
        // match_parent width with small fixed height → horizontal bar
        else if ((layoutWidth === 'match_parent' || layoutWidth === '0dp') &&
                 layoutHeight !== 'match_parent' && layoutHeight !== '0dp' && layoutHeight !== 'wrap_content') {
            isHorizontal = true;
        }
        // Explicit horizontal style with no size constraints → horizontal
        else if (style.includes('Horizontal')) {
            isHorizontal = true;
        }
        // Default: circular

        // Size variants
        let defaultSize = '48px';
        let strokeWidth = 4;
        
        if (style.includes('Small')) {
            defaultSize = '16px';
            strokeWidth = 2;
        } else if (style.includes('Large')) {
            defaultSize = '76px';
            strokeWidth = 6;
        } else {
            defaultSize = '48px';
            strokeWidth = 4;
        }

        // Colors
        const indeterminateTint = attr.indeterminateTint || 
                                attr['android:indeterminateTint'] || 
                                attr['app:indeterminateTint'];
        
        const progressTint = attr.progressTint || 
                            attr['android:progressTint'] || 
                            attr['app:progressTint'];
        
        const progressBackgroundTint = attr.progressBackgroundTint || 
                                      attr['android:progressBackgroundTint'] || 
                                      attr['app:progressBackgroundTint'];

        const spinnerColor = indeterminateTint ? 
            this.resolver.resolveColor(indeterminateTint) : '#6200EE';
        
        const barColor = progressTint ? 
            this.resolver.resolveColor(progressTint) : '#6200EE';
        
        const trackColor = progressBackgroundTint ? 
            this.resolver.resolveColor(progressBackgroundTint) : 'rgba(98, 0, 238, 0.2)';

        LogManager.v(tag, `Style Resolved: ${isHorizontal ? 'HORIZONTAL' : 'CIRCULAR'}`);
        LogManager.v(tag, `Colors: Primary=${isHorizontal ? barColor : spinnerColor}, Track=${trackColor}`);

        if (isHorizontal) {
            return this.renderHorizontal(
                baseStyle, 
                indeterminate, 
                progressPercent, 
                barColor, 
                trackColor,
                attr
            );
        } else {
            return this.renderCircular(
                baseStyle, 
                indeterminate, 
                progressPercent,
                spinnerColor,
                trackColor,
                defaultSize,
                strokeWidth,
                attr
            );
        }
    }

    renderHorizontal(baseStyle, indeterminate, progressPercent, barColor, trackColor, attr) {
        const height = attr.layout_height || attr['android:layout_height'] || '4dp';
        const heightPx = this.converter.parse(height);

        LogManager.d('ProgressBar', `Rendering Horizontal Bar: height=${heightPx}, mode=${indeterminate ? 'Indeterminate (Anim)' : 'Determinate'}`);

        if (indeterminate) {
            const animStyle = `
                width: 100%;
                height: ${heightPx};
                background: ${trackColor};
                border-radius: 2px;
                overflow: hidden;
                position: relative;
            `;

            const barStyle = `
                position: absolute;
                height: 100%;
                width: 30%;
                background: ${barColor};
                border-radius: 2px;
                animation: progressSlide 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
            `;

            return `
                <style>
                    @keyframes progressSlide {
                        0% { left: -30%; }
                        100% { left: 100%; }
                    }
                </style>
                <div class="android-view progress-bar horizontal indeterminate" style="${baseStyle} ${animStyle}">
                    <div style="${barStyle}"></div>
                </div>
            `;
        } else {
            const containerStyle = `
                width: 100%;
                height: ${heightPx};
                background: ${trackColor};
                border-radius: 2px;
                overflow: hidden;
                position: relative;
            `;

            const fillStyle = `
                position: absolute;
                left: 0;
                top: 0;
                height: 100%;
                width: ${progressPercent}%;
                background: ${barColor};
                border-radius: 2px;
                transition: width 0.3s ease;
            `;

            return `
                <div class="android-view progress-bar horizontal determinate" style="${baseStyle} ${containerStyle}">
                    <div style="${fillStyle}"></div>
                </div>
            `;
        }
    }

    /**
    * Android Circular Animation!
    * - Spins 360°
    * - Arc length changes (NOT size!)
    * - No zoom effect
    */
    renderCircular(baseStyle, indeterminate, progressPercent, color, trackColor, defaultSize, strokeWidth, attr) {
        const layoutWidth = attr.layout_width || attr['android:layout_width'];
        
        let size = defaultSize;
        
        if (layoutWidth && layoutWidth !== 'wrap_content' && layoutWidth !== 'match_parent') {
            size = this.converter.parse(layoutWidth);
            const sizePx = parseInt(size);
            strokeWidth = Math.max(2, Math.round(sizePx / 12));
        }

        LogManager.d('ProgressBar', `Rendering Circular Spinner: size=${size}, strokeWidth=${strokeWidth}px, mode=${indeterminate ? 'Indeterminate' : 'Determinate'}`);

        // Clean baseStyle: remove conflicting width/height/transform
        let cleanBaseStyle = baseStyle
            .replace(/width:\s*[^;]+;/g, '')
            .replace(/height:\s*[^;]+;/g, '')
            .replace(/transform:\s*[^;]+;/g, '')
            .replace(/min-width:\s*[^;]+;/g, '')
            .replace(/min-height:\s*[^;]+;/g, '');

        if (indeterminate) {
            // Use SVG for proper arc animation like Android
            const sizePx = parseInt(size);
            const radius = (sizePx - strokeWidth * 2) / 2;
            const center = sizePx / 2;
            const circumference = 2 * Math.PI * radius;

            const containerStyle = `
                width: ${size};
                height: ${size};
                min-width: ${size};
                min-height: ${size};
                display: inline-block;
                animation: spinContainer 1.8s linear infinite;
            `;

            const svgStyle = `
                width: 100%;
                height: 100%;
                display: block;
            `;

            return `
                <style>
                    @keyframes spinContainer {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                    
                    @keyframes dashAnimation {
                        0% {
                            stroke-dasharray: ${circumference * 0.01} ${circumference};
                            stroke-dashoffset: 0;
                        }
                        50% {
                            stroke-dasharray: ${circumference * 0.75} ${circumference};
                            stroke-dashoffset: ${-circumference * 0.15};
                        }
                        100% {
                            stroke-dasharray: ${circumference * 0.01} ${circumference};
                            stroke-dashoffset: ${-circumference};
                        }
                    }
                </style>
                <div class="android-view progress-bar circular indeterminate" style="${cleanBaseStyle} ${containerStyle}">
                    <svg style="${svgStyle}" viewBox="0 0 ${sizePx} ${sizePx}">
                        <circle
                            cx="${center}"
                            cy="${center}"
                            r="${radius}"
                            fill="none"
                            stroke="${color}"
                            stroke-width="${strokeWidth}"
                            stroke-linecap="round"
                            stroke-dasharray="${circumference * 0.75} ${circumference}"
                            style="animation: dashAnimation 1.9s ease-in-out infinite;"
                        />
                    </svg>
                </div>
            `;
        } else {
            const sizePx = parseInt(size);
            const radius = (sizePx - strokeWidth * 2) / 2;
            const center = sizePx / 2;
            const circumference = 2 * Math.PI * radius;
            const offset = circumference - (progressPercent / 100) * circumference;

            const svgStyle = `
                width: ${size};
                height: ${size};
                transform: rotate(-90deg);
            `;

            const containerStyle = `
                display: inline-block;
                width: ${size};
                height: ${size};
            `;

            return `
                <div class="android-view progress-bar circular determinate" style="${cleanBaseStyle} ${containerStyle}">
                    <svg style="${svgStyle}" viewBox="0 0 ${sizePx} ${sizePx}">
                        <circle
                            cx="${center}"
                            cy="${center}"
                            r="${radius}"
                            fill="none"
                            stroke="${trackColor}"
                            stroke-width="${strokeWidth}"
                        />
                        <circle
                            cx="${center}"
                            cy="${center}"
                            r="${radius}"
                            fill="none"
                            stroke="${color}"
                            stroke-width="${strokeWidth}"
                            stroke-dasharray="${circumference}"
                            stroke-dashoffset="${offset}"
                            stroke-linecap="round"
                            style="transition: stroke-dashoffset 0.3s ease;"
                        />
                    </svg>
                </div>
            `;
        }
    }
}