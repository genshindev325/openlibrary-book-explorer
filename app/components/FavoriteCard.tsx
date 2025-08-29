'use client'

import React, { useOptimistic, useTransition } from 'react'

type Favorite = {
    id: string
    itemKey: string
    title: string
    author?: string | null
    year?: number | null
    coverUrl?: string | null
    notes?: string | null
}

export default function FavoriteCard({ f, onDeleted }: { f: Favorite, onDeleted: (id: string) => void }) {
    const [isPending, startTransition] = useTransition()
    const [state, updateOptimistic] = useOptimistic(f, (cur, upd: Partial<Favorite>) => ({ ...cur, ...upd }))

    const save = (notes: string) => {
        updateOptimistic({ notes })
        startTransition(async () => {
            await fetch(`/api/favorites/${state.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ notes })
            })
        })
    }

    const del = () => {
        const prev = state
        onDeleted(state.id)
        startTransition(async () => {
            const res = await fetch(`/api/favorites/${state.id}`, { method: 'DELETE' })
            if (!res.ok) {
                console.error('Delete failed; reload to see current state')
            }
        })
    }

    return (
        <article className="flex gap-4 border p-3 bg-white shadow-md rounded-lg">
            <img
                src={state.coverUrl ?? 'https://placehold.co/80x120?text=No+Cover'}
                alt={`Cover for ${state.title}`}
                width={80}
                height={120}
                className="rounded object-cover"
            />
            <div className="flex-1">
                <a className="text-lg font-semibold hover:underline" href={`/item${state.itemKey}`}>{state.title}</a>
                <div className="text-sm text-gray-600">
                    {state.author ? state.author : 'Unknown author'} {state.year ? `• ${state.year}` : ''}
                </div>
                <label className="mt-2 block text-sm font-medium" htmlFor={`notes-${state.id}`}>Notes</label>
                <textarea
                    id={`notes-${state.id}`}
                    className="border rounded p-2 w-full min-h-[80px]"
                    defaultValue={state.notes ?? ''}
                    onBlur={(e) => save(e.target.value)}
                    placeholder="Click to edit notes; changes save on blur"
                    aria-describedby={`save-hint-${state.id}`}
                />
                <div id={`save-hint-${state.id}`} className="text-xs text-gray-500 mt-1">Edits save automatically when you leave the field.</div>
                <div className="mt-2 flex gap-2">
                    <button className="rounded bg-red-600 text-white px-3 py-2" onClick={del} disabled={isPending}>Delete</button>
                </div>
            </div>
        </article>
    )
}
