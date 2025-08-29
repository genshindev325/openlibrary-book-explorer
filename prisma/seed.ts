import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const seedData = [
    {
      itemKey: '/works/OL45883W',
      title: 'Pride and Prejudice',
      author: 'Jane Austen',
      year: 1813,
      coverUrl: 'https://covers.openlibrary.org/b/id/8225326-M.jpg',
      notes: 'Classic novel seed data',
    },
    {
      itemKey: '/works/OL27448W',
      title: 'Moby Dick',
      author: 'Herman Melville',
      year: 1851,
      coverUrl: 'https://covers.openlibrary.org/b/id/7222246-M.jpg',
      notes: 'Whale of a tale',
    },
  ]

  console.log(`🌱 Seeding ${seedData.length} favorite(s)...`)

  const result = await prisma.favorite.createMany({
    data: seedData,
    skipDuplicates: true, // avoids errors if row already exists
  })

  console.log(`✅ ${result.count} row(s) inserted.`)
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
