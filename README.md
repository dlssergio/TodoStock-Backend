# 📦 TodoStock S.A. - Backend & Gestión de Inventario

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socketdotio&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

Sistema integral de gestión de inventario, pedidos y control de stock desarrollado para la distribuidora mayorista **TodoStock S.A.** Este proyecto fue construido como Trabajo Práctico Final para la asignatura **Desarrollo de Sistemas Web Backend** de la Tecnicatura Superior en Desarrollo de Software (IFTS Nº 29).

---

# 🚀 Características Principales

- **Arquitectura MVC:** Separación lógica de Modelos, Vistas (Pug) y Controladores.
- **Autenticación y Autorización:** Seguridad implementada mediante JSON Web Tokens (JWT) almacenados en cookies.
- **Control de Roles:** Vistas y permisos adaptados según el rol del usuario (`admin`, `ventas` y `deposito`).
- **Gestión de Datos (CRUD):** Operaciones completas para las colecciones de **Productos** y **Pedidos** utilizando MongoDB Atlas.
- **Alertas en Tiempo Real:** Notificaciones instantáneas de stock crítico mediante WebSockets con Socket.io.
- **Testing Automatizado:** Pruebas unitarias de rutas y controladores utilizando Jest.

---

# 🛠️ Tecnologías Utilizadas

- **Entorno de ejecución:** Node.js
- **Framework:** Express.js
- **Base de datos:** MongoDB Atlas (Mongoose ODM)
- **Motor de plantillas:** Pug
- **WebSockets:** Socket.io
- **Despliegue:** Vercel

---

# ⚙️ Instalación y Uso Local

Sigue estos pasos para levantar el proyecto en tu máquina local.

## 1. Clonar el repositorio

```bash
git clone https://github.com/dlssergio/TodoStock-Backend.git
cd TodoStock-Backend
```

## 2. Instalar dependencias

```bash
npm install
```

## 3. Configurar variables de entorno

Crear un archivo `.env` en la raíz del proyecto.

```env
PORT=3000
MONGO_URI=tu_cadena_de_conexion_mongodb
JWT_SECRET=tu_clave_secreta_jwt
```

## 4. Iniciar el servidor

```bash
npm start
```

El servidor estará disponible en:

```
http://localhost:3000
```

con soporte completo para WebSockets.

---

# 🔑 Credenciales de Prueba

El sistema incluye los siguientes usuarios para realizar pruebas según el rol correspondiente.

| Rol | Usuario | Contraseña |
|------|----------|------------|
| Administrador | `admin` | `admin123` |
| Ventas | `ventas` | `venta123` |
| Depósito | `deposito` | `depo123` |

> **Nota:** Estas credenciales son únicamente para fines de evaluación y pruebas del proyecto.

---

# 🌐 Entorno de Producción (Vercel)

El proyecto se encuentra desplegado y funcionando en Vercel.

🔗 **Producción:**

https://todo-stock-backend.vercel.app

---

## Nota sobre la arquitectura Serverless

> La plataforma **Vercel** utiliza funciones **Serverless**, las cuales no mantienen conexiones TCP persistentes.
>
> Por esta razón, la funcionalidad de WebSockets se encuentra habilitada únicamente durante el desarrollo local.
>
> Todas las funcionalidades relacionadas con autenticación JWT, operaciones CRUD, renderizado de vistas y acceso a MongoDB funcionan normalmente en producción.

---

# 👥 Equipo de Desarrollo

**Grupo 5 - Comisión E**

- **Walter David Ciancio** — Testing y Plantillas PUG
- **Guillermina Zen Cáffaro** — Lógica de WebSockets y Alertas
- **Sergio de los Santos** — Infraestructura, Vistas y Despliegue
- **Mario Julio Alegre** — Autenticación y Seguridad

---

## 👨‍🏫 Profesor

**Emir Eliezer García Ontiveros**