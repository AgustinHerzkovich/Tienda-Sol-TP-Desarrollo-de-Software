import z from 'zod';

export const notificacionPatchSchema = z.object({
  read: z.boolean(),
});
