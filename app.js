import express from 'express';

import * as loaderExpress from './loaders/express.js';
import * as loaderSocket from './loaders/socketio.js';

import * as serverSocket from './dist/socket.js';


async function startExpressServer() {
    const app = express();
  
    await loaderExpress.init(app);
  
    return app.listen(9023, err => {
        console.log(`[ + ] The server is running.`);
    });
}

async function startSocketServer(server) {
  
    let io = await loaderSocket.init(server);
    await serverSocket.socket(io)
}
    
  
let server = await startExpressServer();
let serverIo = await startSocketServer(server)
export { server }