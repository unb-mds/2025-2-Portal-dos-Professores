import json
from urllib.parse import urljoin

# Dependências:
# pip install playwright beautifulsoup4
# python -m playwright install --with-deps

from playwright.sync_api import sync_playwright


SIGAA_URL = "https://sigaa.unb.br/sigaa/public/docente/busca_docentes.jsf"
WIKI_URL = "https://en.wikipedia.org/wiki/University_of_Bras%C3%ADlia"


def scrape_sigaa(max_rows=5):
    """
    Abre a busca pública do SIGAA, preenche o campo 'Nome' com 'a',
    clica em 'Buscar' e captura as primeiras linhas da tabela (Nome + Link do perfil).
    Retorna um dicionário pronto para salvar em JSON.
    """
    with sync_playwright() as p:
        browser = p.chromium.launch()  # headless por padrão
        page = browser.new_page()
        page.goto(SIGAA_URL, wait_until="domcontentloaded", timeout=45000)

        # Preenche o campo 'Nome' (JSF costuma usar sufixo ...:nome)
        # Usamos um seletor genérico que procura input cujo 'name' termina em 'nome'.
        name_selector = 'input[name$="nome"]'
        page.wait_for_selector(name_selector, timeout=20000)
        page.fill(name_selector, "a")

        # Clica no botão "Buscar"
        # Tentamos seletores comuns: value="Buscar" ou botão com texto "Buscar"
        # (cobre variações de JSF).
        try:
            page.click('input[type="submit"][value="Buscar"]', timeout=5000)
        except Exception:
            page.get_by_role("button", name="Buscar").click(timeout=5000)

        # Aguarda tabela de resultados. Vamos procurar uma <table> na página
        # e ler as primeiras linhas do <tbody>.
        page.wait_for_selector("table", timeout=45000)

        # Muitos sistemas SIGAA usam a primeira tabela abaixo do formulário.
        # Para ser mais robusto, pegamos a primeira <table> que tenha um <tbody> com <tr>.
        rows = page.locator("table tbody tr")
        total = rows.count()
        if total == 0:
            raise RuntimeError("Nenhuma linha encontrada após a busca no SIGAA.")

        docentes = []
        limit = min(total, max_rows)

        for i in range(limit):
            row = rows.nth(i)
            # Geralmente a 1ª coluna tem o nome e um <a> para o perfil público.
            tds = row.locator("td")
            td_count = tds.count()
            if td_count == 0:
                continue

            # tenta pegar link e nome da primeira célula
            first_td = tds.nth(0)
            name_text = first_td.inner_text().strip()

            # se houver link, pega o href (relativo) e torna absoluto
            link = None
            links = first_td.locator("a")
            if links.count() > 0:
                href = links.first.get_attribute("href")
                if href:
                    link = urljoin(SIGAA_URL, href)

            if name_text:
                docentes.append(
                    {
                        "nome": name_text,
                        "perfil_url": link,
                    }
                )

        if not docentes:
            raise RuntimeError("Tabela carregou, mas não consegui extrair docentes.")

        browser.close()

    return {
        "fonte": "SIGAA/UnB",
        "url_busca": SIGAA_URL,
        "consulta": {"nome": "a"},
        "coletados": docentes,
        "observacao": "POC automatizada via Playwright (headless).",
    }


def fallback_wikipedia():
    # Fallback simples caso o SIGAA mude o layout ou bloqueie:
    # retorna payload válido para não quebrar o pipeline.
    return {
        "fonte": "Wikipedia (fallback)",
        "url": WIKI_URL,
        "coletados": [
            {"nome": "Universidade de Brasília", "perfil_url": WIKI_URL}
        ],
        "observacao": "Fallback usado apenas para comprovar pipeline quando SIGAA falha.",
    }


if __name__ == "__main__":
    try:
        payload = scrape_sigaa(max_rows=5)
    except Exception as e:
        print(f"[WARN] Erro no SIGAA: {e}")
        payload = fallback_wikipedia()

    out_path = "professores.json"
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)
    print(f"OK - {out_path} gerado")
