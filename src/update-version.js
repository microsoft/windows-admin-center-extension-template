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
        searchFolder(rootPath)
            .then(results => {
                for (var file in results) {
                    searchFile(results[file], audit);
                }

                if (!audit) {
                    copyNewFiles();
                }

                writePackageJsonUpdate();

                console.log('');
                var lintMessage = 'It is advisable to run \'ng lint --fix\' to automate the fixing of some new linting rules.';
                console.log(lintMessage);
                updateSource.push('\n');
                updateSource.push(lintMessage + '\n');
                console.log('');

                finalize();
            });
    }
}

function finalize() {
    fse.outputFileSync('UpgradeAudit.txt', updateSource);
    console.log('');
    console.log('|==========================================================|')
    console.log(` There is(are) ${updateCount} update(s) that need to be handled.`);
    console.log(` A log is available at ${process.cwd()}\\UpgradeAudit.txt`);
    console.log('|==========================================================|')
}

function copyNewFiles() {
    let ignoresPath = __dirname.substring(0, __dirname.length - 3) + 'templates\\ignores';
    let upgradedTemplatePath = __dirname.substring(0, __dirname.length - 3) + 'templates\\upgrade\\windows-admin-center-extension-template';

    fse.copyFileSync(ignoresPath + '\\git', '.\\.gitignore');
    fse.copyFileSync(ignoresPath + '\\npm', '.\\.npmignore');
    fse.copyFileSync(upgradedTemplatePath + '\\tslint.json', '.\\tslint.json');
    fse.copyFileSync(upgradedTemplatePath + '\\gulpfile.js', '.\\gulpfile.js');
    fse.copyFileSync(upgradedTemplatePath + '\\tsconfig.json', '.\\tsconfig.json');
    fse.copyFileSync(upgradedTemplatePath + '\\angular.json', '.\\angular.json');
    fse.copyFileSync(upgradedTemplatePath + '\\tsconfig.inline.json', '.\\tsconfig.inline.json');
    fse.copyFileSync(upgradedTemplatePath + '\\src\\tsconfig.app.json', '.\\src\\tsconfig.app.json');
    fse.copyFileSync(upgradedTemplatePath + '\\src\\tsconfig.spec.json', '.\\src\\tsconfig.spec.json');

    if(fse.existsSync('.\\tsconfig-inline.json')) {
        fs.unlinkSync('.\\tsconfig-inline.json');
    }

    if(fse.existsSync('.\\package-lock.json')) {
        fs.unlinkSync('.\\package-lock.json');
    }

    console.log('All new config and json files have been transferred.');
}

function writePackageJsonUpdate() {
    // todo: read this from the package.json
    let updates = [
    '"@microsoft/windows-admin-center-sdk": "experimental"',
    '"@angular/animations": "7.1.1"',
    '"@angular/common": "7.1.1"',
    '"@angular/compiler": "7.1.1"',
    '"@angular/core": "7.1.1"',
    '"@angular/forms": "7.1.1"',
    '"@angular/language-service": "7.1.1"',
    '"@angular/platform-browser": "7.1.1"',
    '"@angular/platform-browser-dynamic": "7.1.1"',
    '"@angular/router": "7.1.1"',
    '"core-js": "2.6.0"',
    '"rxjs": "6.3.3"',
    '"zone.js": "0.8.26"',
    '"@angular-devkit/build-angular": "^0.12.1"',
    '"@angular-devkit/build-ng-packagr": "0.11.2"',
    '"@angular/animations": "7.1.1"',
    '"@angular/cli": "7.1.2"',
    '"@angular/common": "7.1.1"',
    '"@angular/compiler": "7.1.1"',
    '"@angular/compiler-cli": "7.1.1"',
    '"@angular/core": "7.1.1"',
    '"@angular/forms": "7.1.1"',
    '"@angular/language-service": "7.1.1"',
    '"@angular/platform-browser": "7.1.1"',
    '"@angular/platform-browser-dynamic": "7.1.1"',
    '"@angular/router": "7.1.1"',
    '"@types/chart.js": "2.7.40"',
    '"@types/jasmine": "~2.8.8"',
    '"@types/jasminewd2": "~2.0.3"',
    '"@types/node": "8.9.5"',
    '"ajv": "6.4.0"',
    '"codelyzer": "4.5.0"',
    '"core-js": "2.6.0"',
    '"gulp": "^3.9.1"',
    '"gulp-inline-ng2-template": "5.0.1"',
    '"jasmine-core": "~2.99.1"',
    '"jasmine-spec-reporter": "~4.2.1"',
    '"karma": "^3.1.4"',
    '"karma-jasmine": "~1.1.2"',
    '"karma-remap-istanbul": "^0.6.0"',
    '"ng-packagr": "4.4.0"',
    '"readline-sync": "1.4.9"',
    '"rxjs": "6.3.3"',
    '"rxjs-tslint": "^0.1.5"',
    '"rxjs-tslint-rules": "4.10.0"',
    '"signalr": "2.3.0"',
    '"ts-node": "1.2.1"',
    '"tsickle": "0.33.1"',
    '"tslint": "5.11.0"',
    '"tslint-consistent-codestyle": "1.14.0"',
    '"tslint-eslint-rules": "5.4.0"',
    '"tslint-microsoft-contrib": "5.2.1"',
    '"typescript": "3.1.6"',
    '"zone.js": "0.8.26"'
    ];

    console.log('');
    console.log('The following updates need to be made in your package.json file:');
    updateSource.push('\n')
    updateSource.push('The following updates need to be made in your package.json file:');

    for(var i in updates) {
        console.log(updates[i]);
        updateSource.push(updates[i]  + '\n');
    }
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
    if (path.indexOf('node_modules') >= 0 || path.indexOf('bundle') >= 0 || path.indexOf('dist') >= 0
        || path.indexOf('inlineDist') >= 0 || path.indexOf('inlineSrc') >= 0 || path.indexOf('e2e') >= 0
        || path.indexOf('gulps') >= 0 || path.indexOf('UpgradeAudit') >= 0) {
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
                let message = `Found: ${actionKey} in file: ${filePath}.  Required action: ${actions[actionKey].content}.`;
                console.log(message);
                updateSource.push(message + '\n');

                // if (!audit && actions[actionKey].action === 'edit') {
                //     console.log(`editable function: ${actionKey}`);
                //     editActions[actionKey] = actions[actionKey].content;
                // }

                ++updateCount;
            }
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
        '.acceptable': { action: 'warn', content: 'deprecated - remove' },
        '.alert': { action: 'edit', content: 'sme-alert component' },
        '.alert-danger': { action: 'edit', content: 'sme-alert component' },
        '.breadCrumb': { action: 'edit', content: 'sme-alert component' },
        '.checkbox': { action: 'edit', content: 'sme-form-field[type="checkbox"]' },
        '.color-error': { action: 'warn', content: 'deprecated - remove' },
        '.color-info': { action: 'warn', content: 'deprecated - remove' },
        '.color-success': { action: 'warn', content: 'deprecated - remove' },
        '.color-warning': { action: 'warn', content: 'deprecated - remove' },
        '.combobox': { action: 'edit', content: 'sme-form-field[type="select"]' },
        '.delete-button': { action: 'warn', content: 'deprecated - remove' },
        '.details-content': { action: 'edit', content: 'deprecated - remove' },
        '.error-cover': { action: 'warn', content: 'deprecated - remove' },
        '.error-message': { action: 'warn', content: 'deprecated - remove' },
        '.form-buttons': { action: 'warn', content: 'Please use sme-form-field components instead' },
        '.form-control': { action: 'warn', content: 'Please use sme-form-field components instead' },
        '.form-controls': { action: 'warn', content: 'Please use sme-form-field components instead' },
        '.form-group': { action: 'warn', content: 'Please use sme-form-field components instead' },
        '.form-group-label': { action: 'warn', content: 'Please use sme-form-field components instead' },
        '.form-input': { action: 'warn', content: 'Please use sme-form-field components instead' },
        '.form-stretch': { action: 'warn', content: 'Please use sme-form-field components instead' },
        '.guided-pane-button': { action: 'warn', content: 'deprecated - remove' },
        '.header-container': { action: 'warn', content: 'deprecated - remove' },
        '.highlight': { action: 'edit', content: '.sme-background-color-yellow' },
        '.horizontal': { action: 'edit', content: '.sme-arrange-stack-h' },
        '.indent': { action: 'warn', content: 'deprecated - remove' },
        '.input-file': { action: 'warn', content: 'Please use sme-form-field components instead' },
        '.invalid': { action: 'warn', content: 'deprecated - remove' },
        '.item-list': { action: 'warn', content: 'deprecated - remove' },
        '.modal-scrollable': { action: 'warn', content: 'deprecated - remove' },
        '.multi-section': { action: 'warn', content: 'deprecated - remove' },
        '.no-action-bar': { action: 'warn', content: 'deprecated - remove' },
        '.no-scroll': { action: 'edit', content: '.sme-position-flex-auto' },
        '.nowrap': { action: 'warn', content: '.sme-arrange-stack-h OR .sme-arrange-stack-v' },
        '.overflow-margins': { action: 'warn', content: 'deprecated - remove' },
        '.overflow-tool': { action: 'warn', content: 'deprecated - remove' },
        '.progress-cover': { action: 'warn', content: 'deprecated - remove' },
        '.radio': { action: 'warn', content: 'sme-form-field[type="radio"]' },
        '.relative': { action: 'edit', content: '.sme-layout-relative' },
        '.relative-center': { action: 'edit', content: '.sme-layout-absolute .sme-position-center' },
        '.required-clue': { action: 'warn', content: 'Please use sme-form-field components instead' },
        '.reverse': { action: 'edit', content: '.sme-arrange-stack-reversed' },
        '.right-panel': { action: 'warn', content: 'deprecated - remove' },
        '.rollup': { action: 'warn', content: 'deprecated - remove' },
        '.rollup-status': { action: 'warn', content: 'deprecated - remove' },
        '.rollup-title': { action: 'warn', content: 'deprecated - remove' },
        '.rollup-value': { action: 'warn', content: 'deprecated - remove' },
        '.searchbox': { action: 'warn', content: 'sme-form-field[type="search"]' },
        '.searchbox-action-bar': { action: 'warn', content: 'deprecated - remove' },
        '.size-h-1': { action: 'warn', content: 'deprecated - remove' },
        '.size-h-2': { action: 'warn', content: 'deprecated - remove' },
        '.size-h-3': { action: 'warn', content: 'deprecated - remove' },
        '.size-h-4': { action: 'warn', content: 'deprecated - remove' },
        '.size-h-full': { action: 'warn', content: 'deprecated - remove' },
        '.size-h-half': { action: 'warn', content: 'deprecated - remove' },
        '.size-v-1': { action: 'warn', content: 'deprecated - remove' },
        '.size-v-2': { action: 'warn', content: 'deprecated - remove' },
        '.size-v-3': { action: 'warn', content: 'deprecated - remove' },
        '.size-v-4': { action: 'warn', content: 'deprecated - remove' },
        '.status-icon': { action: 'edit', content: 'deprecated - remove' },
        '.stretch-absolute': { action: 'edit', content: '.sme-layout-absolute .sme-position-inset-none' },
        '.stretch-fixed': { action: 'edit', content: '.sme-layout-fixed .sme-position-inset-none' },
        '.stretch-vertical': { action: 'edit', content: '.sme-position-stretch-v' },
        '.stretch-width': { action: 'edit', content: '.sme-position-stretch-h' },
        '.svg-16px': { action: 'warn', content: 'deprecated - remove' },
        '.table-indent': { action: 'warn', content: 'deprecated - remove' },
        '.table-sm': { action: 'warn', content: 'deprecated - remove' },
        '.thin': { action: 'warn', content: 'deprecated - remove' },
        '.tile': { action: 'warn', content: 'deprecated - remove' },
        '.tile-body': { action: 'warn', content: 'deprecated - remove' },
        '.tile-content': { action: 'warn', content: 'deprecated - remove' },
        '.tile-footer': { action: 'warn', content: 'deprecated - remove' },
        '.tile-header': { action: 'warn', content: 'deprecated - remove' },
        '.tile-layout': { action: 'warn', content: 'deprecated - remove' },
        '.tile-table': { action: 'warn', content: 'deprecated - remove' },
        '.tool-bar': { action: 'warn', content: 'deprecated - remove' },
        '.tool-container': { action: 'warn', content: 'sme-layout-content-zone or sme-layout-content-zone-padded' },
        '.tool-header': { action: 'warn', content: 'deprecated - remove' },
        '.tool-header-box': { action: 'warn', content: 'deprecated - remove' },
        '.tool-pane': { action: 'warn', content: 'deprecated - remove' },
        '.toolbar': { action: 'warn', content: 'deprecated - remove' },
        '.usage-bar': { action: 'warn', content: 'deprecated - remove' },
        '.usage-bar-area': { action: 'warn', content: 'deprecated - remove' },
        '.usage-bar-background': { action: 'warn', content: 'deprecated - remove' },
        '.usage-bar-title': { action: 'warn', content: 'deprecated - remove' },
        '.usage-bar-value': { action: 'warn', content: 'deprecated - remove' },
        '.usage-chart': { action: 'warn', content: 'deprecated - remove' },
        '.usage-message': { action: 'warn', content: 'deprecated - remove' },
        '.usage-message-area': { action: 'warn', content: 'deprecated - remove' },
        '.usage-message-title': { action: 'warn', content: 'deprecated - remove' },
        '.vertical': { action: 'edit', content: '.sme-arrange-stack-v' },
        '.vertical-scroll-only': { action: 'edit', content: '.sme-arrange-overflow-hide-x sme-arrange-overflow-auto-y' },
        '.warning': { action: 'warn', content: 'deprecated - remove' },
        '.white-space': { action: 'warn', content: 'deprecated - remove' },
        '.wrap': { action: 'warn', content: '.sme-arrange-wrapstack-h OR .sme-arrange-wrapstack-v' },
        '.btn': { action: 'warn', content: '.sme-button OR button' },
        '.btn-primary': { action: 'warn', content: '.sme-button.sme-button-primary OR button.sme-button-primary' },
        '.toggle-switch': { action: 'warn', content: 'sme-form-field[type="toggle-switch"]' },
        '.icon-win': { action: 'warn', content: 'deprecated - remove' }
    };
}