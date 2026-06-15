// ViewFactory.js
import { LogManager } from '../core/LogManager.js';

import { View } from './widgets/View.js';
import { TextView } from './widgets/TextView.js';
import { Button } from './widgets/Button.js';
import { ImageView } from './widgets/ImageView.js';
import { EditText } from './widgets/EditText.js';
import { ProgressBar } from './widgets/ProgressBar.js';
import { RecyclerView } from './widgets/RecyclerView.js';
import { ScrollView } from './widgets/ScrollView.js';
import { NestedScrollView } from './widgets/NestedScrollView.js';
import { HorizontalScrollView } from './widgets/HorizontalScrollView.js';
import { SeekBar } from './widgets/SeekBar.js';
import { CheckBox } from './widgets/CheckBox.js';
import { Space } from './widgets/Space.js';
import { Barrier } from './widgets/Barrier.js';
import { Guideline } from './widgets/Guideline.js';
import { Group } from './widgets/Group.js';
import { Flow } from './widgets/Flow.js';
import { Layer } from './widgets/Layer.js';
import { Placeholder } from './widgets/Placeholder.js';
import { Switch } from './widgets/Switch.js';
import { Toolbar } from './layouts/Toolbar.js';
import { ActionMenuItemView } from './widgets/ActionMenuItemView.js';
import { FloatingActionButton } from './widgets/FloatingActionButton.js';

// Layouts
import { LinearLayout } from './layouts/LinearLayout.js';
import { FrameLayout } from './layouts/FrameLayout.js';
import { ConstraintLayout } from './layouts/ConstraintLayout.js';
import { CardView } from './layouts/CardView.js'; // CardView is a FrameLayout
import { RelativeLayout } from './layouts/RelativeLayout.js';
import { ViewFlipper } from './layouts/ViewFlipper.js'; 
import { GridLayout } from './layouts/GridLayout.js'; 
import { DrawerLayout } from './layouts/DrawerLayout.js';
import { NavigationView } from './layouts/NavigationView.js'; 
import { MotionLayout } from './layouts/MotionLayout.js';
import { AppBarLayout } from './layouts/AppBarLayout.js';
import { CoordinatorLayout } from './layouts/CoordinatorLayout.js';
import { CollapsingToolbarLayout } from './layouts/CollapsingToolbarLayout.js';

// Base
import { ViewGroup } from './widgets/ViewGroup.js';

export class ViewFactory {
    constructor(resolver) {
        this.resolver = resolver;
        this.registry = new Map();
        
        const TAG = 'ViewFactory';
        LogManager.d(TAG, 'Initializing ViewFactory...');
        
        this._initRegistry();
        
        LogManager.i(TAG, `Registry initialized. Total registered components: ${this.registry.size}`);
    }

    _initRegistry() {
      
        /* ==========================
        Register Widgets
        ============================ */
        
        this.register('View', new View(this.resolver));
        this.register('TextView', new TextView(this.resolver));
        this.register('Button', new Button(this.resolver));
        this.register('ImageView', new ImageView(this.resolver));
        this.register('EditText', new EditText(this.resolver));

        // ScrollView
        this.register('ScrollView', new ScrollView(this.resolver));
        
        // NestedScrollView
        const nestedScroll = new NestedScrollView(this.resolver);
        this.register('NestedScrollView', nestedScroll);
        this.register('androidx.core.widget.NestedScrollView', nestedScroll);
        
        // ProgressBar
        this.register('ProgressBar', new ProgressBar(this.resolver));
        this.register('android.widget.ProgressBar', new ProgressBar(this.resolver));
        
        // SeekBar
        const seekbar = new SeekBar(this.resolver);
        this.register('SeekBar', seekbar);
        this.register('android.widget.SeekBar', seekbar);
        this.register('androidx.appcompat.widget.AppCompatSeekBar', seekbar);
        
        // CheckBox
        const checkbox = new CheckBox(this.resolver);
        this.register('CheckBox', checkbox);
        this.register('android.widget.CheckBox', checkbox);
        this.register('androidx.appcompat.widget.AppCompatCheckBox', checkbox);
        
        // Switch
        const switchWidget = new Switch(this.resolver);
        this.register('Switch', switchWidget);
        this.register('android.widget.Switch', switchWidget);
        this.register('androidx.appcompat.widget.SwitchCompat', switchWidget);
        this.register('com.google.android.material.switchmaterial.SwitchMaterial', switchWidget);
        
        // Toolbar
        const toolbar = new Toolbar(this.resolver);
        this.register('Toolbar', toolbar);
        this.register('androidx.appcompat.widget.Toolbar', toolbar);
        this.register('com.google.android.material.appbar.MaterialToolbar', toolbar);
        
        
        // ≡≡≡≡≡≡HELPERS≡≡≡≡≡≡≡
        
        // Space
        const space = new Space(this.resolver);
        this.register('Space', space);
        this.register('android.widget.Space', space);
        
        // Barrier
        const barrier = new Barrier(this.resolver);
        this.register('Barrier', barrier);
        this.register('androidx.constraintlayout.widget.Barrier', barrier);
        
        // Guideline
        const guide = new Guideline(this.resolver);
        this.register('Guideline', guide);
        this.register('androidx.constraintlayout.widget.Guideline', guide);
        
        // Group
        const group = new Group(this.resolver);
        this.register('Group', group);
        this.register('androidx.constraintlayout.widget.Group', group);
        
        // Flow
        const flow = new Flow(this.resolver);
        this.register('Flow', flow);
        this.register('androidx.constraintlayout.helper.widget.Flow', flow);
        
        //  Layer
        const layer = new Layer(this.resolver);
        this.register('Layer', layer);
        this.register('androidx.constraintlayout.helper.widget.Layer', layer);
        
        // Placeholder
        const placeholder = new Placeholder(this.resolver);
        this.register('Placeholder', placeholder);
        this.register('androidx.constraintlayout.widget.Placeholder', placeholder);
        

        /* ========================
        Register Layouts 
        =========================== */
        
        // RecyclerView
        const recycler = new RecyclerView(this.resolver);
        this.register('RecyclerView', recycler);
        this.register('androidx.recyclerview.widget.RecyclerView', recycler);
        
        // LinearLayout
        this.register('LinearLayout', new LinearLayout(this.resolver));
        
        // FrameLayout
        this.register('FrameLayout', new FrameLayout(this.resolver));
        
        // ConstraintLayout (Supports native & androidx)
        const constraint = new ConstraintLayout(this.resolver);
        this.register('ConstraintLayout', constraint);
        this.register('androidx.constraintlayout.widget.ConstraintLayout', constraint);

        // Horizontal Scrollview
        const hScroll = new HorizontalScrollView(this.resolver);
        this.register('HorizontalScrollView', hScroll);
        this.register('android.widget.HorizontalScrollView', hScroll);

        // CardView (Supports native & androidx)
        const card = new CardView(this.resolver);
        this.register('CardView', card);
        this.register('androidx.cardview.widget.CardView', card);
        this.register('com.google.android.material.card.MaterialCardView', card);
        
        // RelativeLayout
        this.register('RelativeLayout', new RelativeLayout(this.resolver));
        
        // GridLayout
        const gridLayout = new GridLayout(this.resolver);
        this.register('GridLayout', gridLayout);
        this.register('android.widget.GridLayout', gridLayout);
        
        // ViewFlipper
        const flipper = new ViewFlipper(this.resolver);
        this.register('ViewFlipper', flipper);
        this.register('android.widget.ViewFlipper', flipper);
        this.register('AdapterViewFlipper', flipper);
        
        // DrawerLayout
        const drawer = new DrawerLayout(this.resolver);
        this.register('DrawerLayout', drawer);
        this.register('androidx.drawerlayout.widget.DrawerLayout', drawer);

        // NavigationView
        const nav = new NavigationView(this.resolver);
        this.register('NavigationView', nav);
        this.register('com.google.android.material.navigation.NavigationView', nav);
        
        this.register('ActionMenuItemView', new ActionMenuItemView(this.resolver));
        
        // MotionLayout
        const motion = new MotionLayout(this.resolver);
        this.register('MotionLayout', motion);
        this.register('androidx.constraintlayout.motion.widget.MotionLayout', motion);
        
        // Coordinator Layout
        const coordinator = new CoordinatorLayout(this.resolver);
        this.register('CoordinatorLayout', coordinator);
        this.register('androidx.coordinatorlayout.widget.CoordinatorLayout', coordinator);

        // Material App Bar
        const appBar = new AppBarLayout(this.resolver);
        this.register('AppBarLayout', appBar);
        this.register('com.google.android.material.appbar.AppBarLayout', appBar);

        // Collapsing Toolbar
        const collapsing = new CollapsingToolbarLayout(this.resolver);
        this.register('CollapsingToolbarLayout', collapsing);
        this.register('com.google.android.material.appbar.CollapsingToolbarLayout', collapsing);

        // Floating Action Button
        const fab = new FloatingActionButton(this.resolver);
        this.register('FloatingActionButton', fab);
        this.register('com.google.android.material.floatingactionbutton.FloatingActionButton', fab);
        
    }

    register(name, instance) {
        this.registry.set(name, instance);
    }

    /**
     * Get a renderer instance for a given tag name
     * @param {string} tagName - XML tag name (e.g. 'TextView', 'LinearLayout')
     * @returns {BaseView|ViewGroup} The renderer instance
     */
    create(tagName) {
        const TAG = 'ViewFactory';

        // Clean tag name (remove packages if needed, though we registered full names too)
        let type = tagName;
        if (type.includes('.') && !this.registry.has(type)) {
            type = type.split('.').pop();
        }

        const renderer = this.registry.get(type);
        
        if (!renderer) {
            LogManager.w(TAG, `⚠️ ClassNotFound: '${tagName}' is not registered. Substituting with base 'View'.`);
            
            // Return a default View to prevent crash, or null to show error box
            return this.registry.get('View'); 
        }
        
        LogManager.v(TAG, `Inflating view: <${tagName}> using renderer: ${renderer.constructor.name}`);

        return renderer;
    }

    /**
     * Check if a renderer is a Layout
     */
    isViewGroup(renderer) {
        return renderer instanceof ViewGroup || 
               renderer instanceof LinearLayout || 
               renderer instanceof FrameLayout || 
               renderer instanceof ConstraintLayout ||
               renderer instanceof ScrollView ||
               renderer instanceof HorizontalScrollView ||
               renderer instanceof CardView ||
               renderer instanceof RelativeLayout ||
               renderer instanceof GridLayout ||
               renderer instanceof ViewFlipper ||
               renderer instanceof DrawerLayout ||
               renderer instanceof NavigationView ||
               renderer instanceof MotionLayout ||
               renderer instanceof CoordinatorLayout ||
               renderer instanceof AppBarLayout ||
               renderer instanceof CollapsingToolbarLayout ||
               renderer instanceof NestedScrollView;
    }
}