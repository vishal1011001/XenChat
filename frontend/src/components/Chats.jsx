

export function Chats() {

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
            name: "Vishal Jakhar",
            last_message: "Heisenberg was a great scientist from Germany",
            pfp: "pfp1"
        }
    ]
    return (
        <div className="h-screen w-[30vw] bg-slate-600 ">
            <div className="p-4">
                <h2 className="text-2xl text-white font-bold">XenChat</h2>
            </div>
            
            <div className="p-2.5 flex flex-col gap-1">
                {chatsArr.map((chat) => (
                    <div key={chat.uid} className="flex flex-row pl-3 p-1 hover:bg-gray-500 rounded-xl mr-4">
                        <img src={`/${chat.pfp}.png`} className="h-10 rounded rounded-full self-center" />
                        <div>
                            <p className="text-xl text-white font-bold pl-4">{chat.name}</p>
                            <p className="text-gray-200 pl-4 line-clamp-1">{chat.last_message}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}