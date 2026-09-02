from .ConnectionManager import ConnectionManager
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from src.chats.service import ChatService
from src.db.main import session_factory
import uuid

router = router_ws = APIRouter()
chat_service = ChatService()

manager = ConnectionManager()

@router.websocket('/ws/{client_id}')
async def websocket_endpoint(websocket: WebSocket, client_id):
    await manager.connect(websocket, uuid.UUID(client_id))
    try:
        # continuosly listening for data
        while True:
            data = await websocket.receive_json()
            
            # Database operation
            async with session_factory() as session:
                if data['req'] == 'delete_msg':
                    await chat_service.delete_message(
                        message_uid=data['message_uid'], 
                        session=session
                    )
                elif data['req'] == 'send_msg':
                    new_msg_obj = await chat_service.register_message(
                        message=data,
                        session=session
                    )
            
            payload = {}
            if data['req'] == 'delete_msg':
                payload = data
            elif data['req'] == 'send_msg':
                payload = {
                    "req": "send_msg",
                    "message_uid": str(new_msg_obj.message_uid),
                    "content": new_msg_obj.content,
                    "conv_uid": str(new_msg_obj.conv_uid),
                    "sender_uid": str(new_msg_obj.sender_uid),
                    "sent_at": new_msg_obj.sent_at.isoformat() if new_msg_obj.sent_at else None
                }
            
            #broadcasting message to all conversation members - that are online
            conv_uid = data['conv_uid']
            
            member_uids = await chat_service.conv_members(conv_uid, session)

            await manager.broadcast(member_uids, payload)
            
    except WebSocketDisconnect:
        await manager.disconnect(websocket)