import { useState } from "react";
import {
  Box,
  Button,
  Heading,
  Text,
  VStack,
  Wrap,
  WrapItem,
  Input,
  IconButton,
  Tag,
  TagLabel,
  TagCloseButton,
  HStack,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { Plus, X } from "lucide-react";

const topicosSugeridos = [
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

export default function InterestsStep({ value = [], onChange, onNext, onBack }) {
  const [inputValue, setInputValue] = useState("");
  const toast = useToast();

  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const titleColor = useColorModeValue("gray.800", "white");
  const muted = useColorModeValue("gray.600", "gray.400");

  const handleAddTopic = (topic) => {
    if (!topic || topic.trim() === "") return;
    if (value.includes(topic)) {
      toast({
        title: "Tópico já adicionado",
        status: "info",
        duration: 2000,
        isClosable: true,
      });
      return;
    }
    onChange([...value, topic]);
    setInputValue("");
  };

  const handleRemoveTopic = (topicToRemove) => {
    const newTopics = value.filter((t) => t !== topicToRemove);
    onChange(newTopics);
  };

  const toggleSuggestion = (topic) => {
    if (value.includes(topic)) {
      handleRemoveTopic(topic);
    } else {
      handleAddTopic(topic);
    }
  };

  const handleInputSubmit = () => {
    if (inputValue.trim()) {
      handleAddTopic(inputValue.trim());
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleInputSubmit();
    }
  };

  return (
    <VStack spacing={8} align="stretch">
      <VStack spacing={2} textAlign="center">
        <Heading size="lg" color={titleColor}>
          Quais são seus tópicos de interesse? 💡
        </Heading>
        <Text fontSize="md" color={muted}>
          Selecione as áreas que mais te interessam (mínimo 1)
        </Text>
      </VStack>

      {/* Sugestões */}
      <Box>
        <Text fontWeight="bold" mb={3} fontSize="sm" color={muted}>
          Tópicos sugeridos
        </Text>
        <Wrap spacing={3}>
          {topicosSugeridos.map((topic) => {
            const isSelected = value.includes(topic);
            return (
              <WrapItem key={topic}>
                <Button
                  size="sm"
                  variant={isSelected ? "solid" : "outline"}
                  colorScheme={isSelected ? "blue" : "gray"}
                  borderRadius="full"
                  onClick={() => toggleSuggestion(topic)}
                  bg={isSelected ? "blue.600" : "transparent"}
                  color={isSelected ? "white" : muted}
                  borderColor={isSelected ? "blue.600" : borderColor}
                  _hover={{
                    bg: isSelected ? "blue.700" : "gray.50",
                    borderColor: isSelected ? "blue.700" : "gray.400",
                  }}
                  rightIcon={isSelected ? <X size={14} /> : null}
                >
                  {topic}
                </Button>
              </WrapItem>
            );
          })}
        </Wrap>
      </Box>

      {/* Selecionados */}
      {value.length > 0 && (
        <Box 
          p={4} 
          bg={useColorModeValue("gray.50", "gray.700")} 
          borderRadius="lg" 
          borderWidth="1px" 
          borderColor={useColorModeValue("gray.100", "gray.600")}
        >
          <Text fontWeight="bold" mb={3} fontSize="sm" color={muted}>
            Tópicos selecionados ({value.length})
          </Text>
          <Wrap spacing={2}>
            {value.map((topic) => (
              <WrapItem key={topic}>
                <Tag
                  size="md"
                  borderRadius="full"
                  variant="subtle"
                  colorScheme="blue"
                  py={2}
                  px={3}
                >
                  <TagLabel>{topic}</TagLabel>
                  <TagCloseButton onClick={() => handleRemoveTopic(topic)} />
                </Tag>
              </WrapItem>
            ))}
          </Wrap>
        </Box>
      )}

      {/* Input Personalizado (Layout Corrigido) */}
      <Box>
        <Text fontWeight="bold" mb={2} fontSize="sm" color={muted}>
          Adicionar tópico personalizado
        </Text>
        
        {/* Usamos alignItems="flex-start" para o contador não empurrar o botão para baixo */}
        <HStack alignItems="flex-start" spacing={2}>
          <Box flex="1">
            <Input
              placeholder="Ex: Computação Quântica, Bioinformática..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              bg={cardBg}
              borderColor={borderColor}
              borderRadius="md"
              maxLength={50} 
            />
            <Text fontSize="xs" color={muted} mt={1} textAlign="right" mr={1}>
              {inputValue.length}/50
            </Text>
          </Box>
          
          <IconButton
            aria-label="Adicionar"
            icon={<Plus size={20} />}
            onClick={handleInputSubmit}
            colorScheme="gray"
            variant="outline"
            isDisabled={!inputValue.trim()}
          />
        </HStack>
      </Box>

      {/* Navegação */}
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