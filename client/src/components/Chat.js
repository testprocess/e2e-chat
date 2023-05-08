import React, { useEffect, useRef, useState } from "react";
import { rsaUtil } from '../utils/rsa.js'
import { default as axios } from 'axios';



function ChatBox() {
    const getUserName = () => {
        let token = Cookies.get("user")
        try {
            let decoded = JSON.parse(atob(token.split('.')[1]));
            return decoded.user_id
        } catch (error) {
            return 'Any'
        }
    }

    const [UUID, setUUID] = useState('')
    const [userName, setUserName] = useState(getUserName())
    const [messageLists, setMessageLists] = useState([])

    const called = useRef(false)

    const socket = io("/chats", {
        auth: {
            token: Cookies.get("user")
        }
    });
    

    const thisGroupUUID = location.pathname.split("/")[location.pathname.split("/").length-1]

    useEffect(() => {
        if (called.current) {
            return
        }

        setUUID(thisGroupUUID)
        console.log(userName)

        socket.emit('join', {
            uuid: thisGroupUUID
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


        setMessageLists(current => [...current, ...lists])

        scrollToBottom()
    })

    socket.on("receiveKey", async (data) => {
        if (data.userId != userName) {
            return 0
        }

        const getPrivateKey = localStorage.getItem(`rsa_${userName}`)
        const decrypted = await rsaUtil.decrypt({ privateKey: getPrivateKey, encrypted: data.key })

        localStorage.setItem(`groupkey_${thisGroupUUID}`, decrypted)
    })

    

    socket.on("reqKey", async (data) => {
        const getKey = localStorage.getItem(`groupkey_${thisGroupUUID}`)
        if (getKey == null || data.userId == userName) {
            return 0
        }

        const getUser = await getUserInfomation({ userId: data.userId })
        const userPublicKey = getUser.data.publicKey
        const encryptedKey = await rsaUtil.encrypt({ publicKey: userPublicKey, message: getKey })

        console.log("reqKey")

        socket.emit('sendKey', {
            socketId: data.socketId,
            uuid: thisGroupUUID,
            userId: data.userId,
            key: encryptedKey
        })

    })


    const getUserInfomation = async ({ userId }) => {
        const result = new Promise((resolve, reject) => {
            axios({
                method: 'get',
                url: `/api/users/${userId}`,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded', 
                    "x-access-token": Cookies.get("user")
                }
            })
            .then((response) => {
                let data = response.data
                resolve(data)
            });
        })

        return result
    }



    const decryptMessage = ({ encrypted }) => {
        try {
            const secret = localStorage.getItem(`groupkey_${thisGroupUUID}`);
            const message = CryptoJS.AES.decrypt(encrypted, secret, {
                padding: CryptoJS.pad.Pkcs7,
                mode: CryptoJS.mode.CBC
            }).toString(CryptoJS.enc.Utf8);
    
            return message
        } catch (error) {
            return ''
        }
    }

    const scrollToBottom = () => {
        window.scrollTo(0, document.body.scrollHeight);
    }

    const mapMessages = messageLists.map((element) => {
        let message = decryptMessage({ encrypted: element.message })
        return <ChatMessage chatUserName={element.userName} userName={userName} message={message}></ChatMessage>
    })




    return (
        <div className="m-3 padding-chat">
            {UUID}
            {mapMessages}
            <ChatInput socket={socket} userName={userName} uuid={UUID}></ChatInput>
        </div>
    );
}


function ChatInput(props) {
    const [message, setMessage] = useState('')

    const handleMessage = (e) => {
        setMessage(e.target.value)
    }

    const encryptMessage = (message) => {
        const secret = localStorage.getItem(`groupkey_${props.uuid}`);
        const encrypted = CryptoJS.AES.encrypt(message, secret).toString();
        return encrypted
    }

    const sendMessage = () => {
        props.socket.emit('send', {
            uuid: props.uuid,
            message: encryptMessage(message),
            userName: props.userName
        })

        setMessage('')
    }

    const handleKeyDown = (e) => {
        if(e.key === 'Enter'){
            sendMessage()
        }
    }

    return (
        <div className="input-group fixed-bottom p-3">
            <input type="text" className="form-control" value={message} onChange={handleMessage} onKeyDown={handleKeyDown} />
            <button type="button" className="btn btn-light" onClick={sendMessage}><span className="material-symbols-outlined icon-sm">send</span></button>
        </div>
    )
    
}


function ChatMessage({ chatUserName, userName, message }) {
    if (chatUserName == userName) {
        return (
            <div className="d-flex flex-row-reverse mb-1">
                <span className="bg-dark text-light p-2 text-end rounded">
                    {message}
                </span>
            </div>

        );
    }

    return (
        <div className="d-flex flex-row mb-1">
            <span className="bg-light p-2 text-end rounded">
                {chatUserName} : {message}
            </span>
        </div>

    );
}

export { ChatBox }