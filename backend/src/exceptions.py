from fastapi import FastAPI, status
from typing import Any, Callable
from fastapi.responses import JSONResponse
from fastapi.requests import Request

class XenChatException(Exception):
    '''Base Class for all exceptions in XenChat app'''
    pass

class UserNotFoundException(XenChatException):
    '''User does not exist'''
    pass

class UserAlreadyExistsException(XenChatException):
    '''A user with given email/username is already registered'''
    pass

class InvalidCredentialsException(XenChatException):
    '''Wrong password or email or username'''
    pass

class InvalidTokenException(XenChatException):
    '''Provided token is not a valid JWT token'''
    pass

class ExpiredTokenException(XenChatException):
    '''Token is expired'''
    pass

class ChatNotFoundException(XenChatException):
    '''Chat/Conversation does not exist'''
    pass

class MessageNotFoundException(XenChatException):
    '''Message with given message_uid does not exist'''
    pass

class FileNotFoundException(XenChatException):
    '''File does not exist'''
    pass


def create_exception_handler(
    status_code: int, 
    initial_detail: Any
) -> Callable[[Request, XenChatException], JSONResponse]:
    
    async def exception_handler(
        request: Request, 
        exc: XenChatException
    ) -> JSONResponse:
        
        return JSONResponse(
            content=initial_detail,
            status_code=status_code
        )
    
    return exception_handler

def register_exception(app: FastAPI):
    @app.exception_handler(500)
    async def internal_server_error(request: Request, exc: Exception):
        return JSONResponse(
            content={
                "message": "Something went wrong",
                "error_code": "server_error"
            },
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    
    app.add_exception_handler(
        UserNotFoundException,
        create_exception_handler(
            status_code=status.HTTP_404_NOT_FOUND,
            initial_detail={
                "message": "User not found",
                "resolution": "Create an account OR Try entering different username or email",
                "error_code": "user_not_found"
            }
        )
    )
    
    app.add_exception_handler(
        UserAlreadyExistsException,
        create_exception_handler(
            status_code=status.HTTP_400_BAD_REQUEST,
            initial_detail={
                "message": "User already exists",
                "resolution": "Log into existing account, or create new account with a different username/email",
                "error_code": "user_already_exists"
            }
        )
    )
    
    app.add_exception_handler(
        InvalidCredentialsException,
        create_exception_handler(
            status_code=status.HTTP_401_UNAUTHORIZED,
            initial_detail={
                "message": "Invalid username/email or password",
                "resolution": "Enter correct username or password",
                "error_code": "invalid_credentials"
            }
        )
    )
    
    app.add_exception_handler(
        InvalidTokenException,
        create_exception_handler(
            status_code=status.HTTP_401_UNAUTHORIZED,
            initial_detail={
                "message": "Token is not valid",
                "resolution": "Get a new refresh/access token. Try logging in again",
                "error_code": "invalid_token"
            }
        )
    )
    
    app.add_exception_handler(
        ExpiredTokenException,
        create_exception_handler(
            status_code=status.HTTP_401_UNAUTHORIZED,
            initial_detail={
                "message": "Token is expired",
                "resolution": "Get a new token",
                "error_code": "expired_token"
            }
        )
    )
    
    app.add_exception_handler(
        ChatNotFoundException,
        create_exception_handler(
            status_code=status.HTTP_404_NOT_FOUND,
            initial_detail={
                "message": "Chat does not exist",
                "resolution": "Start new chat with the user(s)",
                "error_code": "chat_not_found"
            }
        )
    )
    
    app.add_exception_handler(
        MessageNotFoundException,
        create_exception_handler(
            status_code=status.HTTP_404_NOT_FOUND,
            initial_detail={
                "message": "Message not found",
                "resolution": "Cannot edit a non-existing message, send new message",
                "error_code": "message_not_found"
            }
        )
    )
    
    app.add_exception_handler(
        FileNotFoundException,
        create_exception_handler(
            status_code=status.HTTP_404_NOT_FOUND,
            initial_detail={
                "message": "File not found",
                "resolution": "Try uploading the file",
                "error_code": "file_not_found"
            }
        )
    )
    
    