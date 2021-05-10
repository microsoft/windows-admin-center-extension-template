import log from 'fancy-log';
import { dest, series, src } from 'gulp';
import gulpClean from 'gulp-clean';
import gulpJasmine from 'gulp-jasmine';
import sourcemaps from 'gulp-sourcemaps';
import ts from 'gulp-typescript';
import reporters from 'jasmine-reporters';
import { LintModule } from './lint';
import { ResjsonModule } from './resjson';
import { Utilities } from './utilities';

export module E2eModule {
    const argv = Utilities.gulpArgv();

    export function clean(): any {
        return src(
            [
                'dist/assets',
                'dist/e2e',
                'node_modules/@msft-sme/e2e/**/*.js',
                'node_modules/@msft-sme/e2e/**/*.js.map',
                'node_modules/@msft-sme/e2e/**/*.d.ts'
            ],
            { read: false, allowEmpty: true })
            .pipe(gulpClean({ force: true }));
    }

    export function buildGenerated(): any {
        return src('src/assets/strings/*.*', { base: 'src' })
            .pipe(dest('dist'));
    }

    export function buildCommon(): any {
        const tsProject = ts.createProject('node_modules/@msft-sme/e2e/tsconfig.json');
        return src(['node_modules/@msft-sme/e2e/**/*.ts', '!node_modules/@msft-sme/e2e/**/*.d.ts'])
            .pipe(sourcemaps.init())
            .pipe(tsProject())
            .pipe(sourcemaps.write('./'))
            .pipe(dest('node_modules/@msft-sme/e2e'));
    }

    export function buildApp() {
        const tsProject = ts.createProject('e2e/tsconfig.json');
        return src(['e2e/**/*.ts', '!e2e/**/*.d.ts'])
            .pipe(sourcemaps.init())
            .pipe(tsProject())
            .pipe(sourcemaps.write('./'))
            .pipe(dest('dist/e2e'));
    }

    export function e2eRun() {
        const options = {
            reporter: [new reporters.JUnitXmlReporter({ savePath: 'scenariotestresults', consolidateAll: true })],
            timeout: 1800000 // 30 minutes.
        };
        return src('dist/e2e/specs/*.js')
            .pipe(gulpJasmine(options))
            .on('jasmineDone', (output) => {
                if (argv.junit) {
                    log(`Full results at ${process.cwd()}\\unittests\\junitresults.xml`);
                }
            });
    }

    export const e2eBuild = series(clean, ResjsonModule.resjson, buildGenerated, buildCommon, buildApp);
    export const e2e = series(LintModule.lintE2e, e2eBuild, e2eRun);
}
