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
/*
console.log(templatePath);
console.log(__dirname);
console.log(argv.create);
console.log(process.argv);
console.log(argv.version);
*/
if (argv.length === 0) {
	console.error('Usage: wac create --company <company-name> --tool-name <tool-name> [--verbose]');
	process.exit(1);
}

let normalizedCompany = normalizeString(argv.company);
let normalizedTool = normalizeString(argv.tool);

let version = argv.version ? argv.version.toLowerCase() : '';

// console.log('version: ' + version);

create(normalizedCompany, normalizedTool, version);

function create(company, product, version) {
	if (pathExists.sync(product)) {
		console.error('This tool definition already exists.  No changes have been made.')
	} else {
		let productPath = './' + product;
		fse.mkdirSync(product);

		fse.copySync(templatePath, productPath);
		updateFiles(productPath, company, product, version);

		printOutro(product);
	}
}

function updateFiles(path, company, product, version) {
	/* 
	/ files that need updating:
	/	root package.json
	/	src/manifest.json
	/	src/resources/strings/strings.resjson
	/	src/main.ts
	*/
	var cleanDirectory = {};
	let rootPackagePath = './' + product + '/package.json';
	let manifestFilePath = './' + product + '/src/manifest.json';
	let mainFilePath = './' + product + '/src/main.ts';
	let stringsFilePath = './' + product + '/src/resources/strings/strings.resjson';

	let packageName = '@' + company + '/' + product;
	let manfiestName = company.toLowerCase() + '.' + product.toLowerCase();
	let stringsProduct = product.split('-').join(''); // Strings file cannot handle dashes.

	if (isValidVersion(version)) {
		let existingVersion = '"@microsoft/windows-admin-center-sdk": "latest",';
		cleanDirectory[rootPackagePath] = {
			'@{!company-name}/{!product-name}': packageName,
			'"@microsoft/windows-admin-center-sdk": "latest",': existingVersion.replace('latest', version)
		};
	}
	else {
		cleanDirectory[rootPackagePath] = { '@{!company-name}/{!product-name}': packageName };
	}

	cleanDirectory[manifestFilePath] = {
		'{!company-name}.{!module-name}': manfiestName,
		'{!company-name}.{!product-name}': manfiestName,
		'{!product-display-name}': product,
		'{blank}': product.toLowerCase()
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
	return version === 'next' || version === 'insider';
}