import { useEffect, useState } from "react";

export const useSocket = () => {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const WS_URL = import.meta.env.VITE_WS_URL;

    useEffect(() => {
        const ws = new WebSocket(WS_URL);
        ws.onopen = () => {
            setSocket(ws);
        }
        ws.onclose = () => {
            setSocket(null);
        }

        return () => {
            ws.close();
        }
    }, [])

    return socket;
}