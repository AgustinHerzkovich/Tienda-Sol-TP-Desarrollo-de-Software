import z from 'zod';

export const notificacionPatchSchema = z.object({
  read: z
    .union([z.boolean(), z.string().regex(/^(true|false)$/)])
    .transform((val) => val === true || val === 'true'),
}); // Permite tanto boolean como string "true"/"false"
