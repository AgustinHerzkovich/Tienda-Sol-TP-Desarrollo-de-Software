import z from 'zod';
import { TipoUsuario } from '../../models/tipoUsuario.js';

export const usuarioPostSchema = z.object({
  nombre: z.string().min(1),
  email: z.string().min(1),
  telefono: z.string().min(1),
  tipo: z.enum(Object.values(TipoUsuario)),
});
