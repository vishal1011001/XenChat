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

            setMessages(prevM => [...prevM, message]);
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