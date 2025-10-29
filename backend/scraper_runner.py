import sys
import os
import asyncio 
import logging
import argparse 
from dotenv import load_dotenv 
from modes.sigaa_update import update_sigaa_data_all
from modes.lattes_update import update_lattes_data_for_departments
import config

load_dotenv() 
sys.path.append(os.path.dirname(os.path.abspath(__file__))) 

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

#logica com args terminal
if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Roda os scrapers do SIGAA (todos) ou Lattes (por depto).")
    
    mode_group = parser.add_mutually_exclusive_group(required=True) 
    mode_group.add_argument(
        "--sigaa-only", 
        action="store_true",
        help="Executa o scraper do SIGAA para TODOS os deptos, mesclando os dados no JSON existente (preserva Lattes)."
    )
    mode_group.add_argument(
        "--lattes-dept", 
        action='append', 
        metavar='NOME_DEPARTAMENTO',
        help="Executa o scraper do LATTES APENAS para o(s) depto(s) especificado(s), atualizando 'dados_lattes' no JSON."
    )
    
    args = parser.parse_args()
    
    if args.sigaa_only:
        logger.info("Modo --sigaa-only selecionado.")
        asyncio.run(update_sigaa_data_all())
        
    elif args.lattes_dept:
        logger.info("Modo --lattes-dept selecionado.")
        departments_to_process = []
        for dept_name in args.lattes_dept:
            normalized_dept = next((d for d in config.ALL_DEPARTMENTS if d.strip().lower() == dept_name.strip().lower()), None)
            if normalized_dept:
                departments_to_process.append(normalized_dept)
            else:
                logger.warning(f"Departamento '{dept_name}' não reconhecido ou não está na lista ALL_DEPARTMENTS em config.py. Ignorando.")
        
        if not departments_to_process:
             logger.error("Nenhum departamento válido fornecido para --lattes-dept. Encerrando.")
             sys.exit(1) 
        
        asyncio.run(update_lattes_data_for_departments(departments_to_process))
        
    else:
        logger.error("Modo de operação inválido. Use --sigaa-only ou --lattes-dept.")
        parser.print_help()
        sys.exit(1)