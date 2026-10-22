# ============================================================
# Practical 11 — Backend Dockerfile (Node/Express API)
# ============================================================

FROM node:18

WORKDIR /app

# Install dependencies first (layer caching — deps rarely change)
COPY package*.json ./
RUN npm install

# Copy application source code
COPY . .

EXPOSE 5000

CMD ["node", "server.js"]
