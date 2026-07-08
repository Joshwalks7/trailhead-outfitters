export function addToCart(productId) {
    console.log("Attempting to add product ID:", productId);
    const itemQuantity = parseInt(document.getElementById("quantity").textContent, 10);
    
    // Pull the existing cart array from storage. If it doesn't exist yet, start with an empty array []
    let currentCart = localStorage.getItem("cart");
    currentCart = currentCart ? JSON.parse(currentCart) : [];

    // Package your new item as a clean JavaScript object
    const newCartItem = {
        id: productId,
        quantity: itemQuantity
    };
    currentCart.push(newCartItem);

    // 5. Serialize the whole array into a string and save it permanently
    localStorage.setItem("cart", JSON.stringify(currentCart));
    
    console.log("Updated Cart Storage:", currentCart);
}