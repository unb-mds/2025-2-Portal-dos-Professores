FROM python:3.13-slim

LABEL maintainer="Caio Lacerda"

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt
# RUN playwright install chromium # Ou firefox, webkit

COPY . .

# CMD ["python", "data_miner_server.py"]