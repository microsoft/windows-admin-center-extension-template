import './polyfills.ts';
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { ShellAssetManager } from './app/shell-asset-manager';
import { CoreEnvironment, EnvironmentModule } from './core';
import { environment } from './environments/environment';
import { PowerShellScripts } from './generated/powershell-scripts';
if (environment.production) {
    enableProdMode();
}
// initialize SME module environment with localization settings.
CoreEnvironment.initialize({
    name: EnvironmentModule.nameOfShell,
    powerShellModuleName: PowerShellScripts.module,
    isProduction: environment.production
}, {})
    .then(function () {
    // initialize assets   
    ShellAssetManager.initialize(environment.production);
    // bootstrap angular
    platformBrowserDynamic().bootstrapModule(AppModule);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxnQkFBZ0IsQ0FBQztBQUV4QixPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQy9DLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLG1DQUFtQyxDQUFDO0FBQzNFLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUM3QyxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUM5RCxPQUFPLEVBQUUsZUFBZSxFQUFFLGlCQUFpQixFQUFFLE1BQU0sUUFBUSxDQUFDO0FBQzVELE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUN6RCxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQUVuRSxFQUFFLENBQUMsQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztJQUN6QixjQUFjLEVBQUUsQ0FBQztBQUNyQixDQUFDO0FBRUQsZ0VBQWdFO0FBQ2hFLGVBQWUsQ0FBQyxVQUFVLENBQ3RCO0lBQ0ksSUFBSSxFQUFFLGlCQUFpQixDQUFDLFdBQVc7SUFDbkMsb0JBQW9CLEVBQUUsaUJBQWlCLENBQUMsTUFBTTtJQUM5QyxZQUFZLEVBQUUsV0FBVyxDQUFDLFVBQVU7Q0FDdkMsRUFDRCxFQUFFLENBQUM7S0FDRixJQUFJLENBQUM7SUFDRix1QkFBdUI7SUFDdkIsaUJBQWlCLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUVyRCxvQkFBb0I7SUFDcEIsc0JBQXNCLEVBQUUsQ0FBQyxlQUFlLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDeEQsQ0FBQyxDQUFDLENBQUMiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiJDOi9CQS80NDcvcy9pbmxpbmVTcmMvIn0=