FROM node:18
WORKDIR /app 
COPY package*.json /app 
RUN npm install --global node-gyp
RUN npm install 
RUN npm install -g typescript
RUN npm install pm2 -g
COPY . /app 
RUN npm i -d @types/node
RUN tsc
RUN npm run bundle
CMD [ "pm2-runtime", "start", "npm", "--", "start" ] 
EXPOSE 9023