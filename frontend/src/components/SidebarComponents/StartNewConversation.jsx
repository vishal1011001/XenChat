import { useState } from "react";
import axios from 'axios';

export function StartNewConversation({ setConversations, API_URL, handleRefreshToken }) {
    const AUTH_API_URL = 'http://localhost:8000/api/v1/auth';
    const [username, setUsername] = useState('');
    const [response, setResponse] = useState('');
    const [userFound, setUserFound] = useState(false);
    const [responseReturned, setResponseReturned] = useState(false);
    const [convTypeSelected, setConvTypeSelected] = useState("dm");
    
    const [wantToCreateGc, setWantToCreateGc] = useState(false);
    const [gcAddedMembers, setGcAddedMembers] = useState([
        {username: "vishal"},
        {username: "abc"},
        {username: "def"}
    ]);

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
                        role: "member"
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
            data.last_message = '';
            setConversations(prev => [data, ...prev]);

        } catch (error) {
            if (error.status === 401) {
                handleRefreshToken(handleNewConversation);
            }
            console.error('Error starting new conversation:', error);
        }
    }

    return (
        <div className="absolute left-[4vw] top-[6vw] w-[27vw] flex flex-col p-3! rounded-2xl! bg-slate-800! border">
            <h4 className="text-lg font-semibold border-b">Start New Conversation</h4>

            <p className="mt-2.5 mb-1">{wantToCreateGc ? 'Search members to add:' : 'Search by entering username:'}</p>
            <div className="flex items-center-safe w-full gap-1">
                <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="bg-slate-600 w-[80%] rounded p-1 pl-2.5 border border-cyan-600 outline-0"
                    placeholder="eg: vishal"
                />
                {userFound && (<p className="text-green-400 text-3xl absolute left-59 top-19">✓</p>)}
                <button
                    onClick={handleSearchUser}
                    className="bg-white text-slate-950 p-1 pl-6 pr-6 rounded hover:bg-gray-400"
                >Go</button>
            </div>

            {responseReturned && !userFound && (<p className="p-1 text-red-500">Username Not Found</p>)}
            <div className="pt-2 flex flex-col justify-center gap-1 w-full">
                {responseReturned && (
                    (userFound) && (
                        <button
                            onClick={handleNewConversation}
                            className="bg-white text-slate-950 p-1 w-[80%] hover:bg-gray-400 rounded-tl-full rounded-tr-2xl rounded-br-full rounded-bl-2xl"
                        >Add</button>
                    )
                )}
                <p className="Group">Or Create A Group Chat:</p>
                <button 
                    className="w-full bg-slate-700 p-1 rounded text-left pl-3"
                    onClick={() => (setWantToCreateGc(!wantToCreateGc))}
                >{wantToCreateGc ? 'Start DM' : 'Create Group'}</button>

                {(wantToCreateGc) && (
                    <div className="flex flex-col gap-2 bg-gray-900 p-2 rounded">
                        <p>Group Members:</p>
                        {gcAddedMembers.map((member) => (
                            <div className="flex flex-row items-center gap-2">
                                <img src='/default-pfp.png' className="h-12"/>
                                <h4 className="text-xl font-semibold">{member.username}</h4>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}