import sys
import os
import asyncio 
import logging
import argparse 
from dotenv import load_dotenv 
from modes.sigaa_update import update_sigaa_data_all
from modes.lattes_update import update_lattes_data_for_departments
from modes.scholar_update import update_scholar_data_for_departments
import config

load_dotenv() 
sys.path.append(os.path.dirname(os.path.abspath(__file__))) 

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def get_valid_departments(dept_names_list: list) -> list:
    """Valida e normaliza uma lista de nomes de departamentos."""
    departments_to_process = []
    for dept_name in dept_names_list:
        normalized_dept = next((d for d in config.ALL_DEPARTMENTS if d.strip().lower() == dept_name.strip().lower()), None)
        if normalized_dept:
            departments_to_process.append(normalized_dept)
        else:
            logger.warning(f"Departamento '{dept_name}' não reconhecido ou não está na lista ALL_DEPARTMENTS em config.py. Ignorando.")
    
    if not departments_to_process:
        logger.error("Nenhum departamento válido fornecido ou reconhecido.")
        sys.exit(1)
        
    return departments_to_process

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Roda os scrapers do SIGAA, Lattes ou Google Scholar.")
    
    mode_group = parser.add_mutually_exclusive_group(required=True) 
    mode_group.add_argument(
        "--sigaa-only", 
        action="store_true",
        help="Executa o scraper do SIGAA para TODOS os deptos, mesclando os dados no JSON existente (preserva Lattes/Scholar)."
    )
    mode_group.add_argument(
        "--lattes-dept", 
        action='append', 
        metavar='NOME_DEPARTAMENTO',
        help="Executa o scraper do LATTES APENAS para o(s) depto(s) especificado(s), atualizando 'dados_lattes' no JSON."
    )
    mode_group.add_argument(
        "--scholar-dept", 
        action='append', 
        metavar='NOME_DEPARTAMENTO',
        help="Executa o scraper do GOOGLE SCHOLAR APENAS para o(s) depto(s) especificado(s), atualizando 'dados_scholar' no JSON."
    )
    
    args = parser.parse_args()
    
    if args.sigaa_only:
        logger.info("Modo --sigaa-only selecionado.")
        asyncio.run(update_sigaa_data_all())
        
    elif args.lattes_dept:
        logger.info("Modo --lattes-dept selecionado.")
        departments_to_process = get_valid_departments(args.lattes_dept)
        asyncio.run(update_lattes_data_for_departments(departments_to_process))
    
    elif args.scholar_dept:
        logger.info("Modo --scholar-dept selecionado.")
        departments_to_process = get_valid_departments(args.scholar_dept)
        asyncio.run(update_scholar_data_for_departments(departments_to_process))
        
    else:
        logger.error("Modo de operação inválido. Use --sigaa-only, --lattes-dept, ou --scholar-dept.")
        parser.print_help()
        sys.exit(1)