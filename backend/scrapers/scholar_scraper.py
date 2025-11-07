import time
import os
import logging
import random 
from playwright.sync_api import sync_playwright, expect, TimeoutError, Page

logger = logging.getLogger(__name__)

USER_DATA_DIR_BASE = os.path.join(os.path.dirname(__file__), '..', 'playwright_user_data')
PATH_TO_EXTENSION = os.path.join(os.path.dirname(__file__), '..', 'browser_extensions', 'buster_extension')


def parse_scholar_profile_page(page: Page) -> dict:
    """
    Função "Extrator". (VERSÃO CORRIGIDA E VALIDADA)
    Extrai os dados de uma página de perfil do Google Scholar que já está aberta.
    """
    logger.info("Iniciando extração da página de perfil...")
    
    try:
        interests_locators = page.locator("#gsc_prf_int .gsc_prf_inta")
        interests = interests_locators.all_text_contents()
        
        metrics = {}
        try:
            metrics_table = page.locator("#gsc_rsb_st")
            metrics = {
                "total_citacoes": metrics_table.locator("tr:nth-child(1) > td:nth-child(2)").text_content(timeout=7000),
                "h_index": metrics_table.locator("tr:nth-child(2) > td:nth-child(2)").text_content(timeout=7000),
                "i10_index": metrics_table.locator("tr:nth-child(3) > td:nth-child(2)").text_content(timeout=7000),
                "total_citacoes_5anos": metrics_table.locator("tr:nth-child(1) > td:nth-child(3)").text_content(timeout=7000),
                "h_index_5anos": metrics_table.locator("tr:nth-child(2) > td:nth-child(3)").text_content(timeout=7000),
                "i10_index_5anos": metrics_table.locator("tr:nth-child(3) > td:nth-child(3)").text_content(timeout=7000)
            }
            for key, val in metrics.items():
                try:
                    metrics[key] = int(val)
                except (ValueError, TypeError):
                    metrics[key] = 0
        except TimeoutError:
            logger.warning("Não foi possível extrair a tabela de métricas (seletor #gsc_rsb_st falhou).")
            
        publications = []
        pub_rows = page.locator("#gsc_a_b tr.gsc_a_tr").all()
        
        for row in pub_rows:
            try:
                title = row.locator(".gsc_a_at").text_content(timeout=3000)
                gray_divs = row.locator("td.gsc_a_t .gs_gray")
                authors = gray_divs.nth(0).text_content(timeout=3000)
                venue = gray_divs.nth(1).text_content(timeout=3000)
                year = row.locator(".gsc_a_y .gsc_a_h").text_content(timeout=3000)
                citations = row.locator(".gsc_a_c .gsc_a_ac").text_content(timeout=3000)
                
                publications.append({
                    "titulo": title,
                    "autores": authors,
                    "local": venue,
                    "ano": year or None,
                    "citacoes_artigo": int(citations) if citations and citations.strip() else 0
                })
            except Exception as e:
                logger.warning(f"Não foi possível extrair uma publicação: {e}")

        try:
            scholar_id = page.url.split("user=")[1].split("&")[0]
        except Exception:
            scholar_id = None
            
        afiliacao = page.locator(".gsc_prf_il").first.text_content(timeout=5000)
        email_verificado = page.locator("#gsc_prf_ivh").text_content(timeout=5000).replace("E-mail confirmado em ", "")

        dados_extraidos = {
            "scholar_id": scholar_id,
            "scholar_url": page.url,
            "afiliacao_scholar": afiliacao,
            "email_verificado": email_verificado,
            "metricas_citacao": metrics,
            "areas_interesse": [i.strip().title() for i in interests if i.strip()],
            "publicacoes": publications
        }
        
        logger.info(f"Extração concluída. {len(publications)} publicações encontradas.")
        return dados_extraidos
        
    except Exception as e:
        logger.error(f"Erro fatal ao extrair dados da página do perfil: {e}")
        return None


def find_and_scrape_professor(page: Page, prof_nome: str, worker_id: int) -> dict:
    """
    Função "Porteiro". (VERSÃO COM DETECÇÃO DE CAPTCHA CORRIGIDA)
    Navega para o Scholar, pesquisa o nome e lida com CAPTCHA/Resultados.
    Filtra especificamente por perfis da UnB.
    """
    MAX_SEARCH_ATTEMPTS = 2
    
    for attempt in range(MAX_SEARCH_ATTEMPTS):
        logger.info(f"[Trabalhador {worker_id}] Tentativa {attempt+1}/{MAX_SEARCH_ATTEMPTS} de buscar '{prof_nome}'")
        try:
            page.goto("https://scholar.google.com/", wait_until="domcontentloaded", timeout=30000)

            search_box = page.locator("#gs_hdr_tsi")
            search_box.fill(prof_nome)
            page.locator("#gs_hdr_tsb").click()

            profile_link_xpath = (
                "//*[contains(., 'unb.br') or contains(., 'Universidade de Brasilia') or contains(., 'Universidade de Brasília')]"
                "/ancestor::*[self::div[contains(@class, 'gs_r')] or self::td][1]"
                "/.//h4//a[contains(@href, '/citations?user=')]"
            )
            profile_link_locator = page.locator(profile_link_xpath)

            try:
                logger.info(f"[Trabalhador {worker_id}] Checando se o perfil é visível (sem CAPTCHA)...")
                profile_link_locator.wait_for(state="visible", timeout=2000)

                logger.info(f"[Trabalhador {worker_id}] Perfil da UnB encontrado (sem CAPTCHA).")

            except TimeoutError:
                logger.warning(f"[Trabalhador {worker_id}] Perfil não encontrado. ASSUMINDO CAPTCHA. Acionando Buster...")
                
                try:
                    checkbox_frame = page.frame_locator('iframe[title="reCAPTCHA"]')
                    checkbox = checkbox_frame.locator("#recaptcha-anchor")
                    checkbox.click(timeout=10000) 
                    logger.info(f"[Trabalhador {worker_id}] Clicou no checkbox 'Não sou um robô'.")
                    time.sleep(2) 

                    challenge_frame = page.frame_locator('iframe[title*="recaptcha challenge"]')
                    buster_button = challenge_frame.locator('.help-button-holder')
                    buster_button.wait_for(state="visible", timeout=10000) 
                    
                    logger.info(f"[Trabalhador {worker_id}] Clicando no botão da extensão Buster...")
                    buster_button.click()

                    logger.info(f"[Trabalhador {worker_id}] Aguardando Buster (até 30s) e o perfil da UnB aparecer...")
                    profile_link_locator.wait_for(state="visible", timeout=30000) # Agora esperamos pelo perfil
                    logger.info(f"[Trabalhador {worker_id}] CAPTCHA resolvido! Perfil da UnB agora é visível.")
                
                except Exception as e_captcha:
                    logger.error(f"[Trabalhador {worker_id}] Falha ao tentar resolver o CAPTCHA com o Buster: {e_captcha}")
                    raise TimeoutError("Falha ao resolver o CAPTCHA.")

            profile_name = profile_link_locator.text_content(timeout=5000)
            logger.info(f"[Trabalhador {worker_id}] Perfil encontrado: '{profile_name}'. Navegando para a página.")
            
            profile_link_locator.click()
            page.wait_for_load_state("domcontentloaded")

            return parse_scholar_profile_page(page)

        except TimeoutError:
            logger.warning(f"[Trabalhador {worker_id}] Timeout: Perfil de '{prof_nome}' com afiliação UnB não encontrado na página 1 (ou falha no CAPTCHA).")
            return None 
        except Exception as e:
            logger.error(f"[Trabalhador {worker_id}] Erro inesperado ao buscar '{prof_nome}': {e}")
            if attempt == MAX_SEARCH_ATTEMPTS - 1:
                return None 
            time.sleep(3)
            
    return None 

def run_scholar_pipeline(professors_list: list, worker_id: int = 1) -> dict:
    """
    Função principal do pipeline (baseada no seu lattes_scraper.py).
    Inicia o Playwright, e itera sobre a lista de professores.
    Retorna um mapa {sigaa_url: dados_scholar}
    """

    worker_data_dir = os.path.join(USER_DATA_DIR_BASE, f"worker_scholar_{worker_id}")
    if not os.path.exists(worker_data_dir):
        os.makedirs(worker_data_dir)
    
    results_map = {} 
    
    with sync_playwright() as p:
        logger.info(f"[Trabalhador {worker_id}] --- INICIANDO SCRAPER DO SCHOLAR (PLAYWRIGHT) ---")
        try:
            context = p.chromium.launch_persistent_context(
                worker_data_dir, 
                headless=False, 
                args=[
                    f'--disable-extensions-except={PATH_TO_EXTENSION}',
                    f'--load-extension={PATH_TO_EXTENSION}',
                ],
                slow_mo=250 
            )
        except Exception as e:
            logger.error(f"[ERRO CRÍTICO SCHOLAR] Falha ao iniciar o contexto do navegador: {e}")
            return {}

        page = context.new_page()
        
        try:
            for i, prof in enumerate(professors_list):
                nome = prof.get("nome")
                sigaa_url = prof.get("pagina_sigaa_url")
                if not nome or not sigaa_url:
                    continue
                
                logger.info(f"[Trabalhador {worker_id}] " + "="*80)
                logger.info(f"[Trabalhador {worker_id}] Processando Professor {i+1}/{len(professors_list)}: {nome}")

                dados_extraidos = find_and_scrape_professor(page, nome, worker_id)
                
                if dados_extraidos:
                    logger.info(f"[Trabalhador {worker_id}] ✅ Sucesso para {nome}.")
                    results_map[sigaa_url] = dados_extraidos
                else:
                    logger.warning(f"[Trabalhador {worker_id}] ❌ Falha ou não encontrado para {nome}.")
                    results_map[sigaa_url] = None

                human_delay = random.randint(5, 15)
                logger.info(f"[Trabalhador {worker_id}] Pausando por {human_delay}s (humanização)...")
                time.sleep(human_delay)
            
        except Exception as e:
            logger.error(f"[ERRO INESPERADO SCHOLAR] O pipeline foi interrompido: {e}")
        
        finally:
            logger.info(f"\n[Trabalhador {worker_id}] Fechando o navegador do Scholar...")
            context.close()

    logger.info(f"\n[Trabalhador {worker_id}] --- SCRAPER DO SCHOLAR (PLAYWRIGHT) FINALIZADO ---")
    return results_map