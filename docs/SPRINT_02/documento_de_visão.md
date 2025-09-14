# Documento de Visão — Portal de Professores da UnB

## 1. Propósito
O Portal de Professores da UnB tem como objetivo **centralizar e apresentar informações públicas sobre docentes** em um único ambiente, de forma clara e acessível.  
Não é uma ferramenta de avaliação de professores, mas sim de **visão geral** do que cada docente faz:  
- Se desenvolve pesquisa (exibindo o último artigo publicado).  
- Quais matérias ministra ao longo do tempo (constância ou variação).  
- Síntese de sua atuação acadêmica (portfólio resumido).

## 2. Problema
Atualmente, informações sobre professores da UnB estão **dispersas** em várias plataformas (SIGAA, Lattes, sites institucionais, páginas independentes).  
Isso dificulta que estudantes, colegas ou a sociedade encontrem dados organizados, confiáveis e de fácil leitura.

## 3. Objetivos
- **Consolidar** informações de diferentes fontes em perfis únicos.  
- **Gerar resumos automáticos** (usando agente de IA) do portfólio e atuação dos professores.  
- **Apresentar de forma visual e intuitiva** os dados, sem complexidade técnica.  
- **Facilitar a descoberta** de professores por área, pesquisa ou disciplinas.  

## 4. Escopo Inicial (MVP)
- Catálogo de professores com busca por nome.  
- Página de perfil contendo: nome, unidade/departamento, e-mail institucional, links oficiais.  
- Último artigo publicado (título, ano, link).  
- Histórico das disciplinas ministradas.  
- Resumo automático da atuação acadêmica (IA).  

## 5. Restrições Arquiteturais
- O sistema terá **apenas front-end**, hospedado via **GitHub Pages**.  
- Os dados serão mantidos em **arquivos JSON** no próprio repositório.  
- Toda a **mineração e processamento** (coleta e geração de resumos) será feito em **bots executados no GitHub Actions**, atualizando os JSONs automaticamente.  

## 6. Fontes de Dados
As informações dos docentes poderão ser coletadas das seguintes fontes públicas:  
- **SIGAA (UnB)** –  
  - Pesquisa geral: [busca_docentes.jsf](https://sigaa.unb.br/sigaa/public/docente/busca_docentes.jsf)  
  - Exemplo de página de professor: [portal.jsf?siape=1181929](https://sigaa.unb.br/sigaa/public/docente/portal.jsf?siape=1181929)  
- **Sites institucionais da UnB** (ex.: [CCA/UnB - José Marilson](http://www.cca.unb.br/index.php/jose-marilson-martins-dantas))  
- **Escavador** (agregador público): [perfil exemplo](https://www.escavador.com/sobre/5283566/jose-marilson-martins-dantas)  
- **Portal de pesquisas da UnB**: [pesquisar.unb.br](https://pesquisar.unb.br/professor/jose-marilson-martins-dantas)  
- **Plataforma Lattes (CNPq)**: [currículo exemplo](https://buscatextual.cnpq.br/buscatextual/visualizacv.do;jsessionid=9155BC796D55F948BBFBD84BE90C9608.buscatextual_0)  


> Observação: serão usados apenas **dados públicos** dessas plataformas.  

## 7. Usuários-alvo
- **Estudantes**: descobrir professores e suas disciplinas.  
- **Docentes**: acompanhar visibilidade de suas informações públicas.  
- **Sociedade em geral**: conhecer o que a UnB produz em ensino e pesquisa.  

## 8. Métrica de Sucesso (inicial)
- Ter ≥ 70% dos professores de uma unidade piloto com perfis básicos disponíveis.  
- Mostrar corretamente pelo menos **um artigo recente** e **duas disciplinas** por docente.  
- Feedback positivo de estudantes/usuários quanto à clareza da apresentação.  

---
