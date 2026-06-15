import { writeShared } from '../../services/terminalManager.js';
import plugin from '../../../plugin.json';
import { replaceProjectFolder } from '../../operations/fileOperations.js';
import { svgs } from '../../assets/icons/svg/svg.js';

const fs = acode.require('fs');

export function renderClonePopup($parent) {
    const $overlay = document.createElement('div');
    $overlay.className = 'andro-clone-overlay';
    
    $overlay.innerHTML = `
      <div class="andro-clone-box">
         <span class="andro-clone-icon" id="btnPaste" title="Paste">
            ${svgs.copy}
         </span>
         <input type="text" class="andro-clone-input" id="repoUrl" placeholder="Paste Git Repository URL...">
         <button class="andro-clone-btn" id="btnDoClone">
            <span class="clone-loader" id="loader"></span>
            <span id="btnText">Clone</span>
         </button>
         <button class="andro-clone-close" id="btnClose">×</button>
      </div>
    `;

    $parent.appendChild($overlay);

    const $input = $overlay.querySelector('#repoUrl');
    const $btn = $overlay.querySelector('#btnDoClone');
    const $loader = $overlay.querySelector('#loader');
    const $text = $overlay.querySelector('#btnText');
    const $close = $overlay.querySelector('#btnClose');
    const $pasteBtn = $overlay.querySelector('#btnPaste');

    setTimeout(() => $input.focus(), 100);

    const closePopup = () => $overlay.remove();
    $close.onclick = closePopup;
    $overlay.onclick = (e) => { if(e.target === $overlay) closePopup(); };

    $pasteBtn.onclick = async () => {
        try {
            const text = await navigator.clipboard.readText();
            if(text) { $input.value = text; $input.focus(); window.toast('Pasted!', 1000); }
        } catch(e) { window.toast('Paste manually', 2000); $input.focus(); }
    };

    $btn.onclick = async () => {
        const url = $input.value.trim();
        if(!url) { window.toast("Enter URL", 2000); return; }

        $btn.disabled = true;
        $text.innerText = "Cloning...";
        $loader.style.display = "inline-block";

        const pluginHome = `/data/user/0/${window.ACODE_ID}/files/alpine/home/${plugin.id}`;
        const tempDir = `${pluginHome}/temp_git_clone`;
        
        const defaultBaseDir = `file:///data/user/0/${window.ACODE_ID}/files/alpine/home/${plugin.id}/apps`;
        let baseDir = localStorage.getItem('android_builder_last_path') || defaultBaseDir;
        
        let targetShellDir = '';
        
        // Path Conversion Logic
        if (baseDir.startsWith('file://')) {
            targetShellDir = baseDir.replace('file://', '');
        } else if (baseDir.includes('content://')) {
            try {
                const decoded = decodeURIComponent(baseDir);
                if (decoded.includes('primary:')) {
                    const pathPart = decoded.split('primary:')[1];
                    const cleanPath = pathPart.startsWith('/') ? pathPart.substring(1) : pathPart;
                    targetShellDir = `/sdcard/${cleanPath}`;
                } else {
                    throw new Error("Only Internal Storage supported");
                }
            } catch(e) {
                window.toast(e.message, 3000);
                resetBtn();
                return;
            }
        } else {
            targetShellDir = baseDir;
        }

        let folderName = url.split('/').pop();
        if(folderName.endsWith('.git')) folderName = folderName.slice(0, -4);
        
        const logUrl = `file://${targetShellDir}/clone_log.txt`;

        const script = `
            mkdir -p "${targetShellDir}"
            rm -rf "${tempDir}"
            mkdir -p "${tempDir}"
            
            LOG="${targetShellDir}/clone_log.txt"
            echo "Initializing..." > "$LOG"

            if ! command -v git &> /dev/null; then
                echo "Installing Git..." >> "$LOG"
                apk add git openssh >> "$LOG" 2>&1
            fi
            
            git config --global http.sslVerify false
            git config --global --add safe.directory '*'

            cd "${tempDir}"
            echo "Cloning ${url}..." >> "$LOG"
            
            git clone "${url}" >> "$LOG" 2>&1
            
            if [ $? -eq 0 ]; then
                echo "Moving files..." >> "$LOG"
                rm -rf "${targetShellDir}/${folderName}"
                mv "${folderName}" "${targetShellDir}/" || true
                
                if [ -d "${targetShellDir}/${folderName}" ]; then
                    echo "CLONE_SUCCESS" >> "$LOG"
                else
                    echo "MOVE_FAILED" >> "$LOG"
                fi
            else
                echo "CLONE_FAILED" >> "$LOG"
            fi
            
            rm -rf "${tempDir}"
        `;

        try {
            await writeShared(script);
            monitorClone(logUrl, targetShellDir, folderName, closePopup, $btn, $text, $loader, baseDir);
        } catch(e) {
            window.toast("Error: " + e.message, 3000);
            resetBtn();
        }
    };

    function resetBtn() {
        $btn.disabled = false;
        $text.innerText = "Clone";
        $loader.style.display = "none";
    }

    function monitorClone(logUrl, shellBaseDir, folderName, closeCallback, $btn, $text, $loader, originalBaseDir) {
        let lastLen = 0;
        const interval = setInterval(async () => {
            try {
                if(!await fs(logUrl).exists()) return;
                const content = await fs(logUrl).readFile('utf-8');
                
                if(content.length > lastLen) {
                    lastLen = content.length;
                    
                    if(content.includes('CLONE_SUCCESS')) {
                        clearInterval(interval);
                        window.toast("✅ Clone Successful!", 2000);
                        
                        let projectUrl;
                        
                        if (originalBaseDir.startsWith('content://')) {
                            let cleanBase = originalBaseDir;
                            if (cleanBase.endsWith('/') || cleanBase.endsWith('%2F')) {
                                cleanBase = cleanBase.substring(0, cleanBase.length - (cleanBase.endsWith('/') ? 1 : 3));
                            }
                            projectUrl = `${cleanBase}%2F${encodeURIComponent(folderName)}`;
                            
                        } else {
                            // Standard File URI
                            projectUrl = `file://${shellBaseDir}/${folderName}`;
                        }
                        
                        console.log("Opening Project:", projectUrl);
                        await replaceProjectFolder(projectUrl, { name: folderName });
                        
                        closeCallback();
                    } 
                    else if(content.includes('CLONE_FAILED') || content.includes('fatal:') || content.includes('MOVE_FAILED')) {
                        clearInterval(interval);
                        window.toast("❌ Failed. Check 'clone_log.txt'", 3000);
                        
                        $btn.style.backgroundColor = "#F44336";
                        $text.innerText = "Failed";
                        $loader.style.display = "none";
                        setTimeout(() => closeCallback(), 2000);
                    }
                }
            } catch(e) {}
        }, 800);
    }
}