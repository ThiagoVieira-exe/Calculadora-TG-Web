function calcular() {
  const tipoTrabalho = document.getElementById("select-options").value;
  const custoFolha = Number(document.getElementById("select-precos").value);
  const quantFolha = Number(document.getElementById("quant-folhas").value);
  const multiplicador = Number(
    document.getElementById("select-options-multiplicador").value
  );

  const vendaDireta = document.getElementById("venda-direta");
  const vendaShopee = document.getElementById("venda-shopee");
  const custoLaminacao = Number(
    document.getElementById("select-laminacao").value
  );

  let calculoDireta = 0;
  let calculoShopee = 0;

  function atribuirPrecos(extra) {
    let custoBase = (custoFolha + custoLaminacao) * quantFolha + extra;
    let base = custoBase * multiplicador;

    if (quantFolha >= 15 && tipoTrabalho !== "folhetos") {
      base += quantFolha / 5;
    }

    calculoDireta = (base + 2) * 1.15; // Loja: +2,00 + 15%
    calculoShopee = (base + 4) * 1.25; // Shopee: +4,00 + 25%
  }

  function calcularPreco() {
    if (
      tipoTrabalho === "etiquetas" ||
      tipoTrabalho === "cartao-personalizado" ||
      tipoTrabalho === "adesivos"
    ) {
      atribuirPrecos(custoFolha <= 0.6 ? 3 : 4);
    } else if (tipoTrabalho === "folhetos") {
      atribuirPrecos(1);
    } else if (tipoTrabalho === "cartao-offset180g") {
      atribuirPrecos(custoFolha < 0.4 ? 2 : 3);
    } else if (tipoTrabalho === "cartao-visita") {
      atribuirPrecos(custoFolha <= 0.6 ? 2 : 3);
    }

    vendaDireta.innerHTML = Math.round(calculoDireta).toString() + ",00";
    vendaShopee.innerHTML = Math.round(calculoShopee).toString() + ",00";
  }

  calcularPreco();
}
