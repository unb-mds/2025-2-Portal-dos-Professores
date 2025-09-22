import json
import datetime

def main():
    print("Executando script de teste...")
    data = {
        "last_updated": datetime.datetime.now().isoformat(),
        "message": "Olá do script Python!"
    }
    with open("/app/data/professors.json", "w") as f:
        json.dump(data, f, indent=4, ensure_ascii=False)
    print("JSON de teste gerado com sucesso!")

if __name__ == "__main__":
    main()