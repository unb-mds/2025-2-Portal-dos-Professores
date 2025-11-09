import pytest
import asyncio
from unittest.mock import MagicMock, patch

import sys
import os

test_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.abspath(os.path.join(test_dir, '..', '..'))
if project_root not in sys.path:
    sys.path.insert(0, project_root)
from backend.modes.sigaa_update import update_sigaa_data_all

pytestmark = pytest.mark.asyncio

async def test_sigaa_update_merge_logic(mocker):
    """
    Testa o "Caminho Feliz" (o mais importante).
    Verifica se o SIGAA:
    1. Atualiza um professor existente.
    2. PRESERVA os dados do Lattes desse professor.
    3. Adiciona um professor novo.
    """

    mock_db = MagicMock()
    existing_data = [
        {
            "nome": "Prof Antigo", 
            "pagina_sigaa_url": "url_prof_A",
            "lattes_url": "url_lattes_antiga", 
            "dados_lattes": {"resumo_cv": "DADOS LATTES QUE DEVEM SER PRESERVADOS"}
        }
    ]
    mock_db.load_data.return_value = existing_data

    mocker.patch('backend.modes.sigaa_update.DatabaseManager', return_value=mock_db)

    scraper_results = [
        {
            "nome": "Prof A (Nome Atualizado)", 
            "pagina_sigaa_url": "url_prof_A",
            "lattes_url": "url_lattes_NOVA"  
        },
        {
            "nome": "Prof Novo B", 
            "pagina_sigaa_url": "url_prof_B",
            "lattes_url": "url_lattes_nova_B"
        }
    ]

    mock_future = asyncio.Future()
    mock_future.set_result(scraper_results)
    
    mock_scraper_instance = MagicMock()
    mock_scraper_instance.scrape_professors_by_department.return_value = mock_future

    mocker.patch('backend.modes.sigaa_update.SigaaScraper', return_value=mock_scraper_instance)

    await update_sigaa_data_all()

    mock_db.write_data.assert_called_once()
    final_data_saved = mock_db.write_data.call_args[0][0]
    
    assert len(final_data_saved) == 2

    prof_a = next(p for p in final_data_saved if p["pagina_sigaa_url"] == "url_prof_A")
    assert prof_a["nome"] == "Prof A (Nome Atualizado)"
    assert prof_a["lattes_url"] == "url_lattes_NOVA"
    assert prof_a["dados_lattes"] == {"resumo_cv": "DADOS LATTES QUE DEVEM SER PRESERVADOS"}

    prof_b = next(p for p in final_data_saved if p["pagina_sigaa_url"] == "url_prof_B")
    assert prof_b["nome"] == "Prof Novo B"
    assert prof_b["dados_lattes"] is None


async def test_sigaa_update_scraper_fails(mocker):
    """
    Testa o "Caminho Triste": O que acontece se o scraper der erro?
    O seu código NÃO DEVE salvar nada (deve abortar).
    """

    mock_db = MagicMock()
    mock_db.load_data.return_value = []
    mocker.patch('backend.modes.sigaa_update.DatabaseManager', return_value=mock_db)

    mock_scraper_instance = MagicMock()
    mock_scraper_instance.scrape_professors_by_department.side_effect = Exception("Erro de rede simulado")
    
    mocker.patch('backend.modes.sigaa_update.SigaaScraper', return_value=mock_scraper_instance)

    await update_sigaa_data_all()

    mock_db.write_data.assert_not_called()