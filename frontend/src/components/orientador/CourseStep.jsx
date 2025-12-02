import { useState } from "react";
import {
  Box,
  Button,
  Heading,
  Text,
  VStack,
  SimpleGrid,
  Input,
  Collapse,
  useColorModeValue,
} from "@chakra-ui/react";

export default function CourseStep({ value, onChange, onNext, onBack }) {
  const cardBg = useColorModeValue("white", "gray.800");
  const selectedBg = useColorModeValue("blue.50", "blue.900");
  const borderDefault = useColorModeValue("gray.200", "gray.600");
  const borderSelected = useColorModeValue("blue.400", "blue.300");
  const titleColor = useColorModeValue("gray.800", "white");
  const mutedColor = useColorModeValue("gray.600", "gray.400");

  const cursosPredefinidos = [
    "Engenharia de Software (FGA)",
    "Engenharia Aeroespacial (FGA)",
    "Engenharia Automotiva (FGA)",
    "Engenharia Eletrônica (FGA)",
    "Engenharia de Energia (FGA)",
    "Engenharia Civil (FT)",
    "Ciência da Computação (CIC)",
    "Estatística (EST)",
  ];

  // Verifica se o valor atual é "Outro" ou algo que não está na lista padrão
  const [isOtherSelected, setIsOtherSelected] = useState(
    value && !cursosPredefinidos.includes(value)
  );

  const handleSelection = (curso) => {
    if (curso === "Outro") {
      setIsOtherSelected(true);
      onChange(""); // Limpa o valor para o usuário digitar
    } else {
      setIsOtherSelected(false);
      onChange(curso);
    }
  };

  const handleManualInput = (e) => {
    onChange(e.target.value);
  };

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

      {/* Grid de Opções */}
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
        {cursosPredefinidos.map((curso) => {
          const isSelected = value === curso && !isOtherSelected;
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
              onClick={() => handleSelection(curso)}
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

        {/* Card "Outro" */}
        <Box
          p={5}
          borderRadius="xl"
          borderWidth="2px"
          cursor="pointer"
          bg={isOtherSelected ? selectedBg : cardBg}
          borderColor={isOtherSelected ? borderSelected : borderDefault}
          transition="0.2s"
          _hover={{
            borderColor: borderSelected,
            transform: "translateY(-3px)",
          }}
          onClick={() => handleSelection("Outro")}
        >
          <Text
            fontWeight="semibold"
            fontSize="md"
            color={isOtherSelected ? "blue.600" : titleColor}
          >
            Outro
          </Text>
        </Box>
      </SimpleGrid>

      {/* Campo de Input que aparece suavemente quando "Outro" é selecionado */}
      <Collapse in={isOtherSelected} animateOpacity>
        <Box 
          p={4} 
          bg={useColorModeValue("gray.50", "gray.700")} 
          borderRadius="lg" 
          borderWidth="1px" 
          borderColor={borderSelected}
        >
          <Text mb={2} fontWeight="medium" fontSize="sm" color={mutedColor}>
            Digite o nome do seu curso:
          </Text>
          <Input
            placeholder="Ex: Arquitetura, Direito, Medicina..."
            value={value}
            onChange={handleManualInput}
            bg={cardBg}
            autoFocus
            
            maxLength={100}

            onKeyDown={(e) => {
              if (e.key === "Enter" && value && value.trim().length > 0) {
                onNext();
              }
            }}
          />
        </Box>
      </Collapse>

      {/* Botões de Navegação */}
      <VStack spacing={4} pt={2}>
        <Button
          size="lg"
          colorScheme="blue"
          w="100%"
          borderRadius="lg"
          onClick={onNext} 
          // Desabilita se estiver vazio OU se for "Outro" mas o texto for muito curto
          isDisabled={!value || (isOtherSelected && value.trim().length === 0)}
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