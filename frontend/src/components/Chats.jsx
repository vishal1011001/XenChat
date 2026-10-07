import { useEffect, useState } from "react";
import { FilterButtons } from "./ChatsComponents/FilterButtons";
import { SearchBar } from "./ChatsComponents/SearchBar";
import { ChatRow } from "./ChatsComponents/ChatRow";


export function Chats({ conversations, setConversations, activeConvUid, setActiveConvUid, setIsChatOpen, isChatsLoading }) {
    const currUserUid = JSON.parse(localStorage.getItem('xen_user_data'))?.user_uid || '';

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

        const sorted = [...conversations].sort((a, b) => {
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
                    {isChatsLoading && (
                        <div className="flex text-white text-xl gap-1.5 place-self-center">
                            Loading Chats <div className="h-6 w-6 animate-spin rounded-full border-3 border-slate-400 border-t-slate-700 border-b-slate-700"></div>
                        </div>
                    )}
                    {convToDisplay.map((chat) => {
                        const lastMsgSenderUid = chat.last_message?.sender_uid;
                        const lastMsgConvUid = chat.last_message?.conv_uid;
                        const lastMsgSentAt = chat.last_message?.sent_at;
                        const currUserLastReadAt = chat.members?.find(mem => mem.user_uid === currUserUid)?.last_read_at;

                        return (
                            <ChatRow
                                key={chat.conv_uid}
                                chat={chat}
                                currUserUid={currUserUid}
                                lastMsgSentAt={lastMsgSentAt}
                                currUserLastReadAt={currUserLastReadAt}
                                lastMsgSenderUid={lastMsgSenderUid}
                                lastMsgConvUid={lastMsgConvUid}
                                activeConvUid={activeConvUid}
                                onOpen={() => { changeActiveConvUid(chat.conv_uid) }}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
}