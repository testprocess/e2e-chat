import React, { useEffect, useState } from "react";


const socket = io("/chats");




function ChatPage() {
    const [UUID, setUUID] = useState('')

    useEffect(() => {
        const uuidFromPath = location.pathname.split("/")[location.pathname.split("/").length-1]
        setUUID(uuidFromPath)
        socket.emit('join', {
            uuid: uuidFromPath
        })
    }, [])

    socket.on("receive", (data) => {
        console.log("receive", data)
    })

    return (
        <div>
            {UUID}
            <ChatInput uuid={UUID}></ChatInput>

        </div>
    );
}

function ChatInput(props) {
    const [message, setMessage] = useState('')

    const handleMessage = (e) => {
        setMessage(e.target.value)
    }

    const sendMessage = () => {
        console.log(props.uuid, message)
        socket.emit('send', {
            uuid: props.uuid,
            message: message
        })

        setMessage('')
    }

    const handleKeyDown = (e) => {
        if(e.key === 'Enter'){
            sendMessage()
        }
    }

    return (
        <div class="input-group fixed-bottom p-3">
            <input type="text" class="form-control" value={message} onChange={handleMessage} onKeyDown={handleKeyDown} />
            <button type="button" class="btn btn-light" onClick={sendMessage}><span class="material-symbols-outlined icon-sm">send</span></button>
        </div>
    )
    
}
  
export default ChatPage;