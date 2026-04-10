const financeData = {
  budgets: [
    { category: "Operations", spent: 18700, limit: 22000, status: "Under plan" },
    { category: "Marketing", spent: 12400, limit: 14000, status: "Controlled" },
    { category: "Research", spent: 9100, limit: 10000, status: "Near threshold" },
    { category: "Payroll", spent: 28400, limit: 30000, status: "Stable" }
  ],
  investments: [
    { name: "Equities", allocation: 42, return: "+14.2%", color: "#15806f" },
    { name: "Bonds", allocation: 24, return: "+6.1%", color: "#bb8b2f" },
    { name: "Real Estate", allocation: 18, return: "+9.4%", color: "#4a6f91" },
    { name: "Cash Reserve", allocation: 16, return: "+2.8%", color: "#8cb7a7" }
  ],
  transactions: [
    { type: "Credit", reference: "INV-2098 / Client settlement", amount: "+$8,420" },
    { type: "Debit", reference: "OPS-1042 / Vendor payment", amount: "-$2,160" },
    { type: "Credit", reference: "DIV-8831 / Dividend payout", amount: "+$1,240" },
    { type: "Debit", reference: "SUB-5541 / SaaS renewal", amount: "-$420" },
    { type: "Credit", reference: "RET-9201 / Treasury transfer", amount: "+$3,860" }
  ],
  insights: [
    {
      title: "Expense discipline improved",
      text: "Budget usage remains below target in three of four categories, indicating better allocation control."
    },
    {
      title: "Returns are diversified",
      text: "Performance is driven by equities while bonds and reserves help reduce downside pressure."
    },
    {
      title: "Transaction flow is healthy",
      text: "Incoming and outgoing records stay balanced with minimal high-risk outliers in this mock dataset."
    }
  ]
};

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0
});

function renderBudgets() {
  const container = document.getElementById("budget-list");

  container.innerHTML = financeData.budgets.map((item) => {
    const usage = Math.min((item.spent / item.limit) * 100, 100);

    return `
      <div class="budget-row">
        <div class="budget-line">
          <div>
            <strong>${item.category}</strong>
            <div class="legend-details">${item.status}</div>
          </div>
          <strong>${usage.toFixed(0)}%</strong>
        </div>
        <div class="budget-bar" aria-hidden="true">
          <div class="budget-fill" style="width:${usage}%"></div>
        </div>
        <div class="budget-meta">
          <span>${money.format(item.spent)} spent</span>
          <span>${money.format(item.limit)} cap</span>
        </div>
      </div>
    `;
  }).join("");
}

function renderInvestments() {
  const chart = document.getElementById("allocation-chart");
  const legend = document.getElementById("allocation-legend");

  chart.innerHTML = financeData.investments.map((item) => `
    <span
      class="allocation-segment"
      style="width:${item.allocation}%; background:${item.color}"
      title="${item.name}: ${item.allocation}%"
    ></span>
  `).join("");

  legend.innerHTML = financeData.investments.map((item) => `
    <div class="legend-row">
      <div class="legend-line">
        <div class="legend-name">
          <span class="legend-swatch" style="background:${item.color}"></span>
          <div>
            <strong>${item.name}</strong>
            <div class="legend-details">${item.allocation}% allocation</div>
          </div>
        </div>
        <strong>${item.return}</strong>
      </div>
    </div>
  `).join("");
}

function renderTransactions() {
  const table = document.getElementById("transaction-table");

  table.innerHTML = financeData.transactions.map((item) => `
    <tr>
      <td><span class="type-pill ${item.type.toLowerCase()}">${item.type}</span></td>
      <td>${item.reference}</td>
      <td><strong>${item.amount}</strong></td>
    </tr>
  `).join("");
}

function renderInsights() {
  const container = document.getElementById("insight-points");

  container.innerHTML = financeData.insights.map((item) => `
    <article class="insight-item">
      <h3>${item.title}</h3>
      <p>${item.text}</p>
    </article>
  `).join("");
}

function animateCount(element) {
  const target = Number(element.dataset.countup);
  const isDecimal = String(element.dataset.countup).includes(".");
  const isCurrency = element.textContent.trim().startsWith("$");
  const duration = 1400;
  const startTime = performance.now();

  function frame(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = target * eased;

    if (isCurrency) {
      element.textContent = money.format(value);
    } else if (isDecimal) {
      element.textContent = value.toFixed(1);
    } else {
      element.textContent = Math.round(value).toLocaleString("en-US");
    }

    if (progress < 1) {
      requestAnimationFrame(frame);
    }
  }

  requestAnimationFrame(frame);
}

document.addEventListener("DOMContentLoaded", () => {
  renderBudgets();
  renderInvestments();
  renderTransactions();
  renderInsights();

  document.querySelectorAll("[data-countup]").forEach(animateCount);
});
