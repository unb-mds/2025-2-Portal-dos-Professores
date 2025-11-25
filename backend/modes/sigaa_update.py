import logging
import asyncio
import config 
from database_manager import DatabaseManager
from scrapers.sigaa_scraper import SigaaScraper

logger = logging.getLogger(__name__)

async def _run_sigaa_update_core(target_departments: list):
    """
    Função interna que roda o scraper para uma lista específica de departamentos
    e faz o merge com o banco de dados.
    """
    db_manager = DatabaseManager(config.JSON_FILE_PATH)
    
    existing_data = db_manager.load_data() 
    professors_map = {prof['pagina_sigaa_url']: prof for prof in existing_data if 'pagina_sigaa_url' in prof}
    logger.info(f"Carregados {len(professors_map)} registros existentes.")
    
    logger.info(f"Iniciando scraper do SIGAA para {len(target_departments)} departamentos...")
    sigaa_scraper = SigaaScraper() 
    sigaa_data_current_run = []

    try:
        sigaa_data_current_run = await sigaa_scraper.scrape_professors_by_department(target_departments)
        if sigaa_data_current_run:
            logger.info(f"SIGAA: Coletados {len(sigaa_data_current_run)} registros nesta execução.")
        else:
            logger.warning("SIGAA: Nenhum professor encontrado nesta execução.")
            return 
            
    except Exception as e:
        logger.error(f"[ERRO CRÍTICO SIGAA] O processo falhou: {e}")
        return 

    logger.info("Iniciando merge dos dados do SIGAA...")
    novos = 0
    atualizados = 0
    
    sigaa_keys = ["nome", "departamento", "foto_url", "pagina_sigaa_url", "descricao_pessoal", "lattes_url", "formacao_academica", "contatos"]

    for prof_novo in sigaa_data_current_run:
        url = prof_novo.get('pagina_sigaa_url')
        if not url: continue 

        prof_existente = professors_map.get(url)

        if prof_existente:
            for key in sigaa_keys:
                if prof_novo.get(key) is not None:
                    prof_existente[key] = prof_novo.get(key)
            atualizados += 1
        else:
            logger.info(f"Novo professor encontrado: {prof_novo.get('nome')}")
            prof_novo['dados_lattes'] = None
            prof_novo['dados_scholar'] = None
            professors_map[url] = prof_novo
            novos += 1
            
    logger.info(f"Merge concluído: {novos} novos, {atualizados} atualizados.")

    if novos > 0 or atualizados > 0:
        db_manager.write_data(list(professors_map.values()))
    else:
        logger.info("Nenhuma alteração necessária no banco de dados.")


async def update_sigaa_data_all():
    """Modo Pipeline: Roda para TODOS os departamentos do config."""
    logger.info("--- MODO SIGAA (TODOS) ---")
    await _run_sigaa_update_core(config.ALL_DEPARTMENTS)

async def update_sigaa_data_for_departments(target_departments: list):
    """Modo Manual: Roda apenas para departamentos específicos."""
    logger.info(f"--- MODO SIGAA (DEPARTAMENTO) ---")
    await _run_sigaa_update_core(target_departments)