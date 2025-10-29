# backend/utils.py

def chunk_list(data: list, num_chunks: int):
    """Divide uma lista em 'num_chunks' pacotes de tamanho o mais igual possível."""
    if not data: return []
    # Não crie mais trabalhadores do que URLs disponíveis
    num_chunks = min(num_chunks, len(data))
    # Se num_chunks for 0 (lista vazia ou num_chunks inválido), retorna lista vazia
    if num_chunks == 0: return [] 
    k, m = divmod(len(data), num_chunks)
    return [data[i * k + min(i, m):(i + 1) * k + min(i + 1, m)] for i in range(num_chunks)]

# (Adicione outras funções utilitárias aqui no futuro)