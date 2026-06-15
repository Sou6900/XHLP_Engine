import plugin from '../../plugin.json';
import { getSettings } from '../services/settings.js';
import { defaultDownloadConfig, getResolvedPaths } from '../services/pathManager.js';

export function getSetupScript(logFile, statusFile) {

    const homeDir = window.ANDRO_HOME;
    const settings = getSettings();
    const paths = getResolvedPaths(); 
    
    // 1. Download URLs Logic
    let dlConfig = defaultDownloadConfig;
    if (settings.downloadUrls) {
        try { dlConfig = JSON.parse(settings.downloadUrls); } catch (e) {}
    }

    // 2. Dynamic Java Path & Home Calculation
    let javaBin = paths.java.path; 
    if (javaBin.startsWith('file://')) javaBin = javaBin.replace('file://', '');
    
    let javaHome = javaBin;
    if (javaBin.endsWith('/bin/java')) {
        javaHome = javaBin.substring(0, javaBin.length - '/bin/java'.length);
    } else if (javaBin.includes('/bin/')) {
        javaHome = javaBin.split('/bin/')[0];
    }

    // 3. Dynamic Versions
    const buildToolsVer = paths.buildTools.version || "34.0.0";
    const platformVer = paths.platform.version || "android-34";
    const gradleVer = paths.gradle.version || "8.5";

    // URLs
    const sdkUrl = dlConfig.sdkUrl || defaultDownloadConfig.sdkUrl;
    const gradleUrl = dlConfig.gradleUrl || defaultDownloadConfig.gradleUrl;
    const aapt2Url = dlConfig.aapt2Url || defaultDownloadConfig.aapt2Url;

    return `
#!/bin/sh

# --- CONFIGURATION ---
LOG="${logFile}"
STATUS="${statusFile}"
HOME_DIR="${homeDir}"
SDK_ROOT="${homeDir}"
GRADLE_DIR="${homeDir}/gradle"

# Configurable Versions (Dynamic)
PLATFORM_VERSION="${platformVer}"
BUILD_TOOLS_VERSION="${buildToolsVer}"
GRADLE_VERSION="${gradleVer}"

# Dynamic Java Paths
JAVA_BIN="${javaBin}"
JAVA_HOME_DIR="${javaHome}"

# Dynamic Download URLs
SDK_DOWNLOAD_URL="${sdkUrl}"
GRADLE_DOWNLOAD_URL="${gradleUrl}"
AAPT2_DOWNLOAD_URL="${aapt2Url}"

# Helper Functions
log() { echo "$1" >> "$LOG"; }
status() { echo "$1:$2" >> "$STATUS"; }

echo "" > "$LOG"
echo "0:Initializing..." > "$STATUS"

# --- 1. CLEANUP ---
rm -f "$HOME_DIR/gradle.zip"
rm -f "$HOME_DIR/cmdline-tools.zip"
rm -f "${homeDir}/system_deps.mark"

# --- 2. SYSTEM DEPENDENCIES (JAVA CHECK) ---
if [ ! -f "$JAVA_BIN" ]; then
    status 10 "Installing Java..."
    log "Java binary missing at $JAVA_BIN. Installing..."
    apk update >> "$LOG" 2>&1
    apk add --force openjdk17 wget unzip ca-certificates openssl >> "$LOG" 2>&1
    
    if [ -f "$JAVA_BIN" ]; then
        log "Java installed successfully."
    else
        log "Error: Java installation failed."
        status "Error" "Java Install Failed"
        exit 1
    fi
else
    log "Java found at $JAVA_BIN."
fi

export JAVA_HOME="$JAVA_HOME_DIR"
export PATH="$PATH:$JAVA_HOME/bin"

# --- 3. MANUAL GRADLE SETUP ---
if [ ! -f "$GRADLE_DIR/bin/gradle" ]; then
    status 25 "Downloading Gradle..."
    log "Downloading Gradle $GRADLE_VERSION..."
    wget --no-check-certificate -q "$GRADLE_DOWNLOAD_URL" -O "$HOME_DIR/gradle.zip" >> "$LOG" 2>&1
    
    if [ -f "$HOME_DIR/gradle.zip" ] && [ -s "$HOME_DIR/gradle.zip" ]; then
        status 35 "Installing Gradle..."
        unzip -q -o "$HOME_DIR/gradle.zip" -d "$HOME_DIR" >> "$LOG" 2>&1
        
        if [ -d "$HOME_DIR/gradle-$GRADLE_VERSION" ]; then
            rm -rf "$GRADLE_DIR"
            mv "$HOME_DIR/gradle-$GRADLE_VERSION" "$GRADLE_DIR"
        elif [ -d "$HOME_DIR/gradle-*" ]; then
            log "Warning: Using wildcard match for Gradle..."
            rm -rf "$GRADLE_DIR"
            mv $HOME_DIR/gradle-* "$GRADLE_DIR"
        fi

        rm "$HOME_DIR/gradle.zip"
        chmod +x "$GRADLE_DIR/bin/gradle"
        rm -f /usr/bin/gradle
        ln -s "$GRADLE_DIR/bin/gradle" /usr/bin/gradle
        log "Gradle installed."
    else
        log "Error: Gradle download failed."
        status "Error" "Gradle Download Failed"
        exit 1
    fi
else
    log "Gradle found."
fi

# --- 4. ANDROID SDK TOOLS ---
if [ ! -f "$SDK_ROOT/cmdline-tools/latest/bin/sdkmanager" ]; then
    status 45 "Downloading SDK Tools..."
    log "Downloading Command Line Tools..."
    wget --no-check-certificate -q "$SDK_DOWNLOAD_URL" -O "$HOME_DIR/cmdline-tools.zip" >> "$LOG" 2>&1
    
    if [ -f "$HOME_DIR/cmdline-tools.zip" ] && [ -s "$HOME_DIR/cmdline-tools.zip" ]; then
        status 55 "Extracting SDK..."
        unzip -q -o "$HOME_DIR/cmdline-tools.zip" -d "$HOME_DIR" >> "$LOG" 2>&1
        mkdir -p "$SDK_ROOT/cmdline-tools/latest"
        
        if [ -d "$HOME_DIR/cmdline-tools/cmdline-tools" ]; then
             mv "$HOME_DIR/cmdline-tools/cmdline-tools/"* "$SDK_ROOT/cmdline-tools/latest/" >> "$LOG" 2>&1
             rm -rf "$HOME_DIR/cmdline-tools/cmdline-tools"
        elif [ -d "$HOME_DIR/cmdline-tools/bin" ]; then
             mv "$HOME_DIR/cmdline-tools/"* "$SDK_ROOT/cmdline-tools/latest/" >> "$LOG" 2>&1
        fi
        rm "$HOME_DIR/cmdline-tools.zip"
        log "SDK Tools installed."
    else
        log "Error: SDK download failed."
        status "Error" "SDK Download Failed"
        exit 1
    fi
else
    log "SDK Tools found."
fi

# --- 5. PLATFORMS & BUILD TOOLS ---
export ANDROID_HOME="$SDK_ROOT"
export PATH="$PATH:$SDK_ROOT/cmdline-tools/latest/bin:$GRADLE_DIR/bin"

if ! command -v sdkmanager >/dev/null 2>&1; then
    log "Error: sdkmanager not found."
    status "Error" "SDK Setup Failed"
    exit 1
fi

# 🛠️ FIX: Check BOTH Platform AND Build Tools
if [ ! -d "$SDK_ROOT/platforms/$PLATFORM_VERSION" ] || [ ! -d "$SDK_ROOT/build-tools/$BUILD_TOOLS_VERSION" ]; then
    
    status 70 "Configuring SDK..."
    yes | sdkmanager --licenses --sdk_root="$SDK_ROOT" >> "$LOG" 2>&1
    
    status 80 "Downloading Platform & Build Tools..."
    log "Installing $PLATFORM_VERSION & Build Tools $BUILD_TOOLS_VERSION..."
    
    # sdkmanager is smart; it won't re-download if the platform already exists, 
    # it will only download the missing build-tools.
    sdkmanager "platforms;$PLATFORM_VERSION" "build-tools;$BUILD_TOOLS_VERSION" --sdk_root="$SDK_ROOT" >> "$LOG" 2>&1
else
    log "Platform $PLATFORM_VERSION and Build Tools $BUILD_TOOLS_VERSION found."
fi

# --- 6. ARM64 AAPT2 PATCHING ---
AAPT2_PATH="$SDK_ROOT/build-tools/$BUILD_TOOLS_VERSION/aapt2"

# Only patch if AAPT2 exists (meaning download succeeded)
if [ -f "$AAPT2_PATH" ]; then
    # Optional: Check if it's already patched/executable to save time
    # But ensuring it's the correct ARM64 version is safer.
    
    status 90 "Patching AAPT2..."
    log "Replacing incompatible AAPT2 at $AAPT2_PATH..."
    
    rm -f "$AAPT2_PATH"
    wget --no-check-certificate -q "$AAPT2_DOWNLOAD_URL" -O "$AAPT2_PATH" >> "$LOG" 2>&1
    chmod +x "$AAPT2_PATH"
    
    if [ -x "$AAPT2_PATH" ]; then
        log "AAPT2 Patched (ARM64)."
    else
        log "Warning: AAPT2 Patch failed."
    fi
fi

status 100 "Setup Complete!"
log "Environment is ready."
`;
}