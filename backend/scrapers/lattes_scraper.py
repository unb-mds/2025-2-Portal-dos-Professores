import time
import os
from playwright.sync_api import sync_playwright, expect, TimeoutError, Page

PATH_TO_EXTENSION = os.path.join(os.path.dirname(__file__), '..', 'browser_extensions', 'buster_extension')

USER_DATA_DIR = os.path.join(os.path.dirname(__file__), '..', 'playwright_user_data')
if not os.path.exists(USER_DATA_DIR):
    os.makedirs(USER_DATA_DIR)


def scrape_lattes(page: Page, target_url: str):
    """
    Usa uma PÁGINA JÁ ABERTA para navegar até uma URL do Lattes e resolver o CAPTCHA.
    """
    try:
        print(f"Navegando na mesma aba para: {target_url}")
        page.goto(target_url, wait_until="domcontentloaded", timeout=30000)

        recaptcha_frame = page.frame_locator('iframe[title="reCAPTCHA"]')
        checkbox = recaptcha_frame.locator("#recaptcha-anchor")
        checkbox.click()

        time.sleep(2)
        is_checked = checkbox.get_attribute("aria-checked")

        if is_checked != "true":
            print("Caminho Difícil detectado. Acionando a extensão...")
            challenge_frame = page.frame_locator('iframe[title*="recaptcha challenge"]')
            buster_button = challenge_frame.locator('.help-button-holder')
            
            buster_button.wait_for(state="visible", timeout=15000)
            buster_button.click()
            print("Extensão acionada.")

        print("Aguardando confirmação do CAPTCHA...")
        expect(checkbox).to_have_attribute("aria-checked", "true", timeout=45000)
        print("✅ CAPTCHA resolvido.")
        
        submit_button = page.locator("#submitBtn")
        expect(submit_button).to_be_enabled(timeout=5000)
        
        print("Enviando o formulário...")
        submit_button.click()
        
        page.wait_for_load_state("domcontentloaded")
        print("🎉 Formulário enviado! Acesso à página do currículo confirmado.")
        
        return True

    except Exception as e:
        print(f"\n❌ Ocorreu um erro ao processar {target_url}: {e}")
        return False

if __name__ == '__main__':
    
    URLS_PARA_TESTAR = [
        "http://buscatextual.cnpq.br/buscatextual/visualizacv.do?metodo=apresentar&id=K4208064D9",
        "http://buscatextual.cnpq.br/buscatextual/visualizacv.do?metodo=apresentar&id=K4717331H6",
        "http://buscatextual.cnpq.br/buscatextual/visualizacv.do?metodo=apresentar&id=K4808828H7",
        "http://buscatextual.cnpq.br/buscatextual/visualizacv.do?metodo=apresentar&id=K4137001Z7",
        "http://buscatextual.cnpq.br/buscatextual/visualizacv.do?metodo=apresentar&id=K4584071U7",
    ]

    with sync_playwright() as p:
        print("--- INICIANDO TESTE EM LOTE (COM CONTEXTO PERSISTENTE) ---")
        
        context = p.chromium.launch_persistent_context(
            USER_DATA_DIR,
            headless=False,
            args=[
                f'--disable-extensions-except={PATH_TO_EXTENSION}',
                f'--load-extension={PATH_TO_EXTENSION}',
            ],
            slow_mo=250
        )
        page = context.new_page()

        sucessos, falhas = 0, 0
        try:
            for i, url in enumerate(URLS_PARA_TESTAR):
                print("\n" + "="*50)
                print(f"Processando URL {i+1}/{len(URLS_PARA_TESTAR)}")
                
                sucesso = scrape_lattes(page, url)
                
                if sucesso:
                    sucessos += 1
                else:
                    falhas += 1
                
                print("Aguardando 5 segundos antes da próxima URL...")
                time.sleep(5)
        finally:
            print("\nFechando o navegador...")
            context.close()

        print("\n--- RESULTADO FINAL DO TESTE ---")
        print(f"Total de URLs processadas: {len(URLS_PARA_TESTAR)}")
        print(f"✅ Sucessos: {sucessos}")
        print(f"❌ Falhas: {falhas}")
        print("-----------------------------")

