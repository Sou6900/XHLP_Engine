import { LogManager } from '../../core/LogManager.js';

export class ChainSolver {
    constructor(solver) {
        this.solver = solver;
        this.helper = solver.helper;
        this.TAG = 'ChainSolver';
    }

    detectChains(children) {
        const processedH = new Set();
        const processedV = new Set();
        let chainCount = 0;

        children.forEach(node => {
            const id = this.helper.getId(node);
            if (!id) return;

            if (!processedH.has(id)) {
                if (this.detectChain(id, children, 'horizontal', processedH)) chainCount++;
            }
            if (!processedV.has(id)) {
                if (this.detectChain(id, children, 'vertical', processedV)) chainCount++;
            }
        });

        if (chainCount > 0) {
            LogManager.d(this.TAG, `Detected ${chainCount} chains in layout.`);
        }
    }

    detectChain(headId, children, orientation, processedSet) {
        const members = this.collectChainMembers(headId, children, orientation);
        if (members.length < 2) return false;

        const headNode = members[0].node;
        const tailNode = members[members.length - 1].node;
        const headAttr = headNode.attributes;
        const tailAttr = tailNode.attributes;

        let headHasAnchor, tailHasAnchor;

        if (orientation === 'horizontal') {
            headHasAnchor =
                this.helper.getAttr(headAttr, 'layout_constraintStart_toStartOf') ||
                this.helper.getAttr(headAttr, 'layout_constraintStart_toEndOf') ||
                this.helper.getAttr(headAttr, 'layout_constraintLeft_toLeftOf');

            tailHasAnchor =
                this.helper.getAttr(tailAttr, 'layout_constraintEnd_toEndOf') ||
                this.helper.getAttr(tailAttr, 'layout_constraintEnd_toStartOf') ||
                this.helper.getAttr(tailAttr, 'layout_constraintRight_toRightOf');
        } else {
            headHasAnchor =
                this.helper.getAttr(headAttr, 'layout_constraintTop_toTopOf') ||
                this.helper.getAttr(headAttr, 'layout_constraintTop_toBottomOf');

            tailHasAnchor =
                this.helper.getAttr(tailAttr, 'layout_constraintBottom_toBottomOf') ||
                this.helper.getAttr(tailAttr, 'layout_constraintBottom_toTopOf');
        }

        if (headHasAnchor && tailHasAnchor) {
            const styleAttr = orientation === 'horizontal' ? 'layout_constraintHorizontal_chainStyle' : 'layout_constraintVertical_chainStyle';
            const biasAttr = orientation === 'horizontal' ? 'layout_constraintHorizontal_bias' : 'layout_constraintVertical_bias';

            const style = this.helper.getAttr(headAttr, styleAttr) || 'spread';
            const bias = parseFloat(this.helper.getAttr(headAttr, biasAttr) || '0.5');

            LogManager.i(this.TAG, `[${orientation.toUpperCase()} CHAIN] Head: ${headId}, Members: ${members.length}, Style: ${style}, Bias: ${bias}`);

            members.forEach(m => {
                const state = this.solver.nodeMap.get(m.id);
                if (orientation === 'horizontal') state.inHorizontalChain = true;
                else state.inVerticalChain = true;
                processedSet.add(m.id);
            });

            const headState = this.solver.nodeMap.get(members[0].id);
            if (orientation === 'horizontal') {
                headState.horizontalChain = { members, style, bias };
            } else {
                headState.verticalChain = { members, style, bias };
            }
            return true;
        } else {
            LogManager.w(this.TAG, `Broken ${orientation} chain detected starting at ${headId}. Missing anchors on Head or Tail.`);
            return false;
        }
    }

    collectChainMembers(headId, children, orientation) {
        const members = [];
        let currentId = headId;
        const visited = new Set();
        const isHorizontal = orientation === 'horizontal';

        while (currentId && !visited.has(currentId)) {
            visited.add(currentId);
            const node = children.find(c => this.helper.getId(c) === currentId);
            if (!node) break;

            const state = this.solver.nodeMap.get(currentId);
            members.push({ id: currentId, node, state });

            let next = null;
            let nextIdAttr;

            if (isHorizontal) {
                nextIdAttr = this.helper.getAttr(node.attributes, 'layout_constraintEnd_toStartOf') ||
                             this.helper.getAttr(node.attributes, 'layout_constraintRight_toLeftOf');
            } else {
                nextIdAttr = this.helper.getAttr(node.attributes, 'layout_constraintBottom_toTopOf');
            }

            if (nextIdAttr) {
                const potentialNextId = nextIdAttr.replace(/@\+?id\//, '');
                const nextNode = children.find(c => this.helper.getId(c) === potentialNextId);

                if (nextNode) {
                    let prevIdAttr;
                    if (isHorizontal) {
                        prevIdAttr = this.helper.getAttr(nextNode.attributes, 'layout_constraintStart_toEndOf') ||
                                     this.helper.getAttr(nextNode.attributes, 'layout_constraintLeft_toRightOf');
                    } else {
                        prevIdAttr = this.helper.getAttr(nextNode.attributes, 'layout_constraintTop_toBottomOf');
                    }

                    if (prevIdAttr && prevIdAttr.includes(currentId)) {
                        next = potentialNextId;
                    } else {
                         LogManager.w(this.TAG, `Chain Broken: ${currentId} points to ${potentialNextId}, but ${potentialNextId} does not point back.`);
                    }
                }
            }
            currentId = next;
        }
        return members;
    }

    solveChainHorizontal(headState) {
        if (!headState.horizontalChain) return;
        const { members, style, bias } = headState.horizontalChain;
        this.distributeChain(members, style, bias, 'horizontal');
    }

    solveChainVertical(headState) {
        if (!headState.verticalChain) return;
        const { members, style, bias } = headState.verticalChain;
        this.distributeChain(members, style, bias, 'vertical');
    }

    distributeChain(members, style, bias, orientation) {
        let visibleMembers = members.filter(m => this.helper.getAttr(m.node.attributes, 'visibility') !== 'gone');
        
        if (visibleMembers.length === 0) {
             LogManager.v(this.TAG, `Skipping ${orientation} chain (all members GONE).`);
             return;
        }

        const isHorizontal = orientation === 'horizontal';
        
        // RTL Support (Reverse list, Invert Bias)
        if (isHorizontal && this.solver.isRTL) {
            visibleMembers = visibleMembers.reverse();
            bias = 1.0 - bias;
            LogManager.v(this.TAG, `RTL Mode active: Reversed horizontal chain order.`);
        }

        const headNode = members[0].node;
        const tailNode = members[members.length - 1].node;

        // 1. Anchor Calculation
        let startAnchor = 0;
        let endAnchor = isHorizontal ? this.solver.parentW : this.solver.parentH;

        if (isHorizontal) {
            const startToStart = this.helper.getAttr(headNode.attributes, 'layout_constraintStart_toStartOf');
            const startToEnd = this.helper.getAttr(headNode.attributes, 'layout_constraintStart_toEndOf');
            
            if (startToStart) {
                const t = startToStart.replace(/@\+?id\//, '');
                startAnchor = (t === 'parent') ? this.solver.padding.left : this.solver.getPos(t, 'left');
            } else if (startToEnd) {
                const t = startToEnd.replace(/@\+?id\//, '');
                startAnchor = this.solver.getPos(t, 'right');
            }

            const endToEnd = this.helper.getAttr(tailNode.attributes, 'layout_constraintEnd_toEndOf');
            const endToStart = this.helper.getAttr(tailNode.attributes, 'layout_constraintEnd_toStartOf');
            
            if (endToEnd) {
                const t = endToEnd.replace(/@\+?id\//, '');
                endAnchor = (t === 'parent') ? (this.solver.parentW - this.solver.padding.right) : this.solver.getPos(t, 'right');
            } else if (endToStart) {
                const t = endToStart.replace(/@\+?id\//, '');
                endAnchor = this.solver.getPos(t, 'left');
            }
        } else {
            const topToTop = this.helper.getAttr(headNode.attributes, 'layout_constraintTop_toTopOf');
            const topToBottom = this.helper.getAttr(headNode.attributes, 'layout_constraintTop_toBottomOf');
            
            if (topToTop) {
                const t = topToTop.replace(/@\+?id\//, '');
                startAnchor = (t === 'parent') ? this.solver.padding.top : this.solver.getPos(t, 'top');
            } else if (topToBottom) {
                const t = topToBottom.replace(/@\+?id\//, '');
                startAnchor = this.solver.getPos(t, 'bottom');
            }

            const bottomToBottom = this.helper.getAttr(tailNode.attributes, 'layout_constraintBottom_toBottomOf');
            const bottomToTop = this.helper.getAttr(tailNode.attributes, 'layout_constraintBottom_toTopOf');
            
            if (bottomToBottom) {
                const t = bottomToBottom.replace(/@\+?id\//, '');
                endAnchor = (t === 'parent') ? (this.solver.parentH - this.solver.padding.bottom) : this.solver.getPos(t, 'bottom');
            } else if (bottomToTop) {
                const t = bottomToTop.replace(/@\+?id\//, '');
                endAnchor = this.solver.getPos(t, 'top');
            }
        }

        // Apply Head/Tail Margins
        const headMargin = this.helper.parsePx(this.helper.getAttr(headNode.attributes, isHorizontal ? 'layout_marginStart' : 'layout_marginTop'));
        const tailMargin = this.helper.parsePx(this.helper.getAttr(tailNode.attributes, isHorizontal ? 'layout_marginEnd' : 'layout_marginBottom'));
        
        startAnchor += headMargin;
        endAnchor -= tailMargin;

        LogManager.v(this.TAG, `Chain Bounds: Start=${startAnchor}, End=${endAnchor}, Available=${endAnchor - startAnchor}`);

        let totalFixedSize = 0;
        let weightedMembers = [];
        
        // Weight Calculation Variables
        let totalWeight = 0;
        let useWeights = false;

        // 2. Size Calculation Loop
        visibleMembers.forEach((m, i) => {
            let m1 = 0, m2 = 0;
            if (i > 0) {
                m1 = this.helper.parsePx(this.helper.getAttr(m.node.attributes, isHorizontal ? 'layout_marginStart' : 'layout_marginTop'));
            }
            if (i < visibleMembers.length - 1) {
                m2 = this.helper.parsePx(this.helper.getAttr(m.node.attributes, isHorizontal ? 'layout_marginEnd' : 'layout_marginBottom'));
            }

            const sizeAttr = this.helper.getAttr(m.node.attributes, isHorizontal ? 'layout_width' : 'layout_height');
            
            // Check for match_constraint (0dp)
            if (sizeAttr === '0dp' || sizeAttr === 'match_constraint') {
                weightedMembers.push(m);
                totalFixedSize += m1 + m2;

                const weightAttr = isHorizontal ? 'layout_constraintHorizontal_weight' : 'layout_constraintVertical_weight';
                const weight = parseFloat(this.helper.getAttr(m.node.attributes, weightAttr) || '0');
                
                m.weight = weight;
                if (weight > 0) {
                    totalWeight += weight;
                    useWeights = true;
                }
            } else {
                const currentSize = isHorizontal ? m.state.w : m.state.h;
                totalFixedSize += currentSize + m1 + m2;
            }
        });

        const availableSpace = endAnchor - startAnchor;
        const remainingSpace = availableSpace - totalFixedSize;

        if (remainingSpace < 0) {
            LogManager.w(this.TAG, `[Overflow] Chain exceeds available space by ${Math.abs(remainingSpace)}px. Clipping may occur.`);
        }

        // 3. Apply Sizes (Weighted vs Spread)
        if (weightedMembers.length > 0) {
            const spaceToDistribute = Math.max(0, remainingSpace);
            
            if (useWeights && totalWeight > 0) {
                LogManager.v(this.TAG, `Distributing ${spaceToDistribute}px using weights (Total Weight: ${totalWeight})`);
                weightedMembers.forEach(m => {
                    const share = (m.weight / totalWeight) * spaceToDistribute;
                    if (isHorizontal) m.state.w = share;
                    else m.state.h = share;
                });
            } else {
                LogManager.v(this.TAG, `Distributing ${spaceToDistribute}px equally among ${weightedMembers.length} 0dp views.`);
                const sizePerNode = spaceToDistribute / weightedMembers.length;
                weightedMembers.forEach(m => {
                    if (isHorizontal) m.state.w = sizePerNode;
                    else m.state.h = sizePerNode;
                });
            }
        }

        // 4. Positioning Logic
        let currentPos = startAnchor;
        let gap = 0;

        // When 0 dp no member -> GAP need
        if (weightedMembers.length === 0 || remainingSpace > 0) {
             const spaceForGaps = Math.max(0, remainingSpace); // Prevent negative gap

             if (weightedMembers.length === 0) {
                if (style === 'spread') {
                    gap = spaceForGaps / (visibleMembers.length + 1);
                    currentPos += gap;
                } else if (style === 'spread_inside') {
                    gap = spaceForGaps / (visibleMembers.length - 1);
                } else if (style === 'packed') {
                    gap = 0;
                    currentPos += spaceForGaps * bias;
                }
             }
        }

        // 5. Apply Final Positions
        visibleMembers.forEach((m, i) => {
            if (i > 0) {
                currentPos += this.helper.parsePx(this.helper.getAttr(m.node.attributes, isHorizontal ? 'layout_marginStart' : 'layout_marginTop'));
            }

            const snappedPos = Math.round(currentPos);
            if (isHorizontal) {
                m.state.x = snappedPos;
                m.state.alignment = 'start'; 
            } else {
                m.state.y = snappedPos;
                m.state.solvedY = true;
            }

            const size = isHorizontal ? m.state.w : m.state.h;
            currentPos += size;

            if (i < visibleMembers.length - 1) {
                currentPos += this.helper.parsePx(this.helper.getAttr(m.node.attributes, isHorizontal ? 'layout_marginEnd' : 'layout_marginBottom'));
            }

            if (weightedMembers.length === 0) {
                if (style === 'spread') currentPos += gap;
                else if (style === 'spread_inside' && i < visibleMembers.length - 1) currentPos += gap;
            }
        });
    }
}