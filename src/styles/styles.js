// 1. Base Styles (Container, Home Screen, Shared Buttons)
const baseStyles=`

/* Main Container */
.andro-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    background-color: var(--primary-color);
    color: var(--primary-text-color);
    font-family: sans-serif;
    overflow: hidden;
}

.open-file-list li.tile .file,
.open-file-list li.tile .aid-builder-icon {
    background-size: 13px;
}

/* Center Content Wrapper (For Home Screen) */
.andro-home-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100%;
    padding: 20px;
    text-align: center;
}

/* Typography */
.andro-heading {
    font-size: 1.8rem;
    font-weight: bold;
    margin-bottom: 20px;
    color: var(--popup-text-color);
    letter-spacing: 1px;
}

.andro-title {
    font-size: 1.4rem;
    font-weight: 600;
    margin-bottom: 5px;
    color: var(--primary-text-color);
}

.andro-subtitle {
    font-size: 0.9rem;
    opacity: 0.7;
    margin-bottom: 40px;
    color: var(--primary-text-color);
}

/* Robot Image */
.andro-logo {
    width: 120px;
    height: 120px;
    margin-bottom: 25px;
    object-fit: contain;
    filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.2));
}

/* Button Group */
.andro-btn-group {
    display: flex;
    flex-direction: column;
    gap: 15px;
    width: 100%;
    max-width: 300px;
}

/* Shared Buttons */
.andro-btn {
    background-color: var(--secondary-color);
    color: var(--primary-text-color);
    border: 1px solid var(--border-color);
    padding: 12px 20px;
    border-radius: 1px;
    /* Client Preference */
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    outline: none;
    display: flex;
    align-items: center;
    justify-content: center;
}

.andro-btn:active {
    background-color: var(--button-active-color);
    transform: scale(0.98);
    border-color: var(--popup-active-color);
}

`;

// 2. Create Project Page (Layout & Header)
const createPageStyles=` .andro-create-page {
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    min-height: 100%;
    overflow: hidden;
    position: relative;
}

.andro-create-title {
    font-size: 1.5rem;
    color: var(--popup-active-color);
    margin-bottom: 20px;
}

.andro-create-header {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-bottom: 15px;
}

.back-btn {
    margin-top: 20px;
    background: transparent;
    border: none;
    color: var(--primary-text-color);
    opacity: 0.6;
    text-decoration: underline;
    cursor: pointer;
    padding: 10px;
}

/* Footer Back Button Positioning */
.back-btn {
    margin-top: auto;
    margin-bottom: 20px;
    position: fixed;
    bottom: 0;
}

@keyframes spyFloat {
    0% {
        transform: translate(0, 0);
    }

    50% {
        transform: translate(5px, 5px);
    }

    100% {
        transform: translate(0, 0);
    }
}

.andro-spy-icon {
    position: absolute;
    top: -10px;
    left: -10px;
    width: 60px;
    height: auto;
    z-index: 100;
    filter: drop-shadow(2px 4px 6px rgba(0, 0, 0, 0.3));
    transition: all 0.3s ease;
    animation: spyFloat 4s infinite ease-in-out;
    cursor: pointer;
}

.andro-spy-icon.angry {
    top: -22px !important;
    left: -22px !important;
    animation: none;
    filter: drop-shadow(4px 8px 10px rgba(255, 0, 0, 0.4));
    transform: scale(1.1);
}

`;

// 3. Grid System (Templates)
const gridStyles=` .andro-template-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 20px;
    width: 100%;
    max-width: 800px;
    padding: 10px;
    margin-bottom: 30px;
    overflow: scroll;
}

.andro-template-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: var(--secondary-color);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    padding: 15px;
    cursor: pointer;
    transition: transform 0.2s, border-color 0.2s;
    aspect-ratio: 1/1.4;
    height: 130px;

    background: none;
    border: none;
}

.andro-template-card:active {
    border-color: var(--popup-active-color);
    background-color: var(--button-active-color);
    transform: scale(0.95);
}

.andro-template-img {
    width: 100%;
    max-width: 70px;
    height: auto;
    object-fit: cover;
    margin-bottom: 12px;
    flex-grow: 1;
}

.andro-template-name {
    font-size: 0.85rem;
    text-align: center;
    color: var(--primary-text-color);
    font-weight: 500;
    line-height: 1.3;
    word-break: break-word;
}

`;

// 4. Configuration Form Styles (Inputs, Labels)
const configPageStyles=` .andro-config-page {
    padding: 20px;
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
}

.andro-form-group {
    margin-bottom: 20px;
    width: 100%;
}

.andro-label {
    display: block;
    margin-bottom: 8px;
    font-size: 0.85rem;
    color: var(--primary-text-color);
    font-weight: 600;
    opacity: 0.9;
}

.andro-input {
    width: 100%;
    padding: 12px;
    background-color: var(--secondary-color);
    border-radius: 1px;
    /* Client Preference */
    color: var(--primary-text-color);
    font-size: 1rem;
    outline: none;
    box-sizing: border-box;
    transition: border-color 0.2s;
    height: 33px;
    /* Specific Height */
    border: none;
    background: var(--primary-color);
    border-bottom: 0.5px solid grey;
}

.andro-input:focus {
    border-color: var(--popup-active-color);
}

/* Location Input Row */
.andro-input-row {
    display: flex;
    gap: 10px;
    align-items: stretch;
    width: 100%;
}

.andro-input-row .andro-input {
    flex-grow: 1;
}

.andro-icon-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--secondary-color);
    border: 1px solid var(--border-color);
    color: var(--primary-text-color);
    border-radius: 2px;
    /* Client Preference */
    padding: 0 15px;
    cursor: pointer;
    min-width: 50px;
    transition: background 0.2s;
    border: none;
    background: var(--primary-color);
    border-bottom: 0.5px solid grey;
}

.andro-icon-btn:active {
    background-color: var(--button-active-color);
    border-color: var(--popup-active-color);
}

`;

// 5. Dropdown Styles (Custom Select)
const dropdownStyles=` .custom-select-container {
    position: relative;
    width: 100%;
    user-select: none;
}

.custom-select-trigger {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: var(--secondary-color);
    border: 1px solid var(--border-color);
    padding: 12px;
    border-radius: 0;
    /* Client Preference */
    cursor: pointer;
    font-size: 1rem;
    color: var(--primary-text-color);
    height: 9px;
    /* Specific Height */
    border: none;
    background: var(--primary-color);
    border-bottom: 0.5px solid grey;
}

.custom-select-trigger:active,
.custom-select-trigger.active {
    border-color: var(--popup-active-color);
}

.custom-select-options {
    position: absolute;
    top: 105%;
    left: 0;
    right: 0;
    background-color: var(--secondary-color);
    border: 1px solid var(--border-color);
    border-radius: 2px;
    /* Client Preference */
    z-index: 100;
    max-height: 200px;
    overflow-y: auto;
    display: none;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}

.custom-select-options.open {
    display: block;
}

.custom-option {
    padding: 12px;
    cursor: pointer;
    transition: background 0.2s;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    height: 9px;
    /* Specific Height */
}

.custom-option:last-child {
    border-bottom: none;
}

.custom-option:hover {
    background-color: var(--button-active-color);
}

.custom-option.selected {
    background-color: var(--popup-active-color);
    color: #fff;
}

`;

// 6. Action Bar / Footer Styles
const footerStyles=` .andro-action-bar {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 30px;
    padding-top: 20px;
    border-top: 1px solid var(--border-color);
}

.andro-btn {
    padding: 10px 20px;
    border-radius: 2px;
    /* Client Preference */
    cursor: pointer;
    font-weight: 500;
}

.andro-btn-secondary {
    background: transparent;
    color: var(--primary-text-color);
    border: 1px solid var(--border-color);
}

#btnFinish {
    background: rgb(15, 104, 15);
    padding: 0px 60px;
    color: white;
    border: none;

}

`;

// Add this to your styles.js
const resultPageStyles=`

/* Result Page Container */
.andro-result-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    text-align: center;
    padding: 20px;
    animation: fadeIn 0.5s ease;
}

/* Success/Error Icon */
.andro-result-icon {
    margin: 20px 0;
    filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
}

/* Build Info Card */
.andro-build-info {
    background-color: var(--secondary-color);
    border: 1px solid var(--border-color);
    border-radius: 4px;
    padding: 15px;
    width: 100%;
    max-width: 400px;
    margin-bottom: 20px;
    text-align: left;
    font-family: monospace;
    font-size: 0.85rem;
    color: var(--primary-text-color);
}

.andro-info-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    padding-bottom: 4px;
}

.andro-info-row:last-child {
    border-bottom: none;
}

.andro-info-label {
    opacity: 0.7;
}

.andro-info-val {
    font-weight: 600;
    color: var(--popup-active-color);
}

/* Messages */
.andro-result-msg {
    font-size: 1.1rem;
    margin-bottom: 10px;
    color: var(--primary-text-color);
}

.andro-close-msg {
    font-style: italic;
    opacity: 0.6;
    font-size: 0.9rem;
    margin-top: 20px;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

`;

const wizardStyles=`

/* Wizard Container */
.andro-wizard-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    background-color: var(--primary-color);
    color: var(--primary-text-color);
    font-family: sans-serif;
    padding: 0;
}

/* Wizard Header */
.andro-wizard-header {
    padding: 15px 20px;
    background-color: var(--secondary-color);
    border-bottom: 1px solid var(--border-color);
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--primary-text-color);
    display: flex;
    align-items: center;
    gap: 10px;
}

/* Wizard Body */
.andro-wizard-body {
    flex-grow: 1;
    padding: 30px 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    overflow-y: auto;
}

.andro-wizard-title {
    font-size: 1.6rem;
    color: var(--primary-text-color);
    margin-bottom: 15px;
    font-weight: bold;
}

.andro-wizard-text {
    font-size: 0.95rem;
    line-height: 1.5;
    max-width: 600px;
    margin-bottom: 30px;
    color: var(--secondary-text-color);
}

/* Setup List Box */
.andro-setup-list {
    width: 100%;
    max-width: 500px;
    background-color: var(--secondary-color);
    border: 1px solid var(--border-color);
    border-radius: 6px;
    padding: 15px;
    text-align: left;
    height: auto;
    max-height: 300px;
    overflow-y: auto;
    margin-bottom: 20px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Setup Item */
.andro-setup-item {
    display: flex;
    justify-content: space-between;
    padding: 6px 5px;
    font-size: 0.9rem;
    color: var(--primary-text-color);
}

.andro-setup-size {
    color: var(--secondary-text-color);
    font-size: 0.85rem;
}

/* Separator */
.andro-list-separator {
    height: 1px;
    background-color: var(--border-color);
    margin: 10px 0;
    opacity: 0.6;
}

/* Progress Bar Area */
.andro-progress-area {
    width: 100%;
    max-width: 500px;
    text-align: left;
}

.andro-progress-label {
    margin-bottom: 5px;
    font-size: 0.9rem;
    color: var(--primary-text-color);
    font-weight: 600;
}

.andro-progress-sub {
    font-size: 0.8rem;
    color: var(--secondary-text-color);
    margin-bottom: 10px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

/* ✅ Progress Track & Fill Updated */
.andro-progress-track {
    width: 100%;
    height: 6px;
    background-color: var(--border-color);
    border-radius: 3px;
    overflow: hidden;
    margin-bottom: 15px;
}

.andro-progress-fill {
    height: 100%;
    background-color: #2196F3;
    /* Fixed Blue */
    width: 0%;
    transition: width 0.3s ease;
}

/* Details Log */
.andro-details-box {
    width: 100%;
    height: 150px;
    background-color: var(--secondary-color);
    color: var(--text-color);
    font-family: 'Courier New', monospace;
    font-size: 0.8rem;
    padding: 10px;
    overflow-y: auto;
    border: 1px solid var(--border-color);
    display: none;
    margin-top: 10px;
    border-radius: 4px;
    white-space: pre-wrap;
    word-break: break-all;
}

/* Footer Buttons */
.andro-wizard-footer {
    padding: 15px 20px;
    border-top: 1px solid var(--border-color);
    background-color: var(--primary-color);
    display: flex;
    justify-content: flex-end;
    gap: 10px;
}

.andro-wiz-btn {
    padding: 8px 18px;
    border-radius: 4px;
    font-size: 0.9rem;
    cursor: pointer;
    border: 1px solid transparent;
    transition: opacity 0.2s;
}

.btn-secondary {
    background: transparent;
    color: var(--secondary-text-color);
    border: 1px solid var(--border-color);
}

.btn-secondary:hover {
    color: var(--primary-text-color);
    border-color: var(--primary-text-color);
}

.btn-primary {
    background-color: var(--button-background-color, #4a88c7);
    color: var(--button-text-color, #ffffff);
    font-weight: 600;
}

.btn-primary:hover {
    opacity: 0.9;
}

.btn-disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background-color: var(--border-color);
    color: var(--secondary-text-color);
}

`;

const imageGenStyles=`

/* Large Top Image */
.camera-logo-large {
    margin: 0;
    filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.2));
    opacity: 0.9;
    object-fit: cover;
    object-position: 0px -37px;
    height: 53px;
    object-fit: cover;
    margin-bottom: 10px;
    aspect-ratio: 16 / 9;
    width: 261px;
    height: 107px;
}

/* Project ID Badge */
.project-id-badge {
    font-size: 0.75rem;
    background-color: rgba(255, 255, 255, 0.1);
    padding: 2px 8px;
    border-radius: 4px;
    color: #aaa;
    margin-left: 10px;
    font-family: monospace;
    border: 1px solid rgba(255, 255, 255, 0.05);
}

/* Config Card */
.icon-config-card {
    background-color: var(--secondary-color);
    border: 1px solid var(--border-color);
    border-radius: 6px;
    padding: 20px;
    width: 100%;
    max-width: 450px;
    margin-top: 20px;
    text-align: left;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

/* Preview Section Layout */
.preview-section {
    display: flex;
    gap: 20px;
    align-items: center;
    margin-bottom: 20px;
}

.icon-preview-box {
    width: 80px;
    height: 80px;
    background: #333;
    border-radius: 1px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px dashed #555;
    overflow: hidden;
    position: relative;
    flex-shrink: 0;
}

.preview-placeholder {
    opacity: 0.5;
    font-size: 0.7rem;
}

.preview-img-element {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: none;
}

/* Input Area */
.input-area {
    flex-grow: 1;
}

.input-row {
    display: flex;
    gap: 5px;
}

.input-path-field {
    font-size: 0.85rem;
    padding: 8px;
}

/* Meta Data (Size & Dims) */
.icon-meta-info {
    margin-top: 8px;
    display: none;
    /* Hidden initially */
}

.meta-tag {
    font-size: 0.75rem;
    font-family: monospace;
    padding: 2px 6px;
    border-radius: 3px;
    margin-right: 5px;
}

.meta-dim {
    color: #4CAF50;
    background: rgba(76, 175, 80, 0.1);
    border: 1px solid rgba(76, 175, 80, 0.2);
}

.meta-size {
    color: #2196F3;
    background: rgba(33, 150, 243, 0.1);
    border: 1px solid rgba(33, 150, 243, 0.2);
}

/* Divider */
.card-divider {
    border-top: 1px solid rgba(255, 255, 255, 0.05);
    margin: 15px 0;
}

/* File List (Tree View) */
.gen-file-list {
    margin-top: 15px;
    background: rgba(0, 0, 0, 0.2);
    padding: 10px;
    border-radius: 4px;
    font-family: monospace;
    font-size: 0.8rem;
    color: #81C784;
    /* Dark Greenish */
    display: none;
    /* Hidden initially */
    max-height: 150px;
    overflow-y: auto;
    border: 1px solid rgba(76, 175, 80, 0.2);
}

.tree-root {
    opacity: 0.7;
    color: #fff;
    margin-bottom: 5px;
}

.tree-parent {
    margin-left: 10px;
    color: #AED581;
    display: flex;
    gap: 5px;
    flex-direction: row;
    align-items: center;
}

.tree-child {
    margin-left: 25px;
    opacity: 0.9;
    display: block;
    display: flex;
    gap: 5px;
    flex-direction: row;
    align-items: center;
}

/* Progress Bar (Premium Look) */
.gen-progress-wrapper {
    width: 100%;
    margin-top: 15px;
    display: none;
    /* Hidden initially */
}

.gen-progress-track {
    height: 6px;
    width: 100%;
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
    overflow: hidden;
}

.gen-progress-bar {
    height: 100%;
    width: 0%;
    background: linear-gradient(90deg, #4CAF50, #8BC34A);
    transition: width 0.2s ease;
    box-shadow: 0 0 10px rgba(76, 175, 80, 0.4);
}

.gen-status-text {
    font-size: 0.8rem;
    color: #aaa;
    margin-top: 5px;
    text-align: center;
    font-style: italic;
}

/* Info Text */
.info-text {
    font-size: 0.8rem;
    color: #888;
    line-height: 1.4;
}

.btn-disabled-processing {
    opacity: 0.7;
    cursor: wait;
}

.package-id-text {
    color: #81C784;
    /* Dark Greenish */
    font-size: 0.85rem;
    margin-top: 5px;
    font-weight: 500;
    opacity: 0.9;
    text-align: center;
    text-align: center;
    padding: 2px;
    border-radius: 1px;
    align-items: center;
    justify-content: center;
    display: flex;
}

.id-code {
    font-family: monospace;
    background: rgba(76, 175, 80, 0.1);
    padding: 2px 6px;
    border-radius: 4px;
    border: 1px solid rgba(76, 175, 80, 0.2);
    border-radius: 1px;
}

`;

const configStyles=`

/* Config Page Container */
.andro-config-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    background-color: var(--primary-color);
    color: var(--primary-text-color);
    padding: 20px;
    align-items: center;
    overflow-x: hidden;
    overflow-y: auto;

}

.config-logo {
    width: 80px;
    margin-bottom: 15px;
    opacity: 0.9;
}

.config-title {
    font-size: 1.4rem;
    margin-bottom: 30px;
    font-weight: 600;
    color: var(--primary-text-color);
}

/* Settings Card */
.config-card {
    background-color: transparent;
    border: 1px solid var(--border-color);
    border-radius: 0;
    width: 100%;
    max-width: 500px;
    padding: 20px;
    margin-bottom: 20px;
}

.config-group {
    margin-bottom: 20px;
}

.config-label {
    display: block;
    margin-bottom: 10px;
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--popup-text-color);
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    padding-bottom: 5px;
    margin-top: 10px;
}

/* Radio Buttons Grid */
.radio-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
}

.aid-radio-build {
    display: flex;
    align-items: center;
    gap: 6px;
}

.radio-item {
    display: flex;
    align-items: center;
    gap: 10px;
    background: rgba(0, 0, 0, 0.2);
    padding: 0 10px;
    border-radius: 4px;
    cursor: pointer;
    border: 1px solid transparent;
    transition: all 0.2s;
}

.radio-item:hover {
    background: rgba(255, 255, 255, 0.05);
}

.radio-item input[type="radio"] {
    accent-color: #4CAF50;
    transform: scale(1.2);
}

/* Inputs */
.config-input {
    width: 100%;
    padding: 10px;
    background: rgba(0, 0, 0, 0.2);
    border: 1px solid var(--border-color);
    color: #fff;
    border-radius: 4px;
    margin-top: 5px;
}

/* Action Buttons */
.config-actions {
    display: flex;
    gap: 15px;
    width: 100%;
    max-width: 500px;
    margin-top: 10px;
}

.btn-build-start {
    background-color: #4CAF50;
    color: white;
    border: none;
    padding: 12px;
    flex-grow: 2;
    border-radius: 2px;
    font-weight: bold;
    font-size: 1rem;
    cursor: pointer;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
    font-family: "Bitcount Single", system-ui;
    font-optical-sizing: auto;
    font-weight: 500;
    font-style: normal;
    font-variation-settings:
        "slnt" 0,
        "CRSV" 0.5,
        "ELSH" 0,
        "ELXP" 0;
}

.btn-build-cancel {
    background-color: transparent;
    border: 1px solid var(--border-color);
    color: #bbb;
    padding: 12px;
    flex-grow: 1;
    border-radius: 2px;
    cursor: pointer;
}

`;

const cloneStyles=`

/* Clone Bar Overlay */
.andro-clone-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding-top: 80px;
    z-index: 999;
    animation: fadeIn 0.2s;
}

.andro-clone-box {
    background-color: var(--secondary-color);
    border: 1px solid var(--border-color);
    border-radius: 50px;
    /* Fully rounded/Thin look */
    padding: 5px 10px;
    display: flex;
    align-items: center;
    gap: 10px;
    width: 90%;
    max-width: 500px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
}

.andro-clone-input {
    flex-grow: 1;
    background: transparent;
    border: none;
    color: var(--primary-text-color);
    font-size: 0.9rem;
    padding: 8px 10px;
    outline: none;
}

.andro-clone-btn {
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 20px;
    padding: 8px 20px;
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.2s;
}

.andro-clone-btn:active {
    transform: scale(0.95);
}

.andro-clone-btn:disabled {
    background-color: #555;
    opacity: 0.7;
    cursor: wait;
}

.andro-clone-close {
    background: transparent;
    border: none;
    color: #F44336;
    font-size: 1.2rem;
    cursor: pointer;
    padding: 0 8px;
    display: flex;
    align-items: center;
}

/* Loading Circle (CSS Only) */
.clone-loader {
    width: 14px;
    height: 14px;
    border: 2px solid #ffffff;
    border-bottom-color: transparent;
    border-radius: 50%;
    display: inline-block;
    animation: spin 1s linear infinite;
    display: none;
    /* Hidden by default */
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

/* Icon Style */
.andro-clone-icon {
    width: 24px;
    height: 24px;
    margin-left: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    opacity: 0.7;
    transition: opacity 0.2s;
}

.andro-clone-icon:hover {
    opacity: 1;
}

.andro-clone-icon:active {
    transform: scale(0.9);
}

.andro-clone-icon svg {
    width: 100%;
    height: 100%;
    fill: var(--primary-text-color);
    /* Dynamic Color */
}

`;

const buildUIStyles=` .signing-section {
    display: none;
    background: rgba(0, 0, 0, 0.2);
    padding: 10px;
    border-radius: 1px;
    margin-top: 10px;
}

.input-group {
    margin-bottom: 8px;
}

.input-group label {
    display: block;
    font-size: 0.8rem;
    margin-bottom: 4px;
    color: #ccc;
}

.input-group input {
    width: 100%;
    padding: 8px;
    background: var(--primary-color);
    color: var(--primary-text-color);
    height: 33px;
    border-radius: 1px;
    border: none;
    background: var(--primary-color);
    border-bottom: 0.5px solid grey;
}

.btn-create-ks {
    background: transparent;
    color: var(--secondary-text-color);
    border: none;
    font-size: 0.8rem;
    margin-top: 5px;
    cursor: pointer;
    padding: 0 4px;
    border: none;
    border-bottom: 0.5px solid grey;
}

#btn-create-ks {
    padding: 5px 10px;
    border: 1px solid #444;
}







.gradle-card {
    background: none;
    padding: 10px;
    border-radius: 4px;
    margin-bottom: 20px;
    border: 1px solid #333;
    font-family: 'Consolas', 'Monaco', monospace;
    position: relative;
    /* For suggestion positioning */
    width: 95%;
    max-width: 400px;
}

.prop-row {
    display: flex;
    align-items: center;
    margin-bottom: 4px;
    background: #252526;
    padding: 4px 8px;
    border-radius: 2px;
    position: relative;
    height: 10px;
    padding: 2px 0;
}

.prop-row.comment {
    border-left: 3px solid #6a9955;
    background: transparent;
    padding-left: 0;
}

.prop-key {
    color: #9cdcfe;
    background: transparent;
    border: none;
    width: 45%;
    font-family: inherit;
    font-size: 0.85rem;
    outline: none;
    padding: 2px;
}

.prop-equals {
    color: #d4d4d4;
    margin: 0 5px;
}

.prop-value {
    color: #ce9178;
    background: transparent;
    border: none;
    flex: 1;
    font-family: inherit;
    font-size: 0.85rem;
    outline: none;
    border-bottom: 1px dashed #444;
    padding: 2px;
}

.prop-comment-text {
    color: #6a9955;
    width: 100%;
    background: transparent;
    border: none;
    font-style: italic;
    font-size: 0.85rem;
}

.btn-prop-del {
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
    opacity: 0.6;
    display: flex;
    align-items: center;
}

.btn-prop-del:hover {
    opacity: 1;
    color: #f44336;
}

.btn-prop-del svg {
    width: 14px;
    height: 14px;
    fill: currentColor;
}

/* Add Button Row */
.add-row {
    display: flex;
    justify-content: flex-end;
    margin-top: 5px;
}

.btn-add-prop {
    background: transparent;
    color: #4caf50;
    border: 1px solid #4caf50;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    font-size: 16px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    margin-top: 20px;
}

.btn-add-prop:hover {
    background: #4caf50;
    color: white;
}

/* Suggestion Box (DevTools Style) */
.suggestion-box {
    position: absolute;
    background: #1e1e1e;
    border: 1px solid #454545;
    z-index: 1000;
    max-height: 150px;
    overflow-y: auto;
    width: 250px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
    font-family: 'Consolas', monospace;
    font-size: 0.8rem;
    display: none;
}

.suggestion-item {
    padding: 6px 10px;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    color: #ccc;
    border-bottom: 1px solid #2a2a2a;
}

.suggestion-item:last-child {
    border-bottom: none;
}

.suggestion-item:hover,
.suggestion-item.active {
    background: #094771;
    color: white;
}

.sugg-main {
    font-weight: bold;
    color: #9cdcfe;
}

.sugg-desc {
    opacity: 0.6;
    font-size: 0.7rem;
    font-style: italic;
    margin-left: 10px;
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    margin-top: 20px;
    gap: 94px;
}

.btn-prop {
    border: none;
    padding: 3px 12px;
    border-radius: 2px;
    font-size: 0.8rem;
    cursor: pointer;
    color: white;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}


#btn-save-gradle {
    background: #0d6910;
}

#btn-reset-gradle {
    background: #444;
}

#btn-reset-gradle:hover {
    background: #666;
}

#btn-tool-icon {
    background: rgb(155, 113, 0);
}

#btn-tool-store {
    background: rgb(0, 78, 172);
}

.header-actions {
    display: flex;
    gap: 25px;
    align-items: ceneter;
}

` const featureStoreStyles=` .andro-feature-store {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: var(--primary-color);
    color: var(--primary-text-color);
}

.store-header {
    padding: 5px 12px;
    background: var(--secondary-color);
    border: none;
    display: flex;
    align-items: center;
    gap: 19px;
}

.store-logo {
    height: 40px;
    width: auto;
}

.store-title h2 {
    margin: 0;
    font-size: 1.2rem;
    color: #a4c639;
}

.store-title p {
    margin: 0;
    opacity: 0.7;
    font-size: 0.8rem;
}

.store-toolbar {
    padding: 1px;
    display: flex;
    gap: 10px;
    border-bottom: 1px solid var(--border-color);
}

#feature-search {
    flex: 1 1 0%;
    background: var(--primary-color);
    border: 1px solid var(--border-color);
    padding: 2px;
    color: var(--secondary-text-color);
    border-radius: 1px;
    height: 28px;
    margin-left: 9px;
}

.feature-head {
    display: flex;
    align-items: center;
    padding: 4px 8px 6px 3px;
    cursor: pointer;
    background: var(--secondary-color);
}

.feature-item {
    background: transparent;
    margin-bottom: 10px;
    border-radius: 1px;
    border-bottom: 1px solid rgb(62, 62, 62);
    overflow: hidden;
}

.feature-details {
    padding: 0px 10px 5px;
    border-top: 1px solid rgb(51, 51, 51);
}

.store-content {
    flex: 1;
    overflow-y: auto;
    padding: 10px;
}

/* Feature Item */
.feature-head:hover {
    background: #3e715229;
}

.feature-checkbox-wrapper {
    margin-right: 15px;
}

.feature-info {
    flex: 1;
}

.feature-name {
    font-weight: bold;
    font-size: 1rem;
}

.version-tag {
    font-size: 0.7rem;
    background: #14399C1C;
    padding: 2px 5px;
    border-radius: 3px;
    margin-left: 5px;
    border: 1.5px solid var(--border-color);
}

.feature-desc {
    font-size: 0.8rem;
    opacity: 0.7;
    margin-top: 2px;
}

.feature-status {
    margin-right: 10px;
}

.status-installed {
    color: #4caf50;
    font-size: 0.75rem;
    border: 1px solid #4caf50;
    padding: 2px 6px;
    border-radius: 10px;
}

.icon-expand {
    font-size: 0.8rem;
    opacity: 0.5;
    transition: transform 0.2s;
}

.feature-item.expanded .icon-expand {
    transform: rotate(180deg);
}

/* Details */
.comp-group-title {
    font-size: 0.75rem;
    font-weight: bold;
    color: #888;
    margin: 10px 0 5px 0;
    text-transform: uppercase;
}

.comp-label {
    font-size: 0.9rem;
    margin-left: 10px;
    word-break: break-all;
}

.comp-file {
    color: #569cd6;
    margin-right: 5px;
    font-family: monospace;
    font-size: 0.8rem;
}

/* Confirm Modal */
.confirm-list {
    max-height: 200px;
    overflow-y: auto;
    font-family: monospace;
    font-size: 0.85rem;
    background: #111;
    padding: 10px;
    border-radius: 4px;
}

.comp-row {
    display: flex;
    align-items: center;
    padding: 0px;
    cursor: pointer;
}

.comp-cb {
    height: 20px !important;
}

/* Icon Buttons (Transparent Background) */
.toolbar-actions {
    display: flex;
    align-items: center;
    gap: 8px;
    padding-right: 5px;
}

.store-icon-btn {
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 4px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s;
}

.store-icon-btn:hover {
    background: rgba(255, 255, 255, 0.1);
}

.store-icon-btn:active {
    transform: scale(0.95);
}

/* SVG Size Control */
.store-icon-btn svg {
    width: 24px;
    height: 24px;
}

/* Package Badge */
.pkg-badge {
    font-family: monospace;
    font-size: 0.75rem;
    color: #4caf50;
    background: rgba(76, 175, 80, 0.1);
    padding: 2px 6px;
    border-radius: 4px;
    border: 1px solid rgba(76, 175, 80, 0.2);
    display: inline-block;
    margin-top: 4px;
}

/* Empty State Container */
.store-empty-view {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    text-align: center;
    padding: 20px;
    animation: fadeIn 0.3s ease;
}

.empty-hero-img {
    width: 150px;
    height: auto;
    opacity: 0.8;
    margin-bottom: 20px;
    filter: drop-shadow(0 5px 15px rgba(0, 0, 0, 0.2));
}

.empty-title {
    font-size: 1.4rem;
    color: var(--primary-text-color);
    margin-bottom: 10px;
}

.empty-desc {
    color: var(--secondary-text-color);
    font-size: 0.9rem;
    max-width: 300px;
    line-height: 1.5;
    margin-bottom: 30px;
}

.empty-actions {
    display: flex;
    gap: 10px;
    align-items: center;
    justify-content: center;
}

.text-link-btn {
    background: transparent;
    border: none;
    color: #42a5f5;
    cursor: pointer;
    font-size: 0.9rem;
    text-decoration: underline;
    padding: 5px;
}

.text-link-btn:hover {
    color: #64b5f6;
}

.sep {
    color: #555;
}

/* Footer */
.store-footer {
    padding: 0;
    border-top: 1px solid var(--border-color);
    display: flex;
    justify-content: center;
    background: var(--primary-color);
}

.footer-back-btn {
    background: transparent;
    border: 1px solid var(--border-color);
    color: var(--secondary-text-color);
    padding: 8px 20px;
    border-radius: 20px;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 0.9rem;
}

.footer-back-btn:hover {
    background: rgba(255, 255, 255, 0.05);
    color: var(--primary-text-color);
    border-color: var(--primary-text-color);
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Permissions List View */
.perm-list-container {
    background: var(--secondary-color);
    border: 1px solid var(--border-color);
    border-radius: 4px;
    overflow: hidden;
}

.perm-list-item {
    display: flex;
    align-items: center;
    padding: 12px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.perm-list-item:last-child {
    border-bottom: none;
}

.perm-icon {
    font-size: 1.2rem;
    margin-right: 15px;
    opacity: 0.8;
}

.perm-name {
    color: var(--primary-text-color);
    font-weight: 600;
    font-size: 0.95rem;
}

.perm-full {
    color: var(--secondary-text-color);
    font-size: 0.75rem;
    font-family: monospace;
    margin-top: 2px;
}

/* Empty State Container */
.store-empty-view {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    text-align: center;
    padding: 20px;
    animation: fadeIn 0.3s ease;
}

`;

const modalStyles=`

/* Modal Styles */
.andro-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--primary-color);
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s;
    backdrop-filter: blur(0.1px);
}

.andro-modal-overlay.visible {
    opacity: 1;
    visibility: visible;
}

.andro-modal-box {
    background: var(--secondary-color);
    width: 90%;
    max-width: 400px;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
    transform: translateY(20px);
    transition: transform 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28);
}

.andro-modal-overlay.visible .andro-modal-box {
    transform: translateY(0);
}

.andro-modal-header {
    padding: 12px 15px;
    border-bottom: 1px solid var(--border-color);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.andro-modal-title {
    font-weight: bold;
    color: var(--primary-text-color);
}

.andro-modal-close {
    cursor: pointer;
    font-size: 1.5rem;
    line-height: 1;
    color: var(--primary-text-color);
}

.andro-modal-close:hover {
    color: #6c9186;
}

.andro-modal-body {
    padding: 15px;
    color: var(--primary-text-color);
    max-height: 60vh;
    overflow-y: auto;
}

.andro-modal-footer {
    padding: 10px 15px;
    border-top: 1px solid color: var(--border-color);
    display: flex;
    justify-content: flex-end;
    gap: 10px;
}

.andro-modal-btn {
    padding: 6px 16px;
    border-radius: 2px;
    border: none;
    cursor: pointer;
    font-weight: 500;
}

.andro-modal-btn.secondary {
    background: transparent;
    color: var(--primary-text-color);
    border: 1px solid #555;
}

.andro-modal-btn.secondary:hover {
    border-color: #888;
    color: #596689;
}

.andro-modal-btn.primary {
    background: #4caf50;
    color: var(--primary-text-color);
}

.andro-modal-btn.primary:hover {
    background: #43a047;
}

`;

const dropdownStyles2=`

/* Comp Row Layout */
.comp-row-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 2px 0;
}

.comp-row {
    flex-grow: 1;
    display: flex;
    align-items: center;
    cursor: pointer;
}

/* Version Button */
.version-btn {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid var(--border-color);
    color: #4caf50;
    font-size: 0.75rem;
    padding: 2px 8px;
    border-radius: 4px;
    cursor: pointer;
    font-family: monospace;
    display: flex;
    align-items: center;
    transition: all 0.2s;
}

.version-btn:hover {
    background: rgba(76, 175, 80, 0.1);
    border-color: #4caf50;
}

/* Dropdown Menu */
.andro-dropdown-menu {
    position: fixed;
    background: var(--primary-color);
    border: 1px solid var(--border-color);
    border-radius: 2px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
    z-index: 9999;
    min-width: 120px;
    overflow: hidden;
    animation: fadeIn 0.1s ease;
}

.dropdown-item {
    padding: 8px 12px;
    font-size: 0.85rem;
    color: #ccc;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.dropdown-item:hover {
    background: #094771;
    color: #fff;
}

.badge-def {
    font-size: 0.65rem;
    background: #333;
    padding: 1px 4px;
    border-radius: 2px;
    opacity: 0.7;
}

.dropdown-divider {
    height: 1px;
    background: #333;
    margin: 4px 0;
}

.dropdown-input-row {
    padding: 8px;
    display: flex;
    gap: 5px;
}

.dropdown-custom-input {
    width: 70px;
    background: var(--primary-color);
    border: 1px solid #444;
    color: var(--primary-text-color);
    font-size: 0.8rem;
    padding: 4px;
    border-radius: 2px;
}

.dropdown-add-btn {
    background: #4caf50;
    color: white;
    border: none;
    font-size: 0.75rem;
    padding: 0 8px;
    border-radius: 2px;
    cursor: pointer;
}

`;


// Checkbox Styles
const checkboxStyles=`

/* Global Checkbox Reset */
.andro-feature-store input[type="checkbox"],
.andro-config-container input[type="checkbox"],
.andro-modal-box input[type="checkbox"],
.andro-wizard-container input[type="checkbox"] {
    -webkit-appearance: none;
    appearance: none;
    margin: 0;
    padding: 0;
    width: 22px;
    height: 22px;
    border: none;
    outline: none;
    cursor: pointer;
    background-color: transparent;
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    transition: all 0.2s ease;
    vertical-align: middle;
}

/* UNCHECKED STATE (Grey Stroke) */
.andro-feature-store input[type="checkbox"],
.andro-config-container input[type="checkbox"],
.andro-modal-box input[type="checkbox"],
.andro-wizard-container input[type="checkbox"] {
    background-image: url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M4 7.2002V16.8002C4 17.9203 4 18.4801 4.21799 18.9079C4.40973 19.2842 4.71547 19.5905 5.0918 19.7822C5.5192 20 6.07899 20 7.19691 20H16.8031C17.921 20 18.48 20 18.9074 19.7822C19.2837 19.5905 19.5905 19.2842 19.7822 18.9079C20 18.4805 20 17.9215 20 16.8036V7.19691C20 6.07899 20 5.5192 19.7822 5.0918C19.5905 4.71547 19.2837 4.40973 18.9074 4.21799C18.4796 4 17.9203 4 16.8002 4H7.2002C6.08009 4 5.51962 4 5.0918 4.21799C4.71547 4.40973 4.40973 4.71547 4.21799 5.0918C4 5.51962 4 6.08009 4 7.2002Z' stroke='%23666666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
}

/* 🟦 USER SELECTED STATE (Blue Stroke - Default Checked) */
/* ইউজার যখন নতুন কিছু সিলেক্ট করবে তখন এই কালার দেখাবে */
.andro-feature-store input[type="checkbox"]:checked,
.andro-config-container input[type="checkbox"]:checked,
.andro-modal-box input[type="checkbox"]:checked,
.andro-wizard-container input[type="checkbox"]:checked {
    background-image: url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M4 14L9 19L20 8M6 8.88889L9.07692 12L16 5' stroke='%232196F3' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
}

/* ALREADY INSTALLED STATE (Green Stroke) */
.andro-feature-store input[type="checkbox"].installed:checked {
    background-image: url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M4 14L9 19L20 8M6 8.88889L9.07692 12L16 5' stroke='%234CAF50' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
}

/* INDETERMINATE STATE */
.andro-feature-store input[type="checkbox"]:indeterminate {
    opacity: 0.7;
    filter: grayscale(100%);
    background-image: url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M4 14L9 19L20 8M6 8.88889L9.07692 12L16 5' stroke='%23999999' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
}

.andro-feature-store input[type="checkbox"]:hover {
    opacity: 0.8;
    transform: scale(1.05);
}

`;

// Package View Styles
const packageStyles=`

/* Package Group Title */
.pkg-section-title {
    font-size: 0.75rem;
    font-weight: bold;
    color: #a4c639;
    /* Android Green */
    margin: 15px 0 5px 0;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-bottom: 1px dashed rgba(164, 198, 57, 0.3);
    padding-bottom: 4px;
}

/* See Packages Button */
.btn-view-packages {
    background: transparent;
    border: none;
    color: rgb(164, 198, 57);
    width: 100%;
    padding: 0;
    margin-top: 15px;
    border-radius: 1px;
    font-size: 0.8rem;
    cursor: pointer;
    transition: 0.2s;
    text-align: start;
    display: flex;
    align-items: center;
    gap: 5px;
    font-style: italic;
    margin-left: 6px;
    font-style: italic;
    text-decoration-line: underline;
}

.btn-view-packages:hover {
    background: rgba(164, 198, 57, 0.1);
    border-color: #a4c639;
}

/* Package Viewer Container (Replaces details content) */
.package-view-container {
    padding: 10px 5px;
    animation: slideInRight 0.3s ease;
    position: relative;
}

/* Back Button */
.pkg-back-btn {
    position: absolute;
    top: 5px;
    right: 0;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 5px;
    border-radius: 50%;
    transition: background 0.2s;
}

.pkg-back-btn:hover {
    background: rgba(255, 255, 255, 0.1);
}

/* Tree Hierarchy */
.pkg-tree-root {
    margin-bottom: 15px;
}

.pkg-name {
    font-family: monospace;
    color: var(--secondary-text-color);
    font-weight: bold;
    font-size: 0.9rem;
}

.pkg-desc {
    font-size: 0.8rem;
    color: #888;
    margin-bottom: 8px;
    font-style: italic;
}

.pkg-content {
    margin-left: 15px;
    border-left: 1px solid #444;
    padding-left: 10px;
}

/* Items */
.cls-item,
.int-item {
    margin: 4px 0;
    font-size: 0.85rem;
}

.cls-name {
    color: #64b5f6;
    font-family: monospace;
}

/* Blue for Class */
.int-name {
    color: #ffb74d;
    font-family: monospace;
}

/* Orange for Interface */
.item-desc {
    color: #aaa;
    font-size: 0.75rem;
    margin-left: 5px;
}

/* Sub Package */
.sub-pkg {
    margin-top: 10px;
}

.sub-pkg-name {
    color: #ce93d8;
    font-family: monospace;
    font-size: 0.85rem;
    font-weight: bold;
}

@keyframes slideInRight {
    from {
        opacity: 0;
        transform: translateX(10px);
    }

    to {
        opacity: 1;
        transform: translateX(0);
    }
}



/* Activity Selector in Toolbar */
.activity-selector-bar {
    display: flex;
    align-items: center;
    padding: 8px 12px;
    background: #1e1e1e;
    border-bottom: 1px solid var(--border-color);
    font-size: 0.85rem;
    gap: 10px;
}

.act-sel-label {
    opacity: 0.7;
}

.act-dropdown-trigger {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    background: rgba(255, 255, 255, 0.05);
    padding: 4px 10px;
    border-radius: 4px;
    border: 1px solid var(--border-color);
    color: #4caf50;
    font-weight: 500;
}

.act-dropdown-trigger:hover {
    background: rgba(255, 255, 255, 0.1);
}

.act-lang-badge {
    font-size: 0.65rem;
    padding: 1px 4px;
    border-radius: 3px;
    color: #000;
    font-weight: bold;
}

.act-lang-badge.java {
    background: #ffca28;
}

.act-lang-badge.kotlin {
    background: #7e57c2;
    color: #fff;
}


`;



const snippetStyles=`

/* Snippet List Item */
.snippet-item {
    display: flex;
    align-items: center;
    padding: 8px;
    margin: 4px 0;
    cursor: pointer;
    border-radius: 4px;
    background: rgba(255, 255, 255, 0.02);
    transition: background 0.2s;
}

.snippet-item:hover {
    background: rgba(255, 255, 255, 0.05);
}

.snippet-icon {
    font-family: monospace;
    color: #4caf50;
    background: rgba(76, 175, 80, 0.1);
    padding: 2px 5px;
    border-radius: 3px;
    margin-right: 10px;
    font-size: 0.8rem;
    font-weight: bold;
}

.snippet-label {
    font-size: 0.9rem;
    color: var(--primary-text-color);
}

/* Snippet View Header */
.snippet-header {
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 1px solid var(--border-color);
}

.snippet-title-row {
    display: flex;
    align-items: center;
    margin-bottom: 5px;
    justify-content: flex-start;
    gap: 30px;
}

.snippet-view-title {
    font-size: 1rem;
    font-weight: bold;
    color: #4caf50;
}

.snippet-desc {
    font-size: 0.85rem;
    color: var(--secondary-text-color);
    font-style: italic;
}

/* Push Button */
.btn-push-snippet {
    background: #4caf50;
    color: white;
    border: none;
    padding: 6px 12px;
    border-radius: 1px;
    cursor: pointer;
    font-size: 0.8rem;
    font-weight: bold;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    transition: background 0.2s;
}

.btn-push-snippet:hover {
    background: #43a047;
}

/* Code Preview */
.code-preview-box {
    background: #1e1e1e;
    border: 1px solid #333;
    border-radius: 4px;
    overflow: hidden;
}

.code-lang-label {
    background: #252526;
    color: #888;
    font-size: 0.7rem;
    padding: 4px 10px;
    border-bottom: 1px solid #333;
    font-weight: bold;
}

.code-content {
    padding: 10px;
    margin: 0;
    color: #d4d4d4;
    font-family: 'Consolas', monospace;
    font-size: 0.8rem;
    overflow-x: auto;
    white-space: pre;
    user-select: text;
}

.snippet-note {
    margin-top: 15px;
    font-size: 0.75rem;
    color: #888;
    border-left: 3px solid #ff9800;
    padding-left: 10px;
}




.snippet-tasks-list {
    margin-top: 15px;
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.snippet-task-card {
    background: rgba(0, 0, 0, 0.2);
    border: 1px solid var(--border-color);
    border-radius: 4px;
    padding: 10px;
    position: relative;
}

.task-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}

.task-info {
    display: flex;
    align-items: center;
    gap: 10px;
}

.task-checkbox {
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.task-checkbox.checked svg path {
    stroke: #4caf50;
}

.task-title {
    font-size: 0.9rem;
    font-weight: bold;
    color: #eee;
}

.task-path {
    font-size: 0.75rem;
    color: #888;
    font-family: monospace;
}

.btn-push-single {
    background: transparent;
    border: 1px solid #4caf50;
    color: #4caf50;
    padding: 4px 10px;
    border-radius: 2px;
    font-size: 0.75rem;
    cursor: pointer;
    transition: all 0.2s;
    position: absolute;
    right: 1px;
    top: 1px;
    border-color: #19E73C23;
}

.btn-push-single:hover {
    background: #4caf50;
    color: white;
}

.btn-push-all {
    background: #4caf50;
    color: white;
    border: none;
    padding: 6px 12px;
    border-radius: 2px;
    font-weight: bold;
    font-size: 0.8rem;
    cursor: pointer;
}

`;

const syntaxHighlightStyles=`

/* 🔥 SYNTAX HIGHLIGHTING COLORS (Dracula Theme inspired) */
.syn-kwd {
    color: #ff79c6;
    font-weight: bold;
}

/* Keywords (public, class, val) */
.syn-str {
    color: #f1fa8c;
}

/* Strings ("Hello") */
.syn-com {
    color: #6272a4;
    font-style: italic;
}

/* Comments (// code) */
.syn-num {
    color: #bd93f9;
}

/* Numbers */
.syn-type {
    color: #8be9fd;
    font-style: italic;
}

/* Types/Classes */
.syn-ann {
    color: #50fa7b;
}

/* Annotations (@Override) */

/* XML / HTML Specific */
.syn-tag {
    color: #ff79c6;
}

/* Tags (<Button>) */
.syn-attr {
    color: #50fa7b;
    font-style: italic;
}

/* Attributes (android:id) */
.syn-val {
    color: #f1fa8c;
}

/* Attribute Values */

.code-content {
    padding: 10px;
    margin: 0;
    color: #f8f8f2;
    /* Default Text Color */
    font-family: 'Consolas', 'Fira Code', monospace;
    font-size: 0.85rem;
    line-height: 1.5;
    overflow-x: auto;
    white-space: pre;
}

`;


export const previewStyles=` .xml-preview-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%);
    overflow: hidden;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* Toolbar */
.preview-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 20px;
    background: #252525;
    border-bottom: 1px solid #3d3d3d;
}

.aid-icon-btn {
    width: 28px;
}

.preview-title {
    color: #e0e0e0;
    font-size: 14px;
    font-weight: 500;
}

.preview-actions {
    display: flex;
    gap: 8px;
}

.preview-actions button {
    background: #3d3d3d;
    border: 1px solid #555;
    color: #e0e0e0;
    padding: 6px 12px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.2s;
}

.preview-actions button:hover {
    background: #4d4d4d;
    border-color: #666;
}

.preview-actions button:active {
    transform: scale(0.95);
}

/* Device Frame */
#preview-root {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    overflow: auto;
}

.device-screen {
    width: 360px;
    max-width: 100%;
    min-height: 640px;
    background: white;
    border-radius: 30px;
    box-shadow:
        0 0 0 10px #1a1a1a,
        0 0 0 12px #333,
        0 20px 60px rgba(0, 0, 0, 0.5);
    overflow: auto;
    border: 2px solid #000;
    transition: transform 0.3s ease;
}

/* Preview Content */
.android-preview-root {
    width: 100%;
    min-height: 100%;
    background: #f5f5f5;
}

/* Android Views */
.android-linear-layout,
.android-relative-layout,
.android-frame-layout {
    box-sizing: border-box;
}

.android-text-view {
    box-sizing: border-box;
    font-family: 'Roboto', sans-serif;
}

.android-button {
    font-family: 'Roboto', sans-serif;
    transition: box-shadow 0.2s;
}

.android-button:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.android-edit-text {
    font-family: 'Roboto', sans-serif;
    box-sizing: border-box;
}

.android-edit-text:focus {
    border-bottom-color: #6200EE;
}

.android-image-view {
    box-sizing: border-box;
}

.android-checkbox {
    cursor: pointer;
    user-select: none;
}

.android-checkbox input[type="checkbox"] {
    width: 18px;
    height: 18px;
    cursor: pointer;
}

.android-card-view {
    box-sizing: border-box;
}

.android-scroll-view {
    box-sizing: border-box;
}

.android-unknown-view {
    box-sizing: border-box;
}

/* Preview States */
.preview-error {
    padding: 20px;
    color: #d32f2f;
    background: #ffebee;
    border-left: 4px solid #d32f2f;
    margin: 20px;
    border-radius: 4px;
}

.preview-error h3 {
    margin-top: 0;
    font-size: 16px;
}

.preview-error pre {
    background: #fff;
    padding: 10px;
    border-radius: 4px;
    overflow-x: auto;
    font-size: 12px;
}

.preview-empty {
    padding: 40px;
    text-align: center;
    color: #999;
    font-size: 16px;
}

/* Footer */
.preview-footer {
    padding: 12px 20px;
    background: #252525;
    border-top: 1px solid #3d3d3d;
    text-align: center;
}

.preview-info {
    color: #b0b0b0;
    font-size: 12px;
}

/* Scrollbar */
.device-frame::-webkit-scrollbar,
.device-screen::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}

.device-frame::-webkit-scrollbar-track,
.device-screen::-webkit-scrollbar-track {
    background: #2d2d2d;
}

.device-frame::-webkit-scrollbar-thumb,
.device-screen::-webkit-scrollbar-thumb {
    background: #555;
    border-radius: 4px;
}

.device-frame::-webkit-scrollbar-thumb:hover,
.device-screen::-webkit-scrollbar-thumb:hover {
    background: #666;
}

/* Responsive */
@media (max-width: 768px) {
    .device-screen {
        width: 100%;
        border-radius: 0;
        box-shadow: none;
    }

    .preview-toolbar {
        flex-direction: column;
        gap: 10px;
    }
}

/*TOOLBAR Styles*/
#toolbar-menu {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    margin-top: 4px;
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 6px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    min-width: 220px;
    z-index: 10000;
    overflow: hidden
}

#aid-btn-menu {
    border: none;
    background: transparent;
    cursor: pointer;
    padding: 6px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: inherit;
}

#aid-toolbar-menu {
    padding: 8px 12px;
    border-bottom: 1px solid #eee;
    font-size: 11px;
    color: #888;
    font-weight: 600;
    text-transform: uppercase;
}

#aid-toolbar-menu .menu-item {
    padding: 8px 12px;
    cursor: pointer;
    font-size: 13px;
    display: flex;
    align-items: center;
    gap: 8px;
}


`;




const buildStyles=`

/* Full Page Container */
.andro-build-page {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    background-color: var(--primary-color);
    color: var(--primary-text-color);
    font-family: sans-serif;
    overflow: hidden;
}

/* Header (Name & Download Button) */
.andro-build-header-sec {
    padding: 10px 15px;
    background-color: var(--secondary-color);
    border-bottom: 1px solid var(--border-color);
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 20px;
}

.build-app-name {
    font-weight: bold;
    font-size: 1rem;
    color: var(--primary-text-color);
    display: flex;
    align-items: center;
    gap: 8px;
}

.thin-download-btn {
    background-color: rgb(19, 99, 22);
    color: white;
    border: none;
    padding: 6px 15px;
    border-radius: 1px;
    font-size: 0.8rem;
    cursor: pointer;
    display: none;
    /* Hidden initially */
    text-transform: uppercase;
    letter-spacing: 0.5px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.thin-download-btn:hover {
    background-color: #43a047;
}

.thin-download-btn:active {
    transform: scale(0.95);
}

/* Main Body (Centered) */
.andro-build-body {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    padding: 20px;
    text-align: center;
    overflow-y: scroll;
    overflow-x: hidden;
}

.build-logo-large {
    width: 180px;
    margin: 0;
    filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.2));
    opacity: 0.9;
    object-fit: cover;
    object-position: 0px -37px;
    height: 53px;
}

.build-logo-gif {
    width: 50px;
    margin-bottom: 20px;
    filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.2));
    opacity: 0.9;
}

.build-main-status {
    font-size: 1.4rem;
    font-weight: 300;
    margin-bottom: 10px;
    color: var(--primary-text-color);
}

/* Progress Area */
.build-progress-wrapper {
    width: 100%;
    max-width: 450px;
    margin-top: 20px;
    text-align: left;
}

.build-sub-status {
    font-size: 0.85rem;
    color: #999;
    margin-bottom: 8px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-family: monospace;
    min-height: 1.2em;
}

.andro-build-track {
    height: 6px;
    width: 100%;
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
    overflow: hidden;
}

.andro-build-bar {
    height: 100%;
    width: 0%;
    background-color: #fff;
    /* Starting Blue */
    transition: width 0.3s ease, background-color 0.5s ease;
}

/* Details Button */
.btn-show-details {
    background: transparent;
    border: 1px solid var(--border-color);
    color: #bbb;
    padding: 5px 12px;
    font-size: 0.75rem;
    border-radius: 15px;
    margin-top: 15px;
    cursor: pointer;
    transition: all 0.2s;
}

.btn-show-details:hover {
    background-color: rgba(255, 255, 255, 0.05);
}

#btn-stop:hover {
    background-color: rgba(244, 67, 54, 0.1);
}

/* Log Box - Ensure New Lines */
.build-details-box {
    width: 100%;
    max-width: 500px;
    max-height: 330px;
    min-height: 200px;
    height: 330px;
    background-color: #1e1e1e;
    color: #a9b7c6;
    font-family: 'Courier New', monospace;
    font-size: 0.8rem;
    padding: 10px;
    overflow-y: auto;
    border: 1px solid #333;
    border-radius: 4px;
    margin-top: 15px;
    display: none;
    text-align: left;
    white-space: pre-wrap;
    /* ✅ This fixes the new line issue */
    word-break: break-all;
    user-select: text;
}

/* Footer Info */
.build-path-info {
    margin-top: auto;
    /* Push to bottom */
    padding: 15px;
    font-size: 0.8rem;
    color: #888;
    font-style: italic;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
    width: 100%;
    text-align: center;
    background-color: rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
}

.after-build-informmation {
    color: rgb(52, 141, 193);
    font-size: 11px;
    font-style: italic;
    margin-top: 12px;
}

`;



export const blueprintStyles=`
/* Blueprint Mode Styles */

/* Blueprint Mode Activation */
#preview-root.blueprint-mode {
    background: #1e3a5f !important;
}

#preview-root.blueprint-mode .android-layout.constraint-layout {
    background-color: #2d4a6d !important;
}

/* View Outlines in Blueprint Mode */
#preview-root.blueprint-mode .android-view,
#preview-root.blueprint-mode .android-layout {
    border: 1px dashed rgba(100, 200, 255, 0.4) !important;
    background-color: rgba(45, 74, 109, 0.6) !important;
}

/* Hide images/text content in blueprint mode */
#preview-root.blueprint-mode .android-view img,
#preview-root.blueprint-mode .android-view span,
#preview-root.blueprint-mode .text-view span {
    opacity: 0.3 !important;
}

/* Show element IDs in blueprint mode */
#preview-root.blueprint-mode .android-view::before,
#preview-root.blueprint-mode .android-layout::before {
    content: attr(id);
    position: absolute;
    top: -16px;
    left: 0;
    font-size: 8px;
    color: #64C8FF;
    font-family: 'Roboto Mono', monospace;
    background: #1e3a5f4a;
    padding: 2px 6px;
    border-radius: 3px;
    z-index: 10;
    pointer-events: none;
}

/* Selected Element Highlight */
.blueprint-selected {
    border: 2px solid #FFD700 !important;
    box-shadow: 0 0 12px rgba(255, 215, 0, 0.6) !important;
    z-index: 100 !important;
}

.blueprint-selected::before {
    color: #FFD700 !important;
    font-weight: bold !important;
}

/* Hover Effect */
#preview-root.blueprint-mode .android-view:hover,
#preview-root.blueprint-mode .android-layout:hover {
    border-color: rgba(100, 200, 255, 0.8) !important;
    background-color: rgba(100, 200, 255, 0.15) !important;
    cursor: pointer;
}

/* Dimension Labels */
#preview-root.blueprint-mode .android-view::after {
    content: attr(data-dimensions);
    position: absolute;
    bottom: -16px;
    right: 0;
    font-size: 9px;
    color: #90CAF9;
    font-family: 'Roboto Mono', monospace;
    background: rgba(30, 58, 95, 0.8);
    padding: 2px 4px;
    border-radius: 2px;
    pointer-events: none;
}

/* Spring Connection Styles */
.blueprint-springs-overlay path {
    vector-effect: non-scaling-stroke;
}

/* Chain Indicators */
.blueprint-springs-overlay circle {
    filter: drop-shadow(0 0 3px rgba(255, 160, 0, 0.8));
}

/* Blueprint Toggle Button Style */
.blueprint-toggle-btn {
    position: fixed;
    bottom: 24px;
    right: 24px;
    padding: 12px 20px;
    background: linear-gradient(135deg, #1e88e5 0%, #1565c0 100%);
    color: white;
    border: none;
    border-radius: 8px;
    font-family: 'Roboto', sans-serif;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(30, 136, 229, 0.4);
    transition: all 0.3s ease;
    z-index: 10000;
}

.blueprint-toggle-btn:hover {
    background: linear-gradient(135deg, #1976d2 0%, #0d47a1 100%);
    box-shadow: 0 6px 16px rgba(30, 136, 229, 0.6);
    transform: translateY(-2px);
}

.blueprint-toggle-btn.active {
    background: linear-gradient(135deg, #ffa726 0%, #f57c00 100%);
    box-shadow: 0 4px 12px rgba(255, 167, 38, 0.4);
}

.blueprint-toggle-btn.active:hover {
    background: linear-gradient(135deg, #fb8c00 0%, #ef6c00 100%);
    box-shadow: 0 6px 16px rgba(255, 167, 38, 0.6);
}

/* Info Panel for Selected Element */
.blueprint-info-panel {
    position: fixed;
    top: 80px;
    right: 24px;
    background: rgba(30, 58, 95, 0.95);
    border: 1px solid #64C8FF;
    border-radius: 8px;
    padding: 16px;
    min-width: 250px;
    max-width: 350px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
    font-family: 'Roboto Mono', monospace;
    font-size: 12px;
    color: #E3F2FD;
    z-index: 10001;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease;
}

.blueprint-info-panel.visible {
    opacity: 1;
    pointer-events: auto;
}

.blueprint-info-panel .panel-title {
    color: #FFD700;
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: 1px solid rgba(100, 200, 255, 0.3);
}

.blueprint-info-panel .constraint-item {
    margin: 6px 0;
    padding-left: 8px;
    border-left: 2px solid #64C8FF;
}

.blueprint-info-panel .constraint-label {
    color: #90CAF9;
    font-weight: 500;
}

.blueprint-info-panel .constraint-value {
    color: #FFFFFF;
    margin-left: 4px;
}

/* Constraint Type Badges */
.constraint-badge {
    display: inline-block;
    padding: 2px 6px;
    border-radius: 3px;
    font-size: 10px;
    font-weight: bold;
    margin-left: 4px;
}

.constraint-badge.horizontal {
    background: rgba(33, 150, 243, 0.3);
    color: #64B5F6;
}

.constraint-badge.vertical {
    background: rgba(76, 175, 80, 0.3);
    color: #81C784;
}

.constraint-badge.chain {
    background: rgba(255, 152, 0, 0.3);
    color: #FFB74D;
}

/* Animation for Blueprint Mode Toggle */
@keyframes blueprintFadeIn {
    from {
        opacity: 0;
        transform: scale(0.95);
    }

    to {
        opacity: 1;
        transform: scale(1);
    }
}

#preview-root.blueprint-mode .blueprint-springs-overlay {
    animation: blueprintFadeIn 0.4s ease;
}

/* Responsive Design */
@media (max-width: 768px) {
    .blueprint-toggle-btn {
        bottom: 16px;
        right: 16px;
        padding: 10px 16px;
        font-size: 13px;
    }

    .blueprint-info-panel {
        top: 60px;
        right: 16px;
        min-width: 200px;
        max-width: 280px;
        padding: 12px;
        font-size: 11px;
    }
}

/* Dark mode enhancement */
@media (prefers-color-scheme: dark) {
    #preview-root.blueprint-mode {
        background: #0d1b2a !important;
    }

    #preview-root.blueprint-mode .android-layout.constraint-layout {
        background-color: #1b2838 !important;
    }
}








/* MODE 2: HYBRID */
#preview-root.blueprint-hybrid [class*="android-view"] {
    border: 1px dashed rgba(100, 200, 255, 0.6) !important;
}

#preview-root.blueprint-hybrid .blueprint-springs-overlay {
    opacity: 0.8 !important;
    filter: drop-shadow(0px 1px 2px rgba(0, 0, 0, 0.5));
}

`;


// DYNAMIC FRAME STYLES
export const frameStyles=` .device-frame {
    border: 12px solid #111 !important;
    border-radius: 32px !important;
    transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    flex-shrink: 0 !important;
    flex-grow: 0 !important;
}

.device-frame .hardware-camera {
    top: 6px;
    left: 50%;
    transform: translateX(-50%);
}

.device-frame.landscape {
    border-width: 12px !important;
}

.device-frame.landscape .hardware-camera {
    top: 50%;
    left: 6px;
    transform: translateY(-50%);
}

/* Ensure SVGs inherit text color in Normal Mode */
.device-frame svg {
    fill: currentColor;
}

/* Smooth Color Transition */
#preview-root,
#preview-root * {
    transition: background-color 0.2s, color 0.2s, border-color 0.2s;
}

`;

export const sideBarStyles=`

/* ========== SIDEBAR CONTAINER ========== */
.attributes-sidebar {
    position: fixed;
    right: 0;
    top: 55px;
    bottom: 0;
    width: 320px;
    background-color: var(--primary-color);
    color: var(--secondary-text-color);
    z-index: 10000;
    display: flex;
    flex-direction: column;
    box-shadow: -4px 0 12px var(--box-shadow-color);
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    font-size: 12px;
    transition: transform 0.2s ease-out;
    border-left: 1px solid var(--border-color);
}

.attributes-sidebar.hidden {
    transform: translateX(100%);
}

.attributes-sidebar.open {
    transform: translateX(0);
}

/* ========== HEADER ========== */
.sidebar-header {
    padding: 1px 16px;
    border-bottom: 1px solid var(--border-color);
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: var(--secondary-color);
    flex-shrink: 0;
}

.sidebar-title {
    font-size: 13px;
    font-weight: 600;
    color: var(--primary-text-color);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.sidebar-toggle-btn {
    background: none;
    outline: none;
    border: none;
    color: currentColor;
}

.sidebar-close {
    background: none;
    border: none;
    color: var(--secondary-text-color);
    cursor: pointer;
    padding: 4px;
    display: flex;
    align-items: center;
    border-radius: 3px;
    transition: background 0.15s;
}

.sidebar-close:hover {
    background: var(--active-color);
    color: var(--active-text-color);
}

/* ========== CONTENT ========== */
.sidebar-content {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding-bottom: 55px;
}

.sidebar-content::-webkit-scrollbar {
    width: 6px;
}

.sidebar-content::-webkit-scrollbar-track {
    background: var(--primary-color);
}

.sidebar-content::-webkit-scrollbar-thumb {
    background: var(--scrollbar-color);
    border-radius: 5px;
}

/* ========== SECTIONS ========== */
.sidebar-section {
    border-bottom: 1px solid var(--border-color);
}

.section-header {
    padding: 4px 16px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
    background-color: var(--primary-color);
    transition: background 0.15s;
    user-select: none;
}

.section-header:hover {
    background: var(--secondary-color);
}

.section-title {
    font-size: 12px;
    font-weight: 600;
    color: var(--primary-text-color);
}

.section-body {
    padding: 12px 16px;
    background-color: var(--primary-color);
}

.section-subheader {
    font-size: 11px;
    font-weight: 600;
    color: var(--secondary-text-color);
    margin-bottom: 8px;
    margin-top: 8px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

/* ========== ATTRIBUTE ROWS ========== */
.attr-row {
    display: flex;
    justify-content: space-between;
    padding: 6px 0;
    font-size: 12px;
    border-bottom: 1px solid var(--border-color);
}

.attr-label {
    color: var(--link-text-color);
    font-family: Consolas, monospace;
}

.attr-value {
    color: var(--active-text-color);
    font-family: Consolas, monospace;
    text-align: right;
}

/* ========== CONSTRAINT ROWS ========== */
.constraint-row {
    padding: 6px 0;
    font-size: 11px;
    border-bottom: 1px solid var(--border-color);
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: var(--secondary-text-color);
}

.margin-badge {
    color: var(--active-text-color);
    font-size: 10px;
    background-color: var(--active-color);
    padding: 2px 6px;
    border-radius: 3px;
}

/* ========== RESIZE HANDLE ========== */
.resize-handle {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 8px;
    cursor: col-resize;
    z-index: 1001;
    display: flex;
    align-items: center;
    justify-content: center;
    transform: translateX(-50%);
}

.resize-visual {
    width: 2px;
    height: 30px;
    background-color: var(--border-color);
    border-radius: 2px;
    transition: background-color 0.2s;
}

.resize-handle:hover .resize-visual {
    background-color: var(--active-color);
}

/*Constraint Widget*/

.constraint-widget-container {
    position: relative;
    width: 200px;
    height: 180px;
    background: #2b2d30;
    margin: 0 auto;
    user-select: none;
    font-family: monospace;
}

/* Blueprint Grid Background */
.cw-grid-bg {
    position: absolute;
    inset: 10px;
    border: 1px solid #3e4145;
    background-image:
        linear-gradient(#323538 1px, transparent 1px),
        linear-gradient(90deg, #323538 1px, transparent 1px);
    background-size: 20px 20px;
}

/* Central View Box */
.cw-view-box {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80px;
    height: 80px;
    background: #0005;
    border: 1px solid #a9b7c6;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2;
}

/* Dimension Toggles inside Box */
.cw-dim-toggle {
    position: absolute;
    cursor: pointer;
    color: #a9b7c6;
    font-size: 10px;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
}

.cw-dim-toggle:hover {
    color: #64C8FF;
}

.cw-dim-w {
    width: 100%;
    height: 16px;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
}

.cw-dim-h {
    height: 100%;
    width: 16px;
    left: 50%;
    top: 0;
    transform: translateX(-50%);
    flex-direction: column;
}

/* Constraint Connectors (Lines) */
.cw-connector {
    position: absolute;
    background: #507399;
    /* Inactive Blue */
    transition: all 0.2s;
    z-index: 1;
}

.cw-connector.active {
    background: #64C8FF;
    /* Active Blue */
}

/* Margin Inputs */
.cw-margin {
    position: absolute;
    font-size: 10px;
    color: #a9b7c6;
    background: #2b2d30;
    padding: 0 2px;
    cursor: text;
}

.cw-margin:hover {
    color: #fff;
}

/* Constraint Kill Buttons (x) */
.cw-kill-btn {
    position: absolute;
    width: 12px;
    height: 12px;
    background: #cc4d4d;
    border-radius: 50%;
    color: white;
    font-size: 9px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.2s;
    z-index: 10;
}

.constraint-widget-container:hover .cw-kill-btn {
    opacity: 1;
}

/* Connection Anchors (Circles) */
.cw-anchor {
    position: absolute;
    width: 8px;
    height: 8px;
    border: 1px solid #6c707e;
    border-radius: 50%;
    background: #2b2d30;
    cursor: pointer;
    z-index: 5;
}

.cw-anchor.connected {
    background: #64C8FF;
    border-color: #64C8FF;
}

.cw-anchor:hover {
    border-color: #fff;
}

/* Bias Sliders */
.cw-bias-track {
    position: absolute;
    background: transparent;
}

.cw-bias-thumb {
    position: absolute;
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-bottom: 8px solid #a9b7c6;
    cursor: grab;
    z-index: 4;
}

.cw-bias-thumb:hover {
    border-bottom-color: #fff;
}

`;



export const pageStyles=baseStyles+createPageStyles+gridStyles+configPageStyles+dropdownStyles+footerStyles+resultPageStyles+wizardStyles+buildStyles+imageGenStyles+configStyles+cloneStyles+buildUIStyles+featureStoreStyles+modalStyles+dropdownStyles2+checkboxStyles+packageStyles+snippetStyles+syntaxHighlightStyles;