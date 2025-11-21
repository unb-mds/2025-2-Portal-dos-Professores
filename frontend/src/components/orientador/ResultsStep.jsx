import { useMemo } from "react";
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
} from "@chakra-ui/react";

export default function ResultsStep({ isLoading, results, onReset, onBack }) {
  const cardBg = useColorModeValue("white", "gray.800");
  const muted = useColorModeValue("gray.600", "gray.400");
  const accent = useColorModeValue("blue.700", "blue.300");
  const soft = useColorModeValue("gray.50", "gray.700");
  const border = useColorModeValue("gray.200", "gray.700");

  const professores = results?.professores ?? [];
  const count = professores.length;

  const formatInitials = (nome = "") =>
    nome
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  const content = useMemo(() => {
    if (isLoading) {
      return (
        <VStack py={12}>
          <Text color={muted}>Buscando orientadores ideais...</Text>
        </VStack>
      );
    }

    if (!results || results.error) {
      return (
        <VStack py={12} spacing={3}>
          <Heading size="md">Ops!</Heading>
          <Text color={muted}>
            Não conseguimos buscar orientadores agora.
          </Text>
          <Button onClick={onReset} leftIcon={<Icon as={RotateCcw} />}>
            Tentar novamente
          </Button>
        </VStack>
      );
    }

    return (
      <VStack spacing={8} align="stretch">
        {/* GRID */}
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
                  name={p.nome}
                  size="md"
                  bg={accent}
                  color="white"
                >
                  {formatInitials(p.nome)}
                </Avatar>

                <VStack align="start" spacing={1} flex="1" minW={0}>
                  <Heading size="sm" noOfLines={1}>
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

                {/* Rodapé de métricas (opcional) */}
                {(p.artigos || p.disciplinas) && (
                  <HStack pt={3} spacing={4} color={muted} fontSize="xs">
                    {p.artigos && <Text>{p.artigos.length} artigos</Text>}
                    {p.disciplinas && (
                      <Text>{p.disciplinas.length} disciplinas</Text>
                    )}
                  </HStack>
                )}
              </VStack>
            </Box>
          ))}
        </SimpleGrid>

        {/* BOTÕES */}
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
  }, [isLoading, results, professores, muted, cardBg, border, soft, accent, onReset, onBack]);

  return (
    <Box bg={cardBg} borderRadius="2xl" p={{ base: 5, md: 8 }} boxShadow="md">
      {/* CABEÇALHO */}
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
          Encontramos {count} orientadores ideais! 🎉
        </Heading>
        <Text color={muted}>
          Encontramos os melhores orientadores para você!
        </Text>
      </VStack>

      {content}
    </Box>
  );
}
