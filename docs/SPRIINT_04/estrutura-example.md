{
  "professores": [
    {
      "id_professor": 1,
      "nome_completo": "João da Silva",
      "email_institucional": "joao.silva@unb.br",
      "telefone": "(61) 99999-9999",
      "matricula": "241012356",
      "departamento": "Engenharia de Software",
      "area_de_atuacao": ["Engenharia de Requisitos", "Desenvolvimento Web"],
      "titulacao": "Doutor",
      "curriculo_lattes": "https://lattes.cnpq.br/1234567890123456",
      "foto": "https://unb.br/fotos/joao_silva.png"
    }
  ],

  "disciplinas": [
    {
      "id_disciplina": 101,
      "codigo": "FGA0071",
      "nome": "Prática de Eletrônica Digital 1",
      "ementa": "Introdução à eletrônica digital, contadores, flip-flops e aplicações.",
      "carga_horaria": 60,
      "modalidade": "Presencial",
      "semestre_oferta": "2025-2",
      "professores_responsaveis": [1]
    }
  ],

  "cursos": [
    {
      "id_curso": 501,
      "nome": "Engenharia de Software",
      "codigo_curso": "ENGSOFT",
      "coordenador": 1,
      "disciplinas_ofertadas": [101]
    }
  ],

  "turmas": [
    {
      "id_turma": 9001,
      "disciplina": 101,
      "professor": 1,
      "semestre": "2025-2",
      "horarios": [
        {"dia": "Terça-feira", "horario": "14:00 - 16:00"},
        {"dia": "Quinta-feira", "horario": "14:00 - 16:00"}
      ],
      "sala": "FGA-101",
      "alunos_matriculados": [3001, 3002, 3003]
    }
  ]
}
