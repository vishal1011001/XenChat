import { useEffect, useState } from "react";
import { FileUploadOptions } from "./FileUploadOptions";
import { LOCAL_API_URL, HOSTED_API_URL } from "../../URLs/endpoints";
import axios from 'axios';

export function MessageCompose({ text, setText, sendMessage, currUserUid, activeConvUid, wantToEdit, setWantToEdit, messageUidToEdit }) {
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const API_URL = isLocal ? LOCAL_API_URL : HOSTED_API_URL;

    const transmitMessage = () => {
        if (selectedFiles) submitFile();
        else if (wantToEdit) handleEditMessage();
        else handleSendMessage();
    }

    const handleSendMessage = () => {
        if (!text.trim() && !wantToUploadFile) return;
        sendMessage({
            req: 'send_msg',
            content: text.trim(),
            conv_uid: activeConvUid,
            sender_uid: currUserUid,
            message_type: 'text'
        });
        sendMessage({
            req: 'update_last_read',
            user_uid: currUserUid,
            conv_uid: activeConvUid
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

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event?.preventDefault();

            if (wantToEdit) handleEditMessage();
            else handleSendMessage();
        }
    }

    const [wantToUploadFile, setWantToUploadFile] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState(null);
    const [uploadStatus, setUploadStatus] = useState('');

    const handleFileChange = (e) => {
        const files = [...e.target.files]
        setSelectedFiles(files);
    }

    const cancelFileOperation = () => {
        setSelectedFiles(null);
        setWantToUploadFile(false);
    }

    const submitFile = async (e) => {
        e?.preventDefault();
        if (!selectedFiles) return;
        
        const formData = new FormData();
        for(let i = 0; i < selectedFiles.length; i++) {
            formData.append('files', selectedFiles[i]);
        }

        setWantToUploadFile(false);
        setSelectedFiles(null);

        const metadata = {
            req: 'send_file',
            sender_uid: currUserUid,
            conv_uid: activeConvUid,
            caption: text.trim()
        }
        formData.append('metadata', JSON.stringify(metadata));

        try {
            const response = await axios.post(`${API_URL}/file/send`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setSelectedFiles(null);
            console.log(response.data);
        } catch (error) {
            console.error('Error Uploading file:', error);
        }
    }

    const [previewUrls, setPreviewUrls] = useState('');
    useEffect(() => {
        if (!selectedFiles) return;
        const objectUrls = selectedFiles.map(file => {
            return URL.createObjectURL(file);
        })
        setPreviewUrls([...objectUrls]);
    }, [selectedFiles]);

    return (
        <div className="flex w-[66vw] justify-center fixed bottom-2 self-center-safe z-2 border border-blue-950 rounded-4xl">

            <div className="p-1.5 pl-5 bg-blue-950 text-white rounded-l-4xl w-full flex justify-between">
                <input placeholder="Type a message..."
                    onKeyDown={handleKeyDown}
                    value={text}
                    onChange={(e) => (setText(e.target.value))}
                    className="placeholder-white w-full outline-0"
                />
                <div className="flex pr-1 *:p-2 *:rounded-full ">
                    <button
                        onClick={() => setWantToUploadFile(!wantToUploadFile)}
                    ><img src='/icons/paperclip.svg' className="h-5 invert-100" /></button>
                    {wantToUploadFile && (
                        <FileUploadOptions handleFileChange={handleFileChange} />
                    )}

                    <button><img src='/icons/emoji.svg' className="h-5 invert-100" /></button>
                </div>
            </div>

            {selectedFiles && previewUrls && (
                <div className="absolute bottom-12.5 rounded left-0 bg-slate-700 p-2 pt-0">
                    <div className="flex justify-between text-white">
                        <h4 className="text-lg">Selected Files:</h4>
                        <button onClick={cancelFileOperation} className="">X</button>
                    </div>
                    <div className="flex gap-2 p-2">
                        {previewUrls.map(url => (
                            <img key={url} className="h-50 border rounded-lg border-white p-2" src={url} />
                        ))}
                    </div>
                </div>
            )}

            <button
                onClick={transmitMessage}
                className="text-slate-800 bg-white rounded-r-4xl w-[13%] font-bold text-lg hover:bg-gray-300 active:bg-gray-100"
            >Send</button>
        </div>
    );
}