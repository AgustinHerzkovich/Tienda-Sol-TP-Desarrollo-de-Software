import z from 'zod';

export const notificacionPatchSchema = z.object({
  read: z.enum(['true', 'false']).transform((val) => val === 'true'),
});
