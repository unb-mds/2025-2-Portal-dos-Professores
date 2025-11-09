import pytest
from unittest.mock import MagicMock, patch
import sys
import os

test_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.abspath(os.path.join(test_dir, '..', '..'))
if project_root not in sys.path:
    sys.path.insert(0, project_root)

from backend.scrapers.lattes_parser import parse_lattes_page

def test_parse_lattes_page_caminho_feliz():
    """
    Testa o "caminho feliz":
    Verifica se a função chama 'page.evaluate' e retorna os dados fingidos.
    """

    mock_page = MagicMock()

    mock_js_results = {
        "resumo_cv": "Este é um resumo mockado.",
        "atuacao_profissional": [{"instituicao": "UnB"}],
        "projetos_pesquisa": [{"titulo": "Projeto Teste"}]
    }

    mock_page.evaluate.return_value = mock_js_results

    dados_retornados = parse_lattes_page(mock_page)

    mock_page.evaluate.assert_called_once()

    assert dados_retornados == mock_js_results
    assert dados_retornados["resumo_cv"] == "Este é um resumo mockado."
    assert len(dados_retornados["projetos_pesquisa"]) == 1

def test_parse_lattes_page_evaluate_falha():
    """
    Testa o "caminho triste":
    O que acontece se 'page.evaluate' (o JavaScript) quebrar?
    """

    mock_page = MagicMock()

    mock_page.evaluate.side_effect = Exception("Erro simulado no JavaScript")

    dados_retornados = parse_lattes_page(mock_page)

    mock_page.evaluate.assert_called_once()

    assert dados_retornados == {}