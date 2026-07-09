import * as angular from 'angular';
import type { PostHog } from 'posthog-js';

// PostHog is initialized by the inline snippet in languageforge.html.twig, which sets
// window.posthog. The posthog-js npm singleton is a separate, never-initialized instance,
// so this service must talk to the window global rather than `import posthog from 'posthog-js'`.
interface WindowWithPosthog extends angular.IWindowService {
  posthog?: PostHog;
}

export class PosthogService {
  static $inject: string[] = ['$window'];
  constructor(private $window: WindowWithPosthog) { }

  identify(userId: string, properties?: Record<string, unknown>): void {
    this.$window.posthog?.identify(userId, properties);
  }

  capture(event: string, properties?: Record<string, unknown>): void {
    this.$window.posthog?.capture(event, properties);
  }

  reset(): void {
    this.$window.posthog?.reset();
  }
}
