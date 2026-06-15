import { ScrollView } from './ScrollView.js';

export class NestedScrollView extends ScrollView {
    constructor(resolver) {
        super(resolver);
    }
    
    // NestedScrollView behaves identically to ScrollView in visual preview
    // Additional nesting behaviors are handled by CoordinatorLayout logic
}