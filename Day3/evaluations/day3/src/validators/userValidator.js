const { z } = require('zod');

const userRoleSchema = z.object({
  role: z.enum(['admin', 'user'])
});

module.exports = { userRoleSchema };