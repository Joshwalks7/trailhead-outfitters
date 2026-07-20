import './navigation.js';
import { retrieveFromStorage, removeFromCart, clearCart } from "./storage.js";
import { fetchProductData } from "./data.js";
import { renderCartCards } from './render.js';
import { closeModal as hideModal, openModal, setupModal, trapModalFocus } from "./modal.js";

const cartGrid = document.getElementById("cart-products");
const products = await fetchProductData();
const currentCart = retrieveFromStorage();
const cartProducts = [];
const checkoutButton = document.querySelector("#checkout button");
const checkoutOverlay = document.getElementById("modalOverlay");
const checkoutDialog = document.querySelector(".checkoutModalBox");
const checkoutForm = document.getElementById("checkout-form");
const purchaseMessage = document.getElementById("purchase-message");
const checkoutCloseButton = checkoutDialog?.querySelector("[data-modal-close]");

setupModal(checkoutOverlay, checkoutDialog, "checkout-modal-title");

if (checkoutCloseButton) {
    checkoutCloseButton.addEventListener("click", () => hideModal(checkoutOverlay));
}

currentCart.forEach(cartItem => {
    const product = products.find(matchedProduct => matchedProduct.id == cartItem.id);
    if (product) {
        cartProducts.push({
            ...product,
            quantity: cartItem.quantity
        });
    }
});

renderCartCards(cartProducts, cartGrid);

if (cartGrid) {
    cartGrid.addEventListener("click", (event) => {
        if (event.target.classList.contains("remove-btn")) {
            const clickedId = event.target.dataset.id;
            removeFromCart(clickedId);
            const updatedProducts = cartProducts.filter(item => item.id !== clickedId);
            cartProducts.length = 0;
            cartProducts.push(...updatedProducts);
            renderCartCards(cartProducts, cartGrid);
            updateCheckoutDetails();
        }
    });
}
// checkout form modal
if (checkoutButton && checkoutOverlay && checkoutForm && cartProducts.length > 0) {
    // open modal
    checkoutButton.addEventListener("click", () => {
        openModal(checkoutOverlay, checkoutDialog);
    });
    // close modal clicking outside the modal
    checkoutOverlay.addEventListener("click", () => {
        hideModal(checkoutOverlay);
    });
    // don't let clicks inside the modal close the modal
    checkoutForm.addEventListener("click", (event) => {
        event.stopPropagation();
    });

    checkoutForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const expiryInput = document.getElementById("card-expiry");
        
        // Reset custom validity before re-checking
        expiryInput.setCustomValidity("");

        // Check if the input passes standard HTML checks first
        if (!checkoutForm.checkValidity()) {
            checkoutForm.reportValidity();
            return;
        }

        // Custom check: Verify if the card date is in the past
        if (isCardExpired(expiryInput.value)) {
            expiryInput.setCustomValidity("This credit card has expired.");
            checkoutForm.reportValidity(); // Displays the error message to the user
            return;
        }

        // Process successful checkout...
        clearCart();
        cartProducts.length = 0;
        renderCartCards(cartProducts, cartGrid);
        updateCheckoutDetails();
        checkoutForm.reset();
        hideModal(checkoutOverlay);

        if (purchaseMessage) {
            purchaseMessage.textContent = "Purchase complete. Your cart has been cleared.";
        }
    });
}

document.addEventListener("keydown", event => {
    trapModalFocus(event, checkoutDialog, () => hideModal(checkoutOverlay));
});

function isCardExpired(expiryValue) {
  const [monthStr, yearStr] = expiryValue.split("/");
  if (!monthStr || !yearStr) return true;

  const expMonth = parseInt(monthStr, 10);
  const expYear = 2000 + parseInt(yearStr, 10); // Converts "26" to 2026

  const now = new Date();
  const currentMonth = now.getMonth() + 1; // Months are 0-indexed in JS
  const currentYear = now.getFullYear();

  // Card is expired if year is in the past, or if year is current but month is in the past
  if (expYear < currentYear) return true;
  if (expYear === currentYear && expMonth < currentMonth) return true;

  return false;
}

function updateCheckoutDetails() {
    const subtotal = document.getElementById("subtotal");
    const shipping = document.getElementById("shipping");
    const tax = document.getElementById("tax");
    const total = document.getElementById("total");
    const taxRate = 0.06;
    let subtotalValue = 0;

    cartProducts.forEach(product => {
        subtotalValue += parseFloat(product.price) * product.quantity;
    });

    subtotal.innerHTML = `$${subtotalValue.toFixed(2)}`;

    const taxValue = taxRate * subtotalValue;
    tax.innerHTML = `$${taxValue.toFixed(2)}`;

    let shippingPrice = 0;
    if (cartProducts.length > 0) {
        shippingPrice = subtotalValue < 75 ? 6.99 : 0;
    }

    shipping.innerHTML = `$${shippingPrice.toFixed(2)}`;
    total.innerHTML = `$${(subtotalValue + taxValue + shippingPrice).toFixed(2)}`;
}

updateCheckoutDetails();