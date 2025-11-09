
import { Professor } from "../types/professor";

// Um professor sozinho, para testes
export const professorMockData: Professor = {
  id: "1281464",
  siape: "1281464",
  nome: "ALESSANDRO BORGES DE SOUSA OLIVEIRA",
  departamento: "FACULDADE DE CIÊNCIAS E TECNOLOGIAS EM ENGENHARIA",
  campus: "CAMPUS UNB GAMA",
  fotoUrl: "https://placehold.co/100x100/F2F4F8/3B82F6?text=AO", 
  email: "alessandro.oliveira@unb.br",
  areasPesquisa: ["IA", "Robótica", "Sistemas Embarcados"],
  artigos: [{ titulo: "Artigo 1" }, { titulo: "Artigo 2" }],
  disciplinas: [{ nome: "MDS" }, { nome: "Linguagens" }],
};

// Uma lista de professores, para mostrar vários cards
export const professorListMock: Professor[] = [
    professorMockData,
    {
        id: "9876543",
        siape: "9876543",
        nome: "CARLA ROCHA FERREIRA",
        departamento: "DEP. ENGENHARIA DE SOFTWARE",
        campus: "CAMPUS DARCY RIBEIRO",
        fotoUrl: "https://placehold.co/100x100/FFF0F5/8A2BE2?text=CR",
        email: "carla.rocha@unb.br",
        areasPesquisa: ["Métodos Ágeis", "DevOps"],
        artigos: [{ titulo: "Artigo 3" }],
        disciplinas: [{ nome: "Qualidade" }],
    },
    {
        id: "5555555",
        siape: "5555555",
        nome: "PAULO SERGIO",
        departamento: "FACULDADE DE COMUNICAÇÃO",
        campus: "CAMPUS DARCY RIBEIRO",
        fotoUrl: "https://placehold.co/100x100/F0F0F0/333333?text=PS",
        email: "paulo.sergio@unb.br",
        areasPesquisa: ["Jornalismo de Dados"],
        artigos: [],
        disciplinas: [{ nome: "Comunicação" }],
    },
];