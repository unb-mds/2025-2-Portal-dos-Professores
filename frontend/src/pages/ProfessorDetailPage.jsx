import React from 'react';
import { Box, Container, Heading, Text, Image, Link, Tag, List, ListItem } from '@chakra-ui/react';

// ==================================================================
// DADOS DE EXEMPLO (MOCK DATA) QUE O CAIO passou no grupo
// ==================================================================
const mockProfessorData = {
  "nome": "ANDRE BARROS DE SALES",
  "departamento": "CAMPUS UNB GAMA: FACULDADE DE CIÊNCIAS E TECNOLOGIAS EM ENGENHARIA - BRASÍLIA",
  "foto_url": "https://arquivos.unb.br/arquivos/2023105152024328179026b7493ed0e49/Foto_Andr.jpeg",
  "pagina_sigaa_url": "https://sigaa.unb.br/sigaa/public/docente/portal.jsf?siape=1314342",
  "descricao_pessoal": "Professor do curso de Engenharia de Software na Faculdade do Gama da Universidade de Brasília.",
  "lattes_url": "http://lattes.cnpq.br/7610669796869668",
  "formacao_academica": {
      "GRADUAÇÃO": [
          "1990 - 1993: Curso Sup. em Tecnologia em Processamento de Dados\nInstituto Unificado de Ensino Superior Objetivo",
          "1998 - 2007: Ciência da Computação\nPontifícia Universidade Católica de Goiás"
      ],
      "MESTRADO": [
          "1999 - 2000: Ciências da Computação\nUniversidade Federal de Santa Catarina"
      ]
  },
  "contatos": {
      "sala": "20",
      "telefone": "8946",
      "email": "não informado"
  },
  "dados_lattes": {
      "resumo_cv": null,
      "projetos_pesquisa": [
          {
              "titulo": "Realidade Estendida como Tecnologia Educacional para Programação de Computador",
              "ano_periodo": "2022 - Atual",
              "situacao": "Em andamento",
              "natureza": "Pesquisa"
          }
      ]
  },
  "dados_scholar": {
      "scholar_id": "OxY9qbQAAAAJ",
      "scholar_url": "https://scholar.google.com/citations?user=OxY9qbQAAAAJ"
  }
};
// ==================================================================


const ProfessorDetailPage = () => {
  return (
    <Box>
      {/* 2. Conteúdo Principal da Página */}
      <Container maxW="container.lg" py={10}>
        
        {/* Bloco de Identificação */}
        <Box mb={10}>
          <Image
            borderRadius="full"
            boxSize="150px"
            src={mockProfessorData.foto_url}
            alt={mockProfessorData.nome}
            mb={4}
          />
          <Heading as="h1" size="xl" mb={2}>
            {mockProfessorData.nome}
          </Heading>
          <Text fontSize="lg" color="gray.600">
            {mockProfessorData.departamento}
          </Text>
          <Link href={mockProfessorData.lattes_url} isExternal color="blue.500" mt={2} display="block">
            Ver Currículo Lattes
          </Link>
        </Box>

        {/* Bloco de Projetos de Pesquisa */}
        <Box mb={10}>
          <Heading as="h2" size="lg" mb={4}>
            Projetos de Pesquisa
          </Heading>
          <List spacing={3}>
            {mockProfessorData.dados_lattes.projetos_pesquisa.map((projeto) => (
              <ListItem key={projeto.titulo}>
                <Text fontWeight="bold">{projeto.titulo}</Text>
                <Text fontSize="sm">{projeto.ano_periodo} - {projeto.situacao}</Text>
              </ListItem>
            ))}
          </List>
        </Box>

      </Container>
      
    </Box>
  );
};

export default ProfessorDetailPage;