// ThemeResolver.js
import { LogManager } from '../core/LogManager.js';

export class ThemeResolver {
    constructor(styleParser, resourceResolver) {
        this.styleParser = styleParser;
        this.resourceResolver = resourceResolver;
        this.currentThemeStyles = {};
        this.currentThemeName = '';
        this.TAG = 'ThemeResolver';
        
        // Mock System Themes (AppCompat Fallbacks)
        this.systemThemes = {
            'Theme.AppCompat.Light.NoActionBar': {
                'colorPrimary': '#6200EE',
                'colorPrimaryDark': '#3700B3',
                'colorAccent': '#03DAC5',
                'android:statusBarColor': '?attr/colorPrimaryDark',
                'android:windowBackground': '#FFFFFF'
            },
            'Theme.MaterialComponents.DayNight.NoActionBar': {
                'colorPrimary': '#6200EE',
                'colorPrimaryDark': '#3700B3',
                'colorAccent': '#03DAC5'
            }
        };
    }

    setTheme(themeName) {
        // Handle @style/ prefix
        const cleanName = themeName.replace('@style/', '');
        this.currentThemeName = cleanName;
        
        LogManager.i(this.TAG, `Setting active theme: ${cleanName}`);
        
        this.currentThemeStyles = this.resolveStyleHierarchy(cleanName);
        LogManager.v(this.TAG, `Theme resolved with ${Object.keys(this.currentThemeStyles).length} attributes.`);
    }

    resolveAttribute(attrReference) {
        if (!attrReference.startsWith('?')) return attrReference;

        // Remove ?attr/ or ?android:attr/
        let attrName = attrReference.replace('?attr/', '').replace('?android:attr/', '').replace('?', '');
        
        // Check both with and without 'android:' prefix
        let val = this.currentThemeStyles[attrName] || this.currentThemeStyles[`android:${attrName}`];
        
        if (val) {
             // If value is a reference (?attr/other or @color/purple), resolve recursively
             if (val.startsWith('?')) {
                 LogManager.v(this.TAG, `Recursive resolution: ${attrName} -> ${val}`);
                 return this.resolveAttribute(val);
             }
             return this.resourceResolver.resolveColor(val) || val;
        }
        
        // Android Studio style warning for missing attributes
        LogManager.w(this.TAG, `⚠️ Attribute '?attr/${attrName}' not found in theme '${this.currentThemeName}'.`);
        return null;
    }

    resolveStyleHierarchy(styleName) {
        if (!styleName) return {};

        // 1. Check User Styles
        const styleDef = this.styleParser.getStyle(styleName);
        
        // 2. Check System/Parent Fallback
        if (!styleDef) {
            if (this.systemThemes[styleName]) {
                LogManager.v(this.TAG, `Using system theme fallback for: ${styleName}`);
                return { ...this.systemThemes[styleName] };
            }
            LogManager.w(this.TAG, `Style definition not found: ${styleName}`);
            return {};
        }

        // 3. Recursive Parent Resolution
        let finalAttributes = {};
        if (styleDef.parent) {
            // Remove @style/ prefix from parent if exists
            const parentName = styleDef.parent.replace('@style/', '');
            finalAttributes = this.resolveStyleHierarchy(parentName);
        } else if (styleName.includes('.')) {
            // Implicit Inheritance (Theme.App -> Theme)
            const parentName = styleName.substring(0, styleName.lastIndexOf('.'));
            // Avoid infinite loops if parent is same
            if (parentName !== styleName) {
                finalAttributes = this.resolveStyleHierarchy(parentName);
            }
        }

        // 4. Merge Current Attributes
        Object.assign(finalAttributes, styleDef.items);
        return finalAttributes;
    }
}