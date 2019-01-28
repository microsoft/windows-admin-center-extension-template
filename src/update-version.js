//
//
const fse = require('fs-extra');
const { resolve } = require('path');
const { readdir, stat } = require('fs').promises;
const fs = require('fs');
let updateCount = 0;
let updateSource = [];

module.exports = {
    update: function (audit, rootPath) {
        console.log(`update called with ${audit} and ${rootPath}`);

        searchFolder(rootPath)
            .then(results => {
                for (var file in results) {
                    searchFile(results[file], audit);
                }

                finalize();
            });
    }
}

function finalize() {
    console.log(`There are ${updateCount} updates that need to be handled.`);
}

async function searchFolder(folderPath) {
    let subDirectories = await readdir(folderPath);
    var cleaned = subDirectories.filter(item => isValidDirectory(item));

    let files = await Promise.all(cleaned.map(async (subDirectory) => {
        let resource = resolve(folderPath, subDirectory);
        return (await stat(resource)).isDirectory() ? searchFolder(resource) : resource;
    }));
    return Array.prototype.concat(...files);
}

function isValidDirectory(path) {
    if (path.indexOf('src') < 0 ) {
        return false;
    }

    return true;
}

function searchFile(filePath, audit) {
    if (!fs.statSync(filePath).isDirectory()) {
        if (!fse.existsSync(filePath)) {
            return;
        }

        let actions = buildElements();
        let fileData = fse.readFileSync(filePath, 'utf8');
        let editActions = {};

        for (var actionKey in actions) {
            let displayNameIndex = fileData.indexOf(actionKey);
            if (displayNameIndex >= 0) {
                let message = `Found: ${actionKey} in file: ${filePath}.  Required action: use ${actions[actionKey].content} instead.`;
                console.log(message);
                updateSource.push(message);

                // if (!audit && actions[actionKey].action === 'edit') {
                //     console.log(`editable function: ${actionKey}`);
                //     editActions[actionKey] = actions[actionKey].content;
                // }

                ++updateCount;
            }
        }

        if (!audit) {
            editFile(filePath, editActions);
        }
    }
}

// function editFile(filePath, actions) {
//     for (var a in actions) {
//         console.log(a);
//         console.log(actions[a]);

//         let fileData = fse.readFileSync(filePath, 'utf8');
//         fileData.split(a).join(actions[a]);

//         fse.outputFileSync(filePath, fileData);
//     }
// }

function buildElements() {
    return {
        '.auto-flex-size': { action: 'edit', content: '.sme-position-flex-auto' },
        '.border-all': { action: 'edit', content: '.sme-border-inset-sm .sme-border-color-base-90' },
        '.border-bottom': { action: 'edit', content: '.sme-border-bottom-sm .sme-border-bottom-color-base-90' },
        '.border-horizontal': { action: 'edit', content: '.sme-border-horizontal-sm .sme-border-horizontal-color-base-90' },
        '.border-left': { action: 'edit', content: '.sme-border-left-sm .sme-border-left-color-base-90' },
        '.border-right': { action: 'edit', content: '.sme-border-right-sm .sme-border-right-color-base-90' },
        '.border-top': { action: 'edit', content: '.sme-border-top-sm .sme-border-top-color-base-90' },
        '.border-vertical': { action: 'edit', content: '.sme-border-vertical-sm .sme-border-vertical-color-base-90' },
        '.break-word': { action: 'edit', content: '.sme-arrange-ws-wrap' },
        '.color-dark': { action: 'edit', content: '.sme-color-alt' },
        '.color-light': { action: 'edit', content: '.sme-color-base' },
        '.color-light-gray': { action: 'edit', content: '.sme-color-base-90' },
        '.dashboard': { action: 'edit', content: 'sme-layout-content-zone-padded sme-arrange-stack-h' },
        '.details-panel': { action: 'edit', content: 'sme-property-grid' },
        '.details-panel-container': { action: 'edit', content: 'sme-property-grid' },
        '.details-tab': { action: 'warn', content: 'sme-property-grid and/or sme-pivot' },
        '.details-wrapper': { action: 'edit', content: 'sme-property-grid' },
        '.disabled': { action: 'edit', content: 'sme-disabled' },
        '.fixed-flex-size': { action: 'edit', content: '.sme-position-flex-none' },
        '.flex-layout': { action: 'warn', content: '.sme-arrange-stack-h OR .sme-arrange-stack-v' },
        '.font-bold': { action: 'edit', content: '.sme-font-emphasis1' },
        '.nav-tabs': { action: 'edit', content: 'sme-pivot component' },
        '.acceptable': { action: 'warn', content: 'remove only' },
        '.alert': { action: 'edit', content: 'sme-alert component' },
        '.alert-danger': { action: 'edit', content: 'sme-alert component' },
        '.breadCrumb': { action: 'edit', content: 'sme-alert component' },
        '.checkbox': { action: 'edit', content: 'sme-form-field[type="checkbox"]' },
        '.color-error': { action: 'warn', content: 'remove only' },
        '.color-info': { action: 'warn', content: 'remove only' },
        '.color-success': { action: 'warn', content: 'remove only' },
        '.color-warning': { action: 'warn', content: 'remove only' },
        '.combobox': { action: 'edit', content: 'sme-form-field[type="select"]' },
        '.delete-button': { action: 'warn', content: 'remove only' },
        '.details-content': { action: 'edit', content: 'remove only' },
        '.error-cover': { action: 'warn', content: 'remove only' },
        '.error-message': { action: 'warn', content: 'remove only' },
        '.form-buttons': { action: 'warn', content: 'Please use sme-form-field components instead' },
        '.form-control': { action: 'warn', content: 'Please use sme-form-field components instead' },
        '.form-controls': { action: 'warn', content: 'Please use sme-form-field components instead' },
        '.form-group': { action: 'warn', content: 'Please use sme-form-field components instead' },
        '.form-group-label': { action: 'warn', content: 'Please use sme-form-field components instead' },
        '.form-input': { action: 'warn', content: 'Please use sme-form-field components instead' },
        '.form-stretch': { action: 'warn', content: 'Please use sme-form-field components instead' },
        '.guided-pane-button': { action: 'warn', content: 'remove only' },
        '.header-container': { action: 'warn', content: 'remove only' },
        '.highlight': { action: 'edit', content: '.sme-background-color-yellow' },
        '.horizontal': { action: 'edit', content: '.sme-arrange-stack-h' },
        '.indent': { action: 'edit', content: 'remove only' },
        '.input-file': { action: 'warn', content: 'Please use sme-form-field components instead' },
        '.invalid': { action: 'warn', content: 'remove only' },
        '.item-list': { action: 'warn', content: 'remove only' },
        '.modal-scrollable': { action: 'warn', content: 'remove only' },
        '.multi-section': { action: 'warn', content: 'remove only' },
        '.no-action-bar': { action: 'warn', content: 'remove only' },
        '.no-scroll': { action: 'edit', content: '.sme-position-flex-auto' },
        '.nowrap': { action: 'warn', content: '.sme-arrange-stack-h OR .sme-arrange-stack-v' },
        '.overflow-margins': { action: 'warn', content: 'remove only' },
        '.overflow-tool': { action: 'warn', content: 'remove only' },
        '.progress-cover': { action: 'warn', content: 'remove only' },
        '.radio': { action: 'warn', content: 'sme-form-field[type="radio"]' },
        '.relative': { action: 'edit', content: '.sme-layout-relative' },
        '.relative-center': { action: 'edit', content: '.sme-layout-absolute .sme-position-center' },
        '.required-clue': { action: 'warn', content: 'Please use sme-form-field components instead' },
        '.reverse': { action: 'edit', content: '.sme-arrange-stack-reversed' },
        '.right-panel': { action: 'warn', content: 'remove only' },
        '.rollup': { action: 'warn', content: 'remove only' },
        '.rollup-status': { action: 'warn', content: 'remove only' },
        '.rollup-title': { action: 'warn', content: 'remove only' },
        '.rollup-value': { action: 'warn', content: 'remove only' },
        '.searchbox': { action: 'warn', content: 'sme-form-field[type="search"]' },
        '.searchbox-action-bar': { action: 'warn', content: 'remove only' },
        '.size-h-1': { action: 'warn', content: 'remove only' },
        '.size-h-2': { action: 'warn', content: 'remove only' },
        '.size-h-3': { action: 'warn', content: 'remove only' },
        '.size-h-4': { action: 'warn', content: 'remove only' },
        '.size-h-full': { action: 'warn', content: 'remove only' },
        '.size-h-half': { action: 'warn', content: 'remove only' },
        '.size-v-1': { action: 'warn', content: 'remove only' },
        '.size-v-2': { action: 'warn', content: 'remove only' },
        '.size-v-3': { action: 'warn', content: 'remove only' },
        '.size-v-4': { action: 'warn', content: 'remove only' },
        '.status-icon': { action: 'edit', content: 'remove only' },
        '.stretch-absolute': { action: 'edit', content: '.sme-layout-absolute .sme-position-inset-none' },
        '.stretch-fixed': { action: 'edit', content: '.sme-layout-fixed .sme-position-inset-none' },
        '.stretch-vertical': { action: 'edit', content: '.sme-position-stretch-v' },
        '.stretch-width': { action: 'edit', content: '.sme-position-stretch-h' },
        '.svg-16px': { action: 'warn', content: 'remove only' },
        '.table-indent': { action: 'warn', content: 'remove only' },
        '.table-sm': { action: 'warn', content: 'remove only' },
        '.thin': { action: 'warn', content: 'remove only' },
        '.tile': { action: 'warn', content: 'remove only' },
        '.tile-body': { action: 'warn', content: 'remove only' },
        '.tile-content': { action: 'warn', content: 'remove only' },
        '.tile-footer': { action: 'warn', content: 'remove only' },
        '.tile-header': { action: 'warn', content: 'remove only' },
        '.tile-layout': { action: 'warn', content: 'remove only' },
        '.tile-table': { action: 'warn', content: 'remove only' },
        '.tool-bar': { action: 'warn', content: 'remove only' },
        '.tool-container': { action: 'warn', content: 'sme-layout-content-zone or sme-layout-content-zone-padded' },
        '.tool-header': { action: 'warn', content: 'remove only' },
        '.tool-header-box': { action: 'warn', content: 'remove only' },
        '.tool-pane': { action: 'warn', content: 'remove only' },
        '.toolbar': { action: 'warn', content: 'remove only' },
        '.usage-bar': { action: 'warn', content: 'remove only' },
        '.usage-bar-area': { action: 'warn', content: 'remove only' },
        '.usage-bar-background': { action: 'warn', content: 'remove only' },
        '.usage-bar-title': { action: 'warn', content: 'remove only' },
        '.usage-bar-value': { action: 'warn', content: 'remove only' },
        '.usage-chart': { action: 'warn', content: 'remove only' },
        '.usage-message': { action: 'warn', content: 'remove only' },
        '.usage-message-area': { action: 'warn', content: 'remove only' },
        '.usage-message-title': { action: 'warn', content: 'remove only' },
        '.vertical': { action: 'edit', content: '.sme-arrange-stack-v' },
        '.vertical-scroll-only': { action: 'edit', content: '.sme-arrange-overflow-hide-x sme-arrange-overflow-auto-y' },
        '.warning': { action: 'warn', content: 'remove only' },
        '.white-space': { action: 'warn', content: 'remove only' },
        '.wrap': { action: 'warn', content: '.sme-arrange-wrapstack-h OR .sme-arrange-wrapstack-v' },
        '.btn': { action: 'warn', content: '.sme-button OR button' },
        '.btn-primary': { action: 'warn', content: '.sme-button.sme-button-primary OR button.sme-button-primary' },
        '.toggle-switch': { action: 'warn', content: 'sme-form-field[type="toggle-switch"]' },
        '.icon-win': { action: 'warn', content: 'remove only' }
    };
}