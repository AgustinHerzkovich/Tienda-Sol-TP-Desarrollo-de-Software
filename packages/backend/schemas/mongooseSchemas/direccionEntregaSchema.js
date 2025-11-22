import mongoose from 'mongoose';

export const DireccionEntregaSchema = new mongoose.Schema({
  calle: { type: String, required: true },
  altura: { type: String, required: true },
  piso: { type: String, required: true },
  departamento: { type: String, required: true },
  codigoPostal: { type: String, required: true },
  ciudad: { type: String, required: true },
  provincia: { type: String, required: true },
  pais: { type: String, required: true },
  lat: { type: String, required: true },
  lon: { type: String, required: true },
});