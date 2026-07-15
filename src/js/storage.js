export function retrieveFromStorage() {
    let currentCart = localStorage.getItem("cart");
    currentCart = currentCart ? JSON.parse(currentCart) : [];
    return currentCart;
}
export function addToCart(productId) {
    const itemQuantity = parseInt(document.getElementById("quantity").textContent, 10);
    
    // Pull the existing cart array from storage. If it doesn't exist yet, start with an empty array []
    let currentCart = retrieveFromStorage();

    // Package your new item as a clean JavaScript object
    const newCartItem = {
        id: productId,
        quantity: itemQuantity
    };
    // check if the product already exists
    let existingProduct = currentCart.find(matchedProduct => matchedProduct.id === newCartItem.id);
    if (existingProduct) {
        existingProduct.quantity += itemQuantity;
    } else {
        currentCart.push(newCartItem);
    }

    // 5. Serialize the whole array into a string and save it permanently
    localStorage.setItem("cart", JSON.stringify(currentCart));
}

export function removeFromCart(clickedId) {
    let currentCart = retrieveFromStorage();
    const updatedCart = currentCart.filter(item => item.id !== clickedId);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
}

export function clearCart() {
    localStorage.removeItem("cart");
}