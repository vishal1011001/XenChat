import { OptionsMenu } from "./ChatMetadataComponents/OptionsMenu";

export function ChatMetadata({ API_URL, setIsChatMetadataOpen, setIsChatOpen, conversations, activeConvUid }) {
    const currUserData = JSON.parse(localStorage.getItem('xen_user_data'));
    
    const closeChatMetadata = () => {
        setIsChatMetadataOpen(false);
    }

    const openedConvData = conversations?.find(conv => conv.conv_uid === activeConvUid);
    const username = openedConvData?.members?.find(member => member.username != currUserData?.username)?.username;

    return (
        <div className="h-screen bg-slate-800 w-full flex flex-col items-center p-4 overflow-scroll scrollbar-none scroll-auto scroll">
            <div className="w-full flex items-center gap-2">
                <button
                    onClick={closeChatMetadata}
                    className="p-2 rounded-4xl hover:bg-slate-700"
                ><img src='/previous.png' className="h-5 invert-100" /></button>
                <h3
                    className="text-white text-xl "
                >Chat Info</h3>
            </div>

            <div>
                <img src='/default-pfp.png' className="h-50" />
            </div>

            <div>
                <h2 className="text-white text-3xl font-bold">@{username}</h2>
            </div>

            <div className="w-full p-2 pt-4">
                <h3 className="text-xl text-white mb-1">Shared Media & Links</h3>
                <div className="h-25 bg-slate-400 rounded-md">

                </div>
            </div>

            <div className="p-2 pt-4 flex flex-col w-full">
                <h3 className="text-white text-xl w-full pb-2">Options:</h3>
                <OptionsMenu API_URL={API_URL} username={username} activeConvUid={activeConvUid} setIsChatMetadataOpen={setIsChatMetadataOpen} setIsChatOpen={setIsChatOpen} />
            </div>

        </div>
    );
}