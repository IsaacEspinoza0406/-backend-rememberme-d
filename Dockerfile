# Etapa de construcción
FROM node:20-alpine AS builder

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
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

EXPOSE 3001

# Iniciar aplicación generada
CMD ["npm", "start"]
