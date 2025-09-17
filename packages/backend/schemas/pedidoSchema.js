import z from 'zod';
import {EstadoPedido} from '../models/estadoPedido.js';
import {Moneda} from '../models/moneda.js';

export const pedidoPostSchema = z.object({
  comprador: z.uuid(),
  items: z
    .array(
      z.object({
        producto: z.uuid(),
        cantidad: z.number().min(1),
      })
    )
    .min(1),
  moneda: z.enum(Object.values(Moneda)),
  direccionEntrega: z.string(),
});

export const pedidoPatchSchema = z.object({
  estado: z.enum(Object.values(EstadoPedido)),
});
