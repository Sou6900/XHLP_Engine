// templates/commonFiles.js

export const commonFiles = {
  // .gitignore
  gitignore: `*.iml
.gradle
/local.properties
/.idea
/build
/captures
.externalNativeBuild
.cxx
local.properties
.DS_Store
`,

  // build.gradle (Project Level)
  rootBuildGradle: `// Top-level build file
plugins {
    id 'com.android.application' version '8.1.0' apply false
    id 'com.android.library' version '8.1.0' apply false
    id 'org.jetbrains.kotlin.android' version '1.9.0' apply false
}
`,

  // settings.gradle
  settingsGradle: (appName) => `pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}
rootProject.name = "${appName}"
include ':app'
`,

  // gradle.properties
//   gradleProperties: `org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8
// android.useAndroidX=true
// kotlin.code.style=official
// android.nonTransitiveRClass=true
// `,

gradleProperties : `# Project-wide Gradle settings.
# Gradle settings configured through the IDE *will override*
# any settings specified in this file.

# Low-End Device Optimized (Default)
org.gradle.jvmargs=-Xmx768m -Dfile.encoding=UTF-8
android.useAndroidX=true
android.enableJetifier=true
android.nonTransitiveRClass=true

# Disable file watching (Saves RAM & CPU)
org.gradle.vfs.watch=false

# Disable Native Services (Prevents crashes on Android/Termux)
org.gradle.native=false

# org.gradle.parallel=true
# org.gradle.daemon=false
`,

  // app/build.gradle (Module Level)
  appBuildGradle: (pkgName) => `plugins {
    id 'com.android.application'
    id 'org.jetbrains.kotlin.android'
}

android {
    namespace '${pkgName}'
    compileSdk 34

    defaultConfig {
        applicationId '${pkgName}'
        minSdk 21
        targetSdk 34
        versionCode 1
        versionName "1.0"
    }

    buildTypes {
        release {
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
    compileOptions {
        sourceCompatibility JavaVersion.VERSION_1_8
        targetCompatibility JavaVersion.VERSION_1_8
    }
    kotlinOptions {
        jvmTarget = '1.8'
    }
}

dependencies {
    implementation 'androidx.core:core-ktx:1.9.0'
    implementation 'androidx.appcompat:appcompat:1.6.1'
    implementation 'com.google.android.material:material:1.10.0'
    implementation 'androidx.constraintlayout:constraintlayout:2.1.4'
}
`,

  // AndroidManifest for Empty Activity (Standard)
  androidManifest: (pkgName) => `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools">

    <application
        android:allowBackup="true"
        android:dataExtractionRules="@xml/data_extraction_rules"
        android:fullBackupContent="@xml/backup_rules"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.App"
        tools:targetApi="31">
        
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:theme="@style/Theme.App">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

    </application>

</manifest>`,

  // AndroidManifest for No Activity
  androidManifestNoActivity: (pkgName) => `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools">

    <application
        android:allowBackup="true"
        android:dataExtractionRules="@xml/data_extraction_rules"
        android:fullBackupContent="@xml/backup_rules"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.App"
        tools:targetApi="31">
        
    </application>

</manifest>`,

  // Strings (Added Navigation Strings)
  stringsXml: (appName) => `<resources>
    <string name="app_name">${appName}</string>
    <string name="welcome_message">Hello Android!</string>
    <string name="navigation_drawer_open">Open navigation drawer</string>
    <string name="navigation_drawer_close">Close navigation drawer</string>
</resources>`,
  
  // colors.xml - UPDATED with nav_header_bg color
  colorsXml: `<resources>
    <color name="primary">#0F9D58</color>
    <color name="primary_variant">#0F9D58</color>
    <color name="secondary">#03DAC6</color>
    <color name="background">#F5F5F5</color>
    <color name="white">#FFFFFF</color>
    <color name="black">#000000</color>
    <color name="nav_header_bg">#1A913A</color>
</resources>`,

  // themes.xml
  themesXml: `<resources xmlns:tools="http://schemas.android.com/tools">
    <style name="Theme.App" parent="Theme.MaterialComponents.DayNight.NoActionBar">
        <item name="colorPrimary">@color/primary</item>
        <item name="colorPrimaryVariant">@color/primary_variant</item>
        <item name="colorSecondary">@color/secondary</item>
        <item name="android:statusBarColor">?attr/colorPrimaryVariant</item>
    </style>
</resources>`,

  // Icon XMLs
  icLauncherBackground: `<?xml version="1.0" encoding="utf-8"?>
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="108dp"
    android:height="108dp"
    android:viewportWidth="108"
    android:viewportHeight="108">
    <path
        android:fillColor="#3DDC84"
        android:pathData="M0,0h108v108h-108z" />
</vector>`,

  icLauncherForeground: `<?xml version="1.0" encoding="utf-8"?>
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="108dp"
    android:height="108dp"
    android:viewportWidth="108"
    android:viewportHeight="108">
    <path
        android:fillColor="#FFFFFF"
        android:pathData="M54,22L54,22L54,22C48.5,22 44,26.5 44,32V50L34,60V66L52,60V76L48,80V84L54,82L60,84V80L56,76V60L74,66V60L64,50V32C64,26.5 59.5,22 54,22Z" />
</vector>`,

  icLauncherXml: `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@drawable/ic_launcher_background" />
    <foreground android:drawable="@drawable/ic_launcher_foreground" />
</adaptive-icon>`,

  dataExtractionRules: `<?xml version="1.0" encoding="utf-8"?>
<data-extraction-rules>
    <cloud-backup><include domain="root" /></cloud-backup>
    <device-transfer><include domain="root" /></device-transfer>
</data-extraction-rules>`,

  backupRules: `<?xml version="1.0" encoding="utf-8"?>
<full-backup-content><include domain="root" /></full-backup-content>`
};