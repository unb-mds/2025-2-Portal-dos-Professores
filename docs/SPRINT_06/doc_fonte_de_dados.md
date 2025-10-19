# Mapeamento do Fluxo de Dados e Fontes Oficiais

Este documento detalha as fontes de dados primárias utilizadas para construir o perfil enriquecido dos docentes da UnB, o esquema de dados extraído de cada uma e a lógica de unificação para gerar o arquivo final `professors.json`.

---

## 1. Fontes de Dados

Cada professor é construído a partir da unificação de informações provenientes de três plataformas. A tabela a seguir resume a importância de cada fonte na montagem do perfil final.

| Fonte | Identificador Chave (ID) | Importância | Dados Principais Fornecidos |
| :--- | :--- | :--- | :--- |
| **SIGAA** | **SIAPE (Chave Primária)** | Crítica | Nome Oficial, Departamento, Vínculo, Foto (URL inicial). |
| **Plataforma Lattes** | ID do Currículo Lattes | Alta | Produção Bibliográfica, Projetos de Pesquisa, Orientações. |
| **Google Scholar** | ID de Perfil do Scholar | Média | Citações, Índice H, Publicações (para métricas). |

### 1.1. Fonte de Dados: SIGAA (Sistema Integrado de Gestão de Atividades Acadêmicas)

**Identificador:** **SIAPE**.
**Campos Coletados:**
* `siape` (chave primária do sistema)
* `nome_completo` (Nome oficial usado para unificação)
* `departamento`
* `foto_url`
* `pagina_sigaa_url`

**Limitações e Riscos:** O SIGAA é a fonte mais confiável para dados institucionais, mas pode não refletir as informações acadêmicas mais recentes do professor. O nome completo coletado aqui é a base para a busca nas outras plataformas.

### 1.2. Fonte de Dados: Plataforma Lattes (CNPq)

**Identificador:** ID do Currículo Lattes (URL pública).
**Campos Coletados:**
* `producao_bibliografica` (Lista de artigos, livros, etc.)
* `projetos_pesquisa` (Lista de projetos ativos e concluídos)
* `orientacoes` (Lista de orientações de mestrado/doutorado)
* `resumo_cv` (Resumo biográfico)

**Limitações e Riscos:** A estrutura do Lattes é complexa e varia. O *scraper* deve ser robusto para lidar com HTML complexo e mudanças de formato. A falha ao extrair dados de uma seção não deve impedir a coleta de outras.

### 1.3. Fonte de Dados: Google Scholar

**Identificador:** ID de Perfil do Scholar.
**Campos Coletados:**
* `citacoes_totais`
* `indice_h`
* `publicacoes_scholar` (Lista simplificada para contagem de métricas)

**Limitações e Riscos:** **Alto risco de bloqueio de IP.** O *scraper* deve ser lento e cauteloso, implementando *delays* e possíveis estratégias de *proxy*. A ausência de um perfil no Scholar não é crítica, mas a falha na coleta não deve interromper o pipeline.

---

## 2. Estratégia de Unificação de Dados

O objetivo da função `merge_data()` é criar um objeto unificado (`professors.json`) a partir das três fontes, utilizando o **SIAPE** como chave primária.

**Regra de Associação de Perfis:**
1.  **Chave Principal:** O registro do professor é iniciado com os dados do **SIGAA** (SIAPE e `nome_completo`).
2.  **Busca Secundária (Lattes/Scholar):** A busca por perfis correspondentes no Lattes e Scholar utiliza o `nome_completo` do SIGAA em uma lógica de *fuzzy match* ou pesquisa exata.
3.  **Prioridade de Conflito:** Caso haja dados sobrepostos (ex: um campo de descrição), os dados provenientes do **Lattes** têm maior prioridade do que o Scholar, e o **SIGAA** tem prioridade máxima para os dados institucionais (nome, departamento).

**Unificação de Campos (Exemplos no `professors.json`):**

| Campo no `professors.json` | Fonte(s) Principal(is) | Lógica de Unificação |
| :--- | :--- | :--- |
| `nome` | SIGAA | Nome final e oficial do professor. |
| `foto_url` | SIGAA | URL de foto institucional. |
| `publicacoes` | Lattes | Lista detalhada de produção bibliográfica. |
| `metricas_academicas` | Scholar | Citações e Índice H são aninhados neste objeto. |
| `resumo_cv` | Lattes | Resumo biográfico extraído do currículo Lattes. |

---
