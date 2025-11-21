import {
  Box,
  Button,
  Heading,
  Text,
  VStack,
  SimpleGrid,
  useColorModeValue,
} from "@chakra-ui/react";

export default function CourseStep({ value, onChange, onNext, onBack }) {
  const cardBg = useColorModeValue("white", "gray.800");
  const selectedBg = useColorModeValue("blue.50", "blue.900");
  const borderDefault = useColorModeValue("gray.200", "gray.600");
  const borderSelected = useColorModeValue("blue.400", "blue.300");
  const titleColor = useColorModeValue("gray.800", "white");
  const mutedColor = useColorModeValue("gray.600", "gray.400");

  const cursos = [
    "Engenharia de Software (FGA)",
    "Engenharia Aeroespacial (FGA)",
    "Engenharia Automotiva (FGA)",
    "Engenharia Eletrônica (FGA)",
    "Engenharia de Energia (FGA)",
    "Engenharia Civil (FT)",
    "Ciência da Computação (CIC)",
    "Estatística (EST)",
    "Outro"
  ];

  return (
    <VStack spacing={8} align="stretch">
      {/* Título */}
      <VStack spacing={2} textAlign="center">
        <Heading size="lg" color={titleColor}>
          Escolha seu curso 🎓
        </Heading>
        <Text fontSize="md" color={mutedColor}>
          Isso ajuda a IA a selecionar professores da sua área.
        </Text>
      </VStack>

      {/* Cards */}
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
        {cursos.map((curso) => {
          const isSelected = value === curso;
          return (
            <Box
              key={curso}
              p={5}
              borderRadius="xl"
              borderWidth="2px"
              cursor="pointer"
              bg={isSelected ? selectedBg : cardBg}
              borderColor={isSelected ? borderSelected : borderDefault}
              transition="0.2s"
              _hover={{
                borderColor: borderSelected,
                transform: "translateY(-3px)",
              }}
              onClick={() => onChange(curso)}
            >
              <Text
                fontWeight="semibold"
                fontSize="md"
                color={isSelected ? "blue.600" : titleColor}
              >
                {curso}
              </Text>
            </Box>
          );
        })}
      </SimpleGrid>

      {/* Botões */}
      <VStack spacing={4} pt={2}>
        <Button
          size="lg"
          colorScheme="blue"
          w="100%"
          borderRadius="lg"
          onClick={onNext}
          isDisabled={!value}
        >
          Continuar →
        </Button>

        <Button
          variant="ghost"
          size="sm"
          color={mutedColor}
          onClick={onBack}
        >
          Voltar
        </Button>
      </VStack>
    </VStack>
  );
}
