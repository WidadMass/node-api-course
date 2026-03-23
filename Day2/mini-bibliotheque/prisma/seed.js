const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const count = await prisma.livre.count();
  if (count === 0) {
    await prisma.livre.createMany({
      data: [
        { titre: 'Clean Code', auteur: 'Robert C. Martin' },
        { titre: 'The Pragmatic Programmer', auteur: 'Hunt & Thomas' },
        { titre: 'Node.js Design Patterns', auteur: 'Mario Casciaro' },
      ],
    });
    console.log('3 livres insérés.');
  } else {
    console.log(`Base déjà peuplée (${count} livres).`);
  }
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
