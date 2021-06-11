const fs = require('fs');
const fse = require('fs-extra');
const exec = require('child_process').exec;

const { cliRootPath, readFileData } = require('../common');

module.exports = {
    copyNewFiles,
    updatePackages
}

/**
 * Copies boilerplate template files needed for upgrade
 * @param {boolean} audit Flag indicating if upgrade is running it audit mode
 */
function copyNewFiles(audit, internal) {
    if (audit) {
        return;
    }

    let ignoresPath = cliRootPath + 'templates\\ignores';
    let internalPath = cliRootPath + 'templates\\internal';
    let upgradedTemplatePath = cliRootPath + 'templates\\windows-admin-center-extension-template';

    fse.copyFileSync(ignoresPath + '\\git', '.\\.gitignore');
    fse.copyFileSync(ignoresPath + '\\npm', '.\\.npmignore');
    fse.copyFileSync(internal ? internalPath + '\\tslint.json' : upgradedTemplatePath + '\\tslint.json', '.\\tslint.json');
    fse.copySync(upgradedTemplatePath + '\\gulpfile.ts\\common', '.\\gulpfile.ts\\common');
    fse.copyFileSync(upgradedTemplatePath + '\\gulpfile.ts\\index.ts', '.\\gulpfile.ts\\index.ts');
    fse.copyFileSync(upgradedTemplatePath + '\\tsconfig.base.json', '.\\tsconfig.base.json');
    fse.copyFileSync(upgradedTemplatePath + '\\tsconfig.json', '.\\tsconfig.json');
    fse.copyFileSync(upgradedTemplatePath + '\\angular.json', '.\\angular.json');
    fse.copyFileSync(upgradedTemplatePath + '\\tsconfig.inline.json', '.\\tsconfig.inline.json');
    fse.copyFileSync(upgradedTemplatePath + '\\src\\tsconfig.app.json', '.\\src\\tsconfig.app.json');
    fse.copyFileSync(upgradedTemplatePath + '\\src\\tsconfig.spec.json', '.\\src\\tsconfig.spec.json');
    fse.copyFileSync(upgradedTemplatePath + '\\src\\polyfills.ts', '.\\src\\polyfills.ts');
    fse.copyFileSync(upgradedTemplatePath + '\\src\\karma.conf.js', '.\\src\\karma.conf.js');
    fse.copyFileSync(upgradedTemplatePath + '\\src\\test.ts', '.\\src\\test.ts');

    updateGulpConfigFile('.\\gulpfile.ts\\config-data.ts');

    if(fse.existsSync('.\\tsconfig-inline.json')) {
        fs.unlinkSync('.\\tsconfig-inline.json');
    }

    if(fse.existsSync('.\\package-lock.json')) {
        fs.unlinkSync('.\\package-lock.json');
    }

    console.log('All new config and json files have been transferred.');
}

/**
 * Updates package.json file with new package versions
 * @param {string} rootPath Root path of the target repository
 * @param {boolean} internal Flag indicating if upgrade is running for an internal WAC repository
 * @param {boolean} audit Flag indicating if upgrade is running it audit mode
 * @param {string[]} updateSource Array used to emit logs to file
 * @returns Empty promise indicating function completion
 */
function updatePackages(rootPath, audit, updateSource) {
    if (!audit) {
        console.log('Beginning package update.');
    } else {
        console.log('Beginning package update audit.')
    }

    const packageFile = rootPath + "\\package.json";
    const templatePackageFile = cliRootPath + 'templates\\windows-admin-center-extension-template\\package.json';
    const removeListFile = cliRootPath + 'src\\upgrade\\config\\package-remove-list.json';

    const templatePackages = readFileJSON(templatePackageFile);
    const templatePeerDependencies = templatePackages.peerDependencies;
    const templateDevDependencies = templatePackages.devDependencies;

    // Use equality operator instead of strict equality operator to check for null or undefined
    if (templatePeerDependencies == null || templateDevDependencies == null) {
        throw `An unexpected error occurred, template package file is malformed. Please verify file at path ${templatePackageFile} has both "peerDependencies" and "devDependencies" defined.`
    }

    const removeListObject = readFileJSON(removeListFile);
    const removeList = removeListObject.packages;

    let packages = readFileJSON(packageFile);
    if (packages === null) {
        console.log(`No existing package file exists, creating new package file at path ${packageFile}.`)
        fs.copyFileSync(templatePackageFile, packageFile);
    }

    if (packages.peerDependencies == null) {
        packages.peerDependencies = {};
    }

    if (packages.devDependencies == null) {
        packages.devDependencies = {};
    }

    const peerDependencies = packages.peerDependencies;
    const devDependencies = packages.devDependencies;

    const internal = peerDependencies['@microsoft/windows-admin-center-sdk'] || peerDependencies['@microsoft/windows-admin-center-sdk']
        ? false : true;

    updatePackageObject(templatePeerDependencies, peerDependencies, removeList, internal, updateSource);
    updatePackageObject(templateDevDependencies, devDependencies, removeList, internal, updateSource);

    updateSource.push('\n');

    if (!audit) {
        console.log('Finished updating packages, writing to file.');
        fse.writeJSONSync(packageFile, packages, { spaces: 2 });

        console.log('Running npm install, please wait...');
        return new Promise((resolve) => exec('npm install', (error, stdout, stderr) => {
            if (error !== null) {
                console.log('Error during npm install: ' + error);
            }
            if (stderr !== null) {
                console.log('Error during npm install: ' + stderr);
            }
            console.log(stdout + '\n');

            resolve(internal);
        }));
    } else {
        console.log('Finished audit of package update.')

        return new Promise(resolve => resolve(internal));
    }
}

function updatePackageObject(sourceObject, targetObject, removeList, internal, updateSource) {
    checkPackageRemoveList(removeList, targetObject, updateSource);

    for (const package in sourceObject) {
        if (Object.prototype.hasOwnProperty.call(targetObject, package)) {
            if ((internal && package === '@microsoft/windows-admin-center-sdk')
                || !internal && package.startsWith('@msft-sme')) {
                continue;
            }

            const message = `Package '${package}' will go to version ${sourceObject[package]}`;
            console.log(message);
            updateSource.push(message + '\n');

            targetObject[package] = sourceObject[package];
        }
    }
}

function checkPackageRemoveList(removeList, targetObject, updateSource) {
    for (const package of removeList) {
        if (Object.prototype.hasOwnProperty.call(targetObject, package)) {
            const message = `Package '${package}' will be removed`;
            console.log(message);
            updateSource.push(message + '\n');

            delete targetObject[package];
        }
    }
}

function updateGulpConfigFile(filePath) {
    let fileData = readFileData(filePath);

    fileData = fileData.replace('function gulpConfig():', 'export function gulpConfig():');
    fileData = fileData.replace('\nexports.gulpConfig = gulpConfig;', '');

    fse.writeFileSync(filePath, fileData);
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