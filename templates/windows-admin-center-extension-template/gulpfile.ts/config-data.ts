
import { Config } from './common/config';

export function gulpConfig(): Config {
    return {
        resjson: {
            resourceName: 'MsftSmeFileExplorer',
            localeOffset: 1,
            localePath: 'loc/output'
        },
        powershell: {
            name: 'Microsoft.SME.FileExplorer',
            guid: '5d7219a0-26a2-4a82-a273-d6f47227454b',
            list: [
                'src',
                'node_modules/@msft-sme/core'
            ],
            enablePester: true,
            skipCim: true,
            skipResjson: true
        }
    };
}
