
<h2 style="display:flex;align-items:center;"><img src="https://i.postimg.cc/90GBfjqH/Picsart-26-02-09-16-34-46-662.png" alt="Colors Icon" style="width:40px;margin-right:10px;"> XHLP 1.0 : Android XML Layout Preview Engine </h2>

A comprehensive, client-side rendering engine designed to parse, calculate, and visualize Android XML layouts within a web-based environment. This system replicates key portions of the Android UI framework, including the complex measurement and layout passes required for `ConstraintLayout` and `MotionLayout`.

---


## Overview

This plugin based on **XHLP 1.0** that's Android Xml previewer & All features of  **Android Builder** is Available in this plugin with more customization.

⚠️ **Note:** This is currently a **Experiment Version**. You might encounter some bugs or stability issues as we continue to improve the core engine.

✅ **Future Target** Edit XML from UI

✅ **Installation** After installation , go to setting of this plugin and export plugin.zip after exporting install in Fdroid version of Acode (For Apk/Abb) build purpuse 

✅ **XHLP Engine :** This doesn't require any setup , go to direct android folder search for .xml (eg: activity_main.xml) and preview 

❌ **Uninstall** Uninstall `Android Builder` plugin  Before installing this plugin

---

## Preview sample

---


<center>
<div style="display:flex;overflow:auto; gap:8px;">

  <img src="https://i.postimg.cc/qqLjLTBR/Screenshot-2026-02-09-15-17-05-89-a2cf8efcdd42a8e6f7906303f104fb67.jpg" alt="Android Builder Demo 3" style="width:400px;border-radius:5px;">
  
</center>
---

## ❓ Features

0. `XHLP 1.0 Engine` Live Android Xml preview 
1. Enhanced `Android Builder` and it's features with customization

## 🤔  How to Use XHLP Or Preview XML

0. **Open** Android Project
1. Choose xml file like `activity_main.xml`
2. Click on Top Icon 
3. After once preview just switch Xml file -> Preview Tab insted of clicking icon
4. ⚠️ Again repeating : Once you open preview don't close that tab [switch .xml & then open preview tab] , if you close then you have to restart Acode for load engine again Otherwise some features may not work properly 

---

## System Overview

This engine operates by parsing raw Android XML resources and converting them into a DOM structure styled dynamically via JavaScript. It features a custom-built constraint solver, a resource resolution system for handling Android-specific references, and a dual-mode rendering pipeline (Design and Blueprint).

<img src="https://i.postimg.cc/bNc7j0Kd/Picsart-26-02-09-22-13-40-837.jpg" alt="Colors Icon" style="width:400px;margin-right:10px;">

### Core Capabilities

* **XML Parsing & DOM Construction:** Converts Android XML hierarchies into web-compatible DOM elements while maintaining attribute integrity.
* **Resource Resolution:** Resolves Android resource references including `@string`, `@color`, `@dimen`, and `@style`. It supports basic theme attribute resolution (`?attr`).
* **Drawable Rendering:** Support for complex Android drawables, including:
* `VectorDrawable` (XML to SVG conversion)
* `ShapeDrawable` (Gradients, corners, strokes)
* `StateListDrawable` (Selector logic)


* **Density Conversion:** Automatic pixel-to-dp conversion based on configurable device density buckets (mdpi, hdpi, xhdpi, etc.).

### Layout Systems

The engine implements distinct logic for measuring and positioning views based on their parent layout type:

* **ConstraintLayout System:** A fully implemented algebraic solver that supports:
* Relative positioning (Start/End, Top/Bottom).
* Chains (Spread, Packed, Spread Inside).
* Guidelines (Vertical/Horizontal, Percent/Dimension).
* Barriers (Dynamic referencing).
* Bias settings and Dimension ratios.
* Circular positioning.


* **Linear & Relative Systems:** Logic for `weight` distribution in linear containers and dependency graph resolution for relative positioning.
* **MotionLayout Support:** Parses `MotionScene` files to handle state transitions and constraint sets, enabling animation previews.

### Widget Support

The engine includes a library of renderers for standard Android UI components, ensuring accurate visual representation of attributes:

* **Basic Inputs & Controls:** Full support for `TextView`, `Button`, `EditText`, `CheckBox`, `Switch`, `SeekBar`, and `ProgressBar`.
* **Media & Graphics:** Rendering logic for `ImageView` (supporting various scale types) and `ShapeDrawable` backgrounds.
* **Complex Containers:** Implementation of `ScrollView`, `HorizontalScrollView`, `CardView`, and `NavigationView`.
* **Collections:** Visual placeholders for `RecyclerView` to assist in list layout design.
* **Constraint Helpers:** Functional implementation of non-visual helper widgets including `Group`, `Flow`, `Layer`, and `Placeholder`.

### Visual Tooling

* **Blueprint Mode:** A technical view mode that visualizes the relationship between views. It renders constraint connections, spring/zigzag lines for loose connections, anchor points, and chain linkages using a dedicated SVG overlay layer.
* **Attribute Inspector:** A sidebar interface for inspecting selected view properties, layout parameters, and active constraints.
* **Constraint Widget:** A visual representation of margins, bias, and view dimensions (`wrap_content`, `match_parent`, `0dp`) for the selected element.
* **Logcat UI:** An integrated logging interface to display parsing errors, missing resources, and system warnings.

## Architecture

The project is structured into modular components to ensure separation of concerns:

* **Solvers:** Contains the mathematical logic for calculating view positions. This includes specialized calculators for flow, chains, and dimension estimation.
* **Parsers:** Responsible for reading raw XML content (Manifests, Layouts, Styles, Motion Scenes) and converting them into usable JavaScript objects.
* **Renderers:** Handles the drawing logic. This is split into core view rendering and blueprint/overlay rendering.
* **Resolvers:** Manages the linking of resources and attributes to the views.
* **UI Controls:** Manages the toolbar, zoom controls, device frame simulation, and user interaction events.

---

## Tests & Accuracy

**Pass Rate:** **95%+**
Tested against **300+ complex Android XML layouts**, including deeply nested `ConstraintLayout`s, RTL/LTR combinations, barriers, chains, flows, and edge-case constraint interactions.

**Accuracy:** **90% – 95% overall**
Accuracy is measured by comparing computed view geometry 

Remember This Engine not Always correct but maximum time perfect preview

Other tests waiting for you ❤️

---

## Component Support Status

The following metrics represent the current implementation maturity of specific Android components within this engine.

<table>
<tr>
<td width="200px"><strong>ConstraintLayout</strong></td>
<td width="100%">
<div style="background-color: #3c3c3c; width: 100%; height: 10px; border-radius: 5px;">
<div style="background-color: #4caf50; width: 92%; height: 100%; border-radius: 5px;"></div>
</div>
</td>
<td width="50px">92%</td>
</tr>
<tr>
<td width="200px"><strong>LinearLayout</strong></td>
<td>
<div style="background-color: #3c3c3c; width: 100%; height: 10px; border-radius: 5px;">
<div style="background-color: #4caf50; width: 95%; height: 100%; border-radius: 5px;"></div>
</div>
</td>
<td>95%</td>
</tr>
<tr>
<td width="200px"><strong>RelativeLayout</strong></td>
<td>
<div style="background-color: #3c3c3c; width: 100%; height: 10px; border-radius: 5px;">
<div style="background-color: #4caf50; width: 85%; height: 100%; border-radius: 5px;"></div>
</div>
</td>
<td>85%</td>
</tr>
<tr>
<td width="200px"><strong>MotionLayout</strong></td>
<td>
<div style="background-color: #3c3c3c; width: 100%; height: 10px; border-radius: 5px;">
<div style="background-color: #ff9800; width: 65%; height: 100%; border-radius: 5px;"></div>
</div>
</td>
<td>65%</td>
</tr>
<tr>
<td width="200px"><strong>Vector Drawables</strong></td>
<td>
<div style="background-color: #3c3c3c; width: 100%; height: 10px; border-radius: 5px;">
<div style="background-color: #2196f3; width: 80%; height: 100%; border-radius: 5px;"></div>
</div>
</td>
<td>80%</td>
</tr>
<tr>
<td width="200px"><strong>Resource Resolution</strong></td>
<td>
<div style="background-color: #3c3c3c; width: 100%; height: 10px; border-radius: 5px;">
<div style="background-color: #2196f3; width: 75%; height: 100%; border-radius: 5px;"></div>
</div>
</td>
<td>75%</td>
</tr>
<tr>
<td width="200px"><strong>Standard Widgets</strong></td>
<td>
<div style="background-color: #3c3c3c; width: 100%; height: 10px; border-radius: 5px;">
<div style="background-color: #4caf50; width: 88%; height: 100%; border-radius: 5px;"></div>
</div>
</td>
<td>88%</td>
</tr>
</table>

---

## Check XHLP engine :

 * [XHLP 1.0 - Look up it On Github](https://github.com/Sou6900/XHLP_Engine)

---

## License & Beta Access

*DATA NOT AVAILABLE*

---

## Contact & Community

At the moment, this plugin is not available as a free version or testing version

**Feedback ?** [Feedback here](https://acode.app/plugin/acode.plugin.androidbuilder/comments)
<br>
**Bugs ?** [Comment bugs](https://acode.app/plugin/acode.plugin.androidbuilder/comments)
<br>
**Telegram:** [Dev. Sou](https://t.me/sourav0chand)

> `acode.plugin.androidbuilder`
