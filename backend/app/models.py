from pydantic import BaseModel
from typing import List, Optional

class Project(BaseModel):
    id: int
    title: str
    description: Optional[str]
    tags: Optional[List[str]] = []
    difficult: Optional[str]