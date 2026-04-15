const financeData = {
  monthlyIncomeItems: [
    { item: "Salary", amount: 98000 },
    { item: "Freelance Consulting", amount: 24000 },
    { item: "Rental Income", amount: 18000 },
    { item: "Dividends & Interest", amount: 8500 }
  ],
  monthlyExpenseItems: [
    { item: "Rent & Utilities", amount: 28500 },
    { item: "Household & Groceries", amount: 14500 },
    { item: "Transport", amount: 6200 },
    { item: "Insurance", amount: 7800 },
    { item: "EMI Payments", amount: 15800 },
    { item: "Lifestyle & Dining", amount: 9200 },
    { item: "Healthcare", amount: 4100 },
    { item: "Investments & Savings", amount: 26000 }
  ],
  budgetTargets: [
    { item: "Rent & Utilities", budget: 30000, actual: 28500 },
    { item: "Household & Groceries", budget: 13500, actual: 14500 },
    { item: "Transport", budget: 7000, actual: 6200 },
    { item: "Insurance", budget: 8000, actual: 7800 },
    { item: "Lifestyle & Dining", budget: 8500, actual: 9200 },
    { item: "Investments & Savings", budget: 25000, actual: 26000 }
  ],
  incomeHistory: [
    { month: "Apr", value: 138000 },
    { month: "May", value: 141500 },
    { month: "Jun", value: 139000 },
    { month: "Jul", value: 145000 },
    { month: "Aug", value: 142000 },
    { month: "Sep", value: 148500 },
    { month: "Oct", value: 151000 },
    { month: "Nov", value: 146500 },
    { month: "Dec", value: 154000 },
    { month: "Jan", value: 149500 },
    { month: "Feb", value: 157000 },
    { month: "Mar", value: 148500 }
  ],
  expenseHistory: [
    { month: "Apr", value: 111000 },
    { month: "May", value: 108500 },
    { month: "Jun", value: 116000 },
    { month: "Jul", value: 112500 },
    { month: "Aug", value: 119500 },
    { month: "Sep", value: 117000 },
    { month: "Oct", value: 122000 },
    { month: "Nov", value: 126500 },
    { month: "Dec", value: 132000 },
    { month: "Jan", value: 138500 },
    { month: "Feb", value: 143000 },
    { month: "Mar", value: 151000 }
  ],
  balanceSheet: {
    assets: [
      { item: "Cash & Bank", amount: 340000 },
      { item: "Mutual Funds", amount: 615000 },
      { item: "Equity Investments", amount: 285000 },
      { item: "Provident Fund", amount: 195000 },
      { item: "Vehicle", amount: 420000 }
    ],
    liabilities: [
      { item: "Car Loan Outstanding", amount: 248000 },
      { item: "Credit Card Due", amount: 36000 },
      { item: "Personal Loan", amount: 125000 }
    ]
  }
};

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0
});

const percentFormatter = new Intl.NumberFormat("en-IN", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1
});

const sumAmounts = (items) => items.reduce((total, entry) => total + entry.amount, 0);
const sumValues = (items) => items.reduce((total, entry) => total + entry.value, 0);
const formatCurrency = (value) => currencyFormatter.format(value);
const formatPercent = (value) => `${percentFormatter.format(value)}%`;

function renderSummaryCards(metrics) {
  const summaryCards = [
    {
      label: "Monthly Income",
      value: formatCurrency(metrics.monthlyIncome),
      note: "Recurring monthly inflow"
    },
    {
      label: "Monthly Expenses",
      value: formatCurrency(metrics.monthlyExpense),
      note: "Recurring monthly outflow"
    },
    {
      label: "Monthly Surplus",
      value: formatCurrency(metrics.monthlySurplus),
      note: "Available after all expenses",
      tone: "positive"
    },
    {
      label: "Savings Rate",
      value: formatPercent(metrics.savingsRate),
      note: "Share of monthly income saved",
      tone: "positive"
    },
    {
      label: "Annual Surplus",
      value: formatCurrency(metrics.yearlyProfit),
      note: `${metrics.lossMonths} deficit months in 12 months`,
      tone: metrics.yearlyProfit >= 0 ? "positive" : "negative"
    },
    {
      label: "Net Worth",
      value: formatCurrency(metrics.netWorth),
      note: "Assets minus liabilities"
    }
  ];

  document.getElementById("summary-cards").innerHTML = summaryCards.map((card) => `
    <article class="metric-card">
      <p class="label">${card.label}</p>
      <p class="value">${card.value}</p>
      <p class="note ${card.tone || ""}">${card.note}</p>
    </article>
  `).join("");
}

function renderItemizedTable(targetId, items, total) {
  document.getElementById(targetId).innerHTML = items.map((entry) => {
    const share = (entry.amount / total) * 100;
    return `
      <tr>
        <td>${entry.item}</td>
        <td>${formatCurrency(entry.amount)}</td>
        <td>${formatPercent(share)}</td>
      </tr>
    `;
  }).join("");
}

function renderBudgetList(items) {
  document.getElementById("budget-list").innerHTML = items.map((entry) => {
    const utilization = (entry.actual / entry.budget) * 100;
    const variance = entry.actual - entry.budget;
    const varianceLabel = variance > 0 ? "Over budget" : "Under budget";

    return `
      <div class="budget-item">
        <div class="budget-meta">
          <span>${entry.item}</span>
          <strong>${formatCurrency(entry.actual)}</strong>
        </div>
        <div class="budget-bar">
          <div class="budget-fill ${variance > 0 ? "over" : ""}" style="width: ${Math.min(utilization, 100)}%"></div>
        </div>
        <div class="budget-note">
          <span>Budget ${formatCurrency(entry.budget)}</span>
          <span class="${variance > 0 ? "negative-text" : "positive-text"}">${varianceLabel}: ${formatCurrency(Math.abs(variance))}</span>
        </div>
      </div>
    `;
  }).join("");
}

function renderInsights(metrics) {
  const insights = [
    {
      title: "Budget control",
      copy: `${metrics.budgetOnTrackCount} of ${financeData.budgetTargets.length} tracked categories are within budget this month.`
    },
    {
      title: "Best earning source",
      copy: `${metrics.topIncomeSource.item} leads contribution at ${formatPercent(metrics.topIncomeSource.share)} of total monthly income.`
    },
    {
      title: "Largest spend head",
      copy: `${metrics.topExpenseItem.item} is the biggest expense at ${formatPercent(metrics.topExpenseItem.share)} of monthly spending.`
    }
  ];

  document.getElementById("insight-band").innerHTML = insights.map((item) => `
    <article class="insight-card">
      <h3>${item.title}</h3>
      <p>${item.copy}</p>
    </article>
  `).join("");
}

function createLineChart(svgId, series) {
  const svg = document.getElementById(svgId);
  const width = 640;
  const height = 280;
  const padding = { top: 24, right: 22, bottom: 44, left: 44 };
  const values = series.flatMap((line) => line.points.map((point) => point.value));
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = Math.max(max - min, 1);
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;
  const gridLines = 4;

  const gridMarkup = Array.from({ length: gridLines + 1 }, (_, index) => {
    const y = padding.top + (index * innerHeight) / gridLines;
    const labelValue = max - (index * (max - min)) / gridLines;
    return `
      <line x1="${padding.left}" y1="${y}" x2="${width - padding.right}" y2="${y}" stroke="rgba(95,108,112,0.16)" stroke-width="1" />
      <text x="0" y="${y + 4}" fill="#6f7a7d" font-size="12">${formatCurrency(labelValue)}</text>
    `;
  }).join("");

  const basePoints = series[0].points.map((point, index) => {
    const x = padding.left + (index * innerWidth) / (series[0].points.length - 1);
    return { ...point, x };
  });

  const labelsMarkup = basePoints.map((point) => `
    <text x="${point.x}" y="${height - 16}" text-anchor="middle" fill="#6f7a7d" font-size="12">${point.month}</text>
  `).join("");

  const lineMarkup = series.map((line, lineIndex) => {
    const coordinateSet = line.points.map((point, index) => {
      const x = padding.left + (index * innerWidth) / (line.points.length - 1);
      const y = padding.top + innerHeight - ((point.value - min) / range) * innerHeight;
      return { ...point, x, y };
    });

    const path = coordinateSet.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");
    const dots = coordinateSet.map((point) => `
      <circle cx="${point.x}" cy="${point.y}" r="4.5" fill="${line.stroke}" />
      <title>${line.label} ${point.month}: ${formatCurrency(point.value)}</title>
    `).join("");
    const dash = lineIndex === 0 ? "" : 'stroke-dasharray="10 8"';

    return `<path d="${path}" fill="none" stroke="${line.stroke}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" ${dash}></path>${dots}`;
  }).join("");

  svg.innerHTML = `
    ${gridMarkup}
    ${lineMarkup}
    ${labelsMarkup}
  `;
}

function renderBalanceSheet(balanceSheet) {
  const assetTotal = sumAmounts(balanceSheet.assets);
  const liabilityTotal = sumAmounts(balanceSheet.liabilities);
  const netWorth = assetTotal - liabilityTotal;
  const rows = [
    ...balanceSheet.assets.map((entry) => ({ label: `Asset - ${entry.item}`, amount: entry.amount })),
    { label: "Total Assets", amount: assetTotal, emphasis: true },
    ...balanceSheet.liabilities.map((entry) => ({ label: `Liability - ${entry.item}`, amount: entry.amount })),
    { label: "Total Liabilities", amount: liabilityTotal, emphasis: true },
    { label: "Net Worth", amount: netWorth, emphasis: true, positive: netWorth >= 0 }
  ];

  document.getElementById("balance-sheet").innerHTML = rows.map((row) => `
    <tr>
      <td>${row.label}</td>
      <td class="${row.emphasis ? (row.positive === false ? "negative-text" : "positive-text") : ""}">${formatCurrency(row.amount)}</td>
    </tr>
  `).join("");

  return { assetTotal, liabilityTotal, netWorth };
}

function renderPnL(metrics) {
  const pnlRows = [
    { label: "Gross Income (12 months)", amount: metrics.yearlyIncome },
    { label: "Gross Expenditure (12 months)", amount: metrics.yearlyExpense },
    { label: "Net Profit", amount: metrics.yearlyProfit, className: "positive-text" },
    { label: "Profit Margin", amount: formatPercent(metrics.profitMargin) },
    { label: "Loss Exposure", amount: formatPercent(metrics.lossMargin), className: metrics.lossMargin > 0 ? "negative-text" : "positive-text" },
    { label: "Average Monthly Surplus", amount: metrics.yearlyProfit / 12, className: "positive-text" }
  ];

  document.getElementById("pnl-table").innerHTML = pnlRows.map((row) => `
    <tr>
      <td>${row.label}</td>
      <td class="${row.className || ""}">${typeof row.amount === "number" ? formatCurrency(row.amount) : row.amount}</td>
    </tr>
  `).join("");
}

function initializeDashboard() {
  const monthlyIncome = sumAmounts(financeData.monthlyIncomeItems);
  const monthlyExpense = sumAmounts(financeData.monthlyExpenseItems);
  const monthlySurplus = monthlyIncome - monthlyExpense;
  const yearlyIncome = sumValues(financeData.incomeHistory);
  const yearlyExpense = sumValues(financeData.expenseHistory);
  const yearlyProfit = yearlyIncome - yearlyExpense;
  const profitMargin = (yearlyProfit / yearlyIncome) * 100;
  const savingsRate = (monthlySurplus / monthlyIncome) * 100;

  const lossAmount = financeData.incomeHistory.reduce((total, month, index) => {
    const expense = financeData.expenseHistory[index].value;
    return expense > month.value ? total + (expense - month.value) : total;
  }, 0);

  const lossMonths = financeData.incomeHistory.reduce((count, month, index) => {
    const expense = financeData.expenseHistory[index].value;
    return expense > month.value ? count + 1 : count;
  }, 0);

  const lossMargin = (lossAmount / yearlyIncome) * 100;
  const balanceSheetTotals = renderBalanceSheet(financeData.balanceSheet);
  const budgetOnTrackCount = financeData.budgetTargets.filter((entry) => entry.actual <= entry.budget).length;
  const topIncomeSource = financeData.monthlyIncomeItems
    .map((entry) => ({ ...entry, share: (entry.amount / monthlyIncome) * 100 }))
    .sort((a, b) => b.share - a.share)[0];
  const topExpenseItem = financeData.monthlyExpenseItems
    .map((entry) => ({ ...entry, share: (entry.amount / monthlyExpense) * 100 }))
    .sort((a, b) => b.share - a.share)[0];

  const metrics = {
    monthlyIncome,
    monthlyExpense,
    monthlySurplus,
    yearlyIncome,
    yearlyExpense,
    yearlyProfit,
    profitMargin,
    savingsRate,
    lossMargin,
    lossMonths,
    netWorth: balanceSheetTotals.netWorth,
    budgetOnTrackCount,
    topIncomeSource,
    topExpenseItem
  };

  renderSummaryCards(metrics);
  renderInsights(metrics);
  renderBudgetList(financeData.budgetTargets);
  renderItemizedTable("income-table", financeData.monthlyIncomeItems, monthlyIncome);
  renderItemizedTable("expense-table", financeData.monthlyExpenseItems, monthlyExpense);
  renderPnL(metrics);

  document.getElementById("income-total").textContent = `Total: ${formatCurrency(monthlyIncome)}`;
  document.getElementById("expense-total").textContent = `Total: ${formatCurrency(monthlyExpense)}`;
  document.getElementById("hero-savings-rate").textContent = formatPercent(savingsRate);
  document.getElementById("hero-net-worth").textContent = formatCurrency(balanceSheetTotals.netWorth);

  createLineChart("cashflow-chart", [
    { label: "Income", points: financeData.incomeHistory, stroke: "#1c8f79" },
    { label: "Expenses", points: financeData.expenseHistory, stroke: "#cb7e3b" }
  ]);
}

function setupReveal() {
  const revealItems = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  }, { threshold: 0.12 });

  revealItems.forEach((item) => observer.observe(item));
}

document.addEventListener("DOMContentLoaded", () => {
  initializeDashboard();
  setupReveal();
});
