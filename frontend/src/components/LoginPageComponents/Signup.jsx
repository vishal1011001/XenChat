import { useState } from "react";
import axios from 'axios';

export function Signup({ AUTH_API_URL, setUserData, handleLogin }) {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();

        const credentials = {
            'email': email,
            'username': username,
            'password': password
        };
        try {
            const response = await axios.post(`${AUTH_API_URL}/signup`, credentials);
            if (response.status >= 200 && response.status < 300 ) {
                const data = response.data;
                setUserData(data.user);
                console.log('registration successful');
                const creds = {
                    'identity': email,
                    'password': password
                }
                handleLogin(e, creds); // event passing
            } else {
                console.log(response.status, response.data);
                throw new Error('Registration Failed');
            }
        } catch (error) {
            console.error('error signing up user: ', error);
        }
    }

    return (
        <form className="flex flex-col items-center justify-center gap-2">
            <h3 className="text-3xl mb-5 font-serif">Sign Up</h3>
            <input 
                value={email}
                onChange={(e) => (setEmail(e.target.value))}
                placeholder="Email" className="p-3 bg-gray-200 rounded w-100 focus:outline-1 outline-stone-800" />
            <input 
                value={username}
                onChange={(e) => (setUsername(e.target.value))}
                placeholder="Create username" className="p-3 bg-gray-200 rounded w-100 focus:outline-1 outline-stone-800" />
            <input 
                value={password}
                onChange={(e) => (setPassword(e.target.value))}
                placeholder="Create password" className="p-3 bg-gray-200 rounded w-100 focus:outline-1 outline-stone-800" />

            <button
                onClick={handleRegister}
                className="bg-orange-600 p-3 w-full rounded text-white font-bold"
            >Register</button>
        </form>
    );
}