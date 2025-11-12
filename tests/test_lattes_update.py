import pytest
import asyncio
from unittest.mock import MagicMock, patch, AsyncMock
import sys
import os

test_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.abspath(os.path.join(test_dir, '..', '..'))
if project_root not in sys.path:
    sys.path.insert(0, project_root)

from backend.modes.lattes_update import update_lattes_data_for_departments, update_lattes_data_missing

pytestmark = pytest.mark.asyncio

@pytest.fixture
def mock_db_manager(mocker):
    """
    Fixture para o 'update_lattes_data_for_departments'.
    """
    mock_db = MagicMock()
    mock_db.load_data.return_value = [
        {
            "nome": "Prof A (Alvo, Com Dados)", 
            "departamento": "DEPTO_ALVO", 
            "pagina_sigaa_url": "url_A", 
            "lattes_url": "http://lattes.cnpq.br/lattes_A_url", 
            "dados_lattes": {"resumo_cv": "Resumo ANTIGO A"}
        },
        {
            "nome": "Prof B (Alvo, Faltando Dados)", 
            "departamento": "DEPTO_ALVO", 
            "pagina_sigaa_url": "url_B",
            "lattes_url": "http://lattes.cnpq.br/lattes_B_url",
            "dados_lattes": None
        },
         {
            "nome": "Prof C (Ignorado)", 
            "departamento": "OUTRO_DEPTO", 
            "pagina_sigaa_url": "url_C",
            "lattes_url": "http://lattes.cnpq.br/lattes_C_url",
            "dados_lattes": None
        }
    ]
    
    mocker.patch('backend.modes.lattes_update.DatabaseManager', return_value=mock_db)
    return mock_db

async def test_lattes_update_DEPARTMENTS_modo_completo(mocker, mock_db_manager):
    """
    Testa o modo DEPARTAMENTO (COMPLETO): missing_only=False (padrão).
    Deve tentar atualizar TODOS os professores do depto (A e B).
    """
    mock_scraper_results = [
        {"status": "success", "url": "http://lattes.cnpq.br/lattes_A_url", "dados_lattes": {"resumo_cv": "Resumo NOVO A"}},
        {"status": "success", "url": "http://lattes.cnpq.br/lattes_B_url", "dados_lattes": {"resumo_cv": "Resumo NOVO B"}}
    ]
    
    mock_to_thread = mocker.patch(
        'backend.modes.lattes_update.asyncio.to_thread', 
        return_value=mock_scraper_results
    )
    mocker.patch(
        'backend.modes.lattes_update.asyncio.gather', 
        return_value=asyncio.Future()
    ).return_value.set_result([mock_scraper_results]) 
    
    mock_chunk_list = mocker.patch('backend.modes.lattes_update.utils.chunk_list')

    target_depts = ["DEPTO_ALVO"]
    await update_lattes_data_for_departments(target_depts, missing_only=False)

    lista_enviada = mock_chunk_list.call_args[0][0]
    lista_esperada = ["http://lattes.cnpq.br/lattes_A_url", "http://lattes.cnpq.br/lattes_B_url"]
    assert set(lista_enviada) == set(lista_esperada)
    
    mock_db_manager.write_data.assert_called_once()
    final_data_saved = mock_db_manager.write_data.call_args[0][0]
    
    prof_a = next(p for p in final_data_saved if p["pagina_sigaa_url"] == "url_A")
    assert prof_a["dados_lattes"]["resumo_cv"] == "Resumo NOVO A" 
    
    prof_b = next(p for p in final_data_saved if p["pagina_sigaa_url"] == "url_B")
    assert prof_b["dados_lattes"]["resumo_cv"] == "Resumo NOVO B"

async def test_lattes_update_DEPARTMENTS_missing_only(mocker, mock_db_manager):
    """
    Testa o modo HÍBRIDO (sua sugestão de teste):
    --lattes-dept "DEPTO_ALVO" --missing
    Deve rodar SÓ para o Prof B (que tem dados nulos E lattes_url).
    """
    mock_scraper_results = [
        {"status": "success", "url": "http://lattes.cnpq.br/lattes_B_url", "dados_lattes": {"resumo_cv": "Resumo NOVO B"}}
    ]
    
    mock_to_thread = mocker.patch(
        'backend.modes.lattes_update.asyncio.to_thread', 
        return_value=mock_scraper_results
    )
    mocker.patch(
        'backend.modes.lattes_update.asyncio.gather', 
        return_value=asyncio.Future()
    ).return_value.set_result([mock_scraper_results])
    
    mock_chunk_list = mocker.patch('backend.modes.lattes_update.utils.chunk_list')

    target_depts = ["DEPTO_ALVO"]
    await update_lattes_data_for_departments(target_depts, missing_only=True)

    lista_enviada = mock_chunk_list.call_args[0][0]
    lista_esperada = ["http://lattes.cnpq.br/lattes_B_url"]
    assert set(lista_enviada) == set(lista_esperada)
    
    mock_db_manager.write_data.assert_called_once()
    final_data_saved = mock_db_manager.write_data.call_args[0][0]
    
    prof_a = next(p for p in final_data_saved if p["pagina_sigaa_url"] == "url_A")
    assert prof_a["dados_lattes"]["resumo_cv"] == "Resumo ANTIGO A" 
    
    prof_b = next(p for p in final_data_saved if p["pagina_sigaa_url"] == "url_B")
    assert prof_b["dados_lattes"]["resumo_cv"] == "Resumo NOVO B"

@pytest.fixture
def mock_db_manager_missing(mocker):
    """
    Fixture específica para a função 'update_lattes_data_missing'.
    """
    mock_db = MagicMock()
    mock_db.load_data.return_value = [
        {"nome": "Prof A", "pagina_sigaa_url": "url_A", "dados_lattes": None, "lattes_url": "http://lattes.cnpq.br/A"}, 
        {"nome": "Prof B", "pagina_sigaa_url": "url_B", "dados_lattes": None, "lattes_url": None}, 
        {"nome": "Prof C", "pagina_sigaa_url": "url_C", "dados_lattes": {"resumo": "..."}, "lattes_url": "http://lattes.cnpq.br/C"},
    ]
    mocker.patch('backend.modes.lattes_update.DatabaseManager', return_value=mock_db)
    return mock_db

async def test_lattes_update_MISSING_GLOBAL_eficiencia(mocker, mock_db_manager_missing):
    """
    Testa a função global 'update_lattes_data_missing'
    E a sua otimização (não rodar se 'lattes_url' for nulo).
    """
    mock_core_func = mocker.patch(
        'backend.modes.lattes_update._run_lattes_update_for_professors', 
        new_callable=AsyncMock
    )

    await update_lattes_data_missing()

    mock_core_func.assert_called_once()
    lista_de_profs_passada = mock_core_func.call_args[0][0] 
    
    assert len(lista_de_profs_passada) == 1
    assert lista_de_profs_passada[0]["pagina_sigaa_url"] == "url_A"
    
    mock_db_manager_missing.write_data.assert_called_once()

async def test_lattes_update_DEPARTMENTS_nao_encontrado(mocker, mock_db_manager):
    """
    Testa o 'update_lattes_data_missing' quando não há deptos para rodar
    """
    mock_core_func = mocker.patch(
        'backend.modes.lattes_update._run_lattes_update_for_professors', 
        new_callable=AsyncMock
    )
    
    target_depts = ["DEPTO_INEXISTENTE"]
    await update_lattes_data_for_departments(target_depts, missing_only=False)

    mock_core_func.assert_not_called()
    mock_db_manager.write_data.assert_not_called()