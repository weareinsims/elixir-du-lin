// Élixir Du Lin — main.js

const PRODUCTS = [
  {
    id: 1,
    name: "Mystère Noir",
    slug: "mystere-noir",
    tagline: "Inspired by Drakkar Noir",
    description: "An intense, unapologetic composition built for the bold. Dark woods, aromatic herbs, and a deep musky base that clings to fabric long after the cycle ends. Each sheet is a statement — not a scent.",
    price: 24.00,
    sheets: 18,
    scent: "Woody Aromatic",
    category: "woody",
    notes: { top: "Bergamot, Lavender", heart: "Cedar, Juniper", base: "Vetiver, Oakmoss" },
    monogram: "M"
  },
  {
    id: 2,
    name: "Éclat Bleu",
    slug: "eclat-bleu",
    tagline: "Inspired by Bleu de Chanel",
    description: "Fresh, sharp, and unmistakably refined. A marine-citrus opening gives way to clean woods and white musks, leaving laundry with the quiet presence of someone who moves through the world with intention.",
    price: 24.00,
    sheets: 18,
    scent: "Fresh Citrus",
    category: "fresh",
    notes: { top: "Citrus, Grapefruit", heart: "Labdanum, Ginger", base: "Sandalwood, White Musk" },
    monogram: "É"
  },
  {
    id: 3,
    name: "Rosa Valentina",
    slug: "rosa-valentina",
    tagline: "Inspired by Valentino",
    description: "Delicate yet commanding. A bouquet of fresh roses woven with warm vanilla and soft powder notes. The scent of someone who walks into a room and shifts its atmosphere without saying a word.",
    price: 24.00,
    sheets: 18,
    scent: "Floral Feminine",
    category: "floral",
    notes: { top: "Bulgarian Rose, Peony", heart: "Iris, Jasmine", base: "Vanilla, Powder Musk" },
    monogram: "R"
  },
  {
    id: 4,
    name: "Paradis Doré",
    slug: "paradis-dore",
    tagline: "Inspired by Jimmy Choo",
    description: "Seductive and effortlessly glamorous. Bright florals over a warm caramel-patchouli base that wraps your clothes in something between confidence and temptation. Made for evenings that deserve to be remembered.",
    price: 24.00,
    sheets: 18,
    scent: "Fruity Floral",
    category: "floral",
    notes: { top: "Tiger Orchid, Toffee", heart: "Gardenia, Patchouli", base: "Caramel, Sandalwood" },
    monogram: "P"
  },
  {
    id: 5,
    name: "Oud Royale",
    slug: "oud-royale",
    tagline: "A house original",
    description: "Our most exclusive composition. Rich Middle Eastern oud layered with rose absolute and dark amber, drawn from one of perfumery's most prized ingredients. Reserved for those who treat laundry as a ritual.",
    price: 28.00,
    sheets: 18,
    scent: "Oud & Amber",
    category: "oriental",
    notes: { top: "Saffron, Rose Absolute", heart: "Agarwood (Oud)", base: "Dark Amber, Resinous Musk" },
    monogram: "O"
  },
  {
    id: 6,
    name: "Santal Blanc",
    slug: "santal-blanc",
    tagline: "A house original",
    description: "Quiet. Warm. Exactly right. Creamy Australian sandalwood with a whisper of coconut and skin-soft musks. The kind of scent you notice on someone and can't quite name, but never want to leave.",
    price: 24.00,
    sheets: 18,
    scent: "Warm Woody",
    category: "woody",
    notes: { top: "Coconut, Cardamom", heart: "Sandalwood, Cedarwood", base: "Skin Musk, Benzoin" },
    monogram: "S"
  }
];

// ========================
// CART
// ========================
function getCart() {
  try {
    return JSON.parse(localStorage.getItem('edl_cart') || '[]');
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem('edl_cart', JSON.stringify(cart));
  updateCartCount();
}

function addToCart(productId, qty = 1) {
  const cart = getCart();
  const existing = cart.find(i => i.id === productId);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ id: productId, qty });
  }
  saveCart(cart);
  const product = PRODUCTS.find(p => p.id === productId);
  if (product) showToast(product.name);
}

function removeFromCart(productId) {
  const cart = getCart().filter(i => i.id !== productId);
  saveCart(cart);
}

function updateQty(productId, newQty) {
  if (newQty < 1) { removeFromCart(productId); return; }
  const cart = getCart();
  const item = cart.find(i => i.id === productId);
  if (item) item.qty = newQty;
  saveCart(cart);
}

function getCartTotal() {
  return getCart().reduce((sum, item) => {
    const p = PRODUCTS.find(p => p.id === item.id);
    return p ? sum + (p.price * item.qty) : sum;
  }, 0);
}

function getCartItemCount() {
  return getCart().reduce((sum, item) => sum + item.qty, 0);
}

function updateCartCount() {
  const count = getCartItemCount();
  document.querySelectorAll('.cart-count').forEach(el => {
    el.textContent = count;
    el.classList.toggle('visible', count > 0);
  });
}

// ========================
// TOAST
// ========================
let toastTimer = null;

function showToast(productName) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <span class="toast-name"></span>
      <span class="toast-msg">Added to cart</span>
    `;
    document.body.appendChild(toast);
  }
  toast.querySelector('.toast-name').textContent = productName;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
}

// ========================
// NAVBAR
// ========================
function initNav() {
  const nav = document.querySelector('nav');
  if (!nav) return;
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 60);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  updateCartCount();

  // Set active nav link
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
}

// ========================
// PRODUCT CARD HTML
// ========================
function productCardHTML(p, linkPrefix = '') {
  return `
    <a href="${linkPrefix}product.html?id=${p.id}" class="product-card">
      <div class="product-img">
        <div class="product-img-inner">
          <span class="placeholder-monogram">${p.monogram}</span>
          <span class="placeholder-scent">${p.scent}</span>
        </div>
        <div class="product-img-overlay"></div>
      </div>
      <div class="product-info">
        <div class="product-name">${p.name}</div>
        <div class="product-tagline">${p.tagline}</div>
        <div class="product-meta">
          <span class="product-price">$${p.price.toFixed(2)}</span>
          <span class="product-sheets">${p.sheets} Sheets</span>
        </div>
      </div>
    </a>
  `;
}

// ========================
// HOMEPAGE
// ========================
function initHome() {
  const grid = document.querySelector('.products-grid');
  if (!grid) return;
  grid.innerHTML = PRODUCTS.slice(0, 4).map(p => productCardHTML(p)).join('');
}

// ========================
// SHOP PAGE
// ========================
function initShop() {
  const grid = document.querySelector('.shop-grid');
  if (!grid) return;

  function render(category) {
    const filtered = category === 'all'
      ? PRODUCTS
      : PRODUCTS.filter(p => p.category === category);
    grid.innerHTML = filtered.map(p => productCardHTML(p)).join('');
  }

  render('all');

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      render(btn.dataset.filter);
    });
  });
}

// ========================
// PRODUCT PAGE
// ========================
function initProduct() {
  const params = new URLSearchParams(location.search);
  const id = parseInt(params.get('id'));
  const p = PRODUCTS.find(pr => pr.id === id);
  if (!p) { document.body.innerHTML = '<p style="text-align:center;padding:10rem;color:#888">Product not found.</p>'; return; }

  document.title = `${p.name} — Élixir Du Lin`;

  document.getElementById('pd-name')?.forEach
    ? null
    : null;

  const setEl = (sel, val, prop = 'textContent') => {
    document.querySelectorAll(sel).forEach(el => { el[prop] = val; });
  };

  setEl('.pd-name', p.name);
  setEl('.pd-tagline', p.tagline);
  setEl('.pd-price', `$${p.price.toFixed(2)}`);
  setEl('.pd-sheets', `${p.sheets} sheets per box`);
  setEl('.pd-description', p.description);
  setEl('.pd-monogram', p.monogram);
  setEl('.pd-scent', p.scent);
  document.querySelectorAll('.pd-note-top').forEach(el => el.textContent = p.notes.top);
  document.querySelectorAll('.pd-note-heart').forEach(el => el.textContent = p.notes.heart);
  document.querySelectorAll('.pd-note-base').forEach(el => el.textContent = p.notes.base);

  // Related products
  const relatedGrid = document.querySelector('.related-grid');
  if (relatedGrid) {
    const related = PRODUCTS.filter(pr => pr.id !== p.id).slice(0, 3);
    relatedGrid.innerHTML = related.map(pr => productCardHTML(pr)).join('');
  }

  // Quantity
  let qty = 1;
  const qtyDisplay = document.querySelector('.qty-num');
  const updateQtyDisplay = () => { if (qtyDisplay) qtyDisplay.textContent = qty; };

  document.querySelector('.qty-minus')?.addEventListener('click', () => {
    if (qty > 1) { qty--; updateQtyDisplay(); }
  });

  document.querySelector('.qty-plus')?.addEventListener('click', () => {
    qty++;
    updateQtyDisplay();
  });

  document.querySelector('.add-to-cart-btn')?.addEventListener('click', () => {
    addToCart(p.id, qty);
  });
}

// ========================
// CART PAGE
// ========================
function initCart() {
  const container = document.querySelector('.cart-layout');
  if (!container) return;

  function render() {
    const cart = getCart();

    if (cart.length === 0) {
      container.innerHTML = `
        <div class="empty-cart-state">
          <h2>Your cart is empty.</h2>
          <p>Discover our collection of luxury-inspired dryer sheets.</p>
          <a href="shop.html" class="btn-primary"><span>Shop the Collection</span></a>
        </div>
      `;
      return;
    }

    const itemsHTML = cart.map(item => {
      const p = PRODUCTS.find(pr => pr.id === item.id);
      if (!p) return '';
      return `
        <div class="cart-item" data-id="${p.id}">
          <div class="cart-item-img">
            <span class="mini-mono">${p.monogram}</span>
          </div>
          <div class="cart-item-details">
            <h3>${p.name}</h3>
            <span class="item-tagline">${p.tagline}</span>
            <div class="cart-item-qty">
              <button class="qty-btn qty-minus" data-id="${p.id}">−</button>
              <div class="qty-num">${item.qty}</div>
              <button class="qty-btn qty-plus" data-id="${p.id}">+</button>
            </div>
            <button class="item-remove" data-id="${p.id}">Remove</button>
          </div>
          <div class="item-price">$${(p.price * item.qty).toFixed(2)}</div>
        </div>
      `;
    }).join('');

    const subtotal = getCartTotal();
    const shipping = subtotal >= 75 ? 0 : 9.95;
    const total = subtotal + shipping;

    container.innerHTML = `
      <div class="cart-items">${itemsHTML}</div>
      <div class="cart-summary">
        <h3>Order Summary</h3>
        <div class="summary-row"><span>Subtotal</span><span>$${subtotal.toFixed(2)}</span></div>
        <div class="summary-row"><span>Shipping</span><span>${shipping === 0 ? 'Free' : '$' + shipping.toFixed(2)}</span></div>
        ${shipping > 0 ? `<div class="summary-row"><span style="color:var(--gold);font-size:0.62rem">Add $${(75 - subtotal).toFixed(2)} for free shipping</span></div>` : ''}
        <div class="summary-row total"><span>Total</span><span>$${total.toFixed(2)}</span></div>
        <a href="#" class="btn-secondary" style="width:100%;text-align:center;display:block;"><span>Proceed to Checkout</span></a>
        <p class="checkout-note">Checkout coming soon. Payments via Stripe.</p>
      </div>
    `;

    container.querySelectorAll('.qty-minus').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.id);
        const item = getCart().find(i => i.id === id);
        if (item) { updateQty(id, item.qty - 1); render(); }
      });
    });

    container.querySelectorAll('.qty-plus').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.id);
        const item = getCart().find(i => i.id === id);
        if (item) { updateQty(id, item.qty + 1); render(); }
      });
    });

    container.querySelectorAll('.item-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        removeFromCart(parseInt(btn.dataset.id));
        render();
      });
    });
  }

  render();
}

// ========================
// INIT
// ========================
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initHome();
  initShop();
  initProduct();
  initCart();
});
