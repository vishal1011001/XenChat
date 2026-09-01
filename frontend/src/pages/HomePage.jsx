import { ChatArea } from "../components/ChatArea";
import { Chats } from "../components/Chats";
import { Sidebar } from "../components/Sidebar";
import axios from 'axios';
import { useEffect, useState } from "react";
import { useWebSocket } from "../hooks/useWebSocket";
import { useNavigate } from "react-router-dom";


export default function HomePage() {
    const nav = useNavigate();

    const API_URL = 'http://localhost:8000/api/v1';
    const [conversations, setConversations] = useState([]);
    const [messages, setMessages] = useState([]);

    const [activeConvUid, setActiveConvUid] = useState('');
    const [messagesToDisplay, setMessagesToDisplay] = useState([]);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [openChatMetadata, setOpenChatMetadata] = useState({});

    const currUserUid = JSON.parse(localStorage.getItem('xen_user_data'))?.user_uid || '';
    const sendMessage = useWebSocket(currUserUid, setMessages);


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

    const retrieveChats = async (e) => {
        e?.preventDefault();
        try {
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
            } else {
                throw new Error('Error fetching conversations')
            }
        } catch (error) {
            if (error.status === 401) {
                handleRefreshToken(retrieveChats);
            } else {
                console.error('Error retrieving chats:', error);
            }
        }
    }

    useEffect(() => {
        const messagesFiltered = messages.filter(message => message.conv_uid === activeConvUid);
        setMessagesToDisplay(messagesFiltered);

        const conv_metadata = conversations.filter(conv => conv.conv_uid === activeConvUid)[0];
        setOpenChatMetadata(conv_metadata);
        setIsChatOpen(true);
    }, [activeConvUid, messages]);

    useEffect(() => {
        retrieveChats();
    }, []);

    useEffect(() => {
        if (!conversations || conversations.length === 0) return;

        const newConvs = conversations.map(conv => {
            const convMessages = messages.filter(m => m.conv_uid === conv.conv_uid);
            if (convMessages.length === 0) return conv;

            const latest = convMessages.reduce((a, b) => {
                const ta = a.sent_at ? new Date(a.sent_at) : new Date(0);
                const tb = b.sent_at ? new Date(b.sent_at) : new Date(0);
                return (ta > tb) ? a : b;
            })

            return { ...conv, last_message: latest.content };
        })

        const changed = JSON.stringify(conversations) !== JSON.stringify(newConvs);
        if (changed) {
            setConversations(newConvs);
        }
    }, [conversations, messages]);

    return (
        <div className="h-screen w-screen flex flex-row">
            <Sidebar setConversations={setConversations} API_URL={API_URL} handleRefreshToken={handleRefreshToken} setActiveConvUid={setActiveConvUid} />
            <Chats conversations={conversations} setActiveConvUid={setActiveConvUid} />
            <ChatArea sendMessage={sendMessage} currUserUid={currUserUid} messagesToDisplay={messagesToDisplay} activeConvUid={activeConvUid} openChatMetadata={openChatMetadata} />
        </div>
    );
}