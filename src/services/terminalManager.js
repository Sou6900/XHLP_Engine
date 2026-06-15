// src/terminalManager.js
const terminal = acode.require('terminal');
const toast = acode.require('toast');

const TERMINAL_NAME = 'Android Service'; 
const STORAGE_KEY = 'android_builder_plugin_terminal_id'; 

let sharedTerminalId = null; 

/**
 * Execute command in background without opening terminal window.
 * Returns a Promise that resolves with the output (stdout).
 * * @param {string} command - The shell command to run.
 * @param {boolean} [isAlpine=true] - Run in Alpine (true) or Android Shell (false).
 */
export async function executeCommand(command, isAlpine = true) {
  try {
    const cleanCmd = command?.trim();
    if (!cleanCmd) return;

    const executor = window.Executor || terminal.Executor;

    if (!executor) {
      console.error("[Terminal] Executor API not found via window.Executor or terminal.Executor");
      toast("Error: Acode Executor API missing", 3000);
      throw new Error("Executor API missing");
    }

    console.log(`[Exec] Running: ${cleanCmd} (Alpine: ${isAlpine})`);

    const output = await executor.execute(cleanCmd, isAlpine);
    return output;

  } catch (err) {
    console.error(`[Exec] Failed: ${command}`, err);
    throw err; 
  }
}

/**
 * Get or create the shared interactive terminal.
 */
export async function getSharedTerminal(name = TERMINAL_NAME) {
  // 1. Check in-memory cache
  if (sharedTerminalId && terminal.get(sharedTerminalId)) {
    return terminal.get(sharedTerminalId);
  }

  // 2. Check localStorage
  const savedId = localStorage.getItem(STORAGE_KEY);
  if (savedId) {
    const existingTerm = terminal.get(savedId);
    if (existingTerm && existingTerm.name === name) {
      console.log(`[Terminal] Reusing from storage: ${savedId}`);
      sharedTerminalId = savedId;
      return existingTerm;
    } else {
      localStorage.removeItem(STORAGE_KEY);
      sharedTerminalId = null;
    }
  }

  // 3. Search existing by name
  try {
    const allTerminals = terminal.getAll();
    for (const [id, termInfo] of allTerminals.entries()) {
      if (termInfo && termInfo.name === name) {
        sharedTerminalId = id;
        localStorage.setItem(STORAGE_KEY, id);
        return terminal.get(id);
      }
    }
  } catch (err) {
    console.error("[Terminal] Error searching existing:", err);
  }

  // 4. Create new if not found
  console.log(`[Terminal] Creating new: ${name}`);
  try {
    const term = await terminal.createServer({ name });
    sharedTerminalId = term.id;
    localStorage.setItem(STORAGE_KEY, sharedTerminalId);
    await new Promise(resolve => setTimeout(resolve, 200)); 
    return term;
  } catch (createErr) {
    console.error("[Terminal] Create failed:", createErr);
    toast("Error: Could not create terminal.", 4000);
    throw createErr;
  }
}

/**
 * Write command to the visible shared terminal.
 * Auto-appends '\r' to execute the command immediately.
 */
export async function writeShared(command) {
  try {
    const term = await getSharedTerminal();
    if (term && term.id) {
      const cmdToRun = command.endsWith('\r') || command.endsWith('\n') 
        ? command 
        : command + '\r';
        
      terminal.write(term.id, cmdToRun);
    } else {
      console.error("[Terminal] Write failed: Terminal unavailable.");
      toast("Terminal Error: Cannot write command.", 3000);
    }
  } catch (err) {
    console.error("[Terminal] Error in writeShared:", err);
  }
}

/**
 * Close the shared terminal.
 */
export function closeShared() {
  const idToClose = sharedTerminalId || localStorage.getItem(STORAGE_KEY);

  if (idToClose) {
    try {
      if (terminal.get(idToClose)) {
        terminal.close(idToClose);
      }
    } catch (err) {}
  }
  sharedTerminalId = null;
  localStorage.removeItem(STORAGE_KEY);
}

export function getSharedTerminalId() {
  return sharedTerminalId || localStorage.getItem(STORAGE_KEY) || null;
}