import { parallel, series, watch } from 'gulp';
import { CleanModule } from './common/clean';
import { CompileModule } from './common/compile';
import { Config } from './common/config';
import { CopyModule } from './common/copy';
import { E2eModule } from './common/e2e';
import { LintModule } from './common/lint';
import { PackModule } from './common/pack';
import { PowerShellModule } from './common/powershell';
import { ResjsonModule } from './common/resjson';
import { TestModule } from './common/test';
import { ValidateModule } from './common/validate';
import { gulpConfig } from './config-data';

module IndexModule {
    const config: Config = gulpConfig();

    // Export tasks
    export const clean = CleanModule.clean;
    export const lint = LintModule.lint;
    export const lintApp = LintModule.lintApp;
    export const validate = ValidateModule.validate;
    export const resjson = ResjsonModule.resjson;
    export const powershell = config.powershell.skip ? function powershellSkip(cb) { cb(); } : PowerShellModule.powershell;
    export const copy = CopyModule.copyApp;
    export const compile = CompileModule.compile;
    export const bundleApp = CompileModule.bundleApp;
    export const serveApp = CompileModule.serveApp;
    export const ut = TestModule.unitTestApp;
    export const pester = TestModule.pester;
    export const test = TestModule.test;
    export const e2eLint = LintModule.lintE2e;
    export const e2eBuild = E2eModule.e2eBuild;
    export const e2eRun = E2eModule.e2eRun;
    export const e2e = E2eModule.e2e;
    export const pack = PackModule.pack;

    // Build Tasks
    export const generate = parallel(resjson, powershell);
    export const app = series(lintApp, bundleApp, copy);
    export const build = series(clean, generate, validate, lint, compile, copy, test, app, pester);

    // Serve Tasks
    export function watchResource(cb) {
        watch(['src/resources/**/*.resjson', 'src/resources/**/*.ps1'], { ignoreInitial: false }, generate);
        cb();
    }

    export const serve = series(watchResource, serveApp);
}

IndexModule['e2e-build'] = IndexModule.e2eBuild;
IndexModule['e2e-run'] = IndexModule.e2eBuild;

export = IndexModule;
