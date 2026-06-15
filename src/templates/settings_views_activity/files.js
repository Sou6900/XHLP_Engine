// templates/settings_views_activity/files.js

export const settingsViewsFiles = {
  // 1. MainActivity Layout
  activityMain: `<?xml version="1.0" encoding="utf-8"?>
<androidx.coordinatorlayout.widget.CoordinatorLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <com.google.android.material.appbar.AppBarLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content">

        <androidx.appcompat.widget.Toolbar
            android:id="@+id/toolbar"
            android:layout_width="match_parent"
            android:layout_height="?attr/actionBarSize"
            android:background="?attr/colorPrimary"
            app:popupTheme="@style/Theme.App" />

    </com.google.android.material.appbar.AppBarLayout>

    <FrameLayout
        android:id="@+id/settings_container"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        app:layout_behavior="@string/appbar_scrolling_view_behavior" />

</androidx.coordinatorlayout.widget.CoordinatorLayout>`,

  // 2. Preferences XML (root_preferences.xml)
  rootPreferences: `<?xml version="1.0" encoding="utf-8"?>
<PreferenceScreen xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto">

    <PreferenceCategory
        android:title="General"
        app:iconSpaceReserved="false">

        <SwitchPreferenceCompat
            android:key="notifications"
            android:title="Enable Notifications"
            android:summary="Receive app notifications"
            android:defaultValue="true"
            app:iconSpaceReserved="false" />

        <SwitchPreferenceCompat
            android:key="dark_mode"
            android:title="Dark Mode"
            android:summary="Enable dark theme"
            android:defaultValue="false"
            app:iconSpaceReserved="false" />

        <ListPreference
            android:key="language"
            android:title="Language"
            android:summary="Select app language"
            android:entries="@array/language_entries"
            android:entryValues="@array/language_values"
            android:defaultValue="en"
            app:iconSpaceReserved="false" />

    </PreferenceCategory>

    <PreferenceCategory
        android:title="Account"
        app:iconSpaceReserved="false">

        <EditTextPreference
            android:key="username"
            android:title="Username"
            android:summary="Set your username"
            android:dialogTitle="Enter Username"
            app:iconSpaceReserved="false" />

        <Preference
            android:key="change_password"
            android:title="Change Password"
            android:summary="Update your password"
            app:iconSpaceReserved="false" />

    </PreferenceCategory>

    <PreferenceCategory
        android:title="Privacy"
        app:iconSpaceReserved="false">

        <SwitchPreferenceCompat
            android:key="analytics"
            android:title="Analytics"
            android:summary="Help improve the app"
            android:defaultValue="true"
            app:iconSpaceReserved="false" />

        <Preference
            android:key="clear_cache"
            android:title="Clear Cache"
            android:summary="Free up storage space"
            app:iconSpaceReserved="false" />

    </PreferenceCategory>

    <PreferenceCategory
        android:title="About"
        app:iconSpaceReserved="false">

        <Preference
            android:key="version"
            android:title="Version"
            android:summary="1.0.0"
            android:selectable="false"
            app:iconSpaceReserved="false" />

        <Preference
            android:key="privacy_policy"
            android:title="Privacy Policy"
            android:summary="View our privacy policy"
            app:iconSpaceReserved="false" />

    </PreferenceCategory>

</PreferenceScreen>`,

  // 3. Arrays XML for ListPreference
  arraysXml: `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string-array name="language_entries">
        <item>English</item>
        <item>Spanish</item>
        <item>French</item>
        <item>German</item>
        <item>Chinese</item>
    </string-array>

    <string-array name="language_values">
        <item>en</item>
        <item>es</item>
        <item>fr</item>
        <item>de</item>
        <item>zh</item>
    </string-array>
</resources>`,

  // 4. SettingsFragment - Java
  settingsFragmentJava: (pkgName) => `package ${pkgName};

import android.content.SharedPreferences;
import android.os.Bundle;
import androidx.preference.EditTextPreference;
import androidx.preference.ListPreference;
import androidx.preference.Preference;
import androidx.preference.PreferenceFragmentCompat;
import androidx.preference.SwitchPreferenceCompat;
import com.google.android.material.snackbar.Snackbar;

public class SettingsFragment extends PreferenceFragmentCompat implements 
        SharedPreferences.OnSharedPreferenceChangeListener {

    @Override
    public void onCreatePreferences(Bundle savedInstanceState, String rootKey) {
        setPreferencesFromResource(R.xml.root_preferences, rootKey);

        // Set up click listeners
        setupPreferenceListeners();
        
        // Update summaries
        updatePreferenceSummaries();
    }

    private void setupPreferenceListeners() {
        Preference clearCache = findPreference("clear_cache");
        if (clearCache != null) {
            clearCache.setOnPreferenceClickListener(preference -> {
                // Clear cache logic here
                Snackbar.make(requireView(), "Cache cleared", Snackbar.LENGTH_SHORT).show();
                return true;
            });
        }

        Preference changePassword = findPreference("change_password");
        if (changePassword != null) {
            changePassword.setOnPreferenceClickListener(preference -> {
                // Navigate to change password screen
                Snackbar.make(requireView(), "Change password clicked", Snackbar.LENGTH_SHORT).show();
                return true;
            });
        }

        Preference privacyPolicy = findPreference("privacy_policy");
        if (privacyPolicy != null) {
            privacyPolicy.setOnPreferenceClickListener(preference -> {
                // Open privacy policy URL or screen
                Snackbar.make(requireView(), "Privacy policy clicked", Snackbar.LENGTH_SHORT).show();
                return true;
            });
        }
    }

    private void updatePreferenceSummaries() {
        // Update language summary
        ListPreference language = findPreference("language");
        if (language != null) {
            language.setSummary(language.getEntry());
        }

        // Update username summary
        EditTextPreference username = findPreference("username");
        if (username != null && username.getText() != null && !username.getText().isEmpty()) {
            username.setSummary(username.getText());
        }
    }

    @Override
    public void onResume() {
        super.onResume();
        getPreferenceScreen().getSharedPreferences()
                .registerOnSharedPreferenceChangeListener(this);
    }

    @Override
    public void onPause() {
        super.onPause();
        getPreferenceScreen().getSharedPreferences()
                .unregisterOnSharedPreferenceChangeListener(this);
    }

    @Override
    public void onSharedPreferenceChanged(SharedPreferences sharedPreferences, String key) {
        Preference preference = findPreference(key);
        if (preference == null) return;

        if (preference instanceof ListPreference) {
            ListPreference listPreference = (ListPreference) preference;
            listPreference.setSummary(listPreference.getEntry());
        } else if (preference instanceof EditTextPreference) {
            EditTextPreference editTextPreference = (EditTextPreference) preference;
            if (editTextPreference.getText() != null) {
                editTextPreference.setSummary(editTextPreference.getText());
            }
        } else if (preference instanceof SwitchPreferenceCompat) {
            SwitchPreferenceCompat switchPreference = (SwitchPreferenceCompat) preference;
            if (key.equals("dark_mode")) {
                // Handle dark mode change
                boolean isDarkMode = switchPreference.isChecked();
                Snackbar.make(requireView(), 
                    "Dark mode " + (isDarkMode ? "enabled" : "disabled"), 
                    Snackbar.LENGTH_SHORT).show();
            }
        }
    }
}
`,

  // 5. SettingsFragment - Kotlin
  settingsFragmentKt: (pkgName) => `package ${pkgName}

import android.content.SharedPreferences
import android.os.Bundle
import androidx.preference.EditTextPreference
import androidx.preference.ListPreference
import androidx.preference.Preference
import androidx.preference.PreferenceFragmentCompat
import androidx.preference.SwitchPreferenceCompat
import com.google.android.material.snackbar.Snackbar

class SettingsFragment : PreferenceFragmentCompat(), 
    SharedPreferences.OnSharedPreferenceChangeListener {

    override fun onCreatePreferences(savedInstanceState: Bundle?, rootKey: String?) {
        setPreferencesFromResource(R.xml.root_preferences, rootKey)

        // Set up click listeners
        setupPreferenceListeners()
        
        // Update summaries
        updatePreferenceSummaries()
    }

    private fun setupPreferenceListeners() {
        findPreference<Preference>("clear_cache")?.setOnPreferenceClickListener {
            // Clear cache logic here
            view?.let { v ->
                Snackbar.make(v, "Cache cleared", Snackbar.LENGTH_SHORT).show()
            }
            true
        }

        findPreference<Preference>("change_password")?.setOnPreferenceClickListener {
            // Navigate to change password screen
            view?.let { v ->
                Snackbar.make(v, "Change password clicked", Snackbar.LENGTH_SHORT).show()
            }
            true
        }

        findPreference<Preference>("privacy_policy")?.setOnPreferenceClickListener {
            // Open privacy policy URL or screen
            view?.let { v ->
                Snackbar.make(v, "Privacy policy clicked", Snackbar.LENGTH_SHORT).show()
            }
            true
        }
    }

    private fun updatePreferenceSummaries() {
        // Update language summary
        findPreference<ListPreference>("language")?.let {
            it.summary = it.entry
        }

        // Update username summary
        findPreference<EditTextPreference>("username")?.let {
            if (!it.text.isNullOrEmpty()) {
                it.summary = it.text
            }
        }
    }

    override fun onResume() {
        super.onResume()
        preferenceScreen.sharedPreferences
            ?.registerOnSharedPreferenceChangeListener(this)
    }

    override fun onPause() {
        super.onPause()
        preferenceScreen.sharedPreferences
            ?.unregisterOnSharedPreferenceChangeListener(this)
    }

    override fun onSharedPreferenceChanged(sharedPreferences: SharedPreferences?, key: String?) {
        val preference = findPreference<Preference>(key ?: return) ?: return

        when (preference) {
            is ListPreference -> {
                preference.summary = preference.entry
            }
            is EditTextPreference -> {
                preference.text?.let {
                    preference.summary = it
                }
            }
            is SwitchPreferenceCompat -> {
                if (key == "dark_mode") {
                    // Handle dark mode change
                    val isDarkMode = preference.isChecked
                    view?.let { v ->
                        Snackbar.make(v, 
                            Snackbar.LENGTH_SHORT).show()
                    }
                }
            }
        }
    }
}
`,

  // 6. MainActivity - Java
  mainActivityJava: (pkgName) => `package ${pkgName};

import android.os.Bundle;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;

public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        Toolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);

        if (savedInstanceState == null) {
            getSupportFragmentManager()
                    .beginTransaction()
                    .replace(R.id.settings_container, new SettingsFragment())
                    .commit();
        }
    }
}
`,

  // 7. MainActivity - Kotlin
  mainActivityKt: (pkgName) => `package ${pkgName}

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.widget.Toolbar

class MainActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        val toolbar = findViewById<Toolbar>(R.id.toolbar)
        setSupportActionBar(toolbar)

        if (savedInstanceState == null) {
            supportFragmentManager
                .beginTransaction()
                .replace(R.id.settings_container, SettingsFragment())
                .commit()
        }
    }
}
`,

  // 8. Updated build.gradle with Preference dependency
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
    implementation 'androidx.core:core-ktx:1.12.0'
    implementation 'androidx.appcompat:appcompat:1.6.1'
    implementation 'com.google.android.material:material:1.10.0'
    implementation 'androidx.constraintlayout:constraintlayout:2.1.4'
    
    // Preference Library
    implementation 'androidx.preference:preference-ktx:1.2.1'
}
`
};