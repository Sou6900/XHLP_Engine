import { svgs } from '../../assets/icons/svg/svg.js';
import { pageStyles } from '../../styles/styles.js';
import { assets } from '../../assets/assets.js';
import { createFolder, createFile } from '../../operations/fileOperations.js';

export class IconGenerationUI {
    constructor() {
        this.tabId = 'android.icon.gen';
        this.editorFile = null;
        this.projectRoot = '';
        this.selectedFile = null; 
    }

    async show(currentFilePath) {
        this.projectRoot = this.resolveProjectRoot(currentFilePath);
        
        const appDetails = await this.getAppDetails(this.projectRoot);
        
        const EditorFile = acode.require('editorFile');

        // Main Container
        const $container = document.createElement('div');
        $container.className = 'andro-build-page'; 

        // Assets
        const imageIcon = svgs?.image || '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>';
        const largeLogo = assets?.androidCamera || assets?.head || '';

        // Package id display logic
        const packageDisplay = appDetails.packageName 
            ? `<div class="package-id-text">Target: <span class="id-code">${appDetails.packageName}</span></div>` 
            : '';

        // Hidden Input
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.style.display = 'none';
        fileInput.id = 'hidden-file-input';

        $container.innerHTML = `
            <div class="andro-build-header-sec">
                <div class="build-app-name">
                    <img style="width:20px;" src="${assets.yellow}" class="icon">
                    <span>${appDetails.projectName}</span> </div>
            </div>

            <div class="andro-build-body">
                
                <img src="${largeLogo}" class="camera-logo-large">
                
                <div class="build-main-status" style="font-size: 1.2rem;">App Icon Configuration</div>
                <div class="build-sub-status">
                    Updates mipmap folders automatically
                    ${packageDisplay} </div>

                <div class="icon-config-card">
                    
                    <div class="preview-section">
                        <div class="icon-preview-box">
                            <span id="preview-text" class="preview-placeholder">None</span>
                            <img id="preview-img" class="preview-img-element">
                        </div>
                        
                        <div class="input-area">
                            <label class="config-label" style="margin-top:0;">Source Image</label>
                            <div class="input-row">
                                <input type="text" id="img-path" class="andro-input input-path-field" placeholder="Select image..." readonly>
                                <button class="andro-icon-btn" id="btn-pick-img">
                                    ${imageIcon}
                                </button>
                            </div>
                            
                            <div id="meta-info" class="icon-meta-info">
                                <span id="meta-dim" class="meta-tag meta-dim">0x0</span>
                                <span id="meta-size" class="meta-tag meta-size">0 KB</span>
                            </div>
                        </div>
                    </div>

                    <div class="card-divider"></div>

                    <div class="info-text">
                        ℹ️ Recommended size: <strong>512x512px</strong>.<br>
                        This tool will remove <code style="color:#F44336">mipmap-anydpi</code> to prevent conflicts.
                    </div>

                    <div id="gen-file-list" class="gen-file-list"></div>

                    <div id="progress-wrapper" class="gen-progress-wrapper">
                        <div class="gen-progress-track">
                            <div id="gen-progress-bar" class="gen-progress-bar"></div>
                        </div>
                        <div id="gen-status" class="gen-status-text">Initializing...</div>
                    </div>

                </div>

                <div class="config-actions" style="margin-top: 20px;">
                    <button class="btn-build-cancel" id="btn-cancel">Close</button>
                    <button class="btn-build-start" id="btn-gen" style="background-color: #FBC02D; color: #000;">Set Icon</button>
                </div>

            </div>
        `;
        
        $container.appendChild(fileInput);

        const existing = acode.require('openFolder').find(this.tabId);
        if (existing) existing.remove();

        this.editorFile = new EditorFile('Icon Setup', {
            type: 'page',
            content: $container,
            id: this.tabId,
            tabIcon: 'icon aid-camera-icon',
            stylesheets: [pageStyles]
        });

        // --- Logic ---
        const previewImg = $container.querySelector('#preview-img');
        const previewText = $container.querySelector('#preview-text');
        const pathInput = $container.querySelector('#img-path');
        const pickBtn = $container.querySelector('#btn-pick-img');
        const genBtn = $container.querySelector('#btn-gen');
        
        const metaInfo = $container.querySelector('#meta-info');
        const dimTag = $container.querySelector('#meta-dim');
        const sizeTag = $container.querySelector('#meta-size');
        const fileListDiv = $container.querySelector('#gen-file-list');

        // Pick Image
        pickBtn.onclick = (e) => { 
            e.preventDefault(); 
            fileInput.click(); 
        };

        // File Selection Change
        fileInput.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                this.selectedFile = file; 
                pathInput.value = file.name;
                
                // Show Size
                sizeTag.innerText = this.formatBytes(file.size);
                
                const imageUrl = URL.createObjectURL(file);
                
                // Preview
                previewImg.src = imageUrl;
                previewImg.style.display = 'block';
                previewText.style.display = 'none';

                // Get Dimensions
                const img = new Image();
                img.onload = () => {
                    dimTag.innerText = `${img.width}x${img.height}`;
                    metaInfo.style.display = 'block'; 
                    
                    // Show Tree View of what will be generated
                    this.showGenerationTree(fileListDiv);
                };
                img.src = imageUrl;
            }
        };

        // Generate Icons
        genBtn.onclick = async () => {
            if (!this.selectedFile) {
                window.toast('Please select an image first', 3000);
                return;
            }

            genBtn.innerText = "Processing...";
            genBtn.disabled = true;
            genBtn.classList.add('btn-disabled-processing');

            // Show Progress Bar
            const progressWrapper = $container.querySelector('#progress-wrapper');
            const progressBar = $container.querySelector('#gen-progress-bar');
            const statusText = $container.querySelector('#gen-status');
            
            progressWrapper.style.display = 'block';

            try {
                const base64Url = await this.fileToDataURL(this.selectedFile);
                
                await this.processAndSaveIcons(base64Url, (percent, status) => {
                    progressBar.style.width = `${percent}%`;
                    statusText.innerText = status;
                });
                
                window.toast('Icons updated successfully!', 4000);
                this.editorFile.remove();
            } catch (err) {
                console.error("Icon Gen Error:", err);
                window.alert('Error: ' + err.message);
                
                genBtn.innerText = "Generate Icons";
                genBtn.disabled = false;
                genBtn.classList.remove('btn-disabled-processing');
                progressWrapper.style.display = 'none';
            }
        };

        $container.querySelector('#btn-cancel').onclick = () => this.editorFile.remove();
    }

    // Helper: Show the tree view
    showGenerationTree(container) {
        const densities = ['mdpi', 'hdpi', 'xhdpi', 'xxhdpi', 'xxxhdpi'];
        let html = `<div class="tree-root">/src/main/res/</div>`;
        
        densities.forEach(d => {
            html += `<div class="tree-parent"><span style="width:12px;" class="icon">${svgs.openedFolder} </span> mipmap-${d}</div>`;
            html += `<span class="tree-child"><span style="width:12px;" class="icon">${svgs.imageFile}</span> ic_launcher.png</span>`;
            html += `<span class="tree-child"><span style="width:12px;" class="icon">${svgs.imageFile}</span> ic_launcher_round.png</span>`;
        });

        container.innerHTML = html;
        container.style.display = 'block';
    }

    resolveProjectRoot(path) {
        const parts = path.split('/');
        let srcIndex = parts.indexOf('src');
        if (srcIndex !== -1) {
            return parts.slice(0, srcIndex).join('/');
        }
        return path.substring(0, path.lastIndexOf('/'));
    }

    // App Details Fetcher
    async getAppDetails(moduleRoot) {
        const fs = acode.require('fsOperation');
        let packageName = null;
        let projectName = 'Unknown Project';

        // 1. Determine Project Name (Fix for "app")
        // Get the folder name from path
        let folderName = moduleRoot.split('/').pop();
        
        if (folderName === 'app') {
            // If folder is 'app', try to get the parent folder name (e.g., 'guru')
            const parts = moduleRoot.split('/');
            if (parts.length > 1) {
                const parentFolder = parts[parts.length - 2];
                // Capitalize first letter
                projectName = parentFolder.charAt(0).toUpperCase() + parentFolder.slice(1);
            } else {
                projectName = 'App';
            }
        } else {
            // If folder is not 'app' (e.g., 'Pika'), use it directly
            projectName = folderName.charAt(0).toUpperCase() + folderName.slice(1);
        }

        // 2. Fetch Package Name from AndroidManifest.xml
        try {
            const manifestPath = `${moduleRoot}/src/main/AndroidManifest.xml`;
            
            if (await fs(manifestPath).exists()) {
                const content = await fs(manifestPath).readFile('utf-8');
                // Regex to find package="com.something"
                const match = content.match(/package=["']([^"']+)["']/);
                if (match && match[1]) {
                    packageName = match[1];
                }
            }
        } catch (e) {
            console.warn("Manifest read error:", e);
        }

        return { projectName, packageName };
    }

    formatBytes(bytes, decimals = 2) {
        if (!+bytes) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
    }

    fileToDataURL(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (e) => reject(e);
            reader.readAsDataURL(file);
        });
    }

    async processAndSaveIcons(imageSrc, onProgress) {
        const densities = [
            { name: 'mipmap-mdpi', size: 48 },
            { name: 'mipmap-hdpi', size: 72 },
            { name: 'mipmap-xhdpi', size: 96 },
            { name: 'mipmap-xxhdpi', size: 144 },
            { name: 'mipmap-xxxhdpi', size: 192 }
        ];

        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = "Anonymous"; 

            img.onload = async () => {
                try {
                    onProgress(10, "Preparing workspace...");

                    let currentUrl = this.projectRoot;
                    const folderOpts = { overwrite: true }; 

                    const srcRes = await createFolder(currentUrl, 'src', folderOpts);
                    const mainRes = await createFolder(srcRes.url, 'main', folderOpts);
                    const resRes = await createFolder(mainRes.url, 'res', folderOpts);

                    const fs = acode.require('fsOperation');
                    
                    onProgress(20, "Cleaning old conflicts...");
                    try {
                        const resList = await fs(resRes.url).lsDir();
                        const conflictFolder = resList.find(item => item.name === 'mipmap-anydpi-v26');
                        if (conflictFolder) await fs(conflictFolder.url).delete();
                    } catch (e) {}

                    // Loop through densities
                    let completed = 0;
                    const total = densities.length;
                    const startProgress = 30;
                    const endProgress = 100;

                    for (const density of densities) {
                        // Ensure density folder exists
                        const targetFolder = await createFolder(resRes.url, density.name, folderOpts);
                        
                        const canvas = document.createElement('canvas');
                        canvas.width = density.size;
                        canvas.height = density.size;
                        const ctx = canvas.getContext('2d');
                        ctx.imageSmoothingEnabled = true;
                        ctx.imageSmoothingQuality = 'high';
                        ctx.drawImage(img, 0, 0, density.size, density.size);
                        
                        const blob = await new Promise(r => canvas.toBlob(r, 'image/png'));
                        const buffer = await blob.arrayBuffer();
                        
                        const fileOpts = { overwrite: true };
                        await createFile(targetFolder.url, 'ic_launcher.png', buffer, fileOpts);
                        await createFile(targetFolder.url, 'ic_launcher_round.png', buffer, fileOpts);

                        completed++;
                        // Calculate Progress
                        const currentPercent = startProgress + ((completed / total) * (endProgress - startProgress));
                        onProgress(currentPercent, `Generated ${density.name} (${density.size}px)`);
                    }
                    
                    onProgress(100, "Done!");
                    // Small delay to show 100%
                    setTimeout(resolve, 500);
                } catch (e) {
                    reject(e);
                }
            };
            img.onerror = () => reject(new Error("Failed to load image."));
            img.src = imageSrc;
        });
    }   
}