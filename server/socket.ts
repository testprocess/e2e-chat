import { client } from './databases/redis.js'
import { groupUserModel } from './models/group.model.js';

import jwt from 'jsonwebtoken';
import data from './config/jwt.js';

let jwtSecret = data.secret;

export async function socket (io) {
    const chatNamespace = io.of("/chats");

    chatNamespace.use((socket, next) => {
        try {
            const token = socket.handshake.auth.token;

            if (!token) {
                return 0
            }
          
            let decoded = jwt.verify(token, jwtSecret);
            let userId = decoded.user_id;
            next()

        } catch (error) {
            return 0
        }
    });

    chatNamespace.on("connection", (socket) => {
        socket.on("join", async (data) => {
            console.log("==== Join ====", data.uuid)
            const token = socket.handshake.auth.token;
            const decoded = jwt.verify(token, jwtSecret);
            const userId = decoded.user_id;

            const isInGroup = await groupUserModel.select({
                groupUUID: data.uuid,
                userId: userId
            })

            if (isInGroup.status == 0) {
                return 0
            }

            socket.join(data.uuid);


            const messages = await client.lRange(`chat_${data.uuid}`, 0, -1)
            const result = messages.map((item) => JSON.parse(item))
            socket.emit("receive", {chats: result.reverse()});

            io.of('/chats').to(data.uuid).emit("reqKey", { userId: userId, socketId: socket.id });

        })


        socket.on("send", (data) => {
            //console.log(data.uuid, data.message)
            client.lPush(`chat_${data.uuid}`, JSON.stringify(data))
            io.of('/chats').to(data.uuid).emit("receive", {chats: [{ message: data.message, userName: data.userName }]});
        })

        socket.on("sendKey", (data) => {
            console.log(">> sendKey", data.userId)
            io.of('/chats').to(data.socketId).emit("receiveKey", { userId: data.userId, key: data.key });
        })

        
    });

}