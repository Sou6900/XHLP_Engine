// colors.xml
import { LogManager } from '../core/LogManager.js';

export class ColorParser {

    /**
     * Parse colors.xml content
     * @param {Document} xmlDoc 
     * @returns {Map<string, string>} Map of color names to hex codes
     */
    parse(xmlDoc) {
        const TAG = 'ColorParser';
        const colors = new Map();
        
        if (!xmlDoc) {
            LogManager.w(TAG, 'XML Document is null. Returning empty map.');
            return colors;
        }

        LogManager.d(TAG, 'Parsing colors.xml content...');

        const colorElements = xmlDoc.getElementsByTagName('color');
        LogManager.v(TAG, `Found ${colorElements.length} color elements.`);
        
        for (let i = 0; i < colorElements.length; i++) {
            const el = colorElements[i];
            const name = el.getAttribute('name');
            const value = el.textContent.trim();
            
            if (name && value) {
                colors.set(name, value);
                LogManager.v(TAG, `Mapped color: @color/${name} -> ${value}`);
            } else {
                LogManager.w(TAG, `Skipped invalid color entry at index ${i}`);
            }
        }
        
        LogManager.i(TAG, `Finished parsing. Total colors: ${colors.size}`);
        return colors;
    }
}