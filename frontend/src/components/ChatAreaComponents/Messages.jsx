export function Messages({ messages }) {
    return (
        <div className="p-4 z-1 flex flex-col gap-1.5 **:overflow-y-auto scroll-auto pb-13 justify-end *:rounded-xl **:max-w-2xl **:flex **:flex-col">
            {messages.map((message) => (
                <div
                    className={message.sender_self ?
                        "bg-white p-2 place-self-end-safe" :
                        "bg-slate-800 p-2 text-white place-self-start"
                    }
                >
                    <div>
                        {message.content}
                    </div>
                    <div className="place-self-end-safe text-gray-400">
                        {message.time_stamp.substr(10, 6)}
                    </div>
                </div>
            ))}
        </div>
    );
} 