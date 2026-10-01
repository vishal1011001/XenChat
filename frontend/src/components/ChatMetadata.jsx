export function ChatMetadata({ setIsChatMetadataOpen, conversations, activeConvUid }) {
    const closeChatMetadata = () => {
        setIsChatMetadataOpen(false);
    }

    const openedConvData = conversations.find(conv => conv.conv_uid === activeConvUid);

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
                <h2 className="text-white text-3xl font-bold">@vishal</h2>
            </div>

            <div className="w-full p-2 pt-4">
                <h3 className="text-xl text-white mb-1">Media & Links</h3>
                <div className="h-25 bg-slate-400 rounded-md">

                </div>
            </div>
            
            <div className="flex flex-col w-full items-start text-red-600 text-xl p-2 pt-4 gap-1 shadow-slate-500
                         *:hover:bg-slate-600 *:p-3 *:w-75"
            >
                {/* <h3 className="text-white text-xl">Options:</h3> */}
                <button className="flex items-center gap-1 text-white">
                    <img src="/pin.png" className="h-6"/>
                    Pin this Chat
                </button>
                <button className="flex items-center gap-1">
                    <img src="/warning.png" className="h-7"/>
                    Clear Chat
                </button>
                <button className="flex items-center gap-1">
                    <img src="/delete.png" className="h-5"/>
                    Delete Chat
                </button>
                <button className="flex items-center gap-2">
                    <img src="/block.png" className="h-5"/>
                    Block @vishal
                </button>
                <button className="flex items-center gap-1">
                    <img src="/notice.png" className="h-6"/>
                    Report @vishal
                </button>
            </div>

        </div>
    );
}