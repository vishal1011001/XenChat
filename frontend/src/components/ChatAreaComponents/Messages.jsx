import { useEffect, useRef, useState } from "react";
import { MessageOptions } from "./MessagesComponents/MessageOptions";

export function Messages({ sendMessage, activeConvUid, messages, currUserUid, setWantToEdit, setMessageUidToEdit, setText, conversations }) {
    const messagesEndRef = useRef(null);
    const [messagesToDisplay, setMessagesToDisplay] = useState([]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(() => {
        // Filter messages to display
        const messagesFiltered = messages.filter(message => message.conv_uid === activeConvUid);
        setMessagesToDisplay(messagesFiltered);
    }, [activeConvUid, messages]);

    useEffect(() => {
        scrollToBottom();
    }, [messagesToDisplay]);

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
                    ?.find(conv => conv.conv_uid === message.conv_uid)
                    ?.members.find(mem => mem.user_uid !== currUserUid);

                const isRead = new Date(message.sent_at) <= new Date(otherMember?.last_read_at);

                return (
                    <div key={message.message_uid}
                        className={(message.sender_uid === currUserUid) ?
                            "flex flex-col bg-white p-2 place-self-end-safe min-w-40 min-h-15 relative group overflow-visible!" :
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
                                <span aria-hidden="false" aria-label=" Read " className="x1rv0e52"><svg viewBox="0 0 24 24" width="16" preserveAspectRatio="xMidYMid meet" fill="currentColor"><title>wds-ic-read</title><path fill="blue" d="M14.73 6.01a1 1 0 0 1 1.41-.15l.01.01a1 1 0 0 1 .15 1.41L7.6 18.01a1 1 0 0 1-.73.37h-.05c-.26 0-.52-.11-.71-.3l-4.03-4.09a.99.99 0 0 1 0-1.41.99.99 0 0 1 1.41 0l3.25 3.29 7.99-9.86Zm5.71.12a1 1 0 0 1 1.41-.15h-.01a1 1 0 0 1 .15 1.41l-8.41 10.45a1 1 0 0 1-.73.37h-.05a1 1 0 0 1-.71-.3l-1.36-1.26a.55.55 0 0 1-.02-.81l.56-.68c.21-.2.53-.21.75-.03l.71.58 7.71-9.58Z"></path></svg></span>
                            )}
                        </div>

                        {message.sender_uid === currUserUid && (
                            <button
                                onClick={() => selectMessage(message.message_uid)}
                                className="absolute -left-7 self-center opacity-0 group-hover:opacity-100"
                            ><img src='/down-arrow.png' className="h-6 invert-100" /></button>
                        )}
                        {(msgOptionsOpen && message.message_uid === selectedMessageUid && message.sender_uid === currUserUid) && (
                            <MessageOptions message={message} deleteMessage={deleteMessage} changeEditingState={changeEditingState}/>
                        )}
                    </div>
                )
            })}
            <div ref={messagesEndRef} />
        </div>
    );
} 