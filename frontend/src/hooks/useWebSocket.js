import { useRef, useEffect } from "react";

export function useWebSocket(userUid, setMessages) {
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
            const message = JSON.parse(event.data);

            if (message.req === 'send_msg') {
                delete message.req;
                setMessages(prevM => [...prevM, message]);
            } else if (message.req === 'delete_msg') {
                const message_uid = message.message_uid;
                setMessages(prevM => prevM.filter(msg => msg.message_uid !== message_uid));
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