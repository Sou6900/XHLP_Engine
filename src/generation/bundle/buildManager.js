import {
  writeShared
} from '../../services/terminalManager.js';
import {
  BuildUI
} from './buildUI.js';
import plugin from '../../../plugin.json';
import {
  copyFile
} from '../../operations/fileOperations.js';
import {
  keystoreManager
} from './keystoreManager.js';
import { 
  getResolvedPaths 
} from '../../services/pathManager.js';

const fs = acode.require('fs');

export class BuildManager {
  constructor() {
    this.ui = new BuildUI();
    this.isBuilding = false;
    this.currentInterval = null;
  }

  async startBuild(currentFileUrl, options = {
    variant: 'debug', format: 'apk', signingInfo: null
  }) {
    if (this.currentInterval) clearInterval(this.currentInterval);
    this.isBuilding = false;

    // --- Project Root Detection ---
    let appIndex = currentFileUrl.indexOf('/app/src/main/java');
    if (appIndex === -1) appIndex = currentFileUrl.indexOf('/src/main/java');

    if (appIndex === -1) {
      window.toast('Open a Java/Kotlin file first', 3000);
      return;
    }

    const projectRootUrl = currentFileUrl.substring(0, appIndex);
    let projectRootShell = projectRootUrl;

    if (projectRootUrl.startsWith('file://')) {
      projectRootShell = projectRootUrl.replace('file://', '');
    } else if (projectRootUrl.includes('content://')) {
      const decoded = decodeURIComponent(projectRootUrl);
      if (decoded.includes('primary:')) {
        const pathAfterPrimary = decoded.split('primary:').pop();
        const cleanPath = pathAfterPrimary.startsWith('/') ? pathAfterPrimary.substring(1): pathAfterPrimary;
        projectRootShell = `/sdcard/${cleanPath}`;
      } else {
        window.toast("Only Internal Storage supported", 4000);
        return;
      }
    }

    // --- Fetch Dynamic Paths ---
    const paths = getResolvedPaths();
    
    // Helper to clean 'file://'
    const cleanPath = (p) => p ? p.replace('file://', '') : '';
    
    // Resolve Components
    const javaBin = cleanPath(paths.java.path);
    const javaHome = javaBin.replace(/\/bin\/java$/, ''); // remove /bin/java
    
    const gradleBin = cleanPath(paths.gradle.path);
    const gradleHome = gradleBin.replace(/\/bin\/gradle$/, ''); // remove /bin/gradle

    // Build Tools & AAPT2 (Fallback to default if missing in config)
    const buildToolsDir = paths.buildTools ? cleanPath(paths.buildTools.path) : `${window.ANDRO_HOME}/build-tools/34.0.0`;
    const aapt2Path = `${buildToolsDir}/aapt2`;

    // --- Path Setup ---
    const logFile = `${projectRootShell}/build_log.txt`;
    const logUrl = `${projectRootUrl}/build_log.txt`;
    const wrapperScript = `${window.ANDRO_HOME}/temp_build_script.sh`;

    this.isBuilding = true;

    this.ui.show(() => {
      this.isBuilding = false;
      if (this.currentInterval) clearInterval(this.currentInterval);
      writeShared('\x03');
      window.toast('Build Cancelled', 2000);
    });

    try {
      // --- Gradle Props Check (Using Dynamic AAPT2) ---
      const gradlePropsUrl = `${projectRootUrl}/gradle.properties`;
      const requiredAaptLine = `android.aapt2FromMavenOverride=${aapt2Path}`;

      try {
        if (await fs(gradlePropsUrl).exists()) {
          const currentContent = await fs(gradlePropsUrl).readFile('utf-8');
          
          // Check if AAPT2 line exists and update it if different
          if (!currentContent.includes('android.aapt2FromMavenOverride')) {
            const newContent = currentContent + '\n' + requiredAaptLine;
            await fs(gradlePropsUrl).writeFile(newContent);
          } else if (!currentContent.includes(aapt2Path)) {
             // If path changed (e.g. user changed settings), update the line
             const lines = currentContent.split('\n');
             const newLines = lines.map(line => 
                 line.startsWith('android.aapt2FromMavenOverride') ? requiredAaptLine : line
             );
             await fs(gradlePropsUrl).writeFile(newLines.join('\n'));
          }
        } else {
          const defaultProps = `# Optimized by Android Builder
          org.gradle.jvmargs=-Xmx1536m -Dfile.encoding=UTF-8 -Dkotlin.compiler.execution.strategy=in-process
          org.gradle.parallel=true
          org.gradle.daemon=false
          android.useAndroidX=true
          android.enableJetifier=true
          android.nonTransitiveRClass=true
          org.gradle.native=false
          ${requiredAaptLine}`;
          await fs(projectRootUrl).createFile('gradle.properties', defaultProps);
        }
      } catch (propErr) {
        this.ui.appendLog(`Warning: Gradle Props check failed: ${propErr.message}`);
      }

      // --- Task Selection ---
      let gradleTask = 'assembleDebug';
      if (options.format === 'aab') {
        gradleTask = options.variant === 'release' ? 'bundleRelease': 'bundleDebug';
      } else {
        gradleTask = options.variant === 'release' ? 'assembleRelease': 'assembleDebug';
      }

      // --- Shell Script Generation (Dynamic) ---
      const scriptContent = `
      #!/bin/sh
      LOG_FILE="${logFile}"
      echo "Initializing..." > "$LOG_FILE"
      print_log() { echo "$1" | tee -a "$LOG_FILE"; }

      print_log "--- Build Started ---"
      print_log "Mode: ${options.format.toUpperCase()} (${options.variant})"
      print_log "Project: ${projectRootShell}"

      # Dynamic Environment Variables
      ANDRO_HOME="${window.ANDRO_HOME}"
      export JAVA_HOME="${javaHome}"
      export ANDROID_HOME="$ANDRO_HOME"
      export GRADLE_HOME="${gradleHome}"
      
      # Update PATH with dynamic locations
      export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin:$GRADLE_HOME/bin:$JAVA_HOME/bin:/usr/bin

      AAPT2_PATH="${aapt2Path}"
      if [ -f "$AAPT2_PATH" ]; then
        chmod +x "$AAPT2_PATH"
      else
        print_log "Warning: AAPT2 not found at $AAPT2_PATH"
      fi

      export JAVA_TOOL_OPTIONS="-Dfile.encoding=UTF-8 -Dorg.gradle.native=false -Dorg.gradle.vfs.watch=false"

      cd "${projectRootShell}"

      print_log "----------------------------------------"
      print_log "Task: ${gradleTask}"
      print_log "Using Gradle: $GRADLE_HOME"
      print_log "Using Java: $JAVA_HOME"
      print_log "----------------------------------------"

      if [ -f "./gradlew" ]; then
        sh ./gradlew ${gradleTask} --no-daemon --stacktrace 2>&1 | tee -a "$LOG_FILE"
      else
        gradle ${gradleTask} --no-daemon --stacktrace 2>&1 | tee -a "$LOG_FILE"
      fi

      # --- PATH FIND ---
      ABS_ROOT=$(pwd)

      if [ "${options.format}" = "aab" ]; then
        FOUND=$(find "$ABS_ROOT" -type f -name "*.aab" | grep "${options.variant}" | head -n 1)
      else
        FOUND=$(find "$ABS_ROOT" -type f -name "*.apk" | grep -v "unaligned" | grep "${options.variant}" | head -n 1)
      fi

      if [ ! -z "$FOUND" ]; then
        echo "APK_FOUND_AT: $FOUND" >> "$LOG_FILE"
        print_log "BUILD_SUCCESS"
      else
        print_log "BUILD_FAILED (Output not found)"
      fi
      echo "--- Process Finished ---"
      `;

      // --- Script Execution ---
      const b64Script = btoa(scriptContent);
      const createScriptCmd = `echo "${b64Script}" | base64 -d > "${wrapperScript}" && chmod +x "${wrapperScript}"\r`;

      await writeShared(createScriptCmd);

      // Initialize Log
      if (await fs(logUrl).exists()) await fs(logUrl).writeFile("Waiting...");
      else await fs(projectRootUrl).createFile('build_log.txt', "Waiting...");

      // Run Build
      await writeShared(`sh "${wrapperScript}"\r`);

      this.monitorBuild(logUrl, projectRootUrl, options.variant, options.signingInfo);

    } catch (e) {
      this.ui.appendLog(`Start Error: ${e.message}`);
      this.isBuilding = false;
    }
  }

  monitorBuild(logUrl, projectRootUrl, variant, signingInfo) {
    let lastLength = 0;
    let currentProgress = 0;
    let detectedApkUrl = null;
    let totalTasksEstimate = 40;
    let completedTasks = 0;

    if (this.currentInterval) clearInterval(this.currentInterval);

    this.currentInterval = setInterval(async () => {
      try {
        if (!this.isBuilding) {
          clearInterval(this.currentInterval);
          return;
        }
        if (!await fs(logUrl).exists()) return;

        const content = await fs(logUrl).readFile('utf-8');
        if (content.length > lastLength) {
          const newChunk = content.substring(lastLength);
          lastLength = content.length;

          if (newChunk.includes('APK_FOUND_AT:')) {
            const match = newChunk.match(/APK_FOUND_AT: (.*)/);
            if (match && match[1]) {
              detectedApkUrl = 'file://' + match[1].trim();
            }
          }

          const taskMatches = newChunk.match(/> Task :app:\w+/g);
          if (taskMatches) {
            completedTasks += taskMatches.length;
            currentProgress = Math.min(90, 10 + Math.floor((completedTasks / totalTasksEstimate) * 80));
          }

          let statusLine = null;
          const lines = newChunk.split('\n').filter(l => l.trim().length > 0);
          for (let i = lines.length - 1; i >= 0; i--) {
            const line = lines[i];
            if (line.includes('Daemon') || line.includes('experimental')) continue;
            if (line.includes('BUILD_FAILED')) {
              statusLine = "Build Failed"; break;
            }
            if (line.includes('Configure project')) {
              statusLine = "Configuring Project..."; break;
            }
            if (line.includes('> Task :')) {
              const taskMatch = line.match(/> Task :app:(\w+)/);
              statusLine = taskMatch ? `Running: ${taskMatch[1]}`: line.trim();
              break;
            }
            if (line.includes('Running Gradle')) {
              statusLine = "Starting Gradle..."; break;
            }
          }

          let state = 'running';
          if (content.includes('Running Gradle')) {
            state = 'gradle'; if (currentProgress < 10) currentProgress = 10;
          }
          if (content.includes('Configure project')) {
            state = 'gradle'; if (currentProgress < 15) currentProgress = 15;
          }
          if (content.includes('BUILD_FAILED')) {
            state = 'error'; currentProgress = 100;
          }

          this.ui.updateProgress(currentProgress, statusLine, newChunk, state);

          if (content.includes('BUILD_SUCCESS')) {
            clearInterval(this.currentInterval);

            // Clean up script
            // writeShared(`rm "${wrapperScript}"\r`);

            let targetApk = detectedApkUrl;
            if (!targetApk) {
              const paths = [`${projectRootUrl}/app/build/outputs/apk/${variant}`,
                `${projectRootUrl}/build/outputs/apk/${variant}`];
              for (const path of paths) {
                try {
                  if (await fs(path).exists()) {
                    const files = await fs(path).list();
                    const apk = files.find(f => f.name.endsWith('.apk') && !f.name.endsWith('unaligned.apk'));
                    if (apk) {
                      targetApk = apk.url; break;
                    }
                  }
                } catch(e) {}
              }
            }

            if (targetApk) {
              if (variant === 'release' && signingInfo) {
                this.ui.updateProgress(95, "Signing APK...", "Running apksigner...", 'running');
                keystoreManager.signApk(targetApk.replace('file://', ''), signingInfo, (signedPath) => {
                  this.isBuilding = false;
                  if (signedPath) {
                    this.ui.updateProgress(100, "Signed & Ready", null, 'success');
                    this.handleSuccess(signedPath);
                  } else {
                    this.ui.updateProgress(100, "Signing Failed", null, 'error');
                    this.handleFailure(logUrl);
                  }
                });
              } else {
                this.isBuilding = false;
                this.ui.updateProgress(100, "Done", null, 'success');
                this.handleSuccess(targetApk);
              }
            } else {
              this.isBuilding = false;
              this.ui.updateProgress(100, "Output Not Found", null, 'error');
              this.handleFailure(logUrl);
            }

          } else if (content.includes('BUILD_FAILED')) {
            clearInterval(this.currentInterval);
            this.isBuilding = false;
            this.handleFailure(logUrl);
          }
        }
      } catch (e) {
        // Silent catch
      }
    },
      500);
  }

  async handleSuccess(apkUrl) {
    const apkName = apkUrl.split('/').pop();
    this.ui.showResult(true,
      {
        apkName: apkName,
        originalPath: apkUrl,
        onDownload: async () => {
          const fs = acode.require('fs');
          const sourcePath = apkUrl.replace('file://', '');
          let destFileName = apkName;
          let destPath = `/sdcard/Download/${destFileName}`;
          let counter = 1;

          while (await fs(`file://${destPath}`).exists()) {
            const namePart = apkName.substring(0, apkName.lastIndexOf('.'));
            const extPart = apkName.substring(apkName.lastIndexOf('.'));
            destFileName = `${namePart} (${counter})${extPart}`;
            destPath = `/sdcard/Download/${destFileName}`;
            counter++;
          }
          window.toast(`Saving as: ${destFileName}`, 2000);
          const cmd = `cp -f "${sourcePath}" "${destPath}"\r`;
          await writeShared(cmd);
          setTimeout(async () => {
            if (await fs(`file://${destPath}`).exists()) {
              window.toast(`Saved to Downloads successfully`, 3000);
            } else {
              window.toast("Save Failed! Permission denied?", 4000);
            }
          },
            2000);
        }
      });
  }

  async handleFailure(logUrl) {
    this.ui.showResult(false, {
      logPath: logUrl.replace('file://',
        ''),
      onDownload: async () => {
        try {
          window.toast('Saving Log...',
            1000);
          const destUrl = 'file:///storage/emulated/0/Download';
          const fileName = "build_error.txt";
          const result = await copyFile(logUrl,
            destUrl,
            fileName);
          if (result.success) window.toast(`Log Saved to Downloads`, 3000);
        } catch (e) {
          window.toast('Save Failed', 3000);
        }
      }
    });
  }
}

export const buildManager = new BuildManager();