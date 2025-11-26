import React from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { useProfessorData } from '../context/ProfessorContext';
import { Mail, Phone, MapPin, BookOpen, ExternalLink, GraduationCap, Briefcase } from 'lucide-react';
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
    Badge,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Progress,
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
    SimpleGrid
} from "@chakra-ui/react";

// =================================================================
// NOVOS COMPONENTES (Atuação Profissional e Scholar)
// =================================================================

const ProfessionalTab = ({ data }) => {
    if (!data || data.length === 0) return <MissingDataPlaceholder label="atuação profissional" />;
    
    return (
        <VStack spacing={6} align="stretch">
            {data.map((atuacao, idx) => (
                <Box key={idx} borderWidth="1px" borderRadius="lg" overflow="hidden" bg="white" borderColor="gray.200">
                    <Box bg="gray.50" px={5} py={3} borderBottomWidth="1px" borderColor="gray.200">
                        <HStack>
                            <Briefcase size={18} color="#2B6CB0" />
                            <Heading size="sm" color="blue.800">{atuacao.instituicao}</Heading>
                        </HStack>
                    </Box>
                    <Box p={5}>
                        {/* Vínculos */}
                        {atuacao.vinculos && atuacao.vinculos.length > 0 && (
                            <Box mb={4}>
                                <Text fontSize="xs" fontWeight="bold" textTransform="uppercase" color="gray.500" mb={2}>Vínculos</Text>
                                <VStack align="start" spacing={2}>
                                    {atuacao.vinculos.map((v, i) => (
                                        <Flex key={i} direction={{ base: "column", sm: "row" }} gap={2} w="100%">
                                            <Badge colorScheme="blue" variant="subtle" px={2} alignSelf="start" whiteSpace="nowrap">
                                                {v.periodo}
                                            </Badge>
                                            <Text fontSize="sm" color="gray.700">{v.detalhes}</Text>
                                        </Flex>
                                    ))}
                                </VStack>
                            </Box>
                        )}
                        
                        {/* Atividades */}
                        {atuacao.atividades && atuacao.atividades.length > 0 && (
                            <Box>
                                <Text fontSize="xs" fontWeight="bold" textTransform="uppercase" color="gray.500" mb={2}>Atividades</Text>
                                <VStack align="start" spacing={3}>
                                    {atuacao.atividades.map((a, i) => (
                                        <Flex key={i} direction={{ base: "column", sm: "row" }} gap={2} w="100%">
                                            <Badge colorScheme="green" variant="outline" px={2} alignSelf="start" whiteSpace="nowrap">
                                                {a.periodo}
                                            </Badge>
                                            <Text fontSize="sm" color="gray.600">{a.detalhes}</Text>
                                        </Flex>
                                    ))}
                                </VStack>
                            </Box>
                        )}
                    </Box>
                </Box>
            ))}
        </VStack>
    );
};

// Componente auxiliar para barra de comparação (Substitui o Recharts)
const MetricComparison = ({ label, total, recent }) => {
    // Evita divisão por zero
    const maxVal = Math.max(total, 1);
    const recentPercent = (recent / maxVal) * 100;

    return (
        <Box p={4} borderWidth="1px" borderRadius="md" borderColor="gray.100" bg="white">
            <Text fontSize="sm" fontWeight="bold" color="gray.600" mb={3}>{label}</Text>
            
            <Flex align="center" mb={2}>
                <Box w="60px" fontSize="xs" color="blue.600" fontWeight="bold">Total</Box>
                <Box flex="1" mx={2}>
                    <Progress value={100} size="sm" colorScheme="blue" borderRadius="full" />
                </Box>
                <Box w="40px" textAlign="right" fontSize="sm" fontWeight="bold">{total}</Box>
            </Flex>

            <Flex align="center">
                <Box w="60px" fontSize="xs" color="cyan.500" fontWeight="bold">5 Anos</Box>
                <Box flex="1" mx={2}>
                    <Progress value={recentPercent} size="sm" colorScheme="cyan" borderRadius="full" />
                </Box>
                <Box w="40px" textAlign="right" fontSize="sm" color="gray.600">{recent}</Box>
            </Flex>
        </Box>
    );
};

const ScholarTab = ({ data }) => {
    if (!data) return <MissingDataPlaceholder label="Pesquisas" />;

    return (
        <VStack spacing={8} align="stretch">
            {/* Header e Métricas */}
            <Box>
                <Flex justify="space-between" align="center" mb={4}>
                    <Heading size="md" color="gray.700">Métricas Acadêmicas</Heading>
                    <Button 
                        as="a" 
                        href={data.scholar_url} 
                        target="_blank" 
                        size="sm" 
                        colorScheme="blue" 
                        variant="outline" 
                        rightIcon={<ExternalLink size={14} />}
                    >
                        Ver no Scholar
                    </Button>
                </Flex>
                
                {/* Visualização de Métricas sem dependência externa */}
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} mb={6}>
                    <MetricComparison 
                        label="Citações" 
                        total={data.metricas_citacao.total_citacoes} 
                        recent={data.metricas_citacao.total_citacoes_5anos} 
                    />
                    <MetricComparison 
                        label="Índice h" 
                        total={data.metricas_citacao.h_index} 
                        recent={data.metricas_citacao.h_index_5anos} 
                    />
                    <MetricComparison 
                        label="Índice i10" 
                        total={data.metricas_citacao.i10_index} 
                        recent={data.metricas_citacao.i10_index_5anos} 
                    />
                </SimpleGrid>

                {/* Tabela Detalhada */}
                <Box borderWidth="1px" borderRadius="lg" overflow="hidden" borderColor="gray.200">
                    <Box bg="gray.50" px={4} py={2} borderBottomWidth="1px" borderColor="gray.200">
                        <Text fontSize="sm" fontWeight="bold" color="gray.600">Detalhamento</Text>
                    </Box>
                    <TableContainer>
                        <Table size="sm" variant="simple">
                            <Thead>
                                <Tr>
                                    <Th>Métrica</Th>
                                    <Th isNumeric>Total</Th>
                                    <Th isNumeric>Desde 2020</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                <Tr>
                                    <Td fontWeight="medium">Citações</Td>
                                    <Td isNumeric>{data.metricas_citacao.total_citacoes}</Td>
                                    <Td isNumeric color="gray.500">{data.metricas_citacao.total_citacoes_5anos}</Td>
                                </Tr>
                                <Tr>
                                    <Td fontWeight="medium">h-index</Td>
                                    <Td isNumeric>{data.metricas_citacao.h_index}</Td>
                                    <Td isNumeric color="gray.500">{data.metricas_citacao.h_index_5anos}</Td>
                                </Tr>
                                <Tr>
                                    <Td fontWeight="medium">i10-index</Td>
                                    <Td isNumeric>{data.metricas_citacao.i10_index}</Td>
                                    <Td isNumeric color="gray.500">{data.metricas_citacao.i10_index_5anos}</Td>
                                </Tr>
                            </Tbody>
                        </Table>
                    </TableContainer>
                </Box>
            </Box>

            <Divider />

            {/* Publicações */}
            <Box>
                <Heading size="md" mb={4} color="gray.700">Principais Publicações</Heading>
                <VStack spacing={3} align="stretch">
                    {data.publicacoes && data.publicacoes.length > 0 ? (
                        data.publicacoes.map((pub, i) => (
                            <Box key={i} p={4} bg="white" borderWidth="1px" borderColor="gray.100" borderRadius="md" _hover={{ borderColor: 'blue.200', boxShadow: 'sm' }} transition="all 0.2s">
                                <Text fontWeight="semibold" fontSize="md" color="blue.600" mb={1}>
                                    {pub.titulo}
                                </Text>
                                <Text fontSize="sm" color="gray.600" mb={2}>
                                    {pub.autores}
                                </Text>
                                <Flex justify="space-between" align="center" wrap="wrap" gap={2}>
                                    <Text fontSize="xs" color="gray.400" fontStyle="italic">
                                        {pub.local} {pub.ano ? `• ${pub.ano}` : ''}
                                    </Text>
                                    {pub.citacoes_artigo > 0 && (
                                        <Badge colorScheme="orange" variant="outline" fontSize="xs">
                                            {pub.citacoes_artigo} citações
                                        </Badge>
                                    )}
                                </Flex>
                            </Box>
                        ))
                    ) : (
                        <Text color="gray.500" fontStyle="italic">Nenhuma publicação listada.</Text>
                    )}
                </VStack>
            </Box>
        </VStack>
    );
};

// =================================================================
// FUNÇÕES AUXILIARES EXISTENTES
// =================================================================

const MissingDataPlaceholder = ({ title, description, label }) => {
    if (label) {
        return (
            <Flex 
                justify="center" 
                align="center" 
                direction="column" 
                p={8} 
                bg="gray.50" 
                borderRadius="lg" 
                borderStyle="dashed" 
                borderWidth="2px" 
                borderColor="gray.200"
            >
                <Text color="gray.400" fontWeight="medium">Dados indisponíveis</Text>
                <Text color="gray.400" fontSize="sm">Não encontramos informações de {label}.</Text>
            </Flex>
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
            <AlertTitle mt={4} mb={1} fontSize='lg' fontWeight="bold" color="blue.700">
                {title || "Dados Pessoais Não Encontrados"}
            </AlertTitle>
            <AlertDescription maxWidth='sm' color="blue.700">
                {description || "O resumo pessoal ou o currículo lattes minerado para este professor não foi encontrado em nossa base de dados."}
            </AlertDescription>
        </Alert>
    );
};

const ProjectItem = ({ projeto }) => (
    <Box p={4} borderLeft="4px solid" borderColor="blue.400" bg="gray.50" mb={4} borderRadius="lg">
        <Text fontWeight="bold" fontSize="md" color="gray.800">{projeto.titulo}</Text>
        <Text fontSize="sm" color="gray.600" mt={1}>
            {projeto.ano_periodo} — <b>{projeto.situacao}</b> ({projeto.natureza})
        </Text>
        {projeto.integrantes && (
            <Text fontSize="xs" color="gray.500" mt={1} noOfLines={1} textOverflow="ellipsis">
                Integrantes: {projeto.integrantes}
            </Text>
        )}
    </Box>
);

const FormacaoItem = ({ nivel, cursos }) => (
    <Box mb={6}>
        <HStack mb={2} spacing={2} align="center">
            <Box w="8px" h="8px" bg="blue.500" borderRadius="full" />
            <Heading as="h4" size="sm" color="blue.700" textTransform="uppercase">
                {nivel}
            </Heading>
        </HStack>
        <VStack align="start" spacing={1} pl={4} borderLeft="2px solid" borderColor="gray.200">
            {cursos.map((curso, index) => (
                <Text key={index} fontSize="sm" color="gray.700">
                    • {curso}
                </Text>
            ))}
        </VStack>
    </Box>
);

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
            
            let recencyScore = 0;
            
            if (periodo.toLowerCase().includes('atual')) {
                recencyScore = 3000;
            } else {
                const anos = periodo.match(/\d{4}/g) || [];
                if (anos.length > 0) {
                    recencyScore = parseInt(anos[anos.length - 1]);
                }
            }
            
            if (recencyScore > ultimoAnoRecente) {
                ultimoAnoRecente = recencyScore;
                ultimaAtividadeEnsino = {
                    detalhes: atividade.detalhes,
                    periodo: atividade.periodo
                };
            }
        });
    });

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

    if (isLoading) {
        return (
            <Flex justify="center" align="center" minH="100vh" bg="#f9fafb" p={6}>
                <VStack spacing={4} bg="white" p={10} borderRadius="xl" boxShadow="lg" maxW="900px" w="100%">
                    <Spinner size="xl" color="blue.500" />
                    <Heading size="lg" color="gray.700">Carregando dados globais...</Heading>
                </VStack>
            </Flex>
        );
    }

    if (error || !professor) {
        return (
            <Flex justify="center" align="center" minH="100vh" bg="#f9fafb" p={6}>
                <VStack spacing={4} bg="white" p={10} borderRadius="xl" boxShadow="lg" maxW="900px" w="100%">
                    <Heading color="red.500" size="lg">❌ Erro ao Carregar Perfil</Heading>
                    <Text>O professor não foi encontrado ou houve um erro na comunicação com a API.</Text>
                    <Button onClick={() => navigate(-1)} colorScheme="blue">Voltar</Button>
                </VStack>
            </Flex>
        );
    }

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

    return (
        <Flex direction="column" align="center" p={{ base: 4, md: 10 }} bg="#f9fafb" minH="100vh">
            {/* Botão Voltar */}
            <Box maxW="1200px" w="100%" mb={4} textAlign="left">
                <Button
                    onClick={() => navigate(-1)}
                    variant="ghost"
                    colorScheme="blue"
                    fontSize="md"
                    fontWeight="medium"
                    p={3}
                >
                    ← Voltar
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
                {/* === Bloco Superior de Identificação === */}
                <Flex direction={{ base: "column", md: "row" }} align={{ base: "center", md: "flex-start" }}>
                    {/* CORREÇÃO APLICADA: flexShrink={0} evita que o flexbox esmague a imagem e a deixa circular */}
                    <Image
                        borderRadius="full"
                        boxSize={{ base: "150px", md: "180px" }}
                        src={professor.foto_url}
                        alt={professor.nome}
                        mr={{ md: 8 }}
                        mb={{ base: 6, md: 0 }}
                        objectFit="cover"
                        flexShrink={0} 
                        fallbackSrc="https://via.placeholder.com/180/E2E8F0/A0AEC0?text=Foto"
                    />
                    <Box textAlign={{ base: "center", md: "left" }} w="100%">
                        <Heading as="h1" size="xl" mb={1} color="gray.800">
                            {professor.nome}
                        </Heading>
                        <Text color="gray.600" fontSize="lg" mb={4} fontWeight="medium">
                            {professor.departamento}
                        </Text>
                        
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

                        <Flex 
                            gap={{ base: 3, md: 6 }} 
                            mt={4} 
                            mb={6} 
                            fontSize="md" 
                            color="gray.600" 
                            wrap="wrap"
                            justify={{ base: "center", md: "flex-start" }}
                        >
                            {professor.contatos?.sala && professor.contatos.sala.toLowerCase() !== 'não informado' && (
                                <HStack spacing={1} title="Localização">
                                    <MapPin size={18} style={{ color: 'var(--chakra-colors-gray-500)' }} />
                                    <Text>{professor.contatos.sala}</Text>
                                </HStack>
                            )}
                            {professor.contatos?.telefone && professor.contatos.telefone.length > 5 && (
                                <HStack spacing={1} title="Telefone">
                                    <Phone size={18} style={{ color: 'var(--chakra-colors-gray-500)' }} />
                                    <Text>{professor.contatos.telefone}</Text>
                                </HStack>
                            )}
                        </Flex>

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
                    isLazy
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
                            _focus: { boxShadow: 'none' },
                            _hover: { bg: 'blue.50' },
                            paddingY: { base: 3, md: 4 },
                        },
                        '.chakra-tabs__tablist': {
                            borderBottom: '1px solid',
                            borderBottomColor: 'gray.200',
                            marginBottom: '1rem',
                            overflowX: 'auto',
                            paddingBottom: '2px',
                        },
                        '.chakra-tabs__tabpanel': {
                            paddingX: { base: 0, md: 2 },
                            paddingTop: 4,
                        }
                    }}
                >
                    <TabList overflowX="auto" whiteSpace="nowrap">
                        <Tab>Visão Geral</Tab>
                        <Tab>Formação ({Object.keys(professor.formacao_academica || {}).length})</Tab>
                        <Tab>Projetos ({professor.dados_lattes?.projetos_pesquisa?.length || 0})</Tab>
                        <Tab>Atuação</Tab>
                        <Tab>Pesquisas</Tab>
                    </TabList>

                    <TabPanels>
                        {/* ABA: Visão Geral */}
                        <TabPanel>
                            {ultimaDisciplina && (
                                <Box p={4} bg="blue.50" borderRadius="lg" mb={6} borderLeft="4px solid" borderColor="blue.400">
                                    <HStack spacing={2} mb={1}>
                                        <BookOpen size={18} color="#3182CE" />
                                        <Text fontWeight="bold" fontSize="sm" color="blue.700">ÚLTIMA ATIVIDADE DE ENSINO (LATTES)</Text>
                                    </HStack>
                                    <Text fontSize="md" color="gray.700">{ultimaDisciplina}</Text>
                                </Box>
                            )}

                            <Heading as="h3" size="md" mb={4} color="gray.700">Sobre</Heading>
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
                                        <Text lineHeight="taller" color="gray.700" textAlign="justify">
                                            {descriptionSource}
                                        </Text>
                                    );
                                }
                            })()}
                        </TabPanel>

                        {/* ABA: Formação */}
                        <TabPanel>
                            <Heading as="h3" size="md" mb={4} color="gray.700">Formação Acadêmica</Heading>
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
                             <Heading as="h3" size="md" mb={4} color="gray.700">Projetos de Pesquisa</Heading>
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

                        {/* ABA: Atuação Profissional */}
                        <TabPanel>
                             <Heading as="h3" size="md" mb={4} color="gray.700">Atuação Profissional</Heading>
                             <ProfessionalTab data={professor.dados_lattes?.atuacao_profissional} />
                        </TabPanel>

                        {/* ABA: Pesquisas */}
                        <TabPanel>
                             <Heading as="h3" size="md" mb={4} color="gray.700">Pesquisas</Heading>
                             <ScholarTab data={professor.dados_scholar} />
                        </TabPanel>
                    </TabPanels>
                </Tabs>

                {/* === Bloco de Contato === */}
                <Box mt={8} p={6} border="1px solid" borderColor="gray.200" borderRadius="lg" boxShadow="sm">
                    <Heading as="h3" size="md" mb={4}>Contato</Heading>
                    <Flex direction="column" gap={2} fontSize="sm">
                        <HStack align="center">
                            <Mail size={16} style={{ marginRight: '8px', color: 'gray.600' }} />
                            <Text>{professor.contatos?.email || 'Não informado'}</Text>
                        </HStack>
                        <HStack align="center">
                            <Phone size={16} style={{ marginRight: '8px', color: 'gray.600' }} />
                            <Text>Telefone: {professor.contatos?.telefone && professor.contatos.telefone.length > 5 ? professor.contatos.telefone : 'Não informado'}</Text>
                        </HStack>
                        <HStack align="center">
                            <MapPin size={16} style={{ marginRight: '8px', color: 'gray.600' }} />
                            <Text>Sala: {professor.contatos?.sala || 'Não informado'}</Text>
                        </HStack>
                    </Flex>
                </Box>
            </Box>
        </Flex>
    );
};

export default ProfessorDetailPage;