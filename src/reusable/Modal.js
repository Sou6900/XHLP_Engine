export class Modal {
    constructor(title, contentHtml, buttons = []) {
        this.overlay = document.createElement('div');
        this.overlay.className = 'andro-modal-overlay';
        
        this.overlay.innerHTML = `
            <div class="andro-modal-box">
                <div class="andro-modal-header">
                    <span class="andro-modal-title">${title}</span>
                    <span class="andro-modal-close">&times;</span>
                </div>
                <div class="andro-modal-body">
                    ${contentHtml}
                </div>
                <div class="andro-modal-footer"></div>
            </div>
        `;

        // Close Button Logic
        this.overlay.querySelector('.andro-modal-close').onclick = () => this.hide();
        this.overlay.onclick = (e) => {
            if (e.target === this.overlay) this.hide();
        };

        // Render Buttons
        const footer = this.overlay.querySelector('.andro-modal-footer');
        buttons.forEach(btn => {
            const buttonEl = document.createElement('button');
            buttonEl.className = `andro-modal-btn ${btn.isPrimary ? 'primary' : 'secondary'}`;
            buttonEl.textContent = btn.label;
            buttonEl.onclick = btn.onClick;
            footer.appendChild(buttonEl);
        });

        if (buttons.length === 0) footer.style.display = 'none';
    }

    show() {
        document.body.appendChild(this.overlay);
        // Animation trigger
        setTimeout(() => this.overlay.classList.add('visible'), 10);
    }

    hide() {
        this.overlay.classList.remove('visible');
        setTimeout(() => {
            if (this.overlay.isConnected) this.overlay.remove();
        }, 300);
    }

    static confirm(title, content) {
        return new Promise((resolve) => {
            const modal = new Modal(title, content, [
                { 
                    label: 'Cancel', 
                    onClick: () => { modal.hide(); resolve(false); } 
                },
                { 
                    label: 'Confirm', 
                    isPrimary: true, 
                    onClick: () => { modal.hide(); resolve(true); } 
                }
            ]);
            modal.show();
        });
    }
}