import React from 'react'
import Link from 'next/link'
import './globals.css'

export const metadata = {
    title: 'Openlibrary-Book-Explorer',
    description: 'Search OpenLibrary, save favorites with notes'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className="min-h-screen text-gray-900">
                <header className="bg-white pt-6">
                    <nav className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-center gap-6 bg-white shadow-md rounded-lg">
                        <Link
                            href="/"
                            className="font-semibold text-gray-700 hover:text-blue-500 transition-colors duration-300"
                        >
                            Search
                        </Link>
                        <Link
                            href="/favorites"
                            className="font-semibold text-gray-700 hover:text-blue-500 transition-colors duration-300"
                        >
                            Favorites
                        </Link>
                    </nav>
                </header>
                <main className="mx-auto max-w-5xl p-4">{children}</main>
            </body>
        </html>
    )
}
