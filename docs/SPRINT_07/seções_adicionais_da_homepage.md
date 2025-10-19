# 📘 Estudo Dirigido — Novas Seções para a Home Page do Portal dos Professores

## 📖 Introdução
Este estudo tem como propósito **analisar e propor novas seções para a Home Page** do Portal dos Professores da UnB, com foco em ampliar a experiência do usuário e destacar informações relevantes do ambiente acadêmico.  
A Home é a “vitrine” do portal — o primeiro ponto de contato entre o usuário e o sistema. Por isso, ela precisa ser **clara, informativa e acolhedora**, transmitindo de imediato o objetivo do projeto: facilitar o acesso às informações públicas sobre professores, áreas de pesquisa e publicações da UnB.

---

## 🎯 Objetivos do Estudo
- Analisar a versão atual da Home Page e identificar lacunas informativas.  
- Propor **1 a 2 novas seções** que agreguem valor à navegação e tornem o portal mais interativo.  
- Manter o equilíbrio entre estética, funcionalidade e leveza da interface.  
- Garantir que as novas seções sejam compatíveis com a **arquitetura do projeto** (frontend + JSON + GitHub Actions).  

---

## 🧭 Contexto do Projeto
O **Portal dos Professores** centraliza e apresenta informações acadêmicas dos docentes da Universidade de Brasília (UnB), obtidas automaticamente através de bots de mineração executados nas GitHub Actions.  
Esses bots extraem dados de fontes públicas como **Lattes**, **Google Scholar** e **SIGAA**, consolidando-os em um **banco JSON**.  
O frontend, hospedado no **GitHub Pages**, consome esses dados e exibe os resultados para o usuário de forma visual e interativa.

Portanto, qualquer nova seção precisa funcionar **de forma leve, estática e dinâmica ao mesmo tempo**, puxando informações diretamente do JSON.

---

## 💡 Seções Propostas

### 🧩 1. “Pesquisa Rápida por Interesse”
Uma seção visual e funcional que apresenta **botões ou chips temáticos** com as principais áreas de atuação dos professores da UnB.  
O usuário pode clicar em “Inteligência Artificial”, “Sustentabilidade”, “Educação”, “Redes”, entre outras, e ser redirecionado a uma página filtrada com os professores daquela área.  

**Motivação:**  
- Facilitar o acesso rápido sem necessidade de digitar na barra de busca.  
- Estimular a curiosidade e a navegação exploratória.  
- Tornar o portal mais intuitivo e interativo.  

**Dados utilizados:**  
- Campos de *área de pesquisa* e *disciplinas* presentes no JSON.  

---

### 🧬 2. “Áreas em Crescimento”
Uma seção que mostra **as áreas acadêmicas com maior número de publicações recentes** ou **professores ativos**, com base nos dados minerados.  
Pode apresentar um gráfico simples (barras ou nuvem de tags) ou uma lista dinâmica de áreas com indicadores de crescimento.  

**Motivação:**  
- Exibir tendências acadêmicas dentro da UnB.  
- Ajudar alunos e pesquisadores a identificar temas emergentes.  
- Tornar o portal mais “vivo”, refletindo dados reais.  

**Dados utilizados:**  
- Contagem de publicações e data de atualização dos perfis no JSON.  

---

## 🧠 Boas Práticas e Diretrizes
- Priorizar **usabilidade e clareza visual**.  
- Evitar sobrecarregar a Home com muitos blocos de informação.  
- Garantir que todas as seções sejam **responsivas e leves**.  
- Utilizar cores e tipografia coerentes com a identidade da UnB.  
- Reaproveitar componentes já criados no frontend.  

---

## 📋 Checklist do Estudo
- [x] Analisar a versão atual da Home Page.  
- [x] Levantar propostas de novas seções.  
- [x] Escrever justificativas e motivações de cada ideia.  
- [x] Discutir ideias com o time e validar no próximo Sprint Review.  

---

## 🔗 Referências e Inspirações
- [ResearchGate](https://www.researchgate.net/) — Cards dinâmicos de áreas de pesquisa.  
- [Google Scholar](https://scholar.google.com/) — Navegação intuitiva e leve.   

---

## 🧾 Conclusão
As novas seções propostas tornam a Home Page mais interativa, acessível e conectada à realidade da UnB.  
A **“Pesquisa Rápida por Interesse”** facilita a descoberta de professores e áreas, enquanto **“Áreas em Crescimento”** adiciona um caráter informativo e dinâmico, valorizando a produção acadêmica da universidade.  
Essas ideias mantêm a simplicidade do projeto, aproveitando os dados já disponíveis no JSON e reforçando o papel do portal como **hub de informação e descoberta científica**.

---

📎 **Próximos Passos**
- Criar protótipo visual das novas seções no Figma.  
- Validar estrutura e usabilidade com a equipe.  
- Preparar implementação inicial no próximo ciclo de desenvolvimento (Sprint 05).
