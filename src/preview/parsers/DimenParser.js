// dimens.xml
import { LogManager } from '../core/LogManager.js';

export class DimenParser {

    /**
     * Parse dimens.xml content
     * @param {Document} xmlDoc 
     * @returns {Map<string, string>} Map of dimen names to values (e.g., "16dp")
     */
    parse(xmlDoc) {
        const TAG = 'DimenParser';
        const dimens = new Map();
        
        if (!xmlDoc) {
            LogManager.w(TAG, 'XML Document is null. Returning empty map.');
            return dimens;
        }

        LogManager.d(TAG, 'Parsing dimens.xml content...');

        const dimenElements = xmlDoc.getElementsByTagName('dimen');
        LogManager.v(TAG, `Found ${dimenElements.length} dimen elements.`);
        
        for (let i = 0; i < dimenElements.length; i++) {
            const el = dimenElements[i];
            const name = el.getAttribute('name');
            const value = el.textContent.trim();
            
            if (name && value) {
                dimens.set(name, value);
                LogManager.v(TAG, `Mapped dimen: @dimen/${name} -> ${value}`);
            } else {
                LogManager.w(TAG, `Skipped invalid dimen entry at index ${i}`);
            }
        }
        
        LogManager.i(TAG, `Finished parsing. Total dimens: ${dimens.size}`);
        return dimens;
    }
}