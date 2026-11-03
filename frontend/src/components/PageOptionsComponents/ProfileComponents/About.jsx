import { useState } from "react";
import axios from 'axios';

export function About({ API_URL, userData }) {
    const [wantToUpdateAbout, setWantToUpdateAbout] = useState(false);
    const [about, setAbout] = useState(userData?.about || '');
    const changeAbout = (e) => {
        setAbout(e.target.value);
    }

    const handleSaveAbout = async () => {
        e?.preventDefault();

        try {
            const token = localStorage.getItem('xen_access_token');
            const response = await axios.post(`${API_URL}/profile/about`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status >= 200 && response.status < 300) {
                const data = response.data;
                setAbout(data);
                setWantToUpdateAbout(false);
                
                const updatedUserData = {
                    ...userData,
                    about: data
                } 
                localStorage.setItem('xen_user_data', updatedUserData);
            } else {
                throw new Error('Response Error');
            }
        } catch (error) {
            console.error("Error Updating about: ", error);
        }
    }

    return (
        <div className={`flex items-center text-xl gap-1 bg-slate-800 p-2 ${userData?.about ? '' : ''}`}>
            <button
                onClick={() => setWantToUpdateAbout(!wantToUpdateAbout)} 
                className="rounded-full p-1 px-2 hover:bg-slate-700">
                {!wantToUpdateAbout ? (
                    <img src='/icons/pencil.svg' className="h-4 invert-100" />
                ) : (
                    <p className="text-sm">Cancel</p>
                )}
            </button>
            <h4 className="font-bold">About:</h4>
            {wantToUpdateAbout ? (
                <div className="">
                    <input placeholder="Write about you" value={about} onChange={changeAbout} classname="" />
                    <button onClick={handleSaveAbout} className="">Save</button>
                </div>
            ) : (
                <p className={userData?.about ? '' : 'text-gray-600'}>{userData?.about || 'Not set'}</p>
            )}
            
        </div>
    );
}