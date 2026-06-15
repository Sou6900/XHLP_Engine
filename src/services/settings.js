import plugin from '../../plugin.json';
import { selectCustomSnippetPath } from './customSnippets.js';
import { clearSnippetCache } from './completer.js';
import { selectAndroHome, showManualPathModal, resetPathSettings, defaultPathConfig , defaultDownloadConfig } from './pathManager.js';
import { exportPluginToZip } from './pluginExporter.js'; 

const appSettings = acode.require('settings');

const defaultCustomConfig = `{
  "BasedOnStyle": "Google",
  "IndentWidth": 4,
  "ColumnLimit": 100,
  "AllowShortFunctionsOnASingleLine": "None",
  "BreakBeforeBraces": "Attach"
}`;

const defaultSettings = {
  pluginEnabled: true,
  customAndroHome: null, 
  componentPaths: JSON.stringify(defaultPathConfig, null, 4), 
  downloadUrls: JSON.stringify(defaultDownloadConfig, null, 4), 
  enableJavaCompletion: true,
  enableKotlinCompletion: true,
  enableXmlCompletion: true,
  enableSnippets: true,
  enableCustomSnippets: false,
  customSnippetPath: '',
  clangFormatStyle: 'Google', 
  clangFormatCustom: defaultCustomConfig,
};

function getSettings() {
  let pluginSettings = appSettings.value[plugin.id];
  if (!pluginSettings) {
    pluginSettings = { ...defaultSettings };
    appSettings.value[plugin.id] = pluginSettings;
    appSettings.update(false);
    return pluginSettings;
  }
  
  // Migration logic
  let changed = false;
  for (const key in defaultSettings) {
    if (!Object.prototype.hasOwnProperty.call(pluginSettings, key)) {
      pluginSettings[key] = defaultSettings[key];
      changed = true;
    }
  }
  if (changed) appSettings.update(false);
  return pluginSettings;
}

// Settings UI List
const settingsList = [
  {
    key: 'pluginEnabled',
    text: 'Enable Android Builder',
    checkbox: getSettings().pluginEnabled,
    info: 'Globally enable or disable all features of this plugin.'
  },
  
  // --- EXPORT SECTION ---
  // If you bought this on Play Store but need to use it on F-Droid version
  {
      key: 'btnExportPlugin',
      text: 'Export Plugin (Save as ZIP)',
      info: 'Creates "aidpro.zip" in Download folder. Install this zip in Acode (F-Droid).',
      checkbox: false // Button behaviour
  },
  
  // --- PATH CONFIGURATION SECTION ---
  // Setup paths for Android SDK, Gradle and Java
  {
    key: 'androHomeMethod', 
    text: 'Change Android Home',
    value: '', 
    select: [
      ["select_folder", "Select Folder (File Browser)"],
      ["manual_input", "Manual Input (Type Path)"]
    ],
    info: 'Choose how you want to set the Android Home directory.'
  },
  {
    key: 'componentPaths',
    text: 'Component Paths (JSON)',
    prompt: 'Edit Component Paths',
    promptType: 'textarea',
    value: getSettings().componentPaths,
    info: 'Edit paths for Java, Gradle, etc. using variables ${ANDRO_HOME} and ${TERM_HOME}.'
  },
  {
    key: 'downloadUrls',
    text: 'Download URLs (JSON)',
    prompt: 'Edit Download Links',
    promptType: 'textarea',
    value: getSettings().downloadUrls,
    info: 'Customize direct download links for SDK, Gradle, and AAPT2.'
  },
  {
    key: 'btnResetPaths',
    text: 'Reset Paths & URLs to Default',
    info: 'Click to reset Android Home, Paths and Download URLs to original settings.',
    checkbox: false 
  },
  // ... Completion & Formatter settings ...
  {
    key: 'enableJavaCompletion',
    text: 'Enable Java Completion',
    checkbox: getSettings().enableJavaCompletion,
    info: 'Suggest completions for .java files.'
  },
  {
    key: 'enableKotlinCompletion',
    text: 'Enable Kotlin Completion',
    checkbox: getSettings().enableKotlinCompletion,
    info: 'Suggest completions for .kt files.'
  },
  {
    key: 'enableXmlCompletion',
    text: 'Enable XML Completion',
    checkbox: getSettings().enableXmlCompletion,
    info: 'Suggest completions for .xml files.'
  },
  {
    key: 'enableSnippets',
    text: 'Enable Default Snippets',
    checkbox: getSettings().enableSnippets,
    info: 'Suggest built-in code snippets (e.g. sout, psvm, fun).'
  },
  {
    key: 'enableCustomSnippets',
    text: 'Enable Custom Snippets',
    checkbox: getSettings().enableCustomSnippets,
    info: 'Load snippets from your custom folder.'
  },
  {
    key: 'runSnippetPathSelector',
    text: 'Set Custom Snippet Folder',
    value: (() => {
      const path = getSettings().customSnippetPath;
      if (!path) return 'Click to select folder';
      const short = path.includes('::') ? path.split('::').pop() : path.split('/').pop();
      return `::${short}`;
    })(),
    info: 'Select a folder to store and load your custom snippets.'
  },
  {
    key: 'clangFormatStyle',
    text: 'Formatter Style Preset',
    value: getSettings().clangFormatStyle,
    select: [
      ["Google", "Google (Standard Android)"],
      ["LLVM", "LLVM"],
      ["Mozilla", "Mozilla"],
      ["Chromium", "Chromium"],
      ["Microsoft", "Microsoft"]
    ],
    info: "Choose a built-in formatting style."
  },
  {
    key: 'clangFormatCustom',
    text: 'Custom Format Style (JSON/YAML)',
    value: getSettings().clangFormatCustom,
    prompt: 'Edit Custom Format Style',
    promptType: 'textarea',
    info: "Edit the values below to customize your code style."
  }
];

// Change Handler
async function onSettingsChange(key, value) {
  const settings = getSettings();

  // --- NEW: Handle Export Button ---
  if (key === 'btnExportPlugin') {
      await exportPluginToZip();
      return;
  }

  // --- Handle Android Home Selection Method ---
  if (key === 'androHomeMethod') {
      if (value === 'select_folder') {
          await selectAndroHome();
      } else if (value === 'manual_input') {
          showManualPathModal();
      }
      return; 
  }

  // Handle Reset
  if (key === 'btnResetPaths') {
      resetPathSettings();
      return; 
  }

  if (key === 'runSnippetPathSelector') {
    selectCustomSnippetPath(); 
    return;
  }
  
  // Validation for JSON Fields
  if (key === 'componentPaths' || key === 'downloadUrls') {
      try {
          JSON.parse(value); 
      } catch (e) {
          window.toast('Invalid JSON format! Changes not saved.', 3000);
          return;
      }
  }

  // Save regular settings
  settings[key] = value;
  appSettings.update();
  
  // Dynamic Update for globals
  if (key === 'customAndroHome' && value) {
      window.ANDRO_HOME = value;
  }
  
  if (key === 'customSnippetPath' || key === 'enableCustomSnippets') {
    clearSnippetCache();
  }
}

export {
  getSettings,
  settingsList,
  onSettingsChange
};