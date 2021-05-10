import { src } from 'gulp';
import gulpClean from 'gulp-clean';

export module CleanModule {
    export function clean(): any {
        return src(
            [
                'dist',
                'inlineDist',
                'inlineSrc',
                'scenariotestresults',
                'unittests',
                'src/assets/strings',
                'src/assets/styles',
                'src/generated'
            ],
            {
                read: false,
                allowEmpty: true
            })
            .pipe(gulpClean({ force: true }));
    }
}
