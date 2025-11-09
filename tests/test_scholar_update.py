import pytest
import asyncio
from unittest.mock import MagicMock, patch
import sys
import os

test_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.abspath(os.path.join(test_dir, '..', '..'))
if project_root not in sys.path:
    sys.path.insert(0, project_root)

from backend.modes.scholar_update import update_scholar_data_for_departments

pytestmark = pytest.mark.asyncio

@pytest.fixture
def mock_db_manager(mocker):
    """
    Um "fixture" do pytest para criar um mock do DatabaseManager.
    """
    mock_db = MagicMock()

    mock_db.load_data.return_value = [
        {
            "nome": "Prof A (Alvo)", 
            "departamento": "DEPTO_ALVO", 
            "pagina_sigaa_url": "url_A",
            "dados_scholar": {"metricas_citacao": "DADOS ANTIGOS A"} 
        },
        {
            "nome": "Prof B (Alvo com Falha)", 
            "departamento": "DEPTO_ALVO", 
            "pagina_sigaa_url": "url_B",
            "dados_scholar": {"metricas_citacao": "DADOS ANTIGOS B"} 
        },
         {
            "nome": "Prof C (Ignorado)", 
            "departamento": "OUTRO_DEPTO", 
            "pagina_sigaa_url": "url_C",
            "dados_scholar": {"metricas_citacao": "DADOS ANTIGOS C"} 
        }
    ]
    
    mocker.patch('backend.modes.scholar_update.DatabaseManager', return_value=mock_db)
    return mock_db

async def test_scholar_update_caminho_misto(mocker, mock_db_manager):
    """
    Testa o "Caminho Misto" (Sucesso E Falha):
    - Prof A deve ser ATUALIZADO.
    - Prof B deve FALHAR e preservar os dados antigos.
    - Prof C deve ser IGNORADO.
    """

    mock_scraper_results_map = {
        "url_A": {"metricas_citacao": "DADOS NOVOS"}, 
        "url_B": None                                  
    }

    mock_future = asyncio.Future()
    mock_future.set_result([mock_scraper_results_map])
    
    mocker.patch('backend.modes.scholar_update.asyncio.gather', return_value=mock_future)

    prof_a_mock = mock_db_manager.load_data.return_value[0]
    prof_b_mock = mock_db_manager.load_data.return_value[1]
    mocker.patch('backend.modes.scholar_update.utils.chunk_list', return_value=[[prof_a_mock, prof_b_mock]])

    target_depts = ["DEPTO_ALVO"]
    await update_scholar_data_for_departments(target_depts)

    mock_db_manager.write_data.assert_called_once()

    final_data_saved = mock_db_manager.write_data.call_args[0][0]
    
    assert len(final_data_saved) == 3

    prof_a = next(p for p in final_data_saved if p["pagina_sigaa_url"] == "url_A")
    assert prof_a["dados_scholar"]["metricas_citacao"] == "DADOS NOVOS" 
    
    prof_b = next(p for p in final_data_saved if p["pagina_sigaa_url"] == "url_B")
    assert prof_b["dados_scholar"]["metricas_citacao"] == "DADOS ANTIGOS B" 

    prof_c = next(p for p in final_data_saved if p["pagina_sigaa_url"] == "url_C")
    assert prof_c["dados_scholar"]["metricas_citacao"] == "DADOS ANTIGOS C"

async def test_scholar_update_no_professors_found(mocker, mock_db_manager):
    """
    Testa o "Caminho Triste": O que acontece se nenhum professor for
    encontrado para o departamento alvo?
    """

    mock_gather = mocker.patch('backend.modes.scholar_update.asyncio.gather')

    target_depts = ["DEPTO_INEXISTENTE"]
    await update_scholar_data_for_departments(target_depts)

    mock_gather.assert_not_called()

    mock_db_manager.write_data.assert_not_called()