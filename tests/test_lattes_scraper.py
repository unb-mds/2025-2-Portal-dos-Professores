import pytest
from unittest.mock import MagicMock, patch
import sys
import os

test_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.abspath(os.path.join(test_dir, '..', '..'))
if project_root not in sys.path:
    sys.path.insert(0, project_root)
from backend.scrapers.lattes_scraper import scrape_lattes, TimeoutError

def test_scrape_lattes_caminho_facil(mocker):
    """
    Testa o "caminho feliz" do scrape_lattes:
    - O checkbox "Não sou robô" é clicado e magicamente funciona de primeira.
    - O formulário é enviado.
    - O parser é chamado.
    """

    mock_page = MagicMock()
    mock_checkbox_frame = MagicMock()
    mock_checkbox = MagicMock()
    mock_submit_button = MagicMock()

    mock_checkbox.get_attribute.return_value = "true"

    mock_page.frame_locator.return_value = mock_checkbox_frame

    mock_checkbox_frame.locator.return_value = mock_checkbox

    def locator_side_effect(selector):
        if selector == "#submitBtn":
            return mock_submit_button
        return MagicMock()
    
    mock_page.locator.side_effect = locator_side_effect

    mocker.patch('backend.scrapers.lattes_scraper.expect')

    mock_parser_data = {"resumo_cv": "Resumo do Lattes Mockado"}
    mocker.patch(
        'backend.scrapers.lattes_scraper.parse_lattes_page', 
        return_value=mock_parser_data
    )
    
    mocker.patch('backend.scrapers.lattes_scraper.time.sleep')

    url_teste = "http://fake.lattes.url/123"
    resultado = scrape_lattes(mock_page, url_teste, worker_id=99)

    mock_page.goto.assert_called_with(url_teste, wait_until="domcontentloaded", timeout=30000)

    mock_checkbox.click.assert_called_once()

    mock_submit_button.click.assert_called_once()

    assert resultado["status"] == "success"
    assert resultado["url"] == url_teste
    assert resultado["dados_lattes"]["resumo_cv"] == "Resumo do Lattes Mockado"


def test_scrape_lattes_caminho_falha_total(mocker):
    """
    Testa o "caminho triste" principal:
    O que acontece se o 'page.goto' falhar 3 vezes?
    """

    mock_page = MagicMock()

    mock_page.goto.side_effect = TimeoutError("Simulação de timeout no GOTO")

    mocker.patch('backend.scrapers.lattes_scraper.time.sleep')

    url_teste = "http://fake.lattes.url/123"
    resultado = scrape_lattes(mock_page, url_teste, worker_id=99)

    assert mock_page.goto.call_count == 3

    assert resultado["status"] == "error"
    assert resultado["url"] == url_teste
    assert resultado["dados_lattes"] is None