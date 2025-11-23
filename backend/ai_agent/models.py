from pydantic import BaseModel
from typing import Optional

class AlunoQuery(BaseModel):
    nome: str
    curso: str
    tipo_projeto: str = "TCC"
    interesses: str
    habilidades: Optional[str] = ""