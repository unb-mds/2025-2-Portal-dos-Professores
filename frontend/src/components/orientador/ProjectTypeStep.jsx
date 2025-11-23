import {
  Box,
  Button,
  Heading,
  Text,
  VStack,
  HStack,
  Icon,
  useColorModeValue,
  Flex,
} from "@chakra-ui/react";
import {
  FileText,
  FlaskConical,
  GraduationCap,
  Users,
  BriefcaseBusiness,
  Sparkles,
} from "lucide-react";

export default function ProjectTypeStep({ value, onChange, onNext, onBack }) {
  const cardBg = useColorModeValue("white", "gray.800");
  const pageText = useColorModeValue("gray.800", "white");
  const muted = useColorModeValue("gray.600", "gray.400");
  const borderDefault = useColorModeValue("gray.200", "gray.600");
  const borderHover = useColorModeValue("blue.300", "blue.500");
  const borderSelected = useColorModeValue("blue.500", "blue.300");
  const selectedBg = useColorModeValue("blue.50", "blue.900");
  const iconBg = useColorModeValue("gray.100", "gray.700");

  const projectTypes = [
    {
      id: "tcc",
      label: "TCC/Monografia",
      description: "Trabalho de conclusão de curso",
      icon: FileText,
    },
    {
      id: "ic",
      label: "Iniciação Científica (IC)",
      description: "Projeto de pesquisa acadêmica",
      icon: FlaskConical,
    },
    {
      id: "pos",
      label: "Mestrado/Doutorado",
      description: "Pós-graduação stricto sensu",
      icon: GraduationCap,
    },
    {
      id: "extensao",
      label: "Projeto de Extensão",
      description: "Ação com impacto social",
      icon: Users,
    },
    {
      id: "empresarial",
      label: "Projeto Empresarial",
      description: "Parceria com empresa",
      icon: BriefcaseBusiness,
    },
    {
      id: "outro",
      label: "Outro",
      description: "Outro tipo de projeto",
      icon: Sparkles,
    },
  ];

  const handleSelect = (label) => onChange(label);

  return (
    <VStack spacing={8} align="stretch">
      {/* Título */}
      <VStack spacing={2} textAlign="center">
        <Heading size="lg" color={pageText}>
          Que tipo de projeto você busca? 🎯
        </Heading>
        <Text fontSize="md" color={muted}>
          Selecione a opção que melhor descreve sua necessidade
        </Text>
      </VStack>

      {/* Lista de opções */}
      <VStack spacing={4} align="stretch">
        {projectTypes.map((item) => {
          const isSelected = value === item.label;

          return (
            <Box
              key={item.id}
              bg={isSelected ? selectedBg : cardBg}
              borderWidth="2px"
              borderColor={isSelected ? borderSelected : borderDefault}
              borderRadius="xl"
              px={5}
              py={4}
              cursor="pointer"
              transition="0.2s"
              _hover={{
                borderColor: borderHover,
                transform: "translateY(-2px)",
              }}
              onClick={() => handleSelect(item.label)}
            >
              <HStack spacing={4} align="center">
                {/* bolinha radio */}
                <Box
                  w="18px"
                  h="18px"
                  borderRadius="full"
                  borderWidth="2px"
                  borderColor={isSelected ? borderSelected : borderDefault}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  {isSelected && (
                    <Box
                      w="8px"
                      h="8px"
                      borderRadius="full"
                      bg={borderSelected}
                    />
                  )}
                </Box>

                {/* quadrado com ícone */}
                <Flex
                  w="38px"
                  h="38px"
                  borderRadius="md"
                  bg={iconBg}
                  align="center"
                  justify="center"
                >
                  <Icon as={item.icon} boxSize={5} color={muted} />
                </Flex>

                {/* textos */}
                <VStack spacing={0} align="start" flex="1">
                  <Text fontWeight="semibold" color={pageText}>
                    {item.label}
                  </Text>
                  <Text fontSize="sm" color={muted}>
                    {item.description}
                  </Text>
                </VStack>
              </HStack>
            </Box>
          );
        })}
      </VStack>

      {/* Botões */}
      <HStack pt={2} spacing={4}>
        <Button
          variant="outline"
          size="lg"
          w="100%"
          borderRadius="lg"
          onClick={onBack}
        >
          ← Voltar
        </Button>

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
      </HStack>
    </VStack>
  );
}
