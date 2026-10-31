export function Menu({ changeSelectedWindow }) {
    
    return (
        <div className="flex flex-col absolute top-15 right-5 bg-slate-900 text-white *:p-2 *:text-left *:hover:bg-slate-800">
            <button onClick={() => changeSelectedWindow('your_profile')}>Your Profile</button>
            <button onClick={() => changeSelectedWindow('manage_chats')}>Manage Chats</button>
            <button onClick={() => changeSelectedWindow('theme')}>Theme</button>
            <button onClick={() => changeSelectedWindow('settings')}>Settings</button>
        </div>
    );
}