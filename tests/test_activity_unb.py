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
 
    - uses: actions/checkout@v4

    - name: Set up Python 3.8
      uses: actions/setup-python@v5
      with:
        python-version: "3.8"


    - name: Install dependencies
      run: |
        python -m pip install --upgrade pip
        pip install pytest
            
 
    - name: Run automated tests
      run: |
        pytest tests/test_activity_unb.py
