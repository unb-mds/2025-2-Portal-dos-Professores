
export interface Professor {
  id: string;
  siape: string;
  nome: string;
  departamento: string;
  campus: string;
  fotoUrl: string;
  email: string;
  areasPesquisa: string[];
  artigos?: any[];
  disciplinas?: any[];
}