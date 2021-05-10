import psCimModule from '@msft-sme/tools/gulp-ps-cim';
import psCodeModule from '@msft-sme/tools/gulp-ps-code';
import psManifestModule from '@msft-sme/tools/gulp-ps-manifest';
import psModuleModule from '@msft-sme/tools/gulp-ps-module';
import psResjsonModule from '@msft-sme/tools/gulp-ps-resjson';
import { dest, series, src } from 'gulp';
import { gulpConfig } from '../config-data';
import { Config } from './config';

export module PowerShellModule {
    const config: Config = gulpConfig();

    const psCim = psCimModule as any;
    const psCode = psCodeModule as any;
    const psManifest = psManifestModule as any;
    const psModule = psModuleModule as any;
    const psResjson = psResjsonModule as any;

    function powershellCim() {
        return src('src/powershell-cim-config.json')
            .pipe(psCim())
            .pipe(dest('src/generated/scripts/'));
    }

    function powershellCode() {
        return src(['src/resources/scripts/**/*.ps1', 'src/generated/scripts/**/*.ps1'])
            .pipe(psCode({
                powerShellModuleName: config.powershell.name,
                resourceName: config.powershell.skipResjson ? null : config.resjson.resourceName,
                prefixName: config.powershell.prefixName
            }))
            .pipe(dest('src/generated/'));
    }

    function powershellModule() {
        const powerShellModulePaths = [];
        config.powershell.list.forEach(item => {
            powerShellModulePaths.push(item + '/resources/scripts/**/*.ps1');
            powerShellModulePaths.push(item + '/generated/scripts/**/*.ps1');
        });
        return src(powerShellModulePaths)
            .pipe(psModule(config.powershell))
            .pipe(dest('dist/powershell-module/' + config.powershell.name));
    }

    function powershellResjson() {
        return src(['src/resources/strings/strings.resjson', config.resjson.localePath + '/**/*.resjson'])
            .pipe(psResjson({ resourceName: config.resjson.resourceName }))
            .pipe(dest('dist/powershell-module/' + config.powershell.name));
    }

    function powershellManifest(): any {
        return src(['src/resources/scripts/**/*.ps1'])
            .pipe(psManifest({ powerShellModuleName: config.powershell.name }))
            .pipe(dest('.'));
    }

    const seriesArray = [];
    if (!config.powershell.skipCim) {
        seriesArray.push(powershellCim);
    }

    seriesArray.push(powershellCode);

    if (!config.powershell.skipModule) {
        seriesArray.push(powershellModule);
    }

    if (!config.powershell.skipResjson) {
        seriesArray.push(powershellResjson);
    }

    if (!config.powershell.skipManifest) {
        seriesArray.push(powershellManifest);
    }

    export const powershell = seriesArray.length === 1 ? powershellCode : series(seriesArray);
}
