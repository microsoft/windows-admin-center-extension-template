//
//
const fse = require('fs-extra');
const { resolve } = require('path');
const { readdir, stat } = require('fs').promises;
const fs = require('fs');
const exec = require('child_process').exec;

let updateCount = 0;
let updateSource = [];

module.exports = {
    update: function (audit, rootPath) {
        updatePackages(rootPath, audit);
        copyNewFiles(audit);
        parseLintErrors(audit, (results) => {
            
            for (const result of results) {
                console.log(`File path: ${result.filePath}`);
                console.log(`Errors:`);
                for (const error of result.errors) {
                    console.log(`\tType: ${error.type}`);
                    console.log(`\tLine: ${error.position.line}`);
                    console.log(`\tChar: ${error.position.char}`);
                    console.log(`\tMessage: ${error.message}`);
                }
            }

            // searchFolder(rootPath)
            // .then(results => {
            //     for (var file in results) {
            //         searchFile(results[file], audit);
            //     }

            //     console.log('');

            //     finalize();
            // });
        });
    }
}

function parseLintErrors(audit, callback) {
    // If audit is true, run without --fix flag
    let cmd = audit ? 'ng lint' : 'ng lint --fix';

    console.log('Linting, please wait...')
    exec(cmd, (error, stdout, stderr) => {
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
        if (error !== null) {
            console.log('Error during ng lint: ' + error);
        }
        stdout = stdout + "\nC:/";
    
        const captureAll = /[\s\S]+?(?=\w+:\/)/g;
        const captureFilePath = /(.+)(?=:\d+:\d+)/g;
        const captureErrorPosition = /(?<=ERROR: )(\d+:\d+)/g; // Format: "lineNumber:characterNumber"
        const captureErrorType = /(?<=ERROR: \d+:\d+\s+)\S+/g;
        const captureErrorMessage = /(?<=ERROR: \d+:\d+\s+\S+\s+)\S.+/g;
    
        const lintOutputByFile = stdout.match(captureAll);
        
        const results = [];
        for (const file of lintOutputByFile) {
            const filePath = file.match(captureFilePath);

            // If no file path found, this match doesn't contain errors
            if (!filePath || filePath.length === 0) {
                continue;
            }
    
            const errorPositionStrings = file.match(captureErrorPosition);
    
            // If there are no linter errors in the current file, skip to the next
            if (!errorPositionStrings || errorPositionStrings.length === 0) {
                continue;
            }
    
            const errorPositions = errorPositionStrings.map((value) => {
                const splitValues = value.split(':');
                return { line: splitValues[0], char: splitValues[1] } // TODO: If reading line by line, char by char, subtract 1 from this to 0 index
            });
    
            const errorTypes = file.match(captureErrorType);
            const errorMessages = file.match(captureErrorMessage);
    
            const errors = []
            for (let i = 0; i < errorPositions.length; i++) {
                errors.push({
                    position: errorPositions[i],
                    type: errorTypes[i],
                    message: errorMessages[i]
                });
            }
    
            results.push({
                filePath: filePath[0],
                errors: errors
            });
        }

        callback(results);
    });
}

function finalize() {
    fse.outputFileSync('UpgradeAudit.txt', updateSource);
    console.log('');
    console.log('|==========================================================|')
    console.log(` There is(are) ${updateCount} update(s) that need to be handled.`);
    console.log(` A log is available at ${process.cwd()}\\UpgradeAudit.txt`);
    console.log('|==========================================================|')
}

function copyNewFiles(audit) {
    if (audit) {
        return;
    }

    let ignoresPath = __dirname.substring(0, __dirname.length - 3) + 'templates\\ignores';
    let upgradedTemplatePath = __dirname.substring(0, __dirname.length - 3) + 'templates\\windows-admin-center-extension-template';

    fse.copyFileSync(ignoresPath + '\\git', '.\\.gitignore');
    fse.copyFileSync(ignoresPath + '\\npm', '.\\.npmignore');
    fse.copyFileSync(upgradedTemplatePath + '\\tslint.json', '.\\tslint.json');
    fse.copySync(upgradedTemplatePath + '\\gulpfile.ts', '.\\gulpfile.ts');
    fse.copyFileSync(upgradedTemplatePath + '\\tsconfig.base.json', '.\\tsconfig.base.json');
    fse.copyFileSync(upgradedTemplatePath + '\\tsconfig.json', '.\\tsconfig.json');
    fse.copyFileSync(upgradedTemplatePath + '\\angular.json', '.\\angular.json');
    fse.copyFileSync(upgradedTemplatePath + '\\tsconfig.inline.json', '.\\tsconfig.inline.json');
    fse.copyFileSync(upgradedTemplatePath + '\\src\\tsconfig.app.json', '.\\src\\tsconfig.app.json');
    fse.copyFileSync(upgradedTemplatePath + '\\src\\tsconfig.spec.json', '.\\src\\tsconfig.spec.json');
    fse.copyFileSync(upgradedTemplatePath + '\\src\\polyfills.ts', '.\\src\\polyfills.ts');
    fse.copyFileSync(upgradedTemplatePath + '\\src\\karma.conf.js', '.\\src\\karma.conf.js');

    if(fse.existsSync('.\\tsconfig-inline.json')) {
        fs.unlinkSync('.\\tsconfig-inline.json');
    }

    if(fse.existsSync('.\\package-lock.json')) {
        fs.unlinkSync('.\\package-lock.json');
    }

    // if(fse.existsSync('.\\node_modules')) {
    //     fse.rmdirSync('.\\node_modules', { });
    // }

    console.log('All new config and json files have been transferred.');
}

function updatePackages(rootPath, audit) {
    if (!audit) {
        console.log('Beginning package update.');
    } else {
        console.log('Beginning package update audit.')
    }

    const packageFile = rootPath + "\\package.json";
    const templatePackageFile = __dirname.substring(0, __dirname.length - 3) + 'templates\\windows-admin-center-extension-template\\package.json';

    const templatePackages = readFileJSON(templatePackageFile);

    if (templatePackages === null) {
        console.log(`An unexpected error occurred, template package file does not exist. Please verify file exists at path ${templatePackageFile}`);
        return;
    }

    const templatePeerDependencies = templatePackages.peerDependencies;
    const templateDevDependencies = templatePackages.devDependencies;

    // Use equality operator instead of strict equality operator to check for null or undefined
    if (templatePeerDependencies == null || templateDevDependencies == null) {
        console.log(`An unexpected error occurred, template package file is malformed. Please verify file at path ${templatePackageFile} has both "peerDependencies" and "devDependencies" defined.`)
    }

    let packages = readFileJSON(packageFile);

    if (packages === null) {
        console.log(`No existing package file exists, creating new package file at path ${packageFile}.`)
        fs.copyFileSync(templatePackageFile, packageFile);
        return;
    }

    if (packages.peerDependencies == null) {
        packages.peerDependencies = {};
    }

    if (packages.devDependencies == null) {
        packages.devDependencies = {};
    }

    let peerDependencies = packages.peerDependencies;
    let devDependencies = packages.devDependencies;

    updatePackageObject(templatePeerDependencies, peerDependencies);
    updatePackageObject(templateDevDependencies, devDependencies);

    updateSource.push('\n');

    if (!audit) {
        console.log('Finished updating packages, writing to file.');
        fse.writeJSONSync(packageFile, packages, { spaces: 2 });
    } else {
        console.log('Finished audit of package update.')
    }
}

function updatePackageObject(sourceObject, targetObject) {
    for (const package in sourceObject) {
        if (Object.prototype.hasOwnProperty.call(sourceObject, package)) {
            const message = `Package '${package}' will go to version ${sourceObject[package]}`;
            console.log(message);
            updateSource.push(message + '\n');

            targetObject[package] = sourceObject[package];
        }
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
        || path.indexOf('inlineDist') >= 0 || path.indexOf('inlineSrc') >= 0
        || path.indexOf('gulps') >= 0 || path.indexOf('UpgradeAudit') >= 0) {
        return false;
    }

    return true;
}

// function replaceOrAddInFile(filePath, regexToReplace, package) {
//     const fileData = readFileData(filePath)
//     const json = readFileJSON(filePath);

//     console.log(json);

//     if (!fileData) {
//         // TODO: Add logging for fail case
//         return;
//     }

//     let result;

//     if (!fileData.match(regexToReplace)) {
//         result = addInString(
//             fileData,
//             new RegExp(`(?<="${package.location}":\\s*){`, 'g'),
//             1,
//             `\n\t\t"${package.name}": "${package.version}",`);
//     } else {
//         result = replaceInString(fileData, regexToReplace, `"${package.version}"`);
//     }

//     fse.writeFileSync(result);
// }

// function replaceInFile(filePath, regexToReplace, newString) {
//     const fileData = readFileData(filePath)

//     if (!fileData) {
//         return;
//     }

//     const result = replaceInString(fileData, regexToReplace, newString);
//     fse.writeFileSync(result);
// }

function executeReplaceOperations(filePath, errors) {
    let fileData = readFileData(filePath);

    if (!fileData) {
        console.log(`Couldn't retrieve file data for path ${filePath}. Please verify this path is valid.`);
        return;
    }

    // error = { position, type, message }
    for (const error of errors) {
        // TODO: Determine regex to use
        // Determine what to replace
        // Replace or log in audit
        // Perform replace on fileData, store result back into fileData. Also make sure to log in audit
    }

    fse.writeFileSync(filePath, fileData);
}

function readFileData(filePath) {
    if (!fs.statSync(filePath).isDirectory()) {
        if (!fse.existsSync(filePath)) {
            return null;
        }

        return fse.readFileSync(filePath, 'utf8');
    }

    return null;
}

function readFileJSON(filePath) {
    if (!fs.statSync(filePath).isDirectory()) {
        if (!fse.existsSync(filePath)) {
            return null;
        }

        return fse.readJSONSync(filePath);
    }

    return null;
}

/**
 * Inserts newString into originalString at location of the indexRegex. Returns null if no regex match is found.
 * @param {string} originalString Original string to modify.
 * @param {RegExp} indexRegex Regex used to determine location of string insertion.
 * @param {number} captureLength Length of indexRegex capture. Used to place newString at end of given regex.
 * @param {string} newString String to insert.
 * @returns Modified string if successful, original string otherwise.
 */
// function addInString(originalString, indexRegex, captureLength, newString) {
//     const position = originalString.search(indexRegex);

//     if (position === -1) {
//         console.log()
//         return originalString;
//     }

//     const firstSlice = fileData.slice(0, position + captureLength);
//     const secondSlice = fileData.slice(position + captureLength);

//     return firstSlice + newString + secondSlice;
// }

function replaceInString(originalString, regexToReplace, newString) {
    return originalString.replace(regexToReplace, newString);
}

function searchFile(filePath) {
    if (!fs.statSync(filePath).isDirectory()) {
        if (!fse.existsSync(filePath)) {
            return;
        }

        let actions = buildElements();
        let fileData = fse.readFileSync(filePath, 'utf8');

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