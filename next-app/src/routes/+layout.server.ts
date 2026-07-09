import { fetch_current_user } from '$lib/server/user'
import type { RequestEvent } from './$types'

export async function load({ request: { headers } }: RequestEvent) {
	try {
		const user = await fetch_current_user(headers.get('cookie') || '')
		return { user_id: user.id, username: user.username }
	} catch {
		return { user_id: null, username: null }
	}
}
