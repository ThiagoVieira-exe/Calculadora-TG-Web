// ==========================================================================
// CONFIGURAÇÕES DE PREÇOS, TAXAS E REGRAS DE NEGÓCIO - TG GRÁFICA
// ==========================================================================
const CONFIG = {
  // Taxas fixas e margens
  taxaContabilidade: 2.5,
  taxaFixaDireta: 2.0,
  margemDiretaMultiplicador: 1.15,

  // Tipos de impressão / papéis (preço por folha)
  tiposImpressao: [
    { id: "glossy-frente", nome: "Glossy - Apenas Frente", preco: 0.6 },
    { id: "glossy-frente-verso", nome: "Glossy - Frente e Verso", preco: 0.9 },
    { id: "etiquetas-frente-verso", nome: "Etiquetas - Frente e Verso", preco: 0.7 },
    { id: "offset-180g-frente", nome: "Offset 180g - Apenas Frente", preco: 0.3 },
    { id: "offset-180g-frente-verso", nome: "Offset 180g - Frente e Verso", preco: 0.45 },
    { id: "folhetos-a6-120g-frente", nome: "Folhetos A6 120g - Apenas Frente", preco: 0.07 },
    { id: "offset-300g-frente", nome: "Offset 300g - Apenas Frente", preco: 0.5 },
    { id: "offset-300g-frente-verso", nome: "Offset 300g - Frente e Verso", preco: 0.7 },
  ],

  // Tipos de laminação (preço por folha)
  laminacoes: [
    { id: "sem-laminacao", nome: "Sem Laminação", preco: 0.0, padrao: true },
    { id: "brilho-frente", nome: "Brilho - Apenas Frente", preco: 0.15 },
    { id: "brilho-frente-verso", nome: "Brilho - Frente e Verso", preco: 0.3 },
    { id: "holografico-frente", nome: "Holográfico - Apenas Frente", preco: 0.35 },
    { id: "holografico-frente-verso", nome: "Holográfico - Frente e Verso", preco: 0.7 },
  ],

  // Custos extras por tipo de trabalho
  calcularExtra: function (tipoTrabalho, custoFolha) {
    if (tipoTrabalho === "corte-refile") {
      return custoFolha <= 0.6 ? 3.0 : 4.0;
    }
    if (tipoTrabalho === "folhetos") {
      return 1.0;
    }
    return 0;
  },

  // Tabela de taxas Shopee (comissão + taxa fixa por faixa de preço)
  obterTaxasShopee: function (preco) {
    if (preco <= 79.99) {
      return { percentual: 0.2, taxaFixa: 4.5 };
    }
    if (preco <= 99.99) {
      return { percentual: 0.14, taxaFixa: 16.0 };
    }
    if (preco <= 199.99) {
      return { percentual: 0.14, taxaFixa: 20.0 };
    }
    return { percentual: 0.14, taxaFixa: 26.0 };
  },
};

// ==========================================================================
// FORMATAÇÃO E UTILITÁRIOS
// ==========================================================================
function formatarMoeda(valor) {
  return valor.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

// ==========================================================================
// LÓGICA PRINCIPAL DE CÁLCULO
// ==========================================================================
function calcular() {
  const selectTrabalho = document.getElementById("select-options");
  const selectPreco = document.getElementById("select-precos");
  const selectMultiplicador = document.getElementById("select-options-multiplicador");
  const selectLaminacao = document.getElementById("select-laminacao");
  const inputQuantFolhas = document.getElementById("quant-folhas");
  const inputCustoAdicional = document.getElementById("custo-adicional");

  const vendaDireta = document.getElementById("venda-direta");
  const vendaShopee = document.getElementById("venda-shopee");
  const mensagemValidacao = document.getElementById("mensagem-validacao");

  const tipoTrabalho = selectTrabalho ? selectTrabalho.value : "corte-personalizado";
  const custoFolha = Number(selectPreco ? selectPreco.value : 0);
  const multiplicador = Number(selectMultiplicador ? selectMultiplicador.value : 3);
  const custoLaminacao = Number(selectLaminacao ? selectLaminacao.value : 0);
  const custoAdicional = Number(inputCustoAdicional ? inputCustoAdicional.value : 0) || 0;

  const quantFolhaValor = inputQuantFolhas ? inputQuantFolhas.value.trim() : "";
  const quantFolha = Number(quantFolhaValor);

  // Validação: Quantidade de folhas obrigatória e positiva
  if (!quantFolhaValor || isNaN(quantFolha) || quantFolha <= 0) {
    if (vendaDireta) vendaDireta.textContent = "0,00";
    if (vendaShopee) vendaShopee.textContent = "0,00";

    if (mensagemValidacao) {
      if (quantFolhaValor !== "" && quantFolha <= 0) {
        mensagemValidacao.textContent = "A quantidade de folhas deve ser maior que zero.";
      } else {
        mensagemValidacao.textContent = "Informe a quantidade de folhas para calcular.";
      }
      mensagemValidacao.style.display = "block";
    }
    return;
  }

  // Limpa mensagens de aviso
  if (mensagemValidacao) {
    mensagemValidacao.textContent = "";
    mensagemValidacao.style.display = "none";
  }

  // 1. Custos extras por tipo de trabalho
  const extra = CONFIG.calcularExtra(tipoTrabalho, custoFolha);

  // 2. Custo de produção
  const custoBase = (custoFolha + custoLaminacao) * quantFolha + extra;

  // 3. Multiplicador da gráfica
  const base = custoBase * multiplicador;

  // 4. Venda Direta / Site
  const calculoDireta =
    (base + CONFIG.taxaFixaDireta + custoAdicional + CONFIG.taxaContabilidade) *
    CONFIG.margemDiretaMultiplicador;

  // 5. Venda Shopee (Ponto fixo / convergência das faixas de comissão)
  const custoTotal = base + custoAdicional + CONFIG.taxaContabilidade;
  let precoShopee = custoTotal;

  for (let i = 0; i < 20; i++) {
    const taxas = CONFIG.obterTaxasShopee(precoShopee);
    precoShopee = (custoTotal + taxas.taxaFixa) / (1 - taxas.percentual);
  }

  // 6. Arredondamento para cima em inteiros
  const precoDiretaFinal = Math.ceil(calculoDireta);
  const precoShopeeFinal = Math.ceil(precoShopee);

  // 7. Atualização no DOM
  if (vendaDireta) vendaDireta.textContent = formatarMoeda(precoDiretaFinal);
  if (vendaShopee) vendaShopee.textContent = formatarMoeda(precoShopeeFinal);
}

// ==========================================================================
// FUNÇÕES DOS BOTÕES (LIMPAR E COPIAR)
// ==========================================================================
function limparCampos() {
  const selectTrabalho = document.getElementById("select-options");
  const selectMultiplicador = document.getElementById("select-options-multiplicador");
  const selectPreco = document.getElementById("select-precos");
  const selectLaminacao = document.getElementById("select-laminacao");
  const inputQuantFolhas = document.getElementById("quant-folhas");
  const inputCustoAdicional = document.getElementById("custo-adicional");
  const mensagemValidacao = document.getElementById("mensagem-validacao");

  if (selectTrabalho) selectTrabalho.selectedIndex = 0;
  if (selectMultiplicador) selectMultiplicador.value = "3";
  if (selectPreco) selectPreco.selectedIndex = 0;
  if (selectLaminacao) selectLaminacao.value = "0";
  if (inputQuantFolhas) inputQuantFolhas.value = "";
  if (inputCustoAdicional) inputCustoAdicional.value = "";

  if (mensagemValidacao) {
    mensagemValidacao.textContent = "";
    mensagemValidacao.style.display = "none";
  }

  calcular();

  if (inputQuantFolhas) {
    inputQuantFolhas.focus();
  }
}

function copiarOrcamento() {
  const inputQuantFolhas = document.getElementById("quant-folhas");
  const quantFolhaValor = inputQuantFolhas ? inputQuantFolhas.value.trim() : "";
  const quantFolha = Number(quantFolhaValor);
  const mensagemValidacao = document.getElementById("mensagem-validacao");

  // Validação: precisa ter folhas preenchidas para copiar
  if (!quantFolhaValor || isNaN(quantFolha) || quantFolha <= 0) {
    if (mensagemValidacao) {
      mensagemValidacao.textContent = "Preencha a quantidade de folhas antes de copiar o orçamento.";
      mensagemValidacao.style.display = "block";
    }
    if (inputQuantFolhas) inputQuantFolhas.focus();
    return;
  }

  const selectTrabalho = document.getElementById("select-options");
  const selectPreco = document.getElementById("select-precos");
  const selectLaminacao = document.getElementById("select-laminacao");
  const vendaDireta = document.getElementById("venda-direta");
  const vendaShopee = document.getElementById("venda-shopee");

  const trabalho = selectTrabalho ? selectTrabalho.options[selectTrabalho.selectedIndex].text : "";
  const papel = selectPreco ? selectPreco.options[selectPreco.selectedIndex].text : "";
  const laminacao = selectLaminacao ? selectLaminacao.options[selectLaminacao.selectedIndex].text : "";
  const valorSite = vendaDireta ? vendaDireta.textContent : "0,00";
  const valorShopee = vendaShopee ? vendaShopee.textContent : "0,00";

  // Modelo solicitado:
  // Orçamento TG Gráfica:
  // Trabalho: [Trabalho]
  // Papel: [Papel]
  // Laminação: [Laminação]
  // Valor Site: R$ [valorSite] | Shopee: R$ [valorShopee]
  const textoOrcamento = [
    "Orçamento TG Gráfica:",
    `Trabalho: ${trabalho}`,
    `Papel: ${papel}`,
    `Laminação: ${laminacao}`,
    `Valor Site: R$ ${valorSite} | Shopee: R$ ${valorShopee}`,
  ].join("\n");

  const btnCopiar = document.getElementById("btn-copiar");

  const feedbackSucesso = () => {
    if (btnCopiar) {
      const textoOriginal = btnCopiar.textContent;
      btnCopiar.textContent = "Copiado! ✓";
      btnCopiar.classList.add("btn-copiado");

      setTimeout(() => {
        btnCopiar.textContent = textoOriginal;
        btnCopiar.classList.remove("btn-copiado");
      }, 2000);
    }
  };

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard
      .writeText(textoOrcamento)
      .then(feedbackSucesso)
      .catch(() => {
        copiarFallback(textoOrcamento);
        feedbackSucesso();
      });
  } else {
    copiarFallback(textoOrcamento);
    feedbackSucesso();
  }
}

function copiarFallback(texto) {
  const textarea = document.createElement("textarea");
  textarea.value = texto;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}

// ==========================================================================
// INICIALIZAÇÃO DINÂMICA E EVENTOS
// ==========================================================================
function popularSelects() {
  const selectPrecos = document.getElementById("select-precos");
  const selectLaminacao = document.getElementById("select-laminacao");

  if (selectPrecos && CONFIG.tiposImpressao.length) {
    const valorAtual = selectPrecos.value;
    selectPrecos.innerHTML = CONFIG.tiposImpressao
      .map((item) => `<option value="${item.preco}">${item.nome}</option>`)
      .join("");
    if (valorAtual) {
      selectPrecos.value = valorAtual;
    }
  }

  if (selectLaminacao && CONFIG.laminacoes.length) {
    const valorAtual = selectLaminacao.value;
    selectLaminacao.innerHTML = CONFIG.laminacoes
      .map(
        (item) =>
          `<option value="${item.preco}" ${item.padrao ? "selected" : ""}>${item.nome}</option>`
      )
      .join("");
    if (valorAtual) {
      selectLaminacao.value = valorAtual;
    }
  }
}

function registrarEventos() {
  const elementos = [
    "select-options",
    "select-options-multiplicador",
    "select-precos",
    "select-laminacao",
    "quant-folhas",
    "custo-adicional",
  ];

  elementos.forEach((id) => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener("input", calcular);
      el.addEventListener("change", calcular);
    }
  });

  // Atualiza ano no rodapé
  const spanAno = document.getElementById("ano-atual");
  if (spanAno) {
    spanAno.textContent = new Date().getFullYear();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  popularSelects();
  registrarEventos();
  calcular();
});
