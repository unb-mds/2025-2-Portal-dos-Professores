FROM python:3.13-slim

LABEL maintainer="Caio Lacerda"

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    libnss3 \
    libfontconfig \
    libgbm-dev \
    libasound2 \
    # Dependências comuns para Playwright Chromium em sistemas Debian/Ubuntu
    && rm -rf /var/lib/apt/lists/*


COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt \
    && pip install playwright==1.55.0 --no-cache-dir \
    && playwright install chromium --with-deps # '--with-deps' tenta instalar dependências extras do SO para o navegador


COPY . .

# CMD ["python", "data_miner_server.py"]