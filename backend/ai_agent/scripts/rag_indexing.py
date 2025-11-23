import json
import os
import sys
from dotenv import load_dotenv
from tqdm import tqdm
from langchain_core.documents import Document
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_postgres import PGVector
import tiktoken  

sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
load_dotenv()

JSON_PATH = os.path.join(os.path.dirname(__file__), '../../../data/professors.json')
COLLECTION_NAME = "professores_vectors"
BATCH_SIZE = 100

def count_tokens(text: str) -> int:
    """Conta os tokens de um texto usando tiktoken (estimativa precisa)."""
    try:
        encoding = tiktoken.get_encoding("cl100k_base")
        return len(encoding.encode(text))
    except Exception:
        return 0

def process_professor_data(professors_data):
    """Converte o JSON cru em objetos Document do LangChain."""
    docs = []
    for prof in professors_data:
        nome = prof.get('nome', 'N/A')
        depto = prof.get('departamento', 'N/A')
        lattes = prof.get('lattes_url', '')
        
        base_metadata = {"professor_nome": nome, "departamento": depto, "lattes": lattes}

        dados_scholar = prof.get('dados_scholar') or {}
        dados_lattes = prof.get('dados_lattes') or {}

        interesses_lista = dados_scholar.get('areas_interesse') or []
        interesses = ", ".join(interesses_lista)
        resumo = dados_lattes.get('resumo_cv', '')
        
        perfil_text = f"""
        PROFESSOR: {nome}
        DEPARTAMENTO: {depto}
        ÁREAS DE INTERESSE: {interesses}
        RESUMO: {resumo}
        """
        
        docs.append(Document(
            page_content=perfil_text, 
            metadata={**base_metadata, "type": "perfil"}
        ))

        projetos = dados_lattes.get('projetos_pesquisa') or []
        for proj in projetos:
            if not proj: continue
            
            titulo = proj.get('titulo', 'Sem título')
            descricao = proj.get('descricao', '')
            situacao = proj.get('situacao', '')
            
            projeto_text = f"""
            TÍTULO DO PROJETO: {titulo}
            COORDENADOR: {nome}
            DESCRIÇÃO: {descricao}
            SITUAÇÃO: {situacao}
            """
            
            docs.append(Document(
                page_content=projeto_text,
                metadata={**base_metadata, "type": "projeto", "titulo_proj": titulo}
            ))

    return docs

def batch_iterate(lst, batch_size):
    """Função geradora para dividir a lista em pedaços (chunks)."""
    for i in range(0, len(lst), batch_size):
        yield lst[i : i + batch_size]

def main():
    print("--- Iniciando Indexação RAG (Estratégia: Wipe & Load) ---")
    
    db_url = os.getenv("DATABASE_URL")
    if not db_url:
        print("ERRO: DATABASE_URL não encontrada no .env.")
        return

    try:
        embeddings = GoogleGenerativeAIEmbeddings(model="models/text-embedding-004")
    except Exception as e:
        print(f"ERRO ao carregar Embeddings: {e}")
        return

    print("Conectando ao Postgres...")
    try:
        vector_store_temp = PGVector(
            embeddings=embeddings,
            collection_name=COLLECTION_NAME,
            connection=db_url,
            use_jsonb=True,
        )
        
        print("🗑️  Limpando dados antigos (Full Refresh)...")
        vector_store_temp.drop_tables() 
        vector_store_temp.create_tables_if_not_exists() 
        print("✅ Tabelas recriadas.")

        print("🔄 Reinicializando conexão com a coleção...")
        vector_store = PGVector(
            embeddings=embeddings,
            collection_name=COLLECTION_NAME,
            connection=db_url,
            use_jsonb=True,
        )
        vector_store.create_collection() 
        print("✅ Coleção pronta.")
        
    except Exception as e:
        print(f"ERRO de Conexão SQL: {e}")
        return

    print(f"Lendo arquivo: {os.path.abspath(JSON_PATH)}")
    try:
        with open(JSON_PATH, 'r', encoding='utf-8') as f:
            data = json.load(f)
            professors_list = data if isinstance(data, list) else data.get("professors", [])
    except Exception as e:
        print(f"ERRO ao ler JSON: {e}")
        return

    print("Transformando JSON em Documentos...")
    documents = process_professor_data(professors_list)
    total_docs = len(documents)
    
    print("🧮 Calculando estimativa de tokens...")
    total_tokens = sum(count_tokens(doc.page_content) for doc in documents)
    
    print(f"Total de documentos para indexar: {total_docs}")
    print(f"💎 Total Estimado de Tokens de Embedding: {total_tokens}")
    print("-" * 40)

    if total_docs == 0:
        print("Nenhum documento encontrado. Verifique o JSON.")
        return

    print(f"Iniciando upload para o Postgres em lotes de {BATCH_SIZE}...")
    
    try:
        with tqdm(total=total_docs, desc="Enviando", unit="docs") as pbar:
            for batch in batch_iterate(documents, BATCH_SIZE):
                vector_store.add_documents(batch)
                pbar.update(len(batch))
        
        print("\n🎉 Indexação Concluída com Sucesso!")
        print(f"📊 Resumo Final: {total_docs} documentos criados, consumindo aprox. {total_tokens} tokens.")
        
    except Exception as e:
        print(f"\nERRO CRÍTICO durante upload: {e}")

if __name__ == "__main__":
    main()