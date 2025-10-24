import time
import os
from playwright.sync_api import sync_playwright, expect, TimeoutError, Page
from scrapers.lattes_parser import parse_lattes_page 

USER_DATA_DIR_BASE = os.path.join(os.path.dirname(__file__), '..', 'playwright_user_data')
PATH_TO_EXTENSION = os.path.join(os.path.dirname(__file__), '..', 'browser_extensions', 'buster_extension')


def scrape_lattes(page: Page, target_url: str, worker_id: int = 1) -> dict:
    """
    Função "Porteiro".
    Navega, resolve o CAPTCHA com retentativas, e chama o
    parser externo para extrair os dados.
    """
    
    MAX_PAGE_ATTEMPTS = 3
    MAX_CHALLENGE_ATTEMPTS = 4

    for attempt_page in range(MAX_PAGE_ATTEMPTS):
        print(f"[Trabalhador {worker_id}] --- Tentativa de PÁGINA {attempt_page + 1}/{MAX_PAGE_ATTEMPTS} para a URL: {target_url} ---")
        try:
            page.goto(target_url, wait_until="domcontentloaded", timeout=30000)
            checkbox_frame = page.frame_locator('iframe[title="reCAPTCHA"]')
            checkbox = checkbox_frame.locator("#recaptcha-anchor")
            checkbox.click()
            time.sleep(3) 
            if checkbox.get_attribute("aria-checked") == "true":
                print(f"[Trabalhador {worker_id}] Caminho fácil detectado. CAPTCHA resolvido.")
            
            else:
                print(f"[Trabalhador {worker_id}] Caminho Difícil detectado. Iniciando loop de desafio...")
                challenge_frame = page.frame_locator('iframe[title*="recaptcha challenge"]')
                
                for attempt_challenge in range(MAX_CHALLENGE_ATTEMPTS):
                    print(f"[Trabalhador {worker_id}] --- Tentativa de Desafio {attempt_challenge + 1}/{MAX_CHALLENGE_ATTEMPTS} ---")

                    try:
                        audio_button = challenge_frame.locator("#recaptcha-audio-button")
                        if audio_button.is_visible(timeout=5000):
                            print(f"[Trabalhador {worker_id}] Trocando para desafio de áudio...")
                            audio_button.click()
                            time.sleep(2) 
                    except TimeoutError:
                        print(f"[Trabalhador {worker_id}] Desafio de áudio não encontrado, ou já está no modo áudio.")

                    try:
                        buster_button = challenge_frame.locator('.help-button-holder')
                        buster_button.wait_for(state="visible", timeout=5000) 
                        print(f"[Trabalhador {worker_id}] Acionando extensão...")
                        buster_button.click()
                    except TimeoutError:
                        print(f"[Trabalhador {worker_id}] Botão da extensão (Buster) não encontrado. Esta tentativa de página falhou.")
                        raise 

                    try:
                        expect(checkbox).to_have_attribute("aria-checked", "true", timeout=12000) 
                        print(f"[Trabalhador {worker_id}] Extensão funcionou! CAPTCHA resolvido nesta tentativa.")
                        break

                    except TimeoutError:
                        print(f"[Trabalhador {worker_id}] Extensão falhou ou demorou demais na tentativa {attempt_challenge + 1}.")
                        if attempt_challenge == MAX_CHALLENGE_ATTEMPTS - 1:
                            raise TimeoutError(f"Falha ao resolver o CAPTCHA após {MAX_CHALLENGE_ATTEMPTS} tentativas de desafio.")
                        
                        try:
                            refresh_button = challenge_frame.locator("#recaptcha-reload-button")
                            print(f"[Trabalhador {worker_id}] Clicando no botão 'Atualizar Desafio' (seta circular)...")
                            refresh_button.click()
                            time.sleep(3) 
                        except Exception as e:
                            print(f"[Trabalhador {worker_id}] Não foi possível clicar em 'Atualizar Desafio': {e}")
                            raise 
                
                if checkbox.get_attribute("aria-checked") != "true":
                    raise Exception(f"Falha no loop de desafio após {MAX_CHALLENGE_ATTEMPTS} tentativas.")

            print(f"[Trabalhador {worker_id}] Aguardando confirmação final do CAPTCHA...")
            expect(checkbox).to_have_attribute("aria-checked", "true", timeout=5000) 
            print(f"[Trabalhador {worker_id}] ✅ CAPTCHA resolvido com sucesso.")
            
            submit_button = page.locator("#submitBtn")
            expect(submit_button).to_be_enabled(timeout=5000)
            
            print(f"[Trabalhador {worker_id}] Enviando o formulário...")
            submit_button.click()
            
            page.wait_for_load_state("domcontentloaded")
            print(f"[Trabalhador {worker_id}] 🎉 Formulário enviado! Acesso à página do currículo confirmado.")

            print(f"[Trabalhador {worker_id}] Chamando o parser para extrair os dados...")
            dados_extraidos = parse_lattes_page(page)

            print(f"[Trabalhador {worker_id}] Dados extraídos com sucesso.")
            
            return {"status": "success", "url": target_url, "dados_lattes": dados_extraidos}


        except Exception as e:
            print(f"\n[Trabalhador {worker_id}] ❌ Ocorreu um erro na tentativa de PÁGINA {attempt_page + 1}/{MAX_PAGE_ATTEMPTS}: {e}")
            if attempt_page == MAX_PAGE_ATTEMPTS - 1: 
                print(f"[Trabalhador {worker_id}] Máximo de tentativas de PÁGINA atingido. Desistindo da URL: {target_url}")
                return {"status": "error", "url": target_url, "dados_lattes": None}
            
            print(f"[Trabalhador {worker_id}] Aguardando 5 segundos antes de recarregar a PÁGINA...")
            time.sleep(5) 

    return {"status": "error", "url": target_url, "dados_lattes": None}


def run_lattes_pipeline(lattes_urls: list, worker_id: int = 1) -> list:
    """
    Inicia o processo de scraping do Lattes em modo SYNC para um trabalhador.
    Usa um worker_id para criar uma pasta de dados de usuário ("apartamento") única.
    """
    
    worker_data_dir = os.path.join(USER_DATA_DIR_BASE, f"worker_{worker_id}")
    if not os.path.exists(worker_data_dir):
        os.makedirs(worker_data_dir)
    print(f"[Trabalhador {worker_id}] Usando diretório de dados: {worker_data_dir}")

    with sync_playwright() as p:
        print(f"[Trabalhador {worker_id}] --- INICIANDO SCRAPER DO LATTES (COM CONTEXTO PERSISTENTE) ---")
        
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
            print(f"[Trabalhador {worker_id}] [ERRO CRÍTICO LATTES] Falha ao iniciar o contexto do navegador com a extensão.")
            print(f"[Trabalhador {worker_id}] Erro: {e}")
            return [{"status": "error", "url": url, "dados_lattes": None} for url in lattes_urls]

        page = context.new_page()
        results = []
        
        try:
            for i, url in enumerate(lattes_urls):
                print(f"[Trabalhador {worker_id}] " + "="*80)
                print(f"[Trabalhador {worker_id}] Processando Lattes URL {i+1}/{len(lattes_urls)} (Global {url})")
                
                result_data = scrape_lattes(page, url, worker_id)
                results.append(result_data)
                
                if result_data["status"] == "error":
                    print(f"[Trabalhador {worker_id}] Aguardando 5s após falha antes da próxima URL...")
                    time.sleep(5)
                else:
                    print(f"[Trabalhador {worker_id}] Aguardando 3 segundos antes da próxima URL...")
                    time.sleep(3)
        
        except Exception as e:
            print(f"[Trabalhador {worker_id}] [ERRO INESPERADO LATTES] O pipeline foi interrompido: {e}")
        
        finally:
            print(f"\n[Trabalhador {worker_id}] Fechando o navegador do Lattes...")
            context.close()

    print(f"\n[Trabalhador {worker_id}] --- SCRAPER DO LATTES FINALIZADO ---")
    return results


if __name__ == '__main__':
    
    URLS_PARA_TESTAR = [
        "http://lattes.cnpq.br/3721949670501226", 
        "http://lattes.cnpq.br/6871745921667698", 
        "http://lattes.cnpq.br/1283620242273104", 
    ]

    print("--- EXECUTANDO TESTE LOCAL DO LATTES (COM PARSER SEPARADO) ---")
    resultados_teste = run_lattes_pipeline(URLS_PARA_TESTAR, worker_id=99)
    
    print("\n--- RESULTADO FINAL DO TESTE ---")
    sucessos = len([r for r in resultados_teste if r["status"] == "success"])
    falhas = len(resultados_teste) - sucessos
    print(f"Total de URLs processadas: {len(resultados_teste)}")
    print(f"✅ Sucessos: {sucessos}")
    print(f"❌ Falhas: {falhas}")
    print("-----------------------------")
    
    print("\n--- DADOS EXTRAÍDOS NO TESTE (AMOSTRA) ---")
    for res in resultados_teste:
        if res["status"] == "success":
            print(f"URL: {res['url']}")
            print(f"  Resumo: {res['dados_lattes'].get('resumo_cv', 'N/A')[:50]}...")
            print(f"  Formação: {len(res['dados_lattes'].get('formacao_academica', []))} itens")
            print(f"  Projetos de Pesquisa: {len(res['dados_lattes'].get('projetos_pesquisa', []))} itens")
            print(f"  Orientações de Mestrado: {len(res['dados_lattes'].get('orientacoes_mestrado', []))} itens")
            print(f"  Orientações de TCC: {len(res['dados_lattes'].get('orientacoes_tcc', []))} itens")
            
            if res['dados_lattes'].get('projetos_pesquisa'):
                print(f"    - Ex. Projeto: '{res['dados_lattes']['projetos_pesquisa'][0]['titulo']}'")
            if res['dados_lattes'].get('orientacoes_mestrado'):
                print(f"    - Ex. Mestrado: '{res['dados_lattes']['orientacoes_mestrado'][0][:50]}...'")
            print("-" * 20)
    print("---------------------------------")