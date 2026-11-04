from pydantic import BaseModel

class UpdateAboutResponseModel(BaseModel):
    about: str