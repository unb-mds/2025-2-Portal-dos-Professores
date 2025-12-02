import { useMemo, useState, useEffect } from "react";
import { ArrowRight, RotateCcw, Sparkles } from "lucide-react";
import {
  Box,
  VStack,
  HStack,
  SimpleGrid,
  Text,
  Heading,
  Button,
  Avatar,
  Tag,
  TagLabel,
  Icon,
  useColorModeValue,
  Divider,
  Spinner,
  Progress,
  Fade
} from "@chakra-ui/react";

const loadingMessages = [
  "🤖 Analisando seu perfil...",
  "🔍 Buscando os melhores orientadores...",
  "📊 Comparando áreas de pesquisa...",
  "✨ Quase lá...",
];

export default function ResultsStep({ isLoading, results, onReset, onBack }) {
  const cardBg = useColorModeValue("white", "gray.800");
  const muted = useColorModeValue("gray.600", "gray.400");
  const accent = useColorModeValue("blue.700", "blue.300");
  const soft = useColorModeValue("gray.50", "gray.700");
  const border = useColorModeValue("gray.200", "gray.700");

  // Estado para controlar a mensagem de loading atual
  const [messageIndex, setMessageIndex] = useState(0);

  // Efeito para rotacionar as mensagens enquanto carrega
  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
      }, 2500); // Troca a cada 2.5 segundos
      return () => clearInterval(interval);
    } else {
      setMessageIndex(0);
    }
  }, [isLoading]);

  const professores = results?.professores ?? [];
  const count = professores.length;

  const content = useMemo(() => {
    // --- ESTADO DE LOADING (NOVO) ---
    if (isLoading) {
      return (
        <VStack py={12} spacing={8} justify="center" minH="300px">
          {/* Spinner Customizado */}
          <Box position="relative">
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="blue.500"
              size="xl"
            />
          </Box>

          {/* Mensagens Animadas */}
          <VStack spacing={3} w="100%">
            <Fade in={true} key={messageIndex}>
              <Heading size="md" color="blue.600" textAlign="center" minH="1.5em">
                {loadingMessages[messageIndex]}
              </Heading>
            </Fade>
            <Text fontSize="sm" color={muted}>
              Isso pode levar alguns segundos...
            </Text>
          </VStack>

          {/* Barra de Progresso Decorativa */}
          <Box w="100%" maxW="300px">
            <Progress 
              size="xs" 
              isIndeterminate 
              colorScheme="blue" 
              borderRadius="full" 
            />
          </Box>
        </VStack>
      );
    }

    // --- ESTADO DE ERRO ---
    if (!results || results.error) {
      return (
        <VStack py={12} spacing={4}>
          <Heading size="md" color="red.500">Ops! Algo deu errado.</Heading>
          <Text color={muted} textAlign="center">
            {results?.message || "Não conseguimos buscar orientadores agora."}
          </Text>
          <Button onClick={onReset} leftIcon={<Icon as={RotateCcw} />}>
            Tentar novamente
          </Button>
        </VStack>
      );
    }

    // --- ESTADO DE RESULTADOS ---
    return (
      <VStack spacing={8} align="stretch">
        {/* GRID DE CARDS */}
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
          {professores.map((p) => (
            <Box
              key={p.id}
              bg={cardBg}
              borderWidth="1px"
              borderColor={border}
              borderRadius="xl"
              p={5}
              boxShadow="sm"
              _hover={{ boxShadow: "md", transform: "translateY(-2px)" }}
              transition="all 0.2s"
            >
              <HStack align="start" spacing={4}>
                <Avatar
                  src={p.foto || p.foto_url || p.image} 
                  name={p.nome}
                  size="md"
                  bg={accent}
                  color="white"
                />

                <VStack align="start" spacing={1} flex="1" minW={0}>
                  <Heading size="sm" noOfLines={2}>
                    {p.nome}
                  </Heading>
                  <Text fontSize="sm" color={muted} noOfLines={1}>
                    {p.departamento}
                  </Text>
                </VStack>
              </HStack>

              <Divider my={4} />

              <VStack align="start" spacing={2} fontSize="sm">
                <Text color={muted}>✉ {p.email || "não informado"}</Text>
                <Text color={muted}>📍 {p.campus || "UnB"}</Text>

                <Text fontSize="xs" fontWeight="bold" mt={2}>
                  Áreas de Pesquisa
                </Text>

                {(p.areasPesquisa?.length ?? 0) > 0 ? (
                  <HStack spacing={2} flexWrap="wrap">
                    {p.areasPesquisa.slice(0, 4).map((area) => (
                      <Tag
                        key={area}
                        size="sm"
                        borderRadius="full"
                        bg={soft}
                      >
                        <TagLabel fontSize="xs">{area}</TagLabel>
                      </Tag>
                    ))}
                  </HStack>
                ) : (
                  <Text fontSize="xs" color={muted} fontStyle="italic">
                    dados em atualização
                  </Text>
                )}

                {/* Rodapé de métricas */}
                {(p.artigos || p.disciplinas) && (
                  <HStack pt={3} spacing={4} color={muted} fontSize="xs">
                    {p.artigos && <Text>{Array.isArray(p.artigos) ? p.artigos.length : p.artigos} artigos</Text>}
                    {p.disciplinas && (
                      <Text>{Array.isArray(p.disciplinas) ? p.disciplinas.length : p.disciplinas} disciplinas</Text>
                    )}
                  </HStack>
                )}
              </VStack>
            </Box>
          ))}
        </SimpleGrid>

        {/* BOTÕES DE AÇÃO */}
        <HStack spacing={3} pt={2}>
          <Button
            variant="outline"
            flex="1"
            leftIcon={<Icon as={RotateCcw} />}
            onClick={onReset}
          >
            Buscar Novamente
          </Button>

          <Button
            colorScheme="blue"
            flex="1"
            rightIcon={<Icon as={ArrowRight} />}
            onClick={onBack}
          >
            Ver Todos os Professores
          </Button>
        </HStack>

        <Text fontSize="xs" color={muted} textAlign="center">
          💡 Dica: Entre em contato com os professores para discutir seu projeto
        </Text>
      </VStack>
    );
  }, [isLoading, results, professores, muted, cardBg, border, soft, accent, onReset, onBack, messageIndex]);

  return (
    <Box bg={cardBg} borderRadius="2xl" p={{ base: 5, md: 8 }} boxShadow="md">
      {/* CABEÇALHO (Só aparece se NÃO estiver carregando) */}
      {!isLoading && (
        <VStack spacing={2} mb={8} textAlign="center">
          <Box
            w="40px"
            h="40px"
            borderRadius="full"
            bg={soft}
            display="grid"
            placeItems="center"
            mx="auto"
          >
            <Icon as={Sparkles} color={accent} />
          </Box>

          <Heading size="lg">
            {professores.length > 0 
              ? `Encontramos ${count} orientadores ideais! 🎉`
              : "Nenhum resultado encontrado"}
          </Heading>
          <Text color={muted}>
            {professores.length > 0 
              ? "Encontramos os melhores orientadores para você!"
              : "Tente ajustar seus interesses e tente novamente."}
          </Text>
        </VStack>
      )}

      {content}
    </Box>
  );
}