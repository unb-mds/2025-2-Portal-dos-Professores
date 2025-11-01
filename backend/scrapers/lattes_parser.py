from playwright.sync_api import Page
import logging

# Configura um logger para este módulo
logger = logging.getLogger(__name__)

def parse_lattes_page(page: Page) -> dict:
    """
    Recebe uma página do Lattes JÁ ABERTA E AUTENTICADA.
    Extrai dados focados em (Resumo, Atuação Profissional, Projetos de Pesquisa)
    usando um script page.evaluate() e retorna um dicionário.
    """
    
    logger.info("Iniciando extração de dados da página do Lattes...")
    extraction_js = r"""
    () => {
        const dados = {
            "resumo_cv": null,
            "atuacao_profissional": [], 
            "projetos_pesquisa": [], 
        };
        try {
            const resumoNode = document.querySelector("div.resumo p");
            if (resumoNode) {
                const clone = resumoNode.cloneNode(true);
                const spanAutor = clone.querySelector("span.texto");
                if (spanAutor) spanAutor.remove();
                dados.resumo_cv = clone.innerText.trim();
            }
        } catch (e) { console.error("Erro ao extrair Resumo:", e); }

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
                    const parts = detailsHTML.split(/<br\s*class="clear"\s*\/?>/gi); 
                    
                    parts.forEach(part => {
                        const text = part.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(); 
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
                } catch (e) { console.error("Falha ao parsear um projeto:", e); }
            });
        } catch (e) { console.error("Erro ao extrair Projetos de Pesquisa:", e); }
        
        try {
            // 1. Encontra a âncora principal da seção
            const atuacaoAnchor = document.querySelector('a[name="AtuacaoProfissional"]');
            
            if (atuacaoAnchor) {
                const container = atuacaoAnchor.closest('.title-wrapper').querySelector('.data-cell');
                
                if (container) {
                    const children = container.children;
                    let currentInstitution = null;
                    let currentSubSectionKey = null; 

                    for (let i = 0; i < children.length; i++) {
                        const el = children[i];

                        if (el.classList.contains('inst_back')) {
                            currentInstitution = {
                                instituicao: el.innerText.trim().replace(/\s+/g, ' '),
                                vinculos: [],
                                atividades: []
                            };
                            dados.atuacao_profissional.push(currentInstitution);
                            currentSubSectionKey = null; 
                            continue; 
                        }

                        if (el.classList.contains('subtit-1')) {
                            const subHeaderText = el.innerText.toLowerCase();
                            if (subHeaderText.includes('vínculo')) {
                                currentSubSectionKey = 'vinculos'; // Define o estado
                            } else if (subHeaderText.includes('atividades')) {
                                currentSubSectionKey = 'atividades'; // Define o estado
                            }
                            continue; 
                        }

                        if (el.classList.contains('layout-cell-3') && el.innerText.trim() !== '' && !el.classList.contains('subtit-1')) {
                            try {
                                const ano = el.innerText.trim();
                                let detalhesNode = el.nextElementSibling;
                                let detalhesAcumulados = [];
                                let nodesToSkip = 0;

                                while(detalhesNode && !detalhesNode.classList.contains('layout-cell-3')) {
                                    if (detalhesNode.classList.contains('layout-cell-9')) {
                                        detalhesAcumulados.push(detalhesNode.innerText.trim().replace(/\s+/g, ' '));
                                    }
                                    detalhesNode = detalhesNode.nextElementSibling;
                                    nodesToSkip++;
                                }
                                
                                const detalhes = detalhesAcumulados.join(' ');
                                
                                if (currentInstitution && currentSubSectionKey) {
                                    dados.atuacao_profissional[dados.atuacao_profissional.length - 1][currentSubSectionKey].push({
                                        periodo: ano,
                                        detalhes: detalhes
                                    });
                                }
                                i += nodesToSkip; 
                            } catch (e) { console.error("Falha ao parsear um item de atuação:", e); }
                        }
                    }
                }
            }
        } catch (e) { console.error("Erro ao extrair Atuação Profissional:", e); }

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