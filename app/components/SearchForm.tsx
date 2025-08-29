'use client'

import React, { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function SearchForm() {
    const router = useRouter()
    const sp = useSearchParams()
    const [q, setQ] = useState(sp.get('q') ?? '')
    const [sort, setSort] = useState(sp.get('sort') ?? 'relevance')
    const [yearFrom, setYearFrom] = useState(sp.get('yearFrom') ?? '')
    const [yearTo, setYearTo] = useState(sp.get('yearTo') ?? '')

    function submit(e: React.FormEvent) {
        e.preventDefault()
        const params = new URLSearchParams()
        if (q) params.set('q', q)
        if (sort) params.set('sort', sort)
        if (yearFrom) params.set('yearFrom', yearFrom)
        if (yearTo) params.set('yearTo', yearTo)

        router.push('/?' + params.toString())
    }

    function resetForm() {
        setQ('')
        setSort('relevance')
        setYearFrom('')
        setYearTo('')
        router.push('/')
    }

    return (
        <form onSubmit={submit} className="grid gap-3 md:grid-cols-5" aria-label="Search form">
            <input
                aria-label="Query"
                className="border rounded p-2 md:col-span-2"
                value={q}
                placeholder="Search books, authors..."
                onChange={e => setQ(e.target.value)}
            />
            <select
                aria-label="Sort"
                className="border rounded p-2"
                value={sort}
                onChange={e => setSort(e.target.value)}
            >
                <option value="relevance">Relevance</option>
                <option value="year_desc">Year ↓</option>
                <option value="year_asc">Year ↑</option>
            </select>
            <input
                aria-label="Year from"
                className="border rounded p-2"
                type="number"
                placeholder="Year from"
                value={yearFrom}
                onChange={e => setYearFrom(e.target.value)}
            />
            <input
                aria-label="Year to"
                className="border rounded p-2"
                type="number"
                placeholder="Year to"
                value={yearTo}
                onChange={e => setYearTo(e.target.value)}
            />
            <div className="md:col-span-5 flex gap-2">
                <button className="rounded bg-black text-white px-4 py-2" type="submit">
                    Search
                </button>
                <button
                    className="rounded border px-4 py-2"
                    type="button"
                    onClick={resetForm}
                >
                    Reset
                </button>
            </div>
        </form>
    )
}
