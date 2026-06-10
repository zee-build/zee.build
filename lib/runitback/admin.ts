const STORAGE_KEY = 'runitback-admin-auth'

export function getAdminPin(): string | null {
  if (typeof window === 'undefined') return null
  return window.sessionStorage.getItem(STORAGE_KEY)
}

/** fetch() wrapper that attaches the admin PIN header for protected API routes. */
export function adminFetch(input: string, init: RequestInit = {}) {
  const pin = getAdminPin()
  return fetch(input, {
    ...init,
    headers: {
      ...(init.headers ?? {}),
      'x-admin-pin': pin ?? '',
    },
  })
}
