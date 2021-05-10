
import { Config } from './common/config';

export function gulpConfig(): Config {
    return {
        resjson: {
            resourceName: 'MsftSmeFileExplorer',
            localeOffset: 1,
            localePath: 'loc/output'
        },
        powershell: {
            name: '{!company-name}.{!module-name}',
            guid: '{!guid}',
            list: [
                'src',
                'node_modules/@microsoft/windows-admin-center-sdk'
            ],
            enablePester: true,
            skipCim: true,
            skipManifest: false,
            skipModule: false,
            skipResjson: false
        }
    };
}
