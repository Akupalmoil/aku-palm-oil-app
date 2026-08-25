/* =========================================================
   AKU PALM OIL — E-COMMERCE FUNCTIONALITY
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* ---------------------------------------------------------
     CART
     --------------------------------------------------------- */

  let cart = JSON.parse(localStorage.getItem("akuCart")) || [];

  const cartDrawer = document.querySelector(".cart-drawer");
  const cartOverlay = document.querySelector(".cart-overlay");
  const cartItems = document.querySelector(".cart-items");
  const cartTotal = document.querySelector(".cart-total strong");

  const cartButtons = document.querySelectorAll(
    "#cartBtn, .cart-btn, [data-cart]"
  );

  const closeCartButton = document.querySelector(
    ".close-btn, #closeCart"
  );

  const cartCountElements = document.querySelectorAll(
    "#cartCount, .cart-count"
  );


  /* ---------------------------------------------------------
     SAVE CART
     --------------------------------------------------------- */

  function saveCart() {
    localStorage.setItem("akuCart", JSON.stringify(cart));
  }


  /* ---------------------------------------------------------
     FORMAT MONEY
     --------------------------------------------------------- */

  function formatMoney(amount) {
    return "₦" + Number(amount).toLocaleString("en-NG");
  }


  /* ---------------------------------------------------------
     CART COUNT
     --------------------------------------------------------- */

  function updateCartCount() {

    const count = cart.reduce(
      (total, item) => total + item.quantity,
      0
    );

    cartCountElements.forEach(element => {
      element.textContent = count;
    });
  }


  /* ---------------------------------------------------------
     CART TOTAL
     --------------------------------------------------------- */

  function calculateTotal() {

    return cart.reduce(
      (total, item) =>
        total + (Number(item.price) * item.quantity),
      0
    );
  }


  /* ---------------------------------------------------------
     RENDER CART
     --------------------------------------------------------- */

  function renderCart() {

    if (!cartItems) return;

    if (cart.length === 0) {

      cartItems.innerHTML = `
        <div class="empty-cart">
          <div style="font-size:42px;margin-bottom:15px;">🛒</div>
          <h3>Your cart is empty</h3>
          <p>Add AKU Palm Oil products to your cart.</p>
        </div>
      `;

    } else {

      cartItems.innerHTML = cart.map((item, index) => `

        <div class="cart-item">

          <img
            src="${item.image}"
            alt="${item.name}"
          >

          <div>

            <h4>${item.name}</h4>

            <p>${item.size}</p>

            <div class="quantity">

              <button
                type="button"
                onclick="changeQuantity(${index}, -1)"
              >
                −
              </button>

              <span>${item.quantity}</span>

              <button
                type="button"
                onclick="changeQuantity(${index}, 1)"
              >
                +
              </button>

            </div>

          </div>

          <div class="cart-item-total">
            ${formatMoney(item.price * item.quantity)}
          </div>

        </div>

      `).join("");
    }

    if (cartTotal) {
      cartTotal.textContent = formatMoney(calculateTotal());
    }

    updateCartCount();
  }


  /* ---------------------------------------------------------
     ADD TO CART
     --------------------------------------------------------- */

  window.addToCart = function(product) {

    const existing = cart.find(
      item => item.id === product.id
    );

    if (existing) {

      existing.quantity += 1;

    } else {

      cart.push({
        ...product,
        quantity: 1
      });

    }

    saveCart();
    renderCart();

    openCart();
  };


  /* ---------------------------------------------------------
     CHANGE QUANTITY
     --------------------------------------------------------- */

  window.changeQuantity = function(index, amount) {

    if (!cart[index]) return;

    cart[index].quantity += amount;

    if (cart[index].quantity <= 0) {
      cart.splice(index, 1);
    }

    saveCart();
    renderCart();
  };


  /* ---------------------------------------------------------
     OPEN CART
     --------------------------------------------------------- */

  function openCart() {

    if (!cartDrawer) return;

    cartDrawer.classList.add("open");

    if (cartOverlay) {
      cartOverlay.classList.add("open");
    }

    document.body.style.overflow = "hidden";
  }


  /* ---------------------------------------------------------
     CLOSE CART
     --------------------------------------------------------- */

  function closeCart() {

    if (!cartDrawer) return;

    cartDrawer.classList.remove("open");

    if (cartOverlay) {
      cartOverlay.classList.remove("open");
    }

    document.body.style.overflow = "";
  }


  /* ---------------------------------------------------------
     CART BUTTONS
     --------------------------------------------------------- */

  cartButtons.forEach(button => {

    button.addEventListener("click", event => {

      event.preventDefault();

      renderCart();
      openCart();

    });

  });


  if (closeCartButton) {

    closeCartButton.addEventListener(
      "click",
      closeCart
    );

  }


  if (cartOverlay) {

    cartOverlay.addEventListener(
      "click",
      closeCart
    );

  }


  /* ---------------------------------------------------------
     ESCAPE KEY
     --------------------------------------------------------- */

  document.addEventListener("keydown", event => {

    if (event.key === "Escape") {
      closeCart();
    }

  });


  /* ---------------------------------------------------------
     SEARCH
     --------------------------------------------------------- */

  const searchButton =
    document.querySelector("#searchBtn");

  const searchPanel =
    document.querySelector(".search-panel");

  const searchInput =
    document.querySelector("#searchInput");

  if (searchButton && searchPanel) {

    searchButton.addEventListener("click", () => {

      searchPanel.classList.toggle("open");

      if (searchPanel.classList.contains("open")) {

        setTimeout(() => {
          searchInput?.focus();
        }, 100);

      }

    });

  }


  /* ---------------------------------------------------------
     PRODUCT SEARCH
     --------------------------------------------------------- */

  if (searchInput) {

    searchInput.addEventListener(
      "input",
      () => {

        const query =
          searchInput.value
            .toLowerCase()
            .trim();

        document
          .querySelectorAll(".product-card")
          .forEach(card => {

            const text =
              card.textContent
                .toLowerCase();

            card.style.display =
              !query || text.includes(query)
                ? ""
                : "none";

          });

      }
    );

  }


  /* ---------------------------------------------------------
     PRODUCT FILTERS
     --------------------------------------------------------- */

  document
    .querySelectorAll(".pill")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          document
            .querySelectorAll(".pill")
            .forEach(btn =>
              btn.classList.remove("active")
            );

          button.classList.add("active");

          const filter =
            button.dataset.filter;

          document
            .querySelectorAll(".product-card")
            .forEach(card => {

              if (
                !filter ||
                filter === "all"
              ) {

                card.style.display = "";

                return;
              }

              const size =
                card.dataset.size;

              card.style.display =
                size === filter
                  ? ""
                  : "none";

            });

        }
      );

    });


  /* ---------------------------------------------------------
     CHECKOUT — WHATSAPP
     --------------------------------------------------------- */

  const checkoutButton =
    document.querySelector(".checkout-btn");

  if (checkoutButton) {

    checkoutButton.addEventListener(
      "click",
      () => {

        if (cart.length === 0) {

          alert(
            "Your cart is empty. Add a product first."
          );

          return;
        }

        let message =
          "Hello AKU Palm Oil, I would like to place an order:%0A%0A";

        cart.forEach(item => {

          message +=
            `${item.name} (${item.size}) × ${item.quantity} — ${formatMoney(item.price * item.quantity)}%0A`;

        });

        message +=
          `%0ATotal: ${formatMoney(calculateTotal())}`;

        window.open(
          `https://wa.me/2347062103875?text=${message}`,
          "_blank"
        );

      }
    );

  }


  /* ---------------------------------------------------------
     HERO / NAVIGATION
     --------------------------------------------------------- */

  document
    .querySelectorAll('a[href^="#"]')
    .forEach(link => {

      link.addEventListener(
        "click",
        event => {

          const target =
            document.querySelector(
              link.getAttribute("href")
            );

          if (!target) return;

          event.preventDefault();

          target.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });

        }
      );

    });


  /* ---------------------------------------------------------
     INITIALIZE
     --------------------------------------------------------- */

  renderCart();

});