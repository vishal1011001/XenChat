import { useState, useEffect } from "react";
import axios from 'axios';

export function StartNewConversation({ setConversations, API_URL, handleRefreshToken, setActiveConvUid }) {
    const AUTH_API_URL = 'http://localhost:8000/api/v1/auth';
    const [username, setUsername] = useState('');
    const [response, setResponse] = useState('');
    const [userFound, setUserFound] = useState(false);
    const [responseReturned, setResponseReturned] = useState(false);
    const [convTypeSelected, setConvTypeSelected] = useState("dm");

    const [wantToCreateGc, setWantToCreateGc] = useState(false);
    const [gcName, setGcName] = useState('');
    const currUsername = JSON.parse(localStorage.getItem('xen_user_data'))?.username
    const [addedMembers, setAddedMembers] = useState([
        {
            username: currUsername,
            role: 'admin'
        }
    ]);

    const handleSearchUser = async (e) => {
        e?.preventDefault();

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

    const removeMemberFromGc = (username) => {
        if (username === currUsername) {
            return;
        }
        setAddedMembers(addedMembers.filter(member => member.username !== username));
    }

    const addMemberToGc = () => {
        setAddedMembers([...addedMembers, {
            username: username,
            role: 'member'
        }]);
        setUsername('');
        setResponseReturned(false);
        setUserFound(false);
    }

    const handleNewConversation = async (e) => {
        e?.preventDefault();

        try {
            const users = wantToCreateGc ? addedMembers : [
                ...addedMembers,
                {
                    username: username,
                    role: 'member'
                }
            ];

            if (!wantToCreateGc) users[0].role = 'member';

            const create_conv_data = {
                conversation_metadata: {
                    conv_type: wantToCreateGc ? 'group' : 'dm',
                    conv_name: wantToCreateGc ? gcName : null,
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
                data.last_message = '';
                setConversations(prev => [data, ...prev]);
                setActiveConvUid(data.conv_uid);
            }
        } catch (error) {
            if (error.status === 401) {
                handleRefreshToken(() => handleNewConversation(e));
            }
            console.error('Error starting new conversation:', error);
        }
    }

    return (
        <div className="absolute left-[4vw] top-[6vw] w-[27vw] flex flex-col p-3! rounded-2xl! bg-slate-800! border">
            <h4 className="text-lg font-semibold border-b">{wantToCreateGc ? 'Start A Group Chat' : 'Start New Conversation'}</h4>

            <p className="mt-2.5 mb-1">{wantToCreateGc ? 'Search members to add:' : 'Search by entering username:'}</p>
            <div className="flex items-center-safe w-full gap-1">
                <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="bg-slate-600 w-[70%] rounded p-1.5 pl-3 border border-cyan-600 outline-0"
                    placeholder="eg: vishal"
                />
                {userFound && (<p className="text-green-400 text-3xl absolute left-63 top-20">✓</p>)}
                <button
                    onClick={handleSearchUser}
                    className="bg-white text-slate-950 p-1.5 flex-1 rounded hover:bg-gray-400"
                >Go</button>
            </div>

            {responseReturned && !userFound && (<p className="p-1 text-red-500">Username Not Found</p>)}
            <div className="pt-2 flex flex-col justify-center gap-2 w-full">
                {responseReturned && (
                    (userFound) && (
                        <button
                            onClick={wantToCreateGc ? addMemberToGc : handleNewConversation}
                            className="bg-white text-slate-950 p-1 border border-white hover:text-white hover:bg-slate-800 hover:border-green-700 rounded-tl-full rounded-tr-2xl rounded-br-full rounded-bl-2xl"
                        >{wantToCreateGc ? 'Add' : `Chat with @${username}`}</button>
                    )
                )}

                {!wantToCreateGc && (<p className="Group">Or Create A Group Chat:</p>)}
                <div className="flex flex-row justify-center items-center gap-2">
                    {wantToCreateGc && (
                        <button
                            onClick={handleNewConversation}
                            className="bg-white text-black rounded text-lg flex-1 py-2 border border-white
                            hover:bg-slate-800 hover:text-white hover:border hover:border-blue-900 transition
                        ">Create</button>
                    )}

                    <button
                        className="bg-slate-700 border border-blue-800 rounded text-lg flex-1 py-2
                                    hover:bg-slate-900 hover:text-white hover:border hover:border-blue-900 transition"
                        onClick={() => (setWantToCreateGc(!wantToCreateGc))}
                    >{wantToCreateGc ? 'Cancel' : 'Create Group'}</button>
                </div>
                {(wantToCreateGc) && (
                    <div className="flex flex-col gap-2 bg-gray-900 p-2 rounded">
                        <input 
                            value={gcName}
                            onChange={(e) => setGcName(e.target.value)}
                            placeholder="Give Group a Name"
                            className="p-2 border border-blue-400 rounded-xl outline-0"
                        />
                        <p>Group Members:</p>
                        {addedMembers.map((member) => (
                            <div key={member.username}
                                className="flex flex-row items-center gap-2 w-full pr-2"
                            >
                                <img src='/default-pfp.png' className="h-12" />
                                <h4 className="text-xl font-semibold">{member.username}</h4>
                                {(member.username !== currUsername) && (
                                    <button
                                        onClick={() => removeMemberFromGc(member.username)}
                                        className="ml-auto px-1.5 rounded border border-cyan-600 text-blue-500 hover:text-blue-300"
                                    >Remove</button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}