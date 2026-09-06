import { useState } from "react";

export function MessageCompose({ text, setText, sendMessage, currUserUid, activeConvUid, wantToEdit, setWantToEdit, messageUidToEdit }) {
    const handleSendMessage = () => {
        if (!text.trim()) return;
        sendMessage({
            req: 'send_msg',
            content: text.trim(),
            conv_uid: activeConvUid,
            sender_uid: currUserUid
        });
        setText('');
    }

    const handleEditMessage = () => {
        if (!text.trim()) return;
        sendMessage({
            req: 'edit_msg',
            new_content: text.trim(),
            message_uid: messageUidToEdit,
            conv_uid: activeConvUid,
            sender_uid: currUserUid
        })
        setText('');
        setWantToEdit(false);
    }

    return (
        <div className="flex felx-col w-[66vw] gap-x-2 justify-center fixed bottom-2 self-center-safe z-2">
            <input placeholder="Type a message..."
                value={text}
                onChange={(e) => (setText(e.target.value))}
                className="p-3 bg-blue-950 text-white rounded-4xl placeholder-white w-full"
            />
            <button 
                onClick={wantToEdit ? handleEditMessage : handleSendMessage}
                className="text-slate-800 bg-white p-3 rounded-full"
            >Send</button>
        </div>
    );
}