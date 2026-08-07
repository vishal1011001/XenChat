import {useNavigate} from 'react-router-dom';

export function Sidebar() {
    const navigate = useNavigate()
    const handleLogout = () => {
        localStorage.removeItem('xen_access_token');
        localStorage.removeItem('xen_refresh_token');
        navigate('/login');
    }
    return (
        <div className="h-screen w-[5vw] bg-slate-800 flex flex-col pt-3">
            <div className="flex flex-col gap-4 items-center p-2 *:text-white *:rounded-full *:p-0.5 *:hover:bg-gray-600 ">
                <button className="h-10 w-10">
                    <img src="/chat.png" className="invert-100 w-6 place-self-center-safe"/>
                </button>
                <button className="h-10 w-10">
                    <img src="/bot.png" className="invert-100 w-7 place-self-center-safe"/>
                </button>
                <button className="h-10 w-10"><img src="/add.png" className="invert-100"/></button>
                <button onClick={handleLogout}>L</button>
            </div>
        </div>
    );
}