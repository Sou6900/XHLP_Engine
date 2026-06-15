import plugin from '../../plugin.json';
import { getSettings } from './settings.js';
import init, { format } from "@wasm-fmt/clang-format";

const loader = acode.require('loader');
const toast = acode.require('toast');

let wasmInitialized = false;
let baseUrl = '';

function setValueToEditor(session, formattedCode) {
  const { $undoStack, $redoStack, $rev, $mark } = Object.assign({}, session.getUndoManager());
  session.setValue(formattedCode);
  const undoManager = session.getUndoManager();
  undoManager.$undoStack = $undoStack;
  undoManager.$redoStack = $redoStack;
  undoManager.$rev = $rev;
  undoManager.$mark = $mark;
}

export function initFormatter(_baseUrl) {
  baseUrl = _baseUrl;

  // register for Java and Kt
  acode.registerFormatter(plugin.id, ["java", "kt"], async () => {
    try {
      if (!wasmInitialized) {
        loader.showTitleLoader();
        console.log("[FORMATTER] Loading Wasm...");
        // Ensure 'clang-format.wasm' is in your plugin folder
        const wasmUrl = `${baseUrl}clang-format.wasm`; 
        await init(wasmUrl);
        wasmInitialized = true;
      }
      
      const { editor, activeFile } = editorManager;
      const { session } = activeFile;
      const code = editor.getValue();
      const settings = getSettings();
      
      let style = settings.clangFormatCustom || settings.clangFormatStyle || 'Google';
      
      loader.showTitleLoader();

      // Format
      const formattedCode = format(
        code,      
        activeFile.filename, // "Main.java" or "Main.kt"
        style      
      );

      setValueToEditor(session, formattedCode);
      
      loader.removeTitleLoader();
      window.toast("Formatted (Java/Kotlin)");

    } catch (error) {
      loader.removeTitleLoader();
      console.error("[FORMATTER]", error);
      acode.alert("Formatter Error", error.message);
    }
  });
}

export function destroyFormatter() {
  acode.unregisterFormatter(plugin.id);
}