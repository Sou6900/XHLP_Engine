// strings.xml
import { LogManager } from '../core/LogManager.js';

export class StringParser {
    
    /**
     * Parse strings.xml content
     * @param {Document} xmlDoc - The DOM object of strings.xml
     * @returns {Map<string, string>} Map of string names to values
     */
    parse(xmlDoc) {
        const TAG = 'StringParser';
        const strings = new Map();
        
        if (!xmlDoc) {
            LogManager.w(TAG, 'XML Document is null. Returning empty map.');
            return strings;
        }

        LogManager.d(TAG, 'Parsing strings.xml content...');

        const stringElements = xmlDoc.getElementsByTagName('string');
        LogManager.v(TAG, `Found ${stringElements.length} string elements.`);
        
        for (let i = 0; i < stringElements.length; i++) {
            const el = stringElements[i];
            const name = el.getAttribute('name');
            const value = el.textContent;
            
            if (name) {
                strings.set(name, value);
                // Verbose log: Only LOG if list is small to avoid spam, or log first few
                if (i < 5) LogManager.v(TAG, `Sample string mapped: @string/${name} -> "${value.substring(0, 20)}..."`);
            } else {
                LogManager.w(TAG, `Skipped string element at index ${i} (missing name attribute)`);
            }
        }
        
        LogManager.i(TAG, `Finished parsing. Total strings: ${strings.size}`);
        return strings;
    }
}