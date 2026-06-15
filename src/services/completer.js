// xhlp completer.js
console.log("[AndroidBuilder-TRACE] 🚀 Hybrid Completer loaded (Ace + CM6)!");

import { getSettings } from './settings.js';
import { getDynamicSnippets } from './customSnippets.js'; 
import { javaKeywords, kotlinKeywords, xmlKeywords } from './keywords.js';

const cmState = acode.require('@codemirror/state'); 
const cmAutocomplete = acode.require('@codemirror/autocomplete'); 

let lastFetchedSnippets = null;
let lastSnippetPath = null;

// =======================================
// ACE EDITOR COMPLETION SOURCE
// =======================================
export const androidCompleter = {
    identifierRegexps: [/[a-zA-Z_0-9$:]+/],

    getCompletions: async function(editor, session, pos, prefix, callback) {
        const settings = getSettings();
        if (settings.pluginEnabled === false) return callback(null, []);

        const activeFile = editorManager.activeFile;
        const filename = activeFile ? activeFile.filename : "";
        
        let fileType = null;
        let keywordsList = [];

        if (filename.endsWith('.java')) {
            if (settings.enableJavaCompletion === false) return callback(null, []);
            fileType = 'java';
            keywordsList = javaKeywords;
        } else if (filename.endsWith('.kt')) {
            if (settings.enableKotlinCompletion === false) return callback(null, []);
            fileType = 'kotlin';
            keywordsList = kotlinKeywords;
        } else if (filename.endsWith('.xml')) {
            if (settings.enableXmlCompletion === false) return callback(null, []);
            fileType = 'xml';
            keywordsList = xmlKeywords;
        } else {
            return callback(null, []);
        }

        let allCompletions = [];

        if (settings.enableKeywords !== false) {
            allCompletions.push(...keywordsList.map(k => ({
                caption: k,
                value: k,
                meta: "keyword",
                score: 1000
            })));
        }

        if (settings.enableSnippets !== false) {
            try {
                const snippets = await getDynamicSnippets(fileType);
                if (snippets && Array.isArray(snippets)) {
                    allCompletions.push(...snippets.map(s => ({
                        caption: s.caption || s.name,
                        snippet: s.snippet || s.value,
                        meta: s.meta || "snippet",
                        type: "snippet",
                        score: 1100
                    })));
                }
            } catch (e) {
                console.error("[AndroidBuilder-TRACE] Ace Snippet Error:", e);
            }
        }

        callback(null, allCompletions);
    }
};

// =======================================
// CM6 COMPLETION SOURCE
// =======================================
export async function cm6CompletionSource(context) {
    const settings = getSettings();
    if (settings.pluginEnabled === false) return null;

    let word = context.matchBefore(/[a-zA-Z_0-9$:]*/);
    
    if (!word || (word.from === word.to && !context.explicit)) {
        return null;
    }

    const activeFile = editorManager.activeFile;
    const filename = activeFile ? activeFile.filename : "";

    let fileType = null;
    let keywordsList = [];

    if (filename.endsWith('.java')) {
        if (settings.enableJavaCompletion === false) return null;
        fileType = 'java';
        keywordsList = javaKeywords;
    } else if (filename.endsWith('.kt')) {
        if (settings.enableKotlinCompletion === false) return null;
        fileType = 'kotlin';
        keywordsList = kotlinKeywords;
    } else if (filename.endsWith('.xml')) {
        if (settings.enableXmlCompletion === false) return null;
        fileType = 'xml';
        keywordsList = xmlKeywords;
    } else {
        return null;
    }

    let options = [];

    // 1. Keywords
    if (settings.enableKeywords !== false) {
        keywordsList.forEach(kw => {
            options.push({ label: kw, type: "keyword", boost: 10 });
        });
    }

    // 2. Snippets
    if (settings.enableSnippets !== false) {
        try {
            console.log(`[AndroidBuilder-TRACE] ⏳ Fetching snippets for: ${fileType}...`);
            const snippets = await getDynamicSnippets(fileType);
            
            console.log(`[AndroidBuilder-TRACE] 📦 Fetched Snippets data:`, snippets);

            if (snippets && Array.isArray(snippets)) {
                snippets.forEach(s => {
                    const templateText = s.snippet || s.value || s.caption || s.name;
                    const labelText = s.caption || s.name;
                    
                    if (cmAutocomplete && typeof cmAutocomplete.snippetCompletion === 'function') {
                        options.push(
                            cmAutocomplete.snippetCompletion(templateText, {
                                label: labelText,
                                detail: s.meta || "snippet",
                                type: "snippet",
                                boost: 20
                            })
                        );
                    } else {
                        // Fallback
                        options.push({
                            label: labelText,
                            type: "text",
                            detail: s.meta || "snippet",
                            apply: templateText,
                            boost: 20
                        });
                    }
                });
            } else {
                console.log("[AndroidBuilder-TRACE] ⚠️ No valid snippets array returned!");
            }
        } catch (e) {
            console.error("[AndroidBuilder-TRACE] CM6 Snippet Error:", e);
        }
    }

    console.log(`[AndroidBuilder-TRACE] ✅ Success! Returning ${options.length} options.`);
    return {
        from: word.from,
        options: options,
        validFor: /^[a-zA-Z_0-9$:]*$/
    };
}

// =======================================
// HYBRID INJECTION LOGIC (ACE + CM6)
// =======================================
let completerCompartment = null;
let injectedStates = new WeakSet(); 

export function registerAndroidCompleter() {
    const editor = editorManager.editor;
    
    if (!editor) { 
        setTimeout(registerAndroidCompleter, 500); 
        return; 
    }

    const isCM6 = typeof editor.dispatch === 'function';

    if (isCM6) {
        if (!cmState || !cmAutocomplete || !editor.state) return;

        if (injectedStates.has(editor.state)) return;

        if (!completerCompartment) {
            completerCompartment = new cmState.Compartment();
        }

        const overrideExtension = cmAutocomplete.autocompletion({
            override: [cm6CompletionSource]
        });

        try {
            editor.dispatch({
                effects: cmState.StateEffect.appendConfig.of(completerCompartment.of(overrideExtension))
            });
            injectedStates.add(editor.state);
        } catch (e) {}
        
    } else {
        if (!editor.completers) editor.completers = [];
        if (!editor.completers.includes(androidCompleter)) {
            editor.completers.unshift(androidCompleter);
        }
    }
}

// =======================================
// CLEANUP & REMOVAL
// =======================================
export function clearSnippetCache() {
    lastFetchedSnippets = null;
    lastSnippetPath = null;
}

export function removeCompleter() {
    const editor = editorManager.editor;
    if (!editor) return;

    const isCM6 = typeof editor.dispatch === 'function';

    if (isCM6) {
        if (editor.state && completerCompartment) {
            const existingValue = completerCompartment.get(editor.state);
            if (existingValue !== undefined) {
                try {
                    editor.dispatch({ effects: completerCompartment.reconfigure([]) });
                } catch (e) {}
            }
        }
    } else {
        if (editor.completers) {
            const idx = editor.completers.indexOf(androidCompleter);
            if (idx !== -1) editor.completers.splice(idx, 1);
        }
    }
    clearSnippetCache();
}