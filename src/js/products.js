import './navigation.js';
import { fetchProductData } from "./data.js";
import { renderProductCards, renderSubtractionBtn, renderAddBtn } from "./render.js";
import { addToCart } from "./storage.js";
import { closeModal as hideModal, openModal, setupModal, trapModalFocus } from "./modal.js";

const productData = await fetchProductData();
const productGrid = document.querySelector(".product-grid");
const filterButtonsContainer = document.getElementById("filter-buttons");
const overlay = document.getElementById("modalOverlay");
const modalBox = document.querySelector(".modalBox");
const selectedFilters = new Set();

setupModal(overlay, modalBox, "product-modal-title");

// These are the buttons that will appear in the filter sidebar.
const filterOptions = [
    "all",
    "men",
    "women",
    "apparel",
    "camping",
    "hiking",
    "backpacking",
    "gear",
    "footwear",
    "trail-running",
    "camp-kitchen",
    "snow",
    "accessories"
];

function formatFilterLabel(filter) {
    if (filter === "all") return "All";
    return filter
        .split("-")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

// Hide the product modal.
function closeModal() {
    hideModal(overlay);
}

// Fill the modal with the selected product and open it.
function showModal(product) {
    if (!overlay || !modalBox) return;

    modalBox.innerHTML = `
        <article class="modal-card">

            <div class="image-holder">
                <img src="${product.imageUrl}" alt="${product.name} image" loading="lazy">
            </div>
            <div>
            <div class="modal-header">
                <h3 id="product-modal-title">${product.name}</h3>
                <button type="button" class="modal-close" data-modal-close aria-label="Close dialog">×</button>
            </div>
                <p>${product.description}</p>
                <p class="price">$${product.price}</p>
                <div class="quantity-buttons">
                    <button id="subtract-btn">-</button>
                    <p id="quantity">1</p>
                    <button id="add-btn">+</button>
                </div>
                <button data-id="${product.id}" id="add-to-cart">Add to Cart</button>
            </div>
        </article>`;

    openModal(overlay, modalBox);

    const addToCartBtn = document.getElementById("add-to-cart");
    const subtractBtn = document.getElementById("subtract-btn");
    const addBtn = document.getElementById("add-btn");

    if (subtractBtn) {
        renderSubtractionBtn();
    }

    if (addBtn) {
        renderAddBtn();
    }

    if (addToCartBtn) {
        addToCartBtn.addEventListener("click", () => {
            addToCart(product.id);
            closeModal();
        });
    }

    const closeButton = modalBox.querySelector("[data-modal-close]");
    if (closeButton) {
        closeButton.addEventListener("click", closeModal);
    }
}

// First filter the products by search text from the URL.
function getSearchFilteredProducts(products) {
    const params = new URLSearchParams(window.location.search);
    const rawSearch = params.get("search");

    if (!rawSearch) {
        return products;
    }

    const searchWords = rawSearch.toLowerCase().split(" ");

    return products.filter(product => {
        return searchWords.every(word => {
            const matchName = product.name.toLowerCase().includes(word);
            const matchDesc = product.description.toLowerCase().includes(word);
            const matchCategory = product.categories.join(" ").toLowerCase().includes(word);
            return matchName || matchDesc || matchCategory;
        });
    });
}

// Then narrow the list down by whatever filter buttons are active.
function getCategoryFilteredProducts(products) {
    if (selectedFilters.size === 0 || selectedFilters.has("all")) {
        return products;
    }

    return products.filter(product => {
        return [...selectedFilters].some(filter => product.categories.includes(filter));
    });
}

// Combine the search filter and the category filter, then redraw the cards.
function renderFilteredProducts() {
    const searchFiltered = getSearchFilteredProducts(productData);
    const categoryFiltered = getCategoryFilteredProducts(searchFiltered);
    renderProductCards(categoryFiltered, productGrid);
}

// Turn a filter button on or off visually.
function setButtonState(button, isActive) {
    button.classList.toggle("filter-button-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
}

// Build the filter buttons so the page does not need hard-coded HTML for them.
function renderFilterButtons() {
    if (!filterButtonsContainer) return;

    filterButtonsContainer.innerHTML = "";

    filterOptions.forEach(filter => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "filter-button";
        button.dataset.filter = filter;
        button.textContent = formatFilterLabel(filter);

        const isAll = filter === "all";
        setButtonState(button, isAll);

        button.addEventListener("click", () => {
            if (isAll) {
                selectedFilters.clear();
                filterButtonsContainer.querySelectorAll(".filter-button").forEach(otherButton => {
                    setButtonState(otherButton, otherButton.dataset.filter === "all");
                });
            } else {
                if (selectedFilters.has(filter)) {
                    selectedFilters.delete(filter);
                    setButtonState(button, false);
                } else {
                    selectedFilters.add(filter);
                    setButtonState(button, true);
                }

                const allButton = filterButtonsContainer.querySelector('[data-filter="all"]');
                if (allButton) {
                    setButtonState(allButton, selectedFilters.size === 0);
                }

                if (selectedFilters.size === 0 && allButton) {
                    setButtonState(allButton, true);
                }
            }

            renderFilteredProducts();
        });

        filterButtonsContainer.appendChild(button);
    });
}

// Close the modal if the user clicks the background.
if (overlay) {
    overlay.addEventListener("click", closeModal);
}

// Prevent clicks inside the modal from closing it.
if (modalBox) {
    modalBox.addEventListener("click", event => event.stopPropagation());
}

// Open the correct product modal when a product button is clicked.
if (productGrid) {
    productGrid.addEventListener("click", event => {
        const button = event.target.closest("button[data-id]");
        if (!button) return;

        const matchedProduct = productData.find(product => product.id === button.dataset.id);
        if (matchedProduct) {
            showModal(matchedProduct);
        }
    });
}

// Escape key closes the modal.
document.addEventListener("keydown", event => {
    trapModalFocus(event, modalBox, closeModal);
});

// Start the page by showing buttons and the initial product list.
renderFilterButtons();
renderFilteredProducts();