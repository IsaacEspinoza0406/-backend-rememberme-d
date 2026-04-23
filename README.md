# Backend - RememberMed 
Este repositorio contiene la API (parte lógica) del proyecto **RememberMed**, construida con Express, TypeScript, Prisma ORM y PostgreSQL.

## Resumen del Proyecto
Esta API es el núcleo de datos para la plataforma RememberMed, diseñada para facilitar la adherencia a tratamientos médicos. 
El backend maneja la autenticación segura, la creación y gestión de medicamentos, el cálculo automático de horarios de tomas, la sincronización entre perfiles de médicos y pacientes, y el procesamiento de alertas clínicas (rachas, adherencia y síntomas graves).

## Despliegue de la API
[Puedes agregar aquí la información sobre dónde está desplegada tu API en producción]

## Cómo correr el proyecto localmente

El proyecto está dockerizado para facilitar su ejecución y despliegue rápido.

### Prerrequisitos
- Tener instalado [Docker](https://www.docker.com/) y **Docker Compose**.

### Instrucciones

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/IsaacEspinoza0406/-backend-rememberme-d.git
   cd -backend-rememberme-d
   ```

2. **Configurar las variables de entorno:**
   Existe un archivo `.env.example` preconfigurado con las credenciales por defecto para Docker.
   Simplemente cópialo para crear tu `.env` local:
   ```bash
   cp .env.example .env
   ```

3. **Levantar los contenedores con Docker:**
   Usa Docker Compose para levantar en segundo plano tanto la base de datos PostgreSQL como la API.
   ```bash
   docker compose up -d --build
   ```

4. **Verificar la ejecución:**
   La API estará disponible localmente en:
    `http://localhost:3005`
   
   La base de datos (PostgreSQL) estará mapeada en tu puerto local `5433` con el usuario, contraseña y nombre de base de datos definidos en el `.env`.

### Comandos Útiles de Docker
- **Ver los logs de la API:** `docker compose logs -f api`
- **Detener los contenedores:** `docker compose down`
- **Reconstruir la API después de cambios:** `docker compose up -d --build api`
