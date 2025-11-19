import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { useProfessorData } from '../context/ProfessorContext'; // ✅ Contexto Global
import {
  Box,
  Flex,
  Image,
  Heading,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Button,
  useToast,
  Spinner, // Adicionado para o estado de loading
} from "@chakra-ui/react";
import "../styles/ProfessorDetailPage.css";

const ProfessorDetailPage = () => {
  const toast = useToast();
  
  // 1. ACESSO AOS DADOS DO CONTEXTO (Substitui os useStates e useEffect)
  const { professorsList, isLoading, error } = useProfessorData(); 
  
  // 2. PEGA O ID DA URL
  const { id } = useParams();

  // 3. ENCONTRA O PROFESSOR NA LISTA JÁ BAIXADA
  // Se estiver carregando globalmente, o professor será 'null'.
  let professor = null; 
  
  if (!isLoading && professorsList.length > 0) {
    // Procura na lista pelo ID que está na URL
    professor = professorsList.find(p => p.pagina_sigaa_url && p.pagina_sigaa_url.includes(id));
  }

  // 4. Lógica de Erro / Carregamento (Interrompe a renderização JSX)
  if (isLoading) {
    return (
      <Flex direction="column" align="center" p={10} minH="100vh">
        <Box bg="white" p={8} borderRadius="xl" boxShadow="lg" maxW="900px" w="100%" textAlign="center">
          <Spinner size="xl" mb={4} color="blue.500" />
          <Heading size="lg">Carregando dados globais...</Heading>
        </Box>
      </Flex>
    );
  }

  if (error || !professor) {
    return (
      <Flex direction="column" align="center" p={10} minH="100vh">
        <Box bg="white" p={8} borderRadius="xl" boxShadow="lg" maxW="900px" w="100%" textAlign="center">
          <Heading color="red.500" size="lg" mb={4}>❌ Erro ao Carregar Perfil</Heading>
          <Text>O professor com ID "{id}" não foi encontrado na base de dados.</Text>
        </Box>
      </Flex>
    );
  }
  
  // 5. Função de Copiar E-mail (USA O OBJETO 'professor' vindo do Contexto)
  const copiarEmail = () => {
    // Adicionando encadeamento opcional para evitar quebra se 'contatos' for null
    if (professor?.contatos?.email) {
      navigator.clipboard.writeText(professor.contatos.email);
      toast({
        title: "E-mail copiado! 📧",
        description: "O endereço de e-mail foi copiado para sua área de transferência.",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    }
  };
  
  // 6. RENDERIZAÇÃO PRINCIPAL (JSX)
  return (
    <Flex direction="column" align="center" p={10} bg="#f9fafb" minH="100vh">
      <Box
        bg="white"
        p={8}
        borderRadius="xl"
        boxShadow="lg"
        maxW="900px"
        w="100%"
      >
        {/* === Bloco Superior de Identificação (Foto, Nome) === */}
        <Flex direction={{ base: "column", md: "row" }} align="center">
          <Image
            borderRadius="full"
            boxSize="200px"
            src={professor.foto_url}
            alt={professor.nome}
            mr={{ md: 8 }}
            mb={{ base: 6, md: 0 }}
          />
          <Box textAlign={{ base: "center", md: "left" }}>
            <Heading as="h2" size="lg">
              {professor.nome}
            </Heading>
            <Text color="gray.600" fontSize="md">
              {/* CORRIGIDO: MUDOU DE professor.cargo (MOCK) PARA professor.departamento (API) */}
              {professor.departamento}
            </Text>

            <Button
              mt={4}
              colorScheme="blue"
              onClick={copiarEmail}
              size="sm"
              borderRadius="md"
            >
              Copiar e-mail
            </Button>
          </Box>
        </Flex>

        {/* === Abas de Conteúdo === */}
        <Tabs variant="enclosed" mt={10}>
          <TabList>
            <Tab>Visão Geral</Tab>
            <Tab>Formação</Tab>
            <Tab>Projetos</Tab>
            <Tab>Contatos</Tab>
          </TabList>

          <TabPanels>
            {/* ABA: Visão Geral */}
            <TabPanel>
              {/* Usando o resumo do Lattes, senão a descrição pessoal. */}
              <Text>
                {professor.dados_lattes?.resumo_cv || professor.descricao_pessoal || "Nenhuma descrição detalhada disponível."}
              </Text>
            </TabPanel>

            {/* ABA: Formação */}
            <TabPanel>
              {/* Mapeia a formação acadêmica (ex: GRADUAÇÃO, MESTRADO) */}
              {Object.entries(professor.formacao_academica || {}).map(
                ([nivel, cursos]) => (
                  <Box key={nivel} mb={5}>
                    <Heading as="h3" size="sm" mb={2} color="blue.600">
                      {nivel}
                    </Heading>
                    <ul>
                      {cursos.map((curso, index) => (
                        <li key={index}>
                          <Text fontSize="sm">{curso}</Text>
                        </li>
                      ))}
                    </ul>
                  </Box>
                )
              )}
            </TabPanel>

            {/* ABA: Projetos */}
            <TabPanel>
              {/* CORRIGIDO: O mapeamento de projetos agora usa o caminho correto da API: dados_lattes.projetos_pesquisa */}
              {professor.dados_lattes?.projetos_pesquisa?.length ? (
                professor.dados_lattes.projetos_pesquisa.map((projeto, index) => (
                  <Box key={index} mb={4}>
                    <Text fontWeight="bold">{projeto.titulo}</Text>
                    <Text fontSize="sm">
                      {projeto.ano_periodo} — {projeto.situacao} ({projeto.natureza})
                    </Text>
                    {projeto.integrantes && <Text fontSize="xs" color="gray.500">Integrantes: {projeto.integrantes}</Text>}
                  </Box>
                ))
              ) : (
                <Text>Nenhum projeto de pesquisa encontrado no Lattes.</Text>
              )}
            </TabPanel>

            {/* ABA: Contatos */}
            <TabPanel>
              {/* Usando encadeamento opcional (?) para evitar quebras se o contato for null */}
              <Text>
                <strong>Sala:</strong> {professor.contatos?.sala || 'Não informado'}
              </Text>
              <Text>
                <strong>Telefone:</strong> {professor.contatos?.telefone || 'Não informado'}
              </Text>
              <Text>
                <strong>Email:</strong> {professor.contatos?.email || 'Não informado'}
              </Text>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Flex>
  );
};

export default ProfessorDetailPage;