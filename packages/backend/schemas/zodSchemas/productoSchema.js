import z from 'zod';
import { Moneda } from '../../models/moneda.js';
import { objectIdSchema } from './objectIdSchema.js';

export const productoPostSchema = z.object({
  titulo: z.string().min(1),
  descripcion: z.string().min(1),
  categorias: z.array(z.object({ nombre: z.string().min(1) })),
  precio: z.number().positive(),
  moneda: z.enum(Object.values(Moneda)),
  stock: z.number().int().nonnegative(),
  fotos: z.array(z.url()).optional(),
  activo: z.boolean(),
  vendedorId: objectIdSchema,
});
