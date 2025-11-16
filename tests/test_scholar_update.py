import pytest
import asyncio
from unittest.mock import MagicMock, patch, AsyncMock
import sys
import os

test_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.abspath(os.path.join(test_dir, '..', '..'))
if project_root not in sys.path:
    sys.path.insert(0, project_root)

from backend.modes.scholar_update import update_scholar_data_for_departments, update_scholar_data_missing

pytestmark = pytest.mark.asyncio

@pytest.fixture
def mock_db_manager(mocker):
    """
    Fixture para o 'update_scholar_data_for_departments'.
    """
    mock_db = MagicMock()
    mock_db.load_data.return_value = [
        {
            "nome": "Prof A (Alvo, Com Dados)", 
            "departamento": "DEPTO_ALVO", 
            "pagina_sigaa_url": "url_A",
            "dados_scholar": {"metricas_citacao": "DADOS ANTIGOS A"} 
        },
        {
            "nome": "Prof B (Alvo, Faltando Dados)", 
            "departamento": "DEPTO_ALVO", 
            "pagina_sigaa_url": "url_B",
            "dados_scholar": None 
        },
         {
            "nome": "Prof C (Ignorado)", 
            "departamento": "OUTRO_DEPTO", 
            "pagina_sigaa_url": "url_C",
            "dados_scholar": None
        }
    ]
    
    mocker.patch('backend.modes.scholar_update.DatabaseManager', return_value=mock_db)
    return mock_db

async def test_scholar_update_DEPARTMENTS_modo_completo(mocker, mock_db_manager):
    """
    Testa o modo DEPARTAMENTO (COMPLETO): missing_only=False (padrão).
    Deve tentar atualizar TODOS os professores do depto (A e B).
    """
    mock_scraper_results_map = {
        "url_A": {"metricas_citacao": "DADOS NOVOS A"},
        "url_B": {"metricas_citacao": "DADOS NOVOS B"}
    }
    
    mock_future = asyncio.Future()
    mock_future.set_result([mock_scraper_results_map])
    mocker.patch('backend.modes.scholar_update.asyncio.gather', return_value=mock_future)

    mock_chunk_list = mocker.patch('backend.modes.scholar_update.utils.chunk_list')

    target_depts = ["DEPTO_ALVO"]
    await update_scholar_data_for_departments(target_depts)

    lista_enviada = mock_chunk_list.call_args[0][0]
    assert len(lista_enviada) == 2
    assert "url_A" in (p.get("pagina_sigaa_url") for p in lista_enviada)
    assert "url_B" in (p.get("pagina_sigaa_url") for p in lista_enviada)
    
    mock_db_manager.write_data.assert_called_once()
    final_data_saved = mock_db_manager.write_data.call_args[0][0]
    
    prof_a = next(p for p in final_data_saved if p["pagina_sigaa_url"] == "url_A")
    assert prof_a["dados_scholar"]["metricas_citacao"] == "DADOS NOVOS A" 
    
    prof_b = next(p for p in final_data_saved if p["pagina_sigaa_url"] == "url_B")
    assert prof_b["dados_scholar"]["metricas_citacao"] == "DADOS NOVOS B" 

async def test_scholar_update_DEPARTMENTS_missing_only(mocker, mock_db_manager):
    """
    Testa o modo HÍBRIDO (sua sugestão de teste):
    --scholar-dept "DEPTO_ALVO" --missing
    Deve rodar SÓ para o Prof B (que tem dados nulos E nome).
    """
    mock_scraper_results_map = {
        "url_B": {"metricas_citacao": "DADOS NOVOS B"}
    }
    
    mock_future = asyncio.Future()
    mock_future.set_result([mock_scraper_results_map])
    mocker.patch('backend.modes.scholar_update.asyncio.gather', return_value=mock_future)
    
    mock_chunk_list = mocker.patch('backend.modes.scholar_update.utils.chunk_list')

    target_depts = ["DEPTO_ALVO"]
    await update_scholar_data_for_departments(target_depts, missing_only=True)

    lista_enviada = mock_chunk_list.call_args[0][0]
    assert len(lista_enviada) == 1
    assert lista_enviada[0]["pagina_sigaa_url"] == "url_B"
    
    mock_db_manager.write_data.assert_called_once()
    final_data_saved = mock_db_manager.write_data.call_args[0][0]

    prof_a = next(p for p in final_data_saved if p["pagina_sigaa_url"] == "url_A")
    assert prof_a["dados_scholar"]["metricas_citacao"] == "DADOS ANTIGOS A" 

    prof_b = next(p for p in final_data_saved if p["pagina_sigaa_url"] == "url_B")
    assert prof_b["dados_scholar"]["metricas_citacao"] == "DADOS NOVOS B"

@pytest.fixture
def mock_db_manager_missing(mocker):
    """
    Fixture específica para a função 'update_scholar_data_missing'.
    """
    mock_db = MagicMock()
    mock_db.load_data.return_value = [
        {"nome": "Prof A", "pagina_sigaa_url": "url_A", "dados_scholar": None}, 
        {"nome": None, "pagina_sigaa_url": "url_B", "dados_scholar": None}, 
        {"nome": "Prof C", "pagina_sigaa_url": "url_C", "dados_scholar": {"metricas": "..."}},
    ]
    mocker.patch('backend.modes.scholar_update.DatabaseManager', return_value=mock_db)
    return mock_db

async def test_scholar_update_MISSING_GLOBAL_eficiencia(mocker, mock_db_manager_missing):
    """
    Testa a função global 'update_scholar_data_missing'
    E a sua otimização (não rodar se 'nome' for nulo).
    """
    mock_core_func = mocker.patch(
        'backend.modes.scholar_update._run_scholar_update_for_professors', 
        new_callable=AsyncMock 
    )

    await update_scholar_data_missing()
    
    mock_core_func.assert_called_once()
    lista_de_profs_passada = mock_core_func.call_args[0][0] 

    assert len(lista_de_profs_passada) == 1
    assert lista_de_profs_passada[0]["pagina_sigaa_url"] == "url_A"
    
    mock_db_manager_missing.write_data.assert_called_once()

async def test_scholar_update_DEPARTMENTS_nao_encontrado(mocker, mock_db_manager):
    """
    Testa o 'update_scholar_data_for_departments' quando não há deptos para rodar
    """
    mock_core_func = mocker.patch(
        'backend.modes.scholar_update._run_scholar_update_for_professors', 
        new_callable=AsyncMock
    )
    
    target_depts = ["DEPTO_INEXISTENTE"]
    await update_scholar_data_for_departments(target_depts, missing_only=False)

    mock_core_func.assert_called_once()
    lista_de_profs_passada = mock_core_func.call_args[0][0]
    assert len(lista_de_profs_passada) == 0

    mock_db_manager.write_data.assert_called_once()