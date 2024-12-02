FROM node:20 as build

WORKDIR /app

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm install

COPY . .

RUN npm run build

FROM node:20 as runner

WORKDIR /app

COPY --from=build /app/package*.json .
COPY --from=build /app/node_modules node_modules/
COPY --from=build /app/dist dist/

ENTRYPOINT [ "node", "dist/index.js" ]