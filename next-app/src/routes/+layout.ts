import posthog from 'posthog-js'
import { browser } from '$app/environment'
import { PUBLIC_POSTHOG_KEY, PUBLIC_POSTHOG_HOST } from '$env/static/public'
type LayoutData = { user_id: string | null, username: string | null } | null

// Keep these options in sync with the posthog.init() call in languageforge.html.twig —
// the legacy PHP+Angular app and this app should capture equivalent analytics signal.
export const load = async ({ data }: { data: LayoutData }) => {
	if (browser) {
		posthog.init(PUBLIC_POSTHOG_KEY, {
			api_host: PUBLIC_POSTHOG_HOST,
			defaults: '2026-01-30',
			autocapture: true,
			person_profiles: 'identified_only',
			loaded: (ph) => {
				// $pageview is captured by the reactive statement in +layout.svelte, which also
				// covers the initial load — capturing it here too would double-count it.
				// This load() function re-runs on every client-side navigation, so guard against
				// re-identifying the same already-identified user, which would otherwise fire a
				// redundant $set event on every pageview.
				if (data?.user_id && ph.get_distinct_id() !== data.user_id) {
					ph.identify(data.user_id, { username: data.username })
				}
			},
		})
		// Org-wide PostHog project is shared across SIL tools — this super property tags
		// every event so LanguageForge's data can be filtered out of the rest.
		posthog.register({ product: 'languageforge' })
	}

	return {}
}
