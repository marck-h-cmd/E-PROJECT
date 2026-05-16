# Etapa de desarrollo
FROM node:20-alpine AS development

WORKDIR /app

# Instalar dependencias necesarias para Prisma y Puppeteer
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    openssl \
    ttf-freefont \
    python3 \
    make \
    g++ \
    git

# Configurar Puppeteer
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Copiar archivos de configuración
COPY package*.json ./
COPY tsconfig.json ./
COPY next.config.js ./
COPY tailwind.config.ts ./
COPY postcss.config.js ./
COPY .eslintrc.json ./
COPY .prettierrc ./

# Instalar dependencias
RUN npm install

# Generar Prisma Client
COPY prisma ./prisma
RUN npx prisma generate

# Copiar el resto del código
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]

# Etapa de producción
FROM node:20-alpine AS production

WORKDIR /app

# Instalar chromium para puppeteer
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    openssl \
    ttf-freefont

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY package*.json ./
RUN npm install --omit=dev

COPY . .
RUN npx prisma generate
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
