(() => {
  "use strict";

  const STORAGE_KEY = "mira-wallet-demo-v1";
  const initialTransactions = [
    { id: 1, name: "Olivia Martin", detail: "Transfer sent", amount: -125000, date: "2026-11-03", type: "out" },
    { id: 2, name: "Monthly allowance", detail: "Money received", amount: 850000, date: "2026-11-02", type: "in" },
    { id: 3, name: "Corner Coffee", detail: "Bill payment", amount: -34000, date: "2026-11-01", type: "out" },
    { id: 4, name: "Jamie Wilson", detail: "Transfer received", amount: 200000, date: "2026-10-30", type: "in" },
    { id: 5, name: "Metro Pass", detail: "Bill payment", amount: -59000, date: "2026-10-28", type: "out" }
  ];

  const currency = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  const balanceEl = document.getElementById("balance");
  const transactionList = document.getElementById("transaction-list");
  const emptyState = document.getElementById("empty-state");
  const searchEl = document.getElementById("transaction-search");
  const dialog = document.getElementById("money-dialog");
  const form = document.getElementById("money-form");
  const recipientField = document.getElementById("recipient-field");
  const recipientInput = document.getElementById("recipient");
  const amountInput = document.getElementById("amount");
  const noteInput = document.getElementById("note");
  const formError = document.getElementById("form-error");
  const toast = document.getElementById("toast");
  const balanceToggle = document.getElementById("toggle-balance");

  let filter = "all";
  let mode = "send";
  let balanceHidden = false;
  let returnFocus = null;
  let toastTimer = null;

  function readState() {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (
        stored &&
        Number.isSafeInteger(stored.balance) &&
        stored.balance >= 0 &&
        Array.isArray(stored.transactions)
      ) {
        const validTransactions = stored.transactions.filter((tx) =>
          typeof tx.name === "string" &&
          typeof tx.detail === "string" &&
          Number.isSafeInteger(tx.amount) &&
          (tx.type === "in" || tx.type === "out") &&
          typeof tx.date === "string"
        );
        return { balance: stored.balance, transactions: validTransactions.slice(0, 100) };
      }
    } catch (_) {
      // A blocked or invalid localStorage entry should not break the demo.
    }
    return { balance: 4856075, transactions: initialTransactions.map((tx) => ({ ...tx })) };
  }

  const state = readState();

  function persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (_) {
      showToast("Changes are visible now but couldn't be saved in this browser.");
    }
  }

  function formatAmount(paise) {
    return currency.format(paise / 100);
  }

  function renderBalance() {
    balanceEl.textContent = balanceHidden ? "••••••" : formatAmount(state.balance);
    balanceToggle.textContent = balanceHidden ? "◎" : "◉";
    balanceToggle.setAttribute("aria-label", balanceHidden ? "Show balance" : "Hide balance");
    balanceToggle.setAttribute("aria-pressed", String(balanceHidden));
    document.querySelector(".spending-total strong").textContent = balanceHidden ? "••••••" : "₹12,480";
  }

  function displayDate(dateString) {
    const date = new Date(dateString + "T12:00:00");
    return Number.isNaN(date.getTime())
      ? dateString
      : new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short" }).format(date);
  }

  function transactionRow(tx) {
    const item = document.createElement("li");
    item.className = "transaction-item";

    const icon = document.createElement("span");
    icon.className = "tx-icon" + (tx.type === "in" ? " in" : "");
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = tx.type === "in" ? "↓" : "↗";

    const info = document.createElement("div");
    info.className = "tx-desc";
    const name = document.createElement("strong");
    name.textContent = tx.name;
    const detail = document.createElement("span");
    detail.textContent = tx.detail;
    info.append(name, detail);

    const total = document.createElement("div");
    total.className = "tx-value";
    const amount = document.createElement("strong");
    if (tx.type === "in") amount.classList.add("in");
    amount.textContent = balanceHidden
      ? "••••"
      : (tx.amount > 0 ? "+" : "−") + formatAmount(Math.abs(tx.amount));
    const date = document.createElement("span");
    date.textContent = displayDate(tx.date);
    total.append(amount, date);

    item.append(icon, info, total);
    return item;
  }

  function renderActivity() {
    const query = searchEl.value.trim().toLowerCase();
    const filtered = state.transactions.filter((tx) => {
      const matchesFilter = filter === "all" || tx.type === filter;
      const matchesQuery = [tx.name, tx.detail].some((text) => text.toLowerCase().includes(query));
      return matchesFilter && matchesQuery;
    });

    transactionList.replaceChildren(...filtered.map(transactionRow));
    emptyState.hidden = filtered.length > 0;
    document.getElementById("activity-count").textContent =
      filtered.length + " " + (filtered.length === 1 ? "entry" : "entries");
  }

  function notify(message) {
    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add("visible");
    toastTimer = setTimeout(() => toast.classList.remove("visible"), 3600);
  }

  // Keep messages in one place to avoid flashing a browser-native validation popup.
  function showError(message) {
    formError.textContent = message;
    formError.hidden = false;
  }

  function openDialog(nextMode) {
    mode = nextMode;
    returnFocus = document.activeElement;
    form.reset();
    formError.hidden = true;
    const isAdd = mode === "add";

    document.getElementById("dialog-title").textContent =
      isAdd ? "Add money" : mode === "bill" ? "Pay a bill" : "Send money";
    document.getElementById("dialog-description").textContent =
      isAdd
        ? "Add funds to your demo wallet. No actual bank transfer takes place."
        : mode === "bill"
          ? "Record a sample bill payment from your wallet."
          : "Simulate a transfer from your wallet.";
    document.getElementById("submit-money").textContent =
      isAdd ? "Add money" : mode === "bill" ? "Pay bill" : "Send money";
    recipientField.hidden = isAdd;
    recipientInput.required = !isAdd;
    recipientInput.placeholder = mode === "bill" ? "e.g. Electricity provider" : "e.g. Sam Taylor";
    amountInput.max = isAdd ? "100000" : "1000000";

    dialog.showModal();
    (isAdd ? amountInput : recipientInput).focus();
  }

  function closeDialog() {
    dialog.close();
    formError.hidden = true;
    if (returnFocus instanceof HTMLElement) returnFocus.focus();
  }

  function submitTransfer(event) {
    event.preventDefault();
    formError.hidden = true;

    const rawAmount = amountInput.value.trim();
    const number = Number(rawAmount);
    const paise = Math.round(number * 100);
    if (!rawAmount || !Number.isFinite(number) || number <= 0 || !Number.isSafeInteger(paise)) {
      showError("Enter a valid amount greater than zero.");
      amountInput.focus();
      return;
    }
    if (Math.abs(number * 100 - paise) > 0.000001) {
      showError("Use up to two digits after the decimal point.");
      amountInput.focus();
      return;
    }
    if (mode === "add" && paise > 10000000) {
      showError("For this demo, you can add up to ₹1,00,000 at a time.");
      return;
    }
    if (mode !== "add" && paise > state.balance) {
      showError("Insufficient balance. Enter a smaller amount.");
      return;
    }

    const recipient = recipientInput.value.trim();
    if (mode !== "add" && recipient.length < 2) {
      showError("Enter a recipient or provider name with at least two characters.");
      recipientInput.focus();
      return;
    }

    const isAdd = mode === "add";
    const detail = noteInput.value.trim() ||
      (isAdd ? "Demo wallet top-up" : mode === "bill" ? "Bill payment" : "Transfer sent");
    const transaction = {
      id: Date.now(),
      name: isAdd ? "Wallet top-up" : recipient,
      detail,
      amount: isAdd ? paise : -paise,
      date: new Date().toISOString().slice(0, 10),
      type: isAdd ? "in" : "out"
    };

    state.balance += transaction.amount;
    state.transactions.unshift(transaction);
    state.transactions = state.transactions.slice(0, 100);
    persist();
    renderBalance();
    renderActivity();
    closeDialog();
    notify((isAdd ? "Added " : "Recorded ") + formatAmount(paise) + " in the demo wallet.");
  }

  document.querySelectorAll("[data-action]").forEach((control) => {
    control.addEventListener("click", () => openDialog(control.dataset.action));
  });

  document.querySelectorAll("[data-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      filter = button.dataset.filter;
      document.querySelectorAll("[data-filter]").forEach((item) => {
        const selected = item === button;
        item.classList.toggle("selected", selected);
        item.setAttribute("aria-pressed", String(selected));
      });
      renderActivity();
    });
  });

  function updateNav() {
    const hash = window.location.hash || "#overview";
    document.querySelectorAll(".nav-link").forEach((link) => {
      const active = link.getAttribute("href") === hash;
      link.classList.toggle("active", active);
      if (active) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  }

  window.addEventListener("hashchange", updateNav);
  searchEl.addEventListener("input", renderActivity);
  balanceToggle.addEventListener("click", () => {
    balanceHidden = !balanceHidden;
    renderBalance();
    renderActivity();
  });
  document.getElementById("close-dialog").addEventListener("click", closeDialog);
  document.getElementById("cancel-dialog").addEventListener("click", closeDialog);
  form.addEventListener("submit", submitTransfer);

  renderBalance();
  renderActivity();
  updateNav();
})();
