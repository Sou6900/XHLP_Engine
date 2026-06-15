// xhlp initPlugin.js
import { BuildSettingsUI } from './generation/bundle/BuildSettingsUI.js';
import { IconGenerationUI } from './generation/icon/IconGenerationUI.js'; 
import { checkEnvironment } from './setup/envCheck.js'; 
import { showBuilderPage } from './generation/bundle/builderPage.js';
import { LayoutPreviewUI } from './preview/ui/LayoutPreviewUI.js';
import { assets } from './assets/assets.js';
import { registerAndroidCompleter } from './services/completer.js';

class BuildExecutorPlugin {
  constructor() {
    this.$runBtn = null;
    this.$iconBtn = null;
    this.checkFile = this.checkFile.bind(this);
    this.handleBuildClick = this.handleBuildClick.bind(this);
    this.handleIconClick = this.handleIconClick.bind(this);
    
    this.settingsUI = new BuildSettingsUI(); 
    this.iconUI = new IconGenerationUI(); 
  }

  async init() {
    this.setupButtons();
    editorManager.on('switch-file', this.checkFile);
    editorManager.on('rename-file', this.checkFile);
  }

  setupButtons() {
    const commonStyle = `
        font-size: 1.3em;
        position: relative;
        z-index: 999;
        cursor: pointer;
        pointer-events: auto;
        margin: 0 5px;
    `;

    // Green Build Button (JAVA/KT)
    this.$runBtn = document.createElement('span');
    this.$runBtn.className = 'icon play_circle_filled'; 
    this.$runBtn.title = 'Build Project';
    this.$runBtn.style.cssText = `color: #4CAF50; ${commonStyle}`;
    
    this.$runBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        this.handleBuildClick();
    });

    // Yellow Icon Button (Resources/XML)
    this.$iconBtn = document.createElement('span');
    this.$iconBtn.className = 'icon play_circle_filled'; 
    this.$iconBtn.title = "Generate Assets / Icons";
    this.$iconBtn.style.cssText = `color: #FBC02D; ${commonStyle}`;
    
    this.$iconBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        new LayoutPreviewUI().show();
    });

    setTimeout(() => this.checkFile(), 500);
    
    if(window.acode) {
        acode.addIcon('aid-builder-icon', assets.head);
        acode.addIcon('aid-feature-icon', assets.hello);
        acode.addIcon('aid-camera-icon', assets.camera);
        acode.addIcon('aid-gradle-icon', assets.gradle);
        acode.addIcon('aid-xhlp-icon', assets.xhlp);
    }
  }

  async handleBuildClick() {
    const activeFile = editorManager.activeFile;
    const path = activeFile.uri || activeFile.location;
    
    if(!path) {
        window.toast('Save the file first!', 3000);
        return;
    }

    const isEnvReady = await checkEnvironment();
    if (!isEnvReady) {
        window.toast('⚠️ Environment Missing! Redirecting to Setup...', 3000);
        showBuilderPage(); 
        return; 
    }

    this.settingsUI.show(path);
  }

  handleIconClick() {
    const activeFile = editorManager.activeFile;
    const path = activeFile.uri || activeFile.location;
    if(path) {
        this.iconUI.show(path);
    } else {
        window.toast('Save the file first!', 3000);
    }
  }


  checkFile() {
    const activeFile = editorManager.activeFile;
    this.detachButtons();

    if (!activeFile) return;

    const path = activeFile.uri || activeFile.location;
    if (!path || typeof path !== 'string') return;
    
    // Green Button: Java, Kotlin, Gradle.properties
    const isAndroidCode = (path.includes('/gradle.properties') || (path.includes('/src/main/java/') &&
      (path.endsWith('.java') || path.endsWith('.kt')) ));

    // Yellow Button: XML (Layouts, Manifest, Drawables)
    const isXML = path.endsWith('.xml') && (path.includes('/src/main/res/') || path.includes('AndroidManifest.xml'));

    if (isAndroidCode) {
      this.attachButton(this.$runBtn);
      setTimeout(() => registerAndroidCompleter(), 300);
    } else if (isXML) {
      this.attachButton(this.$iconBtn);
      setTimeout(() => registerAndroidCompleter(), 300);
    }
  }

  attachButton(btnElement) {
    if (!btnElement.isConnected) {
      const header = document.querySelector('#root > header.tile');
      if (header) {
          const editIcon = header.querySelector('.icon.edit');
          if(editIcon) {
              header.insertBefore(btnElement, editIcon);
          } else {
              header.insertBefore(btnElement, header.lastChild);
          }
      }
    }
  }

  detachButtons() {
    if (this.$runBtn && this.$runBtn.isConnected) this.$runBtn.remove();
    if (this.$iconBtn && this.$iconBtn.isConnected) this.$iconBtn.remove();
  }

  destroy() {
    this.detachButtons();
    editorManager.off('switch-file', this.checkFile);
    editorManager.off('rename-file', this.checkFile);
  }
}

export default new BuildExecutorPlugin();