// xhlp main.js
import plugin from '../plugin.json';
import { getSettings, settingsList, onSettingsChange } from './services/settings.js';
import buildExecutor from './initPlugin.js'; 
import { initFormatter, destroyFormatter } from './services/formatter.js';

import { registerAndroidCompleter, removeCompleter } from './services/completer.js';

import { CommandManager } from './commands/commands.js';
import './styles/styles.css'; 

window.ACODE_DIR = '' ;
window.ACODE_ID = '' ;
window.XHLP_PREVIEW_SCREEN = null ;

let baseUrl = '';
// Default internal path
let defaultAndroHome = '';

async function init($page, cacheFile, cacheFileUrl) {
    const settings = getSettings();
    if (!settings.pluginEnabled) return;
    
    // 1. Setup ID and Basic Dirs
    window.ACODE_DIR = PLUGIN_DIR.split("/files/plugins")[0];
    
    if(window.IS_FREE_VERSION){
      window.ACODE_ID =  'com.foxdebug.acodefree' ;
    } else {
      window.ACODE_ID =  'com.foxdebug.acode' ;
    }
    
    // 2. Setup Defaults
    defaultAndroHome = `/data/user/0/${window.ACODE_ID}/files/alpine/home/${plugin.id}`;
    window.ACODE_TERMINAL_HOME = `/data/user/0/${window.ACODE_ID}/files/alpine`;
    
    // 3. Determine ANDRO_HOME (User Custom or Default)
    if (settings.customAndroHome) {
        window.ANDRO_HOME = settings.customAndroHome;
    } else {
        window.ANDRO_HOME = defaultAndroHome;
    }
    
    // Debug Log
    // console.log("Android Home set to:", window.ANDRO_HOME);

    // init Commands
    await CommandManager.init();

    // init build btn & exc
    await buildExecutor.init();

    // init formatter & compiler
    if (baseUrl) initFormatter(baseUrl);
    
    registerAndroidCompleter();
}


function destroy() {
    CommandManager.destroy();
    if (buildExecutor) buildExecutor.destroy();
    destroyFormatter();
    removeCompleter();
}

if (window.acode) {
    acode.setPluginInit(plugin.id, async (_baseUrl, $page, { cacheFileUrl, cacheFile }) => {
        baseUrl = _baseUrl;
        setTimeout(async () => {
            await init($page, cacheFile, cacheFileUrl);
        }, 500);
    }, {
        list: settingsList,
        cb: onSettingsChange
    });
    acode.setPluginUnmount(plugin.id, () => {
        destroy();
    });
}