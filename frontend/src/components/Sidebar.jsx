import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { StartNewConversation } from './SidebarComponents/StartNewConversation';
import axios from 'axios';

export function Sidebar({ setConversations, API_URL, handleRefreshToken, setActiveConvUid }) {
    const navigate = useNavigate();
    const currUsername = JSON.parse(localStorage.getItem('xen_user_data'))?.username;

    const handleLogout = async (e) => {
        e.preventDefault();
        try {
            const ref_token = localStorage.getItem('xen_refresh_token');
            const response = await axios.post(`${API_URL}/auth/logout`, null, {
                headers: {
                    Authorization: `Bearer ${ref_token}`
                }
            });
            if (response.status >= 200 && response.status < 300) {
                localStorage.removeItem('xen_access_token');
                localStorage.removeItem('xen_refresh_token');
                navigate('/login');
            }
        } catch (error) {
            console.error('Error logging out properly:', error);
        }
    }

    const [wantToStartConv, setWantToStartConv] = useState(false);

    const toggleWantNewConversation = () => {
        setWantToStartConv(!wantToStartConv);
    }

    const handleNewChatbotConv = async (e) => {
        e?.preventDefault();

        try {
            const users = [
                {
                    username: currUsername,
                    role: 'member'
                },
                {
                    username: 'xenchatbot',
                    role: 'member'
                }
            ];

            const create_conv_data = {
                conversation_metadata: {
                    conv_type: 'dm',
                    conv_name: null,
                    member_count: users.length
                },
                users: users
            };

            const token = localStorage.getItem('xen_access_token');
            const response = await axios.post(`${API_URL}/chats/create/conversation`, create_conv_data, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            if (response.status >= 200 && response.status < 300) {
                const data = response.data;
                // Actual new conv metadata response will come via socket connection.
                setActiveConvUid(data.conv_uid);
            }
        } catch (error) {
            if (error.status === 401) {
                handleRefreshToken(() => handleNewConversation(e));
            }
            console.error('Error starting new conversation with chatbot:', error);
        }
    }

    return (
        <div className="h-screen w-[5vw] bg-slate-900 flex flex-col pt-3">
            <div className="flex flex-col gap-4 items-center p-2 *:text-white *:rounded-full *:p-1 *:hover:bg-gray-600 ">
                <button className="h-10 w-10">
                    <img src="/icons/chat.svg" className="invert-100 w-6 place-self-center-safe" />
                </button>
                <button 
                    onClick={handleNewChatbotConv}
                    className="h-10 w-10">
                    <img src="/icons/bot.svg" className="invert-100 w-7 place-self-center-safe" />
                </button>
                <button
                    onClick={toggleWantNewConversation}
                    className="h-10 w-10">
                    <img src="/icons/add.svg" className="invert-100" />
                </button>
                {wantToStartConv && (
                    <StartNewConversation setConversations={setConversations} API_URL={API_URL} handleRefreshToken={handleRefreshToken} setActiveConvUid={setActiveConvUid} setWantToStartConv={setWantToStartConv} currUsername={currUsername} />
                )}
                <button onClick={handleLogout}>
                    <img src='/icons/logout.svg' className='h-7 invert-100' />
                </button>
            </div>
        </div>
    );
}