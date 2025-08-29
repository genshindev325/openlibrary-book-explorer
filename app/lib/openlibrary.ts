import { fetchWithRetry } from './fetchWithRetry'
import type { OLWork, OLSummary } from '../types'

export function toSummary(w: OLWork): OLSummary {
    return {
        key: w.key,
        title: w.title,
        author: w.author_name?.[0] ?? null,
        year: w.first_publish_year ?? null,
        coverUrl: w.cover_i ? `https://covers.openlibrary.org/b/id/${w.cover_i}-M.jpg` : null
    }
}

export async function searchOpenLibrary(params: { q: string, limit?: number }) {
    const url = new URL('https://openlibrary.org/search.json')
    url.searchParams.set('q', params.q)
    url.searchParams.set('limit', String(params.limit ?? 25))
    url.searchParams.set('fields', 'key,title,author_name,first_publish_year,cover_i,language')
    const res = await fetchWithRetry(url.toString(), { next: { revalidate: 3600 } }, { retries: 2 })
    if (!res.ok) {
        const text = await res.text()
        throw new Error(`OpenLibrary error: ${res.status} ${text}`)
    }
    const data = await res.json()
    return data as { docs: OLWork[] }
}

export async function fetchWorkDetail(key: string) {
    const url = `https://openlibrary.org${key}.json`
    const res = await fetchWithRetry(url, { next: { revalidate: 86400 } }, { retries: 2 })
    if (!res.ok) throw new Error(`OpenLibrary detail error: ${res.status}`)
    return res.json()
}
