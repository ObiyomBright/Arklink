let bars = document.getElementById("bars");
let menuOptions = document.getElementById("menu-options");
menuOptions.style.display = "none";

bars.addEventListener("click", (event) => {
    menuOptions.style.display = (menuOptions.style.display === "none" || menuOptions.style.display === "") ? "flex" : "none";
    event.stopPropagation();
});

document.addEventListener("click", (event) => {
    if (menuOptions.style.display === "flex" && !bars.contains(event.target) && !menuOptions.contains(event.target)) {
        menuOptions.style.display = "none";
    }
});

// Cart related functions
let cart = JSON.parse(localStorage.getItem("cart")) || [];
function updateCartCounter() {
    const cartCounter = document.querySelectorAll(".cartCounter");
    cartCounter.forEach(counter => {
        counter.textContent = cart.length;
    });
}
function updateLocalStorage() {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCounter();
}
function addToCart(product) {
    const existingProduct = cart.find(item => item.id === product.id);
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        product.quantity = 1;
        cart.push(product);
    }
    updateLocalStorage();
}
function updateProductQuantity(productId, count) {
    const product = cart.find(item => item.id === productId);
    if (product) {
        product.quantity += count;
        if (product.quantity <= 0) {
            cart = cart.filter(item => item.id !== productId);
        }
        updateLocalStorage();
    }
}

// Modal Functions
function openImageModal(imageSrc) {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImg');
    modalImg.src = imageSrc;
    modal.style.display = 'block';
}
function closeImageModal() {
    document.getElementById('imageModal').style.display = 'none';
}

// Create Item
function createItemContainer(product) {
    const itemContainer = document.createElement("div");
    itemContainer.className = "item";
    const formattedPrice = Number(product.price).toLocaleString('en-US');
    const priceUnit = product.category === 'sanitary' ? '' : '/sqm';
    const quantityUnit = product.category === 'sanitary' ? 'pcs' : 'sqm';

    itemContainer.innerHTML = `
        <img src="${product.img}" class="itemImg" onclick="openImageModal('${product.img}')">
        <div class="itemDetails">
            <p class="size">${product.size} ${product.producer} ${product.name}</p>
            <p class="price"><span class="naira">N</span> ${formattedPrice}${priceUnit}</p>
            <button class="addToCart">Add to Cart</button>
            <div class="quantityControl">
                <button class="quantityDecrease">-</button>  
                <p><span class="quantityCount" contenteditable="true">1</span> <span class="sqm">${quantityUnit}</span></p>
                <button class="quantityIncrease">+</button>
            </div> 
        </div>`;

    return itemContainer;
}

// Display quantity or button
function displayQuantityControl(quantityControl, addToCartButton, count) {
    quantityControl.style.display = count > 0 ? "flex" : "none";
    addToCartButton.style.display = count > 0 ? "none" : "inline-block";
}

// Shuffle array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Render products batch by batch
let offset = 0;
const limit = 15;
let isFetching = false;
let allProductsFetched = false;

async function fetchAndRenderProducts() {
    if (isFetching || allProductsFetched) return;
    isFetching = true;

    const loadingMessage = document.querySelector('.loadingMessage');
    loadingMessage.style.display = 'block';

    try {
        const response = await fetch(`index.php?offset=${offset}&limit=${limit}`);
        if (!response.ok) {
            console.error("Failed to fetch products.");
            isFetching = false;
            return;
        }

        const products = await response.json();
        if (products.length === 0) {
            allProductsFetched = true;
            loadingMessage.textContent = "All products loaded.";
            return;
        }

        shuffleArray(products);

        const productsContainer = document.querySelector(".products");
        products.forEach(product => {
            const itemCard = createItemContainer(product);

            const addToCartButton = itemCard.querySelector(".addToCart");
            const quantityControl = itemCard.querySelector(".quantityControl");
            const quantityCount = quantityControl.querySelector(".quantityCount");
            const increaseButton = quantityControl.querySelector(".quantityIncrease");
            const decreaseButton = quantityControl.querySelector(".quantityDecrease");

            addToCartButton.addEventListener("click", () => {
                addToCart(product);
                quantityCount.textContent = cart.find(item => item.id === product.id).quantity;
                displayQuantityControl(quantityControl, addToCartButton, 1);
            });

            increaseButton.addEventListener("click", () => {
                updateProductQuantity(product.id, 1);
                const updatedProduct = cart.find(item => item.id === product.id);
                quantityCount.textContent = updatedProduct ? updatedProduct.quantity : 0;
                displayQuantityControl(quantityControl, addToCartButton, updatedProduct?.quantity || 0);
            });

            decreaseButton.addEventListener("click", () => {
                updateProductQuantity(product.id, -1);
                const updatedProduct = cart.find(item => item.id === product.id);
                quantityCount.textContent = updatedProduct ? updatedProduct.quantity : 0;
                displayQuantityControl(quantityControl, addToCartButton, updatedProduct?.quantity || 0);
            });

            quantityCount.addEventListener("focus", () => {
                quantityControl.style.display = "flex";
            });

            quantityCount.addEventListener("input", () => {
                const newQuantity = parseInt(quantityCount.textContent, 10);
                if (!isNaN(newQuantity) && newQuantity >= 0) {
                    const cartProduct = cart.find(item => item.id === product.id);
                    if (cartProduct) {
                        cartProduct.quantity = newQuantity;
                        if (cartProduct.quantity <= 0) {
                            cart = cart.filter(item => item.id !== product.id);
                        }
                        updateLocalStorage();
                    }
                    displayQuantityControl(quantityControl, addToCartButton, newQuantity);
                }
            });

            productsContainer.appendChild(itemCard);
        });

        offset += limit;
        isFetching = false;
        loadingMessage.style.display = 'none';

        // Start fetching the next batch immediately
        fetchAndRenderProducts();
    } catch (error) {
        console.error("Error fetching products: ", error);
        isFetching = false;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    fetchAndRenderProducts();
    updateCartCounter();
});
