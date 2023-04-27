FROM node:18.14.0-alpine
RUN npm install -g pnpm
WORKDIR /app
COPY . .
RUN npm i
CMD ["npm", "start"]
