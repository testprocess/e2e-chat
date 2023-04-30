import React, { useEffect, useState } from "react";
const socket = io("/chats");
const randomUserName = Math.random() 

function ChatBox() {
    const [UUID, setUUID] = useState('')
    const [messageLists, setMessageLists] = useState([])

    useEffect(() => {
        const uuidFromPath = location.pathname.split("/")[location.pathname.split("/").length-1]
        setUUID(uuidFromPath)
        socket.emit('join', {
            uuid: uuidFromPath
        })
    }, [])

    socket.on("receive", (data) => {
        console.log("receive", data)
        const chatObject = {
            key: Math.random(),
            message: data.message,
            userName: data.userName
        }
        setMessageLists([...messageLists, chatObject])
    })

    const mapMessages = messageLists.map((element) => {
        return <ChatMessage userName={element.userName} message={element.message}></ChatMessage>
    })


    return (
        <div className="m-3">
            {UUID}
            {mapMessages}
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
            message: message,
            userName: randomUserName
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

function ChatMessage({ userName, message }) {
    if (userName == randomUserName) {
        return (
            <div className="d-flex flex-row-reverse ">
                <span className="bg-dark text-light p-2 text-end rounded">
                    {message}
                </span>
            </div>

        );
    }

    return (
        <div className="d-flex flex-row ">
            <span className="bg-light p-2 text-end rounded">
                {userName} : {message}
            </span>
        </div>

    );
}

export { ChatBox }