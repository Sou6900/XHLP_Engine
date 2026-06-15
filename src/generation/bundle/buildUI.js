import { assets } from '../../assets/assets.js';
import { pageStyles } from '../../styles/styles.js';

import cupReady from '../../assets/icons/png/cup.png'; 
import cupMaking from '../../assets/icons/png/cup.gif'; 


export class BuildUI {
  constructor() {
    this.$container = null;
    this.tabId = 'android.build.output';
    this.editorFile = null;
  }

  show(onCancel) {
    const openFolder = acode.require('openFolder');
    const existing = openFolder.find(this.tabId);
    if(existing) {
        existing.remove();
    }
    
    this.$container = document.createElement('div');
    this.$container.className = 'andro-build-page';
    
    this.$container.innerHTML = `
      <div class="andro-build-header-sec">
         <div class="build-app-name">
            <span class="icon android"></span> <span id="header-app-name">Android Builder</span>
         </div>
         <button class="thin-download-btn" id="btn-main-action" style="display:none;">Action</button>
      </div>
      
      <div class="andro-build-body">
         <img src="${assets.text}" class="build-logo-large">
         
         <img src="${cupMaking}" class="build-logo-gif" id="status-icon">
         
         <div class="build-main-status" id="main-status">Starting...</div>
         
         <div class="build-progress-wrapper">
             <div class="build-sub-status" id="sub-status">Initializing...</div>
             <div class="andro-build-track">
                <div class="andro-build-bar" id="prog-bar"></div>
             </div>
         </div>

         <div style="margin-top: 15px; display: flex; gap: 10px;">
             <button class="btn-show-details" id="btn-details">Show Logs</button>
             <button class="btn-show-details" id="btn-stop" style="border-color: #F44336; color: #F44336;">Stop Build</button>
         </div>

         <div class="build-details-box" id="log-box"></div>
      </div>

      <div class="build-path-info" id="footer-info">
         Please wait while Gradle compiles your project.
      </div>
    `;

    const EditorFile = acode.require('editorFile');
    this.editorFile = new EditorFile('Build Output', {
        type: 'page',
        content: this.$container,
        id: this.tabId,
        tabIcon: 'icon aid-gradle-icon',
        stylesheets: [pageStyles]
    });

    const logBox = this.$container.querySelector('#log-box');
    const btnDetails = this.$container.querySelector('#btn-details');
    btnDetails.onclick = () => {
        if (logBox.style.display === 'block') {
            logBox.style.display = 'none';
            btnDetails.innerText = 'Show Logs';
        } else {
            logBox.style.display = 'block';
            btnDetails.innerText = 'Hide Logs';
        }
    };

    const btnStop = this.$container.querySelector('#btn-stop');
    btnStop.onclick = () => {
        if(onCancel) onCancel();
        btnStop.disabled = true;
        btnStop.innerText = "Stopping...";
        this.updateProgress(null, "Build Cancelled by User", null, 'error');
        
        const statusIcon = this.$container.querySelector('#status-icon');
        if(statusIcon) statusIcon.src = cupReady;
    };
  }

  updateProgress(percent, stepName, logChunk, state) {
    if (!this.$container || !this.$container.isConnected) return;
    
    const bar = this.$container.querySelector('#prog-bar');
    const subStatus = this.$container.querySelector('#sub-status');
    const logBox = this.$container.querySelector('#log-box');
    const mainStatus = this.$container.querySelector('#main-status');
    const btnStop = this.$container.querySelector('#btn-stop');

    if(percent !== null) bar.style.width = `${percent}%`;

    if (state === 'gradle') {
        bar.style.backgroundColor = "#4CAF50"; 
        mainStatus.innerText = "Building Project...";
    } else if (state === 'error') {
        bar.style.backgroundColor = "#F44336"; 
        mainStatus.innerText = "Build Failed";
        if(btnStop) btnStop.style.display = 'none';
    } else if (state === 'success') {
        bar.style.backgroundColor = "#4CAF50"; 
        mainStatus.innerText = "App Ready!";
        if(btnStop) btnStop.style.display = 'none';
    } else {
        bar.style.backgroundColor = "#2196F3"; 
        mainStatus.innerText = "Preparing...";
    }

    if (logChunk) {
        const span = document.createElement('div');
        span.textContent = logChunk;
        span.style.borderBottom = "1px solid rgba(255,255,255,0.05)";
        logBox.appendChild(span);
        logBox.scrollTop = logBox.scrollHeight;
    }
    
    if(stepName && stepName.trim().length > 0) {
        subStatus.innerText = stepName;
    }
  }

  formatPath(fullUrl) {
      if (!fullUrl) return "Unknown Location";
      let path = fullUrl.replace('file://', '');
      if (path.includes('/storage/emulated/0')) {
          return path.replace('/storage/emulated/0', 'Internal Storage');
      }
      const parts = path.split('/');
      if (parts.length > 6) {
          const shortParts = parts.slice(-5); 
          return '...' + '/' + shortParts.join('/');
      }
      return path;
  }

  showResult(isSuccess, payload) {
    if (!this.$container) return;

    const mainStatus = this.$container.querySelector('#main-status');
    const subStatus = this.$container.querySelector('#sub-status');
    const footerInfo = this.$container.querySelector('#footer-info');
    const actionBtn = this.$container.querySelector('#btn-main-action');
    const logBox = this.$container.querySelector('#log-box');
    const btnDetails = this.$container.querySelector('#btn-details');
    const btnStop = this.$container.querySelector('#btn-stop');
    const buildWrapper = this.$container.querySelector('.build-progress-wrapper');
    
    const statusIcon = this.$container.querySelector('#status-icon');
    if(statusIcon) statusIcon.src = cupReady;

    this.editorFile.filename = isSuccess ? 'Build Success' : 'Build Failed';
    if(btnStop) btnStop.style.display = 'none';

    if (isSuccess) {
        this.updateProgress(100, "Completed", null, 'success');
        subStatus.innerText = "Build completed successfully.";
        
        actionBtn.style.display = "inline-block";
        actionBtn.innerText = "Save to Downloads";
        actionBtn.style.backgroundColor = "#4CAF50";
        actionBtn.onclick = payload.onDownload; 
        
        if (buildWrapper && !buildWrapper.querySelector('.after-build-informmation')) {
            const warningDiv = document.createElement('div');
            warningDiv.className = 'after-build-informmation';
            warningDiv.innerHTML = '⚠️ Close this tab before running a new build';
            buildWrapper.appendChild(warningDiv);
        }
        
        const displayPath = this.formatPath(payload.originalPath);
        footerInfo.innerHTML = `Location: <br> <span style="color:#4CAF50; font-family:monospace;">${displayPath}</span>`;

    } else {
        this.updateProgress(100, "Failed", null, 'error');
        subStatus.innerText = "Check logs for details.";
        
        if (buildWrapper && !buildWrapper.querySelector('.after-build-informmation')) {
            const warningDiv = document.createElement('div');
            warningDiv.className = 'after-build-informmation';
            warningDiv.innerHTML = '⚠️ Close this tab before running a new build';
            buildWrapper.appendChild(warningDiv);
        }

        actionBtn.style.display = "inline-block";
        actionBtn.innerText = "Save Logs";
        actionBtn.style.backgroundColor = "#F44336";
        actionBtn.onclick = payload.onDownload;

        logBox.style.display = 'block';
        btnDetails.innerText = 'Hide Logs';
        
        footerInfo.innerText = "Review the error logs above.";
    }
  }
}