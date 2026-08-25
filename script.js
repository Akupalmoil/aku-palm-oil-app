document.addEventListener("DOMContentLoaded", () => {

  const orderButtons = document.querySelectorAll(".product-button");

  orderButtons.forEach(button => {

    button.addEventListener("click", () => {

      button.textContent = "Opening WhatsApp...";

      setTimeout(() => {
        button.textContent = "Order on WhatsApp";
      }, 2000);

    });

  });

});
