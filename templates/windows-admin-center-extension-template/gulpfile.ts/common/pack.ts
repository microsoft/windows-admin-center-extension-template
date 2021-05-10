import packNugetModule from '@msft-sme/tools/pack-nuget';
import { Utilities } from './utilities';

interface PackOptions {
    version: boolean;
    icon: boolean;
    license: boolean;
    company: boolean;
    copyright: boolean;
    iconUrl: boolean;
    targetPath: boolean;
}

export module PackModule {
    const argv = Utilities.gulpArgv();

    const packNuget = packNugetModule as any;

    export function pack(cb) {
        const options = <PackOptions>{};
        if (argv['version']) {
            options.version = argv['version'];
        }

        if (argv['icon']) {
            options.icon = argv['icon'];
        }

        if (argv['license']) {
            options.license = argv['license'];
        }

        if (argv['company']) {
            options.company = argv['company'];
        }

        if (argv['copyright']) {
            options.copyright = argv['copyright'];
        }

        if (argv['iconUrl']) {
            options.iconUrl = argv['iconUrl'];
        }

        if (argv['targetPath']) {
            options.targetPath = argv['targetPath'];
        }

        packNuget(options, cb);
    }
}
