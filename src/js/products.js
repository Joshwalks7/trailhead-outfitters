import './navigation.js';
import { fetchProductData } from "./data.js";
import { renderProductCards } from "./render.js";
const productData = await fetchProductData();
console.log(productData);
const productGrid = document.querySelector(".product-grid");
export function returnProductData() {
    return productData;
}
function filterProducts() {
    const params = new URLSearchParams(window.location.search);
    const rawSearch = params.get("search"); // Wait to lowercase this!

    // 1. The Safety Check
    if (!rawSearch) {
        return productData; 
    }

    // Now it's safe to manipulate the string
    const searchWords = rawSearch.toLowerCase().split(" ");
    console.log("Search words:", searchWords);

    let filteredProducts = productData.filter(product => {
        
        // 2. Use .every() to check each word the user typed
        return searchWords.every(word => {
            
            // Check Name
            const matchName = product.name.toLowerCase().includes(word);
            
            // Check Description
            const matchDesc = product.description.toLowerCase().includes(word);
            
            // Check Categories (Turn the array into a string first!)
            const matchCategory = product.categories.join(" ").toLowerCase().includes(word);
            
            // If the word is in ANY of these three places, it's a match!
            return matchName || matchDesc || matchCategory;
        });
    });

    return filteredProducts;
}

const filteredProducts = filterProducts();
renderProductCards(filteredProducts);