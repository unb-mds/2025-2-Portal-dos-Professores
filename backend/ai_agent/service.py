import os
from typing import List
from dotenv import load_dotenv
from pydantic import BaseModel, Field
from langchain_core.prompts import PromptTemplate
from langchain_core.runnables import RunnablePassthrough, RunnableLambda
from langchain_core.output_parsers import JsonOutputParser
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from langchain_postgres import PGVector

load_dotenv()

embeddings = GoogleGenerativeAIEmbeddings(model="models/text-embedding-004")
llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", temperature=0.3) 

class RecomendacaoProfessor(BaseModel):
    nome: str = Field(description="Nome exato do professor como encontrado no banco (GERALMENTE EM MAIÚSCULO). Mantenha assim.")
    departamento: str = Field(description="Departamento do professor")
    explicacao: str = Field(description="Uma frase curta e natural explicando o 'match'. Ex: 'Este professor é ideal pois sua pesquisa em X alinha com seu interesse em Y.'")

class RespostaAgente(BaseModel):
    recomendacoes: List[RecomendacaoProfessor] = Field(description="Lista contendo exatamente 3 recomendações")

parser = JsonOutputParser(pydantic_object=RespostaAgente)

def format_docs(docs):
    return "\n\n".join([d.page_content for d in docs])

def format_query(data: dict) -> str:
    return f"Interesses: {data['interesses']}. Habilidades: {data['habilidades']}"

template = """
Você é um orientador acadêmico experiente e atencioso da Universidade de Brasília.
Aluno: {nome} ({curso}). Projeto desejado: "{tipo_projeto}".

Contexto (Professores):
{context}

INSTRUÇÕES:
1. Selecione os 3 professores que melhor se encaixam no perfil.
2. NOME: Mantenha EXATAMENTE como está no texto original (em MAIÚSCULO).
3. DEPARTAMENTO: Copie do texto original.
4. EXPLICAÇÃO: Escreva uma justificativa curta e humanizada (1 frase longa ou 2 curtas). 
   - Não use listas ou tópicos. 
   - Conecte diretamente o interesse do aluno com a especialidade do professor.
   - Exemplo Bom: "Sua experiência com Redes Neurais é perfeita para o seu TCC, além de coordenar um projeto similar na área."
   - Exemplo Ruim: "Interesses: Redes Neurais. Projeto: X."
5. Responda APENAS no formato JSON.

{format_instructions}
"""

prompt = PromptTemplate(
    template=template,
    input_variables=["nome", "curso", "tipo_projeto", "context"],
    partial_variables={"format_instructions": parser.get_format_instructions()},
)

def get_rag_chain():
    db_url = os.getenv("DATABASE_URL")
    if not db_url:
        raise ValueError("DATABASE_URL não configurada no .env")

    vector_store = PGVector(
        embeddings=embeddings,
        collection_name="professores_vectors",
        connection=db_url,
        use_jsonb=True,
    )
    
    retriever = vector_store.as_retriever(search_kwargs={"k": 5})

    rag_chain = (
        {
            "context": RunnableLambda(format_query) | retriever | format_docs,
            "nome": lambda x: x["nome"],
            "curso": lambda x: x["curso"],
            "tipo_projeto": lambda x: x["tipo_projeto"],
            "interesses": lambda x: x["interesses"]
        }
        | prompt
        | llm
    )
    return rag_chain