import uuid
from typing import List, Optional
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
        self.active_connections = [c for c in self.active_connections if str(c.client_id) != str(client_id)]
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
        except Exception as e:
            print("SEND JSON FAILED")
            print("EXCEPTION TYPE:", type(e))
            print("EXCEPTION:", repr(e))
            await self.disconnect(websocket)
        
    async def broadcast(self, member_uids: List, message: dict):
        receivers = []

        # Find websocket object and append it to receivers
        for member_uid in member_uids:
            receiver = await self.find_connection(member_uid)
            if receiver:
                receivers.append(receiver.websocket)

        # Send personal message to all active relevant connections (it's send to only members of relevant conv_uid -> member_uids)
        for connection in receivers:
            await self.send_personal_message(message, connection)
 
manager = ConnectionManager()