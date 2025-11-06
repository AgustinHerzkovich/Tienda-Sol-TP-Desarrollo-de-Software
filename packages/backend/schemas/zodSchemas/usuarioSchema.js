import z from 'zod';
import { TipoUsuario } from '../../models/tipoUsuario.js';

export const usuarioPostSchema = z.object({
  nombre: z.string().min(1),
  email: z.string().min(1),
  password: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(64, 'La contraseña no puede superar los 64 caracteres')
    .regex(/[a-z]/, 'La contraseña debe contener al menos una letra minúscula')
    .regex(/[A-Z]/, 'La contraseña debe contener al menos una letra mayúscula')
    .regex(/\d/, 'La contraseña debe contener al menos un número')
    .regex(
      /[@$!%*?&_.-]/,
      'La contraseña debe contener al menos un carácter especial (@$!%*?&_.-)'
    ),
  telefono: z.string().min(1),
  tipo: z.enum(Object.values(TipoUsuario)),
});

export const usuarioPatchSchema = z.object({
  nombre: z.string().min(1).optional(),
  telefono: z.string().min(1).optional(),
  password: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(64, 'La contraseña no puede superar los 64 caracteres')
    .regex(/[a-z]/, 'La contraseña debe contener al menos una letra minúscula')
    .regex(/[A-Z]/, 'La contraseña debe contener al menos una letra mayúscula')
    .regex(/\d/, 'La contraseña debe contener al menos un número')
    .regex(
      /[@$!%*?&_.-]/,
      'La contraseña debe contener al menos un carácter especial (@$!%*?&_.-)'
    )
    .optional(),
});
