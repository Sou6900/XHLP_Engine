import { LogManager } from '../core/LogManager.js';
import { ShapeDrawable } from './ShapeDrawable.js';
import { VectorDrawable } from './VectorDrawable.js';
import { StateListDrawable } from './StateListDrawable.js';

export class DrawableLoader {
    constructor(resourceResolver) {
        this.shapeDrawable = new ShapeDrawable();
        this.vectorDrawable = new VectorDrawable();
    }

    process(ast, resolver) { 
        if (!ast) {
            LogManager.w('DrawableLoader', 'Received null AST for processing.');
            return null;
        }

        if (ast.type === 'vector') {
            LogManager.v('DrawableLoader', 'Processing Vector Drawable...');
            const svg = this.vectorDrawable.createSVG(ast);
            return { type: 'svg', value: svg };
        } 
        else if (ast.type === 'shape') {
            LogManager.v('DrawableLoader', 'Processing Shape Drawable...');
            const css = this.shapeDrawable.createStyle(ast);
            return { type: 'css', value: css };
        }
        else if (ast.type === 'selector') {
            LogManager.d('DrawableLoader', 'Found StateList (Selector). Deferring logic to resolver.');
            return { type: 'selector_ast', ast, resolver }; 
        }
        
        LogManager.w('DrawableLoader', `Unknown drawable type: ${ast.type}`);
        return null;
    }
}