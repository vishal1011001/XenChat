import { useState, useEffect } from "react";

export function ChatRow({ chat, currUserUid, lastMsgSentAt, currUserLastReadAt, lastMsgSenderUid, lastMsgConvUid, activeConvUid, onOpen }) {
    const [isRead, setIsRead] = useState(false);

    useEffect(() => {
        const lastMsgTime = lastMsgSentAt ? new Date(lastMsgSentAt) : 0;
        const currUserLastReadTime = currUserLastReadAt ? new Date(currUserLastReadAt) : 0;

        setIsRead(lastMsgTime > currUserLastReadTime);
    }, [lastMsgSentAt, currUserLastReadAt]);

    return (
        <div key={chat.conv_uid}
            onClick={onOpen}
            className="flex flex-row pl-3 p-2 hover:bg-slate-900 rounded-xl mr-4"
        >
            <img src={`/default-pfp.png`} className="h-10 rounded-full self-center" />
            <div className="flex flow-row items-center w-full justify-between">
                <div className="flex flex-col">
                    <p className="text-xl text-white font-bold pl-4">{(chat?.conv_metadata?.conv_type === 'group') ? chat?.conv_metadata?.conv_name : chat?.members?.find(mem => mem.user_uid !== currUserUid)?.username}</p>
                    <p className="text-gray-400 pl-4 line-clamp-1">{chat?.last_message?.content}</p>
                </div>
                {(lastMsgConvUid != activeConvUid) && (lastMsgSenderUid != currUserUid) && (isRead) && (
                    <img src='/notification.png' className="h-6" />
                )}
            </div>
        </div>
    );
}