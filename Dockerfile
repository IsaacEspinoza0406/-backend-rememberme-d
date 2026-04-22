# Etapa de construcción
FROM node:20-slim AS builder

# Instalar OpenSSL para que Prisma pueda conectarse a la BD
RUN apt-get update -y && apt-get install -y openssl

WORKDIR /app

# Copiar configuración de dependencias
COPY package.json package-lock.json* ./
COPY prisma ./prisma/

# Instalar dependencias
RUN npm install

# Generar cliente prisma
RUN npx prisma generate

# Copiar código fuente y compilar
COPY . .
RUN npm run build

# Etapa de producción
FROM node:20-slim

# Instalar OpenSSL también en la etapa final
RUN apt-get update -y && apt-get install -y openssl

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

EXPOSE 3001

# Iniciar aplicación generada
CMD ["npm", "start"]