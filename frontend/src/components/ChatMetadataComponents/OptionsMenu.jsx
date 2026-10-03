import axios from 'axios';

export function OptionsMenu({ API_URL, username, activeConvUid, setIsChatMetadataOpen, setIsChatOpen }) {

    const handleDeleteConv = async (e) => {
        e?.preventDefault();
        try {
            const token = localStorage.getItem('xen_access_token');
            const response = await axios.delete(`${API_URL}/chats/${activeConvUid}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            if (response.status >= 200 && response.status < 300) {
                setIsChatMetadataOpen(false);
                setIsChatOpen(false);
            }
        } catch (error) {
            console.error("Error deleting chat:", error);
        }
    }
    
    return (
        <div className="p-1 py-2 grid grid-cols-2 w-xl items-start rounded-xl border-white border text-red-600 text-xl
                         *:hover:bg-slate-950 *:p-3 *:px-5 *:w-70 *:rounded-xl"
        >
            <button className="flex items-center text-white">
                <img src="/pin.png" className="h-6 w-6" />
                <p className="pl-4">Pin this Chat</p>
            </button>
            <button className="flex items-center gap-1">
                <img src="/warning.png" className="h-6 w-6" />
                <p className="pl-3">Clear Chat</p>
            </button>
            <button 
                className="flex items-center gap-1"
                onClick={handleDeleteConv}
            >
                <img src="/delete.png" className="h-6 w-6" />
                <p className="pl-3">Delete Chat</p>
            </button>
            <button className="flex items-center gap-2">
                <img src="/block.png" className="h-6 w-6" />
                <p className="pl-2">Block @{username}</p>
            </button>
            <button className="flex items-center gap-1">
                <img src="/notice.png" className="h-6 w-6" />
                <p className="pl-3">Report this chat</p>
            </button>
        </div>
    );
}