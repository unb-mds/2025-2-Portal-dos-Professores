import React from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { useProfessorData } from '../context/ProfessorContext';
import { Mail, Phone, MapPin, BookOpen, ArrowLeft } from 'lucide-react';
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
    VStack,
    HStack,
    Divider,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
} from "@chakra-ui/react";

// =================================================================
// FUNÇÕES AUXILIARES
// =================================================================

const MissingDataPlaceholder = ({ title, description, label }) => {
    if (label) {
        return (
            <Text color="gray.500" fontStyle="italic" fontSize={{ base: 'sm', md: 'md' }} py={2}>
                {label ? `Nenhum(a) ${label} detalhado(a) disponível.` : "Nenhum dado detalhado disponível."}
            </Text>
        );
    }
    
    return (
        <Alert
            status='info'
            variant='left-accent'
            flexDirection='column'
            alignItems='center'
            justifyContent='center'
            textAlign='center'
            borderRadius='md'
            py={8}
            bg='blue.50'
        >
            <AlertIcon boxSize='24px' mr={0} color="blue.500" />
            <AlertTitle mt={4} mb={1} fontSize={{ base: 'md', md: 'lg' }} fontWeight="bold" color="blue.700">
                {title || "Dados Pessoais Não Encontrados"}
            </AlertTitle>
            <AlertDescription maxWidth='sm' color="blue.700" fontSize={{ base: 'sm', md: 'md' }}>
                {description || "O resumo pessoal ou o currículo lattes minerado para este professor não foi encontrado em nossa base de dados."}
            </AlertDescription>
        </Alert>
    );
};

// FUNÇÃO: Componente de Exibição de Projeto
const ProjectItem = ({ projeto }) => (
    <Box p={4} borderLeft="4px solid" borderColor="blue.400" bg="gray.50" mb={4} borderRadius="lg">
        <Text fontWeight="bold" fontSize={{ base: 'md', md: 'lg' }} color="gray.800">{projeto.titulo}</Text>
        <Text fontSize={{ base: 'sm', md: 'md' }} color="gray.600" mt={1}>
            {projeto.ano_periodo} — {projeto.situacao} ({projeto.natureza})
        </Text>
        {projeto.integrantes && (
            <Text fontSize={{ base: 'xs', md: 'sm' }} color="gray.500" mt={1} noOfLines={1} textOverflow="ellipsis">
                Integrantes: {projeto.integrantes}
            </Text>
        )}
    </Box>
);

// FUNÇÃO: Componente de Exibição de Formação
const FormacaoItem = ({ nivel, cursos }) => (
    <Box mb={6}>
        <HStack mb={2} spacing={2} align="center">
            <Box w="8px" h="8px" bg="blue.500" borderRadius="full" />
            <Heading as="h4" size={{ base: 'sm', md: 'md' }} color="blue.700" textTransform="uppercase" fontWeight="bold" letterSpacing="tight">
                {nivel}
            </Heading>
        </HStack>
        <VStack align="start" spacing={1} pl={4} borderLeft="2px solid" borderColor="gray.200">
            {cursos.map((curso, index) => (
                <Text key={index} fontSize={{ base: 'sm', md: 'md' }} color="gray.600">
                    • {curso}
                </Text>
            ))}
        </VStack>
    </Box>
);

/**
 * função: Extrai a atividade de ensino mais recente, filtrando atividades genéricas/programáticas.
 * @param {object} professor - O objeto completo do professor.
 * @returns {string | null} A descrição da última atividade de ensino formatada ou null.
 */
const getUltimaDisciplina = (professor) => {
    if (!professor?.dados_lattes?.atuacao_profissional) {
        return null;
    }

    let ultimaAtividadeEnsino = null;
    let ultimoAnoRecente = 0; 

    professor.dados_lattes.atuacao_profissional.forEach(atuacao => {
        atuacao.atividades?.forEach(atividade => {
            const detalhes = atividade.detalhes?.toLowerCase() || '';
            const periodo = atividade.periodo || '';

            if (!detalhes.includes('ensino')) {
                return;
            }

            const isProgramActivity = 
                detalhes.includes('mestrado em') || 
                detalhes.includes('decanato') || 
                detalhes.includes('direção') ||
                detalhes.includes('coordenação') ||
                detalhes.includes('programa de');
            
            if (isProgramActivity) {
                return; 
            }
            
            // 3. Lógica de Recência (Prioriza o ano de FIM ou "Atual")
            let recencyScore = 0;
            
            if (periodo.toLowerCase().includes('atual')) {
                recencyScore = 3000;
            } else {
                // Tenta encontrar todos os anos de 4 dígitos (Start e End)
                const anos = periodo.match(/\d{4}/g) || [];
                
                if (anos.length > 0) {
                    // Usa o último ano encontrado (o ano de FIM/conclusão)
                    recencyScore = parseInt(anos[anos.length - 1]);
                }
            }
            
            // 4. Compara e atualiza
            if (recencyScore > ultimoAnoRecente) {
                ultimoAnoRecente = recencyScore;
                ultimaAtividadeEnsino = {
                    detalhes: atividade.detalhes,
                    periodo: atividade.periodo
                };
            }
        });
    });

    // Retorna a string formatada ou null
    if (ultimaAtividadeEnsino) {
        return `${ultimaAtividadeEnsino.detalhes} (${ultimaAtividadeEnsino.periodo})`;
    }
    
    return null;
};

// =================================================================
// COMPONENTE PRINCIPAL
// =================================================================
const ProfessorDetailPage = () => {
    const toast = useToast();
    const navigate = useNavigate();

    const { professorsList, isLoading, error } = useProfessorData();
    const { id } = useParams();

    let professor = null;

    if (!isLoading && professorsList.length > 0) {
        professor = professorsList.find(p => p.pagina_sigaa_url && p.pagina_sigaa_url.includes(id));
    }

    // Lógica de Erro / Carregamento
    if (isLoading) {
        return (
            <Flex justify="center" align="center" minH="100vh" bg="#f9fafb" p={6}>
                <VStack spacing={4} bg="white" p={10} borderRadius="xl" boxShadow="lg" maxW="900px" w="100%">
                    <Spinner size="xl" color="blue.500" />
                    <Heading as="h1" size={{ base: '2xl', md: '3xl' }} color="blue.800" fontWeight="bold" letterSpacing="tight">Carregando dados globais...</Heading>
                </VStack>
            </Flex>
        );
    }

    if (error || !professor) {
        return (
            <Flex justify="center" align="center" minH="100vh" bg="#f9fafb" p={6}>
                <VStack spacing={4} bg="white" p={10} borderRadius="xl" boxShadow="lg" maxW="900px" w="100%">
                    <Heading as="h1" color="red.500" size={{ base: '2xl', md: '3xl' }} fontWeight="bold" letterSpacing="tight">❌ Erro ao Carregar Perfil</Heading>
                    <Text color="gray.600" fontSize={{ base: 'md', md: 'lg' }}>O professor não foi encontrado ou houve um erro na comunicação com a API.</Text>
                    <Button onClick={() => navigate(-1)} colorScheme="blue">Voltar</Button>
                </VStack>
            </Flex>
        );
    }

    // Função de Copiar E-mail
    const copiarEmail = () => {
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

    const hasProjects = professor.dados_lattes?.projetos_pesquisa?.length > 0;
    const hasFormacao = Object.keys(professor.formacao_academica || {}).length > 0;
    
    const ultimaDisciplina = getUltimaDisciplina(professor);


    // =================================================================
    // RENDERIZAÇÃO PRINCIPAL (JSX)
    // =================================================================
    return (
        <Flex direction="column" align="center" p={{ base: 4, md: 10 }} bg="#f9fafb" minH="100vh">
            {/* Botão Voltar */}
            <Box maxW="1200px" w="100%" mb={4} textAlign="left">
                <Button
                    onClick={() => navigate(-1)}
                    variant="ghost"
                    colorScheme="blue"
                    leftIcon={<ArrowLeft size={18} />}
                    _hover={{ bg: 'blue.50' }}
                    fontSize={{ base: 'sm', md: 'md' }}
                    fontWeight="medium"
                    p={3}
                >
                    Voltar
                </Button>
            </Box>

            {/* === Bloco Principal do Perfil === */}
            <Box
                bg="white"
                p={{ base: 6, md: 8 }}
                borderRadius="xl"
                boxShadow="xl"
                maxW="1200px" 
                w="100%"
            >
                {/* === Bloco Superior de Identificação (Foto, Nome, Tags) === */}
                <Flex direction={{ base: "column", md: "row" }} align={{ base: "center", md: "flex-start" }}>
                    <Image
                        borderRadius="full"
                        boxSize={{ base: "150px", md: "180px" }}
                        src={professor.foto_url}
                        alt={professor.nome}
                        mr={{ md: 8 }}
                        mb={{ base: 6, md: 0 }}
                        objectFit="cover"
                        fallbackSrc="https://via.placeholder.com/180/E2E8F0/A0AEC0?text=Foto"
                    />
                    <Box textAlign={{ base: "center", md: "left" }} w="100%">
                        <Heading as="h2" size={{ base: 'xl', md: '2xl' }} mb={1} color="blue.800" fontWeight="bold" letterSpacing="tight">
                            {professor.nome}
                        </Heading>
                        {/* Departamento */}
                        <Text color="gray.600" fontSize={{ base: 'md', md: 'lg' }} mb={4} fontWeight="medium">
                            {professor.departamento}
                        </Text>
                        
                        {/* Botões de Ação */}
                        <HStack spacing={4} mb={4} justify={{ base: "center", md: "flex-start" }}>
                            {professor.contatos?.email && (
                                <Button
                                    leftIcon={<Mail size={18} />}
                                    colorScheme="blue"
                                    onClick={copiarEmail}
                                    size="md" 
                                    borderRadius="md"
                                    fontWeight="semibold"
                                >
                                    Copiar E-mail
                                </Button>
                            )}
                            {professor.dados_lattes?.lattes_url && ( 
                                <Button
                                    as="a"
                                    href={professor.dados_lattes.lattes_url || professor.lattes_url}
                                    target="_blank"
                                    variant="outline"
                                    colorScheme="gray"
                                    size="md" 
                                    borderRadius="md"
                                    fontWeight="semibold"
                                >
                                    Lattes
                                </Button>
                            )}
                        </HStack>

                        {/* BLOCO: Sala e Telefone */}
                        <Flex 
                            gap={{ base: 3, md: 6 }} 
                            mt={4} 
                            mb={6} 
                            fontSize={{ base: 'sm', md: 'md' }}
                            color="gray.600" 
                            wrap="wrap"
                            justify={{ base: "center", md: "flex-start" }}
                        >
                            {/* Sala/Location (e.g., ICC Norte, Sala 315) */}
                            {professor.contatos?.sala && professor.contatos.sala.toLowerCase() !== 'não informado' && (
                                <HStack spacing={1} title="Localização">
                                    <MapPin size={18} style={{ color: 'var(--chakra-colors-gray-500)' }} />
                                    <Text>{professor.contatos.sala}</Text>
                                </HStack>
                            )}

                            {/* Telefone (e.g., (61) 3107-0910) */}
                            {professor.contatos?.telefone && professor.contatos.telefone.length > 5 && (
                                <HStack spacing={1} title="Telefone">
                                    <Phone size={18} style={{ color: 'var(--chakra-colors-gray-500)' }} />
                                    <Text>{professor.contatos.telefone}</Text>
                                </HStack>
                            )}
                        </Flex>

                        {/* === Tags de Pesquisa (Áreas de Interesse) === */}
                        {professor.dados_scholar?.areas_interesse?.length > 0 && (
                            <Flex wrap="wrap" mt={3} gap={2} justify={{ base: "center", md: "flex-start" }}>
                                {professor.dados_scholar.areas_interesse.map((area, index) => (
                                    <Tag size="md" key={index} colorScheme="gray" variant="solid" bg="gray.100" color="gray.700" borderRadius="full">
                                        {area}
                                    </Tag>
                                ))}
                            </Flex>
                        )}
                    </Box>
                </Flex>

                <Divider mt={8} mb={6} />

                {/* === Abas de Conteúdo === */}
                <Tabs 
                    isFitted 
                    variant="enclosed" 
                    colorScheme="blue" 
                    sx={{
                        '.chakra-tabs__tab': {
                            fontWeight: 'semibold',
                            color: 'gray.600',
                            border: 'none',
                            _selected: {
                                color: 'blue.600',
                                borderBottom: '3px solid',
                                borderBottomColor: 'blue.600',
                                bg: 'white',
                            },
                            _focus: {
                                boxShadow: 'none',
                            },
                            _hover: {
                                bg: 'blue.50',
                            },
                            paddingX: { base: 2, md: 4 },
                            paddingY: { base: 3, md: 4 },
                            marginRight: { base: 0, md: 4 }
                        },
                        '.chakra-tabs__tablist': {
                            borderBottom: '1px solid',
                            borderBottomColor: 'gray.200',
                            marginBottom: '1rem',
                            display: 'flex',
                            justifyContent: 'flex-start',
                            overflowX: 'auto',
                            paddingBottom: '2px',
                        },
                        '.chakra-tabs__tabpanel': {
                            paddingX: { base: 0, md: 2 },
                            paddingTop: 4,
                        }
                    }}
                >
                    <TabList>
                        <Tab>Visão Geral</Tab>
                        <Tab>
                            Formação ({Object.keys(professor.formacao_academica || {}).length})
                        </Tab>
                        <Tab>
                            Projetos ({professor.dados_lattes?.projetos_pesquisa?.length || 0})
                        </Tab>
                    </TabList>

                    <TabPanels>
                        {/* ABA: Visão Geral */}
                        <TabPanel>
                            {/* 📚 EXIBIÇÃO DA ÚLTIMA DISCIPLINA (Lógica Corrigida/Refinada) */}
                            {ultimaDisciplina && (
                                <Box p={4} bg="blue.50" borderRadius="lg" mb={6} borderLeft="4px solid" borderColor="blue.400">
                                    <HStack spacing={2} mb={1}>
                                        <BookOpen size={18} color="#3182CE" />
                                        <Text fontWeight="bold" fontSize={{ base: 'xs', md: 'sm' }} color="blue.700" textTransform="uppercase">ÚLTIMA ATIVIDADE DE ENSINO (LATTES)</Text>
                                    </HStack>
                                    <Text fontSize={{ base: 'sm', md: 'md' }} color="gray.700">{ultimaDisciplina}</Text>
                                </Box>
                            )}

                            <Heading as="h3" size={{ base: 'md', md: 'lg' }} mb={4} color="blue.700" fontWeight="bold" letterSpacing="tight">Sobre</Heading>
                            {/* Lógica para tratar "não informada" */}
                            {(() => {
                                const descriptionSource = professor.dados_lattes?.resumo_cv || professor.descricao_pessoal;
                                const descriptionContent = (descriptionSource || '').toLowerCase().trim();
                                const isContentMissing = descriptionContent === '' || descriptionContent === 'não informada';

                                if (isContentMissing) {
                                    return (
                                        <MissingDataPlaceholder 
                                            title="A descrição pessoal não foi encontrada."
                                            description="Não conseguimos minerar o resumo do currículo Lattes ou a descrição pessoal deste professor. Os dados podem ser atualizados em breve."
                                        />
                                    );
                                } else {
                                    return (
                                        <Text lineHeight="taller" color="gray.600" fontSize={{ base: 'md', md: 'lg' }}>
                                            {descriptionSource}
                                        </Text>
                                    );
                                }
                            })()}
                        </TabPanel>

                        {/* ABA: Formação */}
                        <TabPanel>
                            <Heading as="h3" size={{ base: 'md', md: 'lg' }} mb={4} color="blue.700" fontWeight="bold" letterSpacing="tight">Formação Acadêmica</Heading>
                            {hasFormacao ? (
                                <VStack align="start" spacing={6}>
                                    {Object.entries(professor.formacao_academica).map(
                                        ([nivel, cursos]) => (
                                            <FormacaoItem key={nivel} nivel={nivel} cursos={cursos} />
                                        )
                                    )}
                                </VStack>
                            ) : (
                                <MissingDataPlaceholder label="formação acadêmica" />
                            )}
                        </TabPanel>

                        {/* ABA: Projetos */}
                        <TabPanel>
                             <Heading as="h3" size={{ base: 'md', md: 'lg' }} mb={4} color="blue.700" fontWeight="bold" letterSpacing="tight">Projetos de Pesquisa</Heading>
                            {hasProjects ? (
                                <VStack align="stretch" spacing={4}>
                                    {professor.dados_lattes.projetos_pesquisa.map((projeto, index) => (
                                        <ProjectItem key={index} projeto={projeto} />
                                    ))}
                                </VStack>
                            ) : (
                                <MissingDataPlaceholder label="projetos de pesquisa do Lattes" />
                            )}
                        </TabPanel>
                    </TabPanels>
                </Tabs>
                {/* === Fim das Abas de Conteúdo === */}

                {/* === Bloco de Contato (MANTIDO CONFORME ORIGINAL) === */}
                <Box mt={8} p={6} border="1px solid" borderColor="gray.200" borderRadius="lg" boxShadow="sm">
                    <Heading as="h3" size={{ base: 'md', md: 'lg' }} mb={4} color="blue.700" fontWeight="bold" letterSpacing="tight">
                        Contato
                    </Heading>
                    
                    <Flex direction="column" gap={1} fontSize={{ base: 'sm', md: 'md' }}>
                        <HStack align="center">
                            <Mail size={16} style={{ marginRight: '8px', color: 'var(--chakra-colors-gray-600)' }} />
                            <Text color="gray.600">{professor.contatos?.email || 'Não informado'}</Text>
                        </HStack>
                        <HStack align="center">
                            <Phone size={16} style={{ marginRight: '8px', color: 'var(--chakra-colors-gray-600)' }} />
                            <Text color="gray.600">Telefone: {professor.contatos?.telefone && professor.contatos.telefone.length > 5 ? professor.contatos.telefone : 'Não informado'}</Text>
                        </HStack>
                        <HStack align="center">
                            <MapPin size={16} style={{ marginRight: '8px', color: 'var(--chakra-colors-gray-600)' }} />
                            <Text color="gray.600">Sala: {professor.contatos?.sala || 'Não informado'}</Text>
                        </HStack>
                    </Flex>
                </Box>
            </Box>
        </Flex>
    );
};

export default ProfessorDetailPage;
