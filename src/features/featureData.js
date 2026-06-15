// features/featureData.js

import { REGISTRY } from './store/registry.js';
import { DATA } from './store/data.js';
import { CODE_SNIPPETS } from './store/snippets.js';

// ========================================
// DATA MERGER
// ========================================
let mergedDataCache = null;

export function getAllFeatures() {
    if (mergedDataCache) return mergedDataCache;

    // Clone DATA to avoid mutation issues
    const merged = JSON.parse(JSON.stringify(DATA));

    // Iterate Snippets and Auto-Inject
    for (const [key, rawValue] of Object.entries(CODE_SNIPPETS)) {
        
        // Handle both Array [...] and Single Object {...}
        let snippetsList = [];

        if (Array.isArray(rawValue)) {
            snippetsList = rawValue; // It's already an array (e.g. google_maps)
        } else if (typeof rawValue === 'object' && rawValue !== null) {
            snippetsList = [rawValue]; // Convert single object to array (e.g. internet_check)
        } else {
            console.warn(`⚠️ Warning: Snippet group '${key}' is invalid. Skipping.`);
            continue;
        }

        // Safety check for empty arrays
        if (snippetsList.length === 0) continue;

        if (merged[key]) {
            // Case 1: ID Match (e.g., google_maps)
            // Append snippets to existing feature
            merged[key].snippets = snippetsList;
        } else {
            // Case 2: No Match (Orphan Snippets)
            // Create a new "Pseudo-Feature" so it appears in the list
            merged[key] = {
                id: key,
                title: snippetsList[0].label, // Use first snippet label as title
                category: "Snippets",
                description: snippetsList[0].description || "Code snippet collection.",
                snippets: snippetsList,
                requirements: [] // Snippets usually don't strictly enforce deps in this UI
            };
        }
    }
    
    mergedDataCache = merged;
    return mergedDataCache;
}

// ========================================
// HELPER: Registry Resolver
// ========================================
export function getFeatureComponents(featureId) {
    const allData = getAllFeatures(); // Marged data
    const feature = allData[featureId];
    
    if (!feature) return [];

    let components = [];

    // Resolve requirements
    if (feature.requirements) {
        feature.requirements.forEach(req => {
            const parts = req.split('.'); 
            if (parts.length === 2) {
                const group = parts[0]; 
                const key = parts[1];   
                
                if (REGISTRY[group] && REGISTRY[group][key]) {
                    components.push({ ...REGISTRY[group][key] }); 
                }
            }
        });
    }

    // Add custom components
    if (feature.custom_components) {
        components = [...components, ...feature.custom_components];
    }

    return components;
}