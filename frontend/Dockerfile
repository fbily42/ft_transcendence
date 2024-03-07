# # DEV VERSION
# FROM node:20

# # Create and define the node_modules's cache directory.
# WORKDIR /cache

# # install app dependencies
# COPY package*.json ./

# RUN npm install -g npm@latest
# RUN npm install

# #set working directory
# WORKDIR /app

# # copy source code
# COPY . .

# # add `/app/node_modules/.bin` to $PATH
# ENV PATH /app/node_modules/.bin:$PATH

# EXPOSE 3000


# PROD VERSION
FROM node:latest

#set working directory
WORKDIR /app

# install app dependencies
COPY package*.json ./

RUN npm install -g npm@latest
RUN npm install

# copy source code
COPY . .

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

EXPOSE 3000

CMD ["/bin/sh", "-c","npm run build && npm run preview"]