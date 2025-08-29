import { fetchWorkDetail } from '@/app/lib/openlibrary'
import ResultCard from '@/app/components/ResultCard'

export default async function ItemPage({ params }: { params: { slug: string[] } }) {
    const key = '/' + params.slug.join('/')
    const detail = await fetchWorkDetail(key).catch(() => null)

    if (!detail) return <div>Failed to load details.</div>

    const title = detail.title ?? 'Untitled'
    const desc = typeof detail.description === 'string' ? detail.description : detail.description?.value
    const cover = Array.isArray(detail.covers) && detail.covers.length
        ? `https://covers.openlibrary.org/b/id/${detail.covers[0]}-L.jpg`
        : null

    const summary = {
        key,
        title,
        author: Array.isArray(detail.authors) ? null : null,
        year: detail.first_publish_date ? Number((detail.first_publish_date as string).slice(0, 4)) : null,
        coverUrl: cover
    }

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-bold">{title}</h1>
            {cover && <img src={cover} alt={`Cover for ${title}`} className="w-48 rounded" />}
            {desc && <p className="prose max-w-none">{desc}</p>}
            <div>
                <h2 className="text-xl font-semibold mt-4 mb-2">Save to favorites</h2>
                <ResultCard r={summary as any} />
            </div>
        </div>
    )
}
