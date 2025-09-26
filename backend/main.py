import json
from typing import List, Optional
from pathlib import Path 

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from models import Professor

app = FastAPI(
    title="API de Dados de Professores",
    description="Uma API para consultar dados de professores coletados por scrapers, feita para o projeto da MDS.",
    version="1.0.0"
)

origins = [
    "http://localhost:5173",
    "http://localhost",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def load_professors_data() -> List[dict]:
    """
    Carrega os dados dos professores do arquivo JSON de forma inteligente.
    Funciona tanto localmente quanto no Docker.
    """
    docker_path = Path("/app/data/professors.json")
    local_path = Path(__file__).parent.parent / "data" / "professors.json"

    file_path = docker_path if docker_path.exists() else local_path

    if not file_path.exists():
        return []

    try:
        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)
            
            professors_list = data.get("professors", [])
            

            for i, professor in enumerate(professors_list):
                professor['id'] = i + 1 
                
            return professors_list
    except (FileNotFoundError, json.JSONDecodeError):
        return []

professors_db = load_professors_data()


@app.get("/", summary="Rota raiz")
def read_root():
    return {"status": "API de Professores está no ar!"}


@app.get("/professors", response_model=List[Professor], summary="Busca e filtra professores")
def search_professors(
    nome: Optional[str] = Query(None, description="Busca por parte do nome do professor (case-insensitive)"),
    departamento: Optional[str] = Query(None, description="Busca por parte do nome do departamento")
):
    results = professors_db

    if nome:
        results = [p for p in results if p.get('nome') and nome.lower() in p.get('nome').lower()]

    if departamento:
        results = [p for p in results if p.get('departamento') and departamento.lower() in p.get('departamento').lower()]
    
    return results


@app.get("/professors/{professor_id}", response_model=Professor, summary="Busca um professor por ID")
def get_professor_by_id(professor_id: int):
    for professor in professors_db:
        if professor.get('id') == professor_id:
            return professor
    raise HTTPException(status_code=404, detail=f"Professor com ID {professor_id} não encontrado.")