import { TextView } from './TextView.js';
import { LogManager } from '../../core/LogManager.js'; // 🔥 LogManager

export class EditText extends TextView {
    
    async render(node, parentType) {
        const attr = node.attributes;
        const viewId = attr.id ? attr.id.replace('@+id/', '') : 'NO_ID';
        
        LogManager.v('EditText', `Inflating EditText [${viewId}]`);

        const hint = attr['android:hint'] || attr['hint'] || '';
        
        let html = await super.render(node, parentType);
        
        const gravity = attr['android:gravity'] || attr['gravity'] || 'left';
        
        let hintColor = '#999999'; 
        const hintColorAttr = attr['android:textColorHint'] || attr['textColorHint'];
        if (hintColorAttr) {
            hintColor = this.resolver.resolveColor(hintColorAttr);
            LogManager.v('EditText', `[${viewId}] Hint Color: ${hintColor}`);
        }

        const uniqueId = `edt_${Math.random().toString(36).substr(2, 9)}`;
        const tint = attr['android:backgroundTint'] || attr['app:backgroundTint'] || attr['backgroundTint'] || '#747474';
        const resolvedTint = this.resolver.resolveColor(tint);

        let textAlign = 'left';
        if (gravity.includes('center')) textAlign = 'center';
        else if (gravity.includes('right') || gravity.includes('end')) textAlign = 'right';

        const editTextStyle = `
            display: block !important;
            border: none;
            border-bottom: 1px solid ${resolvedTint};
            background-color: transparent;
            outline: none;
            padding: 8px 4px;
            border-radius: 4px 4px 0 0;
            transition: border-bottom-color 0.2s;
            cursor: text;
            width: 100%; 
            min-width: 0px;
            color: inherit;
            font-family: inherit;
            font-size: inherit;
            font-weight: inherit;
            text-align: ${textAlign};
        `;

        const focusEvent = `onfocus="this.style.borderBottomColor='${resolvedTint}'; this.style.backgroundColor='rgba(0,0,0,0.05)'" onblur="this.style.borderBottomColor='#999999'; this.style.backgroundColor='transparent'"`;
        const value = attr['android:text'] || attr['text'] || ''; 

        const placeholderStyleTag = `
            <style>
                #${uniqueId}::placeholder {
                    color: ${hintColor} !important;
                    opacity: 1;
                    text-align: ${textAlign};
                }
            </style>
        `;

        const inputType = attr['android:inputType'] || attr['inputType'] || 'text';
        LogManager.d('EditText', `[${viewId}] InputType: ${inputType}`);
        
        // Check for MultiLine
        const isMultiLine = inputType.includes('textMultiLine');
        let type = 'text';
        if (inputType.includes('Password')) type = 'password';
        else if (inputType.includes('number')) type = 'number';

        let replacementTag = '';
        
        if (isMultiLine) {
            // Textarea for MultiLine
            replacementTag = `${placeholderStyleTag}<textarea id="${uniqueId}" placeholder="${hint}" ${focusEvent}`;
        } else {
            // Input for SingleLine
            replacementTag = `${placeholderStyleTag}<input id="${uniqueId}" type="${type}" placeholder="${hint}" value="${value}" ${focusEvent}`;
        }

        // Replace DIV with Input/Textarea
        let finalHtml = html.replace('<div', replacementTag);

        if (isMultiLine) {
            // Close textarea properly and inject value inside
            finalHtml = finalHtml.replace('</div>', `</textarea>`);
            finalHtml = finalHtml.replace(/<span.*span>/s, value); 
        } else {
            // Input is void element, remove closing div and span content
            finalHtml = finalHtml.replace('</div>', '').replace(/<span.*span>/s, '');
        }

        // Final style injection
        finalHtml = finalHtml
            .replace('class="android-view text-view"', 'class="android-view edit-text"')
            .replace('style="', `style="${editTextStyle} ${isMultiLine ? 'resize: none; white-space: pre-wrap;' : ''} `);
        
        return finalHtml;
    }
}