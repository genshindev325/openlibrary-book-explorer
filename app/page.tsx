import SearchForm from './components/SearchForm'
import SearchResults from './components/SearchResults'

export default async function Page({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
    const { q, sort, yearFrom, yearTo } = {
        q: (searchParams.q as string) ?? '',
        sort: (searchParams.sort as string) ?? 'relevance',
        yearFrom: (searchParams.yearFrom as string) ?? '',
        yearTo: (searchParams.yearTo as string) ?? ''
    }

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-bold">Search OpenLibrary</h1>
            <p className="text-gray-600">
                Explore books from OpenLibrary by title, author, or year. 
                You can save your favorite books and add personal notes to keep track of the ones you love.
            </p>
            <SearchForm />
            <SearchResults q={q} sort={sort} yearFrom={yearFrom} yearTo={yearTo} />
        </div>
    )
}
