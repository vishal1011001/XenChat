import { useRef, useEffect } from "react";

export function useWebSocket(userUid, setConversations, setMessages) {
    const socketRef = useRef(null);

    useEffect(() => {
        const socket = new WebSocket(
            `ws://localhost:8000/ws/${userUid}`
        )
        socketRef.current = socket;

        socket.onopen = () => {
            console.log('websocket connection established');
        }

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);

            if (data.req === 'send_msg') {
                delete data.req;
                setMessages(prevM => [...prevM, data]);
            } else if (data.req == 'edit_msg') {
                setMessages(prevM => prevM.map(msg => (
                    msg.message_uid === data.message_uid ? {...msg, content: data.new_content, edited_at: data.edited_at} : msg
                )))
            } else if (data.req === 'delete_msg') {
                const message_uid = data.message_uid;
                setMessages(prevM => prevM.filter(msg => msg.message_uid !== message_uid));
            } else if (data.req === 'create_conv') {
                // Removing req field, and currUsername from member_usernames list
                delete data.req
                const currUsername = JSON.parse(localStorage.getItem('xen_user_data')).username;
                data.member_usernames = data.member_usernames.filter(uname => uname != currUsername);
                
                setConversations(prev => [data, ...prev]);
            }
        }

        socket.onerror = (error) => {
            console.log("Websocket error:", error);
        }

        socket.onclose = () => {
            console.log("websocket disconnected");
        }

        return () => {
            socket.close();
            socketRef.current = null;
        }

    }, [userUid]);

    const sendMessage = (data) => {
        if (socketRef.current?.readyState === WebSocket.OPEN) {
            socketRef.current.send(
                JSON.stringify(data)
            );
        }
    }

    return sendMessage;
}