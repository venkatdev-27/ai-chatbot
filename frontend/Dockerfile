# -------- BUILD STAGE --------
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

# 👇 THIS LINE NEEDS THE FILE TO EXIST
COPY .env.production .env

COPY . .
RUN npm run build

# -------- PRODUCTION STAGE --------
FROM node:18-alpine

WORKDIR /app
RUN npm install -g serve

COPY --from=build /app/dist ./dist

EXPOSE 5173
CMD ["serve", "-s", "dist", "-l", "5173"]
