# First stage in the multi-stage build
FROM node:20 AS builder

# Create app directory -> All commands RUN / COPY are executed inside this directory
WORKDIR /app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
COPY prisma ./prisma/

# Install app dependencies
RUN npm install

COPY . .

RUN npm run build

# Second stage in the multi-stage build
FROM node:20

# Copy from builder image only files/folders needed to run the app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000
CMD [ "npm", "run", "start:prod" ]

# https://notiz.dev/blog/dockerizing-nestjs-with-prisma-and-postgresql
# https://notiz.dev/blog/prisma-migrate-deploy-with-docker