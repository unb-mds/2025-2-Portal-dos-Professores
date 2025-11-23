import { HStack, Box, Text, useColorModeValue } from "@chakra-ui/react";

export default function StepIndicator({ currentStep, totalSteps }) {
  const active = useColorModeValue("blue.600", "blue.300");
  const inactive = useColorModeValue("gray.200", "gray.700");
  const text = useColorModeValue("gray.700", "gray.200");

  return (
    <HStack spacing={2} align="center" justify="center">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
        <Box key={step} textAlign="center">
          <Box
            w="28px"
            h="28px"
            borderRadius="full"
            bg={step <= currentStep ? active : inactive}
            color="white"
            fontSize="sm"
            fontWeight="bold"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            {step}
          </Box>
          <Text mt={1} fontSize="xs" color={text}>
            {step === currentStep ? "atual" : ""}
          </Text>
        </Box>
      ))}
    </HStack>
  );
}
