# 🏛️ Portal de Professores da UnB - Squad 04

![Status](https://img.shields.io/badge/status-Em%20Desenvolvimento-yellow)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

Projeto desenvolvido para a disciplina de **Métodos de Desenvolvimento de Software (MDS)** da Universidade de Brasília - Semestre 2025/2.

---
📚 [Acesse a documentação completa aqui](https://github.com/unb-mds/2025-2-Portal-dos-Professores)


## 📖 Sobre o Projeto

O **Portal de Professores** é uma plataforma que centraliza e organiza as informações do corpo docente da UnB, solucionando a dificuldade de encontrar dados acadêmicos consolidados e facilitando a conexão na comunidade universitária. Este documento detalha a arquitetura do projeto, o fluxo de dados e as instruções para configuração e execução local, a fim de orientar novos contribuidores e usuários.

## 📍 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Arquitetura](#-arquitetura)
- [Funcionalidades Principais](#funcionalidades-principais)
- [Estrutura de Diretórios](#-estrutura-de-diretórios)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Como Rodar Localmente](#-como-rodar-localmente)
- [Mineração de Dados](#-mineração-de-dados)
- [Como Contribuir](#-como-contribuir)
- [Equipe](#-equipe-squad-04)
- [Licença](#-licença)

---

### ✨ Acesso Rápido

| Recurso | Link |
| :--- | :--- |
| 🚀 **Aplicação Publicada** | [**Acesse o site via GitHub Pages**](https://unb-mds.github.io/2025-2-Portal-dos-Professores/) |
| 🎨 **Template Figma** | [**Visualizar no Figma**](https://www.figma.com/design/bjxbjjiQO9wNsDTUrOxa95/MDS---SQUAD-4) |
| 🐞 **Tracker de Issues** | [**Ver Tarefas e Bugs**](https://github.com/unb-mds/2025-2-Squad-04/issues) |

---

## 🚀 Funcionalidades Principais

* 👤 **Perfis Unificados:** Acesse currículos, Lattes, áreas de pesquisa e contato.
* 📚 **Produção Acadêmica:** Encontre publicações, artigos e projetos.
* 👨‍🏫 **Histórico de Ensino:** Consulte as disciplinas já ministradas.
* 🔍 **Busca com Filtros Avançados:** Encontre professores por nome, departamento ou área.

---


## 🏛️ Arquitetura

Este projeto opera sob uma arquitetura **frontend-only**, uma restrição deliberada para garantir simplicidade, segurança e custo zero de hospedagem.

1.  **Frontend (GitHub Pages):** A interface do usuário é construída como uma aplicação estática (ex: React, Vue, ou HTML/CSS/JS puros) e hospedada diretamente no GitHub Pages. Não há um servidor backend tradicional, o que simplifica o deploy e a manutenção.
2.  **Banco de Dados (Arquivo JSON):** Todas as informações dos professores, coletadas pelos bots, são consolidadas em um único arquivo `professores.json` no repositório. O frontend carrega e processa este arquivo como sua principal fonte de dados.
3.  **Mineração de Dados (GitHub Actions):** A atualização dos dados é automatizada. Um workflow do GitHub Actions é configurado para rodar periodicamente (ex: diariamente), executando scripts de web scraping que coletam informações de fontes públicas (Lattes, Scholar, SIGAA), processam os dados e atualizam o arquivo `professores.json` automaticamente.

---

## 📂 Estrutura de Diretórios

O projeto está organizado da seguinte forma para separar responsabilidades:
- **.github/**                      # Automação de CI/CD (GitHub Actions)
- **backend/**                      # Código-fonte do backend da aplicação
- **data/**                         # Dados minerados e datasets (ex: professores.json)
- **docs/**                         # Arquivos para a documentação (MkDocs)
- **frontend/**                     # Código-fonte da interface do usuário (frontend)
- **scripts/**                      # Scripts de mineração de dados (bots)
- **venv/**                         # Ambiente virtual do Python (ignorado pelo Git)
- `.env.example`                    # Exemplo de variáveis de ambiente necessárias
- `.gitignore`                      # Lista de arquivos e pastas ignorados pelo Git
- `.readthedocs.yaml`               # Configuração para a plataforma Read the Docs
- `docker-compose.yml`              # Define os serviços para rodar com Docker
- `LICENSE`                         # Licença de uso do projeto
- `mkdocs.yml`                      # Arquivo de configuração do MkDocs
- `package-lock.json`               # Lockfile de dependências do Node.js
- `README.md`                       # Documentação principal do projeto
- `requirements.txt`                # Lista de dependências do Python


---

## 🛠️ Tecnologias Utilizadas

| Categoria | Tecnologia | Descrição |
| :--- | :--- | :--- |
| **Frontend** | `React` / `Vue.js` | Biblioteca/framework SPA  |
| **Frontend** | `Vite` | Dev server e build rápido |
| **Estilização** | `Tailwind CSS` |  Utilitários CSS modernos      |
| **Mineração de Dados** | `Python` | Linguagem para os scripts de scraping. |
| **Mineração de Dados** | `BeautifulSoup` / `Playwright` | Bibliotecas para extração de dados de páginas web. |
| **Automação** | `GitHub Actions` | Orquestrador para execução automática dos scripts. |

---

## 🚀 Como Rodar Localmente

---

## 🤖 Mineração de Dados

Os bots são responsáveis por popular o "banco de dados" (`professores.json`).

* **O que eles fazem:** Os scripts em `scripts/` navegam até as páginas de fontes públicas, extraem as informações relevantes de cada professor e as estruturam no formato esperado.
* **Como executar manualmente:** Para testar ou forçar uma atualização localmente, você pode rodar o script principal de mineração.
    ```bash
    python scripts/main_scraper.py
    ```
    > **Aviso:** A execução pode demorar e consumir recursos. Após a execução, um novo `professores.json` será gerado ou atualizado na raiz do projeto.

---

## 🤝 Como Contribuir

Agradecemos o seu interesse em contribuir com o Portal de Professores! Para garantir a qualidade e a organização do projeto, por favor, siga os passos abaixo:

1.  **Faça um Fork** deste repositório.
2.  **Crie uma Branch** para sua nova funcionalidade ou correção (`git checkout -b feature/sua-feature-incrivel`).
3.  **Faça o Commit** das suas alterações com uma mensagem clara (`git commit -m 'feat: Adiciona funcionalidade X'`).
4.  **Faça o Push** para a sua branch (`git push origin feature/sua-feature-incrivel`).
5.  **Abra um Pull Request** detalhando as mudanças que você fez.

Antes de começar, verifique o nosso [**Quadro de Tarefas**](https://github.com/unb-mds/2025-2-Squad-04/projects/1) para ver as atividades em andamento e evitar trabalho duplicado.

---

## 👥 Equipe (Squad 04)

| Foto | Nome | GitHub |
| :--: | :-- | :--: |
| <img src="https://github.com/caiolacerdamt.png" width="80" alt="Caio Lacerda" style="border-radius: 50%;"> | [Caio Lacerda](https://github.com/caiolacerdamt) | [@caiolacerdamt](https://github.com/caiolacerdamt) |
| <img src="https://github.com/ianpedersoli.png" width="80" alt="Ian Pedersoli" style="border-radius: 50%;"> | [Ian Pedersoli](https://github.com/ianpedersoli) | [@ianpedersoli](https://github.com/ianpedersoli) |
| <img src="https://github.com/Ascartezini.png" width="80" alt="Arthur Scartezini" style="border-radius: 50%;"> | [Arthur Scartezini](https://github.com/Ascartezini) | [@Ascartezini](https://github.com/Ascartezini) |
| <img src="https://github.com/Paulosrsr.png" width="80" alt="Paulo Sérgio" style="border-radius: 50%;"> | [Paulo Sérgio](https://github.com/Paulosrsr) | [@Paulosrsr](https://github.com/Paulosrsr) |
| <img src="https://github.com/KaioAmouryUnB.png" width="80" alt="Kaio Amoury" style="border-radius: 50%;"> | [Kaio Amoury](https://github.com/KaioAmouryUnB) | [@KaioAmouryUnB](https://github.com/KaioAmouryUnB) |
| <img src="https://github.com/brunodantas9.png" width="80" alt="Bruno Augusto" style="border-radius: 50%;"> | [Bruno Augusto](https://github.com/brunodantas9) | [@brunodantas9](https://github.com/brunodantas9) | |
---

## 📜 Licença

Este projeto está sob a licença [MIT](LICENSE).