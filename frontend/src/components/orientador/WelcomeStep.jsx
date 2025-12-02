import {
  Box,
  Button,
  Heading,
  Input,
  Text,
  VStack,
  useColorModeValue,
  HStack,
} from "@chakra-ui/react";

export default function WelcomeStep({ value, onChange, onNext }) {
  const cardBg = useColorModeValue("white", "gray.800");
  const titleColor = useColorModeValue("gray.800", "white");
  const mutedColor = useColorModeValue("gray.600", "gray.400");
  const inputBg = useColorModeValue("gray.50", "gray.700");

  const canContinue = value?.trim().length > 0;

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && canContinue) {
      onNext();
    }
  };

  return (
    <VStack spacing={8} align="stretch">
      {/* topo */}
      <VStack spacing={2} textAlign="center">
        <Heading size="lg" color={titleColor}>
          Vamos começar ✨
        </Heading>
        <Text color={mutedColor} fontSize="md">
          Primeiro, me diz seu nome pra eu personalizar as recomendações.
        </Text>
      </VStack>

      {/* card central estilo lovable */}
      <Box
        bg={cardBg}
        p={{ base: 5, md: 7 }}
        borderRadius="xl"
        borderWidth="1px"
        borderColor={useColorModeValue("gray.100", "gray.700")}
        boxShadow="sm"
      >
        <VStack spacing={4} align="stretch">
          <HStack justify="space-between">
            <Text fontSize="sm" color={mutedColor} fontWeight="medium">
              Seu nome
            </Text>
            <Text fontSize="xs" color={mutedColor}>
              {value?.length || 0}/50
            </Text>
          </HStack>

          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ex.: Maria, João, Ana..."
            size="lg"
            bg={inputBg}
            borderRadius="lg"
            maxLength={50}
            borderColor={useColorModeValue("gray.200", "gray.600")}
            _focus={{
              borderColor: "blue.500",
              boxShadow: "0 0 0 1px #3182ce",
              bg: useColorModeValue("white", "gray.800"),
            }}
          />

          <Button
            size="lg"
            colorScheme="blue"
            borderRadius="lg"
            fontWeight="bold"
            mt={2}
            onClick={onNext}
            isDisabled={!canContinue}
          >
            Continuar →
          </Button>

          {!canContinue && (
            <Text fontSize="xs" color="red.400" textAlign="center">
              Digite seu nome para continuar
            </Text>
          )}
        </VStack>
      </Box>
    </VStack>
  );
}