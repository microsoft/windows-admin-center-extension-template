import { TooltipHost } from './models/tooltip-host';
export declare class TooltipService {
    /**
     * public facing getter for the tooltip host
     */
    readonly TooltipHost: TooltipHost;
    /**
     * Indicates that tooltips should show on focus
     */
    readonly showOnfocus: boolean;
    /**
     * internal placeholder for the registered tooltip host
     */
    private host;
    /**
     * Registers the tooltip host with the service.
     * @param component The tooltip host component.
     */
    register(host: TooltipHost): void;
    /**
     * Unregisters  the tooltip host with the service.
     * @param component The tooltip host component.
     */
    unregister(host: TooltipHost): void;
}
