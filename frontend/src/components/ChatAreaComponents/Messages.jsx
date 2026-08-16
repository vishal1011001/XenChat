import { useEffect, useRef } from "react";

export function Messages({ messagesToDisplay, currUserUid }) {
    const messagesEndRef = useRef(null);
    
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({behavior: "smooth"});
    }

    useEffect(() => {
        scrollToBottom();
    }, [messagesToDisplay])

    return (
        <div className="p-4 z-1 flex flex-col gap-1.5 **:overflow-y-auto scroll-auto pb-13 justify-end *:rounded-xl **:max-w-2xl **:flex **:flex-col">
            {messagesToDisplay.map((message) => (
                <div key={message.message_uid}
                    className={(message.sender_uid === currUserUid) ?
                        "bg-white p-2 place-self-end-safe" :
                        "bg-slate-800 p-2 text-white place-self-start"
                    }
                >
                    <div>
                        {message.content}
                    </div>
                    <div className="place-self-end-safe text-gray-400">
                        {message.sent_at?.substr(11, 5)}
                    </div>
                </div>
            ))}
            <div ref={messagesEndRef}/>
        </div>
    );
} 