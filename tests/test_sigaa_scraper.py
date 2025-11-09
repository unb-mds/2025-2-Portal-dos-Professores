import pytest
import asyncio
from unittest.mock import MagicMock, patch, AsyncMock
import sys
import os

test_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.abspath(os.path.join(test_dir, '..', '..'))
if project_root not in sys.path:
    sys.path.insert(0, project_root)
from backend.scrapers.sigaa_scraper import SigaaScraper

pytestmark = pytest.mark.asyncio

async def test_scrape_professor_details_caminho_feliz(mocker):
    """
    Testa o "caminho feliz" da função _scrape_professor_details.
    Vamos mockar toda a cadeia do Playwright (Browser, Context, Page, Locators).
    """

    mock_page = MagicMock()
    mock_context = MagicMock()
    mock_browser = MagicMock()

    mock_browser.new_context = AsyncMock(return_value=mock_context)
    mock_context.new_page = AsyncMock(return_value=mock_page)
    mock_context.close = AsyncMock()
    mock_page.goto = AsyncMock()

    mock_desc = MagicMock()
    mock_desc.is_visible = AsyncMock(return_value=True) 
    mock_desc.inner_text = AsyncMock(return_value="Descrição Pessoal Teste")

    mock_lattes = MagicMock()
    mock_lattes.is_visible = AsyncMock(return_value=True)
    mock_lattes.get_attribute = AsyncMock(return_value="http://lattes.cnpq.br/FAKE_LATTES")

    mock_dt1 = MagicMock()
    mock_dt1.evaluate = AsyncMock(return_value='dt') 
    mock_dt1.locator('.ano').inner_text = AsyncMock(return_value='(2020 - 2024)')
    
    mock_dd1 = MagicMock()
    mock_dd1.evaluate = AsyncMock(return_value='dd') 
    mock_dd1.inner_text = AsyncMock(return_value='Doutorado em Testes')
    
    mock_formacao_locator = MagicMock()
    mock_formacao_locator.count = AsyncMock(return_value=2) 
    mock_formacao_locator.nth.side_effect = [mock_dt1, mock_dd1] 

    mock_sala = MagicMock(); mock_sala.is_visible = AsyncMock(return_value=True); mock_sala.inner_text = AsyncMock(return_value="Sala 123")
    mock_tel = MagicMock(); mock_tel.is_visible = AsyncMock(return_value=False) 
    mock_email = MagicMock(); mock_email.is_visible = AsyncMock(return_value=True); mock_email.inner_text = AsyncMock(return_value="teste@unb.br")

    def locator_side_effect(selector):
        if selector == "div#perfil-docente dt:has-text('Descrição pessoal') + dd":
            return MagicMock(first=mock_desc)
        if selector == "#endereco-lattes":
            return MagicMock(first=mock_lattes)
        if selector == "div#formacao-academica dl > *":
            return mock_formacao_locator
        if selector == "div#contato dt:has-text('Sala') + dd":
            return MagicMock(first=mock_sala)
        if selector == "div#contato dt:has-text('Telefone/Ramal') + dd":
            return MagicMock(first=mock_tel)
        if selector == "div#contato dt:has-text('Endereço eletrônico') + dd":
            return MagicMock(first=mock_email)
        return MagicMock() 

    mock_page.locator.side_effect = locator_side_effect

    prof_data_input = {
        "nome": "Professor Teste",
        "pagina_sigaa_url": "http://sigaa.unb.br/fake_url"
    }

    scraper = SigaaScraper()

    dados_extraidos = await scraper._scrape_professor_details(mock_browser, prof_data_input)

    mock_page.goto.assert_called_with("http://sigaa.unb.br/fake_url", timeout=60000, wait_until="load")

    assert dados_extraidos["descricao_pessoal"] == "Descrição Pessoal Teste"
    assert dados_extraidos["lattes_url"] == "http://lattes.cnpq.br/FAKE_LATTES"

    assert "(2020 - 2024)" in dados_extraidos["formacao_academica"]
    assert dados_extraidos["formacao_academica"]["(2020 - 2024)"][0] == "Doutorado em Testes"

    assert dados_extraidos["contatos"]["sala"] == "Sala 123"
    assert dados_extraidos["contatos"]["email"] == "teste@unb.br"
    assert "telefone" not in dados_extraidos["contatos"]