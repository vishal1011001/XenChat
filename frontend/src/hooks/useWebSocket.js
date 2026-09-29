import { useRef, useEffect } from "react";
import { markConversationReadLocally, updateLastMessage } from "./utils";

export function useWebSocket(userUid, setConversations, setMessages, activeConvUidRef) {
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

                if (data.conv_uid === activeConvUidRef.current) {
                    sendMessage({
                        req: 'update_last_read',
                        conv_uid: data.conv_uid,
                        user_uid: userUid
                    })
                }
                console.log("MSG:", data.sent_at);

                updateLastMessage(setConversations, data);
                setMessages(prevM => [...prevM, data]);
            } else if (data.req == 'edit_msg') {
                setMessages(prevM => prevM.map(msg => (
                    msg.message_uid === data.message_uid ? {...msg, content: data.new_content, edited_at: data.edited_at} : msg
                )))
            } else if (data.req === 'delete_msg') {
                const message_uid = data.message_uid;
                setMessages(prevM => prevM.filter(msg => msg.message_uid !== message_uid));
            } else if (data.req === 'create_conv') {
                delete data.req
                setConversations(prev => [data, ...prev]);
            } else if (data.req === 'update_last_read') {
                console.log("READ UPDATE:", data.read_time);
                markConversationReadLocally(setConversations, data.conv_uid, data.read_time, data.user_uid);
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