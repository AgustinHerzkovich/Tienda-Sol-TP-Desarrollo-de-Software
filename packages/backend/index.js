import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import routes from './routes/routes.js';
//import connectDB from './db.js';
import Server from './server.js';
import HealthCheckController from './controllers/healthCheckController.js';
import PedidoRepository from './repositories/pedidoRepository.js';
import PedidoService from './services/pedidoService.js';
import PedidoController from './controllers/pedidoController.js';
import ProductoRepository from './repositories/productoRepository.js';
import ProductoService from './services/productoService.js';
import ProductoController from './controllers/productoController.js';
import UsuarioRepository from './repositories/usuarioRepository.js';
import UsuarioService from './services/usuarioService.js';
import UsuarioController from './controllers/usuarioController.js';
import NotificacionRepository from './repositories/notificacionRepository.js';
import NotificacionService from './services/notificacionService.js';
import NotificacionController from './controllers/notificacionController.js';
import {setupSwagger} from './swagger.js'

dotenv.config();

async function main() {
  //await connectDB();

  const app = express();
  app.use(express.json());
  app.use(
    cors({
      origin: process.env.ALLOWED_ORIGINS
        ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim())
        : true,
    })
  );
  
  // Configuramos el puerto con el .env
  const port = process.env.SERVER_PORT || 3000;

  // Configuramos swagger
  setupSwagger(app);

  // Se envía al server el puerto
  const server = new Server(app, port);

  // Acá se instancian los controllers, services y repositories
  const healthCheckController = new HealthCheckController();

  const usuarioRepository = new UsuarioRepository();
  const productoRepository = new ProductoRepository();
  const notificacionRepository = new NotificacionRepository();
  const pedidoRepository = new PedidoRepository();

  const usuarioService = new UsuarioService(usuarioRepository);
  const productoService = new ProductoService(productoRepository, usuarioService);
  const notificacionService = new NotificacionService(notificacionRepository);
  const pedidoService = new PedidoService(
    pedidoRepository,
    productoService,
    usuarioService,
    notificacionService
  );

  const usuarioController = new UsuarioController(
    usuarioService,
    pedidoService,
    notificacionService
  );
  const productoController = new ProductoController(productoService);
  const notificacionController = new NotificacionController(
    notificacionService
  );
  const pedidoController = new PedidoController(pedidoService);

  server.addController(HealthCheckController, healthCheckController);
  server.addController(ProductoController, productoController);
  server.addController(UsuarioController, usuarioController);
  server.addController(NotificacionController, notificacionController);
  server.addController(PedidoController, pedidoController);

  routes.forEach((route) => server.addRoute(route));
  server.configureRoutes();
  server.launch();
  console.log("")
}

main().catch((err) => console.error('Error al iniciar la app: ', err));
