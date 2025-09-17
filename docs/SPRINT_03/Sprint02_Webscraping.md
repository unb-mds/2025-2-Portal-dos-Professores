# Decisões Técnicas Iniciais: Coleta e Processamento de Dados

Este documento resume as decisões tomadas em relação às tecnologias de Web Scraping e Sumarização por Inteligência Artificial para o projeto "Portal de Professores da UnB".

## 1. Contexto e Objetivos

O projeto necessita de um processo automatizado para:
1.  **Coletar** informações públicas de docentes de fontes como Lattes, Sigaa e Google Scholar.
2.  **Processar** os dados coletados para gerar um resumo qualitativo sobre a atuação de cada professor.
3.  **Operar** de forma eficiente e confiável dentro de uma arquitetura serverless em workflows do GitHub Actions.

Para atender a esses requisitos, realizamos uma análise de ferramentas para cada etapa do processo.

## 2. Escolha da Ferramenta de Web Scraping

Analisamos diversas bibliotecas Python, com foco na capacidade de lidar com sites modernos e na viabilidade de execução no ambiente do GitHub Actions.

### Tabela Comparativa de Ferramentas de Scraping

| Ferramenta | Prós | Contras | Viabilidade em GitHub Actions |
| :--- | :--- | :--- | :--- |
| **Requests + BS4** | 🔹 Leve e rápido<br>🔹 Simples de usar | 🔸 **Não executa JavaScript**<br>🔸 Ineficaz para sites dinâmicos | **Limitada** |
| **Selenium** | 🔹 Padrão de mercado<br>🔹 Robusto e confiável | 🔸 Mais lento que Playwright<br>🔸 API mais verbosa | **Excelente** |
| ⭐ **Playwright** | 🔹 **Rápido e moderno**<br>🔹 API limpa com suporte `async`<br>🔹 **Setup simplificado** | 🔸 Curva de aprendizado um pouco maior que o básico | **Excelente (Recomendado)** |

### Decisão: Playwright

A biblioteca **Playwright** foi a escolhida. Sua performance superior, API moderna e, principalmente, sua facilidade de configuração em ambientes de CI/CD como o GitHub Actions a tornam a solução ideal para garantir uma coleta de dados robusta e eficiente.

## 3. Escolha da Ferramenta de Sumarização por IA

A sumarização dos dados coletados é um requisito chave. Avaliamos duas abordagens principais: rodar um modelo de IA localmente no runner do GitHub Actions ou utilizar uma API externa.

### Tabela Comparativa de Abordagens de Sumarização

| Abordagem | Prós | Contras | Viabilidade em GitHub Actions |
| :--- | :--- | :--- | :--- |
| **Modelo Local (Hugging Face)** | 🔹 Sem custo de API<br>🔹 Controle total | 🔸 **Alto consumo de CPU/RAM**<br>🔸 Lento, aumenta o tempo do workflow<br>🔸 Risco de falhas por limite de recursos | **Baixa** |
| ⭐ **API Externa (Google Gemini)** | 🔹 **Leve e rápido para o runner**<br>🔹 Resumos de altíssima qualidade<br>🔹 **Implementação simples**<br>🔹 Custo zero para a escala do projeto | 🔸 Dependência externa<br>🔸 Requer gerenciamento de chaves de API | **Excelente (Recomendado)** |

### Decisão: API do Google Gemini

Optamos por utilizar a **API do Google Gemini**. Esta abordagem delega o processamento pesado de IA para um serviço especializado, mantendo nosso workflow no GitHub Actions extremamente rápido, leve e confiável. A qualidade dos resumos é excelente e a cota de uso gratuito é mais do que suficiente para as necessidades do projeto.

## 4. Documento de Decisão Arquitetural (ADR)

Para formalizar estas escolhas, foi redigido o seguinte Architecture Decision Record (ADR).

---

### ADR-001: Escolha de Ferramentas para Coleta de Dados e Sumarização por IA

* **Status:** `Accepted`

* **Context:** O projeto "Portal de Professores da UnB" necessita de um processo automatizado para coletar dados de fontes web e gerar resumos qualitativos por IA. Este processo deve operar em uma arquitetura serverless (GitHub Actions), sendo robusto para sites dinâmicos e eficiente com os recursos disponíveis.

* **Decision:**
    1.  Para web scraping, utilizaremos a biblioteca **Playwright**.
    2.  Para a geração dos resumos por IA, utilizaremos a **API do Google Gemini**.

* **Consequences:**
    * **Positivas:**
        * Capacidade de extrair dados de sites complexos e dinâmicos.
        * Workflow de dados rápido e eficiente no GitHub Actions.
        * Alta qualidade nos resumos gerados com implementação simplificada.
        * Manutenção do "backend" focada em scripts Python, sem a complexidade de gerenciar modelos de IA.
    * **Negativas:**
        * Introduz uma dependência externa (API do Google Gemini).
        * Exige o gerenciamento seguro de chaves de API através do GitHub Secrets.
        * Potencial de custo futuro em caso de expansão massiva do projeto.

---