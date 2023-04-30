
export async function socket (io) {
    const chatNamespace = io.of("/chats");

    chatNamespace.on("connection", (socket) => {
        socket.on("join", (data) => {
            console.log("Join", data.uuid)
            socket.join(data.uuid);
        })


        socket.on("send", (data) => {
            console.log(data.uuid, data.message)
            io.of('/chats').to(data.uuid).emit("receive", { message: data.message, userName: data.userName });
        })
    });

}