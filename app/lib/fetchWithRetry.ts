import type { RetryOptions } from "../types"

export async function fetchWithRetry(input: RequestInfo | URL, init?: RequestInit, opts: RetryOptions = {}) {
    const { retries = 3, backoffMs = 300, factor = 2 } = opts
    let attempt = 0
    let lastError: any
    while (attempt <= retries) {
        try {
            const res = await fetch(input, init)
            if (!res.ok) {
                if (res.status >= 500 || res.status === 429) {
                    throw new Error(`HTTP ${res.status}`)
                }
            }
            return res
        } catch (err) {
            lastError = err
            if (attempt === retries) break
            const delay = backoffMs * Math.pow(factor, attempt)
            await new Promise(r => setTimeout(r, delay))
            attempt++
        }
    }
    throw lastError
}
