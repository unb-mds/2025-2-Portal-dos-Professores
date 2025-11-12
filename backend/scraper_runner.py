import sys
import os
import asyncio 
import logging
import argparse 
from dotenv import load_dotenv 

from modes.sigaa_update import update_sigaa_data_all
from modes.lattes_update import update_lattes_data_for_departments, update_lattes_data_missing
from modes.scholar_update import update_scholar_data_for_departments, update_scholar_data_missing

import config

load_dotenv() 

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
    sys.path.append(os.path.dirname(os.path.abspath(__file__))) 
    
    parser = argparse.ArgumentParser(description="Roda os scrapers do SIGAA, Lattes ou Google Scholar.")

    mode_group = parser.add_mutually_exclusive_group(required=True) 
    
    mode_group.add_argument(
        "--sigaa",
        action="store_true",
        help="[PIPELINE] Executa o scraper do SIGAA (fonte da verdade) para TODOS os deptos."
    )
    mode_group.add_argument(
        "--lattes-missing",
        action="store_true",
        help="[PIPELINE] Executa o Lattes APENAS para professores com 'dados_lattes' nulos."
    )
    mode_group.add_argument(
        "--scholar-missing",
        action="store_true",
        help="[PIPELINE] Executa o Scholar APENAS para professores com 'dados_scholar' nulos."
    )
    mode_group.add_argument(
        "--lattes-dept", 
        action='append', 
        metavar='NOME_DEPARTAMENTO',
        help="[DEBUG] Força a atualização do Lattes para o(s) depto(s) especificado(s)."
    )
    mode_group.add_argument(
        "--scholar-dept", 
        action='append', 
        metavar='NOME_DEPARTAMENTO',
        help="[DEBUG] Força a atualização do Scholar para o(s) depto(s) especificado(s)."
    )

    parser.add_argument(
        "--missing",
        action="store_true",
        help="[MODIFICADOR] Use com --lattes-dept ou --scholar-dept para rodar apenas nos dados faltantes daquele depto."
    )
    
    args = parser.parse_args()
    
    if args.sigaa:
        logger.info("Modo --sigaa selecionado.")
        asyncio.run(update_sigaa_data_all())
        
    elif args.lattes_missing:
        logger.info("Modo --lattes-missing (Global) selecionado.")
        asyncio.run(update_lattes_data_missing())
        
    elif args.scholar_missing:
        logger.info("Modo --scholar-missing (Global) selecionado.")
        asyncio.run(update_scholar_data_missing())
        
    elif args.lattes_dept: 
        logger.info("Modo --lattes-dept (Debug) selecionado.")
        if args.missing: 
             logger.info("...Modo --missing ATIVADO: rodando apenas para dados faltantes no depto.")
        
        departments_to_process = get_valid_departments(args.lattes_dept)
        asyncio.run(update_lattes_data_for_departments(departments_to_process, missing_only=args.missing))
    
    elif args.scholar_dept:
        logger.info("Modo --scholar-dept (Debug) selecionado.")
        if args.missing:
             logger.info("...Modo --missing ATIVADO: rodando apenas para dados faltantes no depto.")
             
        departments_to_process = get_valid_departments(args.scholar_dept)
        asyncio.run(update_scholar_data_for_departments(departments_to_process, missing_only=args.missing))
        
    else:
        logger.error("Modo de operação inválido.")
        parser.print_help()
        sys.exit(1)