export type RetryOptions = {
    retries?: number
    backoffMs?: number
    factor?: number
}

export type OLWork = {
    key: string
    title: string
    author_name?: string[]
    first_publish_year?: number
    cover_i?: number
    language?: string[]
}

export type OLSummary = {
    key: string
    title: string
    author: string | null
    year: number | null
    coverUrl: string | null
}