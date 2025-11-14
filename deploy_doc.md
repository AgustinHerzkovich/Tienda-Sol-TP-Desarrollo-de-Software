# Documentación de Despliegue del Aplicativo

Esta documentación describe **cómo desplegar el aplicativo por primera vez** en los servicios utilizados (Netlify para frontend y Render para backend) y **cómo subir una nueva release a producción**.

---

## 1. Requisitos Previos

Antes de desplegar, asegurarse de tener:

- Repositorio del backend y frontend listos.
- Base de datos creada en **MongoDB Atlas**.
- Usuario de base de datos creado.
- IPs habilitadas en Atlas (0.0.0.0/0 para Render).
- Connection string funcional.

---

# 2. Despliegue Inicial

## 2.1 Backend en Render

### **1. Crear servicio web en Render**
- Ir a https://render.com
- Crear un nuevo **Web Service**.
- Seleccionar **Node.js**.
- Subir el backend desde GitHub o usando Deploy via Tar.

### **2. Configurar variables de entorno**
Agregar en Render → *Environment Variables*:

- `MONGODB_URI = mongodb+srv://USER:PASS@CLUSTER/Tienda-Sol?...`
- `PORT = 8000`
- `SERVER_URL = https://<tu-backend>.onrender.com`

### **3. Configurar Startup Command**
Render debe ejecutar:
```
npm start
```

### **4. Deploy automático**
Render inicia el deploy automáticamente al crear el servicio.

### **5. Validar logs**
En la sección **Logs**, validar que aparezca:
```
MongoDB is connected
Server running on port 8000
```

---

## 2.2 Base de Datos en MongoDB Atlas

### **1. Crear cluster**
- Crear proyecto y cluster en Atlas.

### **2. Permitir IPs**
En **Network Access** → agregar:
```
0.0.0.0/0
```

### **3. Crear usuario de BD**
En **Database Access**, crear usuario con permisos Read/Write.

### **4. Obtener connection string**
Desde *Connect → Drivers*.

---

## 2.3 Frontend en Netlify

### **1. Crear sitio en Netlify**
- Entrar a https://netlify.app
- Crear un nuevo sitio.
- Elegir modo manual (upload folder) o GitHub.

### **2. Construir frontend**
En local ejecutar:
```
npm run build
```

### **3. Subir la carpeta "dist" o "build"**
Netlify la desplegará automáticamente.

### **4. Configurar variables (si aplica)**
Si tu frontend necesita una URL del backend:
- Netlify → Site Settings → Environment Variables
- Agregar:
```
VITE_API_URL=https://tu-backend.onrender.com
```

### **5. Cambiar nombre del sitio (opcional)**
Netlify → Site Settings → Change site name.

---

# 3. Subir una Nueva Release a Producción

## 3.1 Nueva Release del Backend

### **1. Actualizar código en GitHub**
- Merge a la rama main.
- Render detectará cambios y redeployará automáticamente.

### **2. Si es Deploy manual**
- Entrar a Render → *Manual Deploy → Deploy latest commit*.

### **3. Verificar logs**
Confirmar que el backend inició sin errores.

### **4. Probar endpoints**
Con Postman o Swagger.

---

## 3.2 Nueva Release del Frontend

### **1. Actualizar código del frontend**

### **2. Generar build**
```
npm run build
```

### **3. Subir nueva carpeta build/dist a Netlify**
Netlify reemplaza la versión anterior automáticamente.

### **4. Probar funcionamiento**
Acceder a la URL pública y validar llamadas al backend.

---

# 4. Problemas Comunes y Soluciones

### **CORS Error**
Backend debe tener:
```js
app.use(cors({ origin: "*" }));
```

### **Swagger mostrando "Failed to Fetch"**
En swagger config:
```
servers:
  - url: https://tu-backend.onrender.com
```

### **Errores de conexión a MongoDB**
- Revisar password con caracteres especiales.
- Revisar IPs habilitadas.
- Revisar variable MONGODB_URI.

---

# 5. Resumen de Flujo de Deploy

1. Subir backend a Render.
2. Configurar variables.
3. Validar logs.
4. Conectar MongoDB Atlas.
5. Generar build del frontend.
6. Subir a Netlify.
7. Probar API + Frontend.

---

# 6. Fin de la Documentación

Esta guía permite que cualquier desarrollador pueda desplegar el proyecto desde cero o subir nuevas releases de forma segura.