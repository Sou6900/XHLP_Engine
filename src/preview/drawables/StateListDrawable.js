import { LogManager } from '../core/LogManager.js';
import { ShapeDrawable } from './ShapeDrawable.js';

export class StateListDrawable {
    constructor(resourceResolver) {
        this.resolver = resourceResolver;
        this.shapeDrawable = new ShapeDrawable();
    }

    _getAttr(attr, name) {
        return attr['android:' + name] || attr[name];
    }

    async process(node) {
        if (!node || node.type !== 'selector') return null;

        LogManager.v('StateListDrawable', `Processing selector with ${node.children?.length || 0} items`);

        const items = [];
        
        for (const child of node.children) {
            if (child.type === 'item') {
                const attr = child.attributes || {};
                
                // 1. Identify State
                let state = 'default';
                const pressed = this._getAttr(attr, 'state_pressed');
                if (pressed === 'true') state = 'pressed';
                
                // 2. Try Direct Attribute
                const ref = this._getAttr(attr, 'drawable') || this._getAttr(attr, 'color');
                let value = null;
                let type = 'color';

                if (ref) {
                    LogManager.v('StateListDrawable', `Item [${state}]: Resolving reference ${ref}`);
                    
                    if (ref.startsWith('#') || ref.startsWith('@color/')) {
                        value = this.resolver.resolveColor(ref);
                        type = 'color';
                    } else if (ref.startsWith('@drawable/')) {
                        const drawable = await this.resolver.resolveDrawable(ref);
                        if (drawable) {
                            value = drawable.value;
                            type = drawable.type; 
                        } else {
                            LogManager.w('StateListDrawable', `Failed to resolve drawable: ${ref}`);
                        }
                    }
                } 
                // 3. Try Nested Shape
                else if (child.children && child.children.length > 0) {
                    const shapeNode = child.children.find(c => c.type === 'shape');
                    if (shapeNode) {
                        LogManager.v('StateListDrawable', `Item [${state}]: Compiling nested <shape>`);
                        
                        let css = this.shapeDrawable.createStyle(shapeNode);

                        // Resolve colors inside CSS
                        if (css.includes('@color/')) {
                            const colorRegex = /@color\/[a-zA-Z0-9_]+/g;
                            const matches = css.match(colorRegex);
                            if (matches) {
                                matches.forEach(match => {
                                    const resolvedColor = this.resolver.resolveColor(match);
                                    css = css.replace(match, resolvedColor);
                                });
                            }
                        }
                        
                        value = css;
                        type = 'css';
                    } else {
                        LogManager.w('StateListDrawable', `Item [${state}]: Has children but no <shape> found.`);
                    }
                } else {
                     LogManager.w('StateListDrawable', `Item [${state}]: Empty item (No drawable, color, or shape).`);
                }

                if (value) {
                    items.push({ state, type, value });
                }
            }
        }

        LogManager.d('StateListDrawable', `Selector compiled successfully with ${items.length} states.`);
        return { type: 'selector', items };
    }
}