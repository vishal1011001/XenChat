import { Chats } from "../components/Chats";
import { Sidebar } from "../components/Sidebar";


export default function HomePage(){
    

    return (
        <div className="h-screen w-screen flex flex-row">
            <Sidebar />
            <Chats />
        </div>
    );
}