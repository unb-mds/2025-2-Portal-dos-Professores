# 🛠️ Decisão Tecnológica: Frontend do Portal de Professores

## 📖 Descrição

Este documento formaliza a escolha da tecnologia para a interface (frontend) do Portal de Professores. O frontend será responsável por consumir os dados de um arquivo `database.json` e apresentá-los de forma clara e interativa aos usuários.

A principal restrição arquitetural é que a aplicação final deve ser composta por arquivos estáticos (HTML, CSS, JavaScript) para ser hospedada gratuitamente no GitHub Pages.

---

## ✅ Decisão Final

A stack escolhida para o desenvolvimento do frontend é a biblioteca **React** em conjunto com a ferramenta de build **Vite**.

---

## 🏆 Por que a escolha de React + Vite?

A decisão por esta combinação foi baseada nos seguintes pilares:

### **Sobre o React:**

1.  **Ecossistema Gigante:** O principal motivo da escolha. O React possui o maior ecossistema de bibliotecas de componentes, especialmente para visualização de dados (gráficos, tabelas complexas), o que é essencial para o requisito de "visualização fácil" do nosso projeto.
2.  **Arquitetura Baseada em Componentes:** Permite que a UI seja construída em peças reutilizáveis (ex: `CardProfessor`, `GraficoPublicacoes`), tornando o código mais limpo, organizado e fácil de manter.
3.  **Grande Comunidade e Suporte:** É fácil encontrar soluções para problemas, tutoriais e desenvolvedores com experiência na tecnologia, garantindo a longevidade e a saúde do projeto.

### **Sobre o Vite:**

1.  **Ambiente de Desenvolvimento Ultrarrápido:** O Vite oferece um servidor de desenvolvimento quase instantâneo, o que torna o processo de criação e teste de componentes extremamente ágil e produtivo.
2.  **Build Otimizado para Produção:** Ele utiliza ferramentas modernas para gerar os arquivos estáticos finais, garantindo que sejam pequenos e otimizados para um carregamento rápido, o que é perfeito para a hospedagem no GitHub Pages.
3.  **Configuração Simples e Moderna:** Exige pouquíssima configuração para começar e é considerado o padrão atual para novos projetos React, superando ferramentas mais antigas como o Create React App.

---

## 🛠️ Alternativas Consideradas

-   **Next.js:** Um excelente framework sobre React, mas foi considerado mais "opinativo" e robusto do que o necessário. A equipe optou pela flexibilidade de montar a aplicação com React "puro", escolhendo bibliotecas como a de roteamento (`react-router-dom`) conforme a necessidade.
-   **Vue.js / Svelte:** Ótimas alternativas ao React, mas a decisão final pesou a favor do React devido à incomparável variedade e maturidade de seu ecossistema de bibliotecas de terceiros.
