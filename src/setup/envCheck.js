const fs = acode.require('fs');
import plugin from '../../plugin.json';
import { getResolvedPaths } from '../services/pathManager.js';

export async function getMissingComponents() {
  const missing = [];
  
  // 1. Get Resolved Objects (contains .path, .name, and .version)
  const components = getResolvedPaths(); 

  // Debugging
  console.log("Environment Check Paths:", JSON.stringify(components, null, 2));

  // Helper: Format Name with Version
  const formatName = (name, version) => {
      if (!version) return name;

      let displayVer = version;
      // android-34 -> 34
      if (displayVer.includes('-')) {
          displayVer = displayVer.split('-').pop();
      }
      
      return `${name} ${displayVer}`;
  };

  const addItem = (itemKey, dlLabel, dlVal, installVal) => {
      const item = components[itemKey];
      // Dynamic Name generation (Name + Formatted Version)
      const displayName = formatName(item.name, item.version);

      missing.push({ 
          name: displayName, 
          size: dlLabel,      
          rawSize: dlVal,     
          installSize: installVal 
      });
  };

  try {
    // --- CHECK JAVA ---
    if (!await checkExists(components.java.path)) {
        console.warn("Java NOT found at:", components.java.path);
        addItem('java', '~108 MB', 108.0, 239.0);
    }

    // --- CHECK GRADLE ---
    if (!await checkExists(components.gradle.path)) {
        console.warn("Gradle NOT found at:", components.gradle.path);
        addItem('gradle', '~134 MB', 134.0, 151.0);
    }

    // --- CHECK SDK TOOLS ---
    if (!await checkExists(components.sdkmanager.path)) {
        console.warn("SDK Tools NOT found at:", components.sdkmanager.path);
        addItem('sdkmanager', '~146 MB', 146.0, 425.0);
    }
    
    // --- CHECK BUILD TOOLS ---
    if (!await checkExists(components.buildTools.path)) {
        console.warn("Build Tools NOT found at:", components.buildTools.path);
        addItem('buildTools', '~100 MB', 100.0, 300.0);
    }
    
    // --- CHECK PLATFORM ---
    if (!await checkExists(components.platform.path)) {
        console.warn("Platform NOT found at:", components.platform.path);
        addItem('platform', '~51 MB', 51.0, 130.0);
        
        // Others (Hardcoded as it's a dependency of platform)
        missing.push({
            name: 'Others (AAPT2 & Libs)',
            size: '5.9 MB',
            rawSize: 5.9,
            installSize: 6.0
        });
    }
    
  } catch (e) {
      console.error("Env Check Critical Error:", e);
      return [{ name: 'Environment Setup Error', size: 'Check Logs', rawSize: 0, installSize: 0 }];
  }

  return missing;
}

// Helper Function: Robust File Check
async function checkExists(path) {
    if (!path) return false;

    try {
        // 1. Direct Check
        if (await fs(path).exists()) return true;
        
        // 2. Try removing 'file://' prefix
        if (path.startsWith('file://')) {
            const rawPath = path.replace('file://', '');
            if (await fs(rawPath).exists()) return true;
        }

        return false;
    } catch (e) {
        return false;
    }
}

export async function checkEnvironment() {
    const missing = await getMissingComponents();
    return missing.length === 0;
}

export function setSetupComplete() {
    localStorage.setItem('android_builder_setup_complete', 'true');    
}