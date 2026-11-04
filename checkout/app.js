(() => {
  "use strict";

  // INR amounts in paise. Display values are sample prices, not an inventory feed.
  const SUBTOTAL = 369800;
  const SHIPPING = { standard: 0, express: 14900 };
  const format = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" });

  const deliveryForm = document.getElementById("delivery-form");
  const paymentForm = document.getElementById("payment-form");
  const deliveryPanel = document.getElementById("delivery-panel");
  const paymentPanel = document.getElementById("payment-panel");
  const successPanel = document.getElementById("success-panel");
  const shippingInputs = Array.from(document.querySelectorAll('input[name="shipping"]'));
  const paymentInputs = Array.from(document.querySelectorAll('input[name="payment"]'));
  const couponInput = document.getElementById("coupon-code");
  const couponMessage = document.getElementById("coupon-message");
  const errorEl = document.getElementById("delivery-error");

  let couponApplied = false;
  let selectedShipping = "standard";

  function price(paise) {
    return format.format(paise / 100);
  }

  function totalPaise() {
    const discount = couponApplied ? Math.round(SUBTOTAL * .1) : 0;
    return SUBTOTAL + SHIPPING[selectedShipping] - discount;
  }

  function renderTotals() {
    const discount = couponApplied ? Math.round(SUBTOTAL * .1) : 0;
    document.getElementById("subtotal").textContent = price(SUBTOTAL);
    document.getElementById("delivery-cost").textContent =
      SHIPPING[selectedShipping] ? price(SHIPPING[selectedShipping]) : "Free";
    document.getElementById("discount").textContent = "−" + price(discount);
    document.getElementById("grand-total").textContent = price(totalPaise());
  }

  function markSelected(radioInputs) {
    radioInputs.forEach((radio) => {
      radio.closest(".shipping-option").classList.toggle("selected", radio.checked);
    });
  }

  function setStep(step) {
    deliveryPanel.hidden = step !== 1;
    paymentPanel.hidden = step !== 2;
    successPanel.hidden = step !== 3;

    ["delivery", "payment", "done"].forEach((name, index) => {
      const element = document.getElementById("step-" + name);
      const current = step === index + 1;
      element.classList.toggle("current", current);
      element.classList.toggle("completed", step > index + 1);
      if (current) element.setAttribute("aria-current", "step");
      else element.removeAttribute("aria-current");
    });
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
    const name = document.getElementById("full-name");
    const email = document.getElementById("email");
    const address = document.getElementById("address");
    const city = document.getElementById("city");
    const postal = document.getElementById("postal");

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

  function goToStep(step) {
    setStep(step);
    const target = step === 1 ? deliveryPanel : step === 2 ? paymentPanel : successPanel;
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  deliveryForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!validateDelivery()) return;

    const name = document.getElementById("full-name").value.trim();
    const address = document.getElementById("address").value.trim();
    const city = document.getElementById("city").value.trim();
    const postal = document.getElementById("postal").value.trim();
    document.getElementById("address-preview").textContent =
      name + " · " + address + ", " + city + " " + postal;
    goToStep(2);
  });

  document.getElementById("edit-address").addEventListener("click", () => goToStep(1));

  shippingInputs.forEach((radio) => radio.addEventListener("change", () => {
    if (!radio.checked) return;
    selectedShipping = radio.value;
    markSelected(shippingInputs);
    renderTotals();
  }));

  paymentInputs.forEach((radio) => radio.addEventListener("change", () => {
    markSelected(paymentInputs);
  }));

  document.getElementById("apply-coupon").addEventListener("click", () => {
    const code = couponInput.value.trim().toUpperCase();
    couponMessage.classList.remove("error");

    if (code === "DEMO10") {
      couponApplied = true;
      couponMessage.textContent = "DEMO10 applied · 10% off sample order";
    } else if (!code) {
      couponApplied = false;
      couponMessage.textContent = "Enter DEMO10 to preview a discount.";
      couponMessage.classList.add("error");
    } else {
      couponApplied = false;
      couponMessage.textContent = "Code not recognised. Try DEMO10.";
      couponMessage.classList.add("error");
    }
    renderTotals();
  });

  paymentForm.addEventListener("submit", (event) => {
    event.preventDefault();
    // Demo complete: no network request, payment collection, or order creation.
    const reference = String(Date.now()).slice(-6);
    document.getElementById("order-id").textContent = "DEMO-" + reference;
    document.getElementById("order-total").textContent = price(totalPaise());
    goToStep(3);
  });

  document.getElementById("restart").addEventListener("click", () => {
    deliveryForm.reset();
    paymentForm.reset();
    couponApplied = false;
    couponInput.value = "";
    couponMessage.textContent = "";
    couponMessage.classList.remove("error");
    selectedShipping = "standard";
    errorEl.hidden = true;
    deliveryForm.querySelectorAll(".invalid").forEach((input) => {
      input.classList.remove("invalid");
      input.removeAttribute("aria-invalid");
    });
    markSelected(shippingInputs);
    markSelected(paymentInputs);
    renderTotals();
    goToStep(1);
  });

  markSelected(shippingInputs);
  markSelected(paymentInputs);
  renderTotals();
  setStep(1);
})();
