import { NextRequest, NextResponse } from 'next/server'
import { searchOpenLibrary, toSummary } from '@/app/lib/openlibrary'

export async function GET(req: NextRequest) {
    const { searchParams } = req.nextUrl
    const q = (searchParams.get('q') || '').trim()
    const language = searchParams.get('language')
    const yearFrom = Number(searchParams.get('yearFrom')) || undefined
    const yearTo = Number(searchParams.get('yearTo')) || undefined
    const sort = searchParams.get('sort') || 'relevance'

    if (!q) {
        return NextResponse.json({ error: 'Missing q' }, { status: 400 })
    }

    try {
        const data = await searchOpenLibrary({ q, limit: 50 })
        let items = data.docs.map(toSummary)

        items = items.filter(i => {
            const okYearFrom = yearFrom ? (i.year ?? -Infinity) >= yearFrom : true
            const okYearTo = yearTo ? (i.year ?? Infinity) <= yearTo : true
            const okLang = language ? true : true
            return okYearFrom && okYearTo && okLang
        })

        if (sort === 'year_desc') items.sort((a, b) => (b.year ?? -Infinity) - (a.year ?? -Infinity))
        else if (sort === 'year_asc') items.sort((a, b) => (a.year ?? Infinity) - (b.year ?? Infinity))

        return NextResponse.json({ items })
    } catch (e: any) {
        return NextResponse.json({ error: e.message ?? 'Search failed' }, { status: 502 })
    }
}
