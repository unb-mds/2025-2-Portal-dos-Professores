import asyncio
from playwright.async_api import async_playwright, Page, Browser 
from urllib.parse import urljoin

class SigaaScraper:
    def __init__(self, concurrency=5):
        self.base_url = "https://sigaa.unb.br"
        self.search_url = "https://sigaa.unb.br/sigaa/public/docente/busca_docentes.jsf"
        self.CONCURRENCY = concurrency 

    async def _scrape_professor_details(self, browser: Browser, professor_data: dict) -> dict:
        professor_data.update({
            "descricao_pessoal": None, "lattes_url": None,
            "formacao_academica": {}, "contatos": {} 
        })

        context = await browser.new_context()
        page = await context.new_page()
        try:
            url = professor_data.get("pagina_sigaa_url")
            if not url: return professor_data

            await page.goto(url, timeout=60000, wait_until="load")

            desc_locator = page.locator("div#perfil-docente dt:has-text('Descrição pessoal') + dd").first
            if await desc_locator.is_visible(timeout=1000):
                professor_data["descricao_pessoal"] = (await desc_locator.inner_text()).strip()

            lattes_locator = page.locator("#endereco-lattes").first
            if await lattes_locator.is_visible(timeout=1000):
                professor_data["lattes_url"] = await lattes_locator.get_attribute('href')
            
           
            try:
                all_children_locator = page.locator("div#formacao-academica dl > *")
                count = await all_children_locator.count()

                if count > 0:
                    formacao_dict = {}
                    current_nivel = None
                    for i in range(count):
                        element = all_children_locator.nth(i)
                        tag_name = await element.evaluate('node => node.tagName.toLowerCase()')

                        if tag_name == 'dt':
                            current_nivel = (await element.locator('.ano').inner_text()).strip()
                            formacao_dict[current_nivel] = []
                        elif tag_name == 'dd' and current_nivel:
                            detalhes_texto = (await element.inner_text()).strip()
                            formacao_dict[current_nivel].append(detalhes_texto)
                    
                    professor_data["formacao_academica"] = formacao_dict
            except Exception as e:
                print(f"    [AVISO] Seção 'Formação Acadêmica' não encontrada para {professor_data.get('nome')}. Erro: {e}")

            contatos_dict = {}
            sala_locator = page.locator("div#contato dt:has-text('Sala') + dd").first
            if await sala_locator.is_visible(timeout=1000):
                contatos_dict["sala"] = (await sala_locator.inner_text()).strip()
            
            tel_locator = page.locator("div#contato dt:has-text('Telefone/Ramal') + dd").first
            if await tel_locator.is_visible(timeout=1000):
                contatos_dict["telefone"] = (await tel_locator.inner_text()).strip()
            
            email_locator = page.locator("div#contato dt:has-text('Endereço eletrônico') + dd").first
            if await email_locator.is_visible(timeout=1000):
                contatos_dict["email"] = (await email_locator.inner_text()).strip()

            if contatos_dict:
                professor_data["contatos"] = contatos_dict

        except Exception as e:
            print(f"    [AVISO] Falha ao extrair detalhes para {professor_data.get('nome', 'Professor Desconhecido')}. Erro: {e}")
        finally:
            await context.close()
        
        return professor_data

    async def scrape_professors_by_department(self, department_labels: list):
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            page = await browser.new_page()
            
            initial_professor_map = {}

            print("--- Fase 1: Coletando a lista inicial de professores ---")
            for department in department_labels:
                try:
                    print(f"Processando o departamento: '{department}'")
                    await page.goto(self.search_url, timeout=60000)
                    await page.locator('select[name="form:departamento"]').select_option(label=department)
                    await page.get_by_role("button", name="Buscar").click()
                    await page.wait_for_selector('table.listagem', timeout=30000)
                    
                    professor_rows = await page.locator('table.listagem tbody tr').all()
                    
                    for row in professor_rows:
                        nome = (await row.locator('td:nth-child(2) span.nome').inner_text()).strip()
                        foto_element = row.locator('td:nth-child(1) img')
                        foto_url_relativa = await foto_element.get_attribute('src')
                        foto_url_absoluta = urljoin(self.base_url, foto_url_relativa)
                        departamento_extraido = (await row.locator('td:nth-child(2) span.departamento').inner_text()).strip()
                        link_element = row.locator('td:nth-child(2) span.pagina a')
                        pagina_publica_relativa = await link_element.get_attribute('href')
                        pagina_publica_url = urljoin(self.base_url, pagina_publica_relativa)
                        
                        if pagina_publica_url not in initial_professor_map:
                            initial_professor_map[pagina_publica_url] = {
                                "nome": nome, "departamento": departamento_extraido,
                                "foto_url": foto_url_absoluta, "pagina_sigaa_url": pagina_publica_url
                            }
                except Exception as e:
                    print(f"  [ERRO GERAL] Falha ao coletar lista do departamento '{department}'. Erro: {e}")
            
            await page.close()
            initial_professor_list = list(initial_professor_map.values())
            total_professors = len(initial_professor_list)
            print(f"--- Fase 1 concluída: {total_professors} professores únicos encontrados ---")

            if not initial_professor_list:
                await browser.close()
                return []

            print(f"\n--- Fase 2: Enriquecendo dados (em paralelo, {self.CONCURRENCY} por vez) ---")
            all_results = []
            
            for i in range(0, total_professors, self.CONCURRENCY):
                batch = initial_professor_list[i:i + self.CONCURRENCY]
                tasks = [self._scrape_professor_details(browser, prof_data) for prof_data in batch]
                results = await asyncio.gather(*tasks)
                all_results.extend(results)
                print(f"  > Lote concluído. {len(all_results)}/{total_professors} processados.")

            await browser.close()
            
            return all_results