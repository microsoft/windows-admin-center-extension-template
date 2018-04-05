import { Logging, LogLevel } from '../../core';
var AppErrorHandler = /** @class */ (function () {
    function AppErrorHandler() {
    }
    AppErrorHandler.prototype.handleError = function (message) {
        if (message.xhr
            && message.xhr.status === 0) {
            // ignore if it's XHR with status 0 which is generated when a call is cancelled.
            // rxj/AjaxObservable returns AjaxError with status === 0 after component is destroyed.
            return;
        }
        Logging.log({
            source: 'appErrorHandler',
            level: LogLevel.Error,
            message: message.message || (typeof message === 'string' ? message : ''),
            stack: message.stack || '',
            consoleGroupHeader: typeof message === 'string' ? message : message.message
        });
        Logging.trace({
            view: 'sme-generic-error',
            instance: 'AppErrorHandler',
            action: 'exceptionLog',
            data: { stack: '' }
        });
    };
    return AppErrorHandler;
}());
export { AppErrorHandler };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuZ3VsYXIvc2VydmljZS9hcHAtZXJyb3ItaGFuZGxlci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE9BQU8sRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUE4QixNQUFNLFlBQVksQ0FBQztBQUUzRTtJQUFBO0lBd0JBLENBQUM7SUF2QlUscUNBQVcsR0FBbEIsVUFBbUIsT0FBTztRQUN0QixFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRztlQUNSLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDOUIsZ0ZBQWdGO1lBQ2hGLHVGQUF1RjtZQUN2RixNQUFNLENBQUM7UUFDWCxDQUFDO1FBRUQsT0FBTyxDQUFDLEdBQUcsQ0FBWTtZQUNuQixNQUFNLEVBQUUsaUJBQWlCO1lBQ3pCLEtBQUssRUFBRSxRQUFRLENBQUMsS0FBSztZQUNyQixPQUFPLEVBQUUsT0FBTyxDQUFDLE9BQU8sSUFBSSxDQUFDLE9BQU8sT0FBTyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7WUFDeEUsS0FBSyxFQUFFLE9BQU8sQ0FBQyxLQUFLLElBQUksRUFBRTtZQUMxQixrQkFBa0IsRUFBRSxPQUFPLE9BQU8sS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU87U0FDOUUsQ0FBQyxDQUFDO1FBRUgsT0FBTyxDQUFDLEtBQUssQ0FBa0I7WUFDM0IsSUFBSSxFQUFFLG1CQUFtQjtZQUN6QixRQUFRLEVBQUUsaUJBQWlCO1lBQzNCLE1BQU0sRUFBRSxjQUFjO1lBQ3RCLElBQUksRUFBRSxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUU7U0FDdEIsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUNMLHNCQUFDO0FBQUQsQ0F4QkEsQUF3QkMsSUFBQSIsImZpbGUiOiJhcHAtZXJyb3ItaGFuZGxlci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IkM6L0JBLzQ0Ny9zL2lubGluZVNyYy8ifQ==