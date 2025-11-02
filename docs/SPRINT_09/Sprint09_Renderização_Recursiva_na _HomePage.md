# 🛠️ Estudo Dirigido: Análise e Solução do Loop de Renderização Recursiva na Home Page

## 📖 Introdução
O estudo anterior definiu a estrutura ideal para a **Home Page** do Portal dos Professores.  
No entanto, o desenvolvimento atual do frontend em **React** encontrou um **erro crítico de recursividade / loop infinito de renderização**, impedindo que a página inicial seja carregada.  

Este Estudo Dirigido tem como objetivo **analisar as causas prováveis desse bug** no contexto do projeto (React, sem Backend) e **guiar a correção**, garantindo que a Home Page possa ser finalmente integrada com os dados JSON.

---

## 🎯 Objetivos Específicos do Estudo Dirigido
- [x] Diagnosticar as causas típicas de loops infinitos em componentes React.  
- [ ] Propor soluções de código específicas para componentes funcionais (`useState`, `useEffect`).  
- [ ] Garantir a estabilidade do componente principal antes da integração de dados (Hero Section e Cabeçalho).

---

## 🔍 Contexto Técnico do Erro
O **erro de recursividade (loop de renderização)** no React geralmente ocorre por um dos três motivos abaixo, resultando em re-renderização imediata do componente sem que ele chegue a ser montado:

1. **Chave de Estado (State Loop):**  
   Uma chamada a uma função de atualização de estado (`setAlgumaCoisa(novoValor)`) é feita direta e incondicionalmente dentro do corpo principal do componente durante a renderização.

2. **Função de Chamada Incorreta (Inline Call):**  
   Uma função que não retorna um componente (ex: faz chamada de API) é executada diretamente na renderização.  
   Ex.: `<div onClick={handleCall()}>...</div>`

3. **Dependência Incorreta no `useEffect`:**  
   O `useEffect` é usado para buscar dados ou processamentos, mas o array de dependências está incorreto, ausente, ou depende de uma função recriada a cada renderização.

> No contexto da Home Page que precisa exibir a **Hero Section** e a **Busca**, o erro pode estar relacionado à lógica inicial de carregamento ou inicialização de dados.

---

## 📝 Análise e Proposta de Correção (Checklist)

| Área de Foco | Análise do Problema | Ação Corretiva Proposta |
|--------------|-------------------|------------------------|
| Componente Principal (Ex: App.js ou Home.js) | O componente está chamando a si mesmo ou um hook de estado sem controle. | Envolver todas as chamadas de estado (`setEstado`) dentro de hooks de ciclo de vida (`useEffect`) ou manipuladores de eventos. |
| Uso de `useEffect` | Lógica de busca ou configuração inicial fora do hook. | Garantir que o array de dependências esteja vazio (`[]`) se o objetivo é rodar o código apenas uma vez após a montagem do componente. |
| Renderização de Funções | Funções auxiliares (ex: `getProfessores()`) estão sendo chamadas na renderização sem controle. | Nunca chame funções de manipulação de estado ou funções pesadas diretamente na renderização. Use `useCallback` ou chame dentro de `useEffect` ou event handler. |
| Integração de Dados JSON | Busca do JSON mal posicionada, disparando recursividade. | Encapsular a função de busca de dados JSON em um `useEffect` com dependência vazia (`[]`) para rodar apenas uma vez após a montagem. |

---

## 📋 Checklist de Tarefas para Implementação
- [ ] Criar uma branch de correção (já definida na Issue anterior).  
- [ ] Isolar o trecho de código onde o erro de estado/efeito está sendo acionado.  
- [ ] Envolver as chamadas de estado dentro de `useEffect(() => { ... }, [])`.  
- [ ] Verificar a sintaxe de todas as chamadas de funções dentro do `return` do componente.  
- [ ] Testar a renderização mínima da **Hero Section** (Título e Subtítulo) para confirmar a estabilidade.  
- [ ] Publicar a correção no Pull Request para revisão do time.

---

## 🚀 Próximos Passos
Após a estabilização da Home Page, o foco retornará para a integração de dados, conforme planejado no estudo inicial:

- **Integrar a Lógica de Busca:** Conectar o Campo de Busca Central com a função de leitura dos dados JSON (implementação prevista para a próxima sprint).  
- **Renderizar Cards de Destaque:** Usar os dados do JSON para renderizar a Seção de Professores em Destaque na Home Page.
