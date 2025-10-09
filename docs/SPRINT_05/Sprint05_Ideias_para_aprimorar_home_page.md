# 📘 Estudo Dirigido — Ideias para Aprimorar a Home Page do Portal dos Professores

## 📖 Introdução
Este estudo tem como objetivo analisar e propor melhorias para a **Home Page** do Portal dos Professores da UnB, de modo a torná-la mais intuitiva, informativa e visualmente agradável.  
A página inicial é a **porta de entrada do sistema**, responsável por apresentar o propósito do projeto e permitir o acesso rápido às principais funcionalidades — como busca de professores, visualização de perfis e exploração de dados minerados.

---

## 🎯 Objetivos do Estudo
- Entender as boas práticas de design aplicáveis a portais acadêmicos e institucionais.  
- Propor uma estrutura clara e funcional para a Home Page.  
- Sugerir melhorias visuais e interativas que aumentem a usabilidade.  
- Criar a base conceitual para o **protótipo de baixa fidelidade** no Figma.  

---

## 🧭 Contexto do Projeto
O **Portal dos Professores** busca centralizar e apresentar informações públicas de docentes da UnB, como:
- Dados de currículo (Lattes, Google Scholar, SIGAA).  
- Disciplinas ministradas e evolução ao longo do tempo.  
- Publicações recentes e áreas de pesquisa.  
- Resumos automáticos gerados por agentes de IA.  

Como a arquitetura do sistema **não possui backend tradicional** (todo o processamento ocorre via GitHub Actions e os dados são salvos em JSON), a Home Page precisa **consumir esses dados de forma dinâmica** e apresentar informações de modo leve e acessível.

---

## 🧩 Estrutura Recomendada da Home Page
Abaixo está uma proposta de estrutura dividida por seções, respeitando os princípios de UX/UI e a identidade visual da UnB.

### 1. Cabeçalho (Header)
- Logotipo do projeto + nome “Portal dos Professores UnB”.  
- Barra de navegação com os links: *Home | Professores | Áreas | Sobre | Contato*.  
- Tema claro/escuro (modo dark opcional).  

### 2. Seção de Apresentação (Hero Section)
- Título principal:  
  > “Descubra e explore os professores da UnB em um só lugar.”  
- Subtítulo breve explicando o propósito do portal.  
- Campo de busca central (busca por nome, disciplina ou área).  
- Imagem ilustrativa (ou vetor com tema acadêmico).  

### 3. Professores em Destaque
- Cards com foto, nome, departamento e resumo gerado pela IA.  
- Botão “Ver mais” direcionando para a página do professor.  
- Ordenação dinâmica por popularidade ou atualização recente.  

### 4. Seção “Descubra”
- Destaques automáticos baseados em dados do JSON:  
  - Professores recém-atualizados.  
  - Áreas de pesquisa mais ativas.  
  - Últimas publicações.  

### 5. Sobre o Projeto
- Texto curto explicando que os dados vêm de fontes públicas (Lattes, SIGAA, Google Scholar).  
- Breve descrição da arquitetura do projeto (Front + JSON + Actions).  

### 6. Rodapé (Footer)
- Créditos dos integrantes do Squad 04.  
- Links úteis (GitHub, Figma, contato institucional).  

---

## 💡 Boas Práticas de Design Consideradas
- **Minimalismo visual:** evitar excesso de informações e focar em clareza.  
- **Hierarquia visual:** destacar a busca e os professores em destaque.  
- **Cores institucionais da UnB:** tons de azul, branco e cinza.  
- **Tipografia limpa e legível:** ex: *Inter*, *Roboto* ou *Poppins*.  
- **Responsividade:** compatível com desktop, tablet e mobile.  

---

## 🧠 Inspirações e Referências
- [Google Scholar](https://scholar.google.com/)  
- [Figma Community UI Templates](https://www.figma.com/community/)  

---

## 📋 Checklist do Estudo
- [x] Analisar referências visuais.  
- [x] Definir estrutura base (Header, Hero, Conteúdo, Footer).  
- [x] Propor melhorias interativas e visuais.  
- [x] Definir conteúdo principal da Home.  
- [x] Esboçar protótipo inicial no Figma.  

---

## 🧾 Conclusão
O redesign da Home Page visa **reforçar a identidade e o propósito do portal**, garantindo que o usuário entenda o objetivo do projeto logo ao acessá-lo.  
Com uma interface simples, organizada e funcional, o Portal dos Professores passa a ser não apenas uma base de dados, mas uma **experiência de descoberta acadêmica**.

---

📎 **Próximos Passos**
- Implementar o layout proposto no Figma (protótipo de baixa fidelidade).  
- Validar com o time durante o próximo *Sprint Review*.  
- Iniciar integração com os dados JSON e testar carregamento dinâmico.  
