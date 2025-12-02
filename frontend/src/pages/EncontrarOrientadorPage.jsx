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

// Importando as funções da API
import { askAgentForRecommendations, getProfessorsData } from "../services/api";

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

  // --- HELPER 1: Formata o nome (Title Case) ---
  const formatName = (name) => {
    if (!name) return "";
    return name
      .toLowerCase()
      .split(' ')
      .map(word => {
        if (["de", "da", "do", "dos", "das", "e"].includes(word)) return word;
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(' ');
  };

  // --- HELPER 2: Normaliza strings para busca ---
  const normalize = (str) => {
    return str ? str.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim() : "";
  };

  // --- HELPER 3: Extrai email com segurança ---
  const extractEmail = (contatos) => {
    if (!contatos) return "Email não disponível";
    if (typeof contatos === 'object' && contatos.email) return contatos.email;
    if (typeof contatos === 'string') return contatos;
    if (Array.isArray(contatos)) {
        const found = contatos.find(c => typeof c === 'string' && c.includes('@'));
        return found || contatos[0] || "Email não disponível";
    }
    return "Email não disponível";
  };

  // --- HELPER 4: Detecta o Campus ---
  const getCampus = (departamento) => {
    if (!departamento) return "UnB - Brasília";
    const dep = departamento.toUpperCase();
    if (dep.includes("GAMA") || dep.includes("FGA")) return "UnB - Gama";
    if (dep.includes("CEILANDIA") || dep.includes("FCE")) return "UnB - Ceilândia";
    if (dep.includes("PLANALTINA") || dep.includes("FUP")) return "UnB - Planaltina";
    return "UnB - Darcy Ribeiro"; 
  };

  // --- HELPER 5: Busca Áreas de Interesse ---
  const extractAreas = (match) => {
    let areas = [];
    if (match.dados_scholar && match.dados_scholar.areas_interesse) {
        areas = match.dados_scholar.areas_interesse;
    } else if (match.areas_interesse) {
        areas = match.areas_interesse;
    } else if (match.areasPesquisa) {
        areas = match.areasPesquisa;
    } else {
        return ["Área sugerida pela IA"];
    }

    // Garante que é array de strings
    if (typeof areas === 'string') return [areas];
    if (Array.isArray(areas)) return areas.filter(a => typeof a === 'string');
    return ["Área sugerida pela IA"];
  };

  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    if (currentStep > 1 && currentStep < totalSteps) setCurrentStep((prev) => prev - 1);
  };

  // --- LÓGICA DE INTEGRAÇÃO ---
  const handleSubmit = async () => {
    setIsLoading(true);
    setCurrentStep(7); 

    try {
      const respostaAgente = await askAgentForRecommendations(formData);
      const recomendacoes = respostaAgente.resposta?.recomendacoes || [];

      if (recomendacoes.length === 0) throw new Error("Sem recomendações da IA.");

      const professoresComDetalhes = await Promise.all(
        recomendacoes.map(async (rec, index) => {
          try {
            const nomeIaLimpo = rec.nome.replace(/(Dr\.|Dra\.|Prof\.|Profa\.|PhD)\s*/gi, "").trim();
            const nomeIaNormalizado = normalize(nomeIaLimpo);

            const resultadosApi = await getProfessorsData({ q: nomeIaLimpo });
            
            const match = resultadosApi.find(prof => {
              const nomeProfNormalizado = normalize(prof.nome);
              return nomeProfNormalizado.includes(nomeIaNormalizado) || 
                     nomeIaNormalizado.includes(nomeProfNormalizado);
            }) || {};

            console.log(`📸 Foto URL para ${match.nome}:`, match.foto_url); // Debug da foto

            // === LÓGICA DA FOTO ===
            // Pega a URL de onde estiver disponível
            const urlFoto = match.foto_url || match.foto || match.avatar || null;

            return {
              id: match.id || `ai-${index}`,
              nome: formatName(match.nome || rec.nome),
              departamento: match.departamento || rec.departamento,
              email: extractEmail(match.contatos),
              campus: getCampus(match.departamento),
              areasPesquisa: extractAreas(match),

              // === MAPA DA MINA PARA A FOTO ===
              // Passamos a mesma URL para várias chaves possíveis
              foto: urlFoto,
              foto_url: urlFoto,
              image: urlFoto, 
              src: urlFoto,   
              avatar: urlFoto,

              explicacaoIa: rec.explicacao, 
              encontradoNoBanco: !!match.nome
            };
          } catch (err) {
            console.error(`Erro ao processar ${rec.nome}`, err);
            return {
              id: `fallback-${index}`,
              nome: formatName(rec.nome),
              departamento: rec.departamento,
              email: "Não encontrado",
              campus: "UnB",
              areasPesquisa: [],
              explicacaoIa: rec.explicacao,
              foto: null
            };
          }
        })
      );

      setResults({
        message: "Encontramos os orientadores ideais! 🎉",
        subMessage: "Estes professores combinam com seus interesses e habilidades.",
        professores: professoresComDetalhes,
      });

    } catch (error) {
      console.error("Erro fatal:", error);
      setResults({ 
        error: true, 
        message: "Ocorreu um erro ao processar. Tente novamente." 
      });
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
      case 1: return <WelcomeStep value={formData.nome} onChange={(v) => updateFormData("nome", v)} onNext={handleNext} />;
      case 2: return <CourseStep value={formData.curso} onChange={(v) => updateFormData("curso", v)} onNext={handleNext} onBack={handleBack} />;
      case 3: return <ProjectTypeStep value={formData.tipoProjeto} onChange={(v) => updateFormData("tipoProjeto", v)} onNext={handleNext} onBack={handleBack} />;
      case 4: return <InterestsStep value={formData.topicosInteresse} onChange={(v) => updateFormData("topicosInteresse", v)} onNext={handleNext} onBack={handleBack} />;
      case 5: return <SkillsStep value={formData.habilidadesTecnicas} onChange={(v) => updateFormData("habilidadesTecnicas", v)} onNext={handleNext} onBack={handleBack} />;
      case 6: return <ReviewStep formData={formData} onEdit={handleEdit} onSubmit={handleSubmit} onBack={handleBack} />;
      case 7: return <ResultsStep isLoading={isLoading} results={results} onReset={handleReset} onBack={() => navigate("/professores")} />;
      default: return null;
    }
  };

  const pageBg = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");

  return (
    <Box bg={pageBg} minH="calc(100vh - 60px)" py={{ base: 8, md: 12 }}>
      <Container maxW="container.md">
        <VStack spacing={6} align="stretch">
          <Box textAlign="center">
            <Heading as="h1" size={{ base: '2xl', md: '3xl' }} mb={2} color="blue.800" fontWeight="bold" letterSpacing="tight">
              🎓 Encontre seu Orientador Ideal
            </Heading>
            <Text color="gray.600" fontSize={{ base: 'md', md: 'lg' }}>
              Nossa IA analisa seu perfil e sugere os melhores professores para você.
            </Text>
          </Box>
          {currentStep < 7 && <StepIndicator currentStep={currentStep} totalSteps={6} />}
          <Box bg={cardBg} p={{ base: 5, md: 7 }} borderRadius="2xl" boxShadow="md">
            {renderStep()}
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}