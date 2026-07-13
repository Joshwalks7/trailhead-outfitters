import './navigation.js';
import { retrieveFromStorage, removeFromCart } from "./storage.js";
import { fetchProductData } from "./data.js";
import { renderCartCards } from './render.js';
let cartGrid = document.getElementById("cart-products");
let products = await fetchProductData();
let currentCart = retrieveFromStorage();
let cartProducts = [];
currentCart.forEach(cartItem => {
    let product = products.find(matchedProduct => matchedProduct.id == cartItem.id);
    if (product) {
        let combinedItem = {
            ...product,          // Copies id, name, price, description, imageUrl
            quantity: cartItem.quantity // Adds the quantity straight from localStorage!
        };
        cartProducts.push(combinedItem);
    }
});
renderCartCards(cartProducts, cartGrid);
if (cartGrid) {
    cartGrid.addEventListener("click", (event) => {
        if (event.target.classList.contains("remove-btn")) {
            const clickedId = event.target.dataset.id;
            removeFromCart(clickedId);
            cartProducts = cartProducts.filter(item => item.id !== clickedId);
            renderCartCards(cartProducts, cartGrid);
            updateCheckoutDetails();
        }
    })
}

function updateCheckoutDetails() {
    const subtotal = document.getElementById("subtotal");
    const shipping = document.getElementById("shipping");
    const tax = document.getElementById("tax");
    const promo = document.getElementById("promo-code");
    const total = document.getElementById("total");
    const taxRate = 0.06;
    let subtotalValue = 0;
    cartProducts.forEach(product => {
        subtotalValue += parseFloat(product.price) * product.quantity;
    })
    subtotal.innerHTML = `$${subtotalValue.toFixed(2)}`;
    let taxValue = taxRate * subtotalValue;
    tax.innerHTML = `$${taxValue.toFixed(2)}`;
    let shippingPrice = 0;
    if (cartProducts.length > 0) {
        if (subtotalValue < 75) {
            shippingPrice = 6.99;
        } else {
            shippingPrice = 0;
        }
    }
    shipping.innerHTML = `$${shippingPrice.toFixed(2)}`;
    let totalCharge = subtotalValue + taxValue + shippingPrice;
    total.innerHTML = `$${totalCharge.toFixed(2)}`;
}
updateCheckoutDetails();