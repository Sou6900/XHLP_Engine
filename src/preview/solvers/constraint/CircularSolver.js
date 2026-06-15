import { LogManager } from '../../core/LogManager.js';

export class CircularSolver {
    constructor(solver) {
        this.solver = solver;
        this.helper = solver.helper;
        this.TAG = 'CircularSolver';
    }

    solve(state, attr) {
        const id = state.id || 'unknown';
        const targetIdRaw = this.helper.getAttr(attr, 'layout_constraintCircle');
        
        if (!targetIdRaw) return; // Not a circular constraint

        const targetId = targetIdRaw.replace(/@\+?id\//, '');
        const targetState = this.solver.nodeMap.get(targetId);

        if (!targetState) {
            LogManager.e(this.TAG, `Constraint Error: View ${id} references missing circular constraint target '@id/${targetId}'.`);
            return;
        }

        const radius = this.helper.parsePx(this.helper.getAttr(attr, 'layout_constraintCircleRadius')) || 0;
        let angle = parseFloat(this.helper.getAttr(attr, 'layout_constraintCircleAngle')) || 0;
        
        // LogManager.v(this.TAG, `Solving circular constraint for ${id}: target=${targetId}, radius=${radius}, angle=${angle}`);

        // Android Angle Logic:
        // 0 degrees = Top (12 o'clock)
        // Increases Clockwise (0 -> 90 -> 180 -> 270)
        
        // Math Logic:
        // Radian conversion
        const rad = angle * (Math.PI / 180);

        // Target Center Calculation
        const targetCenterX = targetState.x + (targetState.w / 2);
        const targetCenterY = targetState.y + (targetState.h / 2);

        // Calculate Center Position of the Satellite View
        // X = r * sin(theta)  (For 0 at top, clockwise)
        // Y = -r * cos(theta) (For 0 at top, clockwise, noting Y is down-positive)
        
        const myCenterX = targetCenterX + (radius * Math.sin(rad));
        const myCenterY = targetCenterY - (radius * Math.cos(rad));

        // Set Top-Left Position based on calculated Center
        const newX = myCenterX - (state.w / 2);
        const newY = myCenterY - (state.h / 2);

        if (isNaN(newX) || isNaN(newY)) {
             LogManager.e(this.TAG, `Calculation failed for ${id}. Resulted in NaN. Check radius/angle values.`);
             return;
        }

        state.x = newX;
        state.y = newY;
        
        state.solvedX = true;
        state.solvedY = true;

        LogManager.i(this.TAG, `[Circular] Positioned ${id} at ${angle}° dist ${radius}px from ${targetId}. Loc: (${state.x.toFixed(1)}, ${state.y.toFixed(1)})`);
    }
}