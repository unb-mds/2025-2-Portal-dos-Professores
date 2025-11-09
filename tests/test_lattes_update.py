import pytest
import asyncio
from unittest.mock import MagicMock, patch
import sys
import os

test_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.abspath(os.path.join(test_dir, '..', '..'))
if project_root not in sys.path:
    sys.path.insert(0, project_root)
from backend.modes.lattes_update import update_lattes_data_for_departments

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
            "lattes_url": "http://lattes.cnpq.br/lattes_A_url", 
            "dados_lattes": {"resumo_cv": "Resumo ANTIGO"}
        },
        {
            "nome": "Prof B (Alvo com Falha)", 
            "departamento": "DEPTO_ALVO", 
            "pagina_sigaa_url": "url_B",
            "lattes_url": "http://lattes.cnpq.br/lattes_B_url_falha",
            "dados_lattes": {"resumo_cv": "Resumo B ANTIGO"}
        },
         {
            "nome": "Prof C (Ignorado)", 
            "departamento": "OUTRO_DEPTO", 
            "pagina_sigaa_url": "url_C",
            "lattes_url": "http://lattes.cnpq.br/lattes_C_url",
            "dados_lattes": {"resumo_cv": "Resumo C ANTIGO"}
        }
    ]
    
    mocker.patch('backend.modes.lattes_update.DatabaseManager', return_value=mock_db)
    return mock_db

async def test_lattes_update_caminho_feliz_e_falha(mocker, mock_db_manager):
    """
    Testa o "Caminho Misto" (Sucesso E Falha):
    - Prof A deve ser ATUALIZADO.
    - Prof B deve FALHAR e preservar os dados antigos.
    - Prof C deve ser IGNORADO.
    """

    mock_scraper_results = [
        [ 
            {"status": "success", "url": "http://lattes.cnpq.br/lattes_A_url", "dados_lattes": {"resumo_cv": "Resumo NOVO"}},
            {"status": "error", "url": "http://lattes.cnpq.br/lattes_B_url_falha", "dados_lattes": None}
        ]
    ]

    mock_future = asyncio.Future()
    mock_future.set_result(mock_scraper_results)
    mocker.patch('backend.modes.lattes_update.asyncio.gather', return_value=mock_future)

    mocker.patch('backend.modes.lattes_update.utils.chunk_list', return_value=[
        ["http://lattes.cnpq.br/lattes_A_url", "http://lattes.cnpq.br/lattes_B_url_falha"]
    ])

    target_depts = ["DEPTO_ALVO"]
    await update_lattes_data_for_departments(target_depts)

    mock_db_manager.write_data.assert_called_once()
    final_data_saved = mock_db_manager.write_data.call_args[0][0]
    
    assert len(final_data_saved) == 3

    prof_a = next(p for p in final_data_saved if p["pagina_sigaa_url"] == "url_A")
    assert prof_a["dados_lattes"]["resumo_cv"] == "Resumo NOVO"

    prof_b = next(p for p in final_data_saved if p["pagina_sigaa_url"] == "url_B")
    assert prof_b["dados_lattes"]["resumo_cv"] == "Resumo B ANTIGO" 

    prof_c = next(p for p in final_data_saved if p["pagina_sigaa_url"] == "url_C")
    assert prof_c["dados_lattes"]["resumo_cv"] == "Resumo C ANTIGO" 

async def test_lattes_update_no_professors_found(mocker, mock_db_manager):
    """
    Testa o "Caminho Triste": O que acontece se nenhum professor for
    encontrado para o departamento alvo?
    """

    mock_gather = mocker.patch('backend.modes.lattes_update.asyncio.gather')

    target_depts = ["DEPTO_INEXISTENTE"]
    await update_lattes_data_for_departments(target_depts)

    mock_gather.assert_not_called()
    mock_db_manager.write_data.assert_not_called()