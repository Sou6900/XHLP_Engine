// // dp/sp to px calculator

import { DeviceConfig } from './DeviceConfig.js';
import { LogManager } from '../core/LogManager.js';

export class DensityConverter {
    constructor() {
        this.density = DeviceConfig.density;
        this.TAG = 'DensityConverter';
        
        LogManager.d(this.TAG, `Initialized converter with screen density: ${this.density}`);
    }

    parse(value) {
        if (!value) return '0px';
        if (typeof value !== 'string') return `${value}px`;
        
        // Handle Keywords
        if (value === 'match_parent' || value === 'fill_parent') return '100%';
        if (value === 'wrap_content') return 'max-content';
        if (value === 'auto') return 'auto';

        const match = value.match(/^([-\d.]+)(dp|dip|sp|px)?$/);
        
        if (!match) {
            // ⚠️ Ignore Percentage values (CSS support) but warn for others
            if (!value.endsWith('%')) {
                LogManager.w(this.TAG, `[Lint] Invalid dimension format: '${value}'. Expected number with unit (dp, sp, px).`);
            }
            return value;
        }

        const num = parseFloat(match[1]);
        const unit = match[2];

        if (isNaN(num)) {
            LogManager.e(this.TAG, `Parser error: '${value}' resulted in NaN.`);
            return '0px';
        }

        switch (unit) {
            case 'dp':
            case 'dip':
                return `${num * this.density}px`;
            case 'sp':
                return `${num * this.density}px`; // Simplified for preview
            case 'px':
                return `${num}px`;
            default:
                // Android requires units usually, treating no-unit as px here so warning is ok
                LogManager.v(this.TAG, `Value '${value}' has no unit. Treating as px.`);
                return `${num}px`;
        }
    }
}