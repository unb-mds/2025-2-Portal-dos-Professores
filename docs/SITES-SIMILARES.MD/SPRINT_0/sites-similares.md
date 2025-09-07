Este estudo foi desenvolvido com o objetivo de mapear **sites similares ao que precisamos construir** e identificar **fontes de dados confiáveis** para realizar a mineração de informações.  

Para exemplificar o processo de pesquisa, utilizei como caso prático o professor **José Marilson Martins Dantas** (meu tio), buscando seus dados em diferentes plataformas acadêmicas e institucionais. Isso permitiu visualizar como as informações sobre docentes estão distribuídas na internet e como podem ser **integradas** em nosso site.  

---

## 🎯 Objetivos  
- Consolidar referências de sites semelhantes ao nosso projeto, observando **funcionalidades e usabilidade**.  
- Identificar **fontes oficiais e seguras para mineração de dados** (acadêmicos e institucionais).  
- Mapear **formatos de apresentação de informações** (perfis resumidos, detalhados, integrações).  
- Reunir aprendizados que servirão de guia para o desenvolvimento do site.  

---

## 🌐 Sites Pesquisados  

1. **SIGAA – Busca de Docentes**  
   🔗 [https://sigaa.unb.br/sigaa/public/docente/busca_docentes.jsf](https://sigaa.unb.br/sigaa/public/docente/busca_docentes.jsf)  
   - Ferramenta oficial da UnB para localizar docentes cadastrados.  
   - Oferece filtros por nome e unidade acadêmica.  
   - Ponto de partida para acessar os perfis individuais.  

2. **SIGAA – Página do Professor (Exemplo: José Marilson Martins Dantas)**  
   🔗 [https://sigaa.unb.br/sigaa/public/docente/portal.jsf?siape=1181929](https://sigaa.unb.br/sigaa/public/docente/portal.jsf?siape=1181929)  
   - Exibe informações sobre titulação, disciplinas ministradas e produção.  
   - Usado como **exemplo prático**, permitindo observar o tipo de dado que será coletado.  

3. **CCA/UnB – Páginas de Professores**  
   🔗 [http://www.cca.unb.br/index.php/jose-marilson-martins-dantas](http://www.cca.unb.br/index.php/jose-marilson-martins-dantas)  
   - Site institucional da Faculdade de Ciências Contábeis e Atuariais da UnB.  
   - Estrutura simples, com dados básicos, áreas de pesquisa e contato.  
   - Demonstra uma forma de exibir informações de maneira objetiva.  

4. **Escavador**  
   🔗 [https://www.escavador.com/sobre/5283566/jose-marilson-martins-dantas](https://www.escavador.com/sobre/5283566/jose-marilson-martins-dantas)  
   - Plataforma que agrega informações públicas de múltiplas fontes.  
   - Apresenta publicações, processos e menções em um único perfil.  
   - Mostra a importância de **integrar dados externos** para enriquecer a experiência do usuário.  

5. **Pesquisar UnB – Portal de Pesquisadores**  
   🔗 [https://pesquisar.unb.br/professor/jose-marilson-martins-dantas](https://pesquisar.unb.br/professor/jose-marilson-martins-dantas)  
   - Focado em dados de **pesquisa e extensão**.  
   - Estrutura organizada em projetos, linhas de pesquisa e produção científica.  
   - Excelente fonte para mineração de informações acadêmicas.  

6. **Currículo Lattes – CNPq**  
   🔗 [Currículo Lattes – José Marilson Martins Dantas](https://buscatextual.cnpq.br/buscatextual/visualizacv.do;jsessionid=9155BC796D55F948BBFBD84BE90C9608.buscatextual_0)  
   - Repositório oficial de currículos de pesquisadores no Brasil.  
   - Contém informações completas: formação, produções científicas, prêmios e orientações.  
   - Será a **principal fonte de dados** para compor os perfis de docentes no projeto.  

---

## 📘 Aprendizados  

- **Estrutura de informação varia bastante**: enquanto o Lattes apresenta dados detalhados, os sites institucionais priorizam informações resumidas e objetivas.  
- **Integração é um diferencial**: o Escavador mostra como combinar múltiplas fontes em um único perfil, algo que pode ser replicado no nosso projeto.  
- **Fontes oficiais trazem credibilidade**: SIGAA e Pesquisar UnB oferecem dados confiáveis e bem estruturados, fundamentais para manter a seriedade do portal.  
- **Case aplicado**: o uso do exemplo do professor José Marilson Dantas foi importante para entender o fluxo de coleta de dados e a consistência (ou falta dela) entre diferentes plataformas.  
- **Necessidade de padronização**: como cada site apresenta os dados em formatos diferentes, será essencial definir uma estrutura única para exibir as informações no nosso site.  


📋 Próximos Passos  

- [ ] Definir **quais dados serão extraídos** de cada fonte (ex.: formação, disciplinas, projetos, publicações).  
- [ ] Estudar técnicas de **web scraping e APIs** para viabilizar a mineração.  
- [ ] Criar um **modelo de dados padronizado** para organizar as informações coletadas.  
- [ ] Prototipar a **estrutura dos perfis** no site, usando os exemplos pesquisados como inspiração.  
- [ ] Documentar o processo de coleta e integração para facilitar a implementação pelo time. 
