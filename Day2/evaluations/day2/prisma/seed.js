const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const userCount = await prisma.user.count();

  if (userCount === 0) {
    const hashedPassword = await bcrypt.hash('admin123', 10);

    await prisma.user.create({
      data: {
        nom: 'Admin',
        email: 'admin@biblio.fr',
        password: hashedPassword,
        role: 'admin'
      }
    });

    console.log('Utilisateur admin créé (admin@biblio.fr / admin123)');
  }

  const livreCount = await prisma.livre.count();

  if (livreCount === 0) {
    await prisma.livre.createMany({
      data: [
        { titre: 'Clean Code', auteur: 'Robert C. Martin', annee: 2008, genre: 'Informatique' },
        { titre: 'The Pragmatic Programmer', auteur: 'David Thomas', annee: 1999, genre: 'Informatique' },
        { titre: 'Node.js Design Patterns', auteur: 'Mario Casciaro', annee: 2020, genre: 'Informatique' }
      ]
    });

    console.log('3 livres créés');
  }

  console.log('Seed terminé');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
