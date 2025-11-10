import React from "react";
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
} from "@chakra-ui/react";
import "../styles/ProfessorDetailPage.css";

const ProfessorDetailPage = () => {
  const toast = useToast();

  const professor = {
    nome: "Prof. André Barros de Sales",
    foto_url: "https://arquivos.unb.br/arquivos/2023105152024328179026b7493ed0e49/Foto_Andr.jpeg",
    cargo: "Professor Adjunto · Engenharia de Software",
    descricao_pessoal:
      "Professor com experiência em Engenharia de Software, Computação e Inovação Tecnológica. Apaixonado por desenvolvimento ágil, boas práticas de código e ensino aplicado à tecnologia.",
    formacao_academica: {
      "Graduação": ["Engenharia de Software — Universidade de Brasília (UnB)"],
      "Mestrado": ["Engenharia Elétrica — Universidade de São Paulo (USP)"],
      "Doutorado": ["Computação — Universidade de Brasília (UnB)"],
    },
    projetos: [
      {
        titulo: "Portal de Professores da UnB",
        periodo: "2024–2025",
        situacao: "Em andamento",
        natureza: "Desenvolvimento Web",
      },
      {
        titulo: "Sistema de Monitoramento Acadêmico",
        periodo: "2023",
        situacao: "Concluído",
        natureza: "Pesquisa aplicada",
      },
    ],
    contatos: {
      sala: "Bloco D, Sala 102",
      telefone: "(61) 3107-xxxx",
      email: "andre.sales@unb.br",
    },
  };

  const copiarEmail = () => {
    navigator.clipboard.writeText(professor.contatos.email);
    toast({
      title: "E-mail copiado! 📧",
      description: "O endereço de e-mail foi copiado para sua área de transferência.",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

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
              {professor.cargo}
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

        <Tabs variant="enclosed" mt={10}>
          <TabList>
            <Tab>Visão Geral</Tab>
            <Tab>Formação</Tab>
            <Tab>Projetos</Tab>
            <Tab>Contatos</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
                {/* REMOVIDO: <Box bg="white" p={5} borderRadius="md" boxShadow="md"> */}
                <Text>{professor.descricao_pessoal}</Text>
                {/* REMOVIDO: </Box> */}
            </TabPanel>

            <TabPanel>
                {/* REMOVIDO: <Box bg="white" p={5} borderRadius="md" boxShadow="md"> */}
                {Object.entries(professor.formacao_academica).map(
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
                {/* REMOVIDO: </Box> */}
            </TabPanel>

            <TabPanel>
                {/* REMOVIDO: <Box bg="white" p={5} borderRadius="md" boxShadow="md"> */}
                {professor.projetos.map((projeto, index) => (
                  <Box key={index} mb={4}>
                    <Text fontWeight="bold">{projeto.titulo}</Text>
                    <Text fontSize="sm">
                      {projeto.periodo} — {projeto.situacao} (
                      {projeto.natureza})
                    </Text>
                  </Box>
                ))}
                {/* REMOVIDO: </Box> */}
            </TabPanel>

            <TabPanel>
                {/* REMOVIDO: <Box bg="white" p={5} borderRadius="md" boxShadow="md"> */}
                <Text>
                  <strong>Sala:</strong> {professor.contatos.sala}
                </Text>
                <Text>
                  <strong>Telefone:</strong> {professor.contatos.telefone}
                </Text>
                <Text>
                  <strong>Email:</strong> {professor.contatos.email}
                </Text>
                {/* REMOVIDO: </Box> */}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Flex>
  );
};

export default ProfessorDetailPage;