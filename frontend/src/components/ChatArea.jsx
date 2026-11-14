import { HeaderBar } from "./ChatAreaComponents/HeaderBar";
import { MessageCompose } from "./ChatAreaComponents/MessageCompose";
import { Messages } from "./ChatAreaComponents/Messages";
import { useWebSocket } from "../hooks/useWebSocket";
import { act, useEffect, useState } from "react";
import { getDisplayName, getDisplayPfpUid } from "./utils/utilityFunctions";
import { FileOpen } from "./ChatAreaComponents/FileOpen";
import { Summarize } from "../components/ChatAreaComponents/Summarize";

export function ChatArea({ API_URL, sendMessage, currUserUid, messages, activeConvUid, conversations, setSelectedWindow }) {
    const [wantToEdit, setWantToEdit] = useState(false);
    const [messageUidToEdit, setMessageUidToEdit] = useState('');

    const [text, setText] = useState('');

    const displayName = getDisplayName(conversations, activeConvUid, currUserUid);
    const displayPfpUid = getDisplayPfpUid(conversations, activeConvUid, currUserUid);

    // File Viewing 
    const [isFileOpen, setIsFileOpen] = useState(false);
    const [selectedFileUid, setSelectedFileUid] = useState('');

    const viewFile = (file_uid) => {
        setIsFileOpen(true);
        setSelectedFileUid(file_uid);
    }

    const closeFile = () => {
        setIsFileOpen(false);
        setSelectedFileUid('');
    }

    const [wantToSummarize, setWantToSummarize] = useState(false);

    return (
        <div className="h-screen bg-[url('/chat-bg.jpg')] bg-cover bg-fixed w-full flex flex-col pb-2 pt-20 overflow-scroll scrollbar-none scroll-auto scroll">
            <HeaderBar displayName={displayName} displayPfpUid={displayPfpUid} setSelectedWindow={setSelectedWindow}/>

            <div className="bg-slate-900 place-self-center p-3 rounded text-center">
                <p className="text-white">
                    {`This is the start of your conversation with @${displayName}`}
                </p>
            </div>

            <Messages sendMessage={sendMessage} activeConvUid={activeConvUid} messages={messages} currUserUid={currUserUid} setWantToEdit={setWantToEdit} setMessageUidToEdit={setMessageUidToEdit} setText={setText} conversations={conversations} viewFile={viewFile} />

            {wantToSummarize && (
                <Summarize API_URL={API_URL} activeConvUid={activeConvUid}/>
            )}

            <MessageCompose text={text} setText={setText} sendMessage={sendMessage} currUserUid={currUserUid} activeConvUid={activeConvUid} wantToEdit={wantToEdit} setWantToEdit={setWantToEdit} messageUidToEdit={messageUidToEdit} displayName={displayName} setWantToSummarize={setWantToSummarize}/>

            {isFileOpen && selectedFileUid && (
                <FileOpen file_uid={selectedFileUid} closeFile={closeFile}/>
            )}
        </div>
    );
}