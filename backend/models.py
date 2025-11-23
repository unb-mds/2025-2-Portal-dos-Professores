from pydantic import BaseModel
from typing import List, Dict, Optional, Any

class Contatos(BaseModel):
    sala: Optional[str] = None
    telefone: Optional[str] = None
    email: Optional[str] = None

class Professor(BaseModel):
    nome: str
    departamento: str
    pagina_sigaa_url: str 

    foto_url: Optional[str] = None
    descricao_pessoal: Optional[str] = None
    lattes_url: Optional[str] = None
    
    areas_interesse: Optional[List[str]] = []

    formacao_academica: Optional[Dict[str, List[str]]] = {} 
    contatos: Optional[Contatos] = {} 

    dados_lattes: Optional[Dict[str, Any]] = None
    dados_scholar: Optional[Dict[str, Any]] = None
    
    last_updated_lattes: Optional[str] = None
    last_updated_scholar: Optional[str] = None

    class Config:
        from_attributes = True
        extra = "allow"