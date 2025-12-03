import { useState, useEffect } from "react";
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

import { askAgentForRecommendations, getProfessorsData } from "../services/api";

// Chaves para salvar no navegador
const STORAGE_KEY_STEP = "advisor_step";
const STORAGE_KEY_RESULTS = "advisor_results";
const STORAGE_KEY_FORM = "advisor_form";

export default function EncontrarOrientadorPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // 1. INICIALIZAÇÃO COM MEMÓRIA (Lê do storage se existir)
  const [currentStep, setCurrentStep] = useState(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY_STEP);
    return saved ? parseInt(saved) : 1;
  });

  const [results, setResults] = useState(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY_RESULTS);
    return saved ? JSON.parse(saved) : null;
  });

  const [formData, setFormData] = useState(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY_FORM);
    return saved ? JSON.parse(saved) : {
      nome: "",
      curso: "",
      tipoProjeto: "",
      topicosInteresse: [],
      habilidadesTecnicas: [],
    };
  });

  // 2. EFEITO PARA SALVAR AUTOMATICAMENTE (Sempre que mudar, salva)
  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY_STEP, currentStep);
    sessionStorage.setItem(STORAGE_KEY_RESULTS, JSON.stringify(results));
    sessionStorage.setItem(STORAGE_KEY_FORM, JSON.stringify(formData));
  }, [currentStep, results, formData]);

  const totalSteps = 7;

  // --- HELPERS (Mesma lógica anterior) ---
  const formatName = (name) => {
    if (!name) return "";
    return name.toLowerCase().split(' ').map(word => 
      ["de", "da", "do", "dos", "das", "e"].includes(word) ? word : word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const normalize = (str) => str ? str.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim() : "";

  const extractEmail = (contatos) => {
    if (!contatos) return "Email não disponível";
    if (typeof contatos === 'object' && contatos.email) return contatos.email;
    if (typeof contatos === 'string') return contatos;
    if (Array.isArray(contatos)) return contatos.find(c => typeof c === 'string' && c.includes('@')) || contatos[0];
    return "Email não disponível";
  };

  const getCampus = (departamento) => {
    if (!departamento) return "UnB - Brasília";
    const dep = departamento.toUpperCase();
    if (dep.includes("GAMA") || dep.includes("FGA")) return "UnB - Gama";
    if (dep.includes("CEILANDIA") || dep.includes("FCE")) return "UnB - Ceilândia";
    if (dep.includes("PLANALTINA") || dep.includes("FUP")) return "UnB - Planaltina";
    return "UnB - Darcy Ribeiro"; 
  };

  const extractAreas = (match) => {
    let areas = match.dados_scholar?.areas_interesse || match.areas_interesse || match.areasPesquisa || ["Área sugerida pela IA"];
    if (typeof areas === 'string') return [areas];
    if (Array.isArray(areas)) return areas.filter(a => typeof a === 'string');
    return ["Área sugerida pela IA"];
  };

  // Tenta extrair ID da URL do Sigaa
  const extractIdFromUrl = (url) => {
    if (!url) return null;
    const match = url.match(/siape=(\d+)/) || url.match(/\/(\d+)$/);
    return match ? match[1] : null;
  };

  const updateFormData = (field, value) => setFormData((prev) => ({ ...prev, [field]: value }));
  const handleNext = () => setCurrentStep((prev) => prev + 1);
  const handleBack = () => setCurrentStep((prev) => prev - 1);

  // --- SUBMIT ---
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
              return nomeProfNormalizado.includes(nomeIaNormalizado) || nomeIaNormalizado.includes(nomeProfNormalizado);
            }) || {};

            const realId = match.id || match._id || match.siape || match.matricula || extractIdFromUrl(match.pagina_sigaa_url);
            const urlFoto = match.foto_url || match.foto || match.avatar || null;

            return {
              id: realId || `ai-${index}`,
              nome: formatName(match.nome || rec.nome),
              departamento: match.departamento || rec.departamento,
              email: extractEmail(match.contatos),
              campus: getCampus(match.departamento),
              areasPesquisa: extractAreas(match),
              foto: urlFoto,
              foto_url: urlFoto,
              image: urlFoto,
              explicacaoIa: rec.explicacao, 
              encontradoNoBanco: !!realId 
            };
          } catch (err) {
            console.error(err);
            return {
              id: `fallback-${index}`,
              nome: formatName(rec.nome),
              departamento: rec.departamento,
              email: "Não encontrado",
              campus: "UnB",
              areasPesquisa: [],
              explicacaoIa: rec.explicacao,
              encontradoNoBanco: false
            };
          }
        })
      );

      setResults({ message: "Sucesso", professores: professoresComDetalhes });
    } catch (error) {
      console.error(error);
      setResults({ error: true, message: "Erro ao processar recomendações." });
    } finally {
      setIsLoading(false);
    }
  };

  // 3. RESET COM LIMPEZA DE MEMÓRIA
  const handleReset = () => {
    // Limpa o storage
    sessionStorage.removeItem(STORAGE_KEY_STEP);
    sessionStorage.removeItem(STORAGE_KEY_RESULTS);
    sessionStorage.removeItem(STORAGE_KEY_FORM);

    // Reseta o estado local
    setCurrentStep(1);
    setResults(null);
    setFormData({ nome: "", curso: "", tipoProjeto: "", topicosInteresse: [], habilidadesTecnicas: [] });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <WelcomeStep value={formData.nome} onChange={(v) => updateFormData("nome", v)} onNext={handleNext} />;
      case 2: return <CourseStep value={formData.curso} onChange={(v) => updateFormData("curso", v)} onNext={handleNext} onBack={handleBack} />;
      case 3: return <ProjectTypeStep value={formData.tipoProjeto} onChange={(v) => updateFormData("tipoProjeto", v)} onNext={handleNext} onBack={handleBack} />;
      case 4: return <InterestsStep value={formData.topicosInteresse} onChange={(v) => updateFormData("topicosInteresse", v)} onNext={handleNext} onBack={handleBack} />;
      case 5: return <SkillsStep value={formData.habilidadesTecnicas} onChange={(v) => updateFormData("habilidadesTecnicas", v)} onNext={handleNext} onBack={handleBack} />;
      case 6: return <ReviewStep formData={formData} onEdit={(step) => setCurrentStep(step)} onSubmit={handleSubmit} onBack={handleBack} />;
      case 7: return <ResultsStep isLoading={isLoading} results={results} onReset={handleReset} onBack={() => navigate("/professores")} />;
      default: return null;
    }
  };

  return (
    <Box bg={useColorModeValue("gray.50", "gray.900")} minH="calc(100vh - 60px)" py={{ base: 8, md: 12 }}>
      <Container maxW="container.md">
        <VStack spacing={6} align="stretch">
          <Box textAlign="center">
            <Heading as="h1" size={{ base: '2xl', md: '3xl' }} mb={2} color="blue.800">🎓 Encontre seu Orientador Ideal</Heading>
            <Text color="gray.600" fontSize={{ base: 'md', md: 'lg' }}>Nossa IA analisa seu perfil e sugere os melhores professores.</Text>
          </Box>
          {currentStep < 7 && <StepIndicator currentStep={currentStep} totalSteps={6} />}
          <Box bg={useColorModeValue("white", "gray.800")} p={{ base: 5, md: 7 }} borderRadius="2xl" boxShadow="md">
            {renderStep()}
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}