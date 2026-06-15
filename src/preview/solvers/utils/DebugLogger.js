export class DebugLogger {
    constructor(enabled = true) {
        this.enabled = enabled;
    }

    log(method, message, data = null) {
        if (!this.enabled) return;
        const prefix = `[ConstraintSolver.${method}]`;
        if (data) {
            console.log(prefix, message, data);
        } else {
            console.log(prefix, message);
        }
    }

    warn(method, message) {
        console.warn(`[ConstraintSolver.${method}] ⚠️ ${message}`);
    }

    error(method, message) {
        console.error(`[ConstraintSolver.${method}] ❌ ${message}`);
    }
}