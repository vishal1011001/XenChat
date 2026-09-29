import { useEffect, useRef, useState } from "react";

export function Messages({ sendMessage, activeConvUid, messagesToDisplay, currUserUid, setWantToEdit, setMessageUidToEdit, setText, conversations }) {
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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

    const changeEditingState = (uid, text) => {
        setWantToEdit(true);
        setMessageUidToEdit(uid);
        setText(text);

        setMsgOptionsOpen(false);
    }

    return (
        <div className="p-4 z-1 flex flex-col gap-1.5 **:overflow-y-auto scroll-auto pb-13 justify-end *:rounded-xl **:max-w-2xl **:flex **:flex-col">
            {messagesToDisplay.map((message) => {
                const otherMember = conversations
                    .find(conv => conv.conv_uid === message.conv_uid)
                    ?.members.find(mem => mem.user_uid !== currUserUid);

                const isRead = new Date(message.sent_at) <= new Date(otherMember.last_read_at);

                return (
                    <div key={message.message_uid}
                        className={(message.sender_uid === currUserUid) ?
                            "flex flex-col bg-white p-2 place-self-end-safe min-w-40 relative group" :
                            "flex flex-col bg-slate-800 p-2 text-white place-self-start min-w-40 relative group"
                        }
                    >
                        <div>
                            {message.content}
                        </div>
                        
                        {/* TIME STAMP & READ RECEIPT */}
                        <div className="flex flex-row! gap-1 text-xs justify-end-safe text-gray-500">
                            <span>{message.sent_at?.substr(11, 5)}</span>
                            {message.sender_uid === currUserUid && isRead && (
                                <span className="text-green-500">Seen</span>
                            )}
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
                                <button
                                    onClick={() => changeEditingState(message.message_uid, message.content)}
                                    className=""
                                >Edit</button>
                            </div>
                        )}
                    </div>
                )
            })}
            <div ref={messagesEndRef} />
        </div>
    );
} 