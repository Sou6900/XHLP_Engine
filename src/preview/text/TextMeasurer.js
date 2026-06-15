// import { DensityConverter } from '../device/DensityConverter.js';

import { DensityConverter } from '../device/DensityConverter.js';

/**
 * TextMeasurer
 */
export class TextMeasurer {
    constructor() {
        this.converter = new DensityConverter();
        
        if (typeof document !== 'undefined') {
            this.canvas = document.createElement('canvas');
            this.ctx = this.canvas.getContext('2d');
        }

        this.fontMap = {
            'sans-serif': 'Roboto, "Noto Sans", sans-serif',
            'sans-serif-medium': 'Roboto Medium, "Noto Sans Medium", sans-serif',
            'sans-serif-light': 'Roboto Light, "Noto Sans Light", sans-serif',
            'serif': '"Noto Serif", serif',
            'monospace': '"Droid Sans Mono", monospace',
            'casual': '"Coming Soon", cursive',
            'cursive': '"Dancing Script", cursive',
        };

        this.config = {
            widthBias: 0.94, 
            
            lineHeightMultiplier: 1.35, 
            fontPaddingRatio: 0.0 
        };

        // Reset Bias Map to Safe Positive Values
        this.biasMap = [
            { spacing: 0.0, bias: 0.94 }, 
            { spacing: 0.1, bias: 1.08 }, 
            { spacing: 0.2, bias: 1.15 },
            { spacing: 0.3, bias: 1.25 },
            { spacing: 0.4, bias: 1.35 }
        ];
    }

    measure(text, attrs, maxWidth = Number.MAX_SAFE_INTEGER) {
        if (!this.ctx) return { width: 0, height: 0, baseline: 0, lineCount: 0 };

        let processedText = text || "";
        if (attrs.textAllCaps === 'true') {
            processedText = processedText.toUpperCase();
        }

        const textSize = this._parsePx(attrs.textSize || '14sp');
        const textStyle = attrs.textStyle || 'normal';
        const fontFamily = this._resolveFontFamily(attrs);
        const letterSpacing = parseFloat(attrs.letterSpacing || '0');
        
        const fontWeight = textStyle.includes('bold') ? 'bold' : 'normal';
        const fontStyle = textStyle.includes('italic') ? 'italic' : 'normal';
        
        // Font string construction
        this.ctx.font = `${fontStyle} ${fontWeight} ${textSize}px ${fontFamily}`;

        const padding = this._resolvePadding(attrs);
        const rawWidth = this.ctx.measureText(processedText).width;
        
        // Calculate Dynamic Bias
        const dynamicBias = this._calculateBias(letterSpacing);
        const adjustedWidth = Math.ceil(rawWidth * dynamicBias);

        const availableContentWidth = maxWidth - (padding.left + padding.right);
        let lineCount = 1;
        let finalContentWidth = adjustedWidth;

        if (availableContentWidth > 0 && adjustedWidth > availableContentWidth) {
            lineCount = this._countWrappedLines(processedText, availableContentWidth, dynamicBias);
            finalContentWidth = availableContentWidth; 
        }

        const includeFontPadding = attrs.includeFontPadding !== 'false';
        const fontPad = includeFontPadding ? (textSize * this.config.fontPaddingRatio) : 0;
        
        const contentHeight = (lineCount * textSize * this.config.lineHeightMultiplier);
        
        const totalHeight = contentHeight + padding.top + padding.bottom + (fontPad * 2);
        
        // Total Width = Text Width + Padding
        const totalWidth = finalContentWidth + padding.left + padding.right;

        const ascent = textSize * 0.8;
        const baseline = padding.top + fontPad + ascent;

        return {
            width: Math.ceil(totalWidth),
            height: Math.ceil(totalHeight),
            baseline: Math.ceil(baseline),
            lineCount: lineCount
        };
    }

    _calculateBias(spacing) {
        if (spacing <= this.biasMap[0].spacing) return this.biasMap[0].bias;
        const last = this.biasMap[this.biasMap.length - 1];
        if (spacing >= last.spacing) {
            const prev = this.biasMap[this.biasMap.length - 2];
            const slope = (last.bias - prev.bias) / (last.spacing - prev.spacing);
            return last.bias + ((spacing - last.spacing) * slope);
        }
        for (let i = 0; i < this.biasMap.length - 1; i++) {
            const curr = this.biasMap[i];
            const next = this.biasMap[i + 1];
            if (spacing >= curr.spacing && spacing <= next.spacing) {
                const ratio = (spacing - curr.spacing) / (next.spacing - curr.spacing);
                return curr.bias + (ratio * (next.bias - curr.bias));
            }
        }
        return this.config.widthBias;
    }

    _countWrappedLines(text, limit, bias) {
        if (!text) return 1;
        const words = text.split(/\s+/);
        let line = '';
        let count = 1;

        for (let i = 0; i < words.length; i++) {
            const w = words[i];
            const wordWidth = this.ctx.measureText(w).width * bias;
            if (wordWidth > limit) {
                const extraLines = Math.ceil(wordWidth / limit);
                count += extraLines;
                line = ''; 
                continue;
            }
            const testLine = line ? line + ' ' + w : w;
            const testWidth = this.ctx.measureText(testLine).width * bias;
            if (testWidth > limit && i > 0) {
                count++;
                line = w;
            } else {
                line = testLine;
            }
        }
        return count;
    }

    _resolveFontFamily(attrs) {
        const family = attrs.fontFamily || attrs.typeface || 'sans-serif';
        const cleanFamily = family.replace('@font/', '');
        return this.fontMap[cleanFamily] || this.fontMap['sans-serif'];
    }

    _resolvePadding(attrs) {
        const p = this._parsePx(attrs.padding);
        const pH = this._parsePx(attrs.paddingHorizontal);
        const pV = this._parsePx(attrs.paddingVertical);
        return {
            left: this._parsePx(attrs.paddingLeft || attrs.paddingStart) || pH || p,
            right: this._parsePx(attrs.paddingRight || attrs.paddingEnd) || pH || p,
            top: this._parsePx(attrs.paddingTop) || pV || p,
            bottom: this._parsePx(attrs.paddingBottom) || pV || p
        };
    }

    _parsePx(val) {
        if (!val) return 0;
        return parseFloat(this.converter.parse(val)) || 0;
    }

    registerFont(name, cssFamily) {
        this.fontMap[name] = cssFamily;
    }
}