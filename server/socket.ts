import { client } from './databases/redis.js'

export async function socket (io) {
    const chatNamespace = io.of("/chats");

    chatNamespace.on("connection", (socket) => {
        socket.on("join", async (data) => {
            console.log("Join", data.uuid)
            socket.join(data.uuid);

            const messages = await client.lRange(`chat_${data.uuid}`, 0, -1)
            const result = messages.map((item) => JSON.parse(item))
            socket.emit("receive", {chats: result.reverse()});
        })


        socket.on("send", (data) => {
            console.log(data.uuid, data.message)
            client.lPush(`chat_${data.uuid}`, JSON.stringify(data))
            io.of('/chats').to(data.uuid).emit("receive", {chats: [{ message: data.message, userName: data.userName }]});
        })
    });

}