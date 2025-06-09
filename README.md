
# 📦 Documentación Técnica del Proyecto Nexos System

## 🗄️ Base de Datos

**Motor:** PostgreSQL  
**Versión:** 15  
**Nombre de la base de datos:** `nexos_system_db`  

### 🔧 Pasos de configuración

1. Crear la base de datos:
   ```sql
   CREATE DATABASE nexos_system_db;
   ```

2. Ejecutar el script `NexosDB.sql` que incluye:
   - Creación del usuario `nexos_user`
   - Creación del esquema `INVENTORY_SYSTEM`
   - Creación de tablas de histórico o auditoría
   - Funciones almacenadas de tipo `DELETE`
   - Inserción de registros iniciales en `personas`
   - Asignación de permisos al usuario `nexos_user`

### 🔐 Credenciales de conexión

```
url=jdbc:postgresql://127.0.0.1:5432/nexos_system_db  
username=nexos_user  
password=nexos12345  
```

### 📌 Modelo Entidad-Relación

> Ver en documentos anexos

---

## ☕ Backend (Java + Spring Boot)

**Lenguaje:** Java 21  
**Framework:** Spring Boot 3.5.0  

### 📁 Estructura de paquetes

```
src/main/java/
└── com/nexos/system/
    ├── config/
    │   ├── dataTables/       → Configuración de búsqueda parcial/global y paginación para tablas
    │   ├── jackson/          → Serialización y deserialización personalizada de objetos JSON
    │   ├── security/         → Filtros web y configuración de CORS
    │   └── specification/    → Lógica para filtros dinámicos y consultas personalizadas
    ├── controller/           → Controladores REST para exponer los endpoints
    ├── exception/            → Excepciones personalizadas y manejadores globales
    ├── model/
    │   ├── dao/              → Objetos de acceso a datos
    │   ├── dto/              → Objetos de transferencia de datos (DTOs)
    │   ├── entity/           → Entidades JPA que representan tablas de la BD
    │   └── service/          → Define los contratos de negocio que orquestan la lógica entre controladores y DAOs o entidades
    │       ├── impl/         → Implementaciones concretas de servicios
    │       └── mediator/     → Coordinadores de lógica de negocio compleja
    └── util/                 → Funciones utilitarias (fechas, validaciones, etc.)
```

### ▶️ Ejecución del proyecto backend

1. Clonar el repositorio
3. Ejecutar:
   ```bash
   ./mvnw spring-boot:run
   ```
---

## 🌐 Frontend (Angular + PrimeNG)

**Framework:** Angular 19  
**Template UI:** PrimeNG 19

### 📁 Estructura del proyecto

```
src/app/
├── layout/                  → Componentes comunes del diseño (header, sidebar, etc.)
├── guards/                  → Guards para proteger rutas (auth, roles, etc.)
├── interceptors/            → Interceptores HTTP (tokens, logs, manejo de errores)
├── models/                  → Interfaces y clases TypeScript
├── pages/                   → Páginas por funcionalidades
│   ├── auth-user/           → Selección del usuario de trabajo
│   ├── dashboard/           → Página principal del sistema
│   └── management/          → Funcionalidades de gestión
│       └── productos/       → Gestión de productos / mercancia
│   └── not-found/           → Página 404
├── pipes/                   → Pipes personalizados
├── services/                → Servicios para interactuar con APIs
├── shared-components/       → Componentes reutilizables
├── store/                   → Manejo de estados globales
└── assets/                  → Imágenes, fuentes, y otros recursos estáticos
```

### ▶️ Ejecución del proyecto frontend

1. Instalar dependencias:
   ```bash
   npm install
   ```

2. Levantar servidor de desarrollo:
   ```bash
   npm start
   ```

   Accede al navegador: `http://localhost:4200/`



### ▶️ Algunas vistas frontend
**MERCANCIAS**

![image](https://github.com/user-attachments/assets/023719b2-d63c-4a8f-b934-4698295e8376)



**DASHBOARD**

![image](https://github.com/user-attachments/assets/6c059d26-e808-425e-b8f0-ccd87ad85d7d)

