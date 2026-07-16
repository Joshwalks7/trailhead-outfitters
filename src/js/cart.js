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

        if (!checkoutForm.checkValidity()) {
            checkoutForm.reportValidity();
            return;
        }

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