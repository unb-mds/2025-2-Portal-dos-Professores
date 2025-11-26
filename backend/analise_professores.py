import logging
import config
import os
from database_manager import DatabaseManager

logging.basicConfig(level=logging.INFO, format='%(message)s')
logger = logging.getLogger("AnaliseDados")

def analisar_dados_professores():
    """
    Carrega os dados usando a infraestrutura do projeto (DatabaseManager + config)
    e gera um relatório de completude dos dados (Lattes e Scholar).
    """
    
    logger.info("Carregando banco de dados...")
    
    base_dir = os.path.dirname(os.path.abspath(__file__)) 
    root_dir = os.path.dirname(base_dir)
    json_path_absoluto = os.path.join(root_dir, "data", "professors.json")
    
    logger.info(f"Buscando arquivo em: {json_path_absoluto}")

    try:
        db_manager = DatabaseManager(json_path_absoluto)
        professores = db_manager.load_data()
    except Exception as e:
        logger.error(f"Erro ao carregar dados usando DatabaseManager: {e}")
        logger.error("Verifique se o arquivo 'config.py' e 'database_manager.py' estão acessíveis.")
        return

    if not professores:
        logger.warning(f"O arquivo parece estar vazio ou não retornou dados.")
        logger.warning(f"Verifique se o caminho acima está correto e se o arquivo existe.")
        return

    total_professores = len(professores)
    
    qtd_lattes = 0
    qtd_scholar = 0
    qtd_completos = 0 
    qtd_sem_nada = 0  

    logger.info(f"Analisando {total_professores} registros...\n")

    for prof in professores:

        tem_lattes = prof.get("dados_lattes") is not None
        tem_scholar = prof.get("dados_scholar") is not None

        if tem_lattes:
            qtd_lattes += 1
        
        if tem_scholar:
            qtd_scholar += 1

        if tem_lattes and tem_scholar:
            qtd_completos += 1
        
        if not tem_lattes and not tem_scholar:
            qtd_sem_nada += 1

    pct_lattes = (qtd_lattes / total_professores * 100) if total_professores > 0 else 0
    pct_scholar = (qtd_scholar / total_professores * 100) if total_professores > 0 else 0
    pct_completos = (qtd_completos / total_professores * 100) if total_professores > 0 else 0
    pct_vazios = (qtd_sem_nada / total_professores * 100) if total_professores > 0 else 0

    print("\n" + "=" * 50)
    print(f"RELATÓRIO DE QUALIDADE DOS DADOS ({total_professores} profs)")
    print("=" * 50)
    
    print(f"1. LATTES (dados_lattes):")
    print(f"   - Preenchidos: {qtd_lattes} ({pct_lattes:.1f}%)")
    print(f"   - Faltantes:   {total_professores - qtd_lattes}")
    
    print("-" * 50)
    
    print(f"2. GOOGLE SCHOLAR (dados_scholar):")
    print(f"   - Preenchidos: {qtd_scholar} ({pct_scholar:.1f}%)")
    print(f"   - Faltantes:   {total_professores - qtd_scholar}")
    
    print("-" * 50)
    
    print(f"3. CONSOLIDAÇÃO:")
    print(f"   - PERFIS COMPLETOS (Ambos):  {qtd_completos} ({pct_completos:.1f}%)")
    print(f"   - PERFIS VAZIOS (Nenhum):    {qtd_sem_nada} ({pct_vazios:.1f}%)")
    print("=" * 50 + "\n")

if __name__ == "__main__":
    analisar_dados_professores()