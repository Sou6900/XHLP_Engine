export class Dropdown {
    constructor(items, options = {}) {
        this.items = items; 
        this.onSelect = options.onSelect || (() => {});
        this.placeholder = options.placeholder || "Custom version...";
        this.btnText = options.btnText || "Set";
        
        this.element = null;
        this.overlay = null;
    }

    show(targetElement) {
        this.close(); 

        this.overlay = document.createElement('div');
        this.overlay.style.cssText = `position:fixed;top:0;left:0;width:100%;height:100%;z-index:9998;cursor:default;`;
        this.overlay.onclick = () => this.close();
        document.body.appendChild(this.overlay);

        this.element = document.createElement('div');
        this.element.className = 'andro-dropdown-menu';
        
        const rect = targetElement.getBoundingClientRect();
        this.element.style.top = `${rect.bottom + 5}px`;
        // Adjust left position to prevent overflow
        this.element.style.left = `${rect.left - 60}px`;

        let html = `<div class="andro-dropdown-content">`;
        
        this.items.forEach(item => {
            // Use 'label' for display, 'value' for logic
            const label = typeof item === 'object' ? item.label : item;
            const val = typeof item === 'object' ? item.value : item;
            const isDef = typeof item === 'object' && item.isDefault;
            
            html += `
                <div class="andro-dropdown-item" data-val="${val}">
                    <span>${label}</span> ${isDef ? '<span class="badge-def">Default</span>' : ''}
                </div>`;
        });

        html += `
            <div class="andro-dropdown-divider"></div>
            <div class="andro-dropdown-input-row">
                <input type="text" placeholder="${this.placeholder}" class="andro-dropdown-custom-input">
                <button class="andro-dropdown-add-btn">${this.btnText}</button>
            </div>
        </div>`;

        this.element.innerHTML = html;
        document.body.appendChild(this.element);

        this.element.querySelectorAll('.andro-dropdown-item').forEach(el => {
            el.onclick = () => {
                this.onSelect(el.dataset.val);
                this.close();
            };
        });

        const input = this.element.querySelector('.andro-dropdown-custom-input');
        const btn = this.element.querySelector('.andro-dropdown-add-btn');

        const handleCustom = () => {
            if(input.value.trim()) {
                this.onSelect(input.value.trim());
                this.close();
            }
        };

        btn.onclick = handleCustom;
        input.onkeydown = (e) => { if(e.key === 'Enter') handleCustom(); };
    }

    close() {
        if (this.element) this.element.remove();
        if (this.overlay) this.overlay.remove();
    }
}