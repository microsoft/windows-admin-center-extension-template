import { dest, src } from 'gulp';

export module CopyModule {
    export function copyApp(): any {
        return src(
            [
                'src/**/*.json',
                '!src/**/package.json',
                'src/**/*.d.ts',
                'src/**/*.ps1',
                'src/assets/**/*.*'
            ],
            { base: 'src' })
            .pipe(dest('dist'));
    }
}
