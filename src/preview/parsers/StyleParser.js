// styles.xml & themes.xml (Complex)
const fs = acode.require('fs');
import { LogManager } from '../core/LogManager.js';

export class StyleParser {
    constructor() {
        // Map<StyleName, { parent: String, items: Object }>
        this.styles = new Map();
        this.TAG = 'StyleParser';
    }

    async parse(resPath) {
        const files = ['styles.xml', 'themes.xml'];
        LogManager.d(this.TAG, `Starting style parsing from: ${resPath}`);

        for (const file of files) {
            const path = `${resPath}/values/${file}`;
            try {
                if (await fs(path).exists().catch(() => false)) {
                    LogManager.v(this.TAG, `Reading file: ${file}`);
                    const content = await fs(path).readFile('utf-8');
                    this._parseContent(content);
                } else {
                    LogManager.v(this.TAG, `File not found: ${file} (Skipping)`);
                }
            } catch (e) {
                LogManager.e(this.TAG, `Error reading ${file}: ${e.message}`);
            }
        }
        
        // console.log(`[StyleParser] Loaded ${this.styles.size} styles`);
        LogManager.i(this.TAG, `Parsing complete. Total styles loaded: ${this.styles.size}`);
    }

    _parseContent(xmlString) {
        const cleanXml = xmlString
            .replace(/<\?xml.*?\?>/g, '')
            .replace(/<!--[\s\S]*?-->/g, '');

        const parser = new DOMParser();
        const doc = parser.parseFromString(cleanXml, 'text/xml');
        
        const errorNode = doc.querySelector('parsererror');
        if (errorNode) {
            LogManager.e(this.TAG, `XML Parse Error: ${errorNode.textContent}`);
            return;
        }

        const styleTags = doc.getElementsByTagName('style');
        LogManager.v(this.TAG, `Processing ${styleTags.length} style tags from current file.`);

        for (let i = 0; i < styleTags.length; i++) {
            const styleEl = styleTags[i];
            const name = styleEl.getAttribute('name');
            let parent = styleEl.getAttribute('parent');

            // Implicit parent: AppTheme.Child → AppTheme
            if (!parent && name && name.includes('.')) {
                parent = name.substring(0, name.lastIndexOf('.'));
            }

            const items = {};
            const itemTags = styleEl.getElementsByTagName('item');

            for (let j = 0; j < itemTags.length; j++) {
                const itemEl = itemTags[j];
                const attrName = itemEl
                    .getAttribute('name')
                    .replace('android:', '');
                items[attrName] = itemEl.textContent;
            }

            this.styles.set(name, { parent, items });
        }
    }

    getStyle(name) {
        if (!name) return null;
        const cleanName = name.replace('@style/', '');
        const style = this.styles.get(cleanName);
        
        if (!style) {
            LogManager.w(this.TAG, `Style not found: ${cleanName}`);
        }
        return style;
    }

    /**
     * Returns list of all available style names
     * Used by ResourceResolver for theme detection
     */
    getStyleNames() {
        return Array.from(this.styles.keys());
    }
}