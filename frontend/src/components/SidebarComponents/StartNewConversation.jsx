import { useState } from "react";
import axios from 'axios';

export function StartNewConversation({ setConversations, API_URL }) {
    const AUTH_API_URL = 'http://localhost:8000/api/v1/auth';
    const [username, setUsername] = useState('');
    const [response, setResponse] = useState('');
    const [userFound, setUserFound] = useState(false);
    const [responseReturned, setResponseReturned] = useState(false);
    const [convTypeSelected, setConvTypeSelected] = useState("dm");

    const handleSearchUser = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.get(`${AUTH_API_URL}/search/user/${username}`);

            if (response.status >= 200 && response.status < 300) {
                const data = response.data;
                setResponseReturned(true);
                setUserFound(true);
            }
        } catch (error) {
            setUserFound(false);
            setResponseReturned(true);
            setResponse('Username Not Found');
            console.error('Error Searching user', error);
        }
    }

    const handleNewConversation = async (e) => {
        e.preventDefault();

        try {
            const currUser = JSON.parse(localStorage.getItem('xen_user_data'));
            
            const create_conv_data = {
                conversation_metadata: {
                    conv_type: convTypeSelected,
                    member_count: 2
                },
                users: [
                    {
                        username: JSON.parse(localStorage.getItem('xen_user_data')).username,
                        role: "member"
                    },
                    {
                        username: username,
                        role: "memeber"
                    }
                ]
            };

            const token = localStorage.getItem('xen_access_token');
            const response = await axios.post(`${API_URL}/chats/create/conversation`, create_conv_data, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = response.data.new_conversation;
            console.log(data);
            setConversations(prev => [...prev, data]);

        } catch (error) {
            console.error('Error starting new conversation:', error);
        }
    }

    return (
        <div className="absolute left-[4vw] top-[6vw] w-[22vw] flex flex-col p-3! rounded-2xl! bg-slate-800! border">
            <h4 className="text-lg font-semibold border-b">Start New Conversation</h4>

            <p className="mt-2.5 mb-1">Search by entering username:</p>
            <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-slate-600 rounded p-2 pl-2.5 outline-0"
                placeholder="eg: vishal"
            />
            {userFound && (<p className="text-green-400 text-3xl absolute right-4 top-20">✓</p>)}
            
            {responseReturned && !userFound && (<p className="p-1 text-red-500">Username Not Found</p>)}
            <div className="p-2 flex justify-center gap-1">
                <button
                    onClick={handleSearchUser}
                    className="bg-white text-slate-950 p-1 rounded w-[30%] hover:bg-gray-400"
                >Search</button>

                {responseReturned && (
                    (userFound) && (
                        <button 
                            onClick={handleNewConversation}
                            className="bg-white text-slate-950 p-1 rounded w-[30%] hover:bg-gray-400">Add</button>
                    ) 
                )}
            </div>
        </div>
    );
}