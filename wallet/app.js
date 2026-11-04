(() => {
  "use strict";

  const KEY = "mira-journal-v2";
  const categories = {
    in: ["Income", "Cash added", "Refund", "Gift", "Other"],
    out: ["Shopping", "Food & drink", "Transport", "Bills", "Other"]
  };
  const money = new Intl.NumberFormat("en-IN", {
    style: "currency", currency: "INR", minimumFractionDigits: 2, maximumFractionDigits: 2
  });
  const dateFormat = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" });
  const monthFormat = new Intl.DateTimeFormat("en-IN", { month: "long", year: "numeric" });
  const $ = (id) => document.getElementById(id);

  function todayLocal() {
    const now = new Date();
    return now.getFullYear() + "-" + String(now.getMonth() + 1).padStart(2, "0") + "-" + String(now.getDate()).padStart(2, "0");
  }

  function validEntry(row) {
    return row && typeof row.id === "string" && /^[0-9a-f-]{8,}$/.test(row.id) &&
      (row.kind === "in" || row.kind === "out") &&
      Number.isSafeInteger(row.amount) && row.amount > 0 && row.amount <= 100000000 &&
      typeof row.description === "string" && row.description.length > 0 && row.description.length <= 80 &&
      typeof row.category === "string" && row.category.length <= 40 &&
      typeof row.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(row.date);
  }

  function loadEntries() {
    try {
      const parsed = JSON.parse(localStorage.getItem(KEY));
      if (parsed && parsed.version === 2 && Array.isArray(parsed.entries)) {
        return parsed.entries.filter(validEntry).slice(0, 5000);
      }
    } catch (_) {
      // Missing, blocked or invalid storage should not stop a fresh journal.
    }
    return [];
  }

  const entries = loadEntries();
  let filter = "all";
  let kind = "in";
  let hiddenAmounts = false;
  let toastTimeout = 0;
  let previousFocus = null;
  let editingId = null;

  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify({ version: 2, entries }));
      $("storage-alert").hidden = true;
    } catch (_) {
      $("storage-alert").hidden = false;
      announce("This entry is only available until you close this page. Export your records to keep it.");
    }
  }

  function format(paise) {
    return money.format(paise / 100);
  }

  function amountText(paise) {
    return hiddenAmounts ? "••••••" : format(paise);
  }

  function balance() {
    return entries.reduce((sum, entry) => sum + (entry.kind === "in" ? entry.amount : -entry.amount), 0);
  }

  function monthTotals() {
    const month = todayLocal().slice(0, 7);
    return entries.reduce((total, entry) => {
      if (entry.date.startsWith(month)) total[entry.kind] += entry.amount;
      return total;
    }, { in: 0, out: 0 });
  }

  function announce(message) {
    const toast = $("toast");
    clearTimeout(toastTimeout);
    toast.textContent = message;
    toast.classList.add("show");
    toastTimeout = setTimeout(() => toast.classList.remove("show"), 3800);
  }

  function createEntryElement(entry) {
    const item = document.createElement("li");
    item.className = "entry-item";
    const direction = document.createElement("span");
    direction.className = "entry-direction" + (entry.kind === "out" ? " out" : "");
    direction.textContent = entry.kind === "in" ? "↓" : "↑";
    direction.setAttribute("aria-hidden", "true");

    const info = document.createElement("div");
    info.className = "entry-info";
    const title = document.createElement("strong");
    title.textContent = entry.description;
    const detail = document.createElement("span");
    detail.textContent = entry.category + " · " + dateFormat.format(new Date(entry.date + "T12:00:00"));
    info.append(title, detail);

    const amount = document.createElement("strong");
    amount.className = "entry-amount" + (entry.kind === "in" ? " in" : "");
    amount.textContent = hiddenAmounts ? "••••" : (entry.kind === "in" ? "+" : "−") + format(entry.amount);
    const edit = document.createElement("button");
    edit.type = "button";
    edit.className = "entry-edit";
    edit.textContent = "Edit";
    edit.setAttribute("aria-label", "Edit " + entry.description);
    edit.addEventListener("click", () => openEntry(entry.kind, entry.id));
    item.append(direction, info, amount, edit);
    return item;
  }

  function render() {
    const total = balance();
    const monthly = monthTotals();
    $("balance").textContent = amountText(total);
    $("month-in").textContent = amountText(monthly.in);
    $("month-out").textContent = amountText(monthly.out);
    $("entry-total").textContent = String(entries.length);
    $("month-name").textContent = monthFormat.format(new Date());
    $("today-label").textContent = dateFormat.format(new Date());

    $("toggle-balance").textContent = hiddenAmounts ? "Show" : "Hide";
    $("toggle-balance").setAttribute("aria-label", hiddenAmounts ? "Show amounts" : "Hide amounts");
    $("toggle-balance").setAttribute("aria-pressed", String(hiddenAmounts));

    const q = $("entry-search").value.trim().toLocaleLowerCase();
    const matches = entries.filter((row) =>
      (filter === "all" || row.kind === filter) &&
      (row.description + " " + row.category + " " + row.date).toLocaleLowerCase().includes(q)
    ).sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));

    $("entry-list").replaceChildren(...matches.map(createEntryElement));
    $("result-count").textContent = matches.length + (matches.length === 1 ? " entry" : " entries");
    $("empty-state").hidden = matches.length > 0;
    if (entries.length) {
      $("empty-title").textContent = "Nothing found.";
      $("empty-copy").textContent = "Try another search or filter to find an entry.";
      $("empty-action").hidden = true;
    } else {
      $("empty-title").textContent = "A clean slate.";
      $("empty-copy").textContent = "Your transactions will appear here once you add the first entry.";
      $("empty-action").hidden = false;
    }
  }

  function openEntry(nextKind, entryId = null) {
    kind = nextKind;
    editingId = entryId;
    const existing = entryId ? entries.find((entry) => entry.id === entryId) : null;
    previousFocus = document.activeElement;
    $("entry-form").reset();
    $("entry-error").hidden = true;
    $("dialog-heading").textContent = existing ? "Edit entry" : kind === "in" ? "Money in" : "Money out";
    $("save-entry").textContent = existing ? "Save changes" : "Save entry";
    $("delete-entry").hidden = !existing;
    $("dialog-description").textContent = kind === "in"
      ? "Record money you've received or added. This does not move money."
      : "Record money you've spent or sent elsewhere. This does not send a payment.";
    $("entry-category").replaceChildren(...categories[kind].map((category) => {
      const option = document.createElement("option");
      option.value = category;
      option.textContent = category;
      return option;
    }));
    $("entry-date").value = existing ? existing.date : todayLocal();
    if (existing) {
      $("entry-description").value = existing.description;
      $("entry-amount").value = (existing.amount / 100).toFixed(2);
      $("entry-category").value = existing.category;
    }
    $("entry-dialog").showModal();
    $("entry-description").focus();
  }

  function closeEntry() {
    $("entry-dialog").close();
    if (previousFocus instanceof HTMLElement) previousFocus.focus();
  }

  function formError(message, field) {
    $("entry-error").textContent = message;
    $("entry-error").hidden = false;
    if (field) field.focus();
  }

  function parsePaise(value) {
    if (!/^\d{1,8}(?:\.\d{1,2})?$/.test(value)) return null;
    const parts = value.split(".");
    const result = Number(parts[0]) * 100 + Number((parts[1] || "").padEnd(2, "0"));
    return Number.isSafeInteger(result) && result > 0 && result <= 100000000 ? result : null;
  }

  function saveEntry(event) {
    event.preventDefault();
    $("entry-error").hidden = true;
    const description = $("entry-description").value.trim();
    const paise = parsePaise($("entry-amount").value.trim());
    const date = $("entry-date").value;
    const category = $("entry-category").value;

    if (description.length < 2) return formError("Enter a description with at least 2 characters.", $("entry-description"));
    if (paise === null) return formError("Enter an amount from ₹0.01 to ₹10,00,000, using at most two decimal places.", $("entry-amount"));
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(new Date(date + "T12:00:00").getTime())) {
      return formError("Choose a valid date.", $("entry-date"));
    }
    const index = editingId ? entries.findIndex((entry) => entry.id === editingId) : -1;
    const old = index >= 0 ? entries[index] : null;
    const oldValue = old ? (old.kind === "in" ? old.amount : -old.amount) : 0;
    const newValue = kind === "in" ? paise : -paise;
    if (balance() - oldValue + newValue < 0) {
      return formError(old
        ? "This edit would make your recorded balance negative. Adjust another entry first."
        : "This is more than your recorded balance. Add money in first, or enter a smaller amount.", $("entry-amount"));
    }
    const id = old ? old.id : (globalThis.crypto && typeof crypto.randomUUID === "function")
      ? crypto.randomUUID() : Date.now().toString(16) + Math.random().toString(16).slice(2);
    const updated = { id, kind, amount: paise, description, category, date };
    if (old) entries[index] = updated;
    else entries.push(updated);
    save();
    render();
    closeEntry();
    announce(old ? "Changes saved." : "Entry saved to your journal.");
  }

  function csvCell(value) {
    let safe = String(value);
    if (/^[=+@\t\r]/.test(safe)) safe = "'" + safe;
    return '"' + safe.replace(/"/g, '""') + '"';
  }

  function exportCSV() {
    const header = ["Date", "Direction", "Category", "Description", "Amount INR"];
    const rows = entries.slice().sort((a, b) => a.date.localeCompare(b.date)).map((entry) => [
      entry.date, entry.kind === "in" ? "In" : "Out", entry.category, entry.description,
      (entry.kind === "in" ? "" : "-") + (entry.amount / 100).toFixed(2)
    ]);
    const content = "\ufeff" + [header, ...rows].map((row) => row.map(csvCell).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob([content], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "interface-craft-wallet-" + todayLocal() + ".csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    announce(entries.length ? "Records exported as CSV." : "Empty CSV exported. Add entries to include transactions.");
  }

  document.querySelectorAll("[data-kind]").forEach((button) =>
    button.addEventListener("click", () => openEntry(button.dataset.kind))
  );
  $("empty-action").addEventListener("click", () => openEntry("in"));
  $("entry-form").addEventListener("submit", saveEntry);
  $("close-entry").addEventListener("click", closeEntry);
  $("delete-entry").addEventListener("click", () => {
    const entry = entries.find((item) => item.id === editingId);
    if (!entry) return;
    $("delete-description").textContent = "Remove " + entry.description + " from this device? This cannot be undone.";
    $("delete-dialog").showModal();
  });
  $("cancel-delete").addEventListener("click", () => $("delete-dialog").close());
  $("confirm-delete").addEventListener("click", () => {
    const index = entries.findIndex((item) => item.id === editingId);
    if (index === -1) return $("delete-dialog").close();
    const entry = entries[index];
    const value = entry.kind === "in" ? entry.amount : -entry.amount;
    $("delete-dialog").close();
    if (balance() - value < 0) {
      return formError("This income covers recorded spending. Edit or delete the expenses before removing it.", $("entry-amount"));
    }
    entries.splice(index, 1);
    save();
    render();
    closeEntry();
    announce("Entry deleted.");
  });
  $("cancel-entry").addEventListener("click", closeEntry);
  $("toggle-balance").addEventListener("click", () => {
    hiddenAmounts = !hiddenAmounts;
    render();
  });
  $("entry-search").addEventListener("input", render);

  document.querySelectorAll("[data-filter]").forEach((button) => button.addEventListener("click", () => {
    filter = button.dataset.filter;
    document.querySelectorAll("[data-filter]").forEach((item) => {
      const isActive = item === button;
      item.classList.toggle("active", isActive);
      item.setAttribute("aria-pressed", String(isActive));
    });
    render();
  }));

  function navActive() {
    const hash = location.hash || "#overview";
    document.querySelectorAll(".nav-link").forEach((link) => {
      const current = link.getAttribute("href") === hash;
      link.classList.toggle("is-active", current);
      if (current) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  }
  addEventListener("hashchange", navActive);

  $("export-top").addEventListener("click", exportCSV);
  $("export-bottom").addEventListener("click", exportCSV);
  $("reset-data").addEventListener("click", () => $("clear-dialog").showModal());
  $("cancel-clear").addEventListener("click", () => $("clear-dialog").close());
  $("confirm-clear").addEventListener("click", () => {
    entries.length = 0;
    save();
    render();
    $("clear-dialog").close();
    announce("All local records cleared.");
  });
  render();
  navActive();
})();