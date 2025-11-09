import pytest
from unittest.mock import MagicMock, patch
import sys
import os

test_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.abspath(os.path.join(test_dir, '..'))
if project_root not in sys.path:
    sys.path.insert(0, project_root)
from backend.scraper_runner import get_valid_departments

@pytest.fixture
def mock_config_and_exit(mocker):
    """
    Mocka as dependências externas da função:
    1. O 'config.ALL_DEPARTMENTS'
    2. O 'sys.exit' (para que ele não pare o pytest)
    """

    mock_config = MagicMock()
    mock_config.ALL_DEPARTMENTS = ["Ciência da Computação", "Engenharia de Software"]
    mocker.patch('backend.scraper_runner.config', mock_config)

    mock_exit = mocker.patch('backend.scraper_runner.sys.exit')

    return mock_exit

def test_get_valid_departments_caminho_feliz(mock_config_and_exit):
    """
    Testa o "caminho feliz":
    Passa uma lista mista e vê se ele filtra corretamente.
    """
    lista_de_args = ["Ciência da Computação", "DEPARTAMENTO FALSO", "engenharia de software"]

    deptos_validos = get_valid_departments(lista_de_args)

    assert deptos_validos == ["Ciência da Computação", "Engenharia de Software"]
    mock_config_and_exit.assert_not_called() 

def test_get_valid_departments_caminho_falha(mock_config_and_exit):
    """
    Testa o "caminho da falha":
    Passa uma lista SÓ com deptos falsos e verifica se o sys.exit é chamado.
    """
    lista_de_args = ["DEPARTAMENTO FALSO 1", "DEPARTAMENTO FALSO 2"]

    deptos_validos = get_valid_departments(lista_de_args)

    mock_config_and_exit.assert_called_with(1)

    assert deptos_validos == []