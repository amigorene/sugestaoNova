function configurarBusca() {

    const campoBusca =
        document.getElementById("searchInput");

    campoBusca.addEventListener(
        "input",
        function () {

            const termo =
                this.value.toLowerCase();

            const filtradas =
                ucs.filter(uc => {

                    const codigo =
                        uc.codigo.toLowerCase();

                    const nome =
                        uc.nome.toLowerCase();

                    const palavras =
                        uc.palavras_chave
                          .join(" ")
                          .toLowerCase();

                    return (
                        codigo.includes(termo) ||
                        nome.includes(termo) ||
                        palavras.includes(termo)
                    );

                });

            renderizarLista(filtradas);

        }
    );

}