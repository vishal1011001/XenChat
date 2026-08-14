import { ChatArea } from "../components/ChatArea";
import { Chats } from "../components/Chats";
import { Sidebar } from "../components/Sidebar";
import axios from 'axios';
import { useEffect, useState } from "react";
import { useWebSocket } from "../hooks/useWebSocket";


export default function HomePage(){
    const API_URL = 'http://localhost:8000/api/v1';
    const [conversations, setConversations] = useState([]);
    const [activeConvUid, setActiveConvUid] = useState('');
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [messagesToDisplay, setMessagesToDisplay] = useState([]);


    const retrieveChats = async (e) => {
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
            } else {
                throw new Error('Error fetching conversations')
            }
        } catch (error) {
             console.error('Error retrieving chats:', error);
        }
    }

    useEffect(() => {
        const activeConv = conversations.find(conv => conv.conv_uid == activeConvUid);
        setMessagesToDisplay(activeConv?.messages || []);
        setIsChatOpen(true);
        console.log(activeConv?.messages);
    }, [activeConvUid]);

    useEffect(() => {
        retrieveChats();
    }, []);

    return (
        <div className="h-screen w-screen flex flex-row">
            <Sidebar />
            <Chats conversations={conversations} setActiveConvUid={setActiveConvUid}/>
            <ChatArea messagesToDisplay={messagesToDisplay} setMessagesToDisplay={setMessagesToDisplay} activeConvUid={activeConvUid}/>
        </div>
    );
}