import './navigation.js';
import { renderSubtractionBtn, renderAddBtn, renderProductCards } from './render.js';
import { addToCart } from './storage.js';
import { fetchProductData } from "./data.js";
const products = await fetchProductData();

const overlay = document.getElementById("modalOverlay");
const modalBox = document.querySelector(".modalBox");
// Select the permanent parent grid container instead of individual buttons
const productGrid = document.querySelector(".product-grid");

function showModal() {
    overlay.classList.remove("hidden");
    overlay.classList.add("show");
}

function closeModal() {
    overlay.classList.remove("show");
    overlay.classList.add("hidden");
}

// Event Delegation: Listen to the grid container
export function viewModal(grid) {
    if (!grid) return;
    grid.addEventListener("click", (event) => {
        // Check if the actual thing clicked was a button (or inside a button)
        if (event.target.tagName === "BUTTON") {
            const clickedId = event.target.dataset.id;
            const matchedProduct = products.find(product => product.id === clickedId);
            modalBox.innerHTML = `
            <article class="modal-card">
            <div class="image-holder">
              <img src="${matchedProduct.imageUrl}" alt="${matchedProduct.name} image" loading="lazy">
            </div>
            <div>
                <h3>${matchedProduct.name}</h3>
                <p>${matchedProduct.description}</p>
                <p class="price">$${matchedProduct.price}</p>
                <div class="quantity-buttons">
                    <button id="subtract-btn">-</button>
                    <p id="quantity">1</p>
                    <button id="add-btn">+</button>
                </div>
                <button data-id="${matchedProduct.id}" id="add-to-cart">Add to Cart</button>
            </div>
            </article>`;
            showModal();
            renderSubtractionBtn();
            renderAddBtn();
            const addToCartBtn = document.getElementById("add-to-cart");
            addToCartBtn.addEventListener("click", () => {
                addToCart(matchedProduct.id);
                closeModal();
            });
        }
    });
}

// Escape key check
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeModal();
    }
});

// Overlay closing system
overlay.addEventListener("click", closeModal);
modalBox.addEventListener("click", (event) => {
    event.stopPropagation();
});
// handle best seller display
let bestProductsIds = ["camp-01", "apparel-m-05", "apparel-m-01", "apparel-m-02"];
let bestProducts = [];
bestProductsIds.forEach(bestSellerId => {
    let product = products.find(matchedProduct => matchedProduct.id == bestSellerId);
    bestProducts.push(product);
})
const bestSellerGrid = document.querySelector(".best-seller-grid");
renderProductCards(bestProducts, bestSellerGrid);
if (bestSellerGrid) {
    renderProductCards(bestProducts, bestSellerGrid);
    viewModal(bestSellerGrid);
}
