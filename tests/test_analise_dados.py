import pytest
from unittest.mock import MagicMock, patch
import logging
import sys
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from backend.analise_professores import analisar_dados_professores

def test_analise_dados_caminho_feliz(mocker, capsys):
    """
    Testa o cenário onde tudo funciona e temos dados mistos.
    """
    mock_db_class = mocker.patch('backend.analise_professores.DatabaseManager')
    mock_db_instance = mock_db_class.return_value

    mock_data = [
        {"nome": "Prof Completo", "dados_lattes": {"a": 1}, "dados_scholar": {"b": 2}}, 
        {"nome": "Prof Só Lattes", "dados_lattes": {"a": 1}, "dados_scholar": None}, 
        {"nome": "Prof Só Scholar", "dados_lattes": None, "dados_scholar": {"b": 2}}, 
        {"nome": "Prof Vazio", "dados_lattes": None, "dados_scholar": None},      
    ]
    mock_db_instance.load_data.return_value = mock_data

    analisar_dados_professores()

    captured = capsys.readouterr()
    stdout = captured.out

    assert "RELATÓRIO DE QUALIDADE DOS DADOS (4 profs)" in stdout
    assert "Preenchidos: 2 (50.0%)" in stdout
    assert "2. GOOGLE SCHOLAR" in stdout
    assert "PERFIS COMPLETOS (Ambos):  1 (25.0%)" in stdout
    assert "PERFIS VAZIOS (Nenhum):    1 (25.0%)" in stdout


def test_analise_dados_lista_vazia(mocker, caplog):
    """
    Testa o cenário onde load_data retorna uma lista vazia.
    """
    mock_db_class = mocker.patch('backend.analise_professores.DatabaseManager')
    mock_db_instance = mock_db_class.return_value
    mock_db_instance.load_data.return_value = [] 

    with caplog.at_level(logging.INFO):
        analisar_dados_professores()

    assert "O arquivo parece estar vazio ou não retornou dados." in caplog.text


def test_analise_dados_excecao(mocker, caplog):
    """
    Testa o cenário de erro (Exception).
    """
    mock_db_class = mocker.patch('backend.analise_professores.DatabaseManager')
    mock_db_class.side_effect = Exception("Arquivo não encontrado simulado")

    with caplog.at_level(logging.ERROR):
        analisar_dados_professores()

    assert "Erro ao carregar dados usando DatabaseManager: Arquivo não encontrado simulado" in caplog.text


def test_analise_dados_divisao_zero_preventiva(mocker, capsys):
    """
    Cenário de Borda (Divisão por zero).
    """
    mock_db_class = mocker.patch('backend.analise_professores.DatabaseManager')
    mock_db_instance = mock_db_class.return_value
    
    mock_data = [{"dados_lattes": None, "dados_scholar": None}]
    mock_db_instance.load_data.return_value = mock_data

    analisar_dados_professores()
    
    captured = capsys.readouterr()
    assert "Preenchidos: 0 (0.0%)" in captured.out