import './navigation.js';
import { retrieveFromStorage } from "./storage.js";
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
    renderCartCards(product, cartGrid, cartItem.quantity);
});
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
    if (subtotalValue < 35)
    {
        shippingPrice = 6.99;
    }
    shipping.innerHTML = `$${shippingPrice.toFixed(2)}`;
    let totalCharge = subtotalValue + taxValue + shippingPrice;
    total.innerHTML = `$${totalCharge.toFixed(2)}`;
}
updateCheckoutDetails();