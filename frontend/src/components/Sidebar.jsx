import {useNavigate} from 'react-router-dom';
import {useState} from 'react';
import { StartNewConversation } from './SidebarComponents/StartNewConversation';

export function Sidebar() {
    const navigate = useNavigate()
    const handleLogout = () => {
        localStorage.removeItem('xen_access_token');
        localStorage.removeItem('xen_refresh_token');
        navigate('/login');
    }

    const [wantToStartConv, setWantToStartConv] = useState(false);

    const toggleWantNewConversation = () => {
        setWantToStartConv(!wantToStartConv);
    }

    return (
        <div className="h-screen w-[5vw] bg-slate-800 flex flex-col pt-3">
            <div className="flex flex-col gap-4 items-center p-2 *:text-white *:rounded-full *:p-1 *:hover:bg-gray-600 ">
                <button className="h-10 w-10">
                    <img src="/chat.png" className="invert-100 w-6 place-self-center-safe"/>
                </button>
                <button className="h-10 w-10">
                    <img src="/bot.png" className="invert-100 w-7 place-self-center-safe"/>
                </button>
                <button 
                    onClick={toggleWantNewConversation}
                    className="h-10 w-10">
                    <img src="/add.png" className="invert-100"/>
                </button>
                {wantToStartConv && (
                    <StartNewConversation />
                )}
                <button onClick={handleLogout}>
                    <img src='/logout.png' className='h-7 invert-100'/>
                </button>
            </div>
        </div>
    );
}