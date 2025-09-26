from playwright.sync_api import sync_playwright
from urllib.parse import urljoin
import time

class SigaaScraper:
    def __init__(self):
        self.base_url = "https://sigaa.unb.br"
        self.search_url = "https://sigaa.unb.br/sigaa/public/docente/busca_docentes.jsf"

    def scrape_professor_cards(self):
        """
        Navega até a página de busca do SIGAA, filtra pelo Campus Gama,
        e extrai os dados (nome, departamento, foto, URL do perfil SIGAA)
        de todos os professores listados nos cards.

        Retorna:
            list: Uma lista de dicionários, cada um representando um professor
                  com os dados extraídos do card.
        """
        with sync_playwright() as p:
            print("Iniciando o navegador...")
            browser = p.chromium.launch(headless=True) 
            page = browser.new_page()

            print(f"Navegando para: {self.search_url}")
            page.goto(self.search_url, timeout=60000)

            # banner de cookies (se ele aparecer)
            cookie_button_locator = page.get_by_role("button", name="Ciente")
            if cookie_button_locator.is_visible(timeout=5000):
                print("Banner de cookies encontrado. Clicando em 'Ciente'...")
                cookie_button_locator.click()
            else:
                print("Banner de cookies não encontrado. Continuando...")

            # departamento 
            department_label = "CAMPUS UNB GAMA: FACULDADE DE CIÊNCIAS E TECNOLOGIAS EM ENGENHARIA - BRASÍLIA"
            print(f"Selecionando o departamento: '{department_label}'...")
            page.locator('select[name="form:departamento"]').select_option(label=department_label)

            # clicar em "Buscar"
            print("Clicando em 'Buscar'...")
            page.get_by_role("button", name="Buscar").click()

            # esperar os resultados aparecerem 
            print("Aguardando os resultados da busca...")
            results_table_selector = 'table.listagem'
            page.wait_for_selector(results_table_selector, timeout=30000)
            print("Resultados carregados.")

            # -extrair dados de cada card de professor 
            # seleciona todas as linhas (tr) dentro do tbody da tabela de resultados
            professor_rows = page.locator(f'{results_table_selector} tbody tr').all()
            
            scraped_data = []
            print(f"Encontradas {len(professor_rows)} linhas de professores. Extraindo dados...")

            for row in professor_rows:
                try:
                    #foto do professor
                    foto_element = row.locator('td:nth-child(1) img')
                    foto_url_relativa = foto_element.get_attribute('src')
                    foto_url_absoluta = urljoin(self.base_url, foto_url_relativa)

                    # nome
                    nome = row.locator('td:nth-child(2) span.nome').inner_text().strip()
                    
                    # departamento
                    departamento = row.locator('td:nth-child(2) span.departamento').inner_text().strip()

                    # link da página pública
                    link_element = row.locator('td:nth-child(2) span.pagina a')
                    pagina_publica_relativa = link_element.get_attribute('href')
                    pagina_publica_url = urljoin(self.base_url, pagina_publica_relativa)

                    scraped_data.append({
                        "nome": nome,
                        "departamento": departamento,
                        "foto_url": foto_url_absoluta,
                        "pagina_sigaa_url": pagina_publica_url
                    })
                except Exception as e:
                    print(f"  [AVISO] Falha ao extrair dados de uma linha/card. Erro: {e}. Provavelmente uma linha vazia ou inesperada.")
                    # Opcional: print(f"  HTML da linha com erro: {row.inner_html()}")

            browser.close()
            print(f"Extração concluída. Total de {len(scraped_data)} professores processados com sucesso!")
            return scraped_data