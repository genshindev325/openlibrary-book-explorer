'use client'

import React from 'react'

export default function Pagination({
    total,
    page,
    pageSize,
    onPageChange,
    onPageSizeChange,
}: {
    total: number
    page: number
    pageSize: number
    onPageChange: (p: number) => void
    onPageSizeChange: (s: number) => void
}) {
    const pages = Math.max(1, Math.ceil(total / pageSize))

    const go = (p: number) => {
        if (p < 1 || p > pages) return
        onPageChange(p)
    }

    return (
        <nav aria-label="Pagination" className="flex items-center gap-3 mt-4">
            <div className="flex items-center gap-1">
                <span className="text-sm text-gray-600">Show</span>
                <select
                    value={pageSize}
                    onChange={(e) => onPageSizeChange(Number(e.target.value))}
                    className="border rounded px-2 py-1 text-sm"
                >
                    {[5, 10, 20, 50].map((size) => (
                        <option key={size} value={size}>
                            {size}
                        </option>
                    ))}
                </select>
            </div>

            <div className="flex items-center gap-2">
                <button
                    className="border rounded px-3 py-1"
                    onClick={() => go(page - 1)}
                    disabled={page <= 1}
                >
                    Prev
                </button>
                <span className="text-sm">
                    Page {page} / {pages}
                </span>
                <button
                    className="border rounded px-3 py-1"
                    onClick={() => go(page + 1)}
                    disabled={page >= pages}
                >
                    Next
                </button>
            </div>
        </nav>
    )
}
