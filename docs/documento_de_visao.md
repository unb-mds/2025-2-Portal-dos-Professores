---
title: Documento de Visão — Portal de Professores da UnB (Squad 04)
description: Visão, escopo, stakeholders, métricas e riscos do Portal de Professores da UnB, projeto da disciplina MDS (2025/2).
author: Squad 04 — UnB/MDS
version: 1.0.0
status: Em elaboração
last_updated: 2025-09-09
---

# Documento de Visão — Portal de Professores da UnB (Squad 04)

> **Resumo**  
> O Portal de Professores da UnB centraliza e organiza informações do corpo docente (perfil, áreas de pesquisa, produção acadêmica e histórico de ensino) para facilitar a descoberta, conexão e transparência na comunidade universitária.

!!! note "Contexto do curso"
    Projeto da disciplina **Métodos de Desenvolvimento de Software (MDS)** — UnB, **Semestre 2025/2**.  
    Status: **Em Desenvolvimento** · Licença: **MIT**

---

## 1. Objetivo e Visão

**Objetivo:**  
Oferecer um **ponto único** e confiável de acesso às informações de docentes da UnB, reduzindo a fragmentação atual e acelerando a descoberta por parte de alunos, pesquisadores e gestores.

**Visão (frase norteadora):**  
> “Até **Dezembro/2025**, qualquer pessoa conseguirá **encontrar** o docente certo na UnB em **menos de 10 segundos**, com **informações atualizadas** e **busca inteligente**.”

---

## 2. Problema e Oportunidade

**Problema atual**
- Dados dispersos (Lattes, sites de departamentos, perfis pessoais).
- Dificuldade de comparar e filtrar por **área de pesquisa**, **departamento** e **palavras-chave**.
- Ausência de uma **fonte oficial consolidada** para consulta rápida.

**Oportunidade**
- Melhorar a experiência acadêmica (alunos encontrando orientadores/disciplinas).
- Aumentar a **visibilidade** da produção científica.
- Apoiar decisões e relatórios de gestão com **dados estruturados**.

---

## 3. Escopo

### 3.1 Incluído (MVP)
- **Perfis unificados** de docentes (resumo, contato institucional, áreas de pesquisa).
- **Produção acadêmica** (lista de publicações/projetos com links externos quando possível).
- **Histórico de ensino** (disciplinas já ministradas).
- **Busca avançada** com filtros (nome, departamento, área, palavra-chave).
- **Responsividade** (desktop e mobile) e **acessibilidade básica**.

### 3.2 Fora de escopo (nesta fase)
- Integração com sistemas administrativos (ex.: SIGAA) para **notas/matrículas**.    
- **Coleta automatizada de dados** onde houver restrições legais/técnicas (ex.: scraping sem autorização).  

!!! warning "Fronteira de escopo"
    Integrações automáticas com fontes externas (ex.: Plataforma Lattes/CNPq) devem respeitar **políticas de uso** e **LGPD**. Avaliar modelo **semiautomático** ou **fontes oficiais** internas. **[preencha: decisão]**

---

## 4. Público-Alvo e Personas

| Persona                 | Objetivos principais                                              | Dores atuais                                                  | Sinais de sucesso |
|-------------------------|-------------------------------------------------------------------|----------------------------------------------------------------|-------------------|
| **Aluno de Graduação**  | Achar docentes e disciplinas alinhadas ao interesse               | Info dispersa, links quebrados, nomenclaturas diferentes       | Encontrar em ≤10s; decidir orientador/optativa com confiança |
| **Pós-graduando**       | Mapear grupos e linhas de pesquisa; contato para orientação       | Falta de filtros por linha/tema; difícil comparar produção     | Lista curta de potenciais orientadores relevante |
| **Pesquisador Externo** | Identificar expertise para parceria/projeto                       | Descoberta lenta; pouca visibilidade de produção recente       | Contato feito rapidamente; aumento de convites |
| **Gestor Acadêmico**    | Consolidar dados para relatórios e decisões                       | Coleta manual demorada e sujeita a erro                        | Export/consulta rápida; dados consistentes |
| **Docente**             | Ter perfil institucional claro e atualizado                       | Perfis duplicados/desatualizados; baixa exposição              | Perfil unificado; tráfego/contatos qualificados |

---

## 5. Stakeholders e Governança

| Papel/Entidade                 | Nome(s)                   | Responsabilidade                                  |
|--------------------------------|---------------------------|---------------------------------------------------|
| **Product Owner (PO)**         | Paulo Sérgio e Bruno Dantas              | Priorizar backlog, definir visão                   |
| **Scrum Master**               | Caio Lacerda e Kaio Amoury               | Facilitar processos, remover impedimentos          |
| **Arquiteto**               | Ian Pedersoli e Arthur Scartezini              | Facilitar processos, remover impedimentos          |
| **Desenvolvimento (DEV)**      | Todos do grupo              | Implementação técnica                              |
| **Design/UX**                  | Todos do grupo               | Pesquisa, fluxos, protótipos e acessibilidade      |
| **Dados/Integrações**          | Todos do grupo                | Modelagem de dados e conexões externas             |
| **TI/Infra UnB**               | Git e Github               | Hospedagem, domínio, segurança                     |

**RACI (macro)**

| Entregável                        | R (Responsável) | A (Aprovador) | C (Consultado) | I (Informado) |
|----------------------------------|-----------------|---------------|----------------|---------------|
| Documento de Visão               | PO/UX           | Patrocinador  | DEV, Dados     | Squad         |
| Prototipação (UX)                | UX              | PO            | DEV            | Stakeholders  |
| MVP em produção                  | DEV(s)             | PO/TI         | UX/Dados       | Comunidade    |
| Política de dados/LGPD           | Dados/TI        | Patrocinador  | Jurídico [opt] | Squad         |

---

## 6. Funcionalidades (alto nível)

### 6.1 Catálogo de Docentes
- Página de **perfil** com: nome, foto (opcional), e-mail institucional, departamento, áreas/palavras-chave, links (Lattes, ORCID, Google Scholar, site pessoal).  
- **[preencha]**: campos mínimos obrigatórios e campos opcionais.

### 6.2 Produção Acadêmica
- Lista de **publicações** e **projetos** por docente, com fonte e link de referência (DOI, repositório).  
- **[preencha]**: critérios de inclusão (janela temporal, tipos de publicação).

### 6.3 Histórico de Ensino
- Disciplinas já ministradas (código, nome, período/semestre).  
- **[preencha]**: fonte dos dados e periodicidade de atualização.

### 6.4 Busca e Filtros
- Busca por **nome**, **departamento**, **área de pesquisa**, **palavra-chave**.  
- Ordenação por **relevância**.  
- **[preencha]**: sinônimos/tesauro para melhorar recall (opcional).

### 6.5 Administração Básica
- Mecanismo mínimo de **ingestão/atualização semiautomática** (CSV/planilha, importador simples).  
- **[preencha]**: perfis com permissão de atualização.

!!! tip "Critérios de aceite (exemplo para Busca)"
    - Dado que o usuário digita “**Visão Computacional**”,  
      Quando aplicar filtro por “**Departamento X**”,  
      Então vê a **lista de docentes** com essa especialidade ordenada por relevância.  
    - Pesquisa retorna resultados com latência **≤ 500ms p95** para consultas indexadas. **[ajuste conforme infra]**

---

## 7. Requisitos

### 7.1 Requisitos Funcionais (RF)

| ID  | Requisito                                                    | Prioridade |
|-----|--------------------------------------------------------------|-----------:|
| RF-01 | O sistema deve exibir uma lista de professores com busca por nome, área de atuação e unidade acadêmica.                          | Alta |
| RF-02 | O sisema deve ter uma página index com um looping de menu para acessar as diferentes funcionalidades                        | Alta |
| RF-03 | O sistema deve ser capaz de minerar dados de outros sites já existentes de exibição do corpo docente da UnB.                 | Média |
| RF-04 |O sistema deve permitir a visualização da linha de tempo de disciplinas ministradas ao longo dos períodos letivos.     | Alta |
| RF-05 | O sistema deve exportar e compartilhar o perfil do professor (PDF) incluindo bio, áreas, últimas publicações e disciplinas.                        | Média |
| RF-06 | O sistema deve esibir um painel de informações resumidas do professor (mini-card) com foto, nome, unidade, área principal e link para o perfil completo.       | Baixa |
| RF-07 | O sistema deve permitir a filtragem de professores por ano da última publicação.         | Baixa |
| RF-08 | O sistema deve indicar a data da última atualização dos dados do professor.        | Baixa |

### 7.2 Requisitos Não Funcionais (RNF)

| Categoria        | Meta/Política                                                                 |
|------------------|-------------------------------------------------------------------------------|
| Performance      | Responder a requisições em até **4 segundos** em 95% dos casos.|
| Segurança   | Dados sensíveis criptografados, Conexões restritas a **HTTPS**, **LGPD**                |
| Escalabilidade  | Arquitetura preparada para aumento de carga sem reestruturação, suporte à integração de novos módulos sem impactos no núcleo.          |
| Usabilidade  | Interface **responsiva** (desktop, tablet, mobile), Interface intuitiva com foco em clareza e organização.                               |
| Privacidade      | Somente dados **públicos**/consentidos; anonimizar métricas de uso            |
| Manutenibilidade | Código modular, README, linters, CI simples                                   |

---

## 8. Fontes de Dados e Integrações

| Fonte/Integração            | Tipo        | Uso planejado                                 | Observações |
|-----------------------------|-------------|-----------------------------------------------|-------------|
| **Plataforma Lattes (CNPq)**| Externa     | Link/atribuição de publicações e currículo    | Respeitar termos; evitar scraping sem acordo |
| **ORCID / DOI / Scholar**   | Externa     | Links de referência para publicações          | Opcional no MVP |
| **Lattes**   | Externa     | Links de referência para currículos         | Opcional no MVP |
| **Planilhas internas**      | Interna     | Importação semiautomatizada (CSV)            | N/A |
| **Deptos/Unidades**         | Interna     | Confirmação/atualização de dados              | N/A |

---

## 10. Riscos e Mitigações

| Risco                                                    | Prob. | Impacto | Mitigação                                                                 |
|----------------------------------------------------------|:-----:|:-------:|----------------------------------------------------------------------------|
| Dificuldade de acesso/uso de dados externos              | Alta  | Alta    | Priorizar dados públicos; ingestão **manual/CSV** no MVP; acordos formais |
| Baixa adoção pelos usuários                              | Média | Alta    | Divulgar em turmas/portais; incorporar feedback contínuo                  |
| Dados desatualizados                                      | Média | Média   | Rotina de atualização agendada; pontos focais nos departamentos         |
| Restrições de tempo/recursos do semestre                 | Alta  | Média   | Escopo enxuto; cortar nice-to-have; cadência semanal                       |
| Questões de LGPD/privacidade                             | Baixa | Alta    | Apenas dados públicos; política de privacidade; revisão jurídica [opt]     |

---

## 11. Cronograma Macro (Roadmap)

| Fase                     | Entregáveis principais                                  | Janela |
|--------------------------|----------------------------------------------------------|--------|
| **F1 — Descoberta/Design** | Personas, fluxos, protótipo navegável (Figma)            | **[Out/2025]** |
| **F2 — Conteúdo/Dados**    | Carga inicial de docentes e validação com departamentos  | **[Nov/2025]** |
| **F3 — Beta Público**      | Testes de usabilidade, ajustes de RNF, analytics básico  | **[Nov/2025]** |
| **F5 — Lançamento**        | Go-live + divulgação + plano de manutenção               | **[Dez/2025]** |

---

## 12. Princípios de UX e Acessibilidade

- **Clareza primeiro:** hierarquia tipográfica, listas, links explícitos (DOI/ORCID).  
- **Acessibilidade:** contraste AA, navegação por teclado, textos alternativos.  
- **Consistência:** padrões de componentes; breadcrumbs simples (Home › Docentes › Perfil).  
- **Pesquisar é tarefa primária:** campo de busca presente em locais de destaque.

## 13. Governança de Dados, LGPD e Ética

- **Base legal:** dados acadêmicos **públicos** ou com **consentimento**.  
- **Transparência:** página de **Política de Privacidade** e **Fontes dos Dados**.  
- **Direito de correção/remoção:** canal de contato institucional **a definir**.  
- **Retenção:** definir periodicidade de atualização e **logs**. 

---

## 14. Critérios de Aceite do MVP (checklist)

- [ ] Catálogo navegável de docentes com **perfil mínimo**.  
- [ ] Busca e filtros funcionando com **relevância aceitável**.  
- [ ] Pelo menos **60%** de docentes carregados.  
- [ ] Páginas responsivas e com **acessibilidade básica**.  
- [ ] Documentação (README, instruções de deploy, política de dados).

---

## 15. Anexos

### 15.1 Glossário

| Termo  | Definição                                                      |
|--------|----------------------------------------------------------------|
| Lattes | Plataforma de currículos do CNPq.                              |
| ORCID  | Identificador único de pesquisadores.                          |
| DOI    | Identificador de objetos digitais (artigos, datasets, etc.).   |
| WCAG   | Diretrizes de acessibilidade para conteúdo web.                |
| LGPD   | Lei Geral de Proteção de Dados (Brasil).                       |

### 15.2 Licença

- **MIT**

