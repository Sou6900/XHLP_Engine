export class StatusBar {
    constructor() {
        this.element = document.createElement('div');
        this.element.className = 'android-status-bar';
        this.element.style.cssText = `
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 14px;
            box-sizing: border-box;
            font-family: Roboto, sans-serif;
            font-size: 12px;
            font-weight: 500;
            user-select: none;
            transition: background 0.3s ease;
        `;
        
        this.render();
    }

    render() {
        // 1. Time (Left Side)
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
        
        // 2. Icons (Right Side)
        const iconColor = 'currentColor'; 
        
        const signalIcon = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="${iconColor}">
                <path d="M2 22h20V2z" />
            </svg>
        `;
        
        const wifiIcon = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="${iconColor}" style="margin-left: 4px;">
                <path d="M12.01 21.49L23.64 7c-.45-.34-4.93-4-11.64-4C5.28 3 .81 6.66.36 7l11.63 14.49.01.01.01-.01z" />
            </svg>
        `;

        const batteryIcon = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="${iconColor}" style="margin-left: 4px;">
                <path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4z" />
            </svg>
        `;

        this.element.innerHTML = `
            <span id="sb-time" style="position: relative; z-index: 1;">${time}</span>
            <div style="display: flex; align-items: center; position: relative; z-index: 1;">
                ${signalIcon}
                ${wifiIcon}
                ${batteryIcon}
            </div>
        `;
    }

    setBackground(color) {
        if (!color || color === 'transparent') {
            this.element.style.backgroundColor = 'transparent';
            return;
        }
        this.element.style.backgroundColor = color;
        
        const isBackgroundDark = this._isColorDark(color);
        this.setTheme(isBackgroundDark); 
    }

    setTheme(isDarkBackground) {
        // Icons color logic
        const color = isDarkBackground ? '#FFFFFF' : '#121212'; 
        this.element.style.color = color;
        
        // Update SVG fills for system icons
        const svgs = this.element.querySelectorAll('svg');
        svgs.forEach(svg => svg.style.fill = color);
    }

    _isColorDark(color) {
        if (!color) return false;
        
        let r, g, b;

        if (color.startsWith('#')) {
            const hex = color.replace('#', '');
            if (hex.length === 3) {
                r = parseInt(hex[0]+hex[0], 16); g = parseInt(hex[1]+hex[1], 16); b = parseInt(hex[2]+hex[2], 16);
            } else {
                r = parseInt(hex.substring(0, 2), 16); g = parseInt(hex.substring(2, 4), 16); b = parseInt(hex.substring(4, 6), 16);
            }
        } 
        else if (color.startsWith('rgb')) {
            const arr = color.match(/\d+/g);
            if (!arr || arr.length < 3) return false;
            r = parseInt(arr[0]);
            g = parseInt(arr[1]);
            b = parseInt(arr[2]);
        } else {
            return false;
        }

        const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
        return yiq < 128;
    }

    getElement() {
        return this.element;
    }
}