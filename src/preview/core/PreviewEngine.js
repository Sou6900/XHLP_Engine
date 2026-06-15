import { ProjectContext } from './ProjectContext.js';
import { XmlParser } from '../parsers/XmlParser.js';
import { ResourceResolver } from '../resolvers/ResourceResolver.js';
import { ViewFactory } from '../renderers/ViewFactory.js'; 
import { MenuInflater } from '../parsers/MenuInflater.js'; 
import { LogManager } from './LogManager.js';

export class PreviewEngine {
    constructor() {
        this.context = new ProjectContext();
        this.parser = new XmlParser();
        this.resolver = new ResourceResolver(this.context);
        this.viewFactory = new ViewFactory(this.resolver);
        this.menuInflater = new MenuInflater(this.resolver);
        
        // System Start Log
        LogManager.i('Zygote', 'Process com.android.preview started');
        LogManager.d('PreviewEngine', 'Engine instance created.');
    }

    async init(fileUri) {
        const startTime = Date.now();
        LogManager.i('ActivityThread', `Initializing context for: ${fileUri}`);
        
        try {
            await this.context.initialize(fileUri);
            LogManager.d('ResourcesManager', 'Project context initialized.');
            
            await this.resolver.loadResources();
            LogManager.i('ResourcesManager', `Resources loaded successfully in ${Date.now() - startTime}ms`);
        } catch (e) {
            LogManager.e('ResourcesManager', `Failed to load resources: ${e.message}`);
        }
    }

    async render(xmlContent, width, height) {
        // Start of a frame render
        LogManager.v('Choreographer', 'Frame started.');
        LogManager.d('ViewRootImpl', `Surface configuration changed: ${width}x${height}`);

        try {
            // 1. Parsing Phase
            const parseStart = Date.now();
            const ast = this.parser.parse(xmlContent);
            
            if (!ast) {
                throw new Error("XML Parser returned null AST");
            }
            LogManager.d('XmlParser', `XML parsed in ${Date.now() - parseStart}ms. Root: <${ast.type}>`);

            // 2. Menu vs Layout Detection
            if (ast.type === 'menu') {
                LogManager.i('MenuInflater', 'Detected menu resource. Inflating menu preview...');
                return await this._renderMenuPreview(ast, width, height);
            }

            // 3. System UI Attribute Extraction
            const getRootAttr = (name) => ast.attributes[name] || ast.attributes[`android:${name}`];
            const fitsAttr = getRootAttr('fitsSystemWindows');
            const isFullScreen = getRootAttr('windowFullscreen') === 'true' || fitsAttr === 'false';

            // Status Bar Color Resolution
            let statusBarColor = null;
            
            // Try to find status bar color override in XML
            this._findNodeById(ast, 'status_bar', (node) => {
                const bgAttr = node.attributes['background'] || node.attributes['android:background'];
                if (bgAttr) {
                    statusBarColor = this.resolver.resolveColor(bgAttr);
                    LogManager.v('PhoneWindow', `Status bar color overridden by view: ${statusBarColor}`);
                }
            });

            // Default resolution
            if (!statusBarColor) {
                const colorPrimaryDark = this.resolver.resolveColor('?attr/colorPrimaryDark');
                statusBarColor = this.resolver.resolveColor('?android:attr/statusBarColor') || colorPrimaryDark;
                LogManager.v('PhoneWindow', `Resolved status bar color: ${statusBarColor || 'Default'}`);
            }

            // 4. Inflation & Rendering Phase
            LogManager.i('LayoutInflater', `Inflating layout hierarchy...`);
            const renderStart = Date.now();
            
            const html = await this._renderNode(ast, 'Root', width, height, {});
            
            LogManager.i('ViewRootImpl', `Draw finished in ${Date.now() - renderStart}ms`);
            
            return { html, statusBarColor, isFullScreen, fitsSystemWindows: fitsAttr }; 

        } catch (e) {
            // Crash Reporting style log
            LogManager.e('AndroidRuntime', `FATAL EXCEPTION: main`);
            LogManager.e('AndroidRuntime', `Process: com.android.preview, PID: ${Math.floor(Math.random() * 5000)}`);
            LogManager.e('AndroidRuntime', `Message: ${e.message}`);
            
            // Stack trace formatting
            if (e.stack) {
                const lines = e.stack.split('\n');
                lines.forEach(line => LogManager.e('AndroidRuntime', line.trim()));
            }

            return { 
                html: `<div style="color:#ff5555; padding:20px; font-family:monospace;">
                        <h3>Runtime Exception</h3>
                        <p>${e.message}</p>
                      </div>`, 
                statusBarColor: '#330000', 
                isFullScreen: false 
            };
        }
    }

    /**
    * Creates a virtual Toolbar layout to display the menu
    */
    async _renderMenuPreview(menuAst, width, height) {
        LogManager.d('MenuInflater', `Parsing menu items...`);
        const menuItems = this.menuInflater.parse(menuAst);
        LogManager.v('MenuInflater', `Found ${menuItems.length} menu items.`);

        const syntheticRoot = {
            type: 'ConstraintLayout',
            attributes: {
                'android:layout_width': 'match_parent',
                'android:layout_height': 'match_parent',
                'android:background': '#FFFFFF'
            },
            children: [
                {
                    type: 'Toolbar',
                    attributes: {
                        'android:id': '@+id/preview_toolbar',
                        'android:layout_width': 'match_parent',
                        'android:layout_height': 'wrap_content',
                        'android:background': '?attr/colorPrimary',
                        'android:title': 'Menu Preview',
                        'android:subtitle': 'Action Bar',
                        'app:titleTextColor': '#FFFFFF',
                        'android:elevation': '4dp',
                        'app:layout_constraintTop_toTopOf': 'parent'
                    },
                    children: [],
                    menuItems: menuItems
                },
                {
                    type: 'TextView',
                    attributes: {
                        'android:layout_width': 'wrap_content',
                        'android:layout_height': 'wrap_content',
                        'android:text': 'Menu Preview Mode',
                        'android:textColor': '#888888',
                        'app:layout_constraintStart_toStartOf': 'parent',
                        'app:layout_constraintEnd_toEndOf': 'parent',
                        'app:layout_constraintTop_toBottomOf': '@+id/preview_toolbar',
                        'app:layout_constraintBottom_toBottomOf': 'parent'
                    }
                }
            ]
        };

        const html = await this._renderNode(syntheticRoot, 'Root', width, height, {});
        return { html, statusBarColor: '#3700B3', isFullScreen: false, fitsSystemWindows: true };
    }

    async _renderNode(node, parentType, availableW, availableH, context = {}) {
        if (!node) return '';
        
        const attr = node.attributes || {};
        const getAttr = (k) => attr[k] || attr[`android:${k}`];
        
        // Layout Direction Handling
        const explicitDir = getAttr('layoutDirection');
        const currentDir = explicitDir || context.layoutDirection || 'ltr';

        if (explicitDir) {
            LogManager.d('View', `Changing layout direction to: ${explicitDir}`);
        }

        if (!explicitDir) {
            if (!node.attributes) node.attributes = {};
            node.attributes['android:layoutDirection'] = currentDir;
        }

        const nextContext = { ...context, layoutDirection: currentDir };
        
        // Attempt to create renderer
        const renderer = this.viewFactory.create(node.type);
        
        if (!renderer) {
            LogManager.w('LayoutInflater', `ClassNotFoundException: Could not find class ${node.type}. Using fallback.`);
            return `<div style="border:1px dashed red; padding:10px; color:red;">ClassNotFound: ${node.type}</div>`;
        }

        // Log inflation
        const viewId = getAttr('id') || 'NO_ID';
        LogManager.v('LayoutInflater', `Inflating: ${node.type} (id: ${viewId})`);

        const isLayout = this.viewFactory.isViewGroup(renderer);

        if (isLayout) {
            const renderChild = async (child, pType, overrideW, overrideH) => 
                await this._renderNode(child, pType, overrideW || availableW, overrideH || availableH, nextContext);

            if (typeof renderer.renderWithBounds === 'function') {
                return await renderer.renderWithBounds(node, availableW, availableH, renderChild, parentType);
            }
            return await renderer.render(node, renderChild, parentType);
        } 
        else {
            if (renderer.constructor.name === 'RecyclerView') {
                LogManager.d('RecyclerView', 'Binding adapter for preview...');
                renderer.renderSubLayout = async (xmlString) => {
                    const itemAst = this.parser.parse(xmlString);
                    return await this._renderNode(itemAst, 'ViewGroup', availableW, availableH, nextContext);
                };
            }
            return await renderer.render(node, parentType);
        }
    }
    
    _findNodeById(node, id, callback) {
        if (!node) return;
        const nodeId = node.attributes?.id || node.attributes?.['android:id'];
        if (nodeId && (nodeId === `@+id/${id}` || nodeId === `@id/${id}`)) {
            callback(node);
        }
        if (node.children) {
            node.children.forEach(child => this._findNodeById(child, id, callback));
        }
    }
}
