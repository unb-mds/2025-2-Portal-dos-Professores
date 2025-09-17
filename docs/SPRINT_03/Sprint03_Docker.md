## ✅ Decisão: Aprovado o Uso do Docker

**Status:** Concluído

---

### **Resumo da Decisão**

Após a pesquisa realizada nesta issue, a equipe decidiu formalmente **adotar o Docker** como a ferramenta padrão para o ambiente de desenvolvimento do projeto.

Esta decisão visa mitigar riscos de inconsistência entre os ambientes de desenvolvimento, otimizar o processo de onboarding de novos membros e alinhar o ambiente de desenvolvimento com o de execução final no GitHub Actions.

### **Justificativa Técnica**

O 'porquê' desta decisão se baseia no princípio da **padronização e reprodutibilidade**.

* **Problema Identificado:** Atualmente, cada ambiente de desenvolvimento (o PC de cada membro) é uma configuração única, com potenciais variações em versões de software (Python, Node.js), dependências de sistema e variáveis de ambiente. Isso introduz riscos de incompatibilidade e o conhecido problema "funciona na minha máquina".

* **Solução Adotada:** O Docker nos permite definir, via código, uma **imagem de ambiente virtual e idêntica para todos**. Em vez de depender de configurações locais, todo o desenvolvimento ocorrerá dentro de contêineres que espelham essa imagem padronizada.

---

### **O que é o Docker, afinal? (Uma Explicação Simples)**

Antes de prosseguir, vale a pena entender a ideia central do Docker com algumas analogias.

**Analogia 1: O "Mini-Computador de Bolso"**

Imagine que nosso script Python precisa de uma versão específica do Linux, do Python 3.10 e de 5 bibliotecas para funcionar. Em vez de instalar tudo isso no nosso próprio PC (e talvez criar conflito com outras coisas que temos lá), nós usamos o Docker para criar um **"mini-computador" completamente isolado** só para ele.

Dentro desse "mini-computador" (que chamamos de **contêiner**), não há nada além do essencial: um sistema operacional leve, o Python 3.10 e exatamente as 5 bibliotecas que listamos. O que acontece lá dentro não afeta nosso PC principal, e o que temos no nosso PC não afeta o contêiner. É um ambiente limpo, previsível e descartável.

**Analogia 2: O Contêiner de Navio (A Origem do Nome)**

Essa é a analogia clássica. Pense no nosso código como uma "carga" delicada (ex: bananas).

* **Sem Docker:** Tentar enviar as bananas em caixas diferentes para navios diferentes (PCs dos colegas, servidor do GitHub) é arriscado. A carga pode amassar, estragar, etc. O código pode quebrar.
* **Com Docker:** Nós colocamos nossas bananas (nosso código) dentro de um **contêiner de metal, lacrado e climatizado**. Agora, não importa qual navio (qual PC) transporte esse contêiner, a carga chegará intacta e funcional, pois o ambiente dentro do contêiner é sempre o mesmo.

Isso é o que o Docker faz: ele "empacota" nosso código junto com **todo o seu ambiente e dependências** em um contêiner portátil, garantindo que ele rode da mesma forma em qualquer lugar.

**As Peças-Chave que Vamos Usar:**

* **Imagem Docker:** É o "molde" ou a "planta" do nosso mini-computador. É um arquivo de modelo, só de leitura.
* **Contêiner:** É o "mini-computador" de fato, ligado e funcionando. É uma instância executável de uma Imagem.
* **Dockerfile:** É a nossa "receita de bolo". Um arquivo de texto com o passo a passo para construir nossa Imagem. (Ex: "1. Comece com uma base de Python 3.10. 2. Instale as bibliotecas X, Y, Z. 3. Copie nosso script para dentro.").
* **Docker Compose:** É o "gerente do restaurante". Nosso projeto tem dois "pratos" (o frontend e o script de dados). O `docker-compose.yml` é o arquivo que diz como preparar e servir esses dois pratos juntos, garantindo que eles funcionem em harmonia.

---

### **Visão Geral da Implementação**

A complexidade da configuração será abstraída por dois tipos de arquivos centrais no projeto: o `Dockerfile` (a receita) e o `docker-compose.yml` (o gerente).

---

### **Comandos Principais do Fluxo de Trabalho**

Após a implementação, a interação com o ambiente Docker será feita através dos seguintes comandos:

* `docker-compose up [serviço]`: Inicia e mantém um serviço em execução (ex: o servidor de desenvolvimento do frontend).
* `docker-compose run --rm [serviço] [comando]`: Executa uma tarefa única em um contêiner temporário (ex: nosso script de coleta de dados).
* `docker-compose build`: Força a reconstrução da imagem de um serviço após a alteração de dependências (`requirements.txt`, `package.json`).
* `docker-compose down`: Para e remove os contêineres de serviços que estão em execução.

---

### **Próximos Passos**

Começar a implementação do docker no nosso projeto pro front-end e pro nosso 'back-end'.
