import { useEffect, useState } from "react";

export function Signin({ handleLogin }) {
    const [identity, setIdentity] = useState('');
    const [password, setPassword] = useState('');

    const signin = (e) => {
        const creds = {
            'identity': identity,
            'password': password
        }
        handleLogin(e, creds);
    }

    return (
        <form className="flex flex-col items-center justify-center gap-2">
            <h3 className="text-3xl mb-10 font-serif">Sign In</h3>
            <input 
                value={identity}
                onChange={(e) => (setIdentity(e.target.value))}
                placeholder="Email or Username" className="p-3 bg-gray-200 rounded w-100 focus:outline-1 outline-stone-800" />
            <input 
                value={password}
                onChange={(e) => (setPassword(e.target.value))}
                placeholder="Password" className="p-3 bg-gray-200 rounded w-100 outline-0 focus-within:shadow-md shadow-orange-200" />

            <button
                onClick={signin}
                className="bg-orange-600 p-3 w-full rounded text-white font-bold">Login</button>
        </form>
    );
}