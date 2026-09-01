import { useEffect, useState } from "react";

export function SearchBar({ conversations, setConvToDisplay }) {
    const [searchText, setSearchText] = useState('');
    const changeSearchText = (e) => {
        setSearchText(e.target.value)
    }
    
    const filteredChats = conversations.filter(
        convs => convs.member_usernames.some(item => item.includes(searchText))
    );

    useEffect(() => {
        if (searchText === '') {
            setConvToDisplay(conversations);
        } else {
            setConvToDisplay(filteredChats);
        }
    }, [searchText, conversations]);

    return (
        <div className="flex justify-center">
            <input
                value={searchText}
                onChange={changeSearchText}
                placeholder="Search chats" className="bg-slate-700 p-2 pl-3 rounded-l-xl text-white placeholder-white w-[85%] outline-0"
            />
            <button onClick={() => setSearchText('')} 
                className="text-white text-xl bg-slate-700 rounded-r-xl px-3 text-center"
            >ⓧ</button>
        </div>
    );
};