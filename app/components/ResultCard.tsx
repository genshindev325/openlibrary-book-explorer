'use client'

import React, { useState, useTransition } from 'react'
import type { Result } from '../types'

export default function ResultCard({ r }: { r: Result }) {
    const [notes, setNotes] = useState('')
    const [isPending, startTransition] = useTransition()
    const [saved, setSaved] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const save = () => {
        setError(null)
        startTransition(async () => {
            const res = await fetch('/api/favorites', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    itemKey: r.key,
                    title: r.title,
                    author: r.author,
                    year: r.year,
                    coverUrl: r.coverUrl,
                    notes
                })
            })
            if (res.ok) setSaved(true)
            else setError((await res.json()).error ?? 'Failed to save')
        })
    }

    return (
        <article className="flex gap-4 border shadow-md rounded-lg p-3 bg-white" aria-label={`Result ${r.title}`}>
            <img
                src={r.coverUrl ?? 'https://placehold.co/80x120?text=No+Cover'}
                alt={`Cover for ${r.title}`}
                width={80}
                height={120}
                className="rounded object-cover"
            />
            <div className="flex-1">
                <a className="text-lg font-semibold hover:underline" href={`/item${r.key}`}>{r.title}</a>
                <div className="text-sm text-gray-600">
                    {r.author ? r.author : 'Unknown author'} {r.year ? `• ${r.year}` : ''}
                </div>
                <div className="mt-2 flex gap-2 items-center">
                    <input
                        aria-label="Notes"
                        className="border rounded p-2 flex-1"
                        placeholder="Add a note (optional)"
                        value={notes}
                        onChange={e => setNotes(e.target.value)}
                        disabled={saved}
                    />
                    <button
                        className="rounded bg-emerald-600 text-white px-3 py-2 disabled:opacity-50"
                        onClick={save}
                        disabled={saved || isPending}
                    >
                        {saved ? 'Saved' : (isPending ? 'Saving...' : 'Save')}
                    </button>
                </div>
                {error && <div className="text-red-600 mt-1 text-sm" role="alert">{error}</div>}
            </div>
        </article>
    )
}
