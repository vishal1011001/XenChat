import { FileContent } from "./FileContent";

export function HeaderBar({ displayName, displayPfpUid, setSelectedWindow }) {
    const closeChat = () => {
        setSelectedWindow('mount_utility_info');
    }

    return (
        <div className="h-15 w-[68.7vw] bg-slate-900 border-l border-white flex flex-row justify-between pl-6 gap-2 items-center z-2 fixed top-0" >
            <div onClick={() => setSelectedWindow('chat_metadata')}
                className="flex items-center gap-3 max-w-100"
            >
                {displayPfpUid ? (
                    <FileContent file_uid={displayPfpUid} className={'h-9 rounded-full'} />
                ) : (
                    <img src="/icons/default-pfp.svg" className="h-10 rounded-full" />
                )}
                <h2 className="text-2xl text-white font-semibold">{displayName}</h2>
            </div>
            <button onClick={closeChat} className="text-md text-gray-300 p-2 mr-3 font-mono hover:bg-slate-800 rounded">CLOSE</button>
        </div>
    );
}