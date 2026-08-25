document.addEventListener("DOMContentLoaded", () => {
  const WHATSAPP_NUMBER = "2347062103875";

  const orderButtons = document.querySelectorAll(".product-button");

  orderButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();

      const card = button.closest(".product-card");
      const size =
        card?.querySelector(".product-size")?.textContent.trim() ||
        "5 LITRES";

      openOrderModal(size);
    });
  });

  document
    .querySelectorAll(".nav-order, .secondary-button, .cta-button")
    .forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        openOrderModal("5 LITRES");
      });
    });

  function openOrderModal(size) {
    const modal = document.getElementById("aku-order-modal");

    const sizeSelect = modal.querySelector("#aku-order-size");

    if (size.toLowerCase().includes("75")) {
      sizeSelect.value = "75cl";
    } else if (size.toLowerCase().includes("1")) {
      sizeSelect.value = "1 Litre";
    } else if (size.toLowerCase().includes("25")) {
      sizeSelect.value = "25 Litres";
    } else {
      sizeSelect.value = "5 Litres";
    }

    modal.classList.add("is-open");
    document.body.classList.add("order-modal-open");
  }

  function closeOrderModal() {
    const modal = document.getElementById("aku-order-modal");

    modal.classList.remove("is-open");
    document.body.classList.remove("order-modal-open");
  }

  const modalMarkup = `
    <div class="aku-order-modal" id="aku-order-modal">

      <div class="aku-order-backdrop" data-close-order></div>

      <div
        class="aku-order-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="aku-order-title"
      >

        <button
          class="aku-order-close"
          type="button"
          aria-label="Close"
          data-close-order
        >
          &times;
        </button>

        <div class="aku-order-eyebrow">
          AKU PALM OIL
        </div>

        <h2 id="aku-order-title">
          Start your order.
        </h2>

        <p class="aku-order-intro">
          Choose your size and quantity. Your order will open directly in WhatsApp.
        </p>

        <label for="aku-order-size">
          Product size
        </label>

        <select id="aku-order-size">

          <option value="75cl">
            75cl bottle
          </option>

          <option value="1 Litre">
            1 Litre bottle
          </option>

          <option value="5 Litres">
            5 Litre gallon
          </option>

          <option value="25 Litres">
            25 Litre gallon
          </option>

        </select>

        <label for="aku-order-quantity">
          Quantity
        </label>

        <div class="aku-quantity-row">

          <button
            type="button"
            class="aku-quantity-button"
            id="aku-quantity-minus"
          >
            −
          </button>

          <input
            id="aku-order-quantity"
            type="number"
            min="1"
            value="1"
            inputmode="numeric"
          />

          <button
            type="button"
            class="aku-quantity-button"
            id="aku-quantity-plus"
          >
            +
          </button>

        </div>

        <label for="aku-order-note">
          Delivery / order note
          <span>(optional)</span>
        </label>

        <textarea
          id="aku-order-note"
          rows="3"
          placeholder="e.g. Abuja, delivery request..."
        ></textarea>

        <button
          class="aku-whatsapp-button"
          id="aku-send-order"
          type="button"
        >
          Continue on WhatsApp
          <span>→</span>
        </button>

        <p class="aku-order-small">
          Your message will open directly in WhatsApp.
        </p>

      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", modalMarkup);

  const modal = document.getElementById("aku-order-modal");
  const quantityInput =
    document.getElementById("aku-order-quantity");

  modal.querySelectorAll("[data-close-order]").forEach((element) => {
    element.addEventListener("click", closeOrderModal);
  });

  document
    .getElementById("aku-quantity-minus")
    .addEventListener("click", () => {
      quantityInput.value = Math.max(
        1,
        Number(quantityInput.value || 1) - 1
      );
    });

  document
    .getElementById("aku-quantity-plus")
    .addEventListener("click", () => {
      quantityInput.value =
        Math.max(1, Number(quantityInput.value || 1) + 1);
    });

  document
    .getElementById("aku-send-order")
    .addEventListener("click", () => {

      const size =
        document.getElementById("aku-order-size").value;

      const quantity =
        Math.max(1, Number(quantityInput.value || 1));

      const note =
        document.getElementById("aku-order-note").value.trim();

      const message = [
        "Hello AKU Palm Oil, I would like to place an order.",
        `Product: ${size}`,
        `Quantity: ${quantity}`,
        note ? `Delivery / note: ${note}` : ""
      ]
        .filter(Boolean)
        .join("\n");

      const whatsappURL =
        `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

      window.open(whatsappURL, "_blank");
    });

  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      modal.classList.contains("is-open")
    ) {
      closeOrderModal();
    }
  });

  /* Smooth reveal animation */

  const revealItems = document.querySelectorAll(
    ".product-card, .story-image, .story-content, .cta"
  );

  if ("IntersectionObserver" in window) {

    const observer = new IntersectionObserver(
      (entries, obs) => {

        entries.forEach((entry) => {

          if (entry.isIntersecting) {

            entry.target.classList.add("is-visible");

            obs.unobserve(entry.target);
          }

        });

      },
      {
        threshold: 0.12
      }
    );

    revealItems.forEach((item) => {
      item.classList.add("reveal-on-scroll");
      observer.observe(item);
    });
  }
});