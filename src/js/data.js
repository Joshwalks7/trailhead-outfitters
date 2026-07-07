const PRODUCT_DATA_URL = "/data/products.json";

export async function fetchProductData() {
    const response = await fetch(PRODUCT_DATA_URL);
    const data = response.json();
    return data;
}