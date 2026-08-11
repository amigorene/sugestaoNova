let cy;

function desenharGrafo(ucSelecionada) {

    const elementos = [];

    // UC selecionada

    elementos.push({

        data: {
            id: ucSelecionada.codigo,
            label: ucSelecionada.nome
        },

        classes: "selecionada"

    });

    // Recomendações

    ucSelecionada.recomendacoes.forEach(codigo => {

        const recomendada =
            ucs.find(
                item =>
                item.codigo === codigo
            );

        if (!recomendada) return;

        elementos.push({

            data: {
                id: recomendada.codigo,
                label: recomendada.nome
            },

            classes: "recomendada"

        });

        elementos.push({

            data: {
                source: recomendada.codigo,
                target: ucSelecionada.codigo
            }

        });

    });

    // Limpa grafo anterior

    if (cy) {
        cy.destroy();
    }

    cy = cytoscape({

        container:
            document.getElementById("cy"),

        elements: elementos,

        style: [

            // Nós padrão

            {
                selector: "node",

                style: {

                    label: "data(label)",

                    width: 220,
                    height: 90,

                    "font-size": 13,

                    "text-wrap": "wrap",

                    "text-max-width": 200,

                    color: "#FFFFFF",

                    "text-valign": "center",

                    "text-halign": "center",

                    "border-width": 2,

                    "border-color": "#1B4332",

                    "background-color": "#40916C"

                }

            },

            // UC selecionada

            {
                selector: ".selecionada",

                style: {

                    "background-color": "#1B4332",

                    "border-width": 4,

                    "border-color": "#081C15"

                }

            },

            // Recomendações

            {
                selector: ".recomendada",

                style: {

                    "background-color": "#74C69D"

                }

            },

            // Arestas

            {
                selector: "edge",

                style: {

                    width: 4,

                    "curve-style": "bezier",

                    "target-arrow-shape":
                        "triangle",

                    "line-color":
                        "#52B788",

                    "target-arrow-color":
                        "#52B788"

                }

            }

        ],

        layout: {

            name: "breadthfirst",

            directed: true,

            padding: 50,

            spacingFactor: 1.8,

            animate: true

        }

    });

    // Centraliza automaticamente

    cy.fit();

    cy.center();
    cy.on("tap", "node", function(evt) {

    const codigo =
        evt.target.id();

    const uc =
        ucs.find(
            item =>
            item.codigo === codigo
        );

    if (uc) {

        mostrarDetalhes(uc);

    }

});
  
}