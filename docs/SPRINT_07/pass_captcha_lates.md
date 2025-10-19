# Resolução da Issue: Lidando com CAPTCHAs no Scraping

**Status:** CONCLUÍDA
**Data:** 2025-10-18

## Resumo Executivo (TL;DR)

Esta sprint teve como objetivo encontrar uma solução para a barreira de CAPTCHAs encontrada na plataforma Lattes. Após pesquisar três abordagens distintas (serviços de API, "humanização" do scraper e uso de extensões), foi desenvolvida uma Prova de Conceito (POC) funcional utilizando o **Playwright** em conjunto com a extensão de navegador **Buster**.

O script final é capaz de lidar tanto com o cenário em que o CAPTCHA é resolvido com um simples clique ("caminho fácil"), quanto com o cenário que exige a resolução de um desafio de imagens ("caminho difícil"). A solução se mostrou robusta em testes de lote e está pronta para ser integrada ao fluxo de trabalho da equipe.

---

### ✅ Checklist de Tarefas

#### 1. Identificar e Classificar os Tipos de CAPTCHA (✔️ Concluído)

- **Plataforma-Alvo:** Currículo Lattes (CNPq).
- **Tipo de CAPTCHA:** **Google reCAPTCHA v2 (Checkbox)**.
- **Funcionamento:** Este CAPTCHA opera com base em uma análise de risco do comportamento do usuário. Fatores como movimento do mouse, cookies, reputação do IP e "fingerprint" do navegador determinam se o desafio de imagens será exibido. Scripts de automação são quase sempre desafiados.

#### 2. Pesquisar Pelo Menos 3 Estratégias de Resolução (✔️ Concluído)

Foram estudadas as três abordagens a seguir:

1.  **Serviços de Resolução de CAPTCHA (API de Terceiros):**
    -   **Descrição:** Serviços pagos (ex: 2Captcha, Anti-CAPTCHA) que utilizam humanos ou IAs avançadas para resolver o CAPTCHA. O script envia o desafio e recebe um token de solução.
    -   **Vantagens:** Altíssima taxa de sucesso (>95%), solução robusta para produção.
    -   **Desvantagens:** Custo associado (pago por resolução), dependência de um serviço externo.

2.  **Simulação de Comportamento Humano ("Humanização"):**
    -   **Descrição:** Utilizar técnicas para mascarar a automação, como plugins (ex: `playwright-extra/stealth`), proxies residenciais e simulação de movimentos de mouse e digitação realistas.
    -   **Vantagens:** Potencialmente gratuito (exceto por proxies).
    -   **Desvantagens:** Baixa confiabilidade, inconsistente. O que funciona hoje pode não funcionar amanhã.

3.  **Uso de Extensão de Navegador (Abordagem Escolhida):**
    -   **Descrição:** Carregar uma extensão especializada (Buster) no navegador controlado pelo Playwright. A extensão automatiza a resolução do desafio de áudio, que é mais fácil de processar por uma máquina.
    -   **Vantagens:** Gratuito, eficaz para reCAPTCHA v2, automatiza um fluxo complexo.
    -   **Desvantagens:** Depende da manutenção da extensão por terceiros. Pode ser mais frágil que os serviços pagos.

#### 3. Implementar uma POC com a Estratégia Mais Viável (✔️ Concluído)

Foi implementada uma POC completa utilizando a **Estratégia 3 (Uso de Extensão)**, por ser a mais equilibrada em termos de custo (zero), eficácia e complexidade para o escopo desta sprint.

- **Tecnologias Utilizadas:** Python, Playwright, Extensão Buster.
- **Arquivo da POC:** [`lattes_scraper.py`](../../backend/scrapers/lattes_scraper.py)
- **Funcionalidades Implementadas:**
    1.  O script foi refatorado para ser uma função reutilizável e modular.
    2.  Implementada uma lógica inteligente que **detecta e trata os dois cenários** (caminho fácil e difícil).
    3.  A inicialização do navegador foi ajustada para usar `launch_persistent_context`, que se mostrou **crítico** para o funcionamento correto da extensão.
    4.  O script foi validado com um teste em lote, processando com sucesso uma lista de 5 URLs diferentes, provando sua robustez.

#### 4. Documentar Aprendizados e Recomendações (✔️ Concluído)

##### Aprendizados Cruciais

1.  **A Persistência é a Chave:** A extensão Buster só funcionou de forma confiável ao usar `launch_persistent_context` do Playwright, que cria um perfil de usuário mais estável. A abordagem com `launch` + `new_context` se mostrou ineficaz.
2.  **Gestão em Equipe:** A pasta `playwright_user_data` é um artefato de cache local e **NÃO DEVE** ser versionada no Git. Cada membro da equipe terá sua própria cópia local, que é criada automaticamente pelo script.
3.  **Lógica Adaptativa é Essencial:** O scraper não pode assumir que o desafio de imagens sempre aparecerá. A verificação do estado do checkbox após o clique inicial é a forma mais eficiente de decidir qual caminho seguir.

##### Recomendações e Próximos Passos

1.  **Integrar ao Orquestrador:** A função `scrape_lattes(page, url)` no arquivo da POC está pronta para ser chamada pelo `scraper_runner.py` ou qualquer outro módulo do projeto.

2.  **Considerar um Fallback:** Embora a extensão Buster funcione bem, podemos no futuro implementar a **Estratégia 1 (API de Terceiros)** como um *fallback*. Se o scraper detectar que a extensão falhou ao resolver o CAPTCHA, ele poderia, como segunda tentativa, chamar uma API paga. Isso criaria um sistema extremamente resiliente.