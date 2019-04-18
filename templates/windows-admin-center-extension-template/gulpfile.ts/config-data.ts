
import { Config } from './common/config';

function gulpConfig(): Config {
    return {
        resjson: {
            resourceName: '{!CompanyName}{!ProductName}',
            localeOffset: 0,
            localePath: 'loc'
        },
        powershell: {
            name: '{!company-name}.{!module-name}',
            guid: '{!guid}',
            list: [
                'src',
                'node_modules/@microsoft/windows-admin-center-sdk'
            ],
            enablePester: false,
            skipCim: true
        }
    };
}

exports.gulpConfig = gulpConfig;
