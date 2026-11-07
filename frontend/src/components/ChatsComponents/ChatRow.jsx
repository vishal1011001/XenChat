import { useState, useEffect } from "react";
import { FileContent } from "../ChatAreaComponents/FileContent";

export function ChatRow({ chat, currUserUid, lastMsgSentAt, currUserLastReadAt, lastMsgSenderUid, lastMsgConvUid, activeConvUid, onOpen }) {
    const [isRead, setIsRead] = useState(false);

    useEffect(() => {
        const lastMsgTime = lastMsgSentAt ? new Date(lastMsgSentAt) : 0;
        const currUserLastReadTime = currUserLastReadAt ? new Date(currUserLastReadAt) : 0;

        setIsRead(lastMsgTime > currUserLastReadTime);
    }, [lastMsgSentAt, currUserLastReadAt]);

    const otherUser = chat?.members?.find(member => member.user_uid !== currUserUid);

    return (
        <div key={chat.conv_uid}
            onClick={onOpen}
            className={`flex flex-row pl-3 p-2 hover:bg-slate-900 rounded-xl mr-4 transition duration-200
                        ${chat.conv_uid === activeConvUid && 'bg-linear-60 from-slate-900 via-slate-900 to-slate-950 border shadow shadow-pink-900 transition duration-300 border-pink-800'}`}
        >
            {chat.conv_metadata.conv_type === 'dm' && otherUser?.pfp_file_uid ? (
                <FileContent file_uid={otherUser?.pfp_file_uid} className={'h-10 rounded-full self-center'} />
            ) : (
                <img src={`/icons/default-pfp.svg`} className="h-10 rounded-full self-center" />
            )}
            <div className="flex flow-row items-center w-full justify-between">
                <div className="flex flex-col">
                    <p className="text-xl text-white font-bold pl-4">{(chat?.conv_metadata?.conv_type === 'group') ? chat?.conv_metadata?.conv_name : chat?.members?.find(mem => mem.user_uid !== currUserUid)?.username}</p>
                    <p className="text-gray-400 pl-4 line-clamp-1">{chat?.last_message?.content}</p>
                </div>
                {(lastMsgConvUid != activeConvUid) && (lastMsgSenderUid != currUserUid) && (isRead) && (
                    <img src='/icons/notification.svg' className="h-6" />
                )}
            </div>
        </div>
    );
}