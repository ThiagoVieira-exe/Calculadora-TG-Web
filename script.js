function calcular() {
  const tipoTrabalho = document.getElementById("select-options").value;

  const custoFolha = Number(document.getElementById("select-precos").value);

  const quantFolha = Number(document.getElementById("quant-folhas").value);

  const multiplicador = Number(
    document.getElementById("select-options-multiplicador").value,
  );

  const vendaDireta = document.getElementById("venda-direta");
  const vendaShopee = document.getElementById("venda-shopee");

  const custoLaminacao = Number(
    document.getElementById("select-laminacao").value,
  );

  const custoAdicional =
    Number(document.getElementById("custo-adicional").value) || 0;

  const TAXA_CONTABILIDADE = 2.5;

  let extra = 0;

  // Custos extras por tipo de trabalho
  if (tipoTrabalho === "corte-personalizado") {
    extra = custoFolha <= 0.6 ? 3 : 4;
  } else if (tipoTrabalho === "folhetos") {
    extra = 1;
  } else if (tipoTrabalho === "corte-54x90mm") {
    extra = custoFolha <= 0.6 ? 2 : 3;
  }

  // Custo de produção
  const custoBase = (custoFolha + custoLaminacao) * quantFolha + extra;

  // Multiplicador original da gráfica
  const base = custoBase * multiplicador;


  // ======================
  // VENDA DIRETA
  // ======================

  const calculoDireta = (base + 2 + custoAdicional + TAXA_CONTABILIDADE) * 1.15;

  // ======================
  // SHOPEE
  // ======================

  function obterTaxasShopee(preco) {
    if (preco <= 79.99) {
      return {
        percentual: 0.2,
        taxaFixa: 4,
      };
    }

    if (preco <= 99.99) {
      return {
        percentual: 0.14,
        taxaFixa: 16,
      };
    }

    if (preco <= 199.99) {
      return {
        percentual: 0.14,
        taxaFixa: 20,
      };
    }

    if (preco <= 499.99) {
      return {
        percentual: 0.14,
        taxaFixa: 26,
      };
    }

    return {
      percentual: 0.14,
      taxaFixa: 26,
    };
  }

  const custoTotal = base + custoAdicional + TAXA_CONTABILIDADE;
  

  let precoShopee = custoTotal;

  // Descobre automaticamente a faixa correta
  for (let i = 0; i < 20; i++) {
    const taxas = obterTaxasShopee(precoShopee);

    precoShopee = (custoTotal + taxas.taxaFixa) / (1 - taxas.percentual);
  }

  // Exibição formatada

  // Arredonda sempre para cima
  const precoDiretaFinal = Math.ceil(calculoDireta);
  const precoShopeeFinal = Math.ceil(precoShopee);

  vendaDireta.innerHTML = precoDiretaFinal.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  vendaShopee.innerHTML = precoShopeeFinal.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
