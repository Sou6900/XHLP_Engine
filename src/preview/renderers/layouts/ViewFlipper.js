import { FrameLayout } from './FrameLayout.js';
import { LogManager } from '../../core/LogManager.js';

export class ViewFlipper extends FrameLayout {
    constructor(resolver) {
        super(resolver);
    }

    async renderWithBounds(node, width, height, renderChildCallback, parentType) {
        const TAG = 'ViewFlipper';
        const attr = node.attributes;
        const baseStyle = await this.getBaseStyles(attr, parentType || 'ViewGroup');

        LogManager.d(TAG, 'Initializing ViewFlipper render...');

        // Dimensions & Padding
        const mLeft = this._parseVal(attr.layout_marginLeft || attr.layout_marginStart || attr.layout_margin);
        const mRight = this._parseVal(attr.layout_marginRight || attr.layout_marginEnd || attr.layout_margin);
        const mTop = this._parseVal(attr.layout_marginTop || attr.layout_margin);
        const mBottom = this._parseVal(attr.layout_marginBottom || attr.layout_margin);

        const pLeft = this._parseVal(attr.paddingLeft || attr.paddingStart || attr.padding);
        const pRight = this._parseVal(attr.paddingRight || attr.paddingEnd || attr.padding);
        const pTop = this._parseVal(attr.paddingTop || attr.padding);
        const pBottom = this._parseVal(attr.paddingBottom || attr.padding);

        const availableW = (width || 360) - mLeft - mRight - pLeft - pRight;
        const availableH = (height || 640) - mTop - mBottom - pTop - pBottom;

        // Flipper Settings
        const displayedChildIndex = parseInt(attr['android:displayedChild'] || attr['displayedChild'] || '0');
        const autoStart = (attr['android:autoStart'] || attr['autoStart']) === 'true';
        const interval = parseInt(attr['android:flipInterval'] || attr['flipInterval'] || '3000');
        
        LogManager.i(TAG, `Settings: Interval=${interval}ms, AutoStart=${autoStart}, DefaultChildIndex=${displayedChildIndex}`);

        // Unique ID for JS targeting
        const flipperId = `flipper_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

        const frameStyle = `
            display: grid;
            grid-template-columns: 100%;
            grid-template-rows: 100%;
            overflow: hidden;
        `;

        LogManager.v(TAG, `Processing ${node.children.length} views for Flipper.`);

        const childrenHtmlArray = await Promise.all(node.children.map(async (child, index) => {
            let html = await renderChildCallback(child, 'FrameLayout', availableW, availableH);
            
            // Active view visible, others hidden
            let visibilityStyle = '';
            let activeClass = '';
            
            if (index === displayedChildIndex) {
                activeClass = 'flipper-active';
                LogManager.v(TAG, `View #${index} is ACTIVE (Visible)`);
            } else {
                visibilityStyle = 'display: none !important;';
            }

            // Gravity Logic (Same as FrameLayout)
            const gravity = child.attributes['android:layout_gravity'] || child.attributes['layout_gravity'] || '';
            let justify = 'stretch';
            let align = 'stretch';

            if (gravity.includes('left') || gravity.includes('start')) justify = 'start';
            if (gravity.includes('right') || gravity.includes('end')) justify = 'end';
            if (gravity.includes('center_horizontal')) justify = 'center';
            if (gravity.includes('top')) align = 'start';
            if (gravity.includes('bottom')) align = 'end';
            if (gravity.includes('center_vertical')) align = 'center';
            if (gravity.includes('center') && !gravity.includes('_')) { justify = 'center'; align = 'center'; }

            const childOverride = `
                grid-area: 1 / 1; 
                justify-self: ${justify} !important; 
                align-self: ${align} !important;
                z-index: auto;
                ${visibilityStyle}
            `;

            // Add class for JS selection
            return html.replace('class="', `class="flipper-child ${activeClass} `).replace('style="', `style="${childOverride} `);
        }));

        // JavaScript Injection for Auto Flipping
        let script = '';
        if (autoStart) {
            LogManager.d(TAG, 'Injecting auto-flip JavaScript...');
            script = `
            <script>
                (function() {
                    const flipper = document.getElementById('${flipperId}');
                    if (!flipper) return;
                    
                    const children = flipper.getElementsByClassName('flipper-child');
                    let currentIndex = ${displayedChildIndex};
                    
                    if (children.length > 1) {
                        setInterval(() => {
                            // Hide current
                            children[currentIndex].style.display = 'none';
                            
                            // Next index
                            currentIndex = (currentIndex + 1) % children.length;
                            
                            // Show next
                            children[currentIndex].style.display = 'flex'; // or whatever the original display was
                            
                            // Optional: Simple Fade In Effect
                            children[currentIndex].style.opacity = '0';
                            setTimeout(() => children[currentIndex].style.opacity = '1', 50);
                            children[currentIndex].style.transition = 'opacity 0.5s ease-in-out';
                            
                        }, ${interval});
                    }
                })();
            </script>
            `;
        }

        return `
            <div id="${flipperId}" class="android-layout view-flipper" style="${baseStyle} ${frameStyle}">
                ${childrenHtmlArray.join('')}
                ${script}
            </div>
        `;
    }
}