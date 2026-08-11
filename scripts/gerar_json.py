# ==========================================================
# Navegador de Percursos Formativos
#
# Gerador automático do arquivo ucs.json
#
# Autor:
# André Luiz Vizine Pereira
#
# Versão:
# 1.1
#
# ==========================================================

import json
from pathlib import Path

import pandas as pd


# ==========================================================
# CONFIGURAÇÕES
# ==========================================================

BASE_DIR = Path(__file__).resolve().parent.parent

PASTA_EXCEL = BASE_DIR / "excel"

ARQ_DISCIPLINAS = PASTA_EXCEL / "disciplinas.xlsx"
ARQ_OFERTAS = PASTA_EXCEL / "ofertas.xlsx"
ARQ_RECOMENDACOES = PASTA_EXCEL / "recomendacoes.xlsx"

ARQ_JSON = BASE_DIR / "data" / "ucs.json"


# ==========================================================
# LEITURA DAS PLANILHAS
# ==========================================================

def carregar_planilhas():

    print("Lendo planilhas...")

    disciplinas = pd.read_excel(ARQ_DISCIPLINAS)

    ofertas = pd.read_excel(ARQ_OFERTAS)

    recomendacoes = pd.read_excel(ARQ_RECOMENDACOES)

    return disciplinas, ofertas, recomendacoes


# ==========================================================
# VALIDAÇÃO DAS COLUNAS
# ==========================================================

def validar_colunas(df, obrigatorias, nome):

    faltando = []

    for coluna in obrigatorias:

        if coluna not in df.columns:
            faltando.append(coluna)

    if faltando:

        print()

        print("=======================================")
        print("ERRO")
        print("=======================================")

        print()

        print(f"Planilha: {nome}")

        print()

        for coluna in faltando:

            print(f"Coluna obrigatória ausente: {coluna}")

        raise Exception("Planilha inválida.")


# ==========================================================
# VALIDAÇÃO DAS DISCIPLINAS
# ==========================================================

def validar_disciplinas(df):

    obrigatorias = [

        "codigo",
        "nome",
        "area",
        "descricao",
        "teorica",
        "pratica",
        "extensao",
        "total",
        "observacoes",
        "palavras_chave"

    ]

    validar_colunas(df, obrigatorias, "disciplinas.xlsx")

    duplicadas = df[df.duplicated("codigo")]

    if len(duplicadas) > 0:

        print()

        print("=======================================")
        print("ERRO")
        print("=======================================")

        print()

        for codigo in duplicadas["codigo"]:

            print(f"Código duplicado: {codigo}")

        raise Exception("Existem disciplinas duplicadas.")


# ==========================================================
# VALIDAÇÃO DAS OFERTAS
# ==========================================================

def validar_ofertas(ofertas, disciplinas):

    obrigatorias = [

        "codigo",
        "curso",
        "semestre"

    ]

    validar_colunas(ofertas, obrigatorias, "ofertas.xlsx")

    codigos = set(disciplinas["codigo"])

    for _, linha in ofertas.iterrows():

        codigo = linha["codigo"]

        if codigo not in codigos:

            print()

            print("=======================================")
            print("ERRO")
            print("=======================================")

            print()

            print(f"Oferta cadastrada para disciplina inexistente: {codigo}")

            raise Exception("Oferta inválida.")


# ==========================================================
# VALIDAÇÃO DAS RECOMENDAÇÕES
# ==========================================================

def validar_recomendacoes(recomendacoes, disciplinas):

    obrigatorias = [

        "origem",
        "destino",
        "ordem",
        "tipo"

    ]

    validar_colunas(recomendacoes,
                     obrigatorias,
                     "recomendacoes.xlsx")

    codigos = set(disciplinas["codigo"])

    for _, linha in recomendacoes.iterrows():

        origem = linha["origem"]

        destino = linha["destino"]

        if origem not in codigos:

            print()

            print(f"Origem inexistente: {origem}")

            raise Exception()

        if destino not in codigos:

            print()

            print(f"Destino inexistente: {destino}")

            raise Exception()

    # ==========================================================
# MONTAGEM DAS DISCIPLINAS
# ==========================================================

def montar_json(disciplinas,
                ofertas,
                recomendacoes):

    print()

    print("Montando estrutura JSON...")

    lista_ucs = []

    # ------------------------------------------------------
    # percorre todas as disciplinas
    # ------------------------------------------------------

    for _, disc in disciplinas.iterrows():

        codigo = disc["codigo"]

        # ----------------------------------------------
        # Ofertas da disciplina
        # ----------------------------------------------

        ofertas_uc = ofertas[
            ofertas["codigo"] == codigo
        ]

        lista_ofertas = []

        for _, oferta in ofertas_uc.iterrows():

            lista_ofertas.append({

                "curso": oferta["curso"],

                "semestre": int(oferta["semestre"])

            })

        # ----------------------------------------------
        # Recomendações
        # ----------------------------------------------

        recomendacoes_uc = recomendacoes[
            recomendacoes["origem"] == codigo
        ]

        recomendacoes_uc = recomendacoes_uc.sort_values(
            by="ordem"
        )

        lista_recomendacoes = []

        for _, rec in recomendacoes_uc.iterrows():

            lista_recomendacoes.append(
                rec["destino"]
            )

        # ----------------------------------------------
        # Observações
        # ----------------------------------------------

        observacoes = []

        if pd.notna(disc["observacoes"]):

            texto = str(disc["observacoes"]).strip()

            if texto != "":

                observacoes = [texto]

        # ----------------------------------------------
        # Palavras-chave
        # ----------------------------------------------

        palavras = []

        if pd.notna(disc["palavras_chave"]):

            texto = str(disc["palavras_chave"])

            palavras = [

                palavra.strip()

                for palavra in texto.split(";")

                if palavra.strip() != ""

            ]

        # ----------------------------------------------
        # Estrutura final da disciplina
        # ----------------------------------------------

        uc = {

            "codigo": codigo,

            "nome": disc["nome"],

            "area": disc["area"],

            "descricao": disc["descricao"],

            "carga_horaria": {

                "teorica": int(disc["teorica"]),

                "pratica": int(disc["pratica"]),

                "extensao": int(disc["extensao"]),

                "total": int(disc["total"])

            },

            "ofertas": lista_ofertas,

            "observacoes": observacoes,

            "palavras_chave": palavras,

            "recomendacoes": lista_recomendacoes

        }

        lista_ucs.append(uc)

    return lista_ucs

# ==========================================================
# SALVAR JSON
# ==========================================================

def salvar_json(lista_ucs):

    print()

    print("Gravando arquivo JSON...")

    ARQ_JSON.parent.mkdir(parents=True, exist_ok=True)

    with open(
        ARQ_JSON,
        "w",
        encoding="utf-8"
    ) as arquivo:

        json.dump(
            lista_ucs,
            arquivo,
            ensure_ascii=False,
            indent=4
        )

    print()

    print("Arquivo salvo com sucesso!")

    print()

    print(ARQ_JSON)


# ==========================================================
# RELATÓRIO
# ==========================================================

def relatorio(disciplinas,
              ofertas,
              recomendacoes):

    print()

    print("=" * 45)
    print("NAVEGADOR DE PERCURSOS FORMATIVOS")
    print("GERADOR DE JSON")
    print("=" * 45)

    print()

    print(f"Disciplinas   : {len(disciplinas)}")

    print(f"Ofertas       : {len(ofertas)}")

    print(f"Recomendações : {len(recomendacoes)}")

    print()

    print("JSON atualizado com sucesso.")

    print()

    print(f"Arquivo: {ARQ_JSON}")

    print()

    print("=" * 45)


# ==========================================================
# MAIN
# ==========================================================

def main():

    print()

    print("=" * 45)
    print("Gerador do ucs.json")
    print("=" * 45)

    # ----------------------------
    # Leitura
    # ----------------------------

    disciplinas, ofertas, recomendacoes = carregar_planilhas()

    # ----------------------------
    # Validações
    # ----------------------------

    validar_disciplinas(disciplinas)

    validar_ofertas(
        ofertas,
        disciplinas
    )

    validar_recomendacoes(
        recomendacoes,
        disciplinas
    )

    # ----------------------------
    # Montagem
    # ----------------------------

    lista_ucs = montar_json(
        disciplinas,
        ofertas,
        recomendacoes
    )

    # ----------------------------
    # Salvar
    # ----------------------------

    salvar_json(lista_ucs)

    # ----------------------------
    # Relatório
    # ----------------------------

    relatorio(
        disciplinas,
        ofertas,
        recomendacoes
    )


# ==========================================================
# EXECUÇÃO
# ==========================================================

if __name__ == "__main__":

    main()    