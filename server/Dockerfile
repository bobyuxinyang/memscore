FROM daocloud.io/library/node:8.4.0

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV
COPY package.json /usr/src/app/
RUN npm install -g cnpm --registry=https://registry.npm.taobao.org
RUN cnpm install && npm cache clean --force
COPY . /usr/src/app

EXPOSE 3000

CMD [ "npm", "run", "docker-start" ]