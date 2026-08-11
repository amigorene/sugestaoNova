let ucs = [];
window.ucAtual = null;
let ucsFiltradas = [];
async function carregarDados() {

    try {

        const response =
            await fetch("data/ucs.json");

        ucs =
            await response.json();

        ucsFiltradas = [...ucs];

        preencherCursos();

        preencherAreas();

        renderizarLista(ucs);

        configurarBusca();

        configurarFiltros();

    }

    catch (erro) {

        console.error(
            "Erro ao carregar JSON:",
            erro
        );

    }

}

function renderizarLista(lista) {

    const container =
        document.getElementById("listaUCs");

    container.innerHTML = "";

    lista.forEach(uc => {

        const div =
            document.createElement("div");

        div.className =
            "uc-item";

        div.innerHTML = `
            <strong>${uc.codigo}</strong><br>
            ${uc.nome}
        `;

        div.addEventListener(
            "click",
            () => mostrarDetalhes(uc)
        );

        container.appendChild(div);

    });

}

function mostrarDetalhes(uc) {
    window.ucAtual = uc;
    desenharGrafo(uc);
    const painel =
        document.getElementById("detalhesUC");

    painel.innerHTML = `

        <h3>${uc.nome}</h3>

        <hr>

        <div class="info-bloco">

            <strong>Código:</strong>
            ${uc.codigo}

        </div>

        <div class="info-bloco">

            <strong>Área:</strong>
            ${uc.area}

        </div>

        <div class="info-bloco">

            <strong>Descrição:</strong><br>
            ${uc.descricao}

        </div>

        <div class="info-bloco">

            <strong>Carga Horária</strong>

            <ul>

                <li>
                    Teórica:
                    ${uc.carga_horaria.teorica} h
                </li>

                <li>
                    Prática:
                    ${uc.carga_horaria.pratica} h
                </li>

                <li>
                    Extensão:
                    ${uc.carga_horaria.extensao} h
                </li>

                <li>
                    Total:
                    ${uc.carga_horaria.total} h
                </li>

            </ul>

        </div>

        <div class="info-bloco">

            <strong>Oferta</strong>

            <ul>

                ${uc.ofertas.map(oferta => `
                    <li>
                        ${oferta.curso}
                        -
                        ${oferta.semestre}º semestre
                    </li>
                `).join("")}

            </ul>

        </div>

        <div class="info-bloco">

            <strong>Recomendações</strong>

            <ol>

                ${uc.recomendacoes.map(codigo => {

                    const recomendada =
                        ucs.find(
                            item =>
                            item.codigo === codigo
                        );

                    return `
                        <li>
                            ${recomendada ?
                              recomendada.nome :
                              codigo}
                        </li>
                    `;

                }).join("")}

            </ol>

        </div>

        <div class="info-bloco">

            <strong>Observações</strong>

            <ul>

                ${uc.observacoes.map(obs => `
                    <li>${obs}</li>
                `).join("")}

            </ul>

        </div>

    `;

}
function preencherCursos() {

    const select =
        document.getElementById("cursoSelect");

    const cursos = new Set();

    ucs.forEach(uc => {

        uc.ofertas.forEach(oferta => {

            cursos.add(oferta.curso);

        });

    });

    cursos.forEach(curso => {

        const option =
            document.createElement("option");

        option.value = curso;

        option.textContent = curso;

        select.appendChild(option);

    });

}

function preencherAreas() {

    const select =
        document.getElementById("areaSelect");

    const areas = new Set();

    ucs.forEach(uc => {

        areas.add(uc.area);

    });

    areas.forEach(area => {

        const option =
            document.createElement("option");

        option.value = area;

        option.textContent = area;

        select.appendChild(option);

    });

}

function configurarFiltros() {

    document
        .getElementById("cursoSelect")
        .addEventListener(
            "change",
            aplicarFiltros
        );

    document
        .getElementById("areaSelect")
        .addEventListener(
            "change",
            aplicarFiltros
        );

}

function aplicarFiltros() {

    const curso =
        document
        .getElementById("cursoSelect")
        .value;

    const area =
        document
        .getElementById("areaSelect")
        .value;

    const resultado =
        ucs.filter(uc => {

            const atendeCurso =
                curso === "" ||

                uc.ofertas.some(
                    oferta =>
                    oferta.curso === curso
                );

            const atendeArea =
                area === "" ||

                uc.area === area;

            return (
                atendeCurso &&
                atendeArea
            );

        });

    renderizarLista(resultado);

}
window.onload =
    carregarDados;