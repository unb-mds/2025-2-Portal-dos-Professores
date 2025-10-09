from scrapers.sigaa_scraper import SigaaScraper 
from database_manager import DatabaseManager
import json 

def main():
    print("--- INICIANDO SCRAPER DE PROFESSORES DO SIGAA ---")
    
    depts_para_buscar = [
        "CAMPUS UNB GAMA: FACULDADE DE CIÊNCIAS E TECNOLOGIAS EM ENGENHARIA - BRASÍLIA",
        "DEPTO CIÊNCIAS DA COMPUTAÇÃO - BRASÍLIA",
        "DEPARTAMENTO DE MATEMÁTICA - BRASÍLIA",
        "DEPTO ESTATÍSTICA - BRASÍLIA",
        "FACULDADE DE ARQUITETURA E URBANISMO - BRASÍLIA",
        "FACULDADE DE CIÊNCIA DA INFORMAÇÃO - BRASÍLIA",
        "FACULDADE DE TECNOLOGIA - BRASÍLIA",
        "INSTITUTO DE FÍSICA - BRASÍLIA",
        "INSTITUTO DE GEOCIÊNCIAS - BRASÍLIA",
        "INSTITUTO DE QUÍMICA - BRASÍLIA",
    ]

    print(f"Buscando professores em {len(depts_para_buscar)} departamentos.")

    sigaa_scraper = SigaaScraper()
    db_manager = DatabaseManager("data/professors.json") 

    try:

        professor_data = sigaa_scraper.scrape_professors_by_department(depts_para_buscar)
        
        if professor_data:
            print(f"\nTotal de {len(professor_data)} professores únicos coletados para salvar.")
            
            db_manager.write_data(professor_data)
            print("Dados salvos com sucesso em 'data/professors.json'.")
        else:
            print("\nNenhum professor foi coletado. O arquivo JSON não foi atualizado.")

    except Exception as e:
        print(f"[ERRO CRÍTICO] O processo de scraping falhou: {e}")

    print("\n--- PROCESSO FINALIZADO ---")

if __name__ == "__main__":
    main()