```javascript
const products = [
    { id: 1, name: "Fresh Apples", category: "Fruits", price: 120, emoji: "🍎" },
    { id: 2, name: "Bananas", category: "Fruits", price: 50, emoji: "🍌" },
    { id: 3, name: "Oranges", category: "Fruits", price: 80, emoji: "🍊" },
    { id: 4, name: "Fresh Grapes", category: "Fruits", price: 100, emoji: "🍇" },

    { id: 5, name: "Broccoli", category: "Vegetables", price: 60, emoji: "🥦" },
    { id: 6, name: "Tomatoes", category: "Vegetables", price: 35, emoji: "🍅" },
    { id: 7, name: "Carrots", category: "Vegetables", price: 40, emoji: "🥕" },
    { id: 8, name: "Potatoes", category: "Vegetables", price: 30, emoji: "🥔" },

    { id: 9, name: "Fresh Milk", category: "Dairy", price: 30, emoji: "🥛" },
    { id: 10, name: "Cheese", category: "Dairy", price: 110, emoji: "🧀" },
    { id: 11, name: "Butter", category: "Dairy", price: 55, emoji: "🧈" },

    { id: 12, name: "Bread", category: "Bakery", price: 40, emoji: "🍞" },
    { id: 13, name: "Croissant", category: "Bakery", price: 65, emoji: "🥐" },

    { id: 14, name: "Orange Juice", category: "Beverages", price: 90, emoji: "🧃" },
    { id: 15, name: "Coffee", category: "Beverages", price: 150, emoji: "☕" }
];

let cart = [];
let selectedCategory = "All";

const productGrid = document.getElementById("productGrid");
const cartCount = document.getElementById("cartCount");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");

function displayProducts(list = products) {
    productGrid.innerHTML = "";

    document.getElementById("productCount").textContent =
        `${list.length} products available`;

    if (list.length === 0) {
        productGrid.innerHTML =
            '<p class="empty-message">No products found. Try another search.</p>';
        return;
    }

    list.forEach(product => {
        const card = document.createElement("div");
        card.className = "product-card";

        card.innerHTML = `
            <div class="product-image">${product.emoji}</div>
            <h3>${product.name}</h3>
            <p class="product-category">${product.category}</p>
            <div class="product-bottom">
                <span class="price">₹${product.price}</span>
                <button class="add-btn" data-id="${product.id}">+ Add</button>
            </div>
        `;

        productGrid.appendChild(card);
    });
}

function filterProducts() {
    const searchText = document.getElementById("searchInput")
        .value.toLowerCase().trim();

    const filtered = products.filter(product => {
        const matchesCategory =
            selectedCategory === "All" ||
            product.category === selectedCategory;

        const matchesSearch =
            product.name.toLowerCase().includes(searchText) ||
            product.category.toLowerCase().includes(searchText);

        return matchesCategory && matchesSearch;
    });

    displayProducts(filtered);
}

// Add products to cart
productGrid.addEventListener("click", event => {
    const button = event.target.closest(".add-btn");

    if (!button) return;

    const id = Number(button.dataset.id);
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        const product = products.find(item => item.id === id);
        cart.push({ ...product, quantity: 1 });
    }

    updateCart();
    showToast("Product added to cart!");
});

// Category buttons
document.querySelectorAll(".category").forEach(button => {
    button.addEventListener("click", () => {
        document.querySelectorAll(".category").forEach(item => {
            item.classList.remove("active");
        });

        button.classList.add("active");
        selectedCategory = button.dataset.category;
        filterProducts();
    });
});

// Search
document.getElementById("searchBtn").addEventListener("click", filterProducts);

document.getElementById("searchInput").addEventListener("input", filterProducts);

// Update cart
function updateCart() {
    cartItems.innerHTML = "";

    let total = 0;
    let count = 0;

    if (cart.length === 0) {
        cartItems.innerHTML =
            '<p class="empty-message">Your cart is empty!</p>';
    }

    cart.forEach(item => {
        total += item.price * item.quantity;
        count += item.quantity;

        const div = document.createElement("div");
        div.className = "cart-item";

        div.innerHTML = `
            <div class="cart-item-info">
                <strong>${item.emoji} ${item.name}</strong>
                <p>₹${item.price} × ${item.quantity}</p>
            </div>

            <div class="quantity-controls">
                <button data-action="decrease" data-id="${item.id}">−</button>
                <span>${item.quantity}</span>
                <button data-action="increase" data-id="${item.id}">+</button>
            </div>

            <button class="remove-btn" data-action="remove" data-id="${item.id}">
                Remove
            </button>
        `;

        cartItems.appendChild(div);
    });

    cartCount.textContent = count;
    cartTotal.textContent = total;
}

// Cart quantity and remove buttons
cartItems.addEventListener("click", event => {
    const button = event.target.closest("button");

    if (!button) return;

    const id = Number(button.dataset.id);
    const action = button.dataset.action;

    const item = cart.find(product => product.id === id);

    if (!item) return;

    if (action === "increase") {
        item.quantity++;
    }

    if (action === "decrease") {
        item.quantity--;

        if (item.quantity <= 0) {
            cart = cart.filter(product => product.id !== id);
        }
    }

    if (action === "remove") {
        cart = cart.filter(product => product.id !== id);
    }

    updateCart();
});

// Modal functions
function openModal(id) {
    document.getElementById(id).classList.add("show");
}

function closeModal(id) {
    document.getElementById(id).classList.remove("show");
}

document.getElementById("cartBtn").addEventListener("click", () => {
    updateCart();
    openModal("cartModal");
});

document.getElementById("loginBtn").addEventListener("click", () => {
    openModal("loginModal");
});

document.querySelectorAll(".close-btn").forEach(button => {
    button.addEventListener("click", () => {
        closeModal(button.dataset.close);
    });
});

// Close modal by clicking outside
document.querySelectorAll(".modal").forEach(modal => {
    modal.addEventListener("click", event => {
        if (event.target === modal) {
            modal.classList.remove("show");
        }
    });
});

// Demo login
document.getElementById("loginForm").addEventListener("submit", event => {
    event.preventDefault();

    const name = document.getElementById("userName").value.trim();
    const email = document.getElementById("userEmail").value.trim();

    localStorage.setItem("freshCartUser", JSON.stringify({ name, email }));

    document.getElementById("loginMessage").textContent =
        `Welcome, ${name}! You are logged in.`;

    document.getElementById("loginBtn").textContent = name.split(" ")[0];

    showToast("Login successful!");
    setTimeout(() => closeModal("loginModal"), 1200);
});

// Checkout button
document.getElementById("checkoutBtn").addEventListener("click", () => {
    if (cart.length === 0) {
        showToast("Your cart is empty!");
        return;
    }

    closeModal("cartModal");

    const user = JSON.parse(localStorage.getItem("freshCartUser") || "null");

    if (user) {
        document.getElementById("customerName").value = user.name;
    }

    openModal("checkoutModal");
});

// Place order
document.getElementById("checkoutForm").addEventListener("submit", event => {
    event.preventDefault();

    if (cart.length === 0) {
        showToast("Your cart is empty!");
        closeModal("checkoutModal");
        return;
    }

    const name = document.getElementById("customerName").value;
    const phone = document.getElementById("customerPhone").value;
    const address = document.getElementById("customerAddress").value;
    const payment = document.getElementById("paymentMethod").value;

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity, 0
    );

    const order = {
        customer: name,
        phone: phone,
        address: address,
        payment: payment,
        items: [...cart],
        total: total,
        date: new Date().toLocaleString()
    };

    // Save demo order in browser
    const orders = JSON.parse(localStorage.getItem("freshCartOrders") || "[]");
    orders.push(order);
    localStorage.setItem("freshCartOrders", JSON.stringify(orders));

    cart = [];
    updateCart();

    closeModal("checkoutModal");
    document.getElementById("checkoutForm").reset();

    showToast(`Order placed successfully! Total: ₹${total}`);
});

// Toast notification
function showToast(message) {
    const toast = document.getElementById("toast");

    toast.textContent = message;
    toast.style.display = "block";

    clearTimeout(window.toastTimer);

    window.toastTimer = setTimeout(() => {
        toast.style.display = "none";
    }, 2500);
}

// Load saved user
const savedUser = JSON.parse(localStorage.getItem("freshCartUser") || "null");

if (savedUser) {
    document.getElementById("loginBtn").textContent =
        savedUser.name.split(" ")[0];
}

// Initial display
displayProducts();
updateCart();
```