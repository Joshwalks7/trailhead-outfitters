const PRODUCT_DATA_URL = "/data/products.json";

export async function fetchProductData() {
    try {
        const response = await fetch(PRODUCT_DATA_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;

    } catch (error) {
        console.error("Failed to fetch product data:", error);
        return []; 
    }
}