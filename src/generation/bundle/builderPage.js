import { pageStyles } from '../../styles/styles.js';
import { assets } from '../../assets/assets.js';
import { renderCreateProjectScreen } from '../project/createProject.js'; 
import { checkEnvironment } from '../../setup/envCheck.js'; 
import { initSetupWizard } from '../../setup/setupWizard.js'; 
import { replaceProjectFolder } from '../../operations/fileOperations.js';
import { renderClonePopup } from '../project/cloneProject.js';

export async function showBuilderPage() {
  const EditorFile = acode.require('editorFile');

  const $content = document.createElement('div');
  $content.className = 'andro-container';
  
  // Environment Check
  const isEnvReady = await checkEnvironment();
  if (!isEnvReady) {
    initSetupWizard($content);
    new EditorFile('Android Builder Setup', {
        type: 'page',
        content: $content,
        id: 'com.example.androidbuilder.setup',
        stylesheets: [pageStyles],
        hideQuickTools: true ,
    });
    return;
  }

  // HOME SCREEN
  function renderHomeScreen() {
    $content.innerHTML = `
      <div class="andro-home-content">
        
        <h1 class="andro-heading">Andro Builder</h1>
        <img src="${assets.head}" class="andro-logo" alt="Android Logo">

        <div class="andro-title">Get Started</div>
        <div class="andro-subtitle">start your new project !</div>

        <div class="andro-btn-group">
          <button class="andro-btn" id="btn-create">Create Project</button>
          <button class="andro-btn" id="btn-open">Open Existing Project</button>
          <button class="andro-btn" id="btn-clone">Clone Git Repo</button>
        </div>

      </div>
    `;

    // Listeners =============>
    
    // Create Project
    $content.querySelector('#btn-create').onclick = () => {
      renderCreateProjectScreen($content, renderHomeScreen);
    };

    // Open Existing Project
    $content.querySelector('#btn-open').onclick = async () => {
        const fileBrowser = acode.require('fileBrowser');
        try {
            const result = await fileBrowser('folder', 'Select Android Project');
            if (result && result.url) {
                window.toast('Opening project...', 1000);
                const openResult = await replaceProjectFolder(result.url, { 
                    name: result.name || 'Android Project' 
                });
                if (openResult.success) window.toast('Project Loaded', 2000);
                else window.toast('❌ Failed to open project', 3000);
            }
        } catch (e) {}
    };

    // Clone Git Repo (Updated)
    $content.querySelector('#btn-clone').onclick = () => {
        renderClonePopup($content);
    };
  }

  // Initial Render
  renderHomeScreen();

  new EditorFile('Android Builder', {
    type: 'page',
    content: $content,
    id: 'com.example.androidbuilder.page',
    stylesheets: [pageStyles],
    tabIcon:'icon aid-builder-icon',
    hideQuickTools: true ,
  });
}