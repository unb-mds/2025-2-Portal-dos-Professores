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
  Icon,
} from "@chakra-ui/react";
import { Plus } from "lucide-react";

export default function InterestsStep({ value = [], onChange, onNext, onBack }) {
  const [customTopic, setCustomTopic] = useState("");

  const titleColor = useColorModeValue("gray.800", "white");
  const muted = useColorModeValue("gray.600", "gray.400");
  const chipBg = useColorModeValue("white", "gray.800");
  const chipBorder = useColorModeValue("gray.200", "gray.600");
  const chipHover = useColorModeValue("blue.300", "blue.500");
  const chipSelectedBg = useColorModeValue("blue.50", "blue.900");
  const chipSelectedBorder = useColorModeValue("blue.500", "blue.300");

  const suggestedTopics = [
    "Inteligência Artificial",
    "Machine Learning",
    "Redes de Computadores",
    "Sistemas Distribuídos",
    "Segurança da Informação",
    "Desenvolvimento Web",
    "Internet das Coisas (IoT)",
    "Banco de Dados",
    "Computação em Nuvem",
    "Desenvolvimento Mobile",
    "Computação Gráfica",
    "Realidade Virtual/Aumentada",
    "Big Data",
    "Blockchain",
    "Robótica",
    "Sistemas Embarcados",
  ];

  const toggleTopic = (topic) => {
    const isSelected = value.includes(topic);
    const newSelected = isSelected
      ? value.filter((t) => t !== topic)
      : [...value, topic];

    onChange(newSelected);
  };

  const addCustomTopic = () => {
    const t = customTopic.trim();
    if (!t) return;
    if (value.includes(t)) {
      setCustomTopic("");
      return;
    }
    onChange([...value, t]);
    setCustomTopic("");
  };

  const handleEnter = (e) => {
    if (e.key === "Enter") addCustomTopic();
  };

  return (
    <VStack spacing={8} align="stretch">
      {/* Título */}
      <VStack spacing={2} textAlign="center">
        <Heading size="lg" color={titleColor}>
          Quais são seus tópicos de interesse? 💡
        </Heading>
        <Text fontSize="md" color={muted}>
          Selecione as áreas que mais te interessam (mínimo 1)
        </Text>
      </VStack>

      {/* Chips sugeridos */}
      <Box>
        <Text fontWeight="semibold" mb={3} color={titleColor}>
          Tópicos sugeridos
        </Text>

        <Wrap spacing={3}>
          {suggestedTopics.map((topic) => {
            const isSelected = value.includes(topic);

            return (
              <WrapItem key={topic}>
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
                  onClick={() => toggleTopic(topic)}
                >
                  {topic}
                </Button>
              </WrapItem>
            );
          })}
        </Wrap>
      </Box>

      {/* Adicionar tópico personalizado */}
      <Box>
        <Text fontWeight="semibold" mb={2} color={titleColor}>
          Adicionar tópico personalizado
        </Text>

        <Flex gap={2}>
          <Input
            placeholder="Ex: Computação Quântica"
            value={customTopic}
            onChange={(e) => setCustomTopic(e.target.value)}
            onKeyDown={handleEnter}
            bg={useColorModeValue("white", "gray.700")}
            borderColor={useColorModeValue("gray.300", "gray.600")}
            borderRadius="lg"
          />
          <IconButton
            aria-label="Adicionar tópico"
            icon={<Icon as={Plus} />}
            onClick={addCustomTopic}
            colorScheme="gray"
            variant="outline"
            borderRadius="lg"
          />
        </Flex>
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
          isDisabled={value.length === 0}
        >
          Continuar →
        </Button>
      </HStack>
    </VStack>
  );
}
