from playwright.sync_api import Page
import logging

logger = logging.getLogger(__name__)

def parse_lattes_page(page: Page) -> dict:
    """
    Recebe uma página do Lattes JÁ ABERTA E AUTENTICADA.
    Extrai todos os dados de interesse (Resumo, Formação, Projetos, Orientações)
    usando um script page.evaluate() e retorna um dicionário.
    """
    
    logger.info("Iniciando extração de dados da página do Lattes...")

    extraction_js = """
    () => {
        const dados = {
            "resumo_cv": null,
            "formacao_academica": [],
            "projetos_pesquisa": [],
            "orientacoes_mestrado": [],
            "orientacoes_especializacao": [],
            "orientacoes_tcc": [],
            "orientacoes_ic": []
        };

        try {
            dados.resumo_cv = document.querySelector("div.resumo p").innerText.trim();
        } catch (e) { /* não encontrado */ }
        
        try {
            dados.formacao_academica = Array.from(document.querySelectorAll("div#formacao-academica li"))
                                            .map(li => li.innerText.trim().replace(/\\s+/g, ' '));
        } catch (e) { /* não encontrado */ }

        try {
            const anchors = document.querySelectorAll('a[name^="PP_"]');
            
            anchors.forEach(anchor => {
                let projeto = {
                    titulo: null, ano_periodo: null, descricao: null, situacao: null,
                    natureza: null, alunos_envolvidos: null, integrantes: null,
                    financiadores: null, numero_producoes: null
                };

                try {
                    const anoDiv = anchor.nextElementSibling;
                    projeto.ano_periodo = anoDiv.innerText.trim();
                    const tituloDiv = anoDiv.nextElementSibling;
                    projeto.titulo = tituloDiv.innerText.trim();
                    const detalhesDiv = tituloDiv.nextElementSibling.nextElementSibling;
                    
                    const detailsHTML = detalhesDiv.querySelector('.layout-cell-pad-5').innerHTML;

                    const parts = detailsHTML.split(/<br\\s*class="clear"\\s*\\/?>/gi);
                    
                    parts.forEach(part => {
                        const text = part.replace(/<[^>]+>/g, ' ').replace(/\\s+/g, ' ').trim();
                        
                        if (text.startsWith('Descrição:')) {
                            projeto.descricao = text.replace('Descrição:', '').trim();
                        } else if (text.startsWith('Situação:')) {
                            const situacaoMatch = text.match(/Situação: (.*?);/);
                            if (situacaoMatch) projeto.situacao = situacaoMatch[1].trim();
                            const naturezaMatch = text.match(/Natureza: (.*?)\./);
                            if (naturezaMatch) projeto.natureza = naturezaMatch[1].trim();
                        } else if (text.startsWith('Alunos envolvidos:')) {
                            projeto.alunos_envolvidos = text.replace('Alunos envolvidos:', '').trim();
                        } else if (text.startsWith('Integrantes:')) {
                            projeto.integrantes = text.replace('Integrantes:', '').trim();
                        } else if (text.startsWith('Financiador(es):')) {
                            projeto.financiadores = text.replace('Financiador(es):', '').trim();
                        } else if (text.startsWith('Número de produções C, T & A:')) {
                            projeto.numero_producoes = text.replace('Número de produções C, T & A:', '').trim();
                        }
                    });
                    dados.projetos_pesquisa.push(projeto);
                } catch (e) { /* falha ao parsear um projeto */ }
            });
        } catch (e) { /* erro ao extrair projetos */ }
        
        try {
            const containers = document.querySelectorAll('div.layout-cell.layout-cell-12.data-cell');
            let currentSectionKey = null;

            containers.forEach(container => {
                const children = container.children;
                for (const el of children) {
                    if (el.classList.contains('cita-artigos') && el.querySelector('b')) {
                        const headerText = el.querySelector('b').innerText.toLowerCase();
                        
                        if (headerText.includes('dissertação de mestrado')) {
                            currentSectionKey = 'orientacoes_mestrado';
                        } else if (headerText.includes('monografia de conclusão de curso')) {
                            currentSectionKey = 'orientacoes_especializacao';
                        } else if (headerText.includes('trabalho de conclusão de curso')) {
                            currentSectionKey = 'orientacoes_tcc';
                        } else if (headerText.includes('iniciação científica')) {
                            currentSectionKey = 'orientacoes_ic';
                        } 
                        else {
                            currentSectionKey = null; 
                        }
                        continue; 
                    }
                    
                    if (currentSectionKey && el.classList.contains('layout-cell-11')) {

                        const text = el.innerText.trim().replace(/\\s+/g, ' ');
                        if (text) {
                            dados[currentSectionKey].push(text);
                        }
                    }
                }
            });
        } catch (e) { /* erro ao extrair orientações/produções */ }

        return dados;
    }
    """
    
    try:
        dados_extraidos = page.evaluate(extraction_js)
        logger.info("Extração de dados da página concluída com sucesso.")
        return dados_extraidos
    except Exception as e:
        logger.error(f"Falha CRÍTICA ao executar o script de extração (page.evaluate): {e}")
        return {}