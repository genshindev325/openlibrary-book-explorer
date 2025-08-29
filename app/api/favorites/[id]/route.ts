import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'
import { z } from 'zod'

const updateSchema = z.object({
    notes: z.string().nullable().optional(),
    title: z.string().optional(),
    author: z.string().nullable().optional(),
    year: z.number().int().nullable().optional()
})

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
    const item = await prisma.favorite.findUnique({ where: { id: params.id } })
    if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(item)
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    const json = await req.json().catch(() => ({}))
    const parsed = updateSchema.safeParse(json)
    if (!parsed.success) return NextResponse.json({ error: parsed.error.message }, { status: 400 })

    try {
        const updated = await prisma.favorite.update({ where: { id: params.id }, data: parsed.data })
        return NextResponse.json(updated)
    } catch {
        return NextResponse.json({ error: 'Update failed' }, { status: 500 })
    }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
    try {
        await prisma.favorite.delete({ where: { id: params.id } })
        return NextResponse.json({ ok: true })
    } catch {
        return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
    }
}
