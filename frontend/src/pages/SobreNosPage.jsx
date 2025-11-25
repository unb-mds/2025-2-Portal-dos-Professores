import React from "react";
import {
  Box,
  Heading,
  Text,
  Stack,
  Link,
  VStack,
  HStack,
  Divider,
  Flex,
  Icon,
  Avatar,
} from "@chakra-ui/react";
import { FaGithub } from "react-icons/fa";

const getUsername = (link) => {
  try {
    const url = new URL(link);
    return url.pathname.split('/').pop();
  } catch (e) {
    return '';
  }
};

const participantesData = [
  { id: 1, nome: "Caio Lacerda", link: "https://github.com/caiolacerdamt" },
  { id: 2, nome: "Ian Pedersoli", link: "https://github.com/ianpedersoli" },
  { id: 3, nome: "Arthur Scartezini", link: "https://github.com/Ascartezin" },
  { id: 4, nome: "Paulo Sérgio", link: "https://github.com/Paulosrsr" },
  { id: 5, nome: "Kaio Amoury", link: "https://github.com/KaioAmouryUnB" },
  { id: 6, nome: "Bruno Augusto", link: "https://github.com/brunodantas9" },
];

const SobreNosPage = () => {
  return (
    <Box maxW="5xl" mx="auto" px={{ base: 6, md: 10 }} py={16}>
      <VStack spacing={12} align="stretch">
        
        {/* TÍTULO PRINCIPAL */}
        <Heading 
          as="h1" 
          size={{ base: '2xl', md: '3xl' }}
          color="blue.800" 
          fontWeight="bold" 
          borderBottom="4px solid" 
          borderColor="blue.500" 
          pb={4}
          textAlign="center"
          letterSpacing="tight"
        >
          Quem somos?
        </Heading>

        {/* BLOCO DE TEXTO  */}
        <Stack spacing={6} fontSize={{ base: "md", md: "lg" }} color="gray.600">
          <Text>
            O Hub Docente UnB é um projeto acadêmico idealizado e desenvolvido
            por estudantes de Engenharia de Software da Universidade de Brasília,
            no âmbito da disciplina de Métodos de Desenvolvimento de Software.
          </Text>
          <Text>
            Nossa motivação nasceu de uma experiência comum a muitos alunos: a
            dificuldade em encontrar informações consolidadas sobre o corpo docente.
            A busca por um orientador ou a simples curiosidade sobre a linha de pesquisa
            de um professor frequentemente se transforma em uma jornada fragmentada
            entre diversas plataformas.
          </Text>
          <Text>
            Para resolver esse problema, criamos uma plataforma que centraliza esses dados.
            Utilizando web scraping de fontes públicas, o Hub Docente organiza e apresenta
            os perfis acadêmicos de forma intuitiva, com o objetivo de fortalecer a conexão
            entre alunos e professores.
          </Text>
          <Text pt={4} fontWeight="semibold">
            Conheça abaixo a equipe responsável por dar vida a este projeto. Para
            os interessados nos detalhes técnicos, o código fonte está inteiramente
            disponível em nosso repositório no GitHub.
          </Text>
        </Stack>

        <Divider borderColor="gray.300" />

        {/* EQUIPE DE DESENVOLVIMENTO */}
        <VStack align="stretch" spacing={6}>
          <Heading as="h2" size={{ base: 'xl', md: '2xl' }} color="blue.700" fontWeight="bold" textAlign="center" letterSpacing="tight">
            Equipe de Desenvolvimento 
          </Heading>
          
          {}
          <Flex 
            wrap="wrap" 
            gap={6} 
            justify="center" 
          >
            {participantesData.map((pessoa) => {
              const username = getUsername(pessoa.link);
              const avatarUrl = `https://github.com/${username}.png?size=200`;

              return (
                <Box 
                  key={pessoa.id} 
                  p={4} 
                  w={{ base: "250px", md: "250px" }} 
                  h="110px" 
                  borderWidth="1px" 
                  borderRadius="lg" 
                  boxShadow="md" 
                  bg="white"
                  minW={{ base: "100%", sm: "220px" }}
                  transition="all 0.2s"
                  _hover={{ borderColor: "blue.500", boxShadow: "xl" }}
                >
                  <HStack spacing={4} align="center">
                    
                    {/* AVATAR DO GITHUB */}
                    <Avatar 
                      size="lg" 
                      name={pessoa.nome} 
                      src={avatarUrl} 
                      bg="gray.100"
                      color="blue.500"
                      onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(pessoa.nome)}&background=random&color=fff`; }} 
                    />
                    
                    {/* Informações do Desenvolvedor */}
                    <VStack align="flex-start" spacing={1}>
                      <Text fontWeight="bold" color="gray.800" fontSize={{ base: 'md', md: 'lg' }}>
                        {pessoa.nome}
                      </Text>
                      <Link
                        href={pessoa.link}
                        isExternal
                        fontSize="sm"
                        color="blue.500"
                        _hover={{ textDecoration: "underline", color: "blue.700" }}
                      >
                        <HStack spacing={1} align="center">
                          <Icon as={FaGithub} />
                          <Text isTruncated maxW="150px">{username}</Text>
                        </HStack>
                      </Link>
                    </VStack>
                  </HStack>
                </Box>
              );
            })}
          </Flex>
        </VStack>

        <Divider borderColor="gray.300" />

        {/* CÓDIGO-FONTE */}
        <VStack align="stretch" spacing={4}>
          <Heading as="h2" size={{ base: 'xl', md: '2xl' }} color="blue.700" fontWeight="bold" textAlign="center" letterSpacing="tight">
            Código-fonte 
          </Heading>
          <Box 
            p={6} 
            bg="blue.50" 
            borderRadius="md" 
            borderLeft="6px solid" 
            borderColor="blue.500"
            textAlign="center" 
          >
            <Text mb={3} color="gray.600" fontSize={{ base: 'md', md: 'lg' }}>
              Acesse o repositório completo no GitHub com documentação de setup,
              arquitetura e trilha de contribuição.
            </Text>
            <Link
              href="https://github.com/unb-mds/2025-2-Portal-dos-Professores"
              isExternal
              fontWeight="bold"
              fontSize={{ base: 'md', md: 'lg' }}
              color="blue.700"
              _hover={{ textDecoration: "underline", color: "blue.900" }}
            >
              <HStack spacing={2} align="center" justify="center"> {/* ÍCONE DO GITHUB */}
                <Icon as={FaGithub} w={6} h={6} />
                <Text>github.com/unb-mds/2025-2-Portal-dos-Professores</Text>
              </HStack>
            </Link>
          </Box>
        </VStack>

      </VStack>
    </Box>
  );
};

export default SobreNosPage;