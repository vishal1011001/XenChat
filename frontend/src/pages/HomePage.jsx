import { ChatArea } from "../components/ChatArea";
import { Chats } from "../components/Chats";
import { Sidebar } from "../components/Sidebar";
import axios from 'axios';
import { useEffect, useRef, useState } from "react";
import { useWebSocket } from "../hooks/useWebSocket";
import { useNavigate } from "react-router-dom";
import { MountUtilityInfo } from "../components/MountUtilityInfo";
import { ChatMetadata } from "../components/ChatMetadata";


export default function HomePage() {
    const nav = useNavigate();

    const API_URL = 'https://xenchat-backend.fastapicloud.dev/api/v1';
    const [conversations, setConversations] = useState([]);
    const [messages, setMessages] = useState([]);

    const [activeConvUid, setActiveConvUid] = useState('');
    const activeConvUidRef = useRef(activeConvUid);

    const [messagesToDisplay, setMessagesToDisplay] = useState([]);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isChatMetadataOpen, setIsChatMetadataOpen] = useState(false);

    const currUserUid = JSON.parse(localStorage.getItem('xen_user_data'))?.user_uid || '';
    const currUsername = JSON.parse(localStorage.getItem('xen_user_data'))?.username || '';
    const sendMessage = useWebSocket(currUserUid, setConversations, setMessages, activeConvUidRef);


    const handleRefreshToken = async (funcToRun) => {
        try {
            const ref_token = localStorage.getItem('xen_refresh_token');
            const response = await axios.get(`${API_URL}/auth/refresh_token`, {
                headers: {
                    Authorization: `Bearer ${ref_token}`
                }
            });

            if (response.status >= 200 && response.status < 300) {
                const data = response.data;
                if (data.status_code === 'refresh success') {
                    localStorage.setItem('xen_access_token', data.access_token);
                    localStorage.setItem('xen_refresh_token', data.refresh_token);
                    funcToRun();
                }
            }
        } catch (error) {
            if (error.status === 401) {
                nav('/login');
            }
            console.error("Error Refreshing tokens:", error);
        }
    }

    const [isChatsLoading, setIsChatsLoading] = useState(false);

    const retrieveChats = async (e) => {
        e?.preventDefault();
        try {
            setIsChatsLoading(true);
            const token = localStorage.getItem('xen_access_token');
            const response = await axios.get(`${API_URL}/chats`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.status >= 200 && response.status < 300) {
                const data = response.data;
                setConversations(data.conversations);
                setMessages(data.messages);
                setIsChatsLoading(false);
            } else {
                throw new Error('Error fetching conversations');
                setIsChatsLoading(false);
            }
        } catch (error) {
            if (error.status === 401) {
                handleRefreshToken(retrieveChats);
            } else {
                console.error('Error retrieving chats:', error);
            }
        }
    }

    // Retrieving all chats at mounting
    useEffect(() => {
        retrieveChats();
    }, []);

    // updating last read at, when user opens a chat
    useEffect(() => {
        if (activeConvUid) {
            sendMessage({
                'req': 'update_last_read',
                'conv_uid': activeConvUid,
                'user_uid': currUserUid
                //read-time (currently backend handles it)
            });
        }

        activeConvUidRef.current = activeConvUid;
        setIsChatMetadataOpen(false);
    }, [activeConvUid]);


    return (
        <div className="h-screen w-screen flex flex-row">
            <Sidebar setConversations={setConversations} API_URL={API_URL} handleRefreshToken={handleRefreshToken} setActiveConvUid={setActiveConvUid} sendMessage={sendMessage} />
            <Chats conversations={conversations} setConversations={setConversations} activeConvUid={activeConvUid} setActiveConvUid={setActiveConvUid} setIsChatOpen={setIsChatOpen} isChatsLoading={isChatsLoading} />
            {!isChatOpen ? (
                <MountUtilityInfo />
            ) : (
                isChatMetadataOpen ? (
                    <ChatMetadata API_URL={API_URL} setIsChatMetadataOpen={setIsChatMetadataOpen} setIsChatOpen={setIsChatOpen} conversations={conversations} activeConvUid={activeConvUid}/>
                ) : (
                    <ChatArea sendMessage={sendMessage} currUserUid={currUserUid} messages={messages} activeConvUid={activeConvUid} setIsChatMetadataOpen={setIsChatMetadataOpen} conversations={conversations} />
                )
            )}
        </div>
    );
}