import { FilterButtons } from "./ChatsComponents/FilterButtons";
import { SearchBar } from "./ChatsComponents/SearchBar";


export function Chats({ conversations, setActiveConvUid }) {

    const changeActiveConvUid = (conv_uid) => {
        setActiveConvUid(conv_uid);
    }

    const chatsArr = [
        {
            uid: "123456",
            name: "Vishal Jakhar",
            last_message: "Hey! How are you?",
            pfp: "pfp1"
        },
        {
            uid: "123457",
            name: "Papa",
            last_message: "Good Morning",
            pfp: "pfp2"
        },
        {
            uid: "123458",
            name: "XenAi",
            last_message: "Hey there, Ready when you are.",
            pfp: "pfp3"
        }
    ];


    return (
        <div className="h-screen w-[35vw] bg-slate-900 flex flex-col">
            <div className="p-4 pl-6 w-[28vw] flex flex-row justify-between items-center">
                <h2 className="text-2xl text-white font-bold">XenChat</h2>
                <button className="text-white rounded-full p-1 hover:bg-slate-700"><img src='/more.png' className="h-8 invert-100" /></button>
            </div>

            <SearchBar />

            <FilterButtons />

            <div className="overflow-y-scroll  scroll scroll-auto scrollbar-none">
                <div className="p-2 pt-0 flex flex-col gap-2">
                    {conversations.map((chat) => (
                        <div key={chat.conv_uid}
                            onClick={() => changeActiveConvUid(chat.conv_uid)}
                            className="flex flex-row pl-3 p-2 hover:bg-slate-700 rounded-xl mr-4">
                            <img src={`/pfp1.png`} className="h-10 rounded-full self-center" />
                            <div>
                                <p className="text-xl text-white font-bold pl-4">@{chat.member_usernames.join(', @')}</p>
                                <p className="text-gray-400 pl-4 line-clamp-1">{chat.last_message}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}