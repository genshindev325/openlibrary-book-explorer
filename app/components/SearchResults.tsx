'use client'

import { useEffect, useState } from 'react'
import ResultCard from './ResultCard'
import Pagination from './Pagination'
import type { Result } from '../types'

export default function SearchResults({
    q,
    sort,
    yearFrom,
    yearTo,
    defaultPageSize = 10,
}: {
    q: string
    sort: string
    yearFrom: string
    yearTo: string
    defaultPageSize?: number
}) {
    const [allItems, setAllItems] = useState<Result[]>([])
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(defaultPageSize)

    useEffect(() => {
        if (!q) {
            setAllItems([])
            setError(null)
            return
        }

        setLoading(true)
        setError(null)

        const qp = new URLSearchParams()
        qp.set('q', q)
        qp.set('sort', sort)
        qp.set('yearFrom', yearFrom)
        qp.set('yearTo', yearTo)

        fetch(`/api/search?${qp.toString()}`, { cache: 'no-store' })
            .then(async (res) => {
                if (!res.ok) {
                    const body = await res.json().catch(() => ({}))
                    throw new Error(body.error ?? 'Search failed')
                }
                return res.json()
            })
            .then((data) => {
                setAllItems(data.items ?? [])
                setPage(1)
            })
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false))
    }, [q, sort, yearFrom, yearTo])

    if (!q) return null

    const total = allItems.length
    const start = (page - 1) * pageSize
    const pagedItems = allItems.slice(start, start + pageSize)

    return (
        <div className="py-4 grid gap-3">
            {total > 0 && (
                <div className="flex justify-end">
                    <Pagination
                        total={total}
                        page={page}
                        pageSize={pageSize}
                        onPageChange={setPage}
                        onPageSizeChange={(s) => {
                            setPageSize(s)
                            setPage(1)
                        }}
                    />
                </div>
            )}

            {loading && <div className="text-gray-600">Loading…</div>}
            {error && <div className="text-red-700" role="alert">{error}</div>}

            {!loading && total === 0 && (
                <div className="flex flex-col items-center justify-center text-center py-10 text-gray-500">
                    <svg
                        className="w-12 h-12 mb-2 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 17v-2a2 2 0 012-2h4a2 2 0 012 2v2m-6 4h6m2 0h2a2 2 0 002-2V7a2 2 0 00-2-2h-2m-2 0H7m0 0H5a2 2 0 00-2 2v12a2 2 0 002 2h2"
                        />
                    </svg>
                    <p className="text-lg font-medium">No results found</p>
                    <p className="text-sm">Try a different query or adjust the filters above.</p>
                </div>
            )}

            {pagedItems.map((r) => (
                <ResultCard key={r.key} r={r} />
            ))}
        </div>
    )
}
