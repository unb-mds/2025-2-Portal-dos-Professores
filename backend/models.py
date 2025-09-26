from pydantic import BaseModel
from typing import Optional

class Professor(BaseModel):
    id: int  
    nome: str
    departamento: Optional[str] = None
    foto_url: Optional[str] = None
    pagina_sigaa_url: Optional[str] = None

    class Config:
        from_attributes = True