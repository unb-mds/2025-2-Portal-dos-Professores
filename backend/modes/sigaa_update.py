import logging
import asyncio
import config 
from database_manager import DatabaseManager
from scrapers.sigaa_scraper import SigaaScraper

logger = logging.getLogger(__name__)

async def update_sigaa_data_all():
    """
    Executa o scraper do SIGAA para TODOS os departamentos.
    Lê o JSON existente, atualiza os dados do SIGAA para professores existentes,
    adiciona novos professores e PRESERVA os dados do Lattes ('dados_lattes').
    """
    logger.info(f"--- MODO SIGAA-ONLY (COM MERGE INTELIGENTE E SEGURO) ---")
    
    db_manager = DatabaseManager(config.JSON_FILE_PATH)
    
    existing_data = db_manager.load_data() 
    professors_map = {prof['pagina_sigaa_url']: prof for prof in existing_data if 'pagina_sigaa_url' in prof}
    logger.info(f"Carregados {len(professors_map)} registros existentes de '{config.JSON_FILE_PATH}'.")
    
    logger.info(f"Iniciando scraper do SIGAA para TODOS os {len(config.ALL_DEPARTMENTS)} departamentos...")
    sigaa_scraper = SigaaScraper() 
    sigaa_data_current_run = []

    try:
        sigaa_data_current_run = await sigaa_scraper.scrape_professors_by_department(config.ALL_DEPARTMENTS)
        if sigaa_data_current_run:
            logger.info(f"SIGAA: Coletados {len(sigaa_data_current_run)} registros nesta execução.")
        else:
            logger.warning("SIGAA: Nenhum professor encontrado nesta execução.")
            logger.warning("Continuando o processo, o JSON final pode não refletir exclusões.")
            
    except Exception as e:
        logger.error(f"[ERRO CRÍTICO SIGAA] O processo de scraping falhou: {e}")
        logger.error("Abortando a atualização, o arquivo JSON não será modificado.")
        return 

    logger.info("Iniciando merge dos dados do SIGAA...")
    novos_adicionados = 0
    atualizados = 0
    
    sigaa_field_keys = [
        "nome", "departamento", "foto_url", "pagina_sigaa_url",
        "descricao_pessoal", "lattes_url", "formacao_academica", "contatos",
    ]

    for prof_sigaa_atual in sigaa_data_current_run:
        sigaa_url = prof_sigaa_atual.get('pagina_sigaa_url')
        if not sigaa_url:
            logger.warning(f"Registro SIGAA sem 'pagina_sigaa_url' encontrado: {prof_sigaa_atual.get('nome')}")
            continue 

        professor_existente = professors_map.get(sigaa_url)

        if professor_existente:
            logger.debug(f"Atualizando dados SIGAA para: {prof_sigaa_atual.get('nome')}")
            
            for key in sigaa_field_keys:
                new_value = prof_sigaa_atual.get(key)
                
                if new_value is not None:
                    professor_existente[key] = new_value
                else:
                    if key not in professor_existente:
                        professor_existente[key] = None 

            if 'dados_lattes' not in professor_existente:
                 professor_existente['dados_lattes'] = None
            
            atualizados += 1
        else:
            logger.debug(f"Adicionando novo registro SIGAA para: {prof_sigaa_atual.get('nome')}")
            
            novo_professor = prof_sigaa_atual.copy()
            
            for key in sigaa_field_keys:
                if key not in novo_professor:
                    novo_professor[key] = None
            
            novo_professor['dados_lattes'] = None 

            professors_map[sigaa_url] = novo_professor
            novos_adicionados += 1
            
    logger.info(f"Merge SIGAA concluído: {novos_adicionados} adicionados, {atualizados} atualizados.")

    final_prof_list = list(professors_map.values())
    
    if final_prof_list:
        logger.info(f"\nSalvando {len(final_prof_list)} registros totais ATUALIZADOS em '{config.JSON_FILE_PATH}'...")
        db_manager.write_data(final_prof_list)
        logger.info(f"Dados salvos com sucesso.")
    else:
        logger.warning("\nNenhum dado de professor para salvar.")

    logger.info(f"--- MODO SIGAA-ONLY FINALIZADO ---")