window.addEventListener("load", () => {

    document
        .getElementById("btnPDF")
        .addEventListener(
            "click",
            exportarPDF
        );

});

function exportarPDF() {

    const ucAtual = window.ucAtual;

    if (!ucAtual) {

        alert(
            "Selecione uma UC primeiro."
        );

        return;

    }

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();

    let y = 20;

    doc.setFontSize(18);
    doc.text(ucAtual.nome, 10, y);

    y += 10;

    doc.setFontSize(12);

    doc.text(`Código: ${ucAtual.codigo}`, 10, y);

    y += 8;

    doc.text(`Área: ${ucAtual.area}`, 10, y);

    y += 10;

    doc.text("Descrição:", 10, y);

    y += 8;

    doc.text(ucAtual.descricao, 10, y);

    y += 12;

    doc.text("Carga Horária:", 10, y);

    y += 8;

    doc.text(
        `Teórica: ${ucAtual.carga_horaria.teorica} h`,
        15,
        y
    );

    y += 6;

    doc.text(
        `Prática: ${ucAtual.carga_horaria.pratica} h`,
        15,
        y
    );

    y += 6;

    doc.text(
        `Extensão: ${ucAtual.carga_horaria.extensao} h`,
        15,
        y
    );

    y += 6;

    doc.text(
        `Total: ${ucAtual.carga_horaria.total} h`,
        15,
        y
    );

    y += 10;

    doc.text("Ofertas:", 10, y);

    y += 8;

    ucAtual.ofertas.forEach(oferta => {

        doc.text(
            `${oferta.curso} - ${oferta.semestre}º semestre`,
            15,
            y
        );

        y += 6;

    });

    y += 4;

    doc.text("Observações:", 10, y);

    y += 8;

    ucAtual.observacoes.forEach(obs => {

        doc.text(
            `• ${obs}`,
            15,
            y
        );

        y += 6;

    });

    doc.save(
        `${ucAtual.codigo}.pdf`
    );

}