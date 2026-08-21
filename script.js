// ===== Product Data =====
const products = [
  {
    id: 1,
    name: "Wireless Earbuds Pro",
    category: "Electronics",
    price: 599,
    emoji: "🎧",
    cashback: "5%",
    description: "Noise-cancelling true wireless earbuds with 30h battery."
  },
  {
    id: 2,
    name: "Smart Watch Series 8",
    category: "Wearables",
    price: 1899,
    emoji: "⌚",
    cashback: "8%",
    description: "Health tracking, GPS, and always-on display."
  },
  {
    id: 3,
    name: "Organic Skincare Set",
    category: "Beauty",
    price: 428,
    emoji: "✨",
    cashback: "6%",
    description: "Full facial care routine with natural ingredients."
  },
  {
    id: 4,
    name: "Portable Blender",
    category: "Home",
    price: 299,
    emoji: "🥤",
    cashback: "4%",
    description: "USB-C rechargeable blender for smoothies on the go."
  },
  {
    id: 5,
    name: "Leather Crossbody Bag",
    category: "Fashion",
    price: 780,
    emoji: "👜",
    cashback: "7%",
    description: "Genuine leather bag with multiple compartments."
  },
  {
    id: 6,
    name: "Yoga Mat Premium",
    category: "Sports",
    price: 268,
    emoji: "🧘",
    cashback: "5%",
    description: "Non-slip eco-friendly mat with carrying strap."
  },
  {
    id: 7,
    name: "Smart LED Desk Lamp",
    category: "Home",
    price: 349,
    emoji: "💡",
    cashback: "3%",
    description: "Adjustable brightness & color temperature, USB ports."
  },
  {
    id: 8,
    name: "Premium Coffee Beans 1kg",
    category: "Food",
    price: 198,
    emoji: "☕",
    cashback: "10%",
    description: "Single-origin Arabica, freshly roasted in HK."
  }
];

// ===== State =====
let cart = JSON.parse(localStorage.getItem("cashbackCart")) || [];

// ===== DOM Elements =====
const productGrid = document.getElementById("productGrid");
const cartBtn = document.getElementById("cartBtn");
const cartCount = document.getElementById("cartCount");
const cartSidebar = document.getElementById("cartSidebar");
const closeCart = document.getElementById("closeCart");
const overlay = document.getElementById("overlay");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const checkoutBtn = document.getElementById("checkoutBtn");
const checkoutModal = document.getElementById("checkoutModal");
const closeCheckout = document.getElementById("closeCheckout");
const checkoutForm = document.getElementById("checkoutForm");
const orderSummaryItems = document.getElementById("orderSummaryItems");
const payTotal = document.getElementById("payTotal");
const successModal = document.getElementById("successModal");
const closeSuccess = document.getElementById("closeSuccess");
const orderIdEl = document.getElementById("orderId");
const payBtn = document.getElementById("payBtn");

// ===== Render Products =====
function renderProducts() {
  productGrid.innerHTML = products
    .map(
      (p) => `
    <div class="product-card">
      <div class="product-image">${p.emoji}</div>
      <div class="product-info">
        <div class="product-category">${p.category}</div>
        <h3 class="product-name">${p.name}</h3>
        <p class="product-desc">${p.description}</p>
        <div class="product-footer">
          <div>
            <div class="product-price">HK$${p.price.toLocaleString()}</div>
            <span class="cashback-badge">Earn ${p.cashback}</span>
          </div>
          <button class="add-btn" onclick="addToCart(${p.id})">Add to Cart</button>
        </div>
      </div>
    </div>
  `
    )
    .join("");
}

// ===== Cart Functions =====
function saveCart() {
  localStorage.setItem("cashbackCart", JSON.stringify(cart));
  updateCartUI();
}

function addToCart(id) {
  const product = products.find((p) => p.id === id);
  const existing = cart.find((item) => item.id === id);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  saveCart();
  openCart();
}

function removeFromCart(id) {
  cart = cart.filter((item) => item.id !== id);
  saveCart();
}

function updateQty(id, delta) {
  const item = cart.find((i) => i.id === id);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    removeFromCart(id);
  } else {
    saveCart();
  }
}

function getCartTotal() {
  return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

function updateCartUI() {
  // Badge
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  cartCount.textContent = totalItems;

  // Items
  if (cart.length === 0) {
    cartItems.innerHTML = `<div class="cart-empty">Your cart is empty</div>`;
    checkoutBtn.disabled = true;
  } else {
    cartItems.innerHTML = cart
      .map(
        (item) => `
      <div class="cart-item">
        <div class="cart-item-emoji">${item.emoji}</div>
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">HK$${(item.price * item.qty).toLocaleString()}</div>
          <div class="cart-item-actions">
            <button class="qty-btn" onclick="updateQty(${item.id}, -1)">−</button>
            <span class="qty">${item.qty}</span>
            <button class="qty-btn" onclick="updateQty(${item.id}, 1)">+</button>
            <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
          </div>
        </div>
      </div>
    `
      )
      .join("");
    checkoutBtn.disabled = false;
  }

  cartTotal.textContent = `HK$${getCartTotal().toLocaleString()}`;
}

// ===== Cart Sidebar =====
function openCart() {
  cartSidebar.classList.add("open");
  overlay.classList.add("show");
}

function closeCartSidebar() {
  cartSidebar.classList.remove("open");
  overlay.classList.remove("show");
}

// ===== Checkout =====
function openCheckout() {
  closeCartSidebar();
  // Populate order summary
  orderSummaryItems.innerHTML = cart
    .map(
      (item) => `
    <div class="summary-item">
      <span>${item.name} × ${item.qty}</span>
      <span>HK$${(item.price * item.qty).toLocaleString()}</span>
    </div>
  `
    )
    .join("");
  payTotal.textContent = `HK$${getCartTotal().toLocaleString()}`;
  checkoutModal.classList.add("open");
}

function closeCheckoutModal() {
  checkoutModal.classList.remove("open");
}

// ===== Payment Simulation =====
function processPayment(e) {
  e.preventDefault();

  const cardNumber = document.getElementById("cardNumber").value.replace(/\s/g, "");
  const payBtnEl = document.getElementById("payBtn");

  // Simple validation
  if (cardNumber.length < 13) {
    alert("Please enter a valid card number.");
    return;
  }

  // Show loading state
  payBtnEl.disabled = true;
  payBtnEl.textContent = "Processing Payment...";

  // Simulate network delay
  setTimeout(() => {
    // Generate fake order ID
    const orderId = "CB" + Date.now().toString().slice(-8);
    orderIdEl.textContent = orderId;

    // Clear cart
    cart = [];
    saveCart();

    // Close checkout, show success
    closeCheckoutModal();
    successModal.classList.add("open");

    // Reset form & button
    checkoutForm.reset();
    payBtnEl.disabled = false;
    payBtnEl.textContent = "Pay Now";
  }, 1800);
}

// ===== Card Formatting Helpers =====
document.getElementById("cardNumber")?.addEventListener("input", (e) => {
  let value = e.target.value.replace(/\D/g, "").slice(0, 16);
  value = value.replace(/(.{4})/g, "$1 ").trim();
  e.target.value = value;
});

document.getElementById("expiry")?.addEventListener("input", (e) => {
  let value = e.target.value.replace(/\D/g, "").slice(0, 4);
  if (value.length >= 3) {
    value = value.slice(0, 2) + "/" + value.slice(2);
  }
  e.target.value = value;
});

// ===== Event Listeners =====
cartBtn.addEventListener("click", openCart);
closeCart.addEventListener("click", closeCartSidebar);
overlay.addEventListener("click", () => {
  closeCartSidebar();
  closeCheckoutModal();
});
checkoutBtn.addEventListener("click", openCheckout);
closeCheckout.addEventListener("click", closeCheckoutModal);
checkoutForm.addEventListener("submit", processPayment);
closeSuccess.addEventListener("click", () => {
  successModal.classList.remove("open");
});

// ===== Init =====
renderProducts();
updateCartUI();
