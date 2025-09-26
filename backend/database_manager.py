import json
import os

class DatabaseManager:
    """
    Gerencia a leitura e escrita de dados de professores em um arquivo JSON.
    """
    def __init__(self, file_path="data/professors.json"):
        self.file_path = file_path
        os.makedirs(os.path.dirname(self.file_path), exist_ok=True)
        
    def write_data(self, data):
        """
        Escreve uma lista de dicionários de professores para o arquivo JSON.
        Os dados são encapsulados sob a chave 'professors'.
        """
        output = {"professors": data}
        with open(self.file_path, 'w', encoding='utf-8') as f:
            json.dump(output, f, indent=4, ensure_ascii=False)
        print(f"Dados salvos com sucesso em {self.file_path}")

    def load_data(self):
        """
        Carrega dados de professores de um arquivo JSON.
        Retorna uma lista de dicionários ou uma lista vazia se o arquivo não existir ou for inválido.
        """
        if not os.path.exists(self.file_path):
            print(f"Arquivo '{self.file_path}' não encontrado. Retornando lista vazia.")
            return []
        
        try:
            with open(self.file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
                return data.get("professors", [])
        except json.JSONDecodeError:
            print(f"Erro: O arquivo '{self.file_path}' não é um JSON válido. Retornando lista vazia.")
            return []
        except Exception as e:
            print(f"Ocorreu um erro ao carregar dados de '{self.file_path}': {e}. Retornando lista vazia.")
            return []