import { useState } from "react";
import {
  Box,
  Button,
  Heading,
  Text,
  VStack,
  HStack,
  Wrap,
  WrapItem,
  useColorModeValue,
  Input,
  IconButton,
  Flex,
  Tag,
  TagLabel,
  Icon,
} from "@chakra-ui/react";
import { Plus } from "lucide-react";

export default function SkillsStep({ value = [], onChange, onNext, onBack }) {
  const [customSkill, setCustomSkill] = useState("");

  const titleColor = useColorModeValue("gray.800", "white");
  const muted = useColorModeValue("gray.600", "gray.400");
  const chipBg = useColorModeValue("white", "gray.800");
  const chipBorder = useColorModeValue("gray.200", "gray.600");
  const chipHover = useColorModeValue("blue.300", "blue.500");
  const chipSelectedBg = useColorModeValue("blue.50", "blue.900");
  const chipSelectedBorder = useColorModeValue("blue.500", "blue.300");

  const suggestedSkills = [
    "Python",
    "Java",
    "JavaScript",
    "C++",
    "React",
    "Node.js",
    "SQL",
    "Git",
    "Docker",
    "TensorFlow",
    "PyTorch",
    "AWS",
  ];

  const toggleSkill = (skill) => {
    const isSelected = value.includes(skill);
    const newSelected = isSelected
      ? value.filter((s) => s !== skill)
      : [...value, skill];

    onChange(newSelected);
  };

  const addCustomSkill = () => {
    const s = customSkill.trim();
    if (!s) return;
    if (value.includes(s)) {
      setCustomSkill("");
      return;
    }
    onChange([...value, s]);
    setCustomSkill("");
  };

  const handleEnter = (e) => {
    if (e.key === "Enter") addCustomSkill();
  };

  const hasSkills = value.length > 0;

  return (
    <VStack spacing={8} align="stretch">
      {/* Título */}
      <VStack spacing={2} textAlign="center">
        <Heading size="lg" color={titleColor}>
          Quais habilidades técnicas você tem? 🛠️
        </Heading>
        <Text fontSize="md" color={muted}>
          Isso é opcional, mas ajuda a encontrar orientadores alinhados com seu perfil
        </Text>
      </VStack>

      {/* Chips sugeridos */}
      <Box>
        <Text fontWeight="semibold" mb={3} color={titleColor}>
          Habilidades sugeridas
        </Text>

        <Wrap spacing={3}>
          {suggestedSkills.map((skill) => {
            const isSelected = value.includes(skill);

            return (
              <WrapItem key={skill}>
                <Button
                  size="sm"
                  variant="unstyled"
                  px={4}
                  py={2}
                  borderRadius="full"
                  borderWidth="1px"
                  bg={isSelected ? chipSelectedBg : chipBg}
                  borderColor={isSelected ? chipSelectedBorder : chipBorder}
                  fontWeight="semibold"
                  fontSize="sm"
                  transition="0.2s"
                  _hover={{ borderColor: chipHover, transform: "translateY(-1px)" }}
                  onClick={() => toggleSkill(skill)}
                >
                  {skill}
                </Button>
              </WrapItem>
            );
          })}
        </Wrap>
      </Box>

      {/* Adicionar habilidade personalizada */}
      <Box>
        <Text fontWeight="semibold" mb={2} color={titleColor}>
          Adicionar habilidade personalizada
        </Text>

        <Flex gap={2}>
          <Input
            placeholder="Ex: Kotlin, R, MATLAB..."
            value={customSkill}
            onChange={(e) => setCustomSkill(e.target.value)}
            onKeyDown={handleEnter}
            bg={useColorModeValue("white", "gray.700")}
            borderColor={useColorModeValue("gray.300", "gray.600")}
            borderRadius="lg"
          />
          <IconButton
            aria-label="Adicionar habilidade"
            icon={<Icon as={Plus} />}
            onClick={addCustomSkill}
            colorScheme="gray"
            variant="outline"
            borderRadius="lg"
          />
        </Flex>
      </Box>

      {/* Dica */}
      <Box
        borderWidth="1px"
        borderStyle="dashed"
        borderColor={useColorModeValue("gray.300", "gray.600")}
        borderRadius="lg"
        py={3}
        px={4}
        textAlign="center"
        bg={useColorModeValue("gray.50", "gray.900")}
      >
        <Text fontSize="sm" color={muted}>
          💡 Dica: Você pode pular esta etapa se preferir
        </Text>
      </Box>

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
        >
          {hasSkills ? "Continuar →" : "Pular →"}
        </Button>
      </HStack>
    </VStack>
  );
}
