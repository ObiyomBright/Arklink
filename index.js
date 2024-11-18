let bars = document.getElementById('bars').addEventListener('click', () => {
    let menuOptions = document.getElementById('menu-options');

    if (menuOptions.style.display == 'none') {
        menuOptions.style.display = 'flex';
    } else {
        menuOptions.style.display = 'none';
    }
})

document.addEventListener('DOMContentLoaded', () => {
    const products = document.querySelector('.products');

    function createItemElement(item) {
        // Create Item  Container
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('item');

        // Populate item data
        itemDiv.innerHTML = `
                <img src="${item.img}" class="itemImg">
                <div class="itemDetails">
                    <p class="size">Producer: ${item.producer}</p>
                    <p class="size">Size: ${item.size}</p>
                    <p class="price">Price: <span class="naira">N</span> ${item.price} /sqm</p>
                    <button onclick="addToCart()" class="addToCart">Add to Cart</button>
                    <div class="quantityControl">
                        <button class="quantityIncrease">+</button>
                        <p>
                            <span class="quantityCount" contenteditable="true">1</span>
                            <span class="sqm">sqm</span>
                        </p>
                        <button class="quantityDecrease">-</button>
                    </div>
                </div>`;
                    products.appendChild(itemDiv);
    }
})

async function loadItems() {
    try {
        const response = await fetch('index.php');
        if(response.ok){
            const items = await response.json();
            items.forEach(createItemElement);
        } else {
            console.error('Failed to fetch items:');
        }
    } catch(error){
        console.error(error);
    }
    
}

loadItems();