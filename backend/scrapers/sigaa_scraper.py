from playwright.sync_api import sync_playwright
from urllib.parse import urljoin
import time

class SigaaScraper:
    def __init__(self):
        self.base_url = "https://sigaa.unb.br"
        self.search_url = "https://sigaa.unb.br/sigaa/public/docente/busca_docentes.jsf"

    def scrape_professors_by_department(self, department_labels: list):
        """
        Navega até a página de busca do SIGAA e extrai os dados de todos
        os professores para cada um dos departamentos fornecidos na lista.

        Args:
            department_labels (list): Uma lista de strings, onde cada string é o
                                      nome exato do departamento a ser buscado.

        Retorna:
            list: Uma lista de dicionários com os dados de todos os professores
                  encontrados, já sem duplicatas.
        """
        all_scraped_data = []

        with sync_playwright() as p:
            print("Iniciando o navegador...")
            browser = p.chromium.launch(headless=True)
            page = browser.new_page()

            for department in department_labels:
                try:
                    print("-" * 50)
                    print(f"Processando o departamento: '{department}'")
                    
                    page.goto(self.search_url, timeout=60000)

                    cookie_button_locator = page.get_by_role("button", name="Ciente")
                    if cookie_button_locator.is_visible(timeout=5000):
                        cookie_button_locator.click()

                    print(f"Selecionando o departamento no formulário...")
                    page.locator('select[name="form:departamento"]').select_option(label=department)

                    page.get_by_role("button", name="Buscar").click()

                    print("Aguardando os resultados da busca...")
                    results_table_selector = 'table.listagem'
                    page.wait_for_selector(results_table_selector, timeout=30000)
                    print("Resultados carregados.")

                    professor_rows = page.locator(f'{results_table_selector} tbody tr').all()
                    
                    department_data = []
                    print(f"Encontradas {len(professor_rows)} linhas. Extraindo dados...")

                    for row in professor_rows:
                        try:
                            foto_element = row.locator('td:nth-child(1) img')
                            foto_url_relativa = foto_element.get_attribute('src')
                            foto_url_absoluta = urljoin(self.base_url, foto_url_relativa)
                            
                            nome = row.locator('td:nth-child(2) span.nome').inner_text().strip()
                            departamento_extraido = row.locator('td:nth-child(2) span.departamento').inner_text().strip()
                            
                            link_element = row.locator('td:nth-child(2) span.pagina a')
                            pagina_publica_relativa = link_element.get_attribute('href')
                            pagina_publica_url = urljoin(self.base_url, pagina_publica_relativa)

                            department_data.append({
                                "nome": nome,
                                "departamento": departamento_extraido,
                                "foto_url": foto_url_absoluta,
                                "pagina_sigaa_url": pagina_publica_url
                            })
                        except Exception as e:
                            print(f"  [AVISO] Falha ao extrair dados de uma linha. Erro: {e}")
                    
                    print(f"Extraídos {len(department_data)} professores deste departamento.")
                    all_scraped_data.extend(department_data)

                except Exception as e:
                    print(f"  [ERRO GERAL] Falha ao processar o departamento '{department}'. Erro: {e}")
                    print("Continuando para o próximo departamento...")
                    continue

            browser.close()
            print("-" * 50)
            
            professores_unicos = {}
            for professor in all_scraped_data:
                professores_unicos[professor['pagina_sigaa_url']] = professor
            
            lista_final_sem_duplicatas = list(professores_unicos.values())

            print(f"Extração concluída! Total de {len(lista_final_sem_duplicatas)} professores únicos encontrados.")
            return lista_final_sem_duplicatas