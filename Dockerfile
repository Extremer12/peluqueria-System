# Usar Node.js oficial
FROM node:18-alpine

# Establecer directorio de trabajo
WORKDIR /app

# Copiar package.json del servidor
COPY server/package*.json ./

# Instalar dependencias
RUN npm install

# Copiar código del servidor
COPY server/ ./

# Exponer puerto
EXPOSE 3001

# Comando de inicio
CMD ["npm", "start"]