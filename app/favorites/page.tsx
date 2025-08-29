'use client'

import FavoriteCard from '@/app/components/FavoriteCard'
import Pagination from '@/app/components/Pagination'
import React, { useState, useEffect } from 'react'

async function fetchFavorites() {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL ?? ''}/api/favorites`,
        { cache: 'no-store' }
    )
    if (!res.ok) throw new Error('Failed to load favorites')
    return res.json()
}

export default function FavoritesPage({
    searchParams,
}: {
    searchParams: Record<string, string | string[] | undefined>
}) {
    const initialPage = Number(searchParams.page ?? '1')
    const initialPageSize = Number(searchParams.pageSize ?? '10')

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-bold">Favorites</h1>
            <FavoritesClient
                initialPage={initialPage}
                initialPageSize={initialPageSize}
            />
        </div>
    )
}

function FavoritesClient({
    initialPage,
    initialPageSize,
}: {
    initialPage: number
    initialPageSize: number
}) {
    const [allItems, setAllItems] = useState<any[]>([])
    const [page, setPage] = useState(initialPage)
    const [pageSize, setPageSize] = useState(initialPageSize)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        setLoading(true)
        fetchFavorites()
            .then((data) => setAllItems(data.items ?? []))
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false))
    }, [])

    const total = allItems.length
    const start = (page - 1) * pageSize
    const end = start + pageSize
    const items = allItems.slice(start, end)

    const onDeleted = (id: string) => {
        setAllItems((prev) => prev.filter((p) => p.id !== id))
    }

    return (
        <div className="space-y-3">
            {loading && <p className="text-gray-600">Loading…</p>}
            {error && <p className="text-red-600">{error}</p>}
            {!loading && total === 0 && (
                <div className="text-center text-gray-500 py-8">
                    <p className="text-lg font-medium">No favorites yet</p>
                    <p className="text-sm mt-1">Start saving your favorite books to see them here.</p>
                </div>
            )}

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

            {items.map((f) => (
                <FavoriteCard key={f.id} f={f} onDeleted={onDeleted} />
            ))}
        </div>
    )
}
