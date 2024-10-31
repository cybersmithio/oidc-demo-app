FROM node:18
#FROM node:18-alpine3.20

WORKDIR /usr/src/app
RUN apt-get -y update && apt-get -y upgrade
# RUN mkdir src dist

WORKDIR /usr/src/app
COPY public/ ./public/
COPY server/ ./server/
COPY views/ ./views/
COPY package.json ./

# COPY dist/ ./dist/
#COPY package*.json ./
#COPY tsconfig.json ./
#COPY webpack.config.js ./
#COPY babel*.config.js ./
#COPY .env ./
#COPY .env.dev ./

#RUN npm install && npm run clean && npm run build
RUN npm install
#RUN npx webpack --config webpack.server.js --mode=development
#RUN export NODE_OPTIONS=--openssl-legacy-provider && \
#    npm run build

#RUN npm run clean
#RUN npm run build
# COPY . ./
# RUN rm src/config.js src/config/config.js

#RUN ln -s /usr/bin/python3 /usr/bin/python

EXPOSE 3000

CMD [ "npm","start"]
