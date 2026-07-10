import posthog from 'posthog-js'
import type { HandleClientError } from '@sveltejs/kit'

// posthog-js's own exception autocapture (window.onerror / unhandledrejection) doesn't see
// errors SvelteKit swallows during load()/rendering and routes through this hook instead.
export const handleError: HandleClientError = ({ error, event }) => {
	posthog.captureException(error, { route: event.route.id })
}
