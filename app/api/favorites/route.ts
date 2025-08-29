import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'
import { z } from 'zod'

const createSchema = z.object({
    itemKey: z.string(),
    title: z.string(),
    author: z.string().nullable().optional(),
    year: z.number().int().nullable().optional(),
    coverUrl: z.string().url().nullable().optional(),
    notes: z.string().nullable().optional(),
})

export async function GET(req: NextRequest) {
    const items = await prisma.favorite.findMany({
        orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ items })
}

export async function POST(req: NextRequest) {
    const json = await req.json().catch(() => ({}))
    const parsed = createSchema.safeParse(json)
    if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.message }, { status: 400 })
    }

    try {
        const created = await prisma.favorite.create({
            data: {
                itemKey: parsed.data.itemKey,
                title: parsed.data.title,
                author: parsed.data.author ?? undefined,
                year: parsed.data.year ?? undefined,
                coverUrl: parsed.data.coverUrl ?? undefined,
                notes: parsed.data.notes ?? undefined,
            },
        })
        return NextResponse.json(created, { status: 201 })
    } catch (e: any) {
        if (e.code === 'P2002') {
            return NextResponse.json({ error: 'Already saved' }, { status: 409 })
        }
        return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
    }
}
