# DEV VERSION
# FROM node:20

# WORKDIR /app

# COPY package*.json ./
# COPY prisma ./prisma/


# RUN npm install -g npm@latest
# RUN npm install

# COPY . .

# CMD ["/bin/sh", "-c","npx prisma db push && npm run start:dev" ]

# PROD VERSION
FROM node:20

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/


RUN npm install -g npm@latest
RUN npm install

COPY . .

RUN npm run build

CMD ["/bin/sh", "-c","npx prisma db push && npm run start:prod"]
