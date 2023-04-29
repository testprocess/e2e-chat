
export async function socket (io) {
    io.on("connection", (socket) => {

        //socket.emit("connected", player)

        socket.on("init", (data) => {
            console.log(data)
        })

    });
}