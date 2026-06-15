export class FeatureState {
    constructor() {
        this.activeFeatures = {};
        this.pendingState = new Map();
        this.renderToken = 0;
        this.currentView = 'home';
        
        this.targetActivity = null; // Currently selected activity path
        this.availableActivities = []; // List of found activities
        this.activityLanguage = 'java'; // 'java' or 'kotlin'
    }

    reset() {
        this.activeFeatures = {};
        this.renderToken = 0;
        this.availableActivities = [];
    }

    clearPending() {
        this.pendingState.clear();
    }

    updatePending(fid, index, checked, version) {
        if (!this.pendingState.has(fid)) {
            this.pendingState.set(fid, {});
        }
        const featState = this.pendingState.get(fid);
        
        if (!featState[index]) featState[index] = {};
        featState[index].checked = checked;
        if (version) featState[index].version = version;
    }
}