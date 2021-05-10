import testRunnerModule from '@msft-sme/tools/test-runner';
import { parallel } from 'gulp';
import { gulpConfig } from '../config-data';
import { Config } from './config';
import { Utilities } from './utilities';

export module TestModule {
    const argv = Utilities.gulpArgv();
    const config: Config = gulpConfig();

    const testRunner = testRunnerModule as any;

    export function unitTestApp(cb, options: any = {}): void {
        const args = ['test'];
        if (argv['prod']) {
            args.push('--prod');
        } else if (argv['debug']) {
            args.push('--c=debug');
        }

        Utilities.ng(cb, args, options, code => {
            return code
                ? `ng test exited with code ${code}, indicating some tests have failed. Check the above log output for failed tests.`
                : null;
        });
    }

    export function pester(cb) {
        testRunner({
            pester: {
                testPath: './tests/powershell',
                srcPath: './src/resources/scripts/*.ps1',
                outputPath: `./unittests/pesterResults.xml`,
                verbose: argv.verbose
            }
        }, cb);
    }

    export const test = config.powershell.enablePester ? parallel(unitTestApp, pester) : unitTestApp;
}
