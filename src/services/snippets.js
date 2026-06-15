// snippets.js

export const javaSnippets = [
    // --- BASIC & I/O ---
    {
      "caption": "psvm",
      "snippet": "public static void main(String[] args) {\n    ${1:/* code */}\n}",
      "meta": "snippet"
    },
    {
      "caption": "sout",
      "snippet": "System.out.println(${1:\"msg\"});",
      "meta": "snippet"
    },
    {
      "caption": "souf",
      "snippet": "System.out.printf(\"${1:%s}\", ${2:var});",
      "meta": "snippet"
    },
    {
      "caption": "soutv",
      "snippet": "System.out.println(\"${1:var} = \" + ${1:var});",
      "meta": "snippet"
    },

    // --- LOOPS & CONDITIONS ---
    {
      "caption": "for",
      "snippet": "for (int ${1:i} = 0; ${1:i} < ${2:count}; ${1:i}++) {\n    ${3}\n}",
      "meta": "snippet"
    },
    {
      "caption": "foreach",
      "snippet": "for (${1:Type} ${2:item} : ${3:collection}) {\n    ${4}\n}",
      "meta": "snippet"
    },
    {
      "caption": "if",
      "snippet": "if (${1:condition}) {\n    ${2}\n}",
      "meta": "snippet"
    },
    {
      "caption": "ifelse",
      "snippet": "if (${1:condition}) {\n    ${2}\n} else {\n    ${3}\n}",
      "meta": "snippet"
    },
    {
      "caption": "while",
      "snippet": "while (${1:condition}) {\n    ${2}\n}",
      "meta": "snippet"
    },
    {
      "caption": "switch",
      "snippet": "switch (${1:key}) {\n    case ${2:value}:\n        ${3}\n        break;\n    default:\n        break;\n}",
      "meta": "snippet"
    },

    // --- OOP & CLASS STRUCTURE ---
    {
      "caption": "class",
      "snippet": "public class ${1:Name} {\n    ${2}\n}",
      "meta": "snippet"
    },
    {
      "caption": "interface",
      "snippet": "public interface ${1:Name} {\n    ${2}\n}",
      "meta": "snippet"
    },
    {
      "caption": "enum",
      "snippet": "public enum ${1:Name} {\n    ${2}\n}",
      "meta": "snippet"
    },
    {
      "caption": "method",
      "snippet": "public ${1:void} ${2:methodName}(${3:args}) {\n    ${4}\n}",
      "meta": "snippet"
    },
    {
      "caption": "prmethod",
      "snippet": "private ${1:void} ${2:methodName}(${3:args}) {\n    ${4}\n}",
      "meta": "snippet"
    },
    {
      "caption": "ctor",
      "snippet": "public ${1:ClassName}(${2:args}) {\n    ${3}\n}",
      "meta": "snippet"
    },

    // --- EXCEPTION HANDLING ---
    {
      "caption": "try",
      "snippet": "try {\n    ${1}\n} catch (${2:Exception} e) {\n    e.printStackTrace();\n}",
      "meta": "snippet"
    },
    {
      "caption": "tryf",
      "snippet": "try {\n    ${1}\n} catch (${2:Exception} e) {\n    e.printStackTrace();\n} finally {\n    ${3}\n}",
      "meta": "snippet"
    },
    {
      "caption": "throw",
      "snippet": "throw new ${1:RuntimeException}(\"${2:message}\");",
      "meta": "snippet"
    },

    // --- CONSTANTS & VARIABLES ---
    {
      "caption": "psf",
      "snippet": "public static finalString ${1:VAR_NAME} = \"${2:value}\";",
      "meta": "snippet"
    },
    {
      "caption": "psi",
      "snippet": "public static int ${1:VAR_NAME} = ${2:0};",
      "meta": "snippet"
    },

    // --- COLLECTIONS (খুব গুরুত্বপূর্ণ) ---
    {
      "caption": "list",
      "snippet": "List<${1:String}> ${2:list} = new ArrayList<>();",
      "meta": "snippet"
    },
    {
      "caption": "map",
      "snippet": "Map<${1:String}, ${2:String}> ${3:map} = new HashMap<>();",
      "meta": "snippet"
    },
    {
      "caption": "set",
      "snippet": "Set<${1:String}> ${2:set} = new HashSet<>();",
      "meta": "snippet"
    },

    // --- ANDROID SPECIFIC ---
    {
      "caption": "toast",
      "snippet": "Toast.makeText(${1:getApplicationContext()}, \"${2:text}\", Toast.LENGTH_SHORT).show();",
      "meta": "snippet"
    },
    {
      "caption": "logd",
      "snippet": "Log.d(\"${1:TAG}\", \"${2:message}\");",
      "meta": "snippet"
    },
    {
      "caption": "loge",
      "snippet": "Log.e(\"${1:TAG}\", \"${2:message}\", ${3:exception});",
      "meta": "snippet"
    },
    {
      "caption": "findview",
      "snippet": "${1:TextView} ${2:view} = findViewById(R.id.${3:id});",
      "meta": "snippet"
    },
    {
      "caption": "onclick",
      "snippet": "${1:view}.setOnClickListener(new View.OnClickListener() {\n    @Override\n    public void onClick(View v) {\n        ${2}\n    }\n});",
      "meta": "snippet"
    },
    {
      "caption": "intent",
      "snippet": "Intent intent = new Intent(${1:this}, ${2:TargetActivity}.class);\nstartActivity(intent);",
      "meta": "snippet"
    }
];

export const kotlinSnippets = [
    // --- MAIN & BASICS ---
    {
      "caption": "main",
      "snippet": "fun main() {\n    ${1}\n}",
      "meta": "snippet"
    },
    {
      "caption": "maina",
      "snippet": "fun main(args: Array<String>) {\n    ${1}\n}",
      "meta": "snippet"
    },
    {
      "caption": "pr",
      "snippet": "println(\"${1:text}\")",
      "meta": "snippet"
    },
    {
      "caption": "prv",
      "snippet": "println(\"${1:var} = $${1:var}\")",
      "meta": "snippet"
    },

    // --- VARIABLES & CONSTANTS ---
    {
      "caption": "val",
      "snippet": "val ${1:name} = ${2:value}",
      "meta": "snippet"
    },
    {
      "caption": "var",
      "snippet": "var ${1:name} = ${2:value}",
      "meta": "snippet"
    },
    {
      "caption": "lateinit",
      "snippet": "lateinit var ${1:name}: ${2:Type}",
      "meta": "snippet"
    },
    {
      "caption": "lazy",
      "snippet": "val ${1:name}: ${2:Type} by lazy {\n    ${3}\n}",
      "meta": "snippet"
    },
    {
      "caption": "const",
      "snippet": "const val ${1:NAME} = ${2:value}",
      "meta": "snippet"
    },

    // --- FUNCTIONS ---
    {
      "caption": "fun",
      "snippet": "fun ${1:name}(${2:params}): ${3:ReturnType} {\n    ${4}\n}",
      "meta": "snippet"
    },
    {
      "caption": "pfun",
      "snippet": "private fun ${1:name}(${2:params}) {\n    ${3}\n}",
      "meta": "snippet"
    },
    {
      "caption": "sfun",
      "snippet": "fun ${1:name}(${2:params}) = ${3:expression}",
      "meta": "snippet"
    },
    {
      "caption": "sus",
      "snippet": "suspend fun ${1:name}(${2:params}) {\n    ${3}\n}",
      "meta": "snippet"
    },

    // --- CLASSES & OBJECTS ---
    {
      "caption": "class",
      "snippet": "class ${1:Name} {\n    ${2}\n}",
      "meta": "snippet"
    },
    {
      "caption": "data",
      "snippet": "data class ${1:Name}(val ${2:prop}: ${3:Type})",
      "meta": "snippet"
    },
    {
      "caption": "enum",
      "snippet": "enum class ${1:Name} {\n    ${2:ENTRY}\n}",
      "meta": "snippet"
    },
    {
      "caption": "interface",
      "snippet": "interface ${1:Name} {\n    ${2}\n}",
      "meta": "snippet"
    },
    {
      "caption": "obj",
      "snippet": "object ${1:Name} {\n    ${2}\n}",
      "meta": "snippet"
    },
    {
      "caption": "comp",
      "snippet": "companion object {\n    ${1}\n}",
      "meta": "snippet"
    },
    {
      "caption": "init",
      "snippet": "init {\n    ${1}\n}",
      "meta": "snippet"
    },

    // --- CONTROL FLOW ---
    {
      "caption": "if",
      "snippet": "if (${1:condition}) {\n    ${2}\n}",
      "meta": "snippet"
    },
    {
      "caption": "ife",
      "snippet": "if (${1:condition}) {\n    ${2}\n} else {\n    ${3}\n}",
      "meta": "snippet"
    },
    {
      "caption": "when",
      "snippet": "when (${1:key}) {\n    ${2:value} -> ${3}\n    else -> ${4}\n}",
      "meta": "snippet"
    },
    {
      "caption": "for",
      "snippet": "for (${1:item} in ${2:collection}) {\n    ${3}\n}",
      "meta": "snippet"
    },
    {
      "caption": "fori",
      "snippet": "for (i in 0 until ${1:count}) {\n    ${2}\n}",
      "meta": "snippet"
    },
    {
      "caption": "try",
      "snippet": "try {\n    ${1}\n} catch (e: Exception) {\n    e.printStackTrace()\n}",
      "meta": "snippet"
    },

    // --- SCOPE FUNCTIONS (Essential Kotlin) ---
    {
      "caption": "let",
      "snippet": "${1:it}.let { ${2:it} ->\n    ${3}\n}",
      "meta": "snippet"
    },
    {
      "caption": "apply",
      "snippet": "${1:it}.apply {\n    ${2}\n}",
      "meta": "snippet"
    },
    {
      "caption": "run",
      "snippet": "${1:it}.run {\n    ${2}\n}",
      "meta": "snippet"
    },
    {
      "caption": "also",
      "snippet": "${1:it}.also { ${2:it} ->\n    ${3}\n}",
      "meta": "snippet"
    },

    // --- COROUTINES (Modern Async) ---
    {
      "caption": "launch",
      "snippet": "CoroutineScope(Dispatchers.Main).launch {\n    ${1}\n}",
      "meta": "snippet"
    },
    {
      "caption": "withcontext",
      "snippet": "withContext(Dispatchers.${1:IO}) {\n    ${2}\n}",
      "meta": "snippet"
    },

    // --- COLLECTIONS ---
    {
      "caption": "list",
      "snippet": "val ${1:list} = listOf(${2})",
      "meta": "snippet"
    },
    {
      "caption": "mlist",
      "snippet": "val ${1:list} = mutableListOf(${2})",
      "meta": "snippet"
    },
    {
      "caption": "map",
      "snippet": "val ${1:map} = mapOf(${2})",
      "meta": "snippet"
    },

    // --- ANDROID SPECIFIC ---
    {
      "caption": "toast",
      "snippet": "Toast.makeText(context, \"${1:text}\", Toast.LENGTH_SHORT).show()",
      "meta": "snippet"
    },
    {
      "caption": "toastl",
      "snippet": "Toast.makeText(context, \"${1:text}\", Toast.LENGTH_LONG).show()",
      "meta": "snippet"
    },
    {
      "caption": "logd",
      "snippet": "Log.d(\"${1:TAG}\", \"${2:msg}\")",
      "meta": "snippet"
    },
    {
      "caption": "loge",
      "snippet": "Log.e(\"${1:TAG}\", \"${2:msg}\", ${3:exception})",
      "meta": "snippet"
    },
    {
      "caption": "snack",
      "snippet": "Snackbar.make(${1:view}, \"${2:text}\", Snackbar.LENGTH_SHORT).show()",
      "meta": "snippet"
    },
    {
      "caption": "intent",
      "snippet": "val intent = Intent(this, ${1:TargetActivity}::class.java)\nstartActivity(intent)",
      "meta": "snippet"
    },
    {
      "caption": "click",
      "snippet": "${1:view}.setOnClickListener {\n    ${2}\n}",
      "meta": "snippet"
    },
    {
      "caption": "findview",
      "snippet": "val ${1:view}: ${2:ViewType} = findViewById(R.id.${3:id})",
      "meta": "snippet"
    }
];

export const xmlSnippets = [
    // ==========================================
    // 1. DATA BINDING & ROOT ELEMENTS
    // ==========================================
    {
      "caption": "Data Binding Layout (Root)",
      "snippet": "<layout xmlns:android=\"http://schemas.android.com/apk/res/android\"\n    xmlns:app=\"http://schemas.android.com/apk/res-auto\"\n    xmlns:tools=\"http://schemas.android.com/tools\">\n\n    <data>\n        <variable\n            name=\"${1:viewModel}\"\n            type=\"${2:com.example.app.ViewModel}\" />\n    </data>\n\n    ${3:<!-- Root Layout Here -->}\n\n</layout>",
      "meta": "root"
    },
    {
      "caption": "Include Layout",
      "snippet": "<include\n    android:id=\"@+id/${1:included_layout}\"\n    layout=\"@layout/${2:layout_name}\"\n    android:layout_width=\"match_parent\"\n    android:layout_height=\"wrap_content\" />",
      "meta": "root"
    },
    {
      "caption": "Merge Tag (Optimize Layouts)",
      "snippet": "<merge xmlns:android=\"http://schemas.android.com/apk/res/android\">\n    ${1}\n</merge>",
      "meta": "root"
    },

    // ==========================================
    // 2. LAYOUT MANAGERS (EXPANDED)
    // ==========================================
    {
      "caption": "ConstraintLayout",
      "snippet": "<androidx.constraintlayout.widget.ConstraintLayout\n    xmlns:android=\"http://schemas.android.com/apk/res/android\"\n    xmlns:app=\"http://schemas.android.com/apk/res-auto\"\n    xmlns:tools=\"http://schemas.android.com/tools\"\n    android:layout_width=\"match_parent\"\n    android:layout_height=\"match_parent\"\n    tools:context=\".${1:MainActivity}\">\n\n    ${2}\n\n</androidx.constraintlayout.widget.ConstraintLayout>",
      "meta": "layout"
    },
    {
      "caption": "CoordinatorLayout (Material)",
      "snippet": "<androidx.coordinatorlayout.widget.CoordinatorLayout\n    android:layout_width=\"match_parent\"\n    android:layout_height=\"match_parent\">\n\n    <com.google.android.material.appbar.AppBarLayout\n        android:layout_width=\"match_parent\"\n        android:layout_height=\"wrap_content\">\n\n        <com.google.android.material.appbar.MaterialToolbar\n            android:id=\"@+id/toolbar\"\n            android:layout_width=\"match_parent\"\n            android:layout_height=\"?attr/actionBarSize\"\n            app:title=\"${1:Title}\" />\n\n    </com.google.android.material.appbar.AppBarLayout>\n\n    ${2}\n\n</androidx.coordinatorlayout.widget.CoordinatorLayout>",
      "meta": "layout"
    },
    {
      "caption": "LinearLayout (Vertical)",
      "snippet": "<LinearLayout\n    android:layout_width=\"match_parent\"\n    android:layout_height=\"match_parent\"\n    android:orientation=\"vertical\"\n    android:gravity=\"${1:start}\">\n    ${2}\n</LinearLayout>",
      "meta": "layout"
    },
    {
      "caption": "LinearLayout (Horizontal)",
      "snippet": "<LinearLayout\n    android:layout_width=\"match_parent\"\n    android:layout_height=\"wrap_content\"\n    android:orientation=\"horizontal\"\n    android:weightSum=\"${1:1}\">\n    ${2}\n</LinearLayout>",
      "meta": "layout"
    },
    {
      "caption": "FrameLayout",
      "snippet": "<FrameLayout\n    android:layout_width=\"match_parent\"\n    android:layout_height=\"match_parent\">\n    ${1}\n</FrameLayout>",
      "meta": "layout"
    },
    {
      "caption": "RelativeLayout (Legacy)",
      "snippet": "<RelativeLayout\n    android:layout_width=\"match_parent\"\n    android:layout_height=\"match_parent\">\n    ${1}\n</RelativeLayout>",
      "meta": "layout"
    },
    {
      "caption": "GridLayout",
      "snippet": "<GridLayout\n    android:layout_width=\"match_parent\"\n    android:layout_height=\"wrap_content\"\n    android:columnCount=\"${1:2}\"\n    android:rowCount=\"${2:2}\">\n    ${3}\n</GridLayout>",
      "meta": "layout"
    },
    {
      "caption": "ScrollView",
      "snippet": "<ScrollView\n    android:layout_width=\"match_parent\"\n    android:layout_height=\"match_parent\"\n    android:fillViewport=\"true\">\n    <LinearLayout\n        android:layout_width=\"match_parent\"\n        android:layout_height=\"wrap_content\"\n        android:orientation=\"vertical\">\n        ${1}\n    </LinearLayout>\n</ScrollView>",
      "meta": "layout"
    },
    {
      "caption": "NestedScrollView",
      "snippet": "<androidx.core.widget.NestedScrollView\n    android:layout_width=\"match_parent\"\n    android:layout_height=\"match_parent\"\n    app:layout_behavior=\"@string/appbar_scrolling_view_behavior\">\n    ${1}\n</androidx.core.widget.NestedScrollView>",
      "meta": "layout"
    },
    {
      "caption": "SwipeRefreshLayout",
      "snippet": "<androidx.swiperefreshlayout.widget.SwipeRefreshLayout\n    android:id=\"@+id/swipeRefresh\"\n    android:layout_width=\"match_parent\"\n    android:layout_height=\"match_parent\">\n    ${1}\n</androidx.swiperefreshlayout.widget.SwipeRefreshLayout>",
      "meta": "layout"
    },

    // ==========================================
    // 3. WIDGETS (CORE & MATERIAL)
    // ==========================================
    {
      "caption": "TextView",
      "snippet": "<TextView\n    android:id=\"@+id/${1:tv_text}\"\n    android:layout_width=\"wrap_content\"\n    android:layout_height=\"wrap_content\"\n    android:text=\"${2:Hello}\"\n    android:textSize=\"16sp\"\n    android:textColor=\"@color/${3:black}\"\n    android:fontFamily=\"@font/${4:roboto_regular}\" />",
      "meta": "widget"
    },
    {
      "caption": "ImageView",
      "snippet": "<ImageView\n    android:id=\"@+id/${1:img_view}\"\n    android:layout_width=\"wrap_content\"\n    android:layout_height=\"wrap_content\"\n    android:src=\"@drawable/${2:ic_launcher}\"\n    android:scaleType=\"centerCrop\"\n    android:contentDescription=\"${3:Image Description}\" />",
      "meta": "widget"
    },
    {
      "caption": "MaterialCardView",
      "snippet": "<com.google.android.material.card.MaterialCardView\n    android:layout_width=\"match_parent\"\n    android:layout_height=\"wrap_content\"\n    android:layout_margin=\"8dp\"\n    app:cardCornerRadius=\"12dp\"\n    app:cardElevation=\"4dp\"\n    app:strokeColor=\"@color/${1:outline}\"\n    app:strokeWidth=\"1dp\">\n    ${2}\n</com.google.android.material.card.MaterialCardView>",
      "meta": "widget"
    },
    {
      "caption": "MaterialButton",
      "snippet": "<com.google.android.material.button.MaterialButton\n    android:id=\"@+id/${1:btn}\"\n    android:layout_width=\"wrap_content\"\n    android:layout_height=\"wrap_content\"\n    android:text=\"${2:Button}\"\n    style=\"@style/Widget.MaterialComponents.Button\" />",
      "meta": "widget"
    },
    {
      "caption": "MaterialButton (Outlined)",
      "snippet": "<com.google.android.material.button.MaterialButton\n    style=\"@style/Widget.MaterialComponents.Button.OutlinedButton\"\n    android:layout_width=\"wrap_content\"\n    android:layout_height=\"wrap_content\"\n    android:text=\"${1:Button}\" />",
      "meta": "widget"
    },
    {
      "caption": "MaterialButton (Text/Flat)",
      "snippet": "<com.google.android.material.button.MaterialButton\n    style=\"@style/Widget.MaterialComponents.Button.TextButton\"\n    android:layout_width=\"wrap_content\"\n    android:layout_height=\"wrap_content\"\n    android:text=\"${1:Button}\" />",
      "meta": "widget"
    },
    {
      "caption": "TextInputLayout (Outlined)",
      "snippet": "<com.google.android.material.textfield.TextInputLayout\n    android:layout_width=\"match_parent\"\n    android:layout_height=\"wrap_content\"\n    android:hint=\"${1:Hint}\"\n    style=\"@style/Widget.MaterialComponents.TextInputLayout.OutlinedBox\">\n\n    <com.google.android.material.textfield.TextInputEditText\n        android:layout_width=\"match_parent\"\n        android:layout_height=\"wrap_content\"\n        android:inputType=\"${2:text}\" />\n\n</com.google.android.material.textfield.TextInputLayout>",
      "meta": "widget"
    },
    {
      "caption": "FloatingActionButton",
      "snippet": "<com.google.android.material.floatingactionbutton.FloatingActionButton\n    android:id=\"@+id/fab\"\n    android:layout_width=\"wrap_content\"\n    android:layout_height=\"wrap_content\"\n    android:layout_gravity=\"bottom|end\"\n    android:layout_margin=\"16dp\"\n    app:srcCompat=\"@drawable/${1:ic_add}\"\n    contentDescription=\"@string/${2:desc}\" />",
      "meta": "widget"
    },
    {
      "caption": "ProgressBar (Circular)",
      "snippet": "<ProgressBar\n    android:id=\"@+id/progressBar\"\n    android:layout_width=\"wrap_content\"\n    android:layout_height=\"wrap_content\"\n    android:indeterminate=\"true\" />",
      "meta": "widget"
    },
    {
      "caption": "ProgressBar (Horizontal)",
      "snippet": "<ProgressBar\n    android:id=\"@+id/progressBarHoriz\"\n    style=\"?android:attr/progressBarStyleHorizontal\"\n    android:layout_width=\"match_parent\"\n    android:layout_height=\"wrap_content\"\n    android:max=\"100\"\n    android:progress=\"${1:50}\" />",
      "meta": "widget"
    },
    {
      "caption": "Switch (Material)",
      "snippet": "<com.google.android.material.switchmaterial.SwitchMaterial\n    android:id=\"@+id/${1:switch_id}\"\n    android:layout_width=\"wrap_content\"\n    android:layout_height=\"wrap_content\"\n    android:text=\"${2:Switch}\"\n    android:checked=\"false\" />",
      "meta": "widget"
    },
    {
      "caption": "CheckBox",
      "snippet": "<com.google.android.material.checkbox.MaterialCheckBox\n    android:id=\"@+id/${1:checkbox}\"\n    android:layout_width=\"wrap_content\"\n    android:layout_height=\"wrap_content\"\n    android:text=\"${2:Check me}\" />",
      "meta": "widget"
    },
    {
      "caption": "RadioGroup & Buttons",
      "snippet": "<RadioGroup\n    android:id=\"@+id/radioGroup\"\n    android:layout_width=\"match_parent\"\n    android:layout_height=\"wrap_content\"\n    android:orientation=\"vertical\">\n\n    <com.google.android.material.radiobutton.MaterialRadioButton\n        android:id=\"@+id/radio1\"\n        android:layout_width=\"wrap_content\"\n        android:layout_height=\"wrap_content\"\n        android:text=\"${1:Option 1}\" />\n\n    <com.google.android.material.radiobutton.MaterialRadioButton\n        android:id=\"@+id/radio2\"\n        android:layout_width=\"wrap_content\"\n        android:layout_height=\"wrap_content\"\n        android:text=\"${2:Option 2}\" />\n</RadioGroup>",
      "meta": "widget"
    },
    {
      "caption": "Spinner (Dropdown)",
      "snippet": "<Spinner\n    android:id=\"@+id/${1:spinner}\"\n    android:layout_width=\"match_parent\"\n    android:layout_height=\"wrap_content\" />",
      "meta": "widget"
    },
    {
      "caption": "WebView",
      "snippet": "<WebView\n    android:id=\"@+id/webView\"\n    android:layout_width=\"match_parent\"\n    android:layout_height=\"match_parent\" />",
      "meta": "widget"
    },

    // ==========================================
    // 4. LISTS & GRIDS
    // ==========================================
    {
      "caption": "RecyclerView",
      "snippet": "<androidx.recyclerview.widget.RecyclerView\n    android:id=\"@+id/${1:recyclerView}\"\n    android:layout_width=\"match_parent\"\n    android:layout_height=\"match_parent\"\n    app:layoutManager=\"androidx.recyclerview.widget.LinearLayoutManager\"\n    tools:listitem=\"@layout/${2:item_layout}\"\n    tools:itemCount=\"5\" />",
      "meta": "list"
    },
    {
      "caption": "ViewPager2",
      "snippet": "<androidx.viewpager2.widget.ViewPager2\n    android:id=\"@+id/viewPager\"\n    android:layout_width=\"match_parent\"\n    android:layout_height=\"match_parent\"\n    android:orientation=\"horizontal\" />",
      "meta": "list"
    },

    // ==========================================
    // 5. CONSTRAINT HELPERS
    // ==========================================
    {
      "caption": "Guideline (Vertical Percent)",
      "snippet": "<androidx.constraintlayout.widget.Guideline\n    android:id=\"@+id/guideline\"\n    android:layout_width=\"wrap_content\"\n    android:layout_height=\"wrap_content\"\n    android:orientation=\"vertical\"\n    app:layout_constraintGuide_percent=\"${1:0.5}\" />",
      "meta": "helper"
    },
    {
      "caption": "Guideline (Horizontal)",
      "snippet": "<androidx.constraintlayout.widget.Guideline\n    android:id=\"@+id/guideline_h\"\n    android:layout_width=\"wrap_content\"\n    android:layout_height=\"wrap_content\"\n    android:orientation=\"horizontal\"\n    app:layout_constraintGuide_begin=\"${1:16dp}\" />",
      "meta": "helper"
    },
    {
      "caption": "Barrier",
      "snippet": "<androidx.constraintlayout.widget.Barrier\n    android:id=\"@+id/barrier\"\n    android:layout_width=\"wrap_content\"\n    android:layout_height=\"wrap_content\"\n    app:barrierDirection=\"${1:end}\"\n    app:constraint_referenced_ids=\"${2:view1,view2}\" />",
      "meta": "helper"
    },
    {
      "caption": "Group (Visibility)",
      "snippet": "<androidx.constraintlayout.widget.Group\n    android:id=\"@+id/group\"\n    android:layout_width=\"wrap_content\"\n    android:layout_height=\"wrap_content\"\n    android:visibility=\"visible\"\n    app:constraint_referenced_ids=\"${1:view1,view2}\" />",
      "meta": "helper"
    },

    // ==========================================
    // 6. DRAWABLES (res/drawable)
    // ==========================================
    {
      "caption": "Shape (Rounded Rectangle)",
      "snippet": "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n<shape xmlns:android=\"http://schemas.android.com/apk/res/android\"\n    android:shape=\"rectangle\">\n    <solid android:color=\"@color/${1:white}\" />\n    <corners android:radius=\"${2:8dp}\" />\n    <stroke android:width=\"1dp\" android:color=\"@color/${3:gray}\" />\n</shape>",
      "meta": "drawable"
    },
    {
      "caption": "Shape (Gradient)",
      "snippet": "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n<shape xmlns:android=\"http://schemas.android.com/apk/res/android\"\n    android:shape=\"rectangle\">\n    <gradient\n        android:startColor=\"@color/${1:startColor}\"\n        android:endColor=\"@color/${2:endColor}\"\n        android:angle=\"${3:45}\"\n        android:type=\"linear\" />\n    <corners android:radius=\"8dp\" />\n</shape>",
      "meta": "drawable"
    },
    {
      "caption": "Ripple Effect (Touch Feedback)",
      "snippet": "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n<ripple xmlns:android=\"http://schemas.android.com/apk/res/android\"\n    android:color=\"?attr/colorControlHighlight\">\n    <item android:id=\"@android:id/mask\">\n        <shape android:shape=\"rectangle\">\n            <solid android:color=\"#000000\" />\n            <corners android:radius=\"4dp\" />\n        </shape>\n    </item>\n    <item android:drawable=\"@drawable/${1:background_drawable}\" />\n</ripple>",
      "meta": "drawable"
    },
    {
      "caption": "Selector (Button/Text State)",
      "snippet": "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n<selector xmlns:android=\"http://schemas.android.com/apk/res/android\">\n    <item android:state_pressed=\"true\" android:color=\"@color/${1:colorPressed}\" />\n    <item android:state_enabled=\"false\" android:color=\"@color/${2:colorDisabled}\" />\n    <item android:color=\"@color/${3:colorDefault}\" />\n</selector>",
      "meta": "drawable"
    },
    {
      "caption": "Layer List (Stacked Drawables)",
      "snippet": "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n<layer-list xmlns:android=\"http://schemas.android.com/apk/res/android\">\n    <item>\n        <shape android:shape=\"rectangle\">\n            <solid android:color=\"@color/grey\" />\n        </shape>\n    </item>\n    <item android:bottom=\"2dp\">\n        <shape android:shape=\"rectangle\">\n            <solid android:color=\"@color/white\" />\n        </shape>\n    </item>\n</layer-list>",
      "meta": "drawable"
    },
    {
      "caption": "Vector Drawable (Base)",
      "snippet": "<vector xmlns:android=\"http://schemas.android.com/apk/res/android\"\n    android:width=\"24dp\"\n    android:height=\"24dp\"\n    android:viewportWidth=\"24\"\n    android:viewportHeight=\"24\">\n    <path\n        android:fillColor=\"#FF000000\"\n        android:pathData=\"${1}\" />\n</vector>",
      "meta": "drawable"
    },

    // ==========================================
    // 7. ANIMATIONS (res/anim)
    // ==========================================
    {
      "caption": "Animation Set",
      "snippet": "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n<set xmlns:android=\"http://schemas.android.com/apk/res/android\"\n    android:fillAfter=\"true\"\n    android:duration=\"300\">\n    ${1}\n</set>",
      "meta": "anim"
    },
    {
      "caption": "Fade In (Alpha)",
      "snippet": "<alpha\n    android:fromAlpha=\"0.0\"\n    android:toAlpha=\"1.0\"\n    android:duration=\"300\" />",
      "meta": "anim"
    },
    {
      "caption": "Scale (Zoom)",
      "snippet": "<scale\n    android:fromXScale=\"0.5\"\n    android:toXScale=\"1.0\"\n    android:fromYScale=\"0.5\"\n    android:toYScale=\"1.0\"\n    android:pivotX=\"50%\"\n    android:pivotY=\"50%\"\n    android:duration=\"300\" />",
      "meta": "anim"
    },
    {
      "caption": "Translate (Slide)",
      "snippet": "<translate\n    android:fromXDelta=\"100%\"\n    android:toXDelta=\"0%\"\n    android:duration=\"300\" />",
      "meta": "anim"
    },
    {
      "caption": "Rotate",
      "snippet": "<rotate\n    android:fromDegrees=\"0\"\n    android:toDegrees=\"360\"\n    android:pivotX=\"50%\"\n    android:pivotY=\"50%\"\n    android:duration=\"500\" />",
      "meta": "anim"
    },

    // ==========================================
    // 8. RESOURCES (res/values)
    // ==========================================
    {
      "caption": "String Definition",
      "snippet": "<string name=\"${1:string_name}\">${2:Text}</string>",
      "meta": "values"
    },
    {
      "caption": "String Array",
      "snippet": "<string-array name=\"${1:array_name}\">\n    <item>${2:Item 1}</item>\n    <item>${3:Item 2}</item>\n</string-array>",
      "meta": "values"
    },
    {
      "caption": "Plurals (Quantity Strings)",
      "snippet": "<plurals name=\"${1:item_count}\">\n    <item quantity=\"one\">%d item</item>\n    <item quantity=\"other\">%d items</item>\n</plurals>",
      "meta": "values"
    },
    {
      "caption": "Color",
      "snippet": "<color name=\"${1:name}\">#${2:FFFFFF}</color>",
      "meta": "values"
    },
    {
      "caption": "Dimen",
      "snippet": "<dimen name=\"${1:name}\">${2:16dp}</dimen>",
      "meta": "values"
    },
    {
      "caption": "Style (Theme)",
      "snippet": "<style name=\"${1:StyleName}\" parent=\"${2:Theme.MaterialComponents.Light}\">\n    <item name=\"android:textColor\">@color/${3:black}</item>\n    <item name=\"colorPrimary\">@color/${4:purple_500}</item>\n</style>",
      "meta": "values"
    },

    // ==========================================
    // 9. MANIFEST (AndroidManifest.xml)
    // ==========================================
    {
      "caption": "Permission",
      "snippet": "<uses-permission android:name=\"android.permission.${1:INTERNET}\" />",
      "meta": "manifest"
    },
    {
      "caption": "Uses Feature",
      "snippet": "<uses-feature android:name=\"android.hardware.${1:camera}\" android:required=\"true\" />",
      "meta": "manifest"
    },
    {
      "caption": "Activity Declaration",
      "snippet": "<activity\n    android:name=\".${1:ActivityName}\"\n    android:exported=\"false\"\n    android:screenOrientation=\"portrait\" />",
      "meta": "manifest"
    },
    {
      "caption": "Service Declaration",
      "snippet": "<service\n    android:name=\".${1:MyService}\"\n    android:enabled=\"true\"\n    android:exported=\"false\" />",
      "meta": "manifest"
    },
    {
      "caption": "Receiver (Broadcast)",
      "snippet": "<receiver\n    android:name=\".${1:MyReceiver}\"\n    android:exported=\"true\">\n    <intent-filter>\n        <action android:name=\"${2:android.intent.action.BOOT_COMPLETED}\" />\n    </intent-filter>\n</receiver>",
      "meta": "manifest"
    },
    {
      "caption": "Provider",
      "snippet": "<provider\n    android:name=\".${1:MyProvider}\"\n    android:authorities=\"${2:com.package.provider}\"\n    android:exported=\"false\"\n    android:grantUriPermissions=\"true\" />",
      "meta": "manifest"
    },
    {
      "caption": "Application Meta-Data",
      "snippet": "<meta-data\n    android:name=\"${1:com.google.android.geo.API_KEY}\"\n    android:value=\"${2:YOUR_API_KEY}\" />",
      "meta": "manifest"
    },

    // ==========================================
    // 10. MOTION LAYOUT (res/xml)
    // ==========================================
    {
      "caption": "MotionScene (Root)",
      "snippet": "<MotionScene xmlns:android=\"http://schemas.android.com/apk/res/android\"\n    xmlns:motion=\"http://schemas.android.com/apk/res-auto\">\n\n    <Transition\n        motion:constraintSetStart=\"@+id/start\"\n        motion:constraintSetEnd=\"@+id/end\"\n        motion:duration=\"1000\">\n        <OnSwipe\n            motion:touchAnchorId=\"@+id/${1:button}\"\n            motion:touchAnchorSide=\"top\"\n            motion:dragDirection=\"dragUp\" />\n    </Transition>\n\n    <ConstraintSet android:id=\"@+id/start\">\n        ${2}\n    </ConstraintSet>\n\n    <ConstraintSet android:id=\"@+id/end\">\n        ${3}\n    </ConstraintSet>\n\n</MotionScene>",
      "meta": "motion"
    },

    // ==========================================
    // 11. NAVIGATION (res/navigation)
    // ==========================================
    {
      "caption": "NavHostFragment",
      "snippet": "<androidx.fragment.app.FragmentContainerView\n    android:id=\"@+id/nav_host_fragment\"\n    android:name=\"androidx.navigation.fragment.NavHostFragment\"\n    android:layout_width=\"match_parent\"\n    android:layout_height=\"match_parent\"\n    app:defaultNavHost=\"true\"\n    app:navGraph=\"@navigation/${1:nav_graph}\" />",
      "meta": "nav"
    },
    {
      "caption": "Nav Graph Fragment",
      "snippet": "<fragment\n    android:id=\"@+id/${1:fragment_home}\"\n    android:name=\"${2:com.example.HomeFragment}\"\n    android:label=\"${3:Home}\"\n    tools:layout=\"@layout/${4:fragment_home}\">\n    <action\n        android:id=\"@+id/action_home_to_details\"\n        app:destination=\"@id/detailsFragment\" />\n</fragment>",
      "meta": "nav"
    },

    // ==========================================
    // 12. MENUS (res/menu)
    // ==========================================
    {
      "caption": "Bottom Nav Menu",
      "snippet": "<menu xmlns:android=\"http://schemas.android.com/apk/res/android\">\n    <item\n        android:id=\"@+id/navigation_home\"\n        android:icon=\"@drawable/ic_home\"\n        android:title=\"Home\" />\n    <item\n        android:id=\"@+id/navigation_dashboard\"\n        android:icon=\"@drawable/ic_dashboard\"\n        android:title=\"Dashboard\" />\n</menu>",
      "meta": "menu"
    },
    {
      "caption": "Toolbar Menu Item",
      "snippet": "<item\n    android:id=\"@+id/action_${1:settings}\"\n    android:icon=\"@drawable/${2:ic_settings}\"\n    android:title=\"${3:Settings}\"\n    app:showAsAction=\"${4:ifRoom}\" />",
      "meta": "menu"
    },

    // ==========================================
    // 13. COMMON ATTRIBUTES
    // ==========================================
    {
      "caption": "Layout Width/Height Match",
      "snippet": "android:layout_width=\"match_parent\"\nandroid:layout_height=\"match_parent\"",
      "meta": "attr"
    },
    {
      "caption": "Layout Width/Height Wrap",
      "snippet": "android:layout_width=\"wrap_content\"\nandroid:layout_height=\"wrap_content\"",
      "meta": "attr"
    },
    {
      "caption": "Constraint: Top-Top",
      "snippet": "app:layout_constraintTop_toTopOf=\"parent\"",
      "meta": "attr"
    },
    {
      "caption": "Constraint: Start-Start",
      "snippet": "app:layout_constraintStart_toStartOf=\"parent\"",
      "meta": "attr"
    },
    {
      "caption": "Constraint: End-End",
      "snippet": "app:layout_constraintEnd_toEndOf=\"parent\"",
      "meta": "attr"
    },
    {
      "caption": "Constraint: Bottom-Bottom",
      "snippet": "app:layout_constraintBottom_toBottomOf=\"parent\"",
      "meta": "attr"
    },
    {
      "caption": "Visibility Gone",
      "snippet": "android:visibility=\"gone\"",
      "meta": "attr"
    },
    {
      "caption": "Center in Parent (Constraint)",
      "snippet": "app:layout_constraintTop_toTopOf=\"parent\"\napp:layout_constraintBottom_toBottomOf=\"parent\"\napp:layout_constraintStart_toStartOf=\"parent\"\napp:layout_constraintEnd_toEndOf=\"parent\"",
      "meta": "attr"
    }
];