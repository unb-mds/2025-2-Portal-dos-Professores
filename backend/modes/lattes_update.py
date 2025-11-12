import logging
import asyncio
from datetime import datetime
import config
import utils 
from database_manager import DatabaseManager
from scrapers.lattes_scraper import run_lattes_pipeline 

logger = logging.getLogger(__name__)

async def _run_lattes_update_for_professors(professors_to_update: list, db_manager: DatabaseManager, professors_map: dict):
    """
    Função "Core" de Scrape e Merge.
    Recebe uma lista JÁ FILTRADA de professores para atualizar.
    """

    urls_para_lattes = []
    lattes_url_to_sigaa_map = {} 
    for prof in professors_to_update:
        lattes_url = prof.get("lattes_url")
        sigaa_url = prof.get("pagina_sigaa_url")
        if lattes_url and "lattes.cnpq.br" in lattes_url and sigaa_url:
            urls_para_lattes.append(lattes_url)
            if lattes_url not in lattes_url_to_sigaa_map:
                lattes_url_to_sigaa_map[lattes_url] = []
            lattes_url_to_sigaa_map[lattes_url].append(sigaa_url)
        else:
            logger.debug(f"Pulando {prof.get('nome')} (sem lattes_url válida) na função Core.")
            
    urls_para_lattes = list(set(urls_para_lattes)) 

    lattes_data_map_current_run = {} 

    if not urls_para_lattes:
        logger.warning("LATTES: Nenhuma URL válida encontrada para os professores alvo (após filtro final).")
    else:
        logger.info(f"\n--- INICIANDO SCRAPER DO LATTES (WORKER_COUNT={config.LATTES_WORKER_COUNT}) ---")
        logger.info(f"LATTES: Processando {len(urls_para_lattes)} URLs únicas.")
        
        url_chunks = utils.chunk_list(urls_para_lattes, config.LATTES_WORKER_COUNT) 
        tasks = []
        for i, chunk in enumerate(url_chunks):
            worker_id = i + 1
            if not chunk: continue
            logger.info(f"Trabalhador {worker_id} processará {len(chunk)} URLs.")
            tasks.append(asyncio.to_thread(run_lattes_pipeline, chunk, worker_id))
        
        lattes_results_lists = []
        try:
            lattes_results_lists = await asyncio.gather(*tasks)
            logger.info("\n--- SCRAPER(S) DO LATTES FINALIZADO(S) ---")
        except Exception as e:
            logger.error(f"[ERRO CRÍTICO LATTES] O processo paralelo/sequencial falhou: {e}")

        lattes_results = []
        for sublist in lattes_results_lists:
            if sublist: lattes_results.extend(sublist)
        
        sucessos = 0
        for result in lattes_results:
            if result and result["status"] == "success":
                lattes_data_map_current_run[result["url"]] = result.get("dados_lattes") 
                sucessos += 1
        
        logger.info(f"--- Processamento do Lattes concluído: {sucessos}/{len(urls_para_lattes)} currículos acessados com sucesso NESTA EXECUÇÃO ---")

    logger.info("\n--- INICIANDO MERGE DOS DADOS DO LATTES ---")
    atualizados_count = 0
    falhas_lattes_count = 0

    for prof_target in professors_to_update: 
        sigaa_url = prof_target.get('pagina_sigaa_url')
        lattes_url_target = prof_target.get('lattes_url')
        
        if lattes_url_target in lattes_data_map_current_run:
            dados_lattes_novos = lattes_data_map_current_run[lattes_url_target]
            if sigaa_url in professors_map:
                professors_map[sigaa_url]['dados_lattes'] = dados_lattes_novos
                professors_map[sigaa_url]['last_updated_lattes'] = datetime.now().isoformat()
                atualizados_count += 1
            else:
                logger.warning(f"Inconsistência: Professor {prof_target.get('nome')} não encontrado no mapa principal durante o merge Lattes.")
        elif lattes_url_target and "lattes.cnpq.br" in lattes_url_target:
            logger.warning(f"Não foram obtidos dados do Lattes para {prof_target.get('nome')} ({lattes_url_target})")
            if sigaa_url in professors_map:
                professors_map[sigaa_url]['dados_lattes'] = professors_map[sigaa_url].get('dados_lattes', None) 
            falhas_lattes_count += 1
            
    logger.info(f"Merge Lattes concluído: {atualizados_count} registros de professores tiveram o campo 'dados_lattes' populado/atualizado.")
    if falhas_lattes_count > 0:
        logger.warning(f"  -> {falhas_lattes_count} professores tinham URL do Lattes mas a extração falhou ou não retornou dados nesta execução.")

async def update_lattes_data_missing():
    """
    Executa o scraper do Lattes APENAS para professores
    onde 'dados_lattes' é nulo E 'lattes_url' existe.
    """
    logger.info(f"--- MODO LATTES-MISSING ---")
    
    db_manager = DatabaseManager(config.JSON_FILE_PATH)

    existing_data = db_manager.load_data()
    if not existing_data:
        logger.error(f"Erro: O arquivo '{config.JSON_FILE_PATH}' não existe ou está vazio.")
        return
        
    professors_map = {prof['pagina_sigaa_url']: prof for prof in existing_data if 'pagina_sigaa_url' in prof}
    logger.info(f"Carregados {len(professors_map)} registros existentes de '{config.JSON_FILE_PATH}'.")

    professors_to_update = []
    for prof in professors_map.values():
        lattes_url = prof.get("lattes_url")
        if (not prof.get('dados_lattes')) and (lattes_url and "lattes.cnpq.br" in lattes_url):
            professors_to_update.append(prof)
            
    if not professors_to_update:
        logger.warning(f"LATTES-MISSING: Nenhum professor com dados do Lattes faltando (e com URL válida). Tudo em dia!")
        return 
        
    logger.info(f"Encontrados {len(professors_to_update)} professores com dados do Lattes faltando (e com URL válida).")

    await _run_lattes_update_for_professors(professors_to_update, db_manager, professors_map)

    final_prof_list = list(professors_map.values())
    if final_prof_list:
        logger.info(f"\nSalvando {len(final_prof_list)} registros totais ATUALIZADOS em '{config.JSON_FILE_PATH}'...")
        db_manager.write_data(final_prof_list)
        logger.info(f"Dados salvos com sucesso.")
    else:
        logger.warning("\nNenhum dado de professor para salvar (mapa final vazio?).")
    
    logger.info(f"--- MODO LATTES-MISSING FINALIZADO ---")

async def update_lattes_data_for_departments(target_departments: list, missing_only: bool = False): 
    """
    Executa o scraper do Lattes para os deptos especificados.
    Se 'missing_only' for True, roda apenas para dados faltantes.
    """
    if missing_only:
        logger.info(f"--- MODO LATTES-DEPT (HÍBRIDO: APENAS DADOS FALTANTES) ---")
    else:
        logger.info(f"--- MODO LATTES-DEPT (COMPLETO) ---")
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
                lattes_url = prof.get("lattes_url")
                if (not prof.get('dados_lattes')) and (lattes_url and "lattes.cnpq.br" in lattes_url):
                    professors_to_update.append(prof)
            else:
                professors_to_update.append(prof)
            
    if not professors_to_update:
        logger.warning(f"Nenhum professor encontrado para os critérios selecionados.")
        return
        
    logger.info(f"Encontrados {len(professors_to_update)} professores para atualizar o Lattes.")

    await _run_lattes_update_for_professors(professors_to_update, db_manager, professors_map)

    final_prof_list = list(professors_map.values())
    if final_prof_list:
        logger.info(f"\nSalvando {len(final_prof_list)} registros totais ATUALIZADOS em '{config.JSON_FILE_PATH}'...")
        db_manager.write_data(final_prof_list)
        logger.info(f"Dados salvos com sucesso.")
    else:
        logger.warning("\nNenhum dado de professor para salvar (mapa final vazio?).")
    
    logger.info(f"--- MODO LATTES-DEPT FINALIZADO ---")