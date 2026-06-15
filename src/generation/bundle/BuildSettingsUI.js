import plugin from '../../../plugin.json';
import { svgs } from '../../assets/icons/svg/svg.js';
import { assets } from '../../assets/assets.js';
import { pageStyles } from '../../styles/styles.js';
import { buildManager } from './buildManager.js';
import { keystoreManager } from './keystoreManager.js';
import { IconGenerationUI } from '../icon/IconGenerationUI.js';
import { FeatureStoreUI } from '../../features/FeatureStoreUI.js';

const fs = acode.require('fs');

export class BuildSettingsUI {
  constructor() {
    this.tabId = 'android.build.settings';
    this.editorFile = null;
    this.projectPath = '';
    this.gradlePropsData = []; 
    this.originalContent = ""; 
    
    // Suggestions Database
    this.knownProps = {
        "android.aapt2FromMavenOverride": [
            { val: `-/data/user/0/${window.ACODE_ID}/files/alpine/home/${plugin.id}/build-tools/34.0.0/aapt2`, desc: "Arm64 aapt2" },
        ],
        "org.gradle.jvmargs": [
        { val: "-Xmx2048m -Dfile.encoding=UTF-8", desc: "Boost (High RAM)" },
        { val: "-Xmx1536m -Dfile.encoding=UTF-8", desc: "Balanced (4GB RAM)" },
        { val: "-Xmx768m -Dfile.encoding=UTF-8", desc: "Save Memory (Low End)" },
        { val: "-Xmx768m -Dfile.encoding=UTF-8 -Dorg.gradle.native=false -Dorg.gradle.vfs.watch=false -Dorg.gradle.daemon=false -Dkotlin.compiler.execution.strategy=in-process", desc: "Save Memory (Safer Version)" }
        ],
        "org.gradle.parallel": [
            { val: "true", desc: "Enable Parallel Build" },
            { val: "false", desc: "Disable" }
        ],
        "org.gradle.daemon": [
            { val: "true", desc: "Keep Daemon Alive (Fast)" },
            { val: "false", desc: "Kill after build (Battery)" }
        ],
        "org.gradle.vfs.watch": [
            { val: "true", desc: "Watch File Changes" },
            { val: "false", desc: "Disable Watching" }
        ],
        "org.gradle.native": [
            { val: "false", desc: "Disable Native (Fix Crashes)" }
        ],
        "android.useAndroidX": [
            { val: "true", desc: "Use AndroidX Libs" }
        ],
        "android.enableJetifier": [
            { val: "true", desc: "Migrate 3rd party libs" }
        ],
        "kotlin.code.style": [
            { val: "official", desc: "Official Kotlin Style" }
        ]
    };
  }

  async show(rawPath) {
    this.projectPath = this.resolveProjectRoot(rawPath);
    // console.log("Resolved Project Root:", this.projectPath);
    const appDetails = await this.getAppDetails(this.projectPath);

    // Check if triggered from gradle.properties
    const isPropFile = rawPath.endsWith('gradle.properties');
    const hideStyle = isPropFile ? 'display: none !important;' : '';

    const EditorFile = acode.require('editorFile');
    
    // UI Container
    const $container = document.createElement('div');
    $container.className = 'andro-config-container';

    // Show Project Name & Package
    const packageDisplay = appDetails.packageName 
        ? `<div style="font-size: 0.85rem; color: rgb(76, 175, 80); margin-top: 5px; font-family: monospace; top: -120px; position: relative;">${appDetails.packageName}</div>` 
        : `<div style="font-size:0.85rem; color:#FF9800; margin-top:5px;top: -120px; position: relative;">⚠️ Package not found</div>`;
        

    $container.innerHTML = `
      <div style="text-align:center; margin-bottom:20px;">
          <img src="${assets.text}" class="config-logo" style="width:180px; height:auto; opacity:0.9;">
          <div class="config-title" style="margin-top: 10px; font-size: 1.2rem; top: -50px; position: relative;">${appDetails.projectName}</div>
          
          
          ${packageDisplay}
      </div>

      <div class="config-card">
         <div class="config-group">
            <label class="config-label">Build Variant</label>
            <div class="radio-grid">
               <label class="radio-item">
                  <input type="radio" name="variant" value="debug" checked id="radio-debug">
                  <div class="aid-radio-build">
                     <div style="font-weight:bold;">Debug</div>
                     <div style="font-size:0.75rem; opacity:0.7;">Auto Signed (Test)</div>
                  </div>
               </label>
               <label class="radio-item">
                  <input type="radio" name="variant" value="release" id="radio-release">
                  <div class="aid-radio-build">
                     <div style="font-weight:bold;">Release</div>
                     <div style="font-size:0.75rem; opacity:0.7;">Requires Keystore</div>
                  </div>
               </label>
            </div>
         </div>
         
         <div class="signing-section" id="signing-config">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                <label class="config-label" style="margin:0;">Keystore Details</label>
                <button class="btn-create-ks" id="btn-create-ks">Create New</button>
            </div>
            
            <div class="input-group">
                <label>Keystore Path</label>
                <div style="display:flex; gap:5px;">
                    <input type="text" id="ks-path" placeholder="/sdcard/my-key.jks">
                    <button class="btn-create-ks" style="margin:0;" id="btn-pick-ks">${svgs.folder}</button>
                </div>
            </div>
            <div class="input-group">
                <label>Keystore Password</label>
                <input type="password" id="ks-pass" placeholder="Store Password">
            </div>
            <div class="input-group">
                <label>Key Alias</label>
                <input type="text" id="ks-alias" placeholder="e.g. key0">
            </div>
            <div class="input-group">
                <label>Key Password</label>
                <input type="password" id="ks-key-pass" placeholder="Alias Password">
            </div>
         </div>

         <div class="config-group">
            <label class="config-label">Output Format</label>
            <div class="radio-grid">
               <label class="radio-item">
                  <input type="radio" name="format" value="apk" checked>
                  <div class="aid-radio-build">
                     <div style="font-weight:bold;">APK</div>
                     <div style="font-size:0.75rem; opacity:0.7;">Installable</div>
                  </div>
               </label>
               <label class="radio-item">
                  <input type="radio" name="format" value="aab">
                  <div class="aid-radio-build">
                     <div style="font-weight:bold;">AAB</div>
                     <div style="font-size:0.75rem; opacity:0.7;">Play Store</div>
                  </div>
               </label>
            </div>
         </div>
      </div>

      <div class="section-header" style="${hideStyle}">
         <div class="config-title" style="margin:0;">Gradle Properties</div>
         <div class="header-actions">
            <button class="btn-prop" id="btn-reset-gradle" title="Reset to Original">↺</button>
            <button class="btn-prop" id="btn-save-gradle">Save Changes</button>
         </div>
      </div>
      
      <div class="gradle-card" id="gradle-card-root" style="${hideStyle}">
         <div id="props-list-container">Loading properties...</div>
         <div id="suggestion-box" class="suggestion-box"></div>
      </div>

      <div class="section-header">
         <div class="config-title" style="margin:0;">Project Tools</div>
      </div>
      <div class="config-card">
         <div style="display:flex; justify-content:space-between; align-items:center; padding:10px 0; border-bottom:1px solid #333;">
             <div>
                 <div style="font-weight:bold;">App Icon</div>
                 <div style="font-size:0.75rem; opacity:0.7;">Set icon for your project</div>
             </div>
             <button class="btn-prop" id="btn-tool-icon">Set Icon</button>
         </div>
         <div style="display:flex; justify-content:space-between; align-items:center; padding:10px 0;">
             <div>
                 <div style="font-weight:bold;">Feature Store</div>
                 <div style="font-size:0.75rem; opacity:0.7;">Inject code snippets & features</div>
             </div>
             <button class="btn-prop" id="btn-tool-store">Open Store</button>
         </div>
      </div>

      <div class="config-actions">
         <button class="btn-build-cancel" id="btn-cancel">Cancel</button>
         <button class="btn-build-start" id="btn-start">Start Build</button>
      </div>
    `;

    // Open Tab
    const existing = acode.require('openFolder').find(this.tabId);
    if(existing) existing.remove();

    this.editorFile = new EditorFile('Build Settings', {
        type: 'page',
        content: $container,
        id: this.tabId,
        tabIcon: 'icon aid-gradle-icon',
        stylesheets: [pageStyles]
    });

    // --- Logic ---
    const signingSection = $container.querySelector('#signing-config');
    const radioDebug = $container.querySelector('#radio-debug');
    const radioRelease = $container.querySelector('#radio-release');
    
    radioDebug.onchange = () => signingSection.style.display = 'none';
    radioRelease.onchange = () => signingSection.style.display = 'block';

    $container.querySelector('#btn-pick-ks').onclick = async () => {
        const file = await acode.fileBrowser('file', 'Select Keystore');
        if (file) $container.querySelector('#ks-path').value = file.url;
    };

    $container.querySelector('#btn-create-ks').onclick = () => {
        this.showKeystoreGenerator($container);
    };

    // Tool Buttons Logic
    $container.querySelector('#btn-tool-icon').onclick = () => {
        new IconGenerationUI().show(rawPath);
    };

    $container.querySelector('#btn-tool-store').onclick = () => {
        new FeatureStoreUI(this.projectPath).show();
    };

    $container.querySelector('#btn-cancel').onclick = () => this.editorFile.remove();

    $container.querySelector('#btn-start').onclick = () => {
        const variant = $container.querySelector('input[name="variant"]:checked').value;
        const format = $container.querySelector('input[name="format"]:checked').value;
        
        let signingInfo = null;
        if (variant === 'release') {
            const path = $container.querySelector('#ks-path').value;
            const password = $container.querySelector('#ks-pass').value;
            const alias = $container.querySelector('#ks-alias').value;
            const aliasPass = $container.querySelector('#ks-key-pass').value;

            if (!path || !password || !alias || !aliasPass) {
                window.toast("Please fill all Keystore details for Release build", 4000);
                return;
            }
            signingInfo = { path, password, alias, aliasPass };
        }
        
        this.editorFile.remove();
        // Pass the resolved path to Build Manager
        buildManager.startBuild(rawPath, { variant, format, signingInfo });
    };

    this.initGradleEditor($container);
  }

// Multi-Path Search Strategy
  async getAppDetails(moduleRoot) {
      const fs = acode.require('fs');
      let packageName = null;
      let projectName = 'Android Project';

      console.log("%c[AppDetails] Debug Start", "color: cyan; font-weight: bold;");
      console.log("1. Raw Input:", moduleRoot);

      if (!moduleRoot) return { projectName, packageName };

      try {
          // --- STEP 1: Path Conversion ---
          let realPath = moduleRoot;
          
          if (realPath.includes('content://')) {
              try {
                  const decoded = decodeURIComponent(realPath);
                  const parts = decoded.split('primary:');
                  if (parts.length > 1) {
                      const lastPart = parts.pop(); 
                      realPath = '/sdcard/' + lastPart;
                  }
              } catch(e) {}
          } 
          
          if (realPath.startsWith('file://')) {
              realPath = realPath.replace('file://', '');
          }
          if (realPath.endsWith('/')) realPath = realPath.slice(0, -1);
          
          console.log("3. Real Path:", realPath);

          // --- STEP 2: Project Name ---
          const pathParts = realPath.split('/');
          let folderName = pathParts.pop(); 
          projectName = folderName;
          if(projectName) projectName = projectName.charAt(0).toUpperCase() + projectName.slice(1);
          
          console.log("4. Project Name:", projectName);

          // --- STEP 3: Get Manifest  ---
          const searchPaths = [
              `file://${realPath}/src/main/AndroidManifest.xml`,
              `file://${realPath}/app/src/main/AndroidManifest.xml`,
              `file://${realPath}/AndroidManifest.xml`         
          ];

          for (const url of searchPaths) {
              console.log("5. Checking:", url);
              
              try {
                  const fileEntry = fs(url);
                  if (await fileEntry.exists()) {
                      console.log("✅ Manifest Found at:", url);
                      
                      const content = await fileEntry.readFile('utf-8');
                      const packMatch = content.match(/package\s*=\s*["']([^"']+)["']/);
                      
                      if (packMatch && packMatch[1]) {
                          packageName = packMatch[1];
                          // console.log("Package Name:", packageName);
                      }
                      
                      break; 
                  }
              } catch (err) { }
          }

          if (!packageName) {
              console.warn("❌ Manifest NOT found in any common location.");
          }

      } catch (e) {
          console.error("🔥 Critical Logic Error:", e);
      }

      console.log("%c[AppDetails] Debug End", "color: cyan; font-weight: bold;");
      return { projectName, packageName };
  }
  resolveProjectRoot(path) {
      if (!path) return '';
      // Support for file:// trimming, but keep content:// intact for now
      let cleanPath = path.startsWith('file://') ? path.slice(7) : path;
      
      if (cleanPath.includes('/app/src')) return cleanPath.split('/app/src')[0];
      if (cleanPath.includes('/src')) {
           const beforeSrc = cleanPath.split('/src')[0];
           if (beforeSrc.endsWith('/app') || beforeSrc.endsWith('/app/')) {
               return beforeSrc.replace(/\/app\/?$/, '');
           }
           return beforeSrc;
      }
      if (cleanPath.endsWith('.java') || cleanPath.endsWith('.xml') || cleanPath.endsWith('.kt')) {
          return cleanPath.substring(0, cleanPath.lastIndexOf('/'));
      }
      return cleanPath;
  }

  // Gradle properties editor logic
  async initGradleEditor($container) {
      const propsPath = `${this.projectPath}/gradle.properties`;
      const $list = $container.querySelector('#props-list-container');
      const $btnSave = $container.querySelector('#btn-save-gradle');
      const $btnReset = $container.querySelector('#btn-reset-gradle');

      // DEFAULT PROPERTIES (Fallback)
      const defaultProps = `# Optimized by Android Builder
org.gradle.jvmargs=-Xmx768m -Dfile.encoding=UTF-8
android.useAndroidX=true
android.enableJetifier=true
android.nonTransitiveRClass=true
org.gradle.vfs.watch=false
org.gradle.native=false
`;

      try {
          const fsInterface = fs(propsPath);
          const fileExists = await fsInterface.exists();
          
          if (!fileExists) {
             await fsInterface.writeFile(defaultProps);
          }

          let content = await fsInterface.readFile('utf-8');
          
          if (typeof content !== 'string') throw new Error("File content is not text");

          // Detect Empty File and Populate Default
          if (!content.trim()) {
              content = defaultProps;
          }

          this.originalContent = content; // Store for Reset
          this.parseGradleContent(content);
          this.renderGradleList($list, $container);

      } catch (e) {
          $list.innerHTML = `<div style="color:red; font-size:0.8rem;">Error: ${e.message}</div>`;
      }

      // SAVE LOGIC: Filters out blank props
      $btnSave.onclick = async () => {
          const content = this.gradlePropsData.map(item => {
              if (item.type === 'comment') return item.value;
              
              // Remove if key or value is blank
              if (!item.key.trim() || !item.value.trim()) return null;

              return `${item.key}=${item.value}`;
          })
          .filter(line => line !== null) // Remove nulls
          .join('\n');

          try {
              await fs(propsPath).writeFile(content);
              this.originalContent = content; 
              window.toast("Gradle Settings Saved!");
              this.parseGradleContent(content); 
              this.renderGradleList($list, $container);
          } catch (e) {
              window.toast("Failed to save settings: " + e.message);
          }
      };

      // RESET LOGIC
      $btnReset.onclick = () => {
          this.parseGradleContent(this.originalContent);
          this.renderGradleList($list, $container);
          window.toast("Reset to original state");
      };
  }

  parseGradleContent(content) {
      if(!content) return; 
      this.gradlePropsData = content.split('\n').map((line, index) => {
          const trimmed = line.trim();
          // Detect Comment OR Blank line
          if (!trimmed || trimmed.startsWith('#')) {
              return { type: 'comment', value: trimmed, id: index };
          }
          const splitIdx = line.indexOf('=');
          if (splitIdx === -1) return { type: 'comment', value: line, id: index };
          
          return {
              type: 'property',
              key: line.substring(0, splitIdx).trim(),
              value: line.substring(splitIdx + 1).trim(),
              id: index
          };
      });
  }

  renderGradleList($list, $container) {
      $list.innerHTML = '';
      
      this.gradlePropsData.forEach((item, index) => {
          const row = document.createElement('div');
          
          if (item.type === 'comment') {
              if (!item.value.trim()) {
                  row.className = 'prop-row blank';
              } else {
                  row.className = 'prop-row comment';
                  row.innerHTML = `<input class="prop-comment-text" value="${item.value}" readonly>`;
              }
          } else {
              row.className = 'prop-row';
              row.innerHTML = `
                  <input class="prop-key" value="${item.key}" data-index="${index}" placeholder="Property">
                  <span class="prop-equals">=</span>
                  <input class="prop-value" value="${item.value}" data-index="${index}" placeholder="Value">
                  <button class="btn-prop-del" title="Delete Line">
                      <svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
                  </button>
              `;

              const keyInput = row.querySelector('.prop-key');
              const valInput = row.querySelector('.prop-value');
              const delBtn = row.querySelector('.btn-prop-del');

              keyInput.oninput = (e) => {
                  this.gradlePropsData[index].key = e.target.value;
                  this.showSuggestions(e.target, 'key', $container);
              };
              keyInput.onfocus = (e) => this.showSuggestions(e.target, 'key', $container);

              valInput.oninput = (e) => {
                  this.gradlePropsData[index].value = e.target.value;
                  this.showSuggestions(e.target, 'value', $container, this.gradlePropsData[index].key);
              };
              valInput.onfocus = (e) => this.showSuggestions(e.target, 'value', $container, this.gradlePropsData[index].key);

              delBtn.onclick = () => {
                  this.gradlePropsData.splice(index, 1);
                  this.renderGradleList($list, $container);
              };
          }
          $list.appendChild(row);
      });

      const addRow = document.createElement('div');
      addRow.className = 'add-row';
      addRow.innerHTML = `<button class="btn-add-prop" title="Add Property">+</button>`;
      
      addRow.querySelector('.btn-add-prop').onclick = () => {
          this.gradlePropsData.push({ type: 'property', key: '', value: '', id: Date.now() });
          this.renderGradleList($list, $container);
          
          setTimeout(() => {
              const inputs = $list.querySelectorAll('.prop-key');
              if(inputs.length > 0) inputs[inputs.length - 1].focus();
          }, 50);
      };
      
      $list.appendChild(addRow);

      document.addEventListener('click', (e) => {
          if (!e.target.closest('.prop-row') && !e.target.closest('.suggestion-box')) {
              this.hideSuggestions($container);
          }
      });
  }

  showSuggestions(input, type, $container, parentKey = null) {
      const box = $container.querySelector('#suggestion-box');
      const val = input.value.toLowerCase();
      let matches = [];

      if (type === 'key') {
          const keys = Object.keys(this.knownProps);
          matches = keys.filter(k => k.toLowerCase().includes(val)).map(k => ({ val: k, desc: '' }));
      } else if (type === 'value' && parentKey && this.knownProps[parentKey]) {
          matches = this.knownProps[parentKey].filter(v => v.val.toLowerCase().includes(val));
      }

      if (matches.length === 0) {
          this.hideSuggestions($container);
          return;
      }

      box.innerHTML = '';
      matches.forEach(item => {
          const div = document.createElement('div');
          div.className = 'suggestion-item';
          div.innerHTML = `<span class="sugg-main">${item.val}</span> <span class="sugg-desc">${item.desc}</span>`;
          
          div.onclick = () => {
              input.value = item.val;
              input.dispatchEvent(new Event('input'));
              this.hideSuggestions($container);
              
              if (type === 'key') {
                  const sibling = input.parentElement.querySelector('.prop-value');
                  if (sibling) sibling.focus();
              }
          };
          box.appendChild(div);
      });

      const rect = input.getBoundingClientRect();
      const card = $container.querySelector('.gradle-card');
      const cardRect = card.getBoundingClientRect();

      box.style.top = (rect.bottom - cardRect.top + card.scrollTop) + 'px';
      box.style.left = (rect.left - cardRect.left) + 'px';
      box.style.display = 'block';
  }

  hideSuggestions($container) {
      const box = $container.querySelector('#suggestion-box');
      if(box) box.style.display = 'none';
  }

  showKeystoreGenerator(parentContainer) {
      const $modal = document.createElement('div');
      $modal.className = 'andro-ks-modal';
      $modal.innerHTML = `
        <div class="andro-ks-content">
            <h3 style="margin-top:0; color:#fff;">Generate Keystore</h3>
            <div class="ks-form">
                <input id="gen-filename" placeholder="Filename (e.g. release_1.jks)" value="release_1.jks">
                <input id="gen-pass" type="password" placeholder="Password (min 6 chars)" value="123456">
                <input id="gen-alias" placeholder="Alias (e.g. key0)" value="key0">
                <input id="gen-cn" placeholder="Full Name (CN)" value="Android Dev">
                <input id="gen-o" placeholder="Organization (O)" value="World Organization">
            </div>
            <div class="ks-actions" style="margin-top:15px; text-align:right;">
                <button id="btn-ks-cancel">Cancel</button>
                <button id="btn-ks-gen">Generate</button>
            </div>
            <p style="font-size:0.75rem; color:#888; margin-top:10px;">Location: Project Root</p>
        </div>
      `;

      Object.assign($modal.style, {
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 9999,
          display: 'flex', justifyContent: 'center', alignItems: 'center'
      });
      
      const contentStyle = $modal.querySelector('.andro-ks-content').style;
      Object.assign(contentStyle, {
          background: '#252526', padding: '20px', 
          borderRadius: '2px', width: '85%', maxWidth: '350px', 
          boxShadow: '0 4px 15px rgba(0,0,0,0.5)'
      });

      $modal.querySelectorAll('input').forEach(el => {
          Object.assign(el.style, {
              width: '100%', padding: '8px', margin: '5px 0',
              background: '#333', border: '1px solid #444', color: '#fff', 
              outline:'none', height : '33px', borderRadius: '2px'
          });
      });

      const btnCancel = $modal.querySelector('#btn-ks-cancel');
      const btnGen = $modal.querySelector('#btn-ks-gen');
      
      Object.assign(btnCancel.style, { 
          padding: '8px 15px', border: 'none', background: '#555', color: '#fff', 
          marginRight: '10px', borderRadius: '2px'
      });
      
      Object.assign(btnGen.style, { 
          padding: '8px 15px', border: 'none', background: '#2196F3', color: '#fff', 
          borderRadius: '2px'
      });

      document.body.appendChild($modal);

      btnCancel.onclick = () => $modal.remove();

      btnGen.onclick = () => {
          const filename = document.getElementById('gen-filename').value || 'release.jks';
          const password = document.getElementById('gen-pass').value || '123456';
          const alias = document.getElementById('gen-alias').value || 'key0';
          const cn = document.getElementById('gen-cn').value || 'Android Dev';
          const o = document.getElementById('gen-o').value || 'Indie';

          $modal.remove();

          keystoreManager.createKeystore({
              path: this.projectPath.replace('file://', ''),
              filename, password, alias, aliasPass: password,
              dname: { cn, ou: 'Dev', o, l: 'City', st: 'State', c: 'US' }
          }, (fullPath) => {
               if(parentContainer && parentContainer.isConnected) {
                   const pathInput = parentContainer.querySelector('#ks-path');
                   const passInput = parentContainer.querySelector('#ks-pass');
                   const aliasInput = parentContainer.querySelector('#ks-alias');
                   const keyPassInput = parentContainer.querySelector('#ks-key-pass');

                   if(pathInput) pathInput.value = "file://" + fullPath;
                   if(passInput) passInput.value = password;
                   if(aliasInput) aliasInput.value = alias;
                   if(keyPassInput) keyPassInput.value = password;
               }
          });
      };
  }
}