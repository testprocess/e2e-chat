import React from "react";


function ChatPage() {

    return (
        <div>
            <ChatInput></ChatInput>

        </div>
    );
}

function ChatInput() {

    return (
        <div class="input-group fixed-bottom p-3">
            <input type="text" class="form-control" />
            <button type="button" class="btn btn-light"><span class="material-symbols-outlined icon-sm">send</span></button>
        </div>
    )
    
}
  
export default ChatPage;