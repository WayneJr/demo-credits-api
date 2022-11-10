FROM node:lts AS BUILD_IMAGE

# Work Directory
WORKDIR /usr/src/app

COPY package*.json ./

ENV PATH /usr/src/app/node_modules/.bin:$PATH

# Install Dependencies
RUN npm i

COPY . .

# compile application
RUN npm run prebuild
RUN npm run build

# remove development dependencies
RUN npm prune --production

# ------------------------ SECOND IMAGE ------------------------

FROM node:lts

# Work Directory
WORKDIR /usr/src/app

COPY --from=BUILD_IMAGE /usr/src/app .
ENV ext=js
ENV PORT=8080



EXPOSE 8080

CMD [ "npm", "run", "start:prod" ]