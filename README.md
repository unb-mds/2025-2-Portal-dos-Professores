# 🏛️ Portal de Professores da UnB - Squad 04

![Status](https://img.shields.io/badge/status-Em%20Desenvolvimento-yellow)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

Projeto desenvolvido para a disciplina de **Métodos de Desenvolvimento de Software (MDS)** da Universidade de Brasília - Semestre 2025/2.

---
📚 [Acesse a documentação completa aqui](https://portal-dos-professores.readthedocs.io/pt/latest/)


## 📖 Sobre o Projeto

O **Portal de Professores** é uma plataforma que centraliza e organiza as informações do corpo docente da UnB, solucionando a dificuldade de encontrar dados acadêmicos consolidados e facilitando a conexão na comunidade universitária. Este documento detalha a arquitetura do projeto, o fluxo de dados e as instruções para configuração e execução local, a fim de orientar novos contribuidores e usuários.

## 📍 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Arquitetura](#-arquitetura)
- [Funcionalidades Principais](#-funcionalidades-principais)
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

A arquitetura do projeto é desacoplada, dividida entre um frontend moderno e um backend Python que serve os dados através de uma API.

-  **Frontend (Aplicação Estática):** A interface do usuário é construída como uma aplicação estática (React, Vue, etc.). Ela não lê dados diretamente de arquivos, mas sim consome as rotas expostas pelo backend FastAPI, tornando a aplicação mais escalável e segura.

-  **Backend (API com FastAPI):** O núcleo do projeto é uma API desenvolvida em Python com o framework FastAPI. Ele é responsável por ler o arquivo `professores.json`, processar os dados e expor endpoints (rotas) para o frontend consumir.

-  **Banco de Dados (Arquivo JSON):** O arquivo `professores.json`, localizado na pasta `data/`, continua atuando como a fonte de verdade (banco de dados). Ele é gerenciado e atualizado exclusivamente pelos scripts no backend.

-  **Mineração de Dados (GitHub Actions + Backend):** A automação é feita via GitHub Actions. Um workflow agendado aciona os scripts de mineração localizados dentro do diretório `backend/`. Esses scripts coletam os dados de fontes externas e atualizam o arquivo `professores.json`.

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
| **Frontend** | `React` / `Vue.js` | Biblioteca/framework para a interface do usuário. |
| **Frontend** | `Vite` | Ferramenta de build e servidor de desenvolvimento. |
| **Backend** | `Python` | Linguagem principal para a API e scripts. |
| **Backend** | `FastAPI` | Framework web para a criação da API. |
| **Estilização** | `Tailwind CSS` | Framework CSS para estilização rápida. |
| **Mineração de Dados** | `BeautifulSoup` / `Playwright`| Bibliotecas para extração de dados web. |
| **Automação** | `GitHub Actions` | Orquestrador para execução automática dos scripts. |

---

## 🚀 Como Rodar Localmente

---

## 🤖 Mineração de Dados

A coleta de dados é automatizada e gerenciada pelo backend.

* **O que acontece:** Um workflow do **GitHub Actions** é configurado para rodar periodicamente. Ele aciona os scripts de mineração localizados dentro do diretório `backend/scripts/`. Esses scripts navegam até as fontes públicas (Lattes, Scholar, etc.), extraem as informações e atualizam o arquivo `data/professores.json`.
* **Como executar manualmente:** Para testar a mineração localmente, você pode executar o script principal a partir da raiz do projeto:
    ```bash
    python backend/scripts/main_scraper.py
    ```
    > **Aviso:** A execução pode demorar e consumir recursos. Após o término, o arquivo `data/prof-professores.json` será atualizado com os novos dados.

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
| <img src="https://github.com/Ascartezin.png" width="80" alt="Arthur Scartezini" style="border-radius: 50%;"> | [Arthur Scartezini](https://github.com/Ascartezin) | [@Ascartezin](https://github.com/Ascartezin) |
| <img src="https://github.com/Paulosrsr.png" width="80" alt="Paulo Sérgio" style="border-radius: 50%;"> | [Paulo Sérgio](https://github.com/Paulosrsr) | [@Paulosrsr](https://github.com/Paulosrsr) |
| <img src="https://github.com/KaioAmouryUnB.png" width="80" alt="Kaio Amoury" style="border-radius: 50%;"> | [Kaio Amoury](https://github.com/KaioAmouryUnB) | [@KaioAmouryUnB](https://github.com/KaioAmouryUnB) |
| <img src="https://github.com/brunodantas9.png" width="80" alt="Bruno Augusto" style="border-radius: 50%;"> | [Bruno Augusto](https://github.com/brunodantas9) | [@brunodantas9](https://github.com/brunodantas9) | |
---

## 📜 Licença

Este projeto está sob a licença [MIT](LICENSE).