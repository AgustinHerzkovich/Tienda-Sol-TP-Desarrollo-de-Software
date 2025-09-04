import "dotenv/config";
import express from "express";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
      : true,
  }),
);

app.get("/health", async (req, res) => {
  let dbStatus = "unknown";
  /*try {
    // Simula chequeo de DB, reemplaza con tu lógica real
    // await db.ping();
    dbStatus = "ok";
  } catch (e) {
    dbStatus = "error";
  }*/
  dbStatus = "disconnected"; 
  res.json({
    status: "ok",
    db: dbStatus,
    version: process.env.npm_package_version,
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.listen(process.env.SERVER_PORT, () => {
  console.log(`Backend escuchando en puerto ${process.env.SERVER_PORT}`);
});
