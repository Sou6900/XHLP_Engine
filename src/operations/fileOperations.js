const fs = acode.require('fs');

/**
 * Get currently opened project folder information
 * @returns {Object|null} { name, uri, path } or null if no project found
 */
export async function getProjectFolder() {
  try {
    const fileList = acode.require('fileList');
    const files = await fileList();
    
    if (!files || files.length === 0) {
      return null;
    }

    // Check first 5 files to detect project folder
    const filesToCheck = Math.min(5, files.length);
    
    for (let i = 0; i < filesToCheck; i++) {
      const file = files[i];
      
      if (file.path && file.url && file.url.startsWith('content://')) {
        // Get project folder name from path (first segment)
        const projectName = file.path.split('/')[0];
        
        if (projectName) {
          // Extract full URI
          const parts = file.url.split('::');
          if (parts.length === 2) {
            const treePart = parts[0];
            const fullPath = parts[1];
            
            // Find project folder in full path
            const projectIndex = fullPath.indexOf('/' + projectName + '/');
            const projectIndexRoot = fullPath.indexOf('/' + projectName);
            
            let projectPath = null;
            let projectUri = null;
            
            if (projectIndex !== -1) {
              projectPath = fullPath.substring(0, projectIndex + projectName.length + 1);
              projectUri = treePart + '::' + projectPath;
            } else if (projectIndexRoot !== -1) {
              projectPath = fullPath.substring(0, projectIndexRoot + projectName.length + 1);
              projectUri = treePart + '::' + projectPath;
            }
            
            if (projectUri && projectPath) {
              return {
                name: projectName,
                uri: projectUri,
                path: projectPath
              };
            }
          }
        }
      }
    }
    
    return null;
    
  } catch (error) {
    console.error('Error getting project folder:', error);
    return null;
  }
}

/**
 * Get all opened project folders
 * @returns {Array} Array of { name, uri, path } objects
 */
export async function getAllProjectFolders() {
  try {
    const fileList = acode.require('fileList');
    const files = await fileList();
    
    if (!files || files.length === 0) {
      return [];
    }

    const projectFolders = new Map(); // Use Map to avoid duplicates
    
    // Check first 10 files to catch multiple projects
    const filesToCheck = Math.min(10, files.length);
    
    for (let i = 0; i < filesToCheck; i++) {
      const file = files[i];
      
      if (file.path && file.url && file.url.startsWith('content://')) {
        const projectName = file.path.split('/')[0];
        
        if (projectName && !projectFolders.has(projectName)) {
          const parts = file.url.split('::');
          if (parts.length === 2) {
            const treePart = parts[0];
            const fullPath = parts[1];
            
            const projectIndex = fullPath.indexOf('/' + projectName + '/');
            const projectIndexRoot = fullPath.indexOf('/' + projectName);
            
            let projectPath = null;
            let projectUri = null;
            
            if (projectIndex !== -1) {
              projectPath = fullPath.substring(0, projectIndex + projectName.length + 1);
              projectUri = treePart + '::' + projectPath;
            } else if (projectIndexRoot !== -1) {
              projectPath = fullPath.substring(0, projectIndexRoot + projectName.length + 1);
              projectUri = treePart + '::' + projectPath;
            }
            
            if (projectUri && projectPath) {
              projectFolders.set(projectName, {
                name: projectName,
                uri: projectUri,
                path: projectPath
              });
            }
          }
        }
      }
    }
    
    return Array.from(projectFolders.values());
    
  } catch (error) {
    console.error('Error getting all project folders:', error);
    return [];
  }
}

/**
 * Remove a specific opened folder by URI
 * @param {string} uri - The folder URI to remove
 * @returns {boolean} true if removed, false otherwise
 */
export function removeFolder(uri) {
  try {
    const openFolder = acode.require('openFolder');
    const folder = openFolder.find(uri);
    
    if (folder) {
      folder.remove();
      // console.log('Folder removed:', uri);
      return true;
    } else {
      console.log('❌ Folder not found:', uri);
      return false;
    }
  } catch (error) {
    console.error('Error removing folder:', error);
    return false;
  }
}

/**
 * Remove all currently opened project folders
 * @returns {Object} { removed: number, failed: number, folders: Array }
 */
export async function removeAllOpenedFolders() {
  try {
    const folders = await getAllProjectFolders();
    
    if (folders.length === 0) {
      return { removed: 0, failed: 0, folders: [] };
    }

    let removed = 0;
    let failed = 0;
    const removedFolders = [];
    
    for (const folder of folders) {
      const success = removeFolder(folder.uri);
      if (success) {
        removed++;
        removedFolders.push(folder);
      } else {
        failed++;
      }
    }
    
    return { removed, failed, folders: removedFolders };
    
  } catch (error) {
    console.error('Error removing all folders:', error);
    return { removed: 0, failed: 0, folders: [] };
  }
}

/**
 * Open a project folder
 * @param {string} uri - The folder URI to open
 * @param {Object} options - Options for opening folder
 * @returns {Promise<boolean>} true if successful
 */
export async function openProjectFolder(uri, options = {}) {
  try {
    const openFolder = acode.require('openFolder');
    
    const defaultOptions = {
      name: options.name || 'Project',
      id: options.id || 'project-' + Date.now(),
      saveState: options.saveState !== undefined ? options.saveState : true,
      reloadOnResume: options.reloadOnResume !== undefined ? options.reloadOnResume : true
    };
    
    await openFolder(uri, defaultOptions);
    // console.log(' Folder opened:', uri);
    return true;
    
  } catch (error) {
    console.error('Error opening folder:', error);
    return false;
  }
}

/**
 * Check if a folder is currently opened
 * @param {string} uri - The folder URI to check
 * @returns {boolean} true if opened
 */
export function isFolderOpened(uri) {
  try {
    const openFolder = acode.require('openFolder');
    const folder = openFolder.find(uri);
    return folder !== null && folder !== undefined;
  } catch (error) {
    console.error('Error checking folder:', error);
    return false;
  }
}

/**
 * Replace currently opened folder with a new one
 * Removes all opened folders and opens the new one
 * @param {string} uri - New folder URI to open
 * @param {Object} options - Options for opening folder
 * @returns {Promise<Object>} { success: boolean, removed: number, message: string }
 */
export async function replaceProjectFolder(uri, options = {}) {
  try {
    // Remove all opened folders
    const removeResult = await removeAllOpenedFolders();
    
    // Small delay to ensure cleanup
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Open new folder
    const opened = await openProjectFolder(uri, options);
    
    if (opened) {
      return {
        success: true,
        removed: removeResult.removed,
        message: `Removed ${removeResult.removed} folder(s) and opened new project`
      };
    } else {
      return {
        success: false,
        removed: removeResult.removed,
        message: 'Failed to open new folder'
      };
    }
    
  } catch (error) {
    console.error('Error replacing folder:', error);
    return {
      success: false,
      removed: 0,
      message: error.message
    };
  }
}

// ========================================
// FILE SYSTEM OPERATIONS
// ========================================

/**
 * Create a new folder
 * @param {string} url - Parent directory URL
 * @param {string} folderName - Name of the folder
 * @param {Object} options - { overwrite: boolean } (Default: false aka "Keep Both")
 */
export async function createFolder(url, folderName, options = { overwrite: false }) {
  try {
    const fsInstance = fs(url);
    if (!fsInstance) throw new Error("Invalid parent path URL");

    let existingUrl = null;
    try {
      const siblings = await fs(url).lsDir();
      const found = siblings.find(item => item.name === folderName && item.isDirectory);
      if (found) existingUrl = found.url;
    } catch (e) {}

    if (existingUrl) {
        if (options.overwrite) {
            // console.log(`Using existing folder: ${folderName}`);
            return {
                success: true,
                url: existingUrl,
                message: `Folder "${folderName}" already exists (Used)`
            };
        } else {
            // Keep Both
            const newName = await getUniqueName(url, folderName);
            const dirUrl = await fsInstance.createDirectory(newName);
            return {
                success: true,
                url: dirUrl,
                message: `Folder created as "${newName}"`
            };
        }
    }

    // 3. Create if not exists
    const dirUrl = await fsInstance.createDirectory(folderName);
    return {
      success: true,
      url: dirUrl,
      message: `Folder "${folderName}" created`
    };

  } catch (error) {
    console.error('Error creating folder:', error);
    return { success: false, url: null, message: error.message };
  }
}

/**
 * Create a new file
 * @param {string} url - Parent directory URL
 * @param {string} fileName - Name of the file
 * @param {string|ArrayBuffer} content - File content
 * @param {Object} options - { overwrite: boolean } (Default: false aka "Keep Both")
 */
export async function createFile(url, fileName, content = '', options = { overwrite: false }) {
  try {
    // 1. Check if file exists
    let existingItem = null;
    try {
        const siblings = await fs(url).lsDir();
        existingItem = siblings.find(item => item.name === fileName && item.isFile);
    } catch(e) {}

    // 2. Logic based on overwrite flag
    if (existingItem) {
        if (options.overwrite) {
            // console.log(` Overwriting file: ${fileName}`);
            await fs(existingItem.url).writeFile(content);
            return {
                success: true,
                url: existingItem.url,
                message: `File "${fileName}" updated`
            };
        } else {
            const uniqueName = await getUniqueName(url, fileName);
            // console.log(`Creating duplicate: ${uniqueName}`);
            await fs(url).createFile(uniqueName, content);
            return {
                success: true,
                url: `${url}/${uniqueName}`, // Approximate URL
                message: `File created as "${uniqueName}"`
            };
        }
    }

    // 3. Create normal file (No conflict)
    await fs(url).createFile(fileName, content);
    return {
      success: true,
      url: `${url}/${fileName}`,
      message: `File "${fileName}" created`
    };

  } catch (error) {
    console.error('Error creating file:', error);
    return { success: false, url: null, message: error.message };
  }
}



/**
 * Check if a file or folder exists
 * @param {string} url - Parent directory URL
 * @param {string} name - Name of file or folder to check
 * @returns {Promise<Object>} { exists: boolean, isFile: boolean, isDirectory: boolean, url: string|null }
 */
export async function isExists(url, name) {
  try {
    const siblings = await fs(url).lsDir();
    const item = siblings.find(entry => entry.name === name);
    
    if (item) {
      return {
        exists: true,
        isFile: item.isFile || false,
        isDirectory: item.isDirectory || false,
        url: item.url
      };
    }
    
    return {
      exists: false,
      isFile: false,
      isDirectory: false,
      url: null
    };
  } catch (error) {
    console.error('Error checking existence:', error);
    return {
      exists: false,
      isFile: false,
      isDirectory: false,
      url: null
    };
  }
}

/**
 * Read file contents
 * @param {string} fileUrl - File URL to read
 * @param {string} encoding - Encoding type (default: 'utf-8')
 * @returns {Promise<Object>} { success: boolean, content: string|ArrayBuffer|null, message: string }
 */
export async function readFile(fileUrl, encoding = 'utf-8') {
  try {
    const content = await fs(fileUrl).readFile(encoding);
    // console.log('File read:', fileUrl);
    return {
      success: true,
      content: content,
      message: 'File read successfully'
    };
  } catch (error) {
    console.error('Error reading file:', error);
    return {
      success: false,
      content: null,
      message: error.message
    };
  }
}

/**
 * Write content to file
 * @param {string} fileUrl - File URL to write to
 * @param {string|ArrayBuffer} content - Content to write
 * @returns {Promise<Object>} { success: boolean, message: string }
 */
export async function writeFile(fileUrl, content) {
  try {
    await fs(fileUrl).writeFile(content);
    // console.log('File written:', fileUrl);
    return {
      success: true,
      message: 'File written successfully'
    };
  } catch (error) {
    console.error('Error writing file:', error);
    return {
      success: false,
      message: error.message
    };
  }
}

/**
 * List directory contents
 * @param {string} dirUrl - Directory URL to list
 * @returns {Promise<Object>} { success: boolean, entries: Array, message: string }
 */
export async function listDir(dirUrl) {
  try {
    const entries = await fs(dirUrl).lsDir();
    // console.log('Directory listed:', dirUrl);
    return {
      success: true,
      entries: entries,
      message: `Found ${entries.length} item(s)`
    };
  } catch (error) {
    console.error('Error listing directory:', error);
    return {
      success: false,
      entries: [],
      message: error.message
    };
  }
}

/**
 * Create nested folder structure recursively
 * @param {string} url - Parent directory URL
 * @param {Array} nodes - Array of node objects with structure
 * @returns {Promise<Object>} { success: boolean, created: number, message: string }
 */
export async function createNodes(url, nodes) {
  let created = 0;
  
  for (const node of nodes) {
    if (node.name === null) continue;
    
    try {
      if (node.type === 'directory') {
        const folderResult = await createFolder(url, node.name);
        
        if (folderResult.success) {
          created++;
          
          // Create children if any
          if (node.children && node.children.length > 0 && folderResult.url) {
            const childResult = await createNodes(folderResult.url, node.children);
            created += childResult.created;
          }
        }
      } else if (node.type === 'file') {
        const fileResult = await createFile(url, node.name, node.content || '');
        if (fileResult.success) {
          created++;
        }
      }
    } catch (error) {
      console.error(`Error creating node ${node.name}:`, error);
    }
  }
  
  return {
    success: true,
    created: created,
    message: `Created ${created} item(s)`
  };
}

/**
 * Delete a file or folder
 * @param {string} url - URL of file or folder to delete
 * @returns {Promise<Object>} { success: boolean, message: string }
 */
export async function deleteItem(url) {
  try {
    await fs(url).delete();
    // console.log('Item deleted:', url);
    return {
      success: true,
      message: 'Item deleted successfully'
    };
  } catch (error) {
    console.error('Error deleting item:', error);
    return {
      success: false,
      message: error.message
    };
  }
}

/**
 * Rename a file or folder
 * @param {string} url - URL of file or folder to rename
 * @param {string} newName - New name
 * @returns {Promise<Object>} { success: boolean, newUrl: string|null, message: string }
 */
export async function renameItem(url, newName) {
  try {
    const newUrl = await fs(url).renameTo(newName);
    // console.log('Item renamed:', newName);
    return {
      success: true,
      newUrl: newUrl,
      message: `Renamed to "${newName}" successfully`
    };
  } catch (error) {
    console.error('Error renaming item:', error);
    return {
      success: false,
      newUrl: null,
      message: error.message
    };
  }
}

/**
 * Copy a file with auto-increment naming if file exists
 * @param {string} sourceUrl - Source file URL
 * @param {string} destUrl - Destination directory URL
 * @param {string} desiredName - The name you want (e.g., "Pokemon_App.apk")
 * @returns {Promise<Object>} { success: boolean, message: string }
 */

export async function copyFile(sourceUrl, destUrl, desiredName) {
  try {
    let fileName = desiredName || sourceUrl.split('/').pop();
    let namePart = fileName;
    let extPart = "";

    const lastDotIndex = fileName.lastIndexOf('.');
    if (lastDotIndex !== -1) {
        namePart = fileName.substring(0, lastDotIndex);
        extPart = fileName.substring(lastDotIndex);
    }

    const separator = destUrl.endsWith('/') ? '' : '/';
    let finalName = fileName;
    let counter = 1;
    
    
    while (await isExists(destUrl , finalName)) {
        finalName = `${namePart}_${counter}${extPart}`;
        counter++;
    }

    // console.log(`Copying to: ${finalName}`);
    
    const sourceEntry = await fs(sourceUrl);
    await sourceEntry.copyTo(destUrl, finalName);

    return {
      success: true,
      message: `Saved as ${finalName}`
    };

  } catch (error) {
    console.error('Copy Error:', error);
    return {
      success: false,
      message: error.message || 'Unknown error'
    };
  }
}

/**
 * Move a file or folder
 * @param {string} sourceUrl - Source URL
 * @param {string} destUrl - Destination directory URL
 * @returns {Promise<Object>} { success: boolean, url: string|null, message: string }
 */
export async function moveItem(sourceUrl, destUrl) {
  try {
    const movedUrl = await fs(sourceUrl).moveTo(destUrl);
    // console.log(' Item moved');
    return {
      success: true,
      url: movedUrl,
      message: 'Item moved successfully'
    };
  } catch (error) {
    console.error('Error moving item:', error);
    return {
      success: false,
      url: null,
      message: error.message
    };
  }
}