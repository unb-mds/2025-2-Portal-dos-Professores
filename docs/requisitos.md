# 📖 Requisitos do Sistema

Esta página documenta os requisitos funcionais e não funcionais definidos até o momento.  
Os itens marcados como *[em definição]* ainda estão em aberto para futura especificação.

---

## 📑 Índice

- [Requisitos Funcionais](#requisitos-funcionais)
- [Requisitos Não Funcionais](#requisitos-não-funcionais)

---

## ✅ Requisitos Funcionais

| ID     | Descrição                                                                 |
|--------|---------------------------------------------------------------------------|
| RF001  | O sistema deve exibir uma lista de professores com busca por nome, área de atuação e unidade acadêmica. |
| RF002  | O sistema deve ter uma página index com um looping de menu para acessar as diferentes funcionalidades. |
| RF003  | O sistema deve ser capaz de minerar dados de outros sites já existentes de exibição do corpo docente da UnB. |
| RF004  | O sistema deve permitir a visualização da linha do tempo de disciplinas ministradas ao longo dos períodos letivos. |
| RF005  |O sistema deve exportar e compartilhar o perfil do professor (PDF e link público temporário), incluindo bio, áreas, últimas publicações e disciplinas ministradas.                                                        |
| RF006  | O sistema deve exibir um painel de informações resumidas do professor (mini-card) com foto, nome, unidade, área principal e link para o perfil completo.                                                         |
| RF007  | O sistema deve permitir a filtragem de professores por ano da última publicação. |
| RF008  | O sistema deve indicar a data da última atualização dos dados do professor. |
| RF009  | O sistema deve permitir reportar inconsistências no perfil (ex.: nome, afiliação, publicações), gerando ticket com status e histórico para moderação.                                                         |

---

## 📜 Requisitos Não Funcionais (Exemplo)

### 🔧 Desempenho
- Responder a requisições em até **4 segundos** em 95% dos casos.  
- Suportar **centenas de acessos simultâneos**.  

### 🔒 Segurança
- Autenticação segura via **OAuth 2.0**.  
- Dados sensíveis criptografados.  
- Conexões restritas a **HTTPS**.  

### 📈 Escalabilidade
- Arquitetura preparada para aumento de carga  sem reestruturação.  
- Suporte à integração de novos módulos sem impacto no núcleo.  

### 🎨 Usabilidade
- Interface **responsiva** (desktop, tablet, mobile).  
- Disponibilidade em **português e inglês**.  
- Interface intuitiva com foco em clareza e organização.

---

📌 **Observação:** Esta lista será atualizada à medida que novos requisitos forem definidos.
