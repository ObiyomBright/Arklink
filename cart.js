let cart = JSON.parse(localStorage.getItem('cart')) || [];
let cartItems = document.querySelector('.cartItems');
let cartTotal = document.querySelector('.cartTotal');
let orderNow = document.querySelector('#orderNow');

let bars = document.getElementById("bars").addEventListener("click", () => {
    let menuOptions = document.getElementById("menu-options");

    if (menuOptions.style.display == "none") {
        menuOptions.style.display = "flex";
    } else {
        menuOptions.style.display = "none";
    }
});

// Function to update cart counter
function updateCartCounter() {
    let cartCounter = document.querySelectorAll('.cartCounter');

    cartCounter.forEach(counter => {
        counter.textContent = cart.length;
    });
}

//Function Cart Summary
function cartSummary() {
    let total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    return total.toFixed(2); // Returns the total price with 2 decimal places
}

// Function to create product container
function createProductContainer(product) {
    let productsContainer = document.createElement('li');
    productsContainer.classList = 'product';
    productsContainer.id = product.id;
    productsContainer.innerHTML = `
    <img src="${product.img}" alt="image" class="productImage">
          <div class="productDetails">
            <p class="productInfo">Name:&nbsp;${product.producer}</p>
          <p class="productInfo">Size:&nbsp; ${product.size}</p>
          <p class="productInfo">Quantity:&nbsp; ${product.quantity} sqm</p>
          <p class="productInfo">Price: &nbsp;₦${product.price}</p>
          </div>
          <div class="productButton">
            <p class="productTotal">Total: &nbsp; <span class="total">₦${((product.quantity) * (product.price)).toFixed(2)}</span></p>
            <button class="removeItem">x</button>
          </div>
    `;

    return productsContainer;
}

// Function to remove item from cart
function removeItem(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCounter();
    displayCartItems();
}

// Function to display cart items
function displayCartItems() {
    cartItems.innerHTML = ``;
    const totalPrice = document.querySelector('.totalPrice');


    // If the cart is empty
    if (cart.length <= 0) {
        cartItems.textContent = `Your cart is empty`;
        cartItems.classList = 'emptyCart';
        cartTotal.style.display = 'none';
        return;
    }

    cart.forEach(item => {
        const itemCard = createProductContainer(item);
        cartItems.appendChild(itemCard);

        // Add event listener to remove button
        itemCard.querySelector('.removeItem').addEventListener('click', () => removeItem(item.id));
    });

    totalPrice.textContent = `₦ ${cartSummary()}`;
}

function alertBox(message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alertBox';
    alertDiv.textContent = message;
    document.body.prepend(alertDiv);
    setTimeout(() => alertDiv.remove(), 5000);
}

// Function to handle order submission
async function handleOrder() {
    let userContact = document.querySelector('.userContact').value;
    let userAddress = document.querySelector('.userAddress').value;
    let totalPrice = cartSummary(); // Get total price

    //Check if user contact and address are empty
    if (userContact.length > 0 && userAddress.length > 0) {

        // Create a form data object to send via POST request
        let formData = new FormData();
        formData.append('totalPrice', totalPrice);
        formData.append('phoneNumber', userContact);
        formData.append('address', userAddress);
        formData.append('cartDetails', JSON.stringify(cart));

        // Send data to the cart.php page
        try {
            const request = await fetch('cart.php', {
                method: 'POST',
                body: formData,
            });

            const response = await request.json();
            alertBox(response.message);
            console.log(response.message);

            if (response.status == 'success') {
                // Clear the cart and update the cart counter if the order was successful
                localStorage.removeItem('cart');
                cart = [];
                updateCartCounter();
                displayCartItems();
            }
        } catch (error) {
            alertBox('Failed to submit order. Please try again.');
            console.error(error);
        }

    } else {
        alertBox('Please provide your contact and address');
    }
}

// Add event listener to orderNow button
orderNow.addEventListener('click', (event) => {
    event.preventDefault(); // Prevent the form from submitting the default way
    handleOrder(); // Call the function to handle order submission
});

document.addEventListener('DOMContentLoaded', () => {
    updateCartCounter();
    displayCartItems();
});
