import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";

import StepIndicator from "../components/orientador/StepIndicator";
import WelcomeStep from "../components/orientador/WelcomeStep";
import CourseStep from "../components/orientador/CourseStep";
import ProjectTypeStep from "../components/orientador/ProjectTypeStep";
import InterestsStep from "../components/orientador/InterestsStep";
import SkillsStep from "../components/orientador/SkillsStep";
import ReviewStep from "../components/orientador/ReviewStep";
import ResultsStep from "../components/orientador/ResultsStep";

export default function EncontrarOrientadorPage() {
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);

  const [formData, setFormData] = useState({
    nome: "",
    curso: "",
    tipoProjeto: "",
    topicosInteresse: [],
    habilidadesTecnicas: [],
  });

  const totalSteps = 7;

  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1 && currentStep < totalSteps) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setCurrentStep(7);

    try {
      // TODO: trocar por chamada real da API
      await new Promise((resolve) => setTimeout(resolve, 2500));

      const mockResults = {
        message: "Encontramos os melhores orientadores para você!",
        professores: [
          {
            id: "1",
            nome: "Dr. João Silva",
            departamento: "Ciência da Computação",
            email: "joao.silva@unb.br",
            campus: "Darcy Ribeiro",
            areasPesquisa: ["Inteligência Artificial", "Machine Learning"],
          },
          {
            id: "2",
            nome: "Dra. Maria Santos",
            departamento: "Engenharia Elétrica",
            email: "maria.santos@unb.br",
            campus: "Darcy Ribeiro",
            areasPesquisa: ["IoT", "Sistemas Embarcados"],
          },
        ],
      };

      setResults(mockResults);
    } catch (error) {
      console.error("Erro ao buscar orientadores:", error);
      setResults({ error: true, message: "Erro ao buscar orientadores" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setCurrentStep(1);
    setResults(null);
    setFormData({
      nome: "",
      curso: "",
      tipoProjeto: "",
      topicosInteresse: [],
      habilidadesTecnicas: [],
    });
  };

  const handleEdit = (step) => setCurrentStep(step);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <WelcomeStep
            value={formData.nome}
            onChange={(value) => updateFormData("nome", value)}
            onNext={handleNext}
          />
        );
      case 2:
        return (
          <CourseStep
            value={formData.curso}
            onChange={(value) => updateFormData("curso", value)}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <ProjectTypeStep
            value={formData.tipoProjeto}
            onChange={(value) => updateFormData("tipoProjeto", value)}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 4:
        return (
          <InterestsStep
            value={formData.topicosInteresse}
            onChange={(value) => updateFormData("topicosInteresse", value)}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 5:
        return (
          <SkillsStep
            value={formData.habilidadesTecnicas}
            onChange={(value) =>
              updateFormData("habilidadesTecnicas", value)
            }
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 6:
        return (
          <ReviewStep
            formData={formData}
            onEdit={handleEdit}
            onSubmit={handleSubmit}
            onBack={handleBack}
          />
        );
      case 7:
        return (
          <ResultsStep
            isLoading={isLoading}
            results={results}
            onReset={handleReset}
            onBack={() => navigate("/professores")}
          />
        );
      default:
        return null;
    }
  };

  const pageBg = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const titleColor = useColorModeValue("blue.800", "blue.100");
  const mutedColor = useColorModeValue("gray.600", "gray.400");

  return (
    <Box bg={pageBg} minH="calc(100vh - 60px)" py={{ base: 8, md: 12 }}>
      <Container maxW="container.md">
        <VStack spacing={6} align="stretch">
          <Box textAlign="center">
            <Heading size="xl" mb={2} color={titleColor}>
              🎓 Encontre seu Orientador Ideal
            </Heading>
            <Text color={mutedColor} fontSize="lg">
              Nossa IA analisa seu perfil e sugere os melhores professores para você.
            </Text>
          </Box>

          {currentStep < 7 && (
            <StepIndicator currentStep={currentStep} totalSteps={6} />
          )}

          <Box
            bg={cardBg}
            p={{ base: 5, md: 7 }}
            borderRadius="2xl"
            boxShadow="md"
          >
            {renderStep()}
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}
