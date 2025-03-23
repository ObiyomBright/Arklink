let bars = document.getElementById("bars");
let menuOptions = document.getElementById("menu-options");

// Initially hide the menu
menuOptions.style.display = "none";

bars.addEventListener("click", (event) => {
    // Toggle menu display
    if (menuOptions.style.display === "none" || menuOptions.style.display === "") {
        menuOptions.style.display = "flex";
    } else {
        menuOptions.style.display = "none";
    }
    
    // Stop event from propagating to document
    event.stopPropagation();
});

// Close menu when clicking outside
document.addEventListener("click", (event) => {
    if (menuOptions.style.display === "flex" && !bars.contains(event.target) && !menuOptions.contains(event.target)) {
        menuOptions.style.display = "none";
    }
});

// Function to update the cart counter 
function updateCartCounter() {
    const cartCounter = document.querySelectorAll(".cartCounter");
    cartCounter.forEach((counter) => {
        counter.textContent = cart.length;
    })
}

//Function to update Image Modal
function openImageModal(imageSrc) {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImg');
    modalImg.src = imageSrc;
    modal.style.display = 'block';
}

//Function to close modal
function closeImageModal(event){
    document.getElementById('imageModal').style.display = 'none';
}

//Function to create items container
function createItemContainer(product) {
    const itemContainer = document.createElement("div");
    itemContainer.className = "item";
     const formattedPrice = Number(product.price).toLocaleString('en-US');
     const priceUnit = product.category == 'sanitary' ? '' : '/sqm';
     const quantityUnit = product.category == 'sanitary' ? 'pcs' : 'sqm';

    itemContainer.innerHTML = `
    <img src="${product.img}" class="itemImg" onclick="openImageModal('${product.img}')">
            <div class="itemDetails">
                <p class="size">${product.size} ${product.producer} ${product.name}</p>
                <p class="price"><span class="naira">N</span> ${formattedPrice}${priceUnit}</p>
                <button class="addToCart">Add to Cart</button>
                <!-- Quantity Control container -->
                <div class="quantityControl">
                    <button class="quantityDecrease">-</button>  
                    <p>
                        <span class="quantityCount" contenteditable="true">1</span>
                        <span class="sqm">${quantityUnit}</span>
                    </p>
                     <button class="quantityIncrease">+</button>
                </div> 
            </div>`;
    return itemContainer;
}

//Function to render products
async function renderProducts() {
    const productsContainer = document.querySelector(".products");

    try {
        //Fetch products from the database
        const response = await fetch("sanitary-wares.php");
        if (!response.ok) {
            console.error("Unable to fetch products");
            return;
        }

        const productsResponse = await response.json();

        //Render each product
        productsResponse.forEach((product) => {
            const itemCard = createItemContainer(product);

            // Add functionality to Add to Cart button
            const addToCartButton = itemCard.querySelector(".addToCart");
            const quantityControl = itemCard.querySelector(".quantityControl");
            const quantityCount = quantityControl.querySelector(".quantityCount");
            const increaseButton = quantityControl.querySelector(".quantityIncrease");
            const decreaseButton = quantityControl.querySelector(".quantityDecrease");

            addToCartButton.addEventListener("click", () => {
                addToCart(product);
                quantityCount.textContent = cart.find(
                    (item) => item.id === product.id
                ).quantity;
                displayQuantityControl(quantityControl, addToCartButton, 1);
            });

            // Add functionality to Increase button
            increaseButton.addEventListener("click", () => {
                updateProductQuantity(product.id, 1);
                const updatedProduct = cart.find((item) => item.id === product.id);
                quantityCount.textContent = updatedProduct
                    ? updatedProduct.quantity
                    : 0;
                displayQuantityControl(
                    quantityControl,
                    addToCartButton,
                    updatedProduct.quantity
                );
            });

            // Add functionality to Decrease button
            decreaseButton.addEventListener("click", () => {
                updateProductQuantity(product.id, -1);
                const updatedProduct = cart.find((item) => item.id === product.id);
                const newQuantity = updatedProduct ? updatedProduct.quantity : 0;
                quantityCount.textContent = newQuantity;
                displayQuantityControl(quantityControl, addToCartButton, newQuantity);
            });

            // Keep the quantity control visible while editing the quantityCount
            quantityCount.addEventListener("focus", () => {
                quantityControl.style.display = "flex";
            });

            quantityCount.addEventListener("input", () => {
                const newQuantity = parseInt(quantityCount.textContent, 10);
                if (!isNaN(newQuantity) && newQuantity >= 0) {
                    const cartProduct = cart.find((item) => item.id === product.id);

                    if (cartProduct) {
                        cartProduct.quantity = newQuantity;

                        if (cartProduct.quantity <= 0) {
                            cart = cart.filter((item) => item.id !== product.id); // Remove product if quantity is 0
                        }

                        updateLocalStorage();
                    }
                    displayQuantityControl(quantityControl, addToCartButton, newQuantity);
                }
            });

            productsContainer.appendChild(itemCard);
        });
    } catch (error) {
        console.error("Error fetching products: ", error);
    }
}

//Initialize cart from local storage or as an empty array
let cart = JSON.parse(localStorage.getItem("cart")) || [];

//Function to update local storage
function updateLocalStorage() {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCounter();
}

// Function to display the quantity control and hide the add to cart button
function displayQuantityControl(quantityControl, addToCartButton, count) {
    quantityControl.style.display = count > 0 ? "flex" : "none";
    addToCartButton.style.display = count > 0 ? "none" : "inline-block";
}

//Function to add product to cart
function addToCart(product) {
    const existingProduct = cart.find((item) => item.id === product.id);

    if (existingProduct) {
        existingProduct.quantity += 1; //Increase quantity if product already exists
    } else {
        product.quantity = 1; //Add new product with a quantity of 1
        cart.push(product);
    }

    updateLocalStorage();
}

//Function to update the product quantity
function updateProductQuantity(productId, count) {
    const product = cart.find((item) => item.id === productId);

    if (product) {
        product.quantity += count;

        if (product.quantity <= 0) {
            cart = cart.filter((item) => item.id !== productId); // Remove product if quantity is 0
        }

        updateLocalStorage();
    }
}

//Render Products
document.addEventListener("DOMContentLoaded", renderProducts);
