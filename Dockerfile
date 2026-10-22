# ============================================================
# Practical 11 — Frontend Dockerfile (React + Vite)
# Multi-stage build for reduced final image size
# ============================================================

# ── Stage 1: Build the React app ────────────────────────
FROM node:18 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# ── Stage 2: Serve with Vite preview ────────────────────
FROM node:18-slim
WORKDIR /app
COPY --from=build /app ./
EXPOSE 5173
CMD ["npm", "run", "preview", "--", "--host"]
