(() => {
  "use strict";

  // This is an interactive UI/UX exercise, not an order or payment service.
  // Monetary values are integer paise to avoid floating-point checkout errors.
  const PRODUCTS = Object.freeze({
    runner: { id: "runner", name: "Cloud Knit Runner", option: "Sand · Size 8", amount: 279900, icon: "shoe" },
    tote: { id: "tote", name: "Everyday Canvas Tote", option: "Natural · One size", amount: 89900, icon: "bag" }
  });
  const SHIPPING = Object.freeze({ standard: 0, express: 14900 });
  const MAX_QUANTITY = 8;
  const format = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 2 });
  const $ = (id) => document.getElementById(id);

  const cart = { runner: 1, tote: 1 };
  const deliveryForm = $("delivery-form");
  const paymentForm = $("payment-form");
  const deliveryPanel = $("delivery-panel");
  const paymentPanel = $("payment-panel");
  const successPanel = $("success-panel");
  const shippingInputs = [...document.querySelectorAll('input[name="shipping"]')];
  const paymentInputs = [...document.querySelectorAll('input[name="payment"]')];
  const couponInput = $("coupon-code");
  const couponMessage = $("coupon-message");
  const errorEl = $("delivery-error");

  let couponApplied = false;
  let selectedShipping = "standard";
  let step = 1;

  const money = (amount) => format.format(amount / 100);
  const count = () => Object.values(cart).reduce((total, qty) => total + qty, 0);
  const subtotal = () => Object.values(PRODUCTS).reduce((sum, product) =>
    sum + product.amount * (cart[product.id] || 0), 0);
  const discount = () => couponApplied ? Math.round(subtotal() / 10) : 0;
  const total = () => subtotal() + SHIPPING[selectedShipping] - discount();

  function markSelected(inputs) {
    for (const input of inputs) {
      input.closest(".shipping-option").classList.toggle("selected", input.checked);
    }
  }

  function illustration(icon) {
    if (icon === "bag") {
      return '<svg class="product-art" viewBox="0 0 80 80" fill="none" aria-hidden="true"><path d="M24 29h32l5 37H19l5-37Z" fill="#E6D6BE" stroke="#8E735A" stroke-width="2"/><path d="M31 30V22a9 9 0 0 1 18 0v8" stroke="#8E735A" stroke-width="3" stroke-linecap="round"/><path d="M25 47h30" stroke="#C6AA87" stroke-width="2"/></svg>';
    }
    return '<svg class="product-art" viewBox="0 0 80 80" fill="none" aria-hidden="true"><path d="M13 49c7 0 14-9 20-21l8 6 9 5 14 5c6 2 7 7 5 12-3 5-9 6-17 6H16c-7 0-9-7-3-13Z" fill="#D5DED9" stroke="#607B72" stroke-width="2"/><path d="m39 35 6 3m-10 2 7 4" stroke="#607B72" stroke-width="2" stroke-linecap="round"/><path d="M14 57h53" stroke="#607B72" stroke-width="2"/></svg>';
  }

  function renderCart() {
    const container = $("cart-items");
    container.replaceChildren();

    Object.values(PRODUCTS).forEach((product) => {
      const qty = cart[product.id];
      if (!qty) return;
      const row = document.createElement("div");
      row.className = "cart-product";

      const picture = document.createElement("div");
      picture.className = "cart-art";
      picture.innerHTML = illustration(product.icon); // SVG markup is fixed, not user-provided.

      const detail = document.createElement("div");
      detail.className = "cart-product-info";
      const title = document.createElement("strong");
      title.textContent = product.name;
      const option = document.createElement("small");
      option.textContent = product.option;
      const adjust = document.createElement("div");
      adjust.className = "cart-adjust";
      adjust.setAttribute("role", "group");
      adjust.setAttribute("aria-label", product.name + " quantity");
      const minus = document.createElement("button");
      minus.type = "button";
      minus.textContent = "−";
      minus.setAttribute("aria-label", "Remove one " + product.name);
      minus.addEventListener("click", () => changeQuantity(product.id, -1));
      const q = document.createElement("span");
      q.textContent = String(qty);
      q.setAttribute("aria-label", "Quantity " + qty);
      const plus = document.createElement("button");
      plus.type = "button";
      plus.textContent = "+";
      plus.disabled = qty >= MAX_QUANTITY;
      plus.setAttribute("aria-label", "Add one " + product.name);
      plus.addEventListener("click", () => changeQuantity(product.id, 1));
      adjust.append(minus, q, plus);
      detail.append(title, option, adjust);
      const amount = document.createElement("strong");
      amount.className = "cart-price";
      amount.textContent = money(product.amount * qty);
      row.append(picture, detail, amount);
      container.append(row);
    });

    const n = count();
    $("item-count").textContent = n + (n === 1 ? " item" : " items");
    $("cart-empty").hidden = n !== 0;
    if (n) $("cart-error").hidden = true;
    renderTotals();
  }

  function changeQuantity(id, delta) {
    if (step === 3) return; // Confirmation stays a stable snapshot.
    const next = Math.max(0, Math.min(MAX_QUANTITY, cart[id] + delta));
    cart[id] = next;
    renderCart();
  }

  function renderTotals() {
    $("subtotal").textContent = money(subtotal());
    $("delivery-cost").textContent = SHIPPING[selectedShipping] ? money(SHIPPING[selectedShipping]) : "Free";
    $("discount").textContent = "−" + money(discount());
    $("grand-total").textContent = money(total());
  }

  function setStep(next) {
    step = next;
    deliveryPanel.hidden = step !== 1;
    paymentPanel.hidden = step !== 2;
    successPanel.hidden = step !== 3;
    ["delivery", "payment", "done"].forEach((name, index) => {
      const item = $("step-" + name);
      const active = index + 1 === step;
      item.classList.toggle("current", active);
      item.classList.toggle("completed", index + 1 < step);
      if (active) item.setAttribute("aria-current", "step");
      else item.removeAttribute("aria-current");
    });
    document.querySelectorAll(".cart-add button,.cart-adjust button,#apply-coupon").forEach((button) => {
      button.disabled = step === 3 || (step < 3 && button.matches(".cart-adjust button[aria-label^='Add one']") &&
        cart[button.closest(".cart-product")?.querySelector(".cart-product-info strong")?.textContent === PRODUCTS.runner.name ? "runner" : "tote"] >= MAX_QUANTITY);
    });
    couponInput.disabled = step === 3;
  }

  function navigate(next) {
    setStep(next);
    const target = next === 1 ? deliveryPanel : next === 2 ? paymentPanel : successPanel;
    target.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });
    const heading = target.querySelector("h2");
    if (heading) {
      heading.setAttribute("tabindex", "-1");
      heading.focus({ preventScroll: true });
    }
  }

  function fail(message, field) {
    errorEl.textContent = message;
    errorEl.hidden = false;
    if (field) {
      field.classList.add("invalid");
      field.setAttribute("aria-invalid", "true");
      field.focus();
    }
  }

  function validateDelivery() {
    errorEl.hidden = true;
    const name = $("full-name"), email = $("email"), address = $("address"),
      city = $("city"), postal = $("postal");
    [name, email, address, city, postal].forEach((field) => {
      field.classList.remove("invalid");
      field.removeAttribute("aria-invalid");
    });
    if (name.value.trim().length < 2) return fail("Enter your full name.", name), false;
    if (!email.value.trim() || !email.checkValidity()) return fail("Enter a valid email address.", email), false;
    if (address.value.trim().length < 8) return fail("Enter a complete street address.", address), false;
    if (city.value.trim().length < 2) return fail("Enter your city.", city), false;
    if (!/^[0-9]{6}$/.test(postal.value.trim())) return fail("Enter a valid 6-digit PIN code.", postal), false;
    return true;
  }

  deliveryForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (count() === 0) {
      $("cart-error").hidden = false;
      $("cart-items").scrollIntoView({ block: "center" });
      return;
    }
    if (!validateDelivery()) return;
    $("address-preview").textContent = [ $("full-name").value.trim(),
      $("address").value.trim(), $("city").value.trim() + " " + $("postal").value.trim() ].join(" · ");
    navigate(2);
  });
  $("edit-address").addEventListener("click", () => navigate(1));

  shippingInputs.forEach((radio) => radio.addEventListener("change", () => {
    if (!radio.checked) return;
    selectedShipping = radio.value;
    markSelected(shippingInputs);
    renderTotals();
  }));
  paymentInputs.forEach((radio) => radio.addEventListener("change", () => markSelected(paymentInputs)));

  function applyCoupon() {
    const code = couponInput.value.trim().toUpperCase();
    couponMessage.classList.remove("error");
    if (code === "DEMO10") {
      couponApplied = true;
      couponMessage.textContent = "DEMO10 applied · 10% off the current basket.";
    } else {
      couponApplied = false;
      couponMessage.classList.add("error");
      couponMessage.textContent = code ? "Code not recognised. Only DEMO10 is available." :
        "Enter DEMO10 to try the sample discount.";
    }
    renderTotals();
  }
  $("apply-coupon").addEventListener("click", applyCoupon);
  couponInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") { e.preventDefault(); applyCoupon(); }
  });

  document.querySelectorAll("[data-add-item]").forEach((button) => {
    button.addEventListener("click", () => changeQuantity(button.dataset.addItem, 1));
  });

  paymentForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (count() === 0) {
      $("cart-error").hidden = false;
      navigate(1);
      return;
    }
    // An explicit demo reference, never a production order identifier.
    const reference = String(Date.now()).slice(-6);
    $("order-id").textContent = "DEMO-" + reference;
    $("order-total").textContent = money(total());
    navigate(3);
  });

  $("restart").addEventListener("click", () => {
    deliveryForm.reset();
    paymentForm.reset();
    cart.runner = 1; cart.tote = 1;
    couponApplied = false;
    couponInput.value = "";
    couponMessage.textContent = "";
    couponMessage.classList.remove("error");
    selectedShipping = "standard";
    errorEl.hidden = true;
    $("cart-error").hidden = true;
    deliveryForm.querySelectorAll(".invalid").forEach((input) => {
      input.classList.remove("invalid"); input.removeAttribute("aria-invalid");
    });
    markSelected(shippingInputs);
    markSelected(paymentInputs);
    renderCart();
    navigate(1);
  });

  markSelected(shippingInputs);
  markSelected(paymentInputs);
  renderCart();
  setStep(1);
})();
