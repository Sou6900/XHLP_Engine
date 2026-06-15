// setupWizard.js
import plugin from '../../plugin.json';
import { pageStyles } from '../styles/styles.js';
import { getSetupScript } from './setupScript.js';
import { setSetupComplete , getMissingComponents} from './envCheck.js';
import { writeShared } from '../services/terminalManager.js'; 
import { showBuilderPage } from '../generation/bundle/builderPage.js';
import { assets } from '../assets/assets.js';
// Updated Import: Added selectAndroHome
import { getResolvedPaths, selectAndroHome } from '../services/pathManager.js'; 

export async function initSetupWizard(rootElement) {
  const fs = acode.require('fs');
  
  // Paths
  const workDirShell = window.ANDRO_HOME; 
  
  // --- TOOLBAR MANAGEMENT ---
  const quickTools = document.querySelector('#quick-tools');
  const quickToolsToggler = document.querySelector('#quicktools-toggler');

  function updateToolbarVisibility() {
      const file = editorManager.activeFile;
      if (file && (file.uri || file.location)) {
          if (quickTools) quickTools.style.display = '';
          if (quickToolsToggler) quickToolsToggler.style.display = '';
      } else {
          if (quickTools) quickTools.style.display = 'none';
          if (quickToolsToggler) quickToolsToggler.style.display = 'none';
      }
  }

  if (quickTools) quickTools.style.display = 'none';
  if (quickToolsToggler) quickToolsToggler.style.display = 'none';
  editorManager.on('switch-file', updateToolbarVisibility);

  // Shell Paths
  const scriptName = 'setup.sh';
  const scriptPathShell = `${workDirShell}/${scriptName}`;
  
  // Log paths for reading (Ensuring file:// prefix)
  const logPathUrl = `file://${workDirShell}/setup_log.txt`;
  const statusPathUrl = `file://${workDirShell}/setup_status.txt`;
  
  const logPathShell = `${workDirShell}/setup_log.txt`;
  const statusPathShell = `${workDirShell}/setup_status.txt`;

  // ---------------- UI RENDERERS ---------------- //

  function renderWelcome() {
    // Check if ANDRO_HOME is set, otherwise show placeholder
    const currentHome = window.ANDRO_HOME || 'Not set';

    rootElement.innerHTML = `
      <div class="andro-wizard-container">
        <div class="andro-wizard-header">
           <img src="${assets.head}" style="width:20px;"> Android Builder Setup Wizard
        </div>
        <div class="andro-wizard-body">
           <div class="andro-wizard-title">Welcome back!</div>
           <div class="andro-wizard-text">
             This setup wizard will validate your current Android SDK and development environment setup. 
           </div>
           
           <div style="margin-top:15px; padding:10px; background:var(--secondary-color); border-radius:4px; font-size:0.8rem;">
              <strong>Installation Location:</strong><br>
              <span style="color:var(--link-color); word-break:break-all; font-weight: bold;">${currentHome}</span>
              
              <div style="margin-top: 8px; margin-bottom: 8px;">
                <span id="wiz-change-path" style="color: var(--link-color); text-decoration: underline; cursor: pointer; opacity: 0.9;">
                    Want to select custom android home?
                </span>
              </div>

              <em style="opacity:0.7;">Make sure this folder exists and is writable.</em>
           </div>
        </div>
        
        <div class="andro-wizard-footer">
           <button class="andro-wiz-btn btn-secondary" id="wiz-cancel">Cancel</button>
           <button class="andro-wiz-btn btn-primary" id="wiz-next">Next</button>
        </div>
      </div>
    `;
    
    rootElement.querySelector('#wiz-change-path').onclick = async () => {
        await selectAndroHome();
        renderWelcome(); 
    };

    rootElement.querySelector('#wiz-cancel').onclick = () => window.toast('Setup is required!', 2000);
    rootElement.querySelector('#wiz-next').onclick = renderVerifySettings;
  }

  // VERIFY SETTINGS 
  async function renderVerifySettings() {
    rootElement.innerHTML = `<div style="color:var(--primary-text-color);text-align:center;padding:50px;">Checking system status...</div>`;

    const missingItems = await getMissingComponents();
    
    let listHtml = '';
    let totalDownloadSize = 0.0;
    let totalInstallSize = 0.0;

    if (missingItems.length === 0) {
        listHtml = `<div class="andro-setup-item" style="color:#4CAF50;"><span>All components are present!</span><span>Verifying...</span></div>`;
    } else {
        missingItems.forEach(item => {
            if (item.rawSize) totalDownloadSize += item.rawSize;
            if (item.installSize) totalInstallSize += item.installSize;

            listHtml += `
              <div class="andro-setup-item">
                <span>${item.name}</span>
                <span class="andro-setup-size">${item.size}</span>
              </div>
            `;
        });
    }

    const fmtDownload = totalDownloadSize.toFixed(1) + " MB";
    let fmtInstall = totalInstallSize > 1000 
        ? "~" + (totalInstallSize / 1024).toFixed(2) + " GB" 
        : "~" + totalInstallSize.toFixed(0) + " MB";

    rootElement.innerHTML = `
      <div class="andro-wizard-container">
        <div class="andro-wizard-header">
           <img src="${assets.head}" style="width:20px;"> Verify Settings
        </div>
        <div class="andro-wizard-body" style="text-align: left;">
           <div style="margin-bottom:10px; font-weight:bold;">The following components will be installed/verified:</div>
           
           <div class="andro-setup-list">
              ${listHtml}
              
              <div class="andro-list-separator"></div>
              
              <div class="andro-setup-item" style="font-weight: bold; color: var(--link-color);">
                 <span>Total Download:</span>
                 <span>${fmtDownload}</span>
              </div>
              <div class="andro-setup-item" style="font-weight: bold; color: var(--secondary-text-color);">
                 <span>Est. Disk Usage:</span>
                 <span>${fmtInstall}</span>
              </div>
           </div>

           <div style="font-size:0.8rem; color:var(--secondary-text-color);">
             Target: ${window.ANDRO_HOME}
           </div>
        </div>
        <div class="andro-wizard-footer">
           <button class="andro-wiz-btn btn-secondary" id="wiz-prev">Previous</button>
           <button class="andro-wiz-btn btn-primary" id="wiz-finish">Install</button>
        </div>
      </div>
    `;

    rootElement.querySelector('#wiz-prev').onclick = renderWelcome;
    rootElement.querySelector('#wiz-finish').onclick = startInstallation;
  }

  // INSTALLATION SCREEN
  function renderInstallScreen() {
    rootElement.innerHTML = `
      <div class="andro-wizard-container">
        <div class="andro-wizard-header">
           <img src="${assets.head}" style="width:20px;"> Implementing Components
        </div>
        <div class="andro-wizard-body" style="text-align: left; justify-content: flex-start;">
           
           <div class="andro-progress-area">
             <div class="andro-progress-label" id="prog-title">Starting setup...</div>
             <div class="andro-progress-sub" id="prog-sub">Initializing...</div>
             <div class="andro-progress-track">
                <div class="andro-progress-fill" id="prog-bar"></div>
             </div>
             
             <button class="andro-wiz-btn btn-secondary" style="font-size:0.8rem; padding:5px 10px;" id="btn-details">Show Details</button>
           </div>

           <div class="andro-details-box" id="details-box">Initializing logs...</div>

        </div>
        <div class="andro-wizard-footer">
           <button class="andro-wiz-btn btn-disabled" id="wiz-done" disabled>Finish</button>
        </div>
      </div>
    `;

    const detailsBox = rootElement.querySelector('#details-box');
    rootElement.querySelector('#btn-details').onclick = (e) => {
        if(detailsBox.style.display === 'none' || !detailsBox.style.display) {
            detailsBox.style.display = 'block';
            e.target.innerText = 'Hide Details';
        } else {
            detailsBox.style.display = 'none';
            e.target.innerText = 'Show Details';
        }
    };
  }

  //: Unicode Safe Base64 Encoding & Folder Creation
  async function startInstallation() {
    renderInstallScreen();
    
    // 1. Get script content
    const scriptContent = getSetupScript(logPathShell, statusPathShell);
    
    // 2. Encode to Base64 (Unicode Safe)
    const b64Script = btoa(unescape(encodeURIComponent(scriptContent)));

    try {
      // 3. Create Command
      const cmd = `
        mkdir -p "${workDirShell}" && \
        echo "${b64Script}" | base64 -d > "${scriptPathShell}" && \
        chmod +x "${scriptPathShell}" && \
        echo "0:Starting..." > "${statusPathShell}" && \
        sh "${scriptPathShell}"
      `;

      // 4. Initialize Logs (With Folder Creation Fix)
      try {
          const homeUrl = `file://${window.ANDRO_HOME}`;
          
          // ---  Check & Create Folder if missing ---
          if (!await fs(homeUrl).exists()) {
              // Path parsing logic
              const pathParts = window.ANDRO_HOME.split('/');
              const folderName = pathParts.pop(); 
              const parentPath = pathParts.join('/'); 
              const parentUrl = `file://${parentPath}`;

              // Check parent, create child if needed
              if (await fs(parentUrl).exists()) {
                  await fs(parentUrl).createDirectory(folderName);
              }
          }

          if (!await fs(logPathUrl).exists()) await fs(homeUrl).createFile('setup_log.txt', 'Wait...');
          if (!await fs(statusPathUrl).exists()) await fs(homeUrl).createFile('setup_status.txt', '0:Init');
          
      } catch(err) {
          console.warn("FS Log init warning:", err);
      }

      // 5. Execute
      await writeShared(cmd + "\r");

      monitorProgress();
    } catch (err) {
      window.toast('Error: ' + err.message, 4000);
    }
  }

  function monitorProgress() {
    const $bar = rootElement.querySelector('#prog-bar');
    const $title = rootElement.querySelector('#prog-title');
    const $sub = rootElement.querySelector('#prog-sub');
    const $logs = rootElement.querySelector('#details-box');
    const $btnFinish = rootElement.querySelector('#wiz-done');

    const interval = setInterval(async () => {
       try {
         // Read Status
         if (await fs(statusPathUrl).exists()) {
             const statusContent = await fs(statusPathUrl).readFile('utf-8');
             const lines = statusContent.trim().split('\n');
             const lastLine = lines[lines.length - 1]; 
             
             if (lastLine) {
                 const [percent, msg] = lastLine.split(':');
                 if(percent) $bar.style.width = `${percent}%`;
                 if(msg) $sub.innerText = msg;
                 
                 if(parseInt(percent) >= 100) {
                     $title.innerText = "Setup Complete!";
                     $bar.style.backgroundColor = "#4CAF50"; 
                 }
                 
                 if (lastLine.includes('Error')) {
                     $title.innerText = "Installation Failed";
                     $bar.style.backgroundColor = "#F44336"; 
                 }
             }

             // Completion Logic
             const lastStatus = lines[lines.length - 1] || "";
             if (lastStatus.startsWith('100') || lastStatus.includes('Error')) {
                clearInterval(interval);
                $btnFinish.disabled = false;
                $btnFinish.classList.remove('btn-disabled');
                $btnFinish.classList.add('btn-primary');
                
                if(!lastStatus.includes('Error')) {
                    setSetupComplete(); 
                    $btnFinish.onclick = () => {
                        showBuilderPage(); 
                    };
                }
             }
         }

         // Read Logs
         if (await fs(logPathUrl).exists()) {
             const logContent = await fs(logPathUrl).readFile('utf-8');
             $logs.innerText = logContent;
             $logs.scrollTop = $logs.scrollHeight;
         }

       } catch (e) {
           // File might not be created yet
       }
    }, 1000);
  }

  renderWelcome();
}