import { useEffect, useState } from "react";
import { FilterButtons } from "./ChatsComponents/FilterButtons";
import { SearchBar } from "./ChatsComponents/SearchBar";


export function Chats({ conversations, setActiveConvUid, setIsChatOpen }) {
    
    const changeActiveConvUid = (conv_uid) => { 
        setActiveConvUid(conv_uid);
        setIsChatOpen(true);
    }

    const [convToDisplay, setConvToDisplay] = useState(conversations);

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
                    {convToDisplay.map((chat) => (
                        <div key={chat.conv_uid}
                            onClick={() => changeActiveConvUid(chat.conv_uid)}
                            className="flex flex-row pl-3 p-2 hover:bg-slate-900 rounded-xl mr-4">
                            <img src={`/pfp1.png`} className="h-10 rounded-full self-center" />
                            <div>
                                <p className="text-xl text-white font-bold pl-4">@{chat?.member_usernames?.join(', @')}</p>
                                <p className="text-gray-400 pl-4 line-clamp-1">{chat.last_message}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}