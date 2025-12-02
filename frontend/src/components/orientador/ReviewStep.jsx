import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  HStack,
  Stack,
  Icon,
  Tag,
  TagLabel,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  User,
  GraduationCap,
  FileText,
  BookOpen,
  Code2,
  Pencil,
  Sparkles,
} from "lucide-react";

export default function ReviewStep({ formData, onEdit, onSubmit, onBack }) {
  const titleColor = useColorModeValue("gray.800", "white");
  const muted = useColorModeValue("gray.600", "gray.400");
  const cardBg = useColorModeValue("white", "gray.800");
  const lineBg = useColorModeValue("gray.50", "gray.900");
  const border = useColorModeValue("gray.200", "gray.700");
  const chipBg = useColorModeValue("gray.100", "gray.700");
  const accent = useColorModeValue("blue.600", "blue.300");
  const ctaBg = useColorModeValue("blue.50", "blue.900");

  const {
    nome,
    curso,
    tipoProjeto,
    topicosInteresse = [],
    habilidadesTecnicas = [],
  } = formData || {};

  const Row = ({ icon, label, value, stepToEdit, isList }) => (
    <Box
      bg={lineBg}
      borderWidth="1px"
      borderColor={border}
      borderRadius="xl"
      px={4}
      py={3}
    >
      <Flex align="center" justify="space-between" gap={3}>
        <HStack spacing={3} align="flex-start" flex="1" minW={0}>
          <Box
            bg={useColorModeValue("blue.50", "blue.900")}
            p={2}
            borderRadius="lg"
          >
            <Icon as={icon} color={accent} boxSize={5} />
          </Box>

          <Box flex="1" minW={0}>
            <Text fontSize="sm" color={muted} fontWeight="semibold">
              {label}
            </Text>

            {!isList ? (
              <Text fontSize="md" color={titleColor} noOfLines={2}>
                {value || "não informado"}
              </Text>
            ) : (
              <HStack spacing={2} mt={1} flexWrap="wrap">
                {value?.length ? (
                  value.map((item) => (
                    <Tag
                      key={item}
                      size="sm"
                      borderRadius="full"
                      bg={chipBg}
                      px={3}
                    >
                      <TagLabel fontSize="xs">{item}</TagLabel>
                    </Tag>
                  ))
                ) : (
                  <Text fontSize="sm" color={muted} fontStyle="italic">
                    não informado
                  </Text>
                )}
              </HStack>
            )}
          </Box>
        </HStack>

        <Button
          onClick={() => onEdit(stepToEdit)}
          size="sm"
          variant="ghost"
          color={muted}
          _hover={{ color: accent, bg: "transparent" }}
          aria-label={`Editar ${label}`}
        >
          <Icon as={Pencil} boxSize={4} />
        </Button>
      </Flex>
    </Box>
  );

  return (
    <VStack spacing={8} align="stretch">
      <VStack spacing={2} textAlign="center">
        <Heading size="lg" color={titleColor}>
          Revise suas informações 📋
        </Heading>
        <Text color={muted}>
          Confira se está tudo correto antes de buscarmos os melhores orientadores
        </Text>
      </VStack>

      <Box bg={cardBg} borderWidth="1px" borderColor={border} borderRadius="2xl" p={5}>
        <VStack spacing={3} align="stretch">
          <Row
            icon={User}
            label="Nome"
            value={nome}
            stepToEdit={1}
          />
          <Row
            icon={GraduationCap}
            label="Curso"
            value={curso}
            stepToEdit={2}
          />
          <Row
            icon={FileText}
            label="Tipo de Projeto"
            value={tipoProjeto}
            stepToEdit={3}
          />
          <Row
            icon={BookOpen}
            label="Tópicos de Interesse"
            value={topicosInteresse}
            stepToEdit={4}
            isList
          />
          <Row
            icon={Code2}
            label="Habilidades Técnicas"
            value={habilidadesTecnicas}
            stepToEdit={5}
            isList
          />
        </VStack>

        <Divider my={5} />

        <Box
          bg={ctaBg}
          borderWidth="1px"
          borderColor={useColorModeValue("blue.200", "blue.700")}
          borderRadius="xl"
          px={5}
          py={4}
          textAlign="center"
        >
          <HStack justify="center" spacing={2} mb={1}>
            <Icon as={Sparkles} color={accent} />
            <Text fontWeight="bold" color={titleColor}>
              Tudo pronto! ✨
            </Text>
          </HStack>
          <Text fontSize="sm" color={muted}>
            Nossa IA vai analisar seu perfil e encontrar os professores mais adequados
            para orientá-lo em seu projeto.
          </Text>
        </Box>

        <Stack 
          pt={5} 
          spacing={4} 
          direction={{ base: 'column', md: 'row' }}
          w="100%"
        >
          <Button
            variant="outline"
            size="lg"
            w={{ base: "100%", md: "auto" }}
            flex={1}
            borderRadius="lg"
            onClick={onBack}
          >
            ← Voltar
          </Button>

          <Button
            size="lg"
            colorScheme="blue"
            w={{ base: "100%", md: "auto" }}
            flex={1}
            borderRadius="lg"
            onClick={onSubmit}
            rightIcon={<Icon as={Sparkles} />}
          >
            Buscar Orientadores Ideais 🎯
          </Button>
        </Stack>
      </Box>
    </VStack>
  );
}