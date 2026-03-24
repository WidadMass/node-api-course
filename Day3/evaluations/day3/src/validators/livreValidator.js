const { z } = require('zod');

const livreCreateSchema = z.object({
  titre: z.string().min(1, 'Le titre est requis'),
  auteur: z.string().min(1, "L'auteur est requis"),
  annee: z.number().int().optional(),
  genre: z.string().optional()
});

const livreUpdateSchema = z.object({
  titre: z.string().min(1).optional(),
  auteur: z.string().min(1).optional(),
  annee: z.number().int().optional(),
  genre: z.string().optional()
});

module.exports = { livreCreateSchema, livreUpdateSchema };
