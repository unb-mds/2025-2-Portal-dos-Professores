import sys
import os
import asyncio 
from database_manager import DatabaseManager
from scrapers.sigaa_scraper import SigaaScraper
from scrapers.lattes_scraper import run_lattes_pipeline 

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

WORKER_COUNT = 1

def chunk_list(data: list, num_chunks: int):
    """Divide uma lista em 'num_chunks' pacotes de tamanho o mais igual possível."""
    if not data:
        return []
    num_chunks = min(num_chunks, len(data))
    k, m = divmod(len(data), num_chunks)
    return [data[i * k + min(i, m):(i + 1) * k + min(i + 1, m)] for i in range(num_chunks)]


async def main(): 
    print("--- INICIANDO SCRAPER DE PROFESSORES DO SIGAA ---")
    
    depts_para_buscar = [
        "CAMPUS UNB GAMA: FACULDADE DE CIÊNCIAS E TECNOLOGIAS EM ENGENHARIA - BRASÍLIA",
        #"DEPTO CIÊNCIAS DA COMPUTAÇÃO - BRASÍLIA",
        # "DEPARTAMENTO DE MATEMÁTICA - BRASÍLIA",
        # "DEPTO ESTATÍSTICA - BRASÍLIA",
        # "FACULDADE DE ARQUITETURA E URBANISMO - BRASÍLIA",
        # "FACULDADE DE CIÊNCIA DA INFORMAÇÃO - BRASÍLIA",
        # "FACULDADE DE TECNOLOGIA - BRASÍLIA",
        # "INSTITUTO DE FÍSICA - BRASÍLIA",
        # "INSTITUTO DE GEOCIÊNCIAS - BRASÍSIA",
        # "INSTITUTO DE QUÍMICA - BRASÍLIA",
    ]

    print(f"Buscando professores em {len(depts_para_buscar)} departamentos.")
    sigaa_scraper = SigaaScraper() 
    professor_data = [] 

    try:
        professor_data = await sigaa_scraper.scrape_professors_by_department(depts_para_buscar)
        if professor_data:
            print(f"\nTotal de {len(professor_data)} professores únicos coletados do SIGAA.")
        else:
            print("\nNenhum professor foi coletado do SIGAA.")
    except Exception as e:
        print(f"[ERRO CRÍTICO SIGAA] O processo de scraping falhou: {e}")

    if not professor_data:
        print("\nNenhum dado do SIGAA foi coletado. Encerrando o processo.")
        print("\n--- PROCESSO FINALIZADO ---")
        return

    urls_para_lattes = []
    for prof in professor_data:
        url = prof.get("lattes_url")
        if url and "lattes.cnpq.br" in url:
            urls_para_lattes.append(url)
    urls_para_lattes = list(set(urls_para_lattes)) 
    
    professores_completos = list(professor_data) 

    if not urls_para_lattes:
        print("\nNenhuma URL válida do Lattes foi encontrada nos dados do SIGAA.")
    else:
        print(f"\n--- INICIANDO SCRAPER DO LATTES EM {WORKER_COUNT} TRABALHADORES PARALELOS ---")
        print(f"Total de {len(urls_para_lattes)} URLs únicas para processar.")

        url_chunks = chunk_list(urls_para_lattes, WORKER_COUNT)

        tasks = []
        for i, chunk in enumerate(url_chunks):
            worker_id = i + 1
            if not chunk: continue
            print(f"Trabalhador {worker_id} processará {len(chunk)} URLs.")
            tasks.append(asyncio.to_thread(run_lattes_pipeline, chunk, worker_id))
        
        lattes_results_lists = [] 
        try:
            lattes_results_lists = await asyncio.gather(*tasks)
            print("\n--- TODOS OS TRABALHADORES DO LATTES FINALIZARAM ---")
        except Exception as e:
            print(f"[ERRO CRÍTICO LATTES] O processo paralelo falhou: {e}")

        lattes_results = []
        for sublist in lattes_results_lists:
            if sublist:
                lattes_results.extend(sublist)

        lattes_data_map = {}
        sucessos = 0
        for result in lattes_results:
            if result and result["status"] == "success":
                lattes_data_map[result["url"]] = result
                sucessos += 1
        
        print(f"--- Processamento do Lattes concluído: {sucessos}/{len(urls_para_lattes)} currículos acessados com sucesso ---")


        for prof in professores_completos:
            prof_url = prof.get("lattes_url") 
            if prof_url in lattes_data_map:
                novos_dados = lattes_data_map[prof_url]
                prof["dados_lattes"] = novos_dados.get("dados_lattes")
            else:
                prof["dados_lattes"] = None 
    
    
    if professores_completos:
        print(f"\nSalvando dados finais de {len(professores_completos)} professores...")
        
        db_manager_final = DatabaseManager("data/professors.json")
        db_manager_final.write_data(professores_completos)
        
        print(f"\nDados combinados (SIGAA + Lattes) salvos com sucesso em 'data/professors.json'.")
    else:
        print("\nNenhum dado de professor foi processado. Nenhum arquivo foi salvo.")


    print("\n--- PROCESSO FINALIZADO ---")

if __name__ == "__main__":
    asyncio.run(main())