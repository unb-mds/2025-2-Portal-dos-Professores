import time
import os
from playwright.sync_api import sync_playwright, expect, TimeoutError, Page

PATH_TO_EXTENSION = os.path.join(os.path.dirname(__file__), '..', 'browser_extensions', 'buster_extension')
USER_DATA_DIR = os.path.join(os.path.dirname(__file__), '..', 'playwright_user_data')
if not os.path.exists(USER_DATA_DIR):
    os.makedirs(USER_DATA_DIR)


def scrape_lattes(page: Page, target_url: str) -> dict:
    """
    Versão mais rápida:
    - Timeout de extensão reduzido para 12s.
    - Espera pós-falha de página reduzida para 5s.
    """
    
    MAX_PAGE_ATTEMPTS = 3
    MAX_CHALLENGE_ATTEMPTS = 4

    for attempt_page in range(MAX_PAGE_ATTEMPTS):
        print(f"\n--- Tentativa de PÁGINA {attempt_page + 1}/{MAX_PAGE_ATTEMPTS} para a URL: {target_url} ---")
        try:

            page.goto(target_url, wait_until="domcontentloaded", timeout=30000)
            checkbox_frame = page.frame_locator('iframe[title="reCAPTCHA"]')
            checkbox = checkbox_frame.locator("#recaptcha-anchor")
            checkbox.click()
            time.sleep(3)

            if checkbox.get_attribute("aria-checked") == "true":
                print("Caminho fácil detectado. CAPTCHA resolvido.")
            
            else:
                print("Caminho Difícil detectado. Iniciando loop de desafio...")
                challenge_frame = page.frame_locator('iframe[title*="recaptcha challenge"]')
                
                for attempt_challenge in range(MAX_CHALLENGE_ATTEMPTS):
                    print(f"--- Tentativa de Desafio {attempt_challenge + 1}/{MAX_CHALLENGE_ATTEMPTS} ---")
                    try:
                        audio_button = challenge_frame.locator("#recaptcha-audio-button")
                        if audio_button.is_visible(timeout=5000):
                            print("Trocando para desafio de áudio...")
                            audio_button.click()
                            time.sleep(2) 
                    except TimeoutError:
                        print("Desafio de áudio não encontrado, ou já está no modo áudio.")
                        
                    try:
                        buster_button = challenge_frame.locator('.help-button-holder')
                        buster_button.wait_for(state="visible", timeout=5000) 
                        print(f"Acionando extensão...")
                        buster_button.click()
                    except TimeoutError:
                        print("Botão da extensão (Buster) não encontrado. Esta tentativa de página falhou.")
                        raise 
                    
                    try:
                        expect(checkbox).to_have_attribute("aria-checked", "true", timeout=8000) 
                        print("Extensão funcionou! CAPTCHA resolvido nesta tentativa.")
                        break
                    
                    except TimeoutError:
                        print(f"Extensão falhou ou demorou demais na tentativa {attempt_challenge + 1}.")
                        if attempt_challenge == MAX_CHALLENGE_ATTEMPTS - 1:
                            raise TimeoutError(f"Falha ao resolver o CAPTCHA após {MAX_CHALLENGE_ATTEMPTS} tentativas de desafio.")
                        
                        try:
                            refresh_button = challenge_frame.locator("#recaptcha-reload-button")
                            print("Clicando no botão 'Atualizar Desafio' (seta circular)...")
                            refresh_button.click()
                            time.sleep(3)
                        except Exception as e:
                            print(f"Não foi possível clicar em 'Atualizar Desafio': {e}")
                            raise 
                
                if checkbox.get_attribute("aria-checked") != "true":
                    raise Exception(f"Falha no loop de desafio após {MAX_CHALLENGE_ATTEMPTS} tentativas.")

            print("Aguardando confirmação final do CAPTCHA...")
            expect(checkbox).to_have_attribute("aria-checked", "true", timeout=5000) 
            print("✅ CAPTCHA resolvido com sucesso.")
            
            submit_button = page.locator("#submitBtn")
            expect(submit_button).to_be_enabled(timeout=5000)
            
            print("Enviando o formulário...")
            submit_button.click()
            
            page.wait_for_load_state("domcontentloaded")
            print("🎉 Formulário enviado! Acesso à página do currículo confirmado.")

            dados_extraidos = {
                "publicacoes": "Exemplo: 10 publicações",
                "resumo": "Exemplo: Resumo do CV..."
            }
            
            return {"status": "success", "url": target_url, "dados_lattes": dados_extraidos}

        except Exception as e:
            print(f"\n❌ Ocorreu um erro na tentativa de PÁGINA {attempt_page + 1}/{MAX_PAGE_ATTEMPTS}: {e}")
            if attempt_page == MAX_PAGE_ATTEMPTS - 1: 
                print(f"Máximo de tentativas de PÁGINA atingido. Desistindo da URL: {target_url}")
                return {"status": "error", "url": target_url, "dados_lattes": None}
            
            print("Aguardando 5 segundos antes de recarregar a PÁGINA...")
            time.sleep(3) 

    return {"status": "error", "url": target_url, "dados_lattes": None}

def run_lattes_pipeline(lattes_urls: list) -> list:
    """
    Inicia o processo de scraping do Lattes em modo SYNC.
    """
    with sync_playwright() as p:
        print("--- INICIANDO SCRAPER DO LATTES (COM CONTEXTO PERSISTENTE) ---")
        
        try:
            context = p.chromium.launch_persistent_context(
                USER_DATA_DIR,
                headless=False, 
                args=[
                    f'--disable-extensions-except={PATH_TO_EXTENSION}',
                    f'--load-extension={PATH_TO_EXTENSION}',
                ],
                slow_mo=250 
            )
        except Exception as e:
            print(f"[ERRO CRÍTICO LATTES] Falha ao iniciar o contexto do navegador com a extensão.")
            print(f"Erro: {e}")
            return [{"status": "error", "url": url, "dados_lattes": None} for url in lattes_urls]

        page = context.new_page()
        results = []
        
        try:
            for i, url in enumerate(lattes_urls):
                print("\n" + "="*80)
                print(f"Processando Lattes URL {i+1}/{len(lattes_urls)}")
                
                result_data = scrape_lattes(page, url)
                results.append(result_data)
                
                if result_data["status"] == "error":
                    print("Aguardando 3s após falha antes da próxima URL...")
                    time.sleep(3)
                else:
                    print("Aguardando 3 segundos antes da próxima URL...")
                    time.sleep(3)
        
        except Exception as e:
            print(f"[ERRO INESPERADO LATTES] O pipeline foi interrompido: {e}")
        
        finally:
            print("\nFechando o navegador do Lattes...")
            context.close()

    print("\n--- SCRAPER DO LATTES FINALIZADO ---")
    return results


if __name__ == '__main__':
    
    URLS_PARA_TESTAR = [
        "http://lattes.cnpq.br/3721949670501226", 
        "http://lattes.cnpq.br/8422791585805813", 
        "http://lattes.cnpq.br/1283620242273104", 
    ]

    print("--- EXECUTANDO TESTE LOCAL DO LATTES (COM TEMPOS REDUZIDOS) ---")
    resultados_teste = run_lattes_pipeline(URLS_PARA_TESTAR)
    
    print("\n--- RESULTADO FINAL DO TESTE ---")
    sucessos = len([r for r in resultados_teste if r["status"] == "success"])
    falhas = len(resultados_teste) - sucessos
    print(f"Total de URLs processadas: {len(resultados_teste)}")
    print(f"✅ Sucessos: {sucessos}")
    print(f"❌ Falhas: {falhas}")
    print("-----------------------------")