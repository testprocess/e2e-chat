import React, { useEffect, useRef, useState } from "react";
const socket = io("/chats", {
    auth: {
        token: Cookies.get("user")
    }
});

const getUserName = () => {
    let token = Cookies.get("user")
    try {
        let decoded = JSON.parse(atob(token.split('.')[1]));
        return decoded.user_id
    } catch (error) {
        return 'Any'
    }
}

const thisUserName = getUserName()

function ChatBox() {
    const [UUID, setUUID] = useState('')
    const [messageLists, setMessageLists] = useState([])
    const called = useRef(false)

    useEffect(() => {
        if (called.current) {
            return
        }
        const uuidFromPath = location.pathname.split("/")[location.pathname.split("/").length-1]
        setUUID(uuidFromPath)
        socket.emit('join', {
            uuid: uuidFromPath
        })

        called.current = true

        setTimeout(() => {
            scrollToBottom()
        }, 200);
    }, [])

    socket.on("receive", (data) => {
        let lists = []

        for (const key in data.chats) {
            if (Object.hasOwnProperty.call(data.chats, key)) {
                lists.push({
                    key: Math.random(),
                    message: data.chats[key].message,
                    userName: data.chats[key].userName
                })
            }
        }

        setMessageLists([...messageLists, ...lists])

        scrollToBottom()
    })

    const mapMessages = messageLists.map((element) => {
        return <ChatMessage userName={element.userName} message={element.message}></ChatMessage>
    })

    const scrollToBottom = () => {
        window.scrollTo(0, document.body.scrollHeight);

    }


    return (
        <div className="m-3 padding-chat">
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
            userName: thisUserName
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
    if (userName == thisUserName) {
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