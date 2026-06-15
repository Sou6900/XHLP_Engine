// parsers/MenuInflater.js
import { LogManager } from '../core/LogManager.js';

export class MenuInflater {
    constructor(resolver) {
        this.resolver = resolver;
    }

    parse(ast) {
        const TAG = 'MenuInflater';
        const items = [];
        
        if (!ast || ast.type !== 'menu') {
            console.warn('[MenuInflater] Root tag is not <menu>');
            LogManager.e(TAG, `Invalid Menu XML. Root tag expected 'menu', found '${ast ? ast.type : 'null'}'`);
            return items;
        }

        LogManager.d(TAG, 'Parsing Menu XML AST...');

        const traverse = (node) => {
            if (node.type === 'item') {
                if (!node.attributes) node.attributes = {};
                
                const title = node.attributes['android:title'] || node.attributes['title'] || 'Untitled';
                LogManager.v(TAG, `Found menu item: ${title} (id: ${node.attributes['android:id'] || 'no-id'})`);

                items.push(node);
            } else if (node.type === 'group') {
                LogManager.v(TAG, 'Entering <group> tag...');
            } else if (node.type === 'menu' && node !== ast) {
                LogManager.v(TAG, 'Entering Nested <menu> (Submenu)...');
            }
            
            if (node.children) {
                node.children.forEach(traverse);
            }
        };

        if (ast.children) {
            ast.children.forEach(traverse);
        }

        console.log(`[MenuInflater] Parsed ${items.length} menu items.`);
        LogManager.i(TAG, `Menu parsing complete. Total items ready to render: ${items.length}`);
        
        return items;
    }
}