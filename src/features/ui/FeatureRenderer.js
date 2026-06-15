import { getFeatureComponents, getAllFeatures } from '../featureData.js';
import { PACKAGES } from '../store/packages.js';
import { assets } from '../../assets/assets.js';
import { svgs } from '../../assets/icons/svg/svg.js';
import androidHello from '../../assets/icons/png/android_hello.png';

export class FeatureRenderer {
    constructor(manager, state) {
        this.manager = manager;
        this.state = state;
    }

    renderLayout(container, packageName) {
        container.innerHTML = `
            <div class="store-header">
                <img src="${assets.head}" class="store-logo" />
                <div class="store-title">
                    <h2>Feature Store</h2>
                    <p class="pkg-badge">${packageName}</p>
                </div>
            </div>
            <div class="activity-selector-bar">
                <div class="act-sel-label">Target:</div>
                <div class="act-dropdown-trigger" id="activity-selector">
                    <span id="current-activity-name">Scanning...</span>
                    <span class="act-lang-badge" id="activity-lang-badge">JAVA</span>
                    ${svgs.arrowDown || '▼'}
                </div>
            </div>
            <div class="store-toolbar">
                <input type="text" id="feature-search" placeholder="Search features..." />
                <div class="toolbar-actions" style="display:none;">
                    <button id="btn-clear-marks" class="store-icon-btn" title="Clear all">
                        ${svgs.remove || '✕'}
                    </button>
                    <button id="btn-refresh" class="store-icon-btn">${svgs.refresh}</button>
                    <button id="btn-apply-features" class="store-icon-btn">${svgs.play}</button>
                </div>
            </div>
            <div class="store-content" id="store-main-content"></div>
            <div class="store-footer" style="display:none;">
                <button id="btn-store-back" class="footer-back-btn">← Go Back</button>
            </div>
        `;
    }

    updateActivitySelector(container) {
        if (!container) return;

        const nameEl = container.querySelector('#current-activity-name');
        const badgeEl = container.querySelector('#activity-lang-badge');
        
        if (!nameEl) return;

        if (this.state.targetActivity) {
            const name = this.state.targetActivity.split('/').pop();
            nameEl.textContent = name;
            nameEl.style.fontStyle = 'normal';
            nameEl.style.opacity = '1';

            if(badgeEl) {
                badgeEl.style.display = 'inline-block';
                badgeEl.textContent = this.state.activityLanguage.toUpperCase();
                badgeEl.className = `act-lang-badge ${this.state.activityLanguage}`;
            }
        } else {
            nameEl.textContent = "No Activity Found";
            nameEl.style.fontStyle = 'italic';
            nameEl.style.opacity = '0.7';
            if(badgeEl) badgeEl.style.display = 'none';
        }
    }

    renderHome(container) {
        this.state.currentView = 'home';
        this.state.renderToken++; 
        
        const content = container.querySelector('#store-main-content');
        container.querySelector('.store-footer').style.display = 'none';
        container.querySelector('.toolbar-actions').style.display = 'none';
        container.querySelector('#feature-search').value = '';

        content.innerHTML = `
            <div class="store-empty-view">
                <img src="${androidHello}" class="empty-hero-img" />
                <h3 class="empty-title">Explore Capabilities</h3>
                <p class="empty-desc">Search above to add features like Maps, Firebase, and more.</p>
                <div class="empty-actions">
                    <button style="display:none;" id="btn-show-all" class="text-link-btn">View all available features</button> <!-- we don't want this is useless -->

                    <button id="btn-view-perms" class="text-link-btn">See used permissions</button>
                </div>
            </div>
        `;
    }

    async renderList(container, filterText = "") {
        this.state.currentView = 'list';
        const currentToken = ++this.state.renderToken;

        const content = container.querySelector('#store-main-content');
        container.querySelector('.store-footer').style.display = 'flex';
        container.querySelector('.toolbar-actions').style.display = 'flex';
        
        content.innerHTML = '<div style="padding:20px; text-align:center; opacity:0.6;">Scanning Project...</div>';
        
        const listDiv = document.createElement('div');
        this.state.activeFeatures = {}; 
        
        const term = filterText.toLowerCase().trim();
        let allMatches = [];

        const allFeatures = getAllFeatures(); 

        for (const key in allFeatures) {
            const feature = allFeatures[key];
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
        const limit = term ? 20 : 100;
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

            const isFullyInstalled = installedCount === components.length && components.length > 0;
            
            $item.innerHTML = `
                <div class="feature-head">
                    <div class="feature-checkbox-wrapper">
                        <input type="checkbox" class="feature-main-cb ${isFullyInstalled ? 'installed' : ''}" 
                            data-fid="${fid}" 
                            ${isFullyInstalled ? 'checked' : ''}>
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
                    ${this.renderComponents(components, fid)}
                </div>
            `;

            const mainCb = $item.querySelector('.feature-main-cb');
            const checkedCount = components.filter(c => c._checked).length;
            mainCb.checked = checkedCount === components.length && components.length > 0;
            mainCb.indeterminate = checkedCount > 0 && checkedCount < components.length;

            listDiv.appendChild($item);
        }

        if (this.state.renderToken === currentToken) {
            content.innerHTML = '';
            content.appendChild(listDiv);
        }
    }

    renderComponents(components, featureId) {
        let html = '';
        const groups = { dependency: [], permission: [], 'meta-data': [], string: [], file: [] };
        components.forEach((c, i) => { 
            c._index = i; 
            const type = groups[c.type] ? c.type : 'file';
            groups[type].push(c); 
        });

        for(const type in groups) {
            if(groups[type].length === 0) continue;
            html += `<div class="comp-group-title">${type.toUpperCase()}</div>`;
            groups[type].forEach(comp => {
                const isDynamic = comp.content && comp.content.includes('${version}');
                const displayVersion = comp._selectedVersion || comp._currentVersion || comp.defaultVersion || "";
                const hasVersionUI = isDynamic && comp.versions && comp.versions.length > 0;
                const installedClass = comp._exists ? 'installed' : '';

                html += `
                    <div class="comp-row-wrapper">
                        <label class="comp-row">
                            <input type="checkbox" class="comp-cb ${installedClass}" 
                                data-fid="${featureId}" 
                                data-index="${comp._index}"
                                ${comp._checked ? 'checked' : ''}>
                            <span class="comp-label">
                                <span class="comp-file">[${comp.type === 'dependency' ? 'gradle' : 'xml'}]</span>
                                ${comp.label || comp.uniqueKey}
                            </span>
                        </label>
                        ${hasVersionUI ? `
                            <button class="version-btn" data-fid="${featureId}" data-index="${comp._index}">
                                ${displayVersion} <span style="font-size:8px; margin-left:4px;">▼</span>
                            </button>` : ''}
                    </div>`;
            });
        }

        if (PACKAGES[featureId]) {
            html += `<div class="comp-group-title">PACKAGES</div>
                <button class="btn-view-packages" data-fid="${featureId}">See available packages</button>`;
        }

        const allFeatures = getAllFeatures(); 
        const feature = allFeatures[featureId];

        if (feature && feature.snippets && feature.snippets.length > 0) {
            html += `<div class="comp-group-title">SNIPPETS</div>`;
            feature.snippets.forEach((snip, idx) => {
                html += `
                    <div class="snippet-item" data-fid="${featureId}" data-sidx="${idx}">
                        <span class="snippet-icon">{ }</span>
                        <span class="snippet-label">${snip.label}</span>
                    </div>
                `;
            });
        }

        return html;
    }

    renderPackageView(container, featureId) {
        const pkgData = PACKAGES[featureId];
        if (!pkgData) return;
        let html = `<div class="package-view-container"><button class="pkg-back-btn" data-fid="${featureId}">${svgs.arrowBack}</button><div style="font-size:0.9rem; font-weight:bold; margin-bottom:15px; color:#a4c639;">Available Packages</div>`;
        const renderRecursive = (obj) => {
            let tree = '';
            for (const pkgName in obj) {
                const details = obj[pkgName];
                tree += `<div class="pkg-tree-root"><div class="pkg-name">📦 ${pkgName}</div>${details.description ? `<div class="pkg-desc">${details.description}</div>` : ''}<div class="pkg-content">${details.classes ? details.classes.map(c => `<div class="cls-item"><span class="cls-name">C ${c.name}</span> <span class="item-desc">- ${c.desc}</span></div>`).join('') : ''}${details.interfaces ? details.interfaces.map(i => `<div class="int-item"><span class="int-name">I ${i.name}</span> <span class="item-desc">- ${i.desc}</span></div>`).join('') : ''}${details.sub_packages ? Object.keys(details.sub_packages).map(subKey => `<div class="sub-pkg"><div class="sub-pkg-name">📂 ${subKey}</div><div class="pkg-content">${renderRecursive({ [subKey]: details.sub_packages[subKey] })}</div></div>`).join('') : '' }</div></div>`;
            }
            return tree;
        };
        html += renderRecursive(pkgData);
        html += `</div>`;
        container.innerHTML = html;
    }

    highlightCode(code, lang) {
        if (!code) return "";

        let safeCode = code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

        const tokens = [];
        const saveToken = (content, type) => {
            const id = `___TOKEN_${tokens.length}___`;
            tokens.push({ id, content, type });
            return id;
        };

        if (lang === 'xml' || safeCode.trim().startsWith('&lt;')) {
            safeCode = safeCode.replace(/(&lt;!--[\s\S]*?--&gt;)/g, m => saveToken(m, 'syn-com'));
            safeCode = safeCode.replace(/("[^"]*")/g, m => saveToken(m, 'syn-str'));
            safeCode = safeCode.replace(/(\s[a-zA-Z0-9:_\-\.]+=)/g, '<span class="syn-attr">$1</span>');
            safeCode = safeCode.replace(/(&lt;\/?[a-zA-Z0-9:_\-\.]+)/g, '<span class="syn-tag">$1</span>');
            
            tokens.forEach(token => {
                safeCode = safeCode.replace(token.id, `<span class="${token.type}">${token.content}</span>`);
            });
            return safeCode;
        }

        safeCode = safeCode
            .replace(/(\/\/.*)/g, m => saveToken(m, 'syn-com')) 
            .replace(/(\/\*[\s\S]*?\*\/)/g, m => saveToken(m, 'syn-com')) 
            .replace(/("[^"]*")/g, m => saveToken(m, 'syn-str')); 

        const keywords = "public|private|protected|class|interface|extends|implements|return|if|else|for|while|do|switch|case|break|continue|new|this|super|import|package|true|false|null|void|int|boolean|long|float|double|char|try|catch|finally|throw|throws|static|final|abstract|synchronized|volatile|transient|native|strictfp|val|var|fun|override|companion|object|data|sealed|lateinit|const|constructor|init";
        
        safeCode = safeCode
            .replace(new RegExp(`\\b(${keywords})\\b`, 'g'), '<span class="syn-kwd">$1</span>')
            .replace(/(@\w+)/g, '<span class="syn-ann">$1</span>') 
            .replace(/\b(\d+)\b/g, '<span class="syn-num">$1</span>'); 

        tokens.forEach(token => {
            safeCode = safeCode.replace(token.id, `<span class="${token.type}">${token.content}</span>`);
        });

        return safeCode;
    }

    async renderSnippetView(container, featureId, snippetIndex) {
        const allFeatures = getAllFeatures();
        const feature = allFeatures[featureId];

        if (!feature || !feature.snippets || !feature.snippets[snippetIndex]) return;
        
        const snip = feature.snippets[snippetIndex];
        const lang = this.state.activityLanguage || 'java';
        
        const projectInfo = await this.manager.getProjectInfo();

        const tasks = [];

        if (snip[lang]) {
            tasks.push({
                title: `${this.state.targetActivity.split('/').pop()} (${lang.toUpperCase()})`,
                desc: "Injects imports, lifecycle methods, and helpers.",
                code: snip[lang].lifecycle?.onCreate?.code || snip[lang].methods,
                type: 'activity_logic',
                data: snip[lang], 
                checkString: snip[lang].lifecycle?.onCreate?.code || "AID_START"
            });
        }

        if (snip.files) {
            snip.files.forEach(f => {
                tasks.push({
                    title: f.path.split('/').pop(), 
                    desc: f.action === 'create' ? `Create new file` : `Modify XML`,
                    code: f.content,
                    type: 'file',
                    path: f.path,
                    content: f.content,
                    action: f.action
                });
            });
        }

        let html = `
            <div class="package-view-container">
                <button class="pkg-back-btn" data-fid="${featureId}">${svgs.arrowBack}</button>
                
                <div class="snippet-header">
                    <div class="snippet-title-row">
                        <span class="snippet-view-title">${snip.label}</span>
                        <button class="btn-push-all" data-fid="${featureId}" data-sidx="${snippetIndex}">
                            Push All Snippets
                        </button>
                    </div>
                    <div class="snippet-desc">${snip.description || 'Adds code components to your project.'}</div>
                </div>
                
                <div class="snippet-tasks-list">
        `;

        for (let i = 0; i < tasks.length; i++) {
            const task = tasks[i];
            
            const isInstalled = await this.manager.checkSnippetPartStatus(
                this.state.targetActivity, 
                task, 
                projectInfo
            );

            let codeLang = 'java';
            if (task.path && task.path.endsWith('.xml')) codeLang = 'xml';
            else if (task.type === 'activity_logic') codeLang = lang; 

            const highlightedCode = this.highlightCode(task.code, codeLang);

            let displayPath = task.type === 'activity_logic' 
                ? "Target Activity" 
                : task.path.replace('{packageName}', projectInfo.packageName).replace('{res}', 'res');

            html += `
                <div class="snippet-task-card">
                    <div class="task-header">
                        <div class="task-info">
                            <div class="task-checkbox ${isInstalled ? 'checked' : ''}">
                                ${isInstalled ? svgs.checked : svgs.unchecked}
                            </div>
                            <div>
                                <div class="task-title">${task.title}</div>
                                <div class="task-path">${displayPath}</div>
                            </div>
                        </div>
                        <button class="btn-push-single" 
                            data-fid="${featureId}" 
                            data-sidx="${snippetIndex}" 
                            data-tidx="${i}">
                            ${isInstalled ? 'Update' : 'Push'}
                        </button>
                    </div>
                    <div class="code-preview-box">
                        <pre class="code-content">${highlightedCode}</pre>
                    </div>
                </div>
            `;
        }

        html += `</div></div>`;
        container.innerHTML = html;
    }

    renderPermissions(container, perms) {
        this.state.currentView = 'permissions';
        this.state.renderToken++;
        const content = container.querySelector('#store-main-content');
        container.querySelector('.store-footer').style.display = 'flex'; 
        container.querySelector('.toolbar-actions').style.display = 'none';
        
        if (perms.length === 0) {
            content.innerHTML = `<div class="store-empty-view"><h3 style="opacity:0.5;">No Permissions Found</h3></div>`;
            return;
        }
        let html = `<div style="padding: 10px;"><h3 style="margin-bottom:15px; color:#a4c639; font-size:1rem;">Active Permissions (${perms.length})</h3><div class="perm-list-container">`;
        perms.forEach(p => {
            const shortName = p.replace('android.permission.', '');
            html += `<div class="perm-list-item"><span class="perm-icon">🛡️</span><div class="perm-text"><div class="perm-name">${shortName}</div><div class="perm-full">${p}</div></div></div>`;
        });
        html += '</div></div>';
        content.innerHTML = html;
    }
}