import pytest
from unittest.mock import MagicMock, patch
import sys
import os

test_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.abspath(os.path.join(test_dir, '..', '..'))
if project_root not in sys.path:
    sys.path.insert(0, project_root)

from backend.scrapers.scholar_scraper import parse_scholar_profile_page

def test_parse_scholar_profile_page_caminho_feliz(mocker):
    """
    Testa o "caminho feliz" do parser do Scholar.
    """
    mock_page = MagicMock()
    mock_page.url = "https://scholar.google.com/citations?user=FAKE_ID_123&hl=pt-BR"

    mock_interests_locator = MagicMock()
    mock_interests_locator.all_text_contents.return_value = ["   engenharia de software   ", "ia"]

    mock_metrics_table = MagicMock()
    mock_metric_total = MagicMock(); mock_metric_total.text_content.return_value = "100"
    mock_metric_h_index = MagicMock(); mock_metric_h_index.text_content.return_value = "10"
    mock_metric_i10_index = MagicMock(); mock_metric_i10_index.text_content.return_value = "5"
    mock_metric_total_5y = MagicMock(); mock_metric_total_5y.text_content.return_value = "50"
    mock_metric_h_index_5y = MagicMock(); mock_metric_h_index_5y.text_content.return_value = "8"
    mock_metric_i10_index_5y = MagicMock(); mock_metric_i10_index_5y.text_content.return_value = "3"

    def metrics_locator_side_effect(selector):
        if selector == "tr:nth-child(1) > td:nth-child(2)": return mock_metric_total
        if selector == "tr:nth-child(2) > td:nth-child(2)": return mock_metric_h_index
        if selector == "tr:nth-child(3) > td:nth-child(2)": return mock_metric_i10_index
        if selector == "tr:nth-child(1) > td:nth-child(3)": return mock_metric_total_5y
        if selector == "tr:nth-child(2) > td:nth-child(3)": return mock_metric_h_index_5y
        if selector == "tr:nth-child(3) > td:nth-child(3)": return mock_metric_i10_index_5y
        return MagicMock() 

    mock_metrics_table.locator.side_effect = metrics_locator_side_effect

    mock_row_1 = MagicMock()
    mock_title_1 = MagicMock(); mock_title_1.text_content.return_value = "Título do Artigo Teste"
    mock_year_1 = MagicMock(); mock_year_1.text_content.return_value = "2024"
    mock_citations_1 = MagicMock(); mock_citations_1.text_content.return_value = "123"

    mock_authors_div = MagicMock(); mock_authors_div.text_content.return_value = "Autor 1, Autor 2"
    mock_venue_div = MagicMock(); mock_venue_div.text_content.return_value = "Revista Teste, 2024"

    def gray_divs_nth_side_effect(index):
        if index == 0:
            return mock_authors_div
        if index == 1:
            return mock_venue_div
        return MagicMock()

    mock_gray_divs_1 = MagicMock()
    mock_gray_divs_1.nth.side_effect = gray_divs_nth_side_effect

    def row_1_locator_side_effect(selector):
        if selector == ".gsc_a_at": return mock_title_1
        if selector == "td.gsc_a_t .gs_gray": return mock_gray_divs_1 
        if selector == ".gsc_a_y .gsc_a_h": return mock_year_1
        if selector == ".gsc_a_c .gsc_a_ac": return mock_citations_1
        return MagicMock() 

    mock_row_1.locator.side_effect = row_1_locator_side_effect
    
    mock_pub_rows_locator = MagicMock()
    mock_pub_rows_locator.all.return_value = [mock_row_1]

    mock_affil_locator = MagicMock()
    mock_affil_locator.first.text_content.return_value = "Universidade de Brasília (Mock)"

    mock_email_locator = MagicMock()
    mock_email_locator.text_content.return_value = "E-mail confirmado em unb.br"

    def locator_side_effect(selector):
        if selector == "#gsc_prf_int .gsc_prf_inta": return mock_interests_locator
        if selector == "#gsc_rsb_st": return mock_metrics_table
        if selector == "#gsc_a_b tr.gsc_a_tr": return mock_pub_rows_locator
        if selector == ".gsc_prf_il": return mock_affil_locator
        if selector == "#gsc_prf_ivh": return mock_email_locator
        return MagicMock(side_effect=Exception(f"Seletor inesperado: {selector}"))

    mock_page.locator.side_effect = locator_side_effect

    dados_extraidos = parse_scholar_profile_page(mock_page)

    assert dados_extraidos is not None
    assert dados_extraidos["scholar_id"] == "FAKE_ID_123"
    assert dados_extraidos["areas_interesse"] == ["Engenharia De Software", "Ia"]
    
    assert dados_extraidos["metricas_citacao"]["total_citacoes"] == 100
    assert dados_extraidos["metricas_citacao"]["h_index"] == 10
    assert dados_extraidos["metricas_citacao"]["i10_index_5anos"] == 3
    
    assert len(dados_extraidos["publicacoes"]) == 1
    assert dados_extraidos["publicacoes"][0]["titulo"] == "Título do Artigo Teste"

    assert dados_extraidos["publicacoes"][0]["autores"] == "Autor 1, Autor 2"

    assert dados_extraidos["publicacoes"][0]["local"] == "Revista Teste, 2024"
    assert dados_extraidos["publicacoes"][0]["citacoes_artigo"] == 123
    
    assert dados_extraidos["afiliacao_scholar"] == "Universidade de Brasília (Mock)"
    assert dados_extraidos["email_verificado"] == "unb.br"


def test_parse_scholar_page_caminho_triste(mocker):
    """
    Testa o "caminho triste":
    O que acontece se a página estiver vazia ou os seletores falharem?
    """
    mock_page = MagicMock()
    mock_page.locator.side_effect = Exception("Simulação de falha ao encontrar seletor")

    dados_extraidos = parse_scholar_profile_page(mock_page)

    assert dados_extraidos is None