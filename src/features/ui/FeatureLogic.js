import { getFeatureComponents } from '../featureData.js';
import { DATA as featureStoreData } from '../store/data.js';

const fs = acode.require('fs');

export class FeatureLogic {
    constructor(manager, state) {
        this.manager = manager;
        this.state = state;
    }

    updateState(fid, index, checked, version, components = null) {
        if (!this.state.pendingState.has(fid)) {
            this.state.pendingState.set(fid, {});
        }
        const featState = this.state.pendingState.get(fid);

        if (components) {
            components.forEach((comp, idx) => {
                featState[idx] = { 
                    checked: checked, 
                    version: comp._selectedVersion || comp.defaultVersion 
                };
            });
        } else {
            if (!featState[index]) featState[index] = {};
            featState[index].checked = checked;
            if (version) featState[index].version = version;
        }
    }

    async scanProjectActivities() {
        // console.log("FeatureLogic: Starting Activity Scan...");
        this.state.availableActivities = [];
        
        const { modulePath } = await this.manager.getProjectInfo();
        
        // Construct Path: root + modulePath + src/main/java
        const rootPath = (this.manager.root + "/" + modulePath + "src/main/java").replace(/([^:]\/)\/+/g, "$1");
        
        // console.log("FeatureLogic: Scanning Path ->", rootPath);
        
        try {
            // Check existence
            const dirEntry = fs(rootPath);
            if (!await dirEntry.exists()) {
                console.warn("⚠️ FeatureLogic: Java folder not found at:", rootPath);
            } else {
                await this._scanDir(rootPath);
            }

            // console.log("✅ FeatureLogic: Scan Complete. Found:", this.state.availableActivities.length);

            // Set Default Target
            if (!this.state.targetActivity && this.state.availableActivities.length > 0) {
                const main = this.state.availableActivities.find(a => a.name.includes("MainActivity"));
                const selected = main ? main.path : this.state.availableActivities[0].path;
                
                this.setTargetActivity(selected);
                // console.log("FeatureLogic: Target set to ->", selected);
            } 

        } catch (e) {
            console.error("❌ FeatureLogic: Scan Error", e);
            if(window.toast) window.toast("Activity Scan Error: " + e.message, 4000);
        }
    }

    async _scanDir(path) {
        try {
            const list = await fs(path).lsDir(); 
            for (const file of list) {
                if (file.isDirectory) {
                    await this._scanDir(file.url);
                } else if (file.name.endsWith('.java') || file.name.endsWith('.kt')) {
                    if (file.name.includes("Activity") || file.name === "MainActivity.java" || file.name === "MainActivity.kt") {
                        this.state.availableActivities.push({
                            name: file.name,
                            path: file.url,
                            lang: file.name.endsWith('.kt') ? 'kotlin' : 'java'
                        });
                    }
                }
            }
        } catch (err) {
            console.error("❌ FeatureLogic: Error reading dir ->", path, err);
        }
    }

    setTargetActivity(path) {
        this.state.targetActivity = path;
        this.state.activityLanguage = path.endsWith('.kt') ? 'kotlin' : 'java';
    }

    // ==========================================
    // UPDATED INJECT SNIPPET METHOD
    // ==========================================
    async injectSnippet(snippetData) {
        if (!this.state.targetActivity) {
            window.toast("No target activity selected!", 3000);
            return false;
        }
        
        try {
            // 1. Get Project Info
            const projectInfo = await this.manager.getProjectInfo();

            // 2. Use the new Multi-File Injection Manager
            const result = await this.manager.injectSnippetPackage(
                this.state.targetActivity, 
                snippetData,
                projectInfo
            );
            
            return result;
        } catch (e) {
            console.error("❌ FeatureLogic: Injection Error", e);
            return false;
        }
    }

    async calculateChanges() {
        const changes = [];
        const relevantFeatures = new Set(this.state.pendingState.keys());
        
        for (const fid of relevantFeatures) {
            const userState = this.state.pendingState.get(fid);
            const components = getFeatureComponents(fid); 
            
            for(let i=0; i<components.length; i++) {
                if(!userState[i]) continue;

                const comp = components[i];
                // Only check status if it's NOT a code snippet
                const realStatus = await this.manager.checkComponentStatus(comp);
                
                const userChecked = userState[i].checked;
                const targetVer = userState[i].version || comp.defaultVersion;
                
                if (userChecked) {
                    if (!realStatus.installed) {
                        changes.push({ action: 'add', component: comp, feature: featureStoreData[fid].title, targetVersion: targetVer });
                    } else if (comp.content.includes('${version}') && targetVer && realStatus.version && targetVer !== realStatus.version) {
                        changes.push({ action: 'remove', component: comp, feature: `${featureStoreData[fid].title} (Upgrade)`});
                        changes.push({ action: 'add', component: comp, feature: `${featureStoreData[fid].title} (Upgrade)`, targetVersion: targetVer });
                    }
                } else if (!userChecked && realStatus.installed) {
                    changes.push({ action: 'remove', component: comp, feature: featureStoreData[fid].title });
                }
            }
        }
        return changes;
    }
}