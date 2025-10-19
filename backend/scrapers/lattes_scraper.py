import time
import os
from playwright.sync_api import sync_playwright, expect, TimeoutError

PATH_TO_EXTENSION = os.path.join(os.path.dirname(__file__), '..', 'browser_extensions', 'buster_extension')

def scrape_lattes(target_url: str):
    """
    Navega até uma URL do Lattes, resolve o reCAPTCHA v2 e submete o formulário.

    Args:
        target_url: A URL do currículo Lattes a ser raspado.

    Returns:
        playwright.sync_api.Page: O objeto 'Page' da página de sucesso para raspagem posterior.
        None: Em caso de falha na automação.
    """
    if not os.path.exists(PATH_TO_EXTENSION):
        print(f"ERRO CRÍTICO: Pasta da extensão não encontrada em: {PATH_TO_EXTENSION}")
        return None

    playwright_instance = sync_playwright().start()
    
    try:
        browser = playwright_instance.chromium.launch(
            headless=False, 
            args=[
                f'--disable-extensions-except={PATH_TO_EXTENSION}',
                f'--load-extension={PATH_TO_EXTENSION}',
            ],
            slow_mo=250
        )
        context = browser.new_context()
        page = context.new_page()

        print(f"Navegando para: {target_url}")
        page.goto(target_url)

        recaptcha_frame = page.frame_locator('iframe[title="reCAPTCHA"]')
        checkbox = recaptcha_frame.locator("#recaptcha-anchor")
        checkbox.click()

        time.sleep(2) 
        is_checked = checkbox.get_attribute("aria-checked")

        if is_checked != "true":
            print("Caminho Difícil detectado. Acionando a extensão...")
            challenge_frame = page.frame_locator('iframe[title*="recaptcha challenge"]')
            buster_button = challenge_frame.locator('.help-button-holder')
            buster_button.wait_for(state="visible", timeout=10000)
            buster_button.click()

        print("Aguardando confirmação do CAPTCHA...")
        expect(checkbox).to_have_attribute("aria-checked", "true", timeout=45000)
        print("✅ CAPTCHA resolvido.")
        
        submit_button = page.locator("#submitBtn")
        expect(submit_button).to_be_enabled(timeout=5000)
        
        print("Enviando o formulário...")
        submit_button.click()
        
        page.wait_for_load_state("domcontentloaded")
        print("🎉 Formulário enviado com sucesso!")
        
        return page

    except Exception as e:
        print(f"\n❌ Ocorreu um erro na automação do Lattes: {e}")
        if 'playwright_instance' in locals():
            playwright_instance.stop() 
        return None


if __name__ == '__main__':
    URL_DE_TESTE = "http://buscatextual.cnpq.br/buscatextual/visualizacv.do?metodo=apresentar&id=K4760244T7"
    
    page_resultado = scrape_lattes(URL_DE_TESTE)
    
    if page_resultado:
        print("\nScraping de teste concluído. A página de resultados está pronta.")
        time.sleep(5) 
        page_resultado.context.browser.close()
    else:
        print("\nScraping de teste falhou.")