const productGrid = document.getElementById("product-grid");
export function renderProductCards(products) {
    productGrid.innerHTML = "";
    products.forEach(renderCard);
}
function renderCard(product) {
    const card = `
            <article class="product-card">
            <div class="image-holder">
              <img src="${product.imageUrl}" alt="${product.name} image">
            </div>
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <p class="price">$${product.price}</p>
                <button data-id="${product.id}">View Product</button>
            </article>`;
    productGrid.innerHTML += card;
}
export function renderSubtractionBtn() {
    const subtractBtn = document.getElementById("subtract-btn");
    subtractBtn.addEventListener("click", () => {
        let quantity = document.getElementById("quantity");
        let quantityNum = parseInt(quantity.textContent, 10);
        if (quantityNum > 0) {
            quantityNum--;
            quantity.innerHTML = quantityNum;
        }
    })
}
export function renderAddBtn() {
    const addBtn = document.getElementById("add-btn");
    addBtn.addEventListener("click", () => {
        let quantity = document.getElementById("quantity");
        let quantityNum = parseInt(quantity.textContent, 10);
        if (quantityNum < 10) {
            quantityNum++;
            quantity.innerHTML = quantityNum;
        }
    })
}