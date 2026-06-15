import { getFeatureComponents, getAllFeatures } from './featureData.js';
import { FeatureManager } from './FeatureManager.js';
import { FeatureState } from './ui/FeatureState.js';
import { FeatureRenderer } from './ui/FeatureRenderer.js';
import { FeatureLogic } from './ui/FeatureLogic.js';
import { Dropdown } from '../reusable/Dropdown.js';
import { Modal } from '../reusable/Modal.js';
import { pageStyles } from '../styles/styles.js'; 

export class FeatureStoreUI {
    constructor(projectRoot) {
        this.projectRoot = projectRoot;
        this.manager = new FeatureManager(projectRoot);
        
        this.state = new FeatureState();
        this.logic = new FeatureLogic(this.manager, this.state);
        this.renderer = new FeatureRenderer(this.manager, this.state);
        
        this.editorFile = null;
        this.$container = null; 
    }

    async show() {
        const EditorFile = acode.require('editorFile');
        this.$container = document.createElement('div');
        this.$container.className = 'andro-feature-store';
        
        const projectInfo = await this.manager.getProjectInfo();
        
        this.renderer.renderLayout(this.$container, projectInfo.packageName);

        this.editorFile = new EditorFile('Feature Store', {
            type: 'page',
            content: this.$container,
            id: 'android.feature.store',
            icon: 'extension',
            stylesheets: [pageStyles],
            tabIcon : 'icon aid-feature-icon',
        });

        this.bindEvents(this.$container);

        // Scan and Update
        await this.logic.scanProjectActivities();
        this.renderer.updateActivitySelector(this.$container);

        this.renderer.renderHome(this.$container); 
    }

    bindEvents($container) {
        // 1. Activity Selector
        const actSelector = $container.querySelector('#activity-selector');
        if(actSelector) {
            actSelector.onclick = () => {
                if(this.state.availableActivities.length === 0) {
                    window.toast('Re-scanning activities...');
                    this.logic.scanProjectActivities().then(() => this.renderer.updateActivitySelector(this.$container));
                    return;
                }
                const items = this.state.availableActivities.map(a => ({
                    label: a.name,
                    value: a.path,
                    isDefault: a.name.includes("Main")
                }));
                new Dropdown(items, {
                    placeholder: "Enter file path...",
                    btnText: "Select",
                    onSelect: (path) => {
                        this.logic.setTargetActivity(path);
                        this.renderer.updateActivitySelector(this.$container);
                        window.toast('Target Activity Updated');
                    }
                }).show(actSelector);
            };
        }

        // 2. Search Input
        const searchInput = $container.querySelector('#feature-search');
        let debounceTimer;
        searchInput.oninput = (e) => {
            const term = e.target.value.trim();
            clearTimeout(debounceTimer);
            this.state.renderToken++; 
            debounceTimer = setTimeout(() => {
                if (term.length === 0) this.renderer.renderHome($container);
                else this.renderList($container, term); // Use local renderList
            }, 300);
        };

        // 3. Main Click Delegation
        $container.addEventListener('click', async (e) => {
            // Home/Nav Actions
            if(e.target.id === 'btn-show-all') this.renderList($container, ""); // Use local renderList
            
            if(e.target.id === 'btn-view-perms') {
                $container.querySelector('#store-main-content').innerHTML = '<div style="padding:20px;text-align:center;">Reading...</div>';
                const perms = await this.manager.getInstalledPermissions();
                this.renderer.renderPermissions($container, perms);
            }

            // Snippet Item Click (Open View)
            const snipItem = e.target.closest('.snippet-item');
            if (snipItem) {
                e.stopPropagation();
                const fid = snipItem.dataset.fid;
                const sidx = snipItem.dataset.sidx;
                this.renderer.renderSnippetView(snipItem.closest('.feature-details'), fid, sidx);
                return;
            }

            // Push Snippet (Legacy/Quick Button if exists)
            const pushBtn = e.target.closest('.btn-push-snippet');
            if (pushBtn) {
                e.stopPropagation();
                const fid = pushBtn.dataset.fid;
                const sidx = pushBtn.dataset.sidx;
                
                const allData = getAllFeatures(); 
                const feature = allData[fid];
                
                if (feature && feature.snippets) {
                    const snippet = feature.snippets[sidx];
                    if(!this.state.targetActivity) {
                        window.toast("Please wait for activity scan or select manually", 3000);
                        return;
                    }
                    Modal.confirm("Push Snippet", `Inject "<b>${snippet.label}</b>" into ${this.state.targetActivity.split('/').pop()}?`)
                        .then(async (res) => {
                            if (res) {
                                const success = await this.logic.injectSnippet(snippet);
                                if (success) window.toast("Snippet Injected Successfully!");
                                else window.toast("Failed to inject snippet ❌");
                            }
                        });
                }
                return;
            }

            // ==========================================
            // PUSH ALL BUTTON
            // ==========================================
            const pushAllBtn = e.target.closest('.btn-push-all');
            if (pushAllBtn) {
                e.stopPropagation();
                const fid = pushAllBtn.dataset.fid;
                const sidx = pushAllBtn.dataset.sidx;
                const allData = getAllFeatures();
                const snippet = allData[fid].snippets[sidx];

                if(!this.state.targetActivity) {
                    window.toast("Please wait for activity scan or select manually", 3000);
                    return;
                }

                Modal.confirm("Push All?", "This will inject the activity logic and create/update all related files.")
                    .then(async (res) => {
                        if (res) {
                            const success = await this.logic.injectSnippet(snippet); 
                            if (success) {
                                window.toast("All snippets pushed!");
                                this.renderer.renderSnippetView(pushAllBtn.closest('.feature-details'), fid, sidx);
                            } else {
                                window.toast("Some injections failed. Check console.");
                            }
                        }
                    });
                return;
            }

            // ==========================================
            // PUSH SINGLE BUTTON
            // ==========================================
            const pushSingleBtn = e.target.closest('.btn-push-single');
            if (pushSingleBtn) {
                e.stopPropagation();
                const fid = pushSingleBtn.dataset.fid;
                const sidx = pushSingleBtn.dataset.sidx;
                const tidx = parseInt(pushSingleBtn.dataset.tidx);
                
                const allData = getAllFeatures();
                const snippet = allData[fid].snippets[sidx];
                const projectInfo = await this.manager.getProjectInfo();
                const lang = this.state.activityLanguage || 'java';

                if(!this.state.targetActivity) {
                    window.toast("No target activity selected", 3000);
                    return;
                }

                let taskConfig = null;
                let taskCounter = 0;

                if (snippet[lang]) {
                    if (taskCounter === tidx) {
                        taskConfig = { type: 'activity_logic', data: snippet[lang] };
                    }
                    taskCounter++;
                }

                if (!taskConfig && snippet.files) {
                    const fileIndex = tidx - taskCounter;
                    if (snippet.files[fileIndex]) {
                        taskConfig = snippet.files[fileIndex];
                    }
                }

                if (taskConfig) {
                    const success = await this.manager.injectSingleSnippetPart(
                        this.state.targetActivity, 
                        taskConfig, 
                        projectInfo
                    );
                    
                    if (success) {
                        window.toast("Item pushed successfully!");
                        this.renderer.renderSnippetView(pushSingleBtn.closest('.feature-details'), fid, sidx);
                    } else {
                        window.toast("Failed to push item ❌");
                    }
                }
                return;
            }

            // View Packages
            const viewPkgBtn = e.target.closest('.btn-view-packages');
            if (viewPkgBtn) {
                e.stopPropagation();
                this.renderer.renderPackageView(viewPkgBtn.closest('.feature-details'), viewPkgBtn.dataset.fid);
                return;
            }

            // Back Button inside Package/Snippet View
            const pkgBackBtn = e.target.closest('.pkg-back-btn');
            if (pkgBackBtn) {
                e.stopPropagation();
                const fid = pkgBackBtn.dataset.fid;
                const detailsDiv = pkgBackBtn.closest('.feature-details');
                if(this.state.activeFeatures[fid]) {
                    detailsDiv.innerHTML = this.renderer.renderComponents(this.state.activeFeatures[fid].components, fid);
                }
                return;
            }
        });

        // 4. Footer & Toolbar Actions
        $container.querySelector('#btn-store-back').onclick = () => this.renderer.renderHome($container);
        
        $container.querySelector('#btn-refresh').onclick = () => {
             const term = searchInput.value.trim();
             this.renderList($container, term);
             window.toast('Status Refreshed');
        };

        const btnClear = $container.querySelector('#btn-clear-marks');
        if(btnClear) btnClear.onclick = () => {
            if(this.state.pendingState.size === 0) {
                window.toast('No selections to clear');
                return;
            }
            Modal.confirm('Clear Selections?', 'Remove all marks?').then(res => {
                if(res) {
                    this.state.clearPending();
                    window.toast('All marks cleared');
                    const term = searchInput.value.trim();
                    if(term) this.renderList($container, term);
                }
            });
        };

        // 5. Apply Changes (Legacy)
        $container.querySelector('#btn-apply-features').onclick = async () => {
            const changes = await this.logic.calculateChanges();
            if (changes.length === 0) { window.toast('No changes selected'); return; }
            let html = '<div class="confirm-list">';
            changes.forEach(c => {
                const color = c.action === 'add' ? '#4caf50' : '#f44336';
                const sym = c.action === 'add' ? '+' : '-';
                let label = c.component.label || c.component.uniqueKey || 'Component';
                if(c.targetVersion) label += ` (${c.targetVersion})`;
                html += `<div class="change-item" style="color:${color}"><b>[${sym} ${c.action.toUpperCase()}]</b> ${label}<br><span style="opacity:0.6; font-size:0.75rem">in ${c.feature}</span></div>`;
            });
            html += '</div>';
            const confirmed = await Modal.confirm('Confirm Feature Changes', html);
            if(confirmed) {
                await this.manager.applyChanges(changes);
                this.state.clearPending();
                window.toast('Changes Applied!');
                const term = searchInput.value.trim();
                this.renderList($container, term || ""); 
            }
        };

        // 6. Checkbox Changes
        $container.addEventListener('change', (e) => {
            if(e.target.classList.contains('comp-cb')) {
                const fid = e.target.dataset.fid;
                const idx = parseInt(e.target.dataset.index);
                const component = this.state.activeFeatures[fid].components[idx];
                component._checked = e.target.checked;
                this.logic.updateState(fid, idx, e.target.checked, component._selectedVersion);
                this.updateParentCheckbox(e.target.closest('.feature-item'));
            }
            else if(e.target.classList.contains('feature-main-cb')) {
                const fid = e.target.dataset.fid;
                const isChecked = e.target.checked;
                if (this.state.activeFeatures[fid]) {
                    const components = this.state.activeFeatures[fid].components;
                    components.forEach((c, idx) => {
                        c._checked = isChecked;
                        const subCb = $container.querySelector(`.comp-cb[data-fid="${fid}"][data-index="${idx}"]`);
                        if(subCb) subCb.checked = isChecked;
                    });
                    this.logic.updateState(fid, -1, isChecked, null, components);
                }
            }
        });

        // 7. Expansion & Version Dropdown
        $container.addEventListener('click', (e) => {
            const head = e.target.closest('.feature-head');
            if (head && !e.target.classList.contains('feature-main-cb') && !e.target.closest('.feature-main-cb')) {
                const item = head.closest('.feature-item');
                item.querySelector('.feature-details').style.display = item.classList.toggle('expanded') ? 'block' : 'none';
                return;
            }
            const btn = e.target.closest('.version-btn');
            if (btn) {
                e.stopPropagation();
                const fid = btn.dataset.fid;
                const idx = parseInt(btn.dataset.index);
                const component = this.state.activeFeatures[fid].components[idx];
                if (!component.versions) return;
                new Dropdown(component.versions, {
                    onSelect: (ver) => {
                        btn.innerHTML = `${ver} <span style="font-size:8px;">▼</span>`;
                        component._selectedVersion = ver;
                        const cb = btn.closest('.comp-row-wrapper').querySelector('.comp-cb');
                        if (!cb.checked) cb.click(); 
                        else this.logic.updateState(fid, idx, true, ver);
                    }
                }).show(btn);
            }
        });
    }

    updateParentCheckbox(parentItem) {
        const mainCb = parentItem.querySelector('.feature-main-cb');
        const all = parentItem.querySelectorAll('.comp-cb');
        const checkedCount = parentItem.querySelectorAll('.comp-cb:checked').length;
        mainCb.checked = checkedCount === all.length && all.length > 0;
        mainCb.indeterminate = checkedCount > 0 && checkedCount < all.length;
    }

    async renderList($container, filterText = "") {
        this.renderer.state.currentView = 'list'; 
        const currentToken = ++this.state.renderToken;

        const content = $container.querySelector('#store-main-content');
        $container.querySelector('.store-footer').style.display = 'flex';
        $container.querySelector('.toolbar-actions').style.display = 'flex';
        
        content.innerHTML = '<div style="padding:20px; text-align:center; opacity:0.6;">Scanning Project...</div>';
        
        const listDiv = document.createElement('div');
        this.state.activeFeatures = {}; 
        
        const term = filterText.toLowerCase().trim();
        let allMatches = [];

        const featureStoreData = getAllFeatures(); // marged data

        for (const key in featureStoreData) {
            const feature = featureStoreData[key];
            let score = 0;
            if (term) {
                if (feature.title.toLowerCase().includes(term)) score += 100;
                else if (feature.category.toLowerCase().includes(term)) score += 20;
                else if (feature.description.toLowerCase().includes(term)) score += 10;
                if (score === 0) continue;
            } else { score = 1; }
            allMatches.push({ feature, score });
        }

        allMatches.sort((a, b) => b.score - a.score);
        const limit = term ? 50 : 20; 
        const results = allMatches.slice(0, limit);

        if (results.length === 0) {
            if (this.state.renderToken === currentToken) {
                content.innerHTML = `<div style="padding:20px; text-align:center; opacity:0.6;">No features found for "${filterText}"</div>`;
            }
            return;
        }

        for (const item of results) {
            if (this.state.renderToken !== currentToken) return;

            const feature = item.feature;
            const fid = feature.id;
            const $item = document.createElement('div');
            $item.className = 'feature-item';
            
            const components = getFeatureComponents(fid);
            
            let installedCount = 0;
            const userState = this.state.pendingState.get(fid) || {};

            for(let i = 0; i < components.length; i++) {
                if (this.state.renderToken !== currentToken) return;
                const comp = components[i];
                
                const status = await this.manager.checkComponentStatus(comp);
                comp._exists = status.installed;
                comp._currentVersion = status.version;
                
                if (userState[i]) {
                    comp._checked = userState[i].checked;
                    comp._selectedVersion = userState[i].version || comp.defaultVersion;
                } else {
                    comp._checked = status.installed;
                    comp._selectedVersion = status.version || comp.defaultVersion;
                }

                if(status.installed) installedCount++;
            }

            this.state.activeFeatures[fid] = { meta: feature, components: components };

            const isFullyInstalled = components.length > 0 && installedCount === components.length;
            
            // Logic for Snippet-Only features
            const isSnippetOnly = feature.category === "Snippets";

            $item.innerHTML = `
                <div class="feature-head">
                    <div class="feature-checkbox-wrapper">
                        ${!isSnippetOnly ? `
                        <input type="checkbox" class="feature-main-cb ${isFullyInstalled ? 'installed' : ''}" 
                            data-fid="${fid}" 
                            ${isFullyInstalled ? 'checked' : ''}>` : `<span style="font-size:1.2rem;">⚡</span>`}
                    </div>
                    <div class="feature-info">
                        <div class="feature-name">${feature.title} <span class="version-tag">${feature.category}</span></div>
                        <div class="feature-desc">${feature.description}</div>
                    </div>
                    <div class="feature-status">
                        ${isFullyInstalled ? '<span class="status-installed">INSTALLED</span>' : ''}
                    </div>
                    <span class="icon-expand">▼</span>
                </div>
                <div class="feature-details" style="display:none;">
                    ${this.renderer.renderComponents(components, fid)}
                </div>
            `;

            if(!isSnippetOnly) {
                const mainCb = $item.querySelector('.feature-main-cb');
                const checkedCount = components.filter(c => c._checked).length;
                mainCb.checked = checkedCount === components.length && components.length > 0;
                mainCb.indeterminate = checkedCount > 0 && checkedCount < components.length;
            }

            listDiv.appendChild($item);
        }

        if (this.state.renderToken === currentToken) {
            content.innerHTML = '';
            content.appendChild(listDiv);
        }
    }
}