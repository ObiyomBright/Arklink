let bars = document.getElementById('bars').addEventListener('click', () => {
    let menuOptions = document.getElementById('menu-options');

    if (menuOptions.style.display == 'none') {
        menuOptions.style.display = 'flex';
    } else {
        menuOptions.style.display = 'none';
    }
});

let items = document.querySelectorAll('.item');

//Function to add to cart
function addToCart(product){
    console.log(product);
}

//Function to create items container
function createItemContainer(product) {
    //Create a div container for the product container
    const itemContainer = document.createElement('div');
    itemContainer.className = 'item';
    itemContainer.innerHTML = `<img src="${product.img}" class="itemImg">
            <div class="itemDetails">
                <p class="size">${product.producer}</p>
                <p class="size">Size: ${product.size}</p>
                <p class="price">Price: <span class="naira">N</span> ${product.price}/sqm</p>
                <button onclick="addToCart(${JSON.stringify(product)})" class="addToCart">Add to Cart</button>
                <!-- Quantity Control container -->
                <div class="quantityControl">
                    <button class="quantityIncrease">+</button>
                    <p>
                        <span class="quantityCount" contenteditable="true">1</span>
                        <span class="sqm">sqm</span>
                    </p>
                    <button class="quantityDecrease">-</button>
                </div> 
            </div>`;

    return itemContainer;
}

//Function to render products
async function renderProducts() {
    //Declare the container where product would be appended
    const productsContainer = document.querySelector('.products');

    try {
        //Fetch products from the database
        const products = await fetch('index.php');
        if (!products.ok) {
            console.error('Unabe to fetch products');
        }

        const productsResponse = await products.json();

        //Render each product
        productsResponse.forEach(product => {
            const itemCard = createItemContainer(product);
            productsContainer.appendChild(itemCard);
        });
    } catch (error) {
        console.error('Error fetching products: ', error);
    }

}

document.addEventListener('DOMContentLoaded', () => {

    //Call the render products function
    renderProducts();
})