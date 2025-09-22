import os
import asyncio
from dotenv import load_dotenv
from playwright.async_api import async_playwright
from google import genai

# Carrega a chave de API do arquivo .env
load_dotenv()

async def run_poc_wikipedia():
    """
    POC que extrai o primeiro parágrafo da Wikipedia, resume
    e mostra uma comparação clara entre o antes e o depois.
    """
    print("--- INICIANDO POC (Wikipedia com Comparação) ---")

    # --- 1. SCRAPING ---
    print("\n1. Extraindo texto da Wikipedia...")
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        await page.goto("https://pt.wikipedia.org/wiki/Universidade_de_Bras%C3%ADlia")

        locator = page.locator("#mw-content-text .mw-parser-output > p:not(.mw-empty-elt)").first
        
        extracted_text = await locator.inner_text()
        await browser.close()
        print("   -> Texto extraído com sucesso!")

    # --- 2. SUMARIZAÇÃO ---
    print("\n2. Enviando texto para a API do Gemini...")
    if not os.getenv("GEMINI_API_KEY"):
        raise ValueError("Chave GEMINI_API_KEY não encontrada. Verifique seu arquivo .env")
    
    client = genai.Client()
    prompt = f"Resuma o seguinte texto em uma frase concisa e informativa: '{extracted_text}'"
    response = client.models.generate_content(model="gemini-1.5-flash", contents=prompt)
    summary = response.text.strip()
    print("   -> Resumo recebido!")

    # --- 3. RESULTADO DA COMPARAÇÃO ---
    print("\n\n==================================================")
    print("=          RESULTADO DA COMPARAÇÃO         =")
    print("==================================================")
    
    print("\n--- TEXTO ORIGINAL EXTRAÍDO (WIKIPEDIA) ---")
    print(f"(Tamanho: {len(extracted_text)} caracteres)")
    print("--------------------------------------------------")
    print(extracted_text)
    
    print("\n\n--- RESUMO GERADO PELO GEMINI ---")
    print(f"(Tamanho: {len(summary)} caracteres)")
    print("--------------------------------------------------")
    print(summary)
    
    print("\n==================================================")
    print("\n--- POC CONCLUÍDA ---")


if __name__ == "__main__":
    asyncio.run(run_poc_wikipedia())