import { useEffect, useRef, useState } from "react";

export function Messages({ sendMessage, activeConvUid, messagesToDisplay, currUserUid }) {
    const messagesEndRef = useRef(null);
    
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({behavior: "smooth"});
    }

    useEffect(() => {
        scrollToBottom();
    }, [messagesToDisplay])

    const [msgOptionsOpen, setMsgOptionsOpen] = useState(false);
    const [selectedMessageUid, setSelectedMessageUid] = useState('');
    const selectMessage = (msgUid) => {
        setSelectedMessageUid(msgUid);
        if (msgUid === selectedMessageUid) {
            setMsgOptionsOpen(false);
            setSelectedMessageUid('');
        } else {
            setMsgOptionsOpen(true);
        }
    }

    const deleteMessage = () => {
        sendMessage({
            req: 'delete_msg',
            conv_uid: activeConvUid,
            message_uid: selectedMessageUid
        })
    }

    return (
        <div className="p-4 z-1 flex flex-col gap-1.5 **:overflow-y-auto scroll-auto pb-13 justify-end *:rounded-xl **:max-w-2xl **:flex **:flex-col">
            {messagesToDisplay.map((message) => (
                <div key={message.message_uid}
                    className={(message.sender_uid === currUserUid) ?
                        "bg-white p-2 place-self-end-safe min-w-40 relative group" :
                        "bg-slate-800 p-2 text-white place-self-start min-w-40 relative group"
                    }
                >
                    <div>
                        {message.content}
                    </div>
                    <div className="place-self-end-safe text-gray-400">
                        <p>{message.sent_at?.substr(11, 5)}</p>
                    </div>
                    <button 
                        onClick={() => selectMessage(message.message_uid)}
                        className="absolute right-2 top-0 opacity-0 group-hover:opacity-80"
                    >v</button>
                    {(msgOptionsOpen && message.message_uid === selectedMessageUid && message.sender_uid === currUserUid) && (
                        <div className="absolute bg-gray-600 text-white p-1 rounded right-1 bottom-1">
                            <button 
                                onClick={deleteMessage}
                                className=""
                            >Delete</button>
                        </div>
                    )}
                </div>
            ))}
            <div ref={messagesEndRef}/>
        </div>
    );
} 