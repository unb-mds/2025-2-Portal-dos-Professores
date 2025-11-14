name: CI Build and Test (Atividade MDS)

on:
  push:
    branches: [ "main" ]
  pull_request:
    branches: [ "main" ]

jobs:
  build-and-test:
    runs-on: ubuntu-latest

    steps:
    # 1. Baixa o código
    - uses: actions/checkout@v4

    # 2. Configura o Python
    - name: Set up Python 3.8
      uses: actions/setup-python@v5
      with:
        python-version: "3.8"

    # 3. Instala SÓ o Pytest (Ignora o requirements.txt estragado)
    - name: Install dependencies
      run: |
        python -m pip install --upgrade pip
        pip install pytest
            
    # 4. Roda os 5 testes que criaste
    - name: Run automated tests
      run: |
        pytest tests/test_activity_unb.py
