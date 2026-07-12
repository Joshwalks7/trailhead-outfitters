export function renderProductCards(products, targetContainer) {
    if (!targetContainer) return;
    targetContainer.innerHTML = "";
    
    products.forEach(product => {
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
        targetContainer.innerHTML += card;
    });
}

export function renderCartCards(item, targetContainer, quantity) {
    if (!targetContainer) return;
    if (item == {}) {
        targetContainer.innerHTML = "No items in cart yet...";
        return;
    }
    const card = `
        <article class="cart-product-card">
            <div class="image-holder">
                <img src="${item.imageUrl}" alt="${item.name} image">
            </div>
            <div>
                <h3>${item.name}</h3>
                <p>${item.description}</p>
                <p class="price">$${item.price}</p>
                <p>Quantity: <span class="product-quantity">${quantity}</span></p>
                <button class="remove-btn" data-id="${item.id}">Remove from Cart</button>
            </div>
        </article>`;
    targetContainer.innerHTML += card;
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