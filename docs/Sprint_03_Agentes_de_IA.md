# Estudo Dirigido: Agentes de IA para o Portal dos Professores

## 📖 Descrição
Este estudo visa definir e testar agentes de IA responsáveis por analisar, resumir e gerar insights sobre os dados dos professores coletados pelo portal. O fluxo segue as restrições arquiteturais do projeto:

- Frontend hospedado no **GitHub Pages**
- Banco de dados em **arquivos JSON**
- Mineração, análise e geração de resumos executadas via **GitHub Actions**

## 🎯 Objetivos
- Pesquisar e levantar opções de **APIs e modelos de IA** para sumarização e análise qualitativa/quantitativa
- Criar uma **tabela comparativa** com prós, contras, custo e viabilidade de execução no GitHub Actions
- Definir **JSON Schema de saída** dos resultados da IA
- Redigir **decisão técnica (ADR)** sobre qual IA usar
- Implementar **POC mínima** de pipeline: bot lê dados, gera resumos e salva JSON
- Apresentar resultados e protótipo para a equipe

## ✅ Levantamento de APIs e Modelos de IA

Abaixo estão algumas opções viáveis para o projeto:

| Nome / Fonte | Tipo | Prós | Contras | Observações para Actions |
|--------------|------|------|---------|--------------------------|
| **Google Gemini API** | Serviço externo | Alta qualidade de resumo; suporte a português; integração com Google Cloud | Pago; latência; limites de requisição | Usar com chave de API; resumir em batch |
| **Hugging Face Transformers** (BART, T5, mBART) | Open-source | Sem custo de API; flexível; suporte a português via mBART | Modelos grandes consomem muita memória; tempo alto | Modelos menores; cache; limitar tamanho de entrada |
| **OpenAI GPT-3/4 API** | Serviço externo | Excelente qualidade; sumarização abstrativa; suporta português | Pago por token; latência; limites de requisição | Guardar chave como Secret; resumir em batch |
| **GPT-J, GPT-NeoX, BLOOM** | Open-source | Livre; pode rodar localmente | Modelos grandes podem ser lentos; memória alta | Usar versões menores; batch pequeno |
| **Sumy (Python)** | Open-source, extractive summarizer | Leve, rápido | Qualidade abstrativa limitada | Bom para protótipos; pré-processamento |

## ✅ Tabela Comparativa

| Critério | Google Gemini | Hugging Face | OpenAI API | GPT-J / BLOOM | Sumy |
|----------|---------------|--------------|------------|---------------|------|
| Custo | Pago | Gratuito (compute) | Pago | Gratuito | Gratuito |
| Tempo execução | Médio/alto | Médio/alto | Rápido | Médio/alto | Muito rápido |
| Qualidade português | Alta | Médio-alto | Alto | Médio | Baixa |
| Resumo abstrativo | Sim | Sim | Sim | Sim | Não (extractive) |
| Limites Actions | Latência + secret | CPU/memória | Latência + secret | CPU/memória | Nenhum |
| Facilidade integração | API HTTP | Python fácil | API HTTP | Python | Python |

## ✅ JSON Schema de saída para resultados da IA

```json
{
  "professor_id": "string",
  "nome": "string",
  "areas_de_atuacao": ["string"],
  "disciplinas": [
    {
      "nome": "string",
      "anos": [number]
    }
  ],
  "publicacoes": [
    {
      "titulo": "string",
      "ano": number,
      "autores": ["string"],
      "link": "string"
    }
  ],
  "resumo_ia": {
    "texto": "string",
    "estatisticas": {
      "total_publicacoes": number,
      "publicacoes_ultimos_2_anos": number,
      "disciplinas_ativas": number
    },
    "temas_frequentes": ["string"]
  },
  "avaliacao_qualitativa": "string",
  "ultima_atualizacao": "string"
}
