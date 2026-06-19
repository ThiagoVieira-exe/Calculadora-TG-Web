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
  const custoAdicional =
    Number(document.getElementById("custo-adicional").value) || 0;

  let extra = 0;
  // const TAXA_CONTABILIDADE = 2.5

  if (tipoTrabalho === "corte-personalizado") {
    extra = custoFolha <= 0.6 ? 3 : 4;
  } else if (tipoTrabalho === "folhetos") {
    extra = 1;
  } else if (tipoTrabalho === "corte-54x90mm") {
    extra = custoFolha <= 0.6 ? 2 : 3;
  }

  let custoBase = (custoFolha + custoLaminacao) * quantFolha + extra;

  let base = custoBase * multiplicador;

  if (quantFolha >= 15 && tipoTrabalho != "folhetos") {
    base += quantFolha / 5;
  }

  const calculoDireta = (base + 2 + custoAdicional) * 1.20; // Loja: +2,00 + 20%
  const calculoShopee = (base + 4 + custoAdicional) * 1.30; // Shopee: +4,00 + 30%

  vendaDireta.innerHTML = Math.round(calculoDireta).toString() + ",00";
  vendaShopee.innerHTML = Math.round(calculoShopee).toString() + ",00";
}
