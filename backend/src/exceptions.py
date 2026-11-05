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

class ChatNotFoundException(XenChatException):
    '''Chat/Conversation does not exist'''
    pass

class InvalidTokenException(XenChatException):
    '''Provided token is not a valid JWT token'''
    pass

class ExpiredTokenException(XenChatException):
    '''Token is expired'''
    pass

class InvalidCredentialsException(XenChatException):
    '''Wrong password or email or username'''
    pass

class UserAlreadyExistsException(XenChatException):
    '''A user with given email/username is already registered'''
    pass

class FileNotFoundException(XenChatException):
    '''File does not exist'''
    pass

class MessageNotFoundException(XenChatException):
    '''Message with given message_uid does not exist'''
    pass


