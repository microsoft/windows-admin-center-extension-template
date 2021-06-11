const fse = require('fs-extra');
const exec = require('child_process').exec;

const { readFileData } = require('../common')

module.exports = {
    resolveLintErrors,
    resolveBuildErrors
}

const ResolveState = {
    Resolved: 'RESOLVED',
    Unresolved: 'UNRESOLVED'
}

/**
 * Executes 'ng lint' and attempts to fix returned errors.
 * @param {boolean} audit Flag indicating if upgrade is running it audit mode
 * @param {string[]} updateSource Array used to emit logs to file
 * @returns {Promise<number>} Count of unresolved errors.
 */
function resolveLintErrors(audit, updateSource) {
    return new Promise((resolve) => {
        parseLintErrors(audit).then((errors) =>
            resolve(fixLintErrors(audit, errors, updateSource))
        );
    });
}

/**
 * Executes 'ng build' and attempts to fix returned errors.
 * @param {boolean} audit Flag indicating if upgrade is running it audit mode
 * @param {string[]} updateSource Array used to emit logs to file
 * @returns {Promise<number>} Count of unresolved errors.
 */
function resolveBuildErrors(audit, updateSource) {
    // const errors = await parseBuildErrors(audit);
    // return fixBuildErrors(audit, errors, updateSource);

    return new Promise((resolve) => {
        parseBuildErrors(audit).then((errors) =>
            resolve(fixBuildErrors(audit, errors, updateSource))
        );
    });
}

function parseLintErrors(audit) {
    // If audit is true, run without --fix flag
    let cmd = audit ? 'ng lint' : 'ng lint --fix';

    console.log('Linting, please wait...')
    return new Promise((resolve) => { 
        exec(cmd, (error, stdout, stderr) => {
            if (error !== null) {
                console.log('Error during ng lint: ' + error);
            }
            if (stderr !== null) {
                console.log('Error during ng lint: ' + stderr);
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
                    return { line: splitValues[0], char: splitValues[1] }
                });
        
                const errorTypes = file.match(captureErrorType);
                const errorMessages = file.match(captureErrorMessage);
        
                const errors = []
                for (let i = 0; i < errorPositions.length; i++) {
                    errors.push({
                        position: errorPositions[i],
                        type: errorTypes[i],
                        message: errorMessages[i],
                        resolved: ResolveState.Unresolved
                    });
                }
        
                results.push({
                    filePath: filePath[0],
                    errors: errors
                });
            }

            resolve(results);
        });
    });
}

function parseBuildErrors(audit) {
    if (audit) {
        return new Promise(resolve => resolve());
    }

    console.log('Building, please wait...')
    return new Promise((resolve) => exec('ng build', (error, stdout, stderr) => {
        if (error !== null) {
            console.log('Error during ng build: ' + error);
        }

        console.log('stdout: ' + stdout);

        const captureAll = /[\s\S]+?(?=(Error|Warning):)/g;
        const captureFilePath = /(?<=Error: )(.+)(?=:\d+:\d+)/g;
        const captureErrorPosition = /(?<=Error: .+)(\d+:\d+)(?= - error)/g;
        const captureErrorCode = /(?<=Error:.+- error )(TS\d+)/g;
        const captureErrorMessage = /(?<=TS\d+: ).+/g;

        stderr = stderr + '\n\n\nWarning:'
        const buildOutputByCode = stderr.match(captureAll);

        if (!buildOutputByCode) {
            return resolve([]);
        }

        const results = [];
        for (const file of buildOutputByCode) {
            const filePath = file.match(captureFilePath);

            // If no file path found, this match doesn't contain errors
            if (!filePath || filePath.length === 0) {
                continue;
            }

            const errorPositionString = file.match(captureErrorPosition);
        
            // If there isn't a position found this isn't a parsable error, skip to next file
            if (!errorPositionString || errorPositionString.length === 0) {
                continue;
            }
    
            const splitValues = errorPositionString[0].split(':');
            const errorPosition = { line: splitValues[0], char: splitValues[1] };

            const errorCode = file.match(captureErrorCode);

            // Couldn't get error code, skip to next file
            if (!errorCode || errorCode.length === 0) {
                continue;
            }

            const errorMessage = file.match(captureErrorMessage);

            results.push({
                filePath: filePath[0],
                type: errorCode[0],
                message: errorMessage[0],
                position: errorPosition,
                resolved: ResolveState.Unresolved
            });
        }

        resolve(results);
    }));
}

function fixLintErrors(audit, files, updateSource) {
    const solutionLookup = initSolutionFunctionLookup();

    let unresolvedCount = 0;
    files.forEach((file) => unresolvedCount += file.errors.length);

    for (const file of files) {
        let message = `File path: ${file.filePath}`;
        console.log(message);
        updateSource.push(message + '\n');

        let fileData = readFileData(file.filePath);

        if (!fileData) {
            message = `Couldn't retrieve file data for path ${file.filePath}. Please verify this path is valid.`;
            console.log(message);
            updateSource.push(message + '\n');
            continue;
        }

        message = `Errors:`
        console.log(message);
        updateSource.push(message + '\n');
        for (const error of file.errors) {
            fileData = fixError(audit, fileData, error, solutionLookup, updateSource);

            if (error.resolved === ResolveState.Resolved) {
                unresolvedCount--;
            }
        }

        fse.writeFileSync(file.filePath, fileData);

        console.log('');
        updateSource.push('\n');
    }

    return unresolvedCount;
}

function fixBuildErrors(audit, errors, updateSource) {
    const solutionLookup = initSolutionFunctionLookup();

    let unresolvedCount = errors.length;
    for (const error of errors) {
        let message = `File path: ${error.filePath}`;
        console.log(message);
        updateSource.push(message + '\n');

        let fileData = readFileData(error.filePath);

        if (!fileData) {
            message = `Couldn't retrieve file data for path ${error.filePath}. Please verify this path is valid.`;
            console.log(message);
            updateSource.push(message + '\n');
            continue;
        }

        fileData = fixError(audit, fileData, error, solutionLookup, updateSource);

        if (error.resolved === ResolveState.Resolved) {
            unresolvedCount--;
        }

        fse.writeFileSync(error.filePath, fileData);

        console.log('');
        updateSource.push('\n');
    }

    return unresolvedCount;
}

function fixError(audit, fileData, error, solutionLookup, updateSource) {
    let message = `\tType: ${error.type}`;
    console.log(message);
    updateSource.push(message + '\n');
    
    message = `\tLine: ${error.position.line}`;
    console.log(message);
    updateSource.push(message + '\n');

    message = `\tChar: ${error.position.char}`;
    console.log(message);
    updateSource.push(message + '\n');

    message = `\tMessage: ${error.message}`;
    console.log(message);
    updateSource.push(message + '\n');

    if (audit) {
        return fileData;
    }

    const solutionFunction = solutionLookup[error.type];

    let result = solutionFunction != null ? solutionFunction(fileData, error) : fileData;
    
    message = `\tResolved: ${error.resolved}\n`;
    console.log(message);
    updateSource.push(message + '\n');
    return result;
}

function initSolutionFunctionLookup() {
    return {
        'only-arrow-functions': (fileData, error) => {
            const parameterRegex = /(?<=function\s*\()[^)]*/;
            const targetRegex = /function\s*\([^)]*\)/;

            const parameters = fileData.match(parameterRegex);
            const result = replaceInString(fileData, targetRegex, `(${parameters[0]}) =>`);

            error.resolved = ResolveState.Resolved;
            return result;
        }
    }
}

function replaceInString(originalString, regexToReplace, newString) {
    return originalString.replace(regexToReplace, newString);
}