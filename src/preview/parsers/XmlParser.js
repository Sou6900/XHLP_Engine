import { LogManager } from '../core/LogManager.js';

export class XmlParser {
    parse(xmlString) {
        const TAG = 'XmlParser';

        if (!xmlString || xmlString.trim() === '') {
            LogManager.w(TAG, 'Empty or null XML string provided.');
            return null;
        }

        try {
            // LogManager.v(TAG, `Parsing XML string (Length: ${xmlString.length})`);

            // 1. Remove XML declaration & comments
            let cleanXml = xmlString
                .replace(/<\?xml.*?\?>/g, '')
                .replace(/<!--[\s\S]*?-->/g, '');

            // 2. NAMESPACE STRIPPING
            // Removes "android:", "app:", "tools:" anywhere they appear as a prefix
            // This fixes issues where whitespace/tabs prevented the previous regex from matching
            cleanXml = cleanXml.replace(/(android|app|tools):/g, '');

            // 3. Remove xmlns definitions (now that prefixes are gone, these might look like 'xmlns="..."')
            cleanXml = cleanXml.replace(/\sxmlns\w*="[^"]*"/g, '');

            // 4. Parse
            const parser = new DOMParser();
            const doc = parser.parseFromString(cleanXml, 'text/xml');

            const errorNode = doc.querySelector('parsererror');
            if (errorNode) {
                console.error('XML Raw Error:', errorNode.textContent);
                LogManager.e(TAG, `DOMParser Error: ${errorNode.textContent}`);
                throw new Error('Invalid XML Structure');
            }

            const rootNode = this._elementToNode(doc.documentElement);
            // LogManager.v(TAG, `Successfully parsed root: <${rootNode.type}>`);
            return rootNode;

        } catch (e) {
            console.error('❌ [XmlParser]', e.message);
            LogManager.e(TAG, `Exception: ${e.message}`);
            
            return {
                type: 'TextView',
                attributes: {
                    text: `XML Error: ${e.message}`,
                    textColor: '#FF0000',
                    gravity: 'center'
                },
                children: []
            };
        }
    }

    _elementToNode(element) {
        if (!element) return null;

        const node = {
            type: element.tagName,
            attributes: {},
            children: []
        };

        if (element.attributes) {
            for (let i = 0; i < element.attributes.length; i++) {
                const attr = element.attributes[i];
                node.attributes[attr.name] = attr.value;
            }
        }

        if (element.children) {
            for (let i = 0; i < element.children.length; i++) {
                const childNode = this._elementToNode(element.children[i]);
                if (childNode) node.children.push(childNode);
            }
        }

        return node;
    }
}