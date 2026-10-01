import { HeaderBar } from "./ChatAreaComponents/HeaderBar";
import { MessageCompose } from "./ChatAreaComponents/MessageCompose";
import { Messages } from "./ChatAreaComponents/Messages";
import { useWebSocket } from "../hooks/useWebSocket";
import { useEffect, useState } from "react";

export function ChatArea({ sendMessage, currUserUid, messages, activeConvUid, setIsChatMetadataOpen, conversations }) {
    const [wantToEdit, setWantToEdit] = useState(false);
    const [messageUidToEdit, setMessageUidToEdit] = useState('');

    const [text, setText] = useState('');

    return (
        <div className="h-screen bg-[url('/chat-bg.jpg')] bg-cover bg-fixed w-full flex flex-col justify-between pb-2 pt-15 overflow-scroll scrollbar-none scroll-auto scroll">
            <div onClick={() => {setIsChatMetadataOpen(true)}}>
                <HeaderBar conversations={conversations} activeConvUid={activeConvUid} currUserUid={currUserUid}/>
            </div>

            <div className="bg-slate-900 mt-5 w-100 place-self-center p-3 rounded text-center">
                <p className="text-white">
                    {`This is the start of your conversation with @.
                    Messages are end-to-end Ecrypted 🔒`}
                </p>
            </div>

            <Messages sendMessage={sendMessage} activeConvUid={activeConvUid} messages={messages} currUserUid={currUserUid} setWantToEdit={setWantToEdit} setMessageUidToEdit={setMessageUidToEdit} setText={setText} conversations={conversations}/>
            
            <MessageCompose text={text} setText={setText} sendMessage={sendMessage} currUserUid={currUserUid} activeConvUid={activeConvUid} wantToEdit={wantToEdit} setWantToEdit={setWantToEdit} messageUidToEdit={messageUidToEdit}/>
        </div>
    );
}