from fastapi import APIRouter, HTTPException
from .models import AlunoQuery
from .service import get_rag_chain, parser

router = APIRouter(
    tags=["Agente IA"]
)

@router.post("/agente/perguntar")
async def perguntar_ao_agente(query: AlunoQuery):
    try:
        rag_chain = get_rag_chain()
        
        ai_message = rag_chain.invoke(query.dict())

        tokens = ai_message.usage_metadata or {}
        
        resposta_json = parser.parse(ai_message.content)

        return {
            "resposta": resposta_json,
            "meta": {
                "total_tokens": tokens.get("total_tokens", 0),
                "prompt_tokens": tokens.get("input_tokens", 0),
                "completion_tokens": tokens.get("output_tokens", 0)
            }
        }

    except Exception as e:
        print(f"ERRO NO RAG: {e}")
        raise HTTPException(status_code=500, detail=f"Erro ao processar IA: {str(e)}")