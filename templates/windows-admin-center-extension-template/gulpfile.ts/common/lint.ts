import { series, src } from 'gulp';
import tslint from 'gulp-tslint';

export module LintModule {
    export function lintApp() {
        return src(['src/**/*.ts', '!src/generated/**/*.*'])
            .pipe(tslint())
            .pipe(tslint.report({ 'emitError': true, 'reportLimit': 0, 'summarizeFailureOutput': true }));
    }

    export function lintE2e() {
        return src(['e2e/**/*.ts'])
            .pipe(tslint())
            .pipe(tslint.report({ 'emitError': true, 'reportLimit': 0, 'summarizeFailureOutput': true }));
    }

    export const lint = series(lintApp, lintE2e);
}
