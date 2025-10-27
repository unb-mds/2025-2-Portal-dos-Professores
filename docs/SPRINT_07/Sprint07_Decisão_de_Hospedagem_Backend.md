# 📚 Estudo e Recomendação: Hospedagem de Projeto (Backend/IA)

## 1. Descrição

Este estudo foi realizado para definir a plataforma de hospedagem para o backend (FastAPI) e o agente de IA do projeto.

## 2. Análise de Requisitos (Descobertas)

Após análise local do projeto (`docker stats`), os requisitos técnicos foram identificados:

* **Serviços:** O projeto consiste em um único serviço monolítico (FastAPI/Python) que atende tanto como API de backend quanto como motor de inferência do Agente de IA.
* **Recursos (Ocioso):** Extremamente leve.
    * **CPU:** ~0.20%
    * **RAM:** ~38-40 MiB
* **Dependências de IA:** O agente é leve (provavelmente `scikit-learn` ou similar) e **não requer GPU**.
* **Banco de Dados:** O projeto utiliza arquivos JSON como banco de dados.
* **Requisito Crítico:** Devido ao uso de arquivos JSON como DB, a plataforma de hospedagem **deve** oferecer **Armazenamento de Disco Persistente** (Persistent Storage) para que os dados não sejam perdidos a cada reinicialização ou "deploy".

## 3. Comparativo de Plataformas (PaaS)

| Plataforma | Suporte a Python | Armazenamento Persistente (Tier Gratuito) | Complexidade |
| :--- | :--- | :--- | :--- |
| **Render** | ✅ (Nativo) | ✅ **(Sim, "Persistent Disks")** | Baixa |
| **Railway** | ✅ (Nativo) | ⚠️ (Requer plano pago) | Baixa |
| **Vercel** | ✅ (Serverless) | ❌ **(Não, sistema efêmero)** | Baixa |
| **Heroku** | ✅ (Nativo) | ❌ **(Não no tier gratuito/hobby)** | Média |
| **AWS/GCP/Azure** | ✅ (IaaS/PaaS) | ❌ (Complexo e pago, ex: EBS, Filestore) | Altíssima |

---

## 4. Recomendação e Decisão

**Plataforma Escolhida: [Render](https://render.com/)**

### Justificativa:

O Render é a única plataforma moderna (PaaS) que atende a todos os nossos requisitos no **plano gratuito**:

1.  **Suporte a Python/FastAPI:** Suportado nativamente.
2.  **Custo ($0):** O "Free Tier" é suficiente para nossos requisitos de RAM/CPU (38MiB).
3.  **Armazenamento Persistente:** O "Free Tier" do Render **inclui "Persistent Disks"**, o que resolve perfeitamente nosso requisito de salvar o banco de dados JSON.