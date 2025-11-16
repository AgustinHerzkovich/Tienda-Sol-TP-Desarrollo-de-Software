import z from 'zod';

export const direccionSchema = z.object({
  calle: z.string().min(1),
  altura: z.string().min(1),
  piso: z.string().min(1),
  departamento: z.string().min(1).optional(),
  codigoPostal: z.string().min(1),
  ciudad: z.string().min(1),
  provincia: z.string().min(1),
  pais: z.string().min(1),
  lat: z.string().min(1),
  lon: z.string().min(1),
});
