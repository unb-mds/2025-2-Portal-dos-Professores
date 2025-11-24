import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { useProfessorData } from '../context/ProfessorContext';
import { Mail, Phone, MapPin } from 'lucide-react';
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
  Spinner,
  Tag,
} from "@chakra-ui/react";
import "../styles/ProfessorDetailPage.css";

const ProfessorDetailPage = () => {
  const toast = useToast();
  const navigate = useNavigate();
  
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
      <Box maxW="6xl" w="100%" mb={4} textAlign="left">
          <Button
              onClick={() => navigate(-1)}
              variant="ghost"
              colorScheme="blue"
              leftIcon="←"
              _hover={{ bg: 'blue.50' }}
              fontSize="md"
              fontWeight="medium"
              p={3}
          >
              Voltar
          </Button>
      </Box>
      <Box
        bg="white"
        p={8}
        borderRadius="xl"
        boxShadow="lg"
        maxW="6xl"
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
              <Heading as="h2" size="lg" mb={1}>
                  {professor.nome}
              </Heading>
              <Text color="gray.600" fontSize="md" mb={3}>
                  {professor.departamento}
              </Text>

              <Flex direction="column" gap={2} mb={4} align={{ base: "center", md: "flex-start" }}>
                  
                  {/* EMAIL (Botão com Link) */}
                  {professor.contatos?.email && (
                      <Button
                          leftIcon={<Mail size={16} />}
                          colorScheme="blue"
                          onClick={copiarEmail}
                          size="sm"
                          borderRadius="md"
                      >
                          Copiar E-mail
                      </Button>
                  )}

                  {/* CONTATOS SECUNDÁRIOS */}
                  <Flex gap={5} color="gray.600" fontSize="sm" mt={2} wrap="wrap" justify={{ base: "center", md: "flex-start" }}>
                      {professor.contatos?.sala && (
                          <Flex align="center">
                              <MapPin size={16} style={{ marginRight: '4px' }} />
                              <Text>Sala: {professor.contatos.sala}</Text>
                          </Flex>
                      )}
                      {professor.contatos?.telefone && professor.contatos.telefone.length > 5 && (
                          <Flex align="center">
                              <Phone size={16} style={{ marginRight: '4px' }} />
                              <Text>Telefone: {professor.contatos.telefone}</Text>
                          </Flex>
                      )}
                  </Flex>
              </Flex>
              
              {/* === Tags de Pesquisa (Áreas de Interesse) === */}
              <Flex wrap="wrap" mt={3} gap={2} justify={{ base: "center", md: "flex-start" }}>
                  {professor.dados_scholar?.areas_interesse?.map((area, index) => (
                      <Tag size="sm" key={index} colorScheme="gray" variant="subtle">
                          {area}
                      </Tag>
                  ))}
              </Flex>
          </Box>
        </Flex>  
{/* Bloco Superior de Tags de Pesquisa termina aqui */}

{/* === Abas de Conteúdo === */}
  <Box
    bg="white"
    p={8} 
    borderRadius="xl"
    boxShadow="lg"
    maxW="6xl" // Confirme o mesmo maxW que o superior
    w="100%"
    mt={6}>
    <Tabs variant="soft-rounded" colorScheme="gray"> {/* ✅ CONFIRMADO: soft-rounded e cor azul */}
        <TabList justifyContent="center">
            <Tab>Visão Geral</Tab>

            {/* ✅ NOVO: Contagem de Níveis de Formação (ex: 3 níveis: Graduação, Mestrado, Doutorado) */}
            <Tab>
                Formação ({Object.keys(professor.formacao_academica || {}).length})
            </Tab>

            {/* ✅ NOVO: Contagem de Projetos */}
            <Tab>
                Projetos ({professor.dados_lattes?.projetos_pesquisa?.length || 0})
            </Tab>
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
        </TabPanels>
    </Tabs>
  </Box>  
{/* === Fim das Abas de Conteúdo === */}

        <Box mt={8} p={6} border="1px solid" borderColor="gray.200" borderRadius="lg" boxShadow="sm">
            <Heading as="h3" size="md" mb={4}>
                Contato
            </Heading>
            
            {/* Conteúdo de Contato - Reutilizado do antigo TabPanel */}
            <Flex direction="column" gap={1} fontSize="sm">
                <Flex align="center">
                    {/* Usando o componente de ícone Mail para o Email */}
                    <Mail size={16} style={{ marginRight: '8px', color: 'gray.600' }} />
                    <Text>{professor.contatos?.email || 'Não informado'}</Text>
                </Flex>
                <Flex align="center">
                    <Phone size={16} style={{ marginRight: '8px', color: 'gray.600' }} />
                    <Text>Telefone: {professor.contatos?.telefone && professor.contatos.telefone.length > 5 ? professor.contatos.telefone : 'Não informado'}</Text>
                </Flex>
                <Flex align="center">
                    <MapPin size={16} style={{ marginRight: '8px', color: 'gray.600' }} />
                    <Text>Sala: {professor.contatos?.sala || 'Não informado'}</Text>
                </Flex>
            </Flex>
        </Box>
      </Box>
    </Flex>
  );
};

export default ProfessorDetailPage;