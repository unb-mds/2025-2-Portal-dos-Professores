from scrapers.sigaa_scraper import SigaaScraper 
from database_manager import DatabaseManager
import json 

def main():
    print("--- INICIANDO SCRAPER DE CARDS DE PROFESSORES DO SIGAA ---")
    

    sigaa_scraper = SigaaScraper()

    db_manager = DatabaseManager("data/professors.json") 

    try:
        professor_cards_data = sigaa_scraper.scrape_professor_cards()
        
        print(f"Total de {len(professor_cards_data)} professores coletados para salvar.")
        
        db_manager.write_data(professor_cards_data)

    except Exception as e:
        print(f"[ERRO CRÍTICO] O processo de scraping falhou: {e}")

    print("\n--- PROCESSO FINALIZADO ---")

if __name__ == "__main__":
    main()