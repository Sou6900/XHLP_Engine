import { getSettings } from './settings.js';
import { javaSnippets, kotlinSnippets, xmlSnippets } from './snippets.js';

const fs = acode.require('fs');
const Url = acode.require('Url');
const toast = acode.require('toast');
const fileBrowser = acode.require('fileBrowser');

const CUSTOM_SNIPPET_FILENAME = 'android_snippets.json';

// Default Structure
const defaultSnippets = {
  java: javaSnippets || [],
  kotlin: kotlinSnippets || [],
  xml: xmlSnippets || []
};

export async function getDynamicSnippets(language) {
  const settings = getSettings();
  
  // console.log(`[AndroidBuilder] Fetching snippets for: ${language}`);

  // 1. If Custom Snippets Disabled -> Return Defaults
  if (!settings.enableCustomSnippets) {
    // console.log("[AndroidBuilder] Using Default Snippets");
    return defaultSnippets[language] || [];
  }

  const path = settings.customSnippetPath;
  if (!path) {
    // console.log("[AndroidBuilder] ⚠ Custom Snippet Enabled but No Path Set. Using Defaults.");
    return defaultSnippets[language] || [];
  }

  // 2. Load from File
  try {
    const fileUrl = Url.join(path, CUSTOM_SNIPPET_FILENAME);
    if (await fs(fileUrl).exists()) {
       const content = await fs(fileUrl).readFile('utf-8');
       const parsed = JSON.parse(content);
      // console.log("[AndroidBuilder] Custom Snippets Loaded from file");
       return parsed[language] || defaultSnippets[language];
    } else {
        // console.log("[AndroidBuilder] ⚠ Snippet File not found at path");
    }
  } catch (e) {
    console.error("[AndroidBuilder] ❌ Snippet Load Error:", e);
  }

  return defaultSnippets[language] || [];
}

export async function selectCustomSnippetPath() {
    try {
        const result = await fileBrowser('folder', 'Select Snippet Folder');
        if (result && result.url) {
            const folderUrl = result.url;
            const fileUrl = Url.join(folderUrl, CUSTOM_SNIPPET_FILENAME);
            
            if (!(await fs(fileUrl).exists())) {
                await fs(folderUrl).createFile(CUSTOM_SNIPPET_FILENAME, JSON.stringify(defaultSnippets, null, 2));
                toast('Created default snippet file');
            }
            
            const settings = getSettings();
            settings.customSnippetPath = folderUrl;
            acode.require('settings').update();
            toast('Folder Selected');
        }
    } catch(e) {
        // cancelled
    }
}