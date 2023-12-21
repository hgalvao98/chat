FROM node:18 as build-stage

WORKDIR /app

COPY package.json .
COPY package-lock.json .
RUN npm install

COPY src/ ./src

COPY . .

RUN npm run build

CMD ["npm", "start"]
