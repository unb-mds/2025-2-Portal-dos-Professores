import json
import os
import pytest
from backend.database_manager import DatabaseManager 

def test_write_and_load_data(tmp_path):
    """
    Testa o "caminho feliz":
    1. Escreve dados em um arquivo de teste.
    2. Lê os dados de volta.
    3. Verifica se os dados são os mesmos.

    """

    test_file_path = tmp_path / "test_data.json"

    db_manager = DatabaseManager(file_path=test_file_path)

    mock_data = [
        {"nome": "Professor A", "id": 1},
        {"nome": "Professor B", "id": 2}
    ]

    db_manager.write_data(mock_data)

    assert os.path.exists(test_file_path)

    with open(test_file_path, 'r', encoding='utf-8') as f:
        data_no_disco = json.load(f)
        
    assert "professors" in data_no_disco
    assert data_no_disco["professors"] == mock_data

    dados_lidos = db_manager.load_data()
    assert dados_lidos == mock_data
    assert len(dados_lidos) == 2

def test_load_non_existent_file(tmp_path):
    """
    Testa o "caminho triste":
    Verifica se load_data() retorna uma lista vazia se o arquivo não existir.
    """
    test_file_path = tmp_path / "arquivo_que_nao_existe.json"
    db_manager = DatabaseManager(file_path=test_file_path)

    dados = db_manager.load_data()

    assert dados == []

def test_load_invalid_json(tmp_path):
    """
    Testa o "caminho triste":
    Verifica se load_data() retorna uma lista vazia se o JSON for inválido.
    """

    test_file_path = tmp_path / "invalid.json"

    with open(test_file_path, 'w', encoding='utf-8') as f:
        f.write("isto não é json")
        
    db_manager = DatabaseManager(file_path=test_file_path)

    dados = db_manager.load_data()

    assert dados == [] 

def test_load_json_sem_chave_professors(tmp_path):
    """
    Testa o caso de borda:
    O JSON é válido, mas não tem a chave "professors".
    """

    test_file_path = tmp_path / "valid_no_key.json"

    mock_data = {"outra_chave": [1, 2, 3]}
    with open(test_file_path, 'w', encoding='utf-8') as f:
        json.dump(mock_data, f)
        
    db_manager = DatabaseManager(file_path=test_file_path)

    dados = db_manager.load_data()

    assert dados == [] 