from fastapi import WebSocket, WebSocketDisconnect

class SocketConnection:
    def __init__(self, client_id: uuid.UUID, websocket: WebSocket):
        self.client_id = client_id
        self.websocket = websocket
        

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[SocketConnection] = []
        
    async def find_connection(self, member_uid):
        for connection in self.active_connections:
            if connection.client_id == member_uid:
                return connection
        
    async def connect(self, websocket: WebSocket, client_id: uuid.UUID):
        await websocket.accept()
        self.active_connections = [c for c in self.active_connections if c.client_id != client_id]
        new_conn = SocketConnection(client_id, websocket)
        self.active_connections.append(new_conn)
        
    async def disconnect(self, websocket: WebSocket):
        for conn in self.active_connections:
            if conn.websocket == websocket:
                self.active_connections.remove(conn)
                break
        
    async def send_personal_message(self, message:dict, websocket: WebSocket):
        try:
            await websocket.send_json(message)
        except Exception:
            await self.disconnect(websocket)
        
    async def broadcast(self, member_uids: List, message: dict):
        receivers = []
        for member_uid in member_uids:
            receiver = await self.find_connection(member_uid)
            if receiver:
                receivers.append(receiver.websocket)
        
        for connection in receivers:
            await self.send_personal_message(message, connection)
 