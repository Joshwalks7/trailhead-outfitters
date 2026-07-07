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
                <button>View Product</button>
            </article>`;
    productGrid.innerHTML += card;
}