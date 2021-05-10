import testRunnerModule from '@msft-sme/tools/test-runner';
import { Utilities } from './utilities';
export module PesterModule {
    const argv = Utilities.gulpArgv();

    const testRunner = testRunnerModule as any;

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
    export const test = pester;
}
