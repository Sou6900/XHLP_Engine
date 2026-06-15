const fs = acode.require('fs');
import { LogManager } from '../core/LogManager.js';
import { StyleParser } from '../parsers/StyleParser.js';
import { ManifestParser } from '../parsers/ManifestParser.js';
import { ThemeResolver } from './ThemeResolver.js';
import { XmlParser } from '../parsers/XmlParser.js';
import { DrawableLoader } from '../drawables/DrawableLoader.js';
import { StateListDrawable } from '../drawables/StateListDrawable.js';
import { StringParser } from '../parsers/StringParser.js';
import { ColorParser } from '../parsers/ColorParser.js';
import { DimenParser } from '../parsers/DimenParser.js';

import { SystemDrawables } from '../drawables/defaults/SystemDrawables.js';

/**
 * ResourceResolver
 * Responsible for loading strings, colors, dimens, styles, and drawables.
 */
export class ResourceResolver {
    constructor(projectContext) {
        this.context = projectContext;
        this.TAG = 'ResourceResolver';
        
        // Resource Storage
        this.strings = new Map();
        this.colors = new Map();
        this.dimens = new Map();
        this.drawables = new Map();

        // Tools
        this.parser = new XmlParser(); // For layout parsing (AST)
        this.domParser = new DOMParser(); // For resource parsing (DOM)
        
        // Specialized Parsers
        this.stringParser = new StringParser();
        this.colorParser = new ColorParser();
        this.dimenParser = new DimenParser();
        this.styleParser = new StyleParser();
        this.manifestParser = new ManifestParser();
        this.drawableLoader = new DrawableLoader();
        
        // Theme & Drawables
        this.themeResolver = new ThemeResolver(this.styleParser, this);
        this.stateListDrawable = new StateListDrawable(this);

        // Basic Android System Colors Map
        this.systemColors = {
            'white': '#FFFFFF',
            'black': '#000000',
            'transparent': 'transparent',
            'background_dark': '#000000',
            'background_light': '#FFFFFF',
            'darker_gray': '#AAAAAA',
            'holo_red_dark': '#cc0000',
            'holo_red_light': '#ff4444',
            'holo_blue_light': '#33b5e5',
            'holo_green_light': '#99cc00',
            'holo_orange_light': '#ffbb33',
            'primary_material_dark': '#212121',
            'primary_material_light': '#efefef'
        };
    }

    /**
     * Entry point to load all XML resources into memory
     */
    async loadResources() {
        const resPath = this.context.getResourcePath();
        const projectRoot = this.context.projectRoot;

        LogManager.d(this.TAG, `Starting resource load. Root: ${projectRoot}`);

        if (!resPath) {
            LogManager.e(this.TAG, "No resource path found. Check project structure.");
            return;
        }

        // 1. Load Strings
        const stringDoc = await this._loadXmlDoc(`${resPath}/values/strings.xml`);
        if (stringDoc) {
            this.strings = this.stringParser.parse(stringDoc);
            LogManager.v(this.TAG, `Loaded ${this.strings.size} strings.`);
        }

        // 2. Load Colors
        const colorDoc = await this._loadXmlDoc(`${resPath}/values/colors.xml`);
        if (colorDoc) {
            this.colors = this.colorParser.parse(colorDoc);
            LogManager.v(this.TAG, `Loaded ${this.colors.size} colors.`);
        }

        // 3. Load Dimens
        const dimenDoc = await this._loadXmlDoc(`${resPath}/values/dimens.xml`);
        if (dimenDoc) {
            this.dimens = this.dimenParser.parse(dimenDoc);
            LogManager.v(this.TAG, `Loaded ${this.dimens.size} dimens.`);
        }

        // 4. Load Styles
        await this.styleParser.parse(resPath);

        // 5. Theme
        let theme = await this.manifestParser.getAppTheme(projectRoot);
        
        let cleanTheme = theme ? theme.replace('@style/', '') : null;
        
        const availableStyles = this.styleParser.getStyleNames();
        
        if (!cleanTheme || !availableStyles.includes(cleanTheme)) {
            LogManager.i(this.TAG, `Manifest theme '${theme}' not found in styles. Searching for alternatives...`);
            
            // Common theme names to look for
            const candidates = ['Theme.App', 'AppTheme', 'Base.Theme.App', 'Theme.MaterialComponents.DayNight.NoActionBar'];
            
            let found = null;
            for (const c of candidates) {
                if (availableStyles.includes(c)) {
                    found = c;
                    break;
                }
            }
            
            // Last resort: take the first style that looks like a theme
            if (!found) {
                found = availableStyles.find(s => s.startsWith('Theme.')) || availableStyles[0];
            }
            
            if (found) {
                LogManager.i(this.TAG, `Auto-detected theme: ${found}`);
                theme = found;
            }
        }

        if (theme) {
            this.themeResolver.setTheme(theme);
        } else {
            LogManager.w(this.TAG, "No suitable theme found in styles.xml. Using system defaults.");
        }

        LogManager.i(this.TAG, `Resource loading complete. Strings: ${this.strings.size}, Colors: ${this.colors.size}, Dimens: ${this.dimens.size}`);
    }

    /**
     * Helper to load and parse XML file to DOM
     */
    async _loadXmlDoc(path) {
        try {
            const exists = await fs(path).exists().catch(() => false);
            if (!exists) {
                LogManager.v(this.TAG, `File not found (optional): ${path}`);
                return null;
            }

            const content = await fs(path).readFile('utf-8');
            if (!content) return null;

            return this.domParser.parseFromString(content, "text/xml");
        } catch (e) {
            LogManager.w(this.TAG, `Failed to load ${path}: ${e.message}`);
            return null;
        }
    }

    /**
     * Resolves @string/ references
     */
    resolveString(val) {
        if (!val || typeof val !== 'string' || !val.startsWith('@string/')) return val;
        const name = val.replace('@string/', '');
        const res = this.strings.get(name);
        if (!res) {
            LogManager.w(this.TAG, `String resource not found: @string/${name}`);
            return val;
        }
        return res;
    }

    /**
     * Resolves @dimen/ references (e.g. @dimen/margin_small -> 8dp)
     */
    resolveDimen(val) {
        if (!val || typeof val !== 'string' || !val.startsWith('@dimen/')) return val;
        const name = val.replace('@dimen/', '');
        const res = this.dimens.get(name);
        if (!res) {
            LogManager.w(this.TAG, `Dimen resource not found: @dimen/${name}`);
            return val;
        }
        return res;
    }

    /**
     * Resolves colors, hex codes, system colors, and theme attributes (?attr/)
     */
    resolveColor(val) {
        if (!val) return 'transparent';
        let color = val;

        // 1. Theme Attributes
        // if (color.startsWith('?')) {
        //     color = this.themeResolver.resolveAttribute(color);
        // }
        
        if (color.startsWith('?')) {
            const resolved = this.themeResolver.resolveAttribute(color);
            // fallback if theme fails
            if (!resolved && color.includes('colorPrimary')) return '#6200EE'; 
            if (!resolved && color.includes('colorOnSurface')) return '#000000';
            if (!resolved && color.includes('statusBarColor')) return '#3700B3';
            
            color = resolved || '#FF0000'; // for error
        }

        // 2. System Colors
        else if (color.startsWith('@android:color/')) {
            const name = color.replace('@android:color/', '');
            color = this.systemColors[name] || '#000000';
        }

        // 3. Project Colors
        else if (color.startsWith('@color/')) {
            const name = color.replace('@color/', '');
            let resolved = this.colors.get(name);
            let depth = 0;
            
            // Handle recursive references (@color/a -> @color/b -> #FFF)
            while (resolved && resolved.startsWith('@color/') && depth < 3) {
                resolved = this.colors.get(resolved.replace('@color/', ''));
                depth++;
            }
            
            if (!resolved) {
                LogManager.w(this.TAG, `Color resource not found: @color/${name}. Using gray fallback.`);
                color = '#a4a4a4'; // grey color
            } else {
                color = resolved;
            }
        }

        // 4. Format Normalization 
        // If color is a 9-digit hex (e.g., #88000000), convert Android alpha-first to CSS alpha-Last
        if (color && color.startsWith('#') && color.length === 9) {
            const alpha = color.substring(1, 3); // Get AA
            const rgb = color.substring(3);      // Get RRGGBB
            return `#${rgb}${alpha}`;            // Return #RRGGBBAA
        }

        return color;
    }

    /**
     * Resolves @drawable/ references
     * Priority:
     * 1. In-Memory Cache
     * 2. User Project File (res/drawable/xxx.xml)
     * 3. System Defaults (Built-in SVGs)
     */
    async resolveDrawable(drawableName) {
        if (!drawableName || typeof drawableName !== 'string') return null;

        // Clean the name
        // Supports: @drawable/icon, @android:drawable/icon
        const name = drawableName
            .replace('@drawable/', '')
            .replace('@android:drawable/', '')
            .replace('android:drawable/', '');

        // 1. Check Cache
        if (this.drawables.has(name)) {
            // LogManager.v(this.TAG, `Drawable hit cache: ${name}`);
            return this.drawables.get(name);
        }

        // 2. Check User Project Files (Overrides System)
        try {
            const result = await this.context.getDrawable(name);
            
            if (result) {
                // Case 1: Bitmap Image (PNG, JPG, WEBP)
                if (result.type === 'bitmap') {
                    const drawable = { type: 'bitmap', value: result.content };
                    this.drawables.set(name, drawable);
                    LogManager.v(this.TAG, `Resolved Bitmap Drawable: ${name}`);
                    return drawable;
                }

                // Case 2: XML Drawable (Vector, Shape, Selector)
                if (result.type === 'xml') {
                    const ast = this.parser.parse(result.content);
                    if (!ast) return null;

                    if (ast.type === 'selector') {
                        const selector = await this.stateListDrawable.process(ast);
                        if (selector) {
                            this.drawables.set(name, selector);
                            LogManager.v(this.TAG, `Resolved StateListDrawable (Selector): ${name}`);
                            return selector;
                        }
                    }

                    const processed = this.drawableLoader.process(ast);
                    if (processed) {
                        this.drawables.set(name, processed);
                        LogManager.v(this.TAG, `Resolved XML Drawable: ${name}`);
                        return processed;
                    }
                }
            }
        } catch (e) {
            LogManager.e(this.TAG, `Error resolving drawable '${name}': ${e.message}`);
        }

        // 3. Check System Defaults (Fallback)
        // If not found in user files, check built-in system map
        if (SystemDrawables[name]) {
            LogManager.i(this.TAG, `Using system drawable for: ${name}`);
            const systemDrawable = { type: 'svg', value: SystemDrawables[name] };
            this.drawables.set(name, systemDrawable); // Cache it
            return systemDrawable;
        }

        LogManager.e(this.TAG, `Drawable not found: ${name} (Checked user files & system defaults)`);
        return null;
    }
    
    async getXml(resRef) {
        if (!resRef || !resRef.startsWith('@xml/')) return null;
        return await this.context.getXml(resRef);
    }
}