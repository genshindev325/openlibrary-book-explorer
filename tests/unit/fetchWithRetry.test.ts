import { describe, it, expect } from 'vitest'
import { fetchWithRetry } from '../../app/lib/fetchWithRetry'

// Since we can't hit network in unit tests reliably here, test retry logic shape by mocking global fetch
describe('fetchWithRetry', () => {
    it('retries on failure and eventually throws', async () => {
        let calls = 0
        // @ts-ignore
        global.fetch = async () => {
            calls++
            throw new Error('network fail')
        }
        await expect(fetchWithRetry('https://example.com', {}, { retries: 2, backoffMs: 1 })).rejects.toThrow()
        expect(calls).toBe(3) // initial + 2 retries
    })

    it('returns on success', async () => {
        // @ts-ignore
        global.fetch = async () => ({ ok: true, status: 200 })
        const res = await fetchWithRetry('https://example.com')
        // @ts-ignore
        expect(res.ok).toBe(true)
    })
})
