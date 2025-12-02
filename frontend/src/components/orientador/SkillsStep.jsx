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

const habilidadesSugeridas = [
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
  "Flutter",
  "Kotlin",
  "Swift",
  "Go",
];

export default function SkillsStep({ value = [], onChange, onNext, onBack }) {
  const [inputValue, setInputValue] = useState("");
  const toast = useToast();

  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const titleColor = useColorModeValue("gray.800", "white");
  const muted = useColorModeValue("gray.600", "gray.400");

  const handleAddSkill = (skill) => {
    if (!skill || skill.trim() === "") return;
    if (value.includes(skill)) {
      toast({
        title: "Habilidade já adicionada",
        status: "info",
        duration: 2000,
        isClosable: true,
      });
      return;
    }
    onChange([...value, skill]);
    setInputValue(""); 
  };

  const handleRemoveSkill = (skillToRemove) => {
    const newSkills = value.filter((s) => s !== skillToRemove);
    onChange(newSkills);
  };

  const toggleSuggestion = (skill) => {
    if (value.includes(skill)) {
      handleRemoveSkill(skill);
    } else {
      handleAddSkill(skill);
    }
  };

  const handleInputSubmit = () => {
    if (inputValue.trim()) {
      handleAddSkill(inputValue.trim());
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
          Quais habilidades técnicas você tem? 🛠️
        </Heading>
        <Text fontSize="md" color={muted}>
          Isso é opcional, mas ajuda a encontrar orientadores alinhados com seu perfil
        </Text>
      </VStack>

      {/* Sugestões */}
      <Box>
        <Text fontWeight="bold" mb={3} fontSize="sm" color={muted}>
          Habilidades sugeridas
        </Text>
        <Wrap spacing={3}>
          {habilidadesSugeridas.map((skill) => {
            const isSelected = value.includes(skill);
            return (
              <WrapItem key={skill}>
                <Button
                  size="sm"
                  variant={isSelected ? "solid" : "outline"}
                  colorScheme={isSelected ? "blue" : "gray"}
                  borderRadius="full"
                  onClick={() => toggleSuggestion(skill)}
                  bg={isSelected ? "blue.600" : "transparent"}
                  color={isSelected ? "white" : muted}
                  borderColor={isSelected ? "blue.600" : borderColor}
                  _hover={{
                    bg: isSelected ? "blue.700" : "gray.50",
                    borderColor: isSelected ? "blue.700" : "gray.400",
                  }}
                  rightIcon={isSelected ? <X size={14} /> : null}
                >
                  {skill}
                </Button>
              </WrapItem>
            );
          })}
        </Wrap>
      </Box>

      {/* Selecionadas */}
      {value.length > 0 && (
        <Box 
          p={4} 
          bg={useColorModeValue("gray.50", "gray.700")} 
          borderRadius="lg" 
          borderWidth="1px" 
          borderColor={useColorModeValue("gray.100", "gray.600")}
        >
          <Text fontWeight="bold" mb={3} fontSize="sm" color={muted}>
            Habilidades selecionadas ({value.length})
          </Text>
          <Wrap spacing={2}>
            {value.map((skill) => (
              <WrapItem key={skill}>
                <Tag
                  size="md"
                  borderRadius="full"
                  variant="subtle"
                  colorScheme="blue"
                  py={2}
                  px={3}
                >
                  <TagLabel>{skill}</TagLabel>
                  <TagCloseButton onClick={() => handleRemoveSkill(skill)} />
                </Tag>
              </WrapItem>
            ))}
          </Wrap>
        </Box>
      )}

      {/* Input Personalizado (Layout Corrigido) */}
      <Box>
        <Text fontWeight="bold" mb={2} fontSize="sm" color={muted}>
          Adicionar habilidade personalizada
        </Text>
        
        {/* Layout Ajustado: Box(Input + Contador) + Botão */}
        <HStack alignItems="flex-start" spacing={2}>
          <Box flex="1">
            <Input
              placeholder="Ex: Kotlin, R, MATLAB..."
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
        >
          {value.length === 0 ? "Pular →" : "Continuar →"}
        </Button>
      </HStack>
    </VStack>
  );
}