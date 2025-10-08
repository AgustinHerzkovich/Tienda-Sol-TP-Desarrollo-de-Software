import z from 'zod';
import { EstadoPedido } from '../../models/estadoPedido.js';
import { Moneda } from '../../models/moneda.js';
import { objectIdSchema } from './objectIdSchema.js';

export const pedidoPostSchema = z.object({
  compradorId: objectIdSchema,
  items: z
    .array(
      z.object({
        productoId: objectIdSchema,
        cantidad: z.number().min(1),
      })
    )
    .min(1),
  moneda: z.enum(Object.values(Moneda)),
  direccionEntrega: z.object({
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
  }),
});

export const pedidoPatchSchema = z.object({
  estado: z.enum(Object.values(EstadoPedido).map((e) => e.valor)),
});
