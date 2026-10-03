import { useEffect, useState } from "react";
import { FilterButtons } from "./ChatsComponents/FilterButtons";
import { SearchBar } from "./ChatsComponents/SearchBar";
import { ChatRow } from "./ChatsComponents/ChatRow";


export function Chats({ conversations, setConversations, setActiveConvUid, setIsChatOpen }) {
    const currUsername = JSON.parse(localStorage.getItem('xen_user_data'))?.username || '';

    const changeActiveConvUid = (conv_uid) => {
        setActiveConvUid(conv_uid);
        setIsChatOpen(true);
    }

    const [convToDisplay, setConvToDisplay] = useState(conversations);
    useEffect(() => {
        setConvToDisplay(conversations);
    }, [conversations]);

    useEffect(() => {
        if (!conversations || conversations.length === 0) return;

        const sorted = [...conversations].sort((a,b) => {
            const ta = a?.last_message?.sent_at ? new Date(a.last_message.sent_at) : new Date(0);
            const tb = b?.last_message?.sent_at ? new Date(b.last_message.sent_at) : new Date(0);
            return tb - ta;
        });

        const sameOrder = 
            sorted.length === conversations.length &&
            sorted.every((c, i) => c.conv_uid === conversations[i].conv_uid);

        if (!sameOrder) setConversations(sorted);
    }, [conversations]);

    return (
        <div className="h-screen w-[35vw] bg-slate-950 flex flex-col">
            <div className="p-4 pl-6 w-[28vw] flex flex-row justify-between items-center">
                <h2 className="text-2xl text-white font-bold">XenChat</h2>
                <button className="text-white rounded-full p-1 hover:bg-slate-700"><img src='/more.png' className="h-8 invert-100" /></button>
            </div>

            <SearchBar conversations={conversations} setConvToDisplay={setConvToDisplay} />

            <FilterButtons />

            <div className="overflow-y-scroll  scroll scroll-auto scrollbar-none">
                <div className="p-2 pt-0 flex flex-col gap-2">
                    {convToDisplay.map((chat) => {
                        const lastMsgSentAt = chat.last_message?.sent_at;
                        const currUserLastReadAt = chat.members.find(mem => mem.username === currUsername).last_read_at;

                        return (
                            <ChatRow
                                key={chat.conv_uid}
                                chat={chat}
                                currUsername={currUsername}
                                lastMsgSentAt={lastMsgSentAt}
                                currUserLastReadAt={currUserLastReadAt}
                                onOpen={() => {changeActiveConvUid(chat.conv_uid)}}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
}