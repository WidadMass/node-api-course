const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  await prisma.emprunt.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.livre.deleteMany();
  await prisma.user.deleteMany();

  const hashedPw = await bcrypt.hash('admin123admin', 10);

  await prisma.user.create({
    data: {
      nom: 'Admin',
      email: 'admin@biblio.fr',
      password: hashedPw,
      role: 'admin'
    }
  });

  await prisma.livre.createMany({
    data: [
      { titre: 'Les Misérables', auteur: 'Victor Hugo', annee: 1862, genre: 'Roman' },
      { titre: 'Le Petit Prince', auteur: 'Antoine de Saint-Exupéry', annee: 1943, genre: 'Conte' },
      { titre: 'Germinal', auteur: 'Émile Zola', annee: 1885, genre: 'Roman' }
    ]
  });

  console.log('Seed terminé');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
