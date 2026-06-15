/**
 * ConstraintWidgetRenderer.js
 */

export class ConstraintWidgetRenderer {
    constructor() {
        this.svgNS = 'http://www.w3.org/2000/svg';
    }

    createConstraintWidget(data) {
        const container = document.createElement('div');
        container.className = 'constraint-widget-container';
        
        // 1. Grid Background
        const grid = this.createGridBackground();
        container.appendChild(grid);

        // 2. SVG Layer
        const svg = this.createSVGLayer();
        container.appendChild(svg);

        // Extract Data safely
        const dim = data.dimensions || { layout_width: 'wrap_content', layout_height: 'wrap_content' };
        const cons = data.constraints || {};
        const spacing = data.spacing || {};

        // 3. Central View Box
        const viewBox = this.createViewBox(dim);
        container.appendChild(viewBox);
        
        // 4. Analyze Logic
        const state = this.analyzeState(cons, dim);
        
        // 5. Draw Everything
        this.drawConnectors(svg, container, state);
        this.drawAnchors(container, state);
        this.drawMargins(container, state, spacing);
        this.drawBiasSliders(container, state); 

        this._attachInteraction(container);
        
        return container;
    }

    _attachInteraction(container) {
        // 1. Inject Dynamic CSS for Transition
        if (!document.getElementById('cw-interaction-styles')) {
            const style = document.createElement('style');
            style.id = 'cw-interaction-styles';
            style.innerHTML = `
                /* Default State: Hidden */
                .constraint-widget-container .cw-bias-thumb,
                .constraint-widget-container .cw-bias-track,
                .constraint-widget-container .cw-kill-btn,
                .constraint-widget-container .cw-margin,
                .constraint-widget-container .cw-bias-label {
                    opacity: 0;
                    transition: opacity 0.2s ease-in-out;
                    pointer-events: none;
                }

                /* Active State (Hover or Clicked): Visible */
                .constraint-widget-container:hover .cw-bias-thumb,
                .constraint-widget-container:hover .cw-bias-track,
                .constraint-widget-container:hover .cw-kill-btn,
                .constraint-widget-container:hover .cw-margin,
                .constraint-widget-container:hover .cw-bias-label,
                .constraint-widget-container.active .cw-bias-thumb,
                .constraint-widget-container.active .cw-bias-track,
                .constraint-widget-container.active .cw-kill-btn,
                .constraint-widget-container.active .cw-margin,
                .constraint-widget-container.active .cw-bias-label {
                    opacity: 1;
                    pointer-events: auto;
                }
            `;
            document.head.appendChild(style);
        }

        // 2. Click Inside -> Make Active
        container.addEventListener('click', (e) => {
            e.stopPropagation();
            document.querySelectorAll('.constraint-widget-container').forEach(el => el.classList.remove('active'));
            container.classList.add('active');
        });

        // 3. Click Outside -> Remove Active
        window.addEventListener('click', (e) => {
            if (!container.contains(e.target)) {
                container.classList.remove('active');
            }
        });
    }

    createSVGLayer() {
        const svg = document.createElementNS(this.svgNS, 'svg');
        svg.style.cssText = `position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 1;`;
        return svg;
    }

    createGridBackground() {
        const grid = document.createElement('div');
        grid.className = 'cw-grid-bg';
        return grid;
    }

    createViewBox(dim) {
        const box = document.createElement('div');
        box.className = 'cw-view-box';
        
        const wIcon = this.getDimensionSVG(dim.layout_width, 'horizontal');
        const hIcon = this.getDimensionSVG(dim.layout_height, 'vertical');
        
        box.innerHTML = `
            <div class="cw-dim-icon w" title="Width: ${dim.layout_width}">${wIcon}</div>
            <div class="cw-dim-icon h" title="Height: ${dim.layout_height}">${hIcon}</div>
        `;
        return box;
    }

    analyzeState(c, d) {
        // NORMALIZATION: Support Left/Right as Start/End
        const startToStart = c.startToStart || c.leftToLeft;
        const startToEnd = c.startToEnd || c.leftToRight;
        const endToStart = c.endToStart || c.rightToLeft;
        const endToEnd = c.endToEnd || c.rightToRight;

        // --- Horizontal Logic ---
        const hasStart = !!(startToStart || startToEnd);
        const hasEnd = !!(endToEnd || endToStart);
        
        let isAlignmentH = false;
        if (startToStart && endToEnd) {
            const t1 = startToStart.replace('@+id/', '');
            const t2 = endToEnd.replace('@+id/', '');
            if (t1 === t2 && t1 !== 'parent') isAlignmentH = true;
        }

        const wMode = d.layout_width;
        const isMatchConstraintH = wMode === '0dp' || wMode === 'match_constraint';
        const isMatchParentH = wMode === 'match_parent';
        
        const hasBiasH = hasStart && hasEnd && !isMatchConstraintH && !isMatchParentH && !c.inHorizontalChain;
        const showSpringH = hasBiasH && !isAlignmentH;

        // --- Vertical Logic ---
        const hasTop = !!(c.topToTop || c.topToBottom);
        const hasBottom = !!(c.bottomToBottom || c.bottomToTop);

        let isAlignmentV = false;
        if (c.topToTop && c.bottomToBottom) {
            const t1 = c.topToTop.replace('@+id/', '');
            const t2 = c.bottomToBottom.replace('@+id/', '');
            if (t1 === t2 && t1 !== 'parent') isAlignmentV = true;
        }

        const hMode = d.layout_height;
        const isMatchConstraintV = hMode === '0dp' || hMode === 'match_constraint';
        const isMatchParentV = hMode === 'match_parent';

        const hasBiasV = hasTop && hasBottom && !isMatchConstraintV && !isMatchParentV && !c.inVerticalChain;
        const showSpringV = hasBiasV && !isAlignmentV;

        return {
            hasStart, hasEnd, hasTop, hasBottom,
            hasBiasH, hasBiasV,     
            showSpringH, showSpringV, 
            chainH: c.inHorizontalChain,
            chainV: c.inVerticalChain,
            biasH: parseFloat(c.horizontalBias || 0.5),
            biasV: parseFloat(c.verticalBias || 0.5)
        };
    }

    /**
     *  Draw Connectors
     */
    drawConnectors(svg, container, s) {
        const cx = 100, cy = 90; 
        const boxSize = 80;
        const halfBox = boxSize / 2;
        
        // Top
        if (s.hasTop) {
            const y1 = cy - halfBox;
            const y2 = 15;
            if (s.showSpringV) this.drawSpring(svg, cx, y1, cx, y2, 'vertical');
            else this.drawLine(svg, cx, y1, cx, y2);
            
            if (s.chainV) this.drawChainIcon(svg, cx, (y1+y2)/2, false);
            else this.drawKillButton(container, cx, (y1+y2)/2 + 5, 'top');
        }

        // Bottom
        if (s.hasBottom) {
            const y1 = cy + halfBox;
            const y2 = 165;
            if (s.showSpringV) this.drawSpring(svg, cx, y1, cx, y2, 'vertical');
            else this.drawLine(svg, cx, y1, cx, y2);
            
            if (s.chainV && !s.hasTop) this.drawChainIcon(svg, cx, (y1+y2)/2, false);
            else if (!s.chainV) this.drawKillButton(container, cx, (y1+y2)/2 - 5, 'bottom');
        }

        // Start (Left)
        if (s.hasStart) {
            const x1 = cx - halfBox;
            const x2 = 15;
            if (s.showSpringH) this.drawSpring(svg, x1, cy, x2, cy, 'horizontal');
            else this.drawLine(svg, x1, cy, x2, cy);
            
            if (s.chainH) this.drawChainIcon(svg, (x1+x2)/2, cy, true);
            else this.drawKillButton(container, (x1+x2)/2 + 5, cy, 'start');
        }

        // End (Right)
        if (s.hasEnd) {
            const x1 = cx + halfBox;
            const x2 = 185;
            if (s.showSpringH) this.drawSpring(svg, x1, cy, x2, cy, 'horizontal');
            else this.drawLine(svg, x1, cy, x2, cy);

            if (s.chainH && !s.hasStart) this.drawChainIcon(svg, (x1+x2)/2, cy, true);
            else if (!s.chainH) this.drawKillButton(container, (x1+x2)/2 - 5, cy, 'end');
        }
    }

    drawSpring(svg, x1, y1, x2, y2, orient) {
        const path = document.createElementNS(this.svgNS, 'path');
        let d = `M ${x1} ${y1}`;
        const segments = 16;  
        const amp = 3;        
        
        for (let i = 1; i <= segments; i++) {
            const t = i / segments;
            const cx = x1 + (x2 - x1) * t;
            const cy = y1 + (y2 - y1) * t;
            let ox = 0, oy = 0;
            if (orient === 'vertical') ox = (i % 2 === 0 ? amp : -amp);
            else oy = (i % 2 === 0 ? amp : -amp);
            d += ` L ${cx + ox} ${cy + oy}`;
        }
        
        path.setAttribute('d', d);
        path.setAttribute('stroke', '#546E7A');
        path.setAttribute('stroke-width', '1.5');
        path.setAttribute('fill', 'none');
        svg.appendChild(path);
    }

    drawLine(svg, x1, y1, x2, y2) {
        const line = document.createElementNS(this.svgNS, 'line');
        line.setAttribute('x1', x1); line.setAttribute('y1', y1);
        line.setAttribute('x2', x2); line.setAttribute('y2', y2);
        line.setAttribute('stroke', '#507399');
        line.setAttribute('stroke-width', '2');
        svg.appendChild(line);
    }

    drawChainIcon(svg, cx, cy, isHorizontal) {
        const group = document.createElementNS(this.svgNS, 'g');
        group.setAttribute('transform', `translate(${cx}, ${cy}) rotate(${isHorizontal ? 0 : 90})`);
        
        const path = document.createElementNS(this.svgNS, 'path');
        path.setAttribute('d', 'M-5 -2 L-2 -2 A2 2 0 0 1 -2 2 L-5 2 A2 2 0 0 1 -5 -2 M2 -2 L5 -2 A2 2 0 0 1 5 2 L2 2 A2 2 0 0 1 2 -2 M-2 0 L2 0');
        path.setAttribute('stroke', '#FFD700'); 
        path.setAttribute('stroke-width', '1.5');
        path.setAttribute('fill', 'none');
        
        const bg = document.createElementNS(this.svgNS, 'circle');
        bg.setAttribute('r', '7');
        bg.setAttribute('fill', '#2b2d30');
        
        group.appendChild(bg);
        group.appendChild(path);
        svg.appendChild(group);
    }

    drawKillButton(container, x, y, type) {
        const btn = document.createElement('div');
        btn.className = 'cw-kill-btn';
        btn.innerHTML = `<svg width="8" height="8" viewBox="0 0 24 24" stroke="currentColor" stroke-width="4"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
        btn.style.cssText = `
            position: absolute;
            left: ${x}px; top: ${y}px;
            transform: translate(-50%, -50%);
            width: 14px; height: 14px;
            background: #2b2d30;
            border: 1px solid #555;
            border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            color: #d64a4a;
            cursor: pointer;
            z-index: 10;
            opacity: 0; 
            transition: opacity 0.2s;
        `;
        
        container.addEventListener('mouseenter', () => btn.style.opacity = '1');
        container.addEventListener('mouseleave', () => btn.style.opacity = '0');
        
        container.appendChild(btn);
    }

    getDimensionSVG(mode, orient) {
        const isHorz = orient === 'horizontal';
        const color = '#a9b7c6';
        
        if (mode === 'wrap_content') {
            const d = isHorz 
                ? "M4 5 L10 10 L4 15 M10 5 L16 10 L10 15"
                : "M5 4 L10 10 L15 4 M5 10 L10 16 L15 10"; 
            return `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="${color}" stroke-width="2">${d}</svg>`;
        }
        
        if (mode === '0dp' || mode === 'match_constraint') {
            const d = isHorz
                ? "M2 10 Q6 4 10 10 T18 10"
                : "M10 2 Q16 6 10 10 T10 18";
            return `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="${color}" stroke-width="2">${d}</svg>`;
        }
        
        if (mode === 'match_parent') {
            const d = isHorz
                ? "M2 10 L18 10 M2 10 L6 6 M2 10 L6 14 M18 10 L14 6 M18 10 L14 14"
                : "M10 2 L10 18 M10 2 L6 6 M10 2 L14 6 M10 18 L6 14 M10 18 L14 14";
             return `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="${color}" stroke-width="2">${d}</svg>`;
        }
        
        const d = isHorz
            ? "M2 10 L18 10 M2 5 L2 15 M18 5 L18 15"
            : "M10 2 L10 18 M5 2 L15 2 M5 18 L15 18";
        return `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="${color}" stroke-width="2">${d}</svg>`;
    }

    drawAnchors(container, s) {
        const anchors = [
            { x: 100, y: 50, connected: s.hasTop, side: 'top' },
            { x: 100, y: 130, connected: s.hasBottom, side: 'bottom' },
            { x: 60, y: 90, connected: s.hasStart, side: 'start' },
            { x: 140, y: 90, connected: s.hasEnd, side: 'end' }
        ];
        
        anchors.forEach(a => {
            const div = document.createElement('div');
            div.className = `cw-anchor ${a.connected ? 'connected' : ''}`;
            
            if (!a.connected) {
                div.innerHTML = `<svg width="8" height="8" viewBox="0 0 10 10"><path d="M5 1 L5 9 M1 5 L9 5" stroke="#777" stroke-width="2"/></svg>`;
            } else {
                div.style.background = '#64C8FF';
            }
            
            div.style.cssText = `
                position: absolute;
                left: ${a.x}px; top: ${a.y}px;
                transform: translate(-50%, -50%);
                width: ${a.connected ? '8px' : '14px'};
                height: ${a.connected ? '8px' : '14px'};
                border: 1px solid ${a.connected ? '#333' : '#444'};
                background: ${a.connected ? '#64C8FF' : '#2b2d30'};
                border-radius: 50%;
                display: flex; align-items: center; justify-content: center;
                z-index: 5;
            `;
            container.appendChild(div);
        });
    }

    drawMargins(container, s, spacing) {
        // Fix for margins positioning next to lines
        const mData = [
            { x: 100 + 18, y: 32, val: spacing.marginTop, show: s.hasTop },
            { x: 100 + 18, y: 148, val: spacing.marginBottom, show: s.hasBottom },
            { x: 40, y: 90 - 12, val: spacing.marginStart, show: s.hasStart },
            { x: 160, y: 90 - 12, val: spacing.marginEnd, show: s.hasEnd }
        ];
        
        mData.forEach(m => {
            if (!m.show || !m.val || m.val === '0dp') return;
            const el = document.createElement('div');
            el.className = 'cw-margin';
            el.textContent = m.val;
            el.style.cssText = `
                position: absolute;
                left: ${m.x}px; top: ${m.y}px;
                transform: translate(-50%, -50%);
                font-size: 10px; color: #a9b7c6;
                background: #2b2d30;
                padding: 0 2px;
                border-radius: 2px;
                z-index: 4;
            `;
            container.appendChild(el);
        });
    }

    drawBiasSliders(container, s) {
        if (s.hasBiasH) {
            this.createBiasElement(container, 60, 155, 80, 2, s.biasH, 'horizontal');
        }
        if (s.hasBiasV) {
            this.createBiasElement(container, 20, 50, 2, 80, s.biasV, 'vertical');
        }
    }

    createBiasElement(container, x, y, w, h, bias, orient) {
        const isHorz = orient === 'horizontal';
        
        // Track
        const track = document.createElement('div');
        track.style.cssText = `position:absolute; left:${x}px; top:${y}px; width:${w}px; height:${h}px; background:#444; border-radius:2px;`;
        container.appendChild(track);
        
        // Thumb position
        const tx = isHorz ? x + (w * bias) - 6 : x - 5;
        const ty = isHorz ? y - 5 : y + (h * bias) - 6;
        
        // Thumb
        const thumb = document.createElement('div');
        thumb.className = 'cw-bias-thumb';
        thumb.title = `Bias: ${Math.round(bias*100)}%`;
        thumb.style.cssText = `
            position: absolute;
            left: ${tx}px; top: ${ty}px;
            width: 12px; height: 12px;
            background: #a9b7c6;
            border: 2px solid #2b2d30;
            border-radius: 50%;
            cursor: pointer;
            z-index: 6;
        `;
        
        thumb.onmouseover = () => thumb.style.background = '#fff';
        thumb.onmouseout = () => thumb.style.background = '#a9b7c6';
        
        container.appendChild(thumb);

        // Bias Value Badge
        const label = document.createElement('div');
        label.className = 'cw-bias-label';
        label.textContent = `${Math.round(bias * 100)}%`;
        
        const lx = tx + 22; 
        const ly = ty - 14; 

        label.style.cssText = `
            position: absolute;
            left: ${lx}px; top: ${ly}px;
            transform: translateX(-25%);
            font-size: 8px;
            color: #fff;
            background: #00000085;
            padding: 1px 3px;
            border-radius: 3px;
            pointer-events: none;
            z-index: 7;
            white-space: nowrap;
        `;
        container.appendChild(label);
    }
}