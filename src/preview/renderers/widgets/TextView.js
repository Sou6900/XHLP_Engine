// TextView.js
import { BaseView } from './BaseView.js';
import { LogManager } from '../../core/LogManager.js';

export class TextView extends BaseView {
    
    async render(node, parentType, parentWidth, parentHeight) {
        const attr = node.attributes;
        const baseStyle = await this.getBaseStyles(attr, parentType);
        
        const get = (name) => attr[name] || attr[`android:${name}`] || attr[`app:${name}`];
        const viewId = attr.id ? attr.id.replace('@+id/', '') : 'NO_ID';

        LogManager.v('TextView', `Inflating TextView [${viewId}] parent=${parentType}`);

        // Store parent dimensions for width constraint
        const availableWidth = parentWidth || 360;
        const availableHeight = parentHeight || 640;

        // Text Content resolution
        let text = this.resolver.resolveString(get('text') || "");
        
        if (text) {
            text = text.replace(/\\n/g, '\n').trim();
            // Log text content (truncated for cleaner logs)
            const logText = text.length > 20 ? text.substring(0, 20) + '...' : text;
            LogManager.v('TextView', `setText: "${logText}"`);
        } else {
            LogManager.w('TextView', `View [${viewId}] has empty or null text`);
        }
        
        // Text All Caps
        const textAllCaps = get('textAllCaps') === 'true';
        if (textAllCaps) {
            text = text.toUpperCase();
            LogManager.v('TextView', `textAllCaps=true, converting text.`);
        }

        let css = `
            flex-direction: column;
            overflow: visible;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            text-rendering: optimizeLegibility;
        `;

        // Add max-width constraint for wrap_content in LinearLayout
        const layoutWidth = get('layout_width');
        if (parentType === 'LinearLayout' && layoutWidth === 'wrap_content') {
            css += `max-width: 100%; `;
        }

        // Font Family & Typeface
        const fontFamily = get('fontFamily');
        const typeface = get('typeface');
        
        if (fontFamily) {
            css += `font-family: ${fontFamily}; `;
            LogManager.d('Typeface', `Applying font-family: ${fontFamily}`);
        } else if (typeface) {
            const typefaceMap = {
                'monospace': 'monospace',
                'serif': 'serif',
                'sans': 'sans-serif',
                'sans-serif': 'sans-serif'
            };
            const mappedFont = typefaceMap[typeface] || 'Roboto, sans-serif';
            css += `font-family: ${mappedFont}; `;
            LogManager.v('Typeface', `Applying typeface: ${typeface} -> ${mappedFont}`);
        } else {
            css += `font-family: Roboto, sans-serif; `;
        }

        // Use Converter for Default Size
        const textSize = get('textSize');
        if (textSize) {
            const sizeVal = this.converter.parse(textSize);
            css += `font-size: ${sizeVal}; `;
        } else {
            css += `font-size: ${this.converter.parse('14sp')}; `; 
        }

        // Text Color logic
        const textColor = get('textColor');
        if (textColor) {
            const resolvedColor = this.resolver.resolveColor(textColor);
            css += `color: ${resolvedColor}; `;
            // LogManager.v('TextView', `setTextColor: ${resolvedColor}`);
        } else {
            if (this.constructor.name === 'Button') {
                css += `color: var(--btn-text-default, #212121); `;
            } else {
                css += `color: var(--auto-text, #212121); `;
            }
        }

        // Text Style (Bold/Italic)
        const textStyleAttr = get('textStyle') || '';
        if (textStyleAttr.includes('bold')) css += `font-weight: bold; `;
        if (textStyleAttr.includes('italic')) css += `font-style: italic; `;

        // letter Spacing
        const letterSpacing = get('letterSpacing');
        if (letterSpacing) {
            const spacing = parseFloat(letterSpacing);
            css += `letter-spacing: ${spacing}em; `;
        }

        // Text Scale X
        const textScaleX = get('textScaleX');
        if (textScaleX && parseFloat(textScaleX) !== 1.0) {
            css += `transform: scaleX(${textScaleX}); transform-origin: left center; `;
        }

        // Text Shadow
        const shadowColor = get('shadowColor');
        const shadowDx = get('shadowDx');
        const shadowDy = get('shadowDy');
        const shadowRadius = get('shadowRadius');
        
        if (shadowColor && (shadowDx || shadowDy || shadowRadius)) {
            const dx = this.converter.parse(shadowDx || '0dp');
            const dy = this.converter.parse(shadowDy || '0dp');
            const radius = this.converter.parse(shadowRadius || '0dp');
            const color = this.resolver.resolveColor(shadowColor);
            css += `text-shadow: ${dx} ${dy} ${radius} ${color}; `;
        }

        // Text Alignment
        const gravity = get('gravity') || '';
        const textAlignment = get('textAlignment');
        
        let align = 'left';
        if (textAlignment) {
            if (textAlignment.includes('center')) align = 'center';
            else if (textAlignment.includes('textEnd') || textAlignment.includes('viewEnd')) align = 'right';
        } else if (gravity) {
            if (gravity.includes('center_horizontal') || gravity.includes('center')) align = 'center';
            else if (gravity.includes('end') || gravity.includes('right')) align = 'right';
        }
        css += `text-align: ${align}; `;

        // Vertical Gravity
        if (gravity.includes('center_vertical') || gravity.includes('center')) {
            css += `justify-content: center; `;
        } else if (gravity.includes('bottom')) {
            css += `justify-content: flex-end; `;
        }

        // Line Spacing
        const lineSpacingExtra = this.converter.parse(get('lineSpacingExtra') || '0dp');
        const lineSpacingMultiplier = parseFloat(get('lineSpacingMultiplier') || '1.0');
        const includeFontPadding = get('includeFontPadding') !== 'false';

        const baseLH = includeFontPadding ? '1.35' : '1.2';
        const lhValue = (lineSpacingMultiplier !== 1.0 || lineSpacingExtra !== '0px') 
            ? `calc(1.2em * ${lineSpacingMultiplier} + ${lineSpacingExtra})`
            : baseLH;
        
        css += `line-height: ${lhValue}; `;

        // Wrapping & Ellipsizing Logic
        const isButton = this.constructor.name === 'Button';
        const singleLine = get('singleLine') === 'true';
        const maxLines = parseInt(get('maxLines') || '0');
        const lines = parseInt(get('lines') || '0');
        const minLines = parseInt(get('minLines') || '0');
        
        const isShortText = text.length < 30; 
        const shouldNotWrap = isButton || singleLine || lines === 1 || maxLines === 1 || (layoutWidth === 'wrap_content' && isShortText);

        if (shouldNotWrap) {
            css += `white-space: nowrap !important; overflow: hidden; text-overflow: ellipsis; `;
        } else {
            css += `white-space: pre-wrap; word-wrap: break-word; `;
            if (maxLines > 1 || lines > 1) {
                const limit = lines > 0 ? lines : maxLines;
                css += `display: -webkit-box; -webkit-line-clamp: ${limit}; -webkit-box-orient: vertical; overflow: hidden; `;
            }
        }

        if (lines > 1) css += `min-height: calc(${lines} * ${lhValue} * 1em); `;
        if (minLines > 1) css += `min-height: calc(${minLines} * ${lhValue} * 1em); `;

        // Break Strategy & Hyphenation
        const breakStrategy = get('breakStrategy');
        if (breakStrategy === 'balanced') css += `text-wrap: balance; `;
        else if (breakStrategy === 'high_quality') css += `text-wrap: pretty; `;

        const hyphenationFrequency = get('hyphenationFrequency');
        if (hyphenationFrequency === 'full') css += `hyphens: auto; `;
        else if (hyphenationFrequency === 'none') css += `hyphens: none; `;

        const justificationMode = get('justificationMode');
        if (justificationMode === 'inter_word') css += `text-align: justify; text-justify: inter-word; `;

        // Selection & Colors
        const textIsSelectable = get('textIsSelectable') === 'true';
        css += textIsSelectable ? `user-select: text; cursor: text; ` : `user-select: none; `;

        const textColorLink = get('textColorLink');
        if (textColorLink) css += `--link-color: ${this.resolver.resolveColor(textColorLink)}; `;

        const textColorHighlight = get('textColorHighlight');
        if (textColorHighlight) {
            const highlightColor = this.resolver.resolveColor(textColorHighlight);
            css += `::selection { background-color: ${highlightColor}; } `;
        }

        // Auto Link
        const autoLink = get('autoLink');
        if (autoLink && autoLink !== 'none') {
            LogManager.i('Linkify', `Auto-linking enabled for [${viewId}]: ${autoLink}`);
            text = this._applyAutoLink(text, autoLink);
        }

        // Drawable Support
        const drawableLeft = get('drawableLeft') || get('drawableStart');
        const drawableTop = get('drawableTop');
        const drawableRight = get('drawableRight') || get('drawableEnd');
        const drawableBottom = get('drawableBottom');
        const drawablePadding = this.converter.parse(get('drawablePadding') || '4dp');
        const drawableTint = get('drawableTint');

        let drawableHtml = '';
        const hasDrawables = drawableLeft || drawableTop || drawableRight || drawableBottom;

        if (hasDrawables) {
            LogManager.v('TextView', `Compound drawables detected for [${viewId}]`);
            css += `display: flex; flex-direction: row; align-items: center; gap: ${drawablePadding}; `;
            if (drawableTop || drawableBottom) css += `flex-direction: column; `;

            if (drawableTop) drawableHtml += await this._renderDrawable(drawableTop, drawableTint, '16px', '16px');
            if (drawableLeft) drawableHtml += await this._renderDrawable(drawableLeft, drawableTint, '16px', '16px');
            
            drawableHtml += `<span>${text}</span>`;
            
            if (drawableRight) drawableHtml += await this._renderDrawable(drawableRight, drawableTint, '16px', '16px');
            if (drawableBottom) drawableHtml += await this._renderDrawable(drawableBottom, drawableTint, '16px', '16px');
        }

        const finalStyle = `${baseStyle} ${css}`;
        const className = this.constructor.name === 'EditText' ? 'edit-text' : 
                          this.constructor.name === 'Button' ? 'android-button' : 'text-view';
        const idStr = attr.id ? `id="${attr.id.replace('@+id/', '')}"` : '';

        // Select All on Focus
        const selectAllOnFocus = get('selectAllOnFocus') === 'true';
        const focusEvent = selectAllOnFocus ? 'onfocus="this.select()"' : '';

        return `<div class="android-view ${className}" ${idStr} style="${finalStyle}" ${focusEvent}>${hasDrawables ? drawableHtml : `<span>${text}</span>`}</div>`;
    }

    _applyAutoLink(text, autoLink) {
        if (!text) return text;
        const linkStyle = 'color: var(--link-color, #2196F3); text-decoration: underline; cursor: pointer;';
        if (autoLink.includes('web') || autoLink.includes('all')) {
            text = text.replace(/(https?:\/\/[^\s]+)/g, `<a href="$1" style="${linkStyle}" target="_blank">$1</a>`);
        }
        if (autoLink.includes('email') || autoLink.includes('all')) {
            text = text.replace(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/g, `<a href="mailto:$1" style="${linkStyle}">$1</a>`);
        }
        if (autoLink.includes('phone') || autoLink.includes('all')) {
            text = text.replace(/(\+?\d[\d\s\-\(\)]{7,})/g, `<a href="tel:$1" style="${linkStyle}">$1</a>`);
        }
        return text;
    }

    async _renderDrawable(drawableRef, tint, width, height) {
        LogManager.d('Resources', `Loading compound drawable: ${drawableRef}`);
        
        const drawable = await this.resolver.resolveDrawable(drawableRef);
        if (!drawable) {
            LogManager.w('Resources', `Failed to load drawable: ${drawableRef}`);
            return '';
        }
        
        let style = `width: ${width}; height: ${height}; flex-shrink: 0; `;
        if (drawable.type === 'svg') {
            let svg = drawable.value;
            if (tint) {
                const tintColor = this.resolver.resolveColor(tint);
                svg = svg.replace(/fill="[^"]*"/g, `fill="${tintColor}"`);
            }
            const encoded = encodeURIComponent(svg);
            return `<img src="data:image/svg+xml;utf8,${encoded}" style="${style}" />`;
        } else if (drawable.type === 'bitmap') {
            return `<img src="${drawable.value}" style="${style}" />`;
        }
        return '';
    }
}