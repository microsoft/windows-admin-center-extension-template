import { main } from '@angular/compiler-cli/src/main';
import { NodeJSFileSystem, setFileSystem } from '@angular/compiler-cli/src/ngtsc/file_system';
import { dest, src } from 'gulp';
import inlineNg2TemplateModule from 'gulp-inline-ng2-template';
import { Utilities } from './utilities';

export module CompileModule {
    const argv = Utilities.gulpArgv();

    const inlineNg2Template = inlineNg2TemplateModule as any;

    function getBundleArguments(appName: string): string[] {
        const args = ['build', appName, '--aot', '--progress=false', '--extract-licenses=false'];
        if (argv['verbose']) { args.push('--verbose'); }
        if (argv['prod']) { args.push('--prod'); }
        if (argv['watch']) { args.push('--watch'); }
        return args;
    }

    function getServeArguments(): string[] {
        const args = ['serve'].concat(process.argv.slice(3));
        return args;
    }

    export function inlineSource(): any {
        setFileSystem(new NodeJSFileSystem());
        return src('./src/**/*.ts')
            .pipe(inlineNg2Template({ useRelativePaths: true }))
            .pipe(dest('inlineSrc'));
    }

    export function inlineCompile(cb): any {
        const errors = [];
        main(['-p', 'tsconfig.inline.json'], (consoleError) => { errors.push(consoleError); });
        errors.length > 0 ? cb(errors.join('\n')) : cb();
    }

    export function bundleApp(cb): void {
        const args = getBundleArguments('module-app');
        Utilities.ng(cb, args);
    }

    export function serveApp(cb): void {
        const args = getServeArguments();
        Utilities.ng(cb, args);
    }
}
