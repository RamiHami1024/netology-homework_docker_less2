FROM node

WORKDIR /app

ARG NODE_ENV=production
COPY ./package*.json ./
RUN npm install
COPY ./ /app

CMD ["npm", "start"]