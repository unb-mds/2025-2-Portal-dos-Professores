import logging
import asyncio
from datetime import datetime
import config
import utils 
from database_manager import DatabaseManager
from scrapers.scholar_scraper import run_scholar_pipeline 

logger = logging.getLogger(__name__)

async def _run_scholar_update_for_professors(professors_to_update: list, db_manager: DatabaseManager, professors_map: dict):
    """
    Função "Core" de Scrape e Merge.
    Recebe uma lista JÁ FILTRADA de professores para atualizar.
    """
    if not professors_to_update:
        logger.warning(f"Nenhum professor na lista para o Scholar. Nada a fazer.")
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

    logger.info("\n--- INICIANDO MERGE DOS DADOS DO SCHOLAR ---")
    atualizados_count = 0
    falhas_scholar_count = 0

    for sigaa_url, prof_data in professors_map.items():
        if sigaa_url in scholar_data_map_current_run:
            novos_dados_scholar = scholar_data_map_current_run[sigaa_url]
            
            if novos_dados_scholar:
                professors_map[sigaa_url]['dados_scholar'] = novos_dados_scholar
                professors_map[sigaa_url]['last_updated_scholar'] = datetime.now().isoformat()
                atualizados_count += 1
            else:
                professors_map[sigaa_url]['dados_scholar'] = prof_data.get('dados_scholar', None)
                falhas_scholar_count += 1

    logger.info(f"Merge Scholar concluído: {atualizados_count} registros tiveram o campo 'dados_scholar' populado/atualizado.")
    if falhas_scholar_count > 0:
        logger.warning(f"  -> {falhas_scholar_count} professores não foram encontrados ou falharam no Scholar nesta execução.")
    
async def update_scholar_data_missing():
    """
    Executa o scraper do Scholar APENAS para professores
    onde 'dados_scholar' é nulo E 'nome' existe.
    """
    logger.info(f"--- MODO SCHOLAR-MISSING ---")
    
    db_manager = DatabaseManager(config.JSON_FILE_PATH)

    existing_data = db_manager.load_data()
    if not existing_data:
        logger.error(f"Erro: O arquivo '{config.JSON_FILE_PATH}' não existe ou está vazio.")
        return
        
    professors_map = {prof['pagina_sigaa_url']: prof for prof in existing_data if 'pagina_sigaa_url' in prof}
    logger.info(f"Carregados {len(professors_map)} registros existentes de '{config.JSON_FILE_PATH}'.")

    professors_to_update = []
    for prof in professors_map.values():

        if (not prof.get('dados_scholar')) and prof.get('nome'):
            professors_to_update.append(prof)
            
    if not professors_to_update:
        logger.warning(f"SCHOLAR-MISSING: Nenhum professor com dados do Scholar faltando (e com nome). Tudo em dia!")
    else:
        logger.info(f"Encontrados {len(professors_to_update)} professores com dados do Scholar faltando (e com nome).")
        await _run_scholar_update_for_professors(professors_to_update, db_manager, professors_map)

    final_prof_list = list(professors_map.values())
    if final_prof_list:
        logger.info(f"\nSalvando {len(final_prof_list)} registros totais ATUALIZADOS em '{config.JSON_FILE_PATH}'...")
        db_manager.write_data(final_prof_list)
        logger.info(f"Dados salvos com sucesso.")
    else:
        logger.warning("\nNenhum dado de professor para salvar (mapa final vazio?).")
    
    logger.info(f"--- MODO SCHOLAR-MISSING FINALIZADO ---")


async def update_scholar_data_for_departments(target_departments: list, missing_only: bool = False): 
    """
    Executa o scraper do Scholar para os deptos especificados.
    Se 'missing_only' for True, roda apenas para dados faltantes.
    """
    if missing_only:
        logger.info(f"--- MODO SCHOLAR-DEPT (HÍBRIDO: APENAS DADOS FALTANTES) ---")
    else:
        logger.info(f"--- MODO SCHOLAR-DEPT (COMPLETO) ---")
    logger.info(f"Departamentos alvo: {', '.join(target_departments)}")
    
    db_manager = DatabaseManager(config.JSON_FILE_PATH)

    existing_data = db_manager.load_data()
    if not existing_data:
        logger.error(f"Erro: O arquivo '{config.JSON_FILE_PATH}' não existe ou está vazio.")
        return
        
    professors_map = {prof['pagina_sigaa_url']: prof for prof in existing_data if 'pagina_sigaa_url' in prof}
    logger.info(f"Carregados {len(professors_map)} registros existentes de '{config.JSON_FILE_PATH}'.")

    professors_to_update = []
    for prof in professors_map.values():
        if prof.get('departamento') in target_departments:

            if missing_only:
                if (not prof.get('dados_scholar')) and prof.get('nome'):
                    professors_to_update.append(prof)
            else:
                professors_to_update.append(prof)
            
    if not professors_to_update:
        logger.warning(f"Nenhum professor encontrado para os critérios selecionados.")

    await _run_scholar_update_for_professors(professors_to_update, db_manager, professors_map)

    final_prof_list = list(professors_map.values())
    if final_prof_list:
        logger.info(f"\nSalvando {len(final_prof_list)} registros totais ATUALIZADOS em '{config.JSON_FILE_PATH}'...")
        db_manager.write_data(final_prof_list)
        logger.info(f"Dados salvos com sucesso.")
    else:
        logger.warning("\nNenhum dado de professor para salvar (mapa final vazio?).")
    
    logger.info(f"--- MODO SCHOLAR-DEPT (PLAYWRIGHT) FINALIZADO ---")