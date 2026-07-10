import * as angular from 'angular';
import {PosthogService} from './posthog.service';

export class ExceptionHandlingService {

  static $inject: string[] = ['$log', 'posthogService'];
  constructor(private $log: angular.ILogService, private posthog: PosthogService) {
  }

  reportUnhandledException(exception: Error, cause?: string) {
    if (cause == null) {
      this.$log.error('Error: ' + exception.message ? exception.message : exception);
    } else {
      this.$log.error('Error: ' + exception.message ? exception.message : exception + '; caused by: ' + cause);
    }
    // zone.js routes uncaught exceptions here without necessarily surfacing them to
    // window.onerror, so PostHog's exception autocapture alone can't be relied on for these.
    this.posthog.captureException(exception, cause == null ? undefined : { cause });
  }
}

export const ExceptionOverrideModule = angular
  .module('exceptionOverride', [ ])
  .service('exceptionHandler', ExceptionHandlingService)
  .factory('$exceptionHandler', ['$log', 'exceptionHandler', ($log: angular.ILogService,
                                                              exceptionHandler: ExceptionHandlingService) => {
    return (exception: Error, cause?: string) => exceptionHandler.reportUnhandledException(exception, cause);
  }])
  .name;
