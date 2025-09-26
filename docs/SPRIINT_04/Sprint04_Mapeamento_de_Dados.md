# Mapeamento de Dados – Portal dos Professores  

## Professores
- `id_professor` (número único identificador)  
- `nome_completo`  
- `email_institucional`  
- `telefone` (opcional)  
- `matrícula` (ou matrícula interna)  
- `departamento` (ex: Engenharia de Software, Matemática)  
- `área_de_atuacao` (palavras-chave / tags)  
- `titulacao` (ex: Mestre, Doutor)  
- `curriculo_lattes` (link → [Plataforma Lattes](https://lattes.cnpq.br/)) )  
- `foto` (URL da imagem)  

---

## Disciplinas
- `id_disciplina`  
- `codigo` (ex: FGA0071)  
- `nome` (ex: Prática de Eletrônica Digital 1)  
- `ementa` (descrição resumida)  
- `carga_horaria`  
- `modalidade` (presencial, híbrida, EAD)  
- `semestre_oferta` (ex: 2025-2)  
- `professores_responsaveis` (lista de `id_professor`)  

---

## Cursos
- `id_curso`  
- `nome` (ex: Engenharia de Software)  
- `codigo_curso` (opcional)  
- `coordenador` (`id_professor`)  
- `disciplinas_ofertadas` (lista de `id_disciplina`)  

---

## Turmas
- `id_turma`  
- `disciplina` (`id_disciplina`)  
- `professor` (`id_professor`)  
- `semestre` (ex: 2025-2)  
- `horarios` (lista com dias e horários)  

