#  Portal dos Professores | Documentação Oficial

Este é o espaço central para toda a documentação, guias e informações relacionadas ao projeto desenvolvido pelo **Squad 04** durante o semestre de **2025-2** na disciplina de Métodos de Desenvolvimento de Software.

---

##  Visão Geral do Projeto (Página Inicial)

O **Portal dos Professores da UnB** é uma plataforma centralizada que visa facilitar o acesso a informações detalhadas sobre o corpo docente da universidade, melhorando a conexão e o planejamento acadêmico dentro da comunidade universitária.

### O que o Portal Oferece:

* **Explorar Perfis Unificados:** Acesso rápido a currículos, links para Lattes, áreas de pesquisa e informações de contato.
* **Ver a Produção Acadêmica:** Encontre publicações, artigos e projetos de pesquisa de forma organizada.
* **Consultar Histórico de Ensino:** Veja as disciplinas já ministradas por cada docente.
* **Pesquisar com Filtros Avançados:** Encontre professores por nome, departamento ou área de interesse com alta precisão.

### Nossa Equipe - Squad 04

Conheça os membros do Squad 04 que construíram este projeto.

| Nome Completo | Papel no Squad | GitHub |
| :--- | :--- | :--- |
| Caio Lacerda | Desenvolvedor | [@caiolacerdamt](https://github.com/caiolacerdamt) |
| Ian Pedersoli | Desenvolvedor | [@ianpedersoli](https://github.com/ianpedersoli) |
| Arthur Scartezini | Desenvolvedor | [@Ascartezini](https://github.com/Ascartezini) |
| Paulo Sérgio | Desenvolvedor | [@Paulosrsr](https://github.com/Paulosrsr) |
| Kaio Amoury | Desenvolvedor | [@KaioAmouryUnB](https://github.com/KaioAmouryUnB) |
| Bruno Augusto | Desenvolvedor | [@brunodantas9](https://github.com/brunodantas9) |

### Índice da Documentação

Para navegar pelos detalhes do projeto, utilize os links de navegação ou a lista abaixo:

| Seção | Tópicos de Foco |
| :--- | :--- |
| **1. Visão Geral** | Contexto do Problema, Motivação e Objetivos. |
| **2. Visão do Produto** | Descrição da Solução, Usuários e Tecnologias. |
| **3. Planejamento e Gestão** | Story Map, Metodologia Ágil (Scrum) e Ferramentas. |
| **Anexos** | Repositórios, Boards e Manuais. |

***

## 1. Visão Geral (Contexto e Objetivos)

### 1.1 Contextualização

A comunidade acadêmica da UnB, especialmente alunos e pesquisadores, enfrenta dificuldades na obtenção de informações consolidadas sobre o corpo docente. Os dados estão dispersos em múltiplos sistemas (SIGAA, Lattes, etc.), resultando em tempo excessivo para encontrar dados cruciais. A motivação é **otimizar a comunicação** e **facilitar o planejamento acadêmico**.

### 1.2 Escopo e Direção

O objetivo geral é desenvolver e implantar uma plataforma web robusta e intuitiva que consolide os dados dos professores da UnB. O escopo inicial (MVP) foi delimitado para focar na funcionalidade de **Pesquisa e Visualização de Perfis** dos docentes da **FCTE**.

***

## 2. Visão Geral do Produto / Solução

### 2.1 Solução e Usuários

O Portal é uma aplicação web que funciona como um agregador de dados com uma interface limpa. Ele permite filtros e exibe informações cruciais. Os principais usuários são **Alunos** (buscando orientadores), **Professores** (buscando visibilidade) e **Coordenadores** (buscando dados de gestão).

### 2.2 Estrutura Técnica

O sistema adota uma arquitetura de **Micro-serviços** (ou Três Camadas): **Frontend** em **[Framework X]**, **Backend API** em **[Tecnologia Y]**, e persistência de dados em **[Tipo de Banco de Dados]**. As tecnologias foram escolhidas visando performance e robustez (Ex: React, Node.js e PostgreSQL).

***

## 3. Planejamento e Gestão do Projeto

### 3.1 Roadmap / Story Map

O planejamento foi guiado pelo Story Map, que visualiza o trabalho em três grandes blocos: **Perfis dos Docentes**, **Busca e Filtros Avançados**, e **Integração com Agentes da IA**. Todas as funcionalidades foram detalhadas em Histórias de Usuário.

* **Épicos:** Perfis dos Docentes, Busca e Filtros Avançados, e Integração com Agentes da IA.
* **Features:** Exibir perfil institucional, Busca Textual Básica, Filtragem por Departamento e Filtragem por Área de Pesquisa.
* **User Stories (com Critérios de Aceitação):** As funcionalidades foram detalhadas com Critérios de Aceitação (Ex: O sistema deve retornar resultados em menos de 2s).

### 3.2 Organização do Trabalho

Adotamos o framework **Scrum** com Sprints de duas semanas, realizando *Plannings*, *Reviews* e *Retrospectivas* para garantir o ajuste contínuo do processo. As ferramentas essenciais foram **GitHub** (Versionamento e Issues), **GitHub Actions** (CI) e **[Nome da Ferramenta de Board]** (Gestão de Tarefas).

* **Modelo Ágil Utilizado:** Scrum.
* **Eventos:** Sprint planning, reviews e retrospectivas realizadas regularmente.
* **Ferramentas Adotadas:** Git/GitHub, GitHub Actions (CI/CD), Figma e Board (Kanban/Scrum).

***