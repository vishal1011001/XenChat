import { HeaderBar } from "./ChatAreaComponents/HeaderBar";
import { MessageCompose } from "./ChatAreaComponents/MessageCompose";
import { Messages } from "./ChatAreaComponents/Messages";

export function ChatArea() {

    const messages = [
        {
            uid: "msg001",
            content: "Hello. How are you?",
            time_stamp: "2026-07-27 11:23:00",
            sender_self: true
        },
        {
            uid: "msg002",
            content: "Hello. I am fine, how about you?",
            time_stamp: "2026-07-27 11:24:00",
            sender_self: false
        },
        {
            uid: "msg003",
            content: "I am fine too.",
            time_stamp: "2026-07-27 11:25:00",
            sender_self: true
        },
        {
            uid: "msg004",
            content: "So....What's the agenda today?",
            time_stamp: "2026-07-27 11:25:00",
            sender_self: false
        },
        {
            uid: "msg005",
            content: "So I was thinking if we could maybe, go outside somewhere, have some fun..... and maybe we should build a project together...like a real time chat application.",
            time_stamp: "2026-07-27 11:26:00",
            sender_self: true
        },
        {
            uid: "msg006",
            content: "That sounds like a great plan! A real-time chat app would be awesome to build.",
            time_stamp: "2026-07-27 11:27:00",
            sender_self: false
        },
        {
            uid: "msg007",
            content: "Awesome! Should we grab coffee first and brainstorm the tech stack?",
            time_stamp: "2026-07-27 11:28:00",
            sender_self: true
        },
        {
            uid: "msg008",
            content: "Definitely. Coffee first, coding later. Where do you want to meet?",
            time_stamp: "2026-07-27 11:28:30",
            sender_self: false
        },
        {
            uid: "msg009",
            content: "How about that new place downtown? The one with good Wi-Fi.",
            time_stamp: "2026-07-27 11:29:15",
            sender_self: true
        },
        {
            uid: "msg10",
            content: "Perfect. Let's aim for 12:30 PM. What tech stack are you thinking for the app?",
            time_stamp: "2026-07-27 11:30:00",
            sender_self: false
        },
        {
            uid: "msg011",
            content: "I was thinking Node.js, Express, and Socket.io for the backend, and React for the frontend.",
            time_stamp: "2026-07-27 11:31:00",
            sender_self: true
        },
        {
            uid: "msg012",
            content: "Nice! Socket.io makes handling WebSocket events pretty straightforward.",
            time_stamp: "2026-07-27 11:32:10",
            sender_self: false
        },
        {
            uid: "msg013",
            content: "Exactly. We can also add user authentication and room support if we have time.",
            time_stamp: "2026-07-27 11:33:00",
            sender_self: true
        },
        {
            uid: "msg014",
            content: "Sounds like a solid weekend project. Should I bring my laptop to the cafe?",
            time_stamp: "2026-07-27 11:34:20",
            sender_self: false
        },
        {
            uid: "msg015",
            content: "Yeah, bring it! We can wireframe the UI and set up the GitHub repository while we're there.",
            time_stamp: "2026-07-27 11:35:00",
            sender_self: true
        },
        {
            uid: "msg016",
            content: "Great, I'll head out in 20 minutes. See you soon!",
            time_stamp: "2026-07-27 11:36:00",
            sender_self: false
        },
        {
            uid: "msg017",
            content: "See you there!",
            time_stamp: "2026-07-27 11:36:45",
            sender_self: true
        },
        {
            uid: "msg018",
            content: "Wait, before you leave—do you prefer TypeScript or plain JavaScript for the React frontend?",
            time_stamp: "2026-07-27 11:37:15",
            sender_self: false
        },
        {
            uid: "msg019",
            content: "TypeScript for sure! It saves so much time with props and socket payload types.",
            time_stamp: "2026-07-27 11:38:00",
            sender_self: true
        },
        {
            uid: "msg020",
            content: "Agreed. TypeScript it is. Should we use Tailwind CSS for quick styling?",
            time_stamp: "2026-07-27 11:38:40",
            sender_self: false
        },
        {
            uid: "msg021",
            content: "Tailwind would be perfect. We can build a slick dark mode chat UI really fast.",
            time_stamp: "2026-07-27 11:39:20",
            sender_self: true
        },
        {
            uid: "msg022",
            content: "Love dark mode. What about database storage for chat history? MongoDB or PostgreSQL?",
            time_stamp: "2026-07-27 11:40:10",
            sender_self: false
        },
        {
            uid: "msg023",
            content: "MongoDB with Mongoose. Unstructured message payloads and quick setup fit our timeline better today.",
            time_stamp: "2026-07-27 11:41:00",
            sender_self: true
        },
        {
            uid: "msg024",
            content: "Makes total sense. I'll spin up a quick local Docker instance for Mongo when I get there.",
            time_stamp: "2026-07-27 11:41:45",
            sender_self: false
        },
        {
            uid: "msg025",
            content: "Awesome! I'm already packing my bag. Do you want me to grab a table near a power outlet?",
            time_stamp: "2026-07-27 11:42:30",
            sender_self: true
        },
        {
            uid: "msg026",
            content: "Yes please, battery life on my laptop isn't great today.",
            time_stamp: "2026-07-27 11:43:10",
            sender_self: false
        },
        {
            uid: "msg027",
            content: "Got it. I'll get there early and secure a good spot.",
            time_stamp: "2026-07-27 11:44:00",
            sender_self: true
        },
        {
            uid: "msg028",
            content: "Thanks! Order me an iced Americano if you get to order first.",
            time_stamp: "2026-07-27 11:44:40",
            sender_self: false
        },
        {
            uid: "msg029",
            content: "Will do. Cold brew for me, iced Americano for you. Catch you in a bit!",
            time_stamp: "2026-07-27 11:45:15",
            sender_self: true
        },
        {
            uid: "msg030",
            content: "On my way!",
            time_stamp: "2026-07-27 11:46:00",
            sender_self: false
        },
        {
            uid: "msg030",
            content: "Running phast phast!!",
            time_stamp: "2026-07-27 11:46:00",
            sender_self: false
        }
    ];


    return (
        <div className="h-screen bg-[url('/chat-bg.jpg')] bg-cover bg-fixed w-full flex flex-col justify-between pb-2 pt-15 overflow-scroll scrollbar-none scroll-auto scroll">
            <HeaderBar />

            <Messages messages={messages} />
            
            <MessageCompose />
        </div>
    );
}