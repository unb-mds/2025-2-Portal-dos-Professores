import asyncio 
from playwright.async_api import async_playwright, Page, Browser 
from urllib.parse import urljoin

class SigaaScraper:
    def __init__(self, concurrency=1, delay_between_batches=3): 
        self.base_url = "https://sigaa.unb.br"
        self.search_url = "https://sigaa.unb.br/sigaa/public/docente/busca_docentes.jsf"
        self.CONCURRENCY = concurrency 
        self.DELAY_BETWEEN_BATCHES = delay_between_batches

    async def _scrape_professor_details(self, browser: Browser, professor_data: dict) -> dict:
        """
        Busca os detalhes individuais de um professor.
        Modificado para usar wait_until="domcontentloaded".
        """
        professor_data.update({
            "descricao_pessoal": None, "lattes_url": None,
            "formacao_academica": {}, "contatos": {},
            "sigaa_details_error": None 
        })

        context = await browser.new_context()
        page = await context.new_page()
        try:
            url = professor_data.get("pagina_sigaa_url")
            if not url: 
                professor_data["sigaa_details_error"] = "URL da página SIGAA não encontrada"
                return professor_data 

            try:
                await page.goto(url, timeout=30000, wait_until="domcontentloaded") 
            except Exception as goto_error:
                error_msg = f"Falha no page.goto: {goto_error}"
                print(f"    [AVISO] {error_msg} para {professor_data.get('nome')}")
                professor_data["sigaa_details_error"] = str(goto_error)
                try: await context.close() 
                except Exception: pass
                return professor_data

            try:
                desc_locator = page.locator("div#perfil-docente dt:has-text('Descrição pessoal') + dd").first
                if await desc_locator.is_visible(timeout=2000): 
                    professor_data["descricao_pessoal"] = (await desc_locator.inner_text()).strip()
            except Exception: pass 
            try:
                lattes_locator = page.locator("#endereco-lattes").first
                if await lattes_locator.is_visible(timeout=2000): 
                    professor_data["lattes_url"] = await lattes_locator.get_attribute('href')
            except Exception: pass 
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
            except Exception: pass
            try:
                contatos_dict = {}
                sala_locator = page.locator("div#contato dt:has-text('Sala') + dd").first
                if await sala_locator.is_visible(timeout=1000): contatos_dict["sala"] = (await sala_locator.inner_text()).strip()
                tel_locator = page.locator("div#contato dt:has-text('Telefone/Ramal') + dd").first
                if await tel_locator.is_visible(timeout=1000): contatos_dict["telefone"] = (await tel_locator.inner_text()).strip()
                email_locator = page.locator("div#contato dt:has-text('Endereço eletrônico') + dd").first
                if await email_locator.is_visible(timeout=1000): contatos_dict["email"] = (await email_locator.inner_text()).strip()
                if contatos_dict: professor_data["contatos"] = contatos_dict
            except Exception: pass

        except Exception as e:
            error_msg = f"Falha inesperada ao extrair detalhes: {e}"
            print(f"    [AVISO] {error_msg} para {professor_data.get('nome', 'Professor Desconhecido')}")
            professor_data["sigaa_details_error"] = str(e)
        finally:
            try: await context.close()
            except Exception: pass 
        
        return professor_data

    async def scrape_professors_by_department(self, department_labels: list):
        """
        Raspa a lista de professores por departamento e depois busca os detalhes.
        """
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=False) 
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

            print(f"\n--- Fase 2: Enriquecendo dados (em lotes de {self.CONCURRENCY}) ---")
            all_results = []

            for i in range(0, total_professors, self.CONCURRENCY):
                batch = initial_professor_list[i:i + self.CONCURRENCY]
                tasks = [self._scrape_professor_details(browser, prof_data) for prof_data in batch]
                
                results = await asyncio.gather(*tasks)
                all_results.extend(results)
                print(f"  > Lote {i // self.CONCURRENCY + 1} concluído. {len(all_results)}/{total_professors} processados.")
                if i + self.CONCURRENCY < total_professors: 
                    print(f"   Aguardando {self.DELAY_BETWEEN_BATCHES}s antes do próximo lote...")
                    await asyncio.sleep(self.DELAY_BETWEEN_BATCHES)

            await browser.close() 
            
            print(f"--- Fase 2 concluída ---")
            return all_results