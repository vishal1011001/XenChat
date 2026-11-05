import { useState } from "react";
import axios from 'axios';

export function About({ API_URL, userData }) {
    const [wantToUpdateAbout, setWantToUpdateAbout] = useState(false);
    const [about, setAbout] = useState(userData?.about || '');
    const changeAbout = (e) => {
        setAbout(e.target.value);
    }

    const handleSaveAbout = async (e) => {
        e?.preventDefault();

        try {
            const token = localStorage.getItem('xen_access_token');
            const response = await axios.patch(`${API_URL}/profile/about`,
                null,
                {   
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    params: {about},
                });

            if (response.status >= 200 && response.status < 300) {
                const data = response.data.about;
                setAbout(data);
                setWantToUpdateAbout(false);
                
                const updatedUserData = {
                    ...userData,
                    about: data
                } 
                localStorage.setItem('xen_user_data', JSON.stringify(updatedUserData));
            } else {
                throw new Error('Response Error');
            }
        } catch (error) {
            console.error("Error Updating about: ", error);
        }
    }

    return (
        <div className={`flex items-center place-self-center rounded-full min-w-50 text-xl gap-1 bg-slate-800 p-2 ${wantToUpdateAbout && 'border border-pink-600 shadow shadow-pink-300'}`}>
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
                <div className="flex items-center">
                    <input placeholder="Write about you" value={about} onChange={changeAbout} className="outline-0 px-2" />
                    <button onClick={handleSaveAbout} className="hover:bg-slate-700 p-1 px-2 text-sm rounded-xl">Save</button>
                </div>
            ) : (
                <p className={about ? 'pl-1' : 'text-gray-600'}>{about || 'Not set'}</p>
            )}
            
        </div>
    );
}