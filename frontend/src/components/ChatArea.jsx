import { HeaderBar } from "./ChatAreaComponents/HeaderBar";
import { MessageCompose } from "./ChatAreaComponents/MessageCompose";
import { Messages } from "./ChatAreaComponents/Messages";
import { useWebSocket } from "../hooks/useWebSocket";

export function ChatArea({ sendMessage, currUserUid, messagesToDisplay, activeConvUid }) {
    return (
        <div className="h-screen bg-[url('/chat-bg.jpg')] bg-cover bg-fixed w-full flex flex-col justify-between pb-2 pt-15 overflow-scroll scrollbar-none scroll-auto scroll">
            <HeaderBar />

            <Messages messagesToDisplay={messagesToDisplay} currUserUid={currUserUid}/>
            
            <MessageCompose sendMessage={sendMessage} currUserUid={currUserUid} activeConvUid={activeConvUid}/>
        </div>
    );
}