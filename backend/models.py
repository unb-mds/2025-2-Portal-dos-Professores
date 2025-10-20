from pydantic import BaseModel, Field
from typing import List, Dict, Optional

class Contatos(BaseModel):
    sala: Optional[str] = None
    telefone: Optional[str] = None
    email: Optional[str] = None

class Professor(BaseModel):
    id: int
    nome: str
    departamento: str
    foto_url: str
    pagina_sigaa_url: str

    descricao_pessoal: Optional[str] = None
    lattes_url: Optional[str] = None
    
    formacao_academica: Dict[str, List[str]] = {}
    contatos: Contatos = {}

    class Config:
        from_attributes = True