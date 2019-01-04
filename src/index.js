#!/usr/bin/env node

var fse = require('fs-extra');
var minimist = require('minimist');
var path = require('path');
var pathExists = require('path-exists');

const argv = minimist(process.argv.slice(2));
const packageNameSearch = '{!package-name}';
const manfiestNameSearch = '{!manifest-name}';
const manfiestTargetSearch = '{!manifest-target}';
const manifestUrlSearch = '{!manifest-url}'

/**
*	Arguments:
*	--company - name of the company or person making the extension.
*	--tool - name of the tool / extension that is being built.
**/
const cwd = process.cwd();
const templatePath = __dirname.substring(0, __dirname.length - 3) + 'templates\\windows-admin-center-extension-template';
const upgradedTemplatePath = __dirname.substring(0, __dirname.length - 3) + 'templates\\upgrade\\windows-admin-center-extension-template';
const manifestTemplatePath = __dirname.substring(0, __dirname.length - 3) + 'templates\\manifest';
let normalizedCompany = normalizeString(argv.company);
let normalizedTool = normalizeString(argv.tool);

let version = argv.version ? argv.version.toLowerCase() : '';
let extensionType = argv.solution ? 'solution' : 'tool';
let normalizedSolution = argv.solution ? normalizeString(argv.solution) : '';

if (argv.length === 0 || !isValidVersion(version) || !normalizedCompany || !normalizedTool) {
	console.error('Usage: wac create --company <company-name> --name <tool-name> --version <version-tag> [--verbose]');
	console.log('or');
	console.log('wac create --company <company-name> --solution <solution-name> --tool <tool-name> --type <tool-type> --version <version-tag> [--verbose]');
	console.log('Valid version tags: \'latest\', \'insider\', \'next\'');
	console.log('More information can be found here:');
	process.exit(1);
}

if (normalizedSolution === '') {
	create(extensionType, normalizedCompany, normalizedTool, '', version);
} else {
	create(extensionType, normalizedCompany, normalizedSolution, normalizedTool, version);
}

function create(type, company, primary, secondary, version) {
	if (pathExists.sync(primary)) {
		console.error('This tool definition already exists.  No changes have been made.')
	} else {
		let productPath = './' + primary;
		console.log(productPath);
		fse.mkdirSync(primary);

		if(version  !== 'experimental') {
			fse.copySync(templatePath, productPath);
		} else {
			fse.copySync(upgradedTemplatePath, productPath);
		}

		if (type === 'tool') {
			// make tool manifest
			fse.copyFileSync(manifestTemplatePath + '\\tool-manifest.json', productPath + '\\src\\manifest.json');
		} else if (type === 'solution') {
			// make solution manifest
			fse.copyFileSync(manifestTemplatePath + '\\solution-manifest.json', productPath + '\\src\\manifest.json');
		}

		if (version === 'next') {
			// copy new package.json for the angular 7 upgrade.
			let upgradePackage = __dirname.substring(0, __dirname.length - 3) + 'templates\\upgrade\\package.json';
			fse.copyFileSync(upgradePackage, productPath + '\\package.json');
		}

		// if (version === 'experimental') {
		// 	let upgradeGulp = __dirname.substring(0, __dirname.length - 3) + 'templates\\upgrade\\gulpfile.js';
		// 	fse.copyFileSync(upgradeGulp, productPath + '\\gulpfile.js');

		// 	let upgradeTsconfig = __dirname.substring(0, __dirname.length - 3) + 'templates\\upgrade\\tsconfig.inline.json';
		// 	fse.copyFileSync(upgradeTsconfig, productPath + '\\tsconfig.inline.json');

		// 	// the old tsconfig file needs to be removed.  It uses a dash in the file name instead of a dot.
		// 	fse.removeSync(productPath + '\\tsconfig-inline.json');

		// 	fse.removeSync(productPath + '\\gulps');
		// }

		updateFiles(productPath, company, primary, secondary, version);
		printOutro(primary);
	}
}

function updateFiles(path, company, primary, secondary, version) {
	/* 
	/ files that need updating:
	/	root package.json
	/	src/manifest.json
	/	src/resources/strings/strings.resjson
	/	src/main.ts
	/	in Experimental: gulpfile.js
	*/
	var cleanDirectory = {};
	let rootPackagePath = './' + primary + '/package.json';
	let manifestFilePath = './' + primary + '/src/manifest.json';
	let mainFilePath = './' + primary + '/src/main.ts';
	let stringsFilePath = './' + primary + '/src/resources/strings/strings.resjson';
	let gulpFilePath = './' + primary + '/gulpfile.js';

	let packageName = '@' + company + '/' + primary;
	let manfiestName = company.toLowerCase() + '.' + primary.toLowerCase();
	let stringsProduct = primary.split('-').join(''); // Strings file cannot handle dashes.
	let companyPackageIdentifier = company.split('-').join('') + primary.split('-').join('');

	if (version === 'next' || version === 'insider' || version === 'experimental') {
		let existingVersion = '"@microsoft/windows-admin-center-sdk": "latest",';
		cleanDirectory[rootPackagePath] = {
			'@{!company-name}/{!product-name}': packageName,
			'"@microsoft/windows-admin-center-sdk": "latest",': existingVersion.replace('latest', version)
		};
	}
	else {
		cleanDirectory[rootPackagePath] = { '@{!company-name}/{!product-name}': packageName };
	}

	if (version === 'experimental') {
		cleanDirectory[gulpFilePath] = {
			'{!company-name}.{!module-name}': manfiestName,
			'{!guid}': uuidv4(),
			'{!company-package-id}' : companyPackageIdentifier
		};
	}

	cleanDirectory[manifestFilePath] = {
		'{!company-name}.{!module-name}': manfiestName,
		'{!company-name}.{!product-name}': manfiestName,
		'{!primary-display-name}': primary,
		'{!primary-url-name}': primary.toLowerCase(),
		'{!secondary-display-name}': secondary,
		'{!secondary-url-name}': secondary.toLowerCase()
	};

	cleanDirectory[stringsFilePath] = {
		'{!product-display-name}': stringsProduct,
		'{!product-title}': stringsProduct,
		'{!ProductName}': stringsProduct
	};

	cleanDirectory[mainFilePath] = { '{!company-name}.{!product-name}': manfiestName };

	for (var key in cleanDirectory) {
		cleanFile(key, cleanDirectory[key]);
	}
}

function cleanFile(key, values) {
	console.log('Updating: ' + key);
	for (var valuesKey in values) {
		// console.log('Looking for:' + valuesKey + ' - ' + values[valuesKey]);
		let fileData = fse.readFileSync(key, 'utf8');
		let displayNameIndex = fileData.indexOf(valuesKey);
		while (displayNameIndex > 0) {
			fileData = fileData.replace(valuesKey, values[valuesKey]);
			displayNameIndex = fileData.indexOf(valuesKey);
		}

		fse.outputFileSync(key, fileData);
	}
}

function printOutro(product) {
	console.log('');
	console.log('Thank you for using the Windows Admin Center CLI.');
	console.log('');
	console.log('Next steps:');
	console.log('cd into your new directory (cd ' + product + ') and then run \'npm install\' -> \'gulp build\' to build your new extension');
	console.log('After that, \'gulp serve -p 4200\' to serve your new extension on port 4200');
	console.log('Additional information can be found here: https://aka.ms/wacsdkdocs');
}

function normalizeString(input) {
	return input.split(' ').join('-');
}

function isValidVersion(version) {
	return version === 'next' || version === 'insider' || version === 'release' || version === '' || version === 'experimental';
}

// this came from here: https://gist.github.com/jed/982883
function uuidv4(a) { return a ? (a ^ Math.random() * 16 >> a / 4).toString(16) : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, uuidv4) }