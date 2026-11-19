import { FileContent } from "./ChatAreaComponents/FileContent";
import { MembersList } from "./ChatMetadataComponents/MembersList";
import { OptionsMenu } from "./ChatMetadataComponents/OptionsMenu";
import { getConvMetadata, getDisplayName, getDisplayPfpUid, getAbout } from "./utils/utilityFunctions";

export function ChatMetadata({ API_URL, setSelectedWindow, setIsChatOpen, conversations, activeConvUid }) {
    const currUserData = JSON.parse(localStorage.getItem('xen_user_data'));

    const closeChatMetadata = () => {
        setSelectedWindow('chat_area');
    }

    const convMetadata = getConvMetadata(conversations, activeConvUid);
    const username = getDisplayName(convMetadata, currUserData.user_uid);
    const displayPfpUid = getDisplayPfpUid(convMetadata, currUserData.user_uid);
    const about = getAbout(convMetadata, currUserData.user_uid);
    const isGC = convMetadata?.conv_metadata?.conv_type === 'group';
    const members = convMetadata?.members;

    return (
        <div className="h-screen bg-slate-900 w-full flex flex-col items-center p-4 overflow-scroll scrollbar-none scroll-auto scroll">
            <div className="w-full flex items-center gap-2">
                <button
                    onClick={closeChatMetadata}
                    className="p-2 rounded-4xl hover:bg-slate-700"
                ><img src='/icons/previous.svg' className="h-5 invert-100" /></button>
                <h3
                    className="text-white text-xl "
                >Chat Info</h3>
            </div>

            <div>
                {displayPfpUid ? (
                    <FileContent file_uid={displayPfpUid} className={"h-50 rounded-full"} />
                ) : (
                    <img src='/icons/default-pfp.svg' className="h-50" />
                )}
            </div>

            <div className="py-3">
                <h2 className="text-white text-3xl font-bold">@{username}</h2>
            </div>

            {!isGC && (
                <div className="flex items-center place-self-center rounded-full bg-slate-800 p-2 text-white">
                    <p className={`text-lg ${!about && 'text-gray-400'}`}>{about || 'About not set by the user'}</p>
                </div>
            )}

            {isGC && (
                <MembersList members={members} />
            )}

            <div className="w-full p-2 pt-4">
                <h3 className="text-xl text-white mb-1">Shared Media & Links</h3>
                <div className="h-25 bg-slate-400 rounded-md">

                </div>
            </div>

            <div className="p-2 pt-4 flex flex-col w-full">
                <h3 className="text-white text-xl w-full pb-2">Options:</h3>
                <OptionsMenu API_URL={API_URL} username={username} activeConvUid={activeConvUid} setSelectedWindow={setSelectedWindow} setIsChatOpen={setIsChatOpen} />
            </div>

        </div>
    );
}