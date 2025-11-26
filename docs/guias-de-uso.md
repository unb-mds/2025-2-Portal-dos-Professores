# 📚 Guia de Uso do Projeto – Portal de Professores da UnB  

## 🚀 1. Executando a Aplicação Completa (Docker)  
A maneira mais simples de rodar o projeto (Frontend + Backend) é utilizando Docker.  

### **Pré-requisitos**  
- Docker Desktop instalado e rodando.  

### **Passo a Passo**  1. Clone o repositório e entre na pasta raiz.  
2. Execute:  
```bash
docker-compose up --build
```  
3. Após o build, acesse:  
- **Frontend:** http://localhost:5173  
- **Backend (Swagger):** http://localhost:8000/docs  

---  
## 🕷️ 2. Executando os Scrapers (Coleta de Dados)  
Os scrapers alimentam `data/professors.json` via linha de comando.  

> ⚠️ É necessário ter Python + ambiente virtual ativado.  

### **Criar e ativar venv**  
```bash
python -m venv venv
# Windows
.\venv\Scripts\activate
# Linux/Macsource venv/bin/activate\
n```
### **Instalar dependências**  
```bashpip install -r requirements-dev.txt
```  

### 🔄 **Estratégia de Coleta (Pipeline)**  
1. **SIGAA (Radar):** encontra professores novos/atualizados.  
2. **Lattes (Enriquecimento):** baixa currículos apenas para quem falta.  
3. **Google Scholar (Métricas):** busca citações apenas para quem falta.  

---  
## 📡 SIGAA (Fonte da Verdade)  
### Rodar para TODOS os departamentos (demorado):  
```bash
python backend/scraper_runner.py --sigaa
```  
### Rodar para UM departamento:  
```bash
python backend/scraper_runner.py --sigaa-dept "INSTITUTO DE FÍSICA - BRASÍLIA"
```  

---  
## 📝 Plataforma Lattes  
### Preencher dados faltantes (Pipeline):  
```bash
python backend/scraper_runner.py --lattes-missing
```  
### Forçar atualização de um departamento:  
```bash
python backend/scraper_runner.py --lattes-dept "FACULDADE DE ARQUITETURA E URBANISMO - BRASÍLIA"
```  
### Modo híbrido (Departamento + Missing):  
```bash
python backend/scraper_runner.py --lattes-dept "FACULDADE DE ARQUITETURA E URBANISMO - BRASÍLIA" --missing
```  

---  
## 🎓 Google Scholar  
### Preencher métricas faltantes:  
```bash
python backend/scraper_runner.py --scholar-missing
```  
### Forçar atualização de um departamento:  
```bash
python backend/scraper_runner.py --scholar-dept "FACULDADE DE ARQUITETURA E URBANISMO - BRASÍLIA"
```  
### Modo híbrido:  
```bash
python backend/scraper_runner.py --scholar-dept "FACULDADE DE ARQUITETURA E URBANISMO - BRASÍLIA" --missing
```  

---  
## 🧪 3. Executando Testes Automatizados  
### Rodar todos os testes:  
```bash
pytest
```  
### Rodar teste específico:  
```bash
pytest tests/modes/test_lattes_update.py
```  
### Cobertura de código:  
```bash
pytest --cov=backend
```  
### Relatório XML para CI/CD:  
```bash
pytest --cov=backend --cov-report=xml
```  
### Gerar badge local:  
```bash
coverage-badge -f -o coverage.svg
```  

---  
## ☁️ 4. Deploy  
### **Backend (API)**  
Deploy automático no Render ao fazer push na branch `main`.  
- **URL:** https://api-portal-dos-professores.onrender.com  

### **Frontend**  
Deploy via **GitHub Pages**, **Vercel** ou **Netlify** (dependendo da configuração do repositório).  
```