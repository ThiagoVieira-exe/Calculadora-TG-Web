# Calculadora de Orçamentos - TG Gráfica

## Descrição do Projeto

Aplicação web desenvolvida para a **TG Gráfica**, com o objetivo de agilizar e padronizar o cálculo de orçamentos para serviços gráficos personalizados. 

A calculadora realiza a precificação comparativa em tempo real entre dois canais de venda:
1. **Valor Site / Venda Direta**: Venda direta de balcão, site ou via WhatsApp/atendimento próprio.
2. **Venda Shopee**: Venda via marketplace, considerando comissões percentuais e taxas fixas por faixa de preço.

---

## Tecnologias Utilizadas

- **HTML5**: Estruturação semântica e acessível da interface.
- **CSS3 Moderno**: Design responsivo (CSS Grid e Flexbox), tipografia com Google Fonts (`Poppins`), paleta de cores personalizada e sem barras de rolagem indesejadas.
- **JavaScript (ES6+)**: Lógica desacoplada de precificação, cálculo dinâmico reativo e algoritmo de convergência de taxas de marketplace.

---

## Principais Funcionalidades

- **Cálculo Reativo em Tempo Real**: Os preços são calculados automaticamente conforme o usuário altera os campos.
- **Botão "Limpar"**: Redefine os campos para os valores padrão e foca imediatamente no campo de quantidade.
- **Botão "Copiar Orçamento"**: Copia para a área de transferência o resumo do orçamento formatado para envio direto ao cliente (WhatsApp, e-mail ou redes sociais):
  ```text
  Orçamento TG Gráfica:
  Trabalho: Corte Personalizado
  Papel: Glossy - Frente e Verso
  Laminação: Brilho - Apenas Frente
  Valor Site: R$ 38,00 | Shopee: R$ 47,00
  ```
- **Validação de Entradas**: Garante que a quantidade de folhas informada seja válida e maior que zero, evitando cálculos com dados vazios.
- **Tabela Centralizada de Custos (`CONFIG`)**: Todos os insumos (papéis, laminações, taxas contábeis e faixas da Shopee) ficam centralizados no início do arquivo `script.js`, facilitando ajustes de preços sem necessidade de alterar o HTML.
- **Layout 100% Responsivo**: Adaptado para desktops, tablets e celulares (inclusive em telas estreitas com campos adaptáveis).
- **Cartões de Destaque Visual**: Cores temáticas para fácil distinção dos preços de **Valor Site** (azul TG) e **Shopee** (laranja característico).

---

## Como Personalizar Preços e Custos

Para atualizar o valor de papéis, laminações ou taxas da Shopee, abra o arquivo `script.js` e modifique o objeto `CONFIG`:

```javascript
const CONFIG = {
  taxaContabilidade: 2.50,
  taxaFixaDireta: 2.00,
  margemDiretaMultiplicador: 1.15,

  tiposImpressao: [
    { id: "glossy-frente", nome: "Glossy - Apenas Frente", preco: 0.60 },
    // ...
  ],

  laminacoes: [
    { id: "sem-laminacao", nome: "Sem Laminação", preco: 0.00, padrao: true },
    // ...
  ]
};
```

---

## Licença

Este projeto está licenciado sob a licença MIT.
