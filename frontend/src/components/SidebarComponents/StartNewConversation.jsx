import { useState } from "react";
import axios from 'axios';

export function StartNewConversation() {
    const AUTH_API_URL = 'http://localhost:8000/api/v1/auth';
    const [username, setUsername] = useState('');
    const [response, setResponse] = useState('');
    const [userFound, setUserFound] = useState(false);
    const [responseReturned, setResponseReturned] = useState(false);

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
            const conv_data = 10;
            const response = await axios.post(`${API_URL}/create/conversation`, conv_data);
        } catch (error) {
            console.error('Error starting new conversation:', error);
        }
    }

    return (
        <div className="absolute left-[4vw] top-[6vw] flex flex-col p-3! gap-3 rounded-2xl! bg-slate-800! border">
            <h4 className="text-lg font-semibold">Start New Conversation</h4>
            <p>Search by entering username:</p>
            <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-slate-600 rounded p-1 outline-0"
                placeholder="eg: vishal"
            />
            {userFound && (<p className="text-green-400 text-3xl absolute right-3.5 top-21">✓</p>)}
            <div className="p-0.5 flex justify-center gap-1">
                <button
                    onClick={handleSearchUser}
                    className="bg-white text-slate-950 rounded-2xl w-[40%] place-self-center hover:bg-gray-400"
                >Search</button>

                {responseReturned && (
                    (userFound) && (
                        <button className="bg-white text-slate-950 w-[40%] rounded-full">Add</button>
                    ) 
                )}
            </div>
        </div>
    );
}