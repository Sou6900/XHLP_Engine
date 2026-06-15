import { FrameLayout } from './FrameLayout.js';
import { LogManager } from '../../core/LogManager.js';

export class CardView extends FrameLayout {
    
    // Override render to delegate to renderWithBounds
    render(node, renderChildCallback, parentType) {
        return this.renderWithBounds(node, null, null, renderChildCallback, parentType);
    }

    async renderWithBounds(node, width, height, renderChildCallback, parentType) {
        const attr = node.attributes;
        const TAG = 'CardView';

        LogManager.d(TAG, `Rendering CardView... Attributes: ${JSON.stringify(attr)}`);

        // Call super (FrameLayout) to get the HTML structure
        let html = await super.renderWithBounds(node, width, height, renderChildCallback, parentType);

        const converter = this.converter; 

        // Apply Card Styling...
        const radius = attr['app:cardCornerRadius'] || attr['cardCornerRadius'] || '0dp';
        const cssRadius = converter.parse(radius);
        LogManager.v(TAG, `Corner Radius resolved: ${radius} -> ${cssRadius}`);

        const elevation = attr['app:cardElevation'] || attr['cardElevation'] || '0dp';
        const elVal = parseFloat(elevation);
        let boxShadow = 'none';
        let zIndexRule = ''; 

        if (!isNaN(elVal) && elVal > 0) {
            boxShadow = `0px ${elVal/2}px ${elVal}px rgba(0,0,0,0.24)`;
            // Elevation -> Z-index will increase
            zIndexRule = `z-index: ${Math.round(10 + elVal)};`; 
            LogManager.v(TAG, `Elevation applied: ${elVal}dp (BoxShadow & Z-Index updated)`);
        }

        let bgColor = '#FFFFFF';
        const bgAttr = attr['app:cardBackgroundColor'] || attr['cardBackgroundColor'];
        if (bgAttr) {
            bgColor = this.resolver.resolveColor(bgAttr);
            LogManager.v(TAG, `Background Color resolved: ${bgAttr} -> ${bgColor}`);
        }

        const cp = attr['app:contentPadding'] || attr['contentPadding'];
        let paddingStyle = '';
        if (cp) {
            const parsedPadding = converter.parse(cp);
            paddingStyle = `border-width: ${parsedPadding}; border-style: solid; border-color: transparent;`;
            LogManager.v(TAG, `Content Padding applied: ${parsedPadding}`);
        }

        const cardStyle = `
            background-color: ${bgColor};
            border-radius: ${cssRadius};
            box-shadow: ${boxShadow};
            ${zIndexRule}
            ${paddingStyle}
            overflow: hidden; 
            background-clip: border-box;
        `;

        LogManager.i(TAG, 'CardView render complete.');

        return html
            .replace('class="android-layout frame-layout"', 'class="android-layout card-view"')
            .replace('style="', `style="${cardStyle} `);
    }
}