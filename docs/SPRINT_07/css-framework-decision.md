# Decisão de Arquitetura: Framework CSS

## Status: Concluído
## Decisão: Não Adotar um Framework CSS Externo (Bootstrap, Tailwind, etc.)

---

### 1. Resumo da Decisão

Após a seleção do **Chakra UI** como a biblioteca de componentes React oficial do projeto (documentada na issue #60), foi realizado um estudo para avaliar a necessidade de um framework CSS adicional, como o Bootstrap, para lidar com "elementos neutros" (layout, grid, responsividade).

A decisão da equipe é **não adotar o Bootstrap** ou qualquer outro framework CSS externo.

### 2. Justificativa

A biblioteca **Chakra UI** é um sistema de design "tudo-em-um" que já fornece soluções nativas e mais eficientes para todos os casos de uso que o Bootstrap cobriria. A adoção do Bootstrap seria redundante e criaria conflitos de arquitetura.

Os principais pontos de sobreposição são:

#### a. Layout e Sistema de Grid
O principal benefício do Bootstrap (seu grid de 12 colunas) já é coberto pelo Chakra:

* **Bootstrap:** Usa classes CSS como `<div class="row">` e `<div class="col-md-6">`.
* **Chakra UI:** Fornece componentes React nativos como `<Grid>`, `<GridItem>`, `<Flex>`, `<Box>` e `<Container>`, que oferecem o mesmo resultado de forma mais limpa e programática.

#### b. Responsividade
O sistema de breakpoints do Bootstrap (`sm`, `md`, `lg`) é replicado (e melhorado) no Chakra UI. Podemos tornar **qualquer** propriedade de estilo responsiva:

* **Bootstrap:** `<div class="col-12 col-md-6">`
* **Chakra UI:** `<GridItem colSpan={{ base: 12, md: 6 }}>` ou `<Box width={{ base: '100%', md: '50%' }}>`
* **Vantagem do Chakra:** A sintaxe de array/objeto do Chakra é mais flexível, permitindo-nos alterar `fontSize`, `padding`, `display`, etc., em diferentes breakpoints, algo que é mais limitado no Bootstrap.

#### c. Componentes e Utilitários
Ambas as bibliotecas fornecem componentes (botões, cards) e utilitários (espaçamento), o que geraria conflitos diretos:

* **Conflito de Componentes:** Teríamos um `<Button>` do Chakra e um `.btn` do Bootstrap, criando inconsistência visual e confusão para a equipe.
* **Conflito de Utilitários:** O Chakra usa *style props* (ex: `<Box mt={4}>`) que são mais fáceis de manter do que as classes de utilitário do Bootstrap (ex: `class="mt-4"`).

### 3. Riscos de Adotar o Bootstrap (Que Estamos Evitando)

1.  **Conflitos de Estilo:** Forçaríamos dois sistemas de design a coexistir, resultando em uma "guerra de especificidade" no CSS e o uso de `!important` para corrigir bugs visuais.
2.  **Performance Negativa:** O usuário seria forçado a baixar duas bibliotecas de UI completas (Chakra UI e Bootstrap CSS/JS), aumentando o tamanho do bundle e diminuindo a velocidade de carregamento do site.
3.  **Confusão de Desenvolvimento:** A equipe teria duas "fontes da verdade" para implementar layouts e componentes, prejudicando a manutenção do código.

### 4. Conclusão

O **Chakra UI** será a única fonte da verdade para layout, componentes e estilos. A implementação da Página Home e de todos os "elementos neutros" será feita utilizando os componentes de layout nativos do Chakra (como `<Flex>`, `<Container>`, `<Grid>`).
