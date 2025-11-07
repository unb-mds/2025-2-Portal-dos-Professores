import logging
import asyncio
import config
import utils 
from database_manager import DatabaseManager
from scrapers.scholar_scraper import run_scholar_pipeline 

logger = logging.getLogger(__name__)

async def update_scholar_data_for_departments(target_departments: list):
    """
    Executa o scraper do Google Scholar (modo Playwright)
    APENAS para os professores dos deptos especificados.
    """
    logger.info(f"--- MODO SCHOLAR-DEPT (PLAYWRIGHT) ---")
    logger.info(f"Iniciando atualização do Scholar para {len(target_departments)} departamento(s): {', '.join(target_departments)}")
    
    db_manager = DatabaseManager(config.JSON_FILE_PATH)

    existing_data = db_manager.load_data()
    if not existing_data:
        logger.error(f"Erro: O arquivo '{config.JSON_FILE_PATH}' não existe ou está vazio.")
        logger.error("Execute o modo --sigaa-only primeiro para criar o arquivo base.")
        return
        
    professors_map = {prof['pagina_sigaa_url']: prof for prof in existing_data if 'pagina_sigaa_url' in prof}
    logger.info(f"Carregados {len(professors_map)} registros existentes de '{config.JSON_FILE_PATH}'.")

    professors_to_update = []
    for prof in professors_map.values():
        if prof.get('departamento') in target_departments:
            professors_to_update.append(prof)
            
    if not professors_to_update:
        logger.warning(f"Nenhum professor encontrado nos dados existentes para os departamentos: {', '.join(target_departments)}")
        return
        
    logger.info(f"Encontrados {len(professors_to_update)} professores para buscar no Google Scholar.")

    WORKER_COUNT = 1
    logger.info(f"Configurando para rodar com {WORKER_COUNT} workers.")
    
    url_chunks = utils.chunk_list(professors_to_update, WORKER_COUNT) 
    tasks = []
    
    for i, chunk in enumerate(url_chunks):
        worker_id = i + 1
        if not chunk: continue
        logger.info(f"Trabalhador {worker_id} (Scholar) processará {len(chunk)} professores.")
        tasks.append(asyncio.to_thread(run_scholar_pipeline, chunk, worker_id))
    
    scholar_results_maps = []
    try:
        scholar_results_maps = await asyncio.gather(*tasks)
    except Exception as e:
        logger.error(f"[ERRO CRÍTICO SCHOLAR] O processo falhou: {e}")

    scholar_data_map_current_run = {} 
    for res_map in scholar_results_maps:
        if res_map:
            scholar_data_map_current_run.update(res_map)

    if not scholar_data_map_current_run:
        logger.warning("Nenhum dado do Scholar foi retornado pelo scraper.")
        return

    logger.info("\n--- INICIANDO MERGE DOS DADOS DO SCHOLAR ---")
    atualizados_count = 0
    falhas_scholar_count = 0

    for sigaa_url, prof_data in professors_map.items():
        if sigaa_url in scholar_data_map_current_run:
            novos_dados_scholar = scholar_data_map_current_run[sigaa_url]
            
            if novos_dados_scholar:
                professors_map[sigaa_url]['dados_scholar'] = novos_dados_scholar
                atualizados_count += 1
            else:
                professors_map[sigaa_url]['dados_scholar'] = prof_data.get('dados_scholar', None)
                falhas_scholar_count += 1

    logger.info(f"Merge Scholar concluído: {atualizados_count} registros tiveram o campo 'dados_scholar' populado/atualizado.")
    if falhas_scholar_count > 0:
        logger.warning(f"  -> {falhas_scholar_count} professores não foram encontrados ou falharam no Scholar nesta execução.")

    final_prof_list = list(professors_map.values())
    
    if final_prof_list:
        logger.info(f"\nSalvando {len(final_prof_list)} registros totais ATUALIZADOS em '{config.JSON_FILE_PATH}'...")
        db_manager.write_data(final_prof_list)
        logger.info(f"Dados salvos com sucesso.")
    else:
        logger.warning("\nNenhum dado de professor para salvar (mapa final vazio?).")
    
    logger.info(f"--- MODO SCHOLAR-DEPT (PLAYWRIGHT) FINALIZADO ---")