const paymentData = {
  Banesco: {
    title: "Transferencia Banesco",
    bank: "Banesco",
    holder: "Todo Importado",
    account: "Tu cuenta Banesco aquí",
    note: "Enviar comprobante por WhatsApp."
  },
  Provincial: {
    title: "Transferencia Provincial",
    bank: "Banco Provincial",
    holder: "Todo Importado",
    account: "Tu cuenta Provincial aquí",
    note: "Enviar comprobante por WhatsApp."
  },
  Mercantil: {
    title: "Transferencia Mercantil",
    bank: "Banco Mercantil",
    holder: "Todo Importado",
    account: "Tu cuenta Mercantil aquí",
    note: "Enviar comprobante por WhatsApp."
  },
  BanescoPanama: {
    title: "Transferencia Banesco Panamá",
    bank: "Banesco Panamá",
    holder: "Todo Importado",
    account: "Tu cuenta Banesco Panamá aquí",
    note: "Ideal para pagos internacionales."
  },
  PagoMovil: {
    title: "Pago móvil",
    bank: "Pago móvil",
    holder: "Todo Importado",
    account: "Número y cédula aquí",
    note: "Incluye referencia."
  },
  Zelle: {
    title: "Zelle",
    bank: "Zelle",
    holder: "Todo Importado",
    account: "Correo Zelle aquí",
    note: "Confirma el monto exacto."
  },
  Binance: {
    title: "Binance",
    bank: "Binance",
    holder: "Todo Importado",
    account: "Cuenta USDT aquí",
    note: "Indica red y monto."
  }
};

let products = [];
let cart = [];

const productList = document.getElementById("productList");
const cartList = document.getElementById("cartList");
const cartTotal = document.getElementById("cartTotal");
const cartCount = document.getElementById("cartCount");
const productCount = document.getElementById("productCount");
const searchInput = document.getElementById("searchInput");
const checkoutSection = document.getElementById("checkoutSection");
const paymentDetails = document.getElementById("paymentDetails");

async function loadProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("active", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  products = data;
  renderProducts();
}

function renderProducts() {
  const query = searchInput.value.toLowerCase();
  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(query) ||
    p.category.toLowerCase().includes(query) ||
    p.description.toLowerCase().includes(query)
  );

  productCount.textContent = filtered.length;
  productList.innerHTML = "";

  filtered.forEach(product => {
    const inStock = product.stock > 0;

    productList.innerHTML += `
      <div class="card">
        <img src="${product.image_url}" alt="${product.name}">
        <div class="card-body">
          <h3 class="product-title">${product.name}</h3>
          <div class="meta">${product.category}</div>
          <div class="price">$${Number(product.price).toFixed(2)}</div>
          <div class="stock ${inStock ? "available" : "unavailable"}">
            ${inStock ? `Disponible (${product.stock})` : "Sin stock"}
          </div>
          <p class="meta">${product.description}</p>
          <button class="btn ${inStock ? "btn-primary" : "btn-disabled"}"
            ${inStock ? `onclick="addToCart(${product.id})"` : "disabled"}>
            ${inStock ? "Agregar al carrito" : "No disponible"}
          </button>
        </div>
      </div>
    `;
  });
}

function addToCart(id) {
  const product = products.find(p => p.id === id);
  if (!product || product.stock <= 0) return;
  cart.push(product);
  updateCart();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCart();
}

function updateCart() {
  cartList.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    total += Number(item.price);
    cartList.innerHTML += `
      <div class="cart-item">
        <div>
          <strong>${item.name}</strong><br>
          <small>${item.category} - $${Number(item.price).toFixed(2)}</small>
        </div>
        <button class="btn btn-primary" onclick="removeFromCart(${index})">Quitar</button>
      </div>
    `;
  });

  cartTotal.textContent = total.toFixed(2);
  cartCount.textContent = cart.length;
}

function showCheckout() {
  if (cart.length === 0) {
    alert("Agrega productos al carrito primero.");
    return;
  }
  checkoutSection.style.display = "block";
  checkoutSection.scrollIntoView({ behavior: "smooth" });
}

document.getElementById("checkoutBtn").addEventListener("click", showCheckout);

document.getElementById("paymentMethod").addEventListener("change", function () {
  const data = paymentData[this.value];
  if (!data) {
    paymentDetails.innerHTML = "";
    return;
  }

  paymentDetails.innerHTML = `
    <div class="payment-box">
      <h3>${data.title}</h3>
      <p><strong>Método:</strong> ${data.bank}</p>
      <p><strong>Titular:</strong> ${data.holder}</p>
      <p><strong>Cuenta:</strong> ${data.account}</p>
      <p><strong>Nota:</strong> ${data.note}</p>
    </div>
  `;
});

document.getElementById("checkoutForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  if (cart.length === 0) {
    alert("Tu carrito está vacío.");
    return;
  }

  const orderTotal = cart.reduce((sum, item) => sum + Number(item.price), 0);

  const orderData = {
    customer_name: document.getElementById("customerName").value,
    customer_email: document.getElementById("customerEmail").value,
    customer_phone: document.getElementById("customerPhone").value,
    customer_address: document.getElementById("customerAddress").value,
    payment_method: document.getElementById("paymentMethod").value,
    total: orderTotal,
    status: "pending"
  };

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert(orderData)
    .select()
    .single();

  if (orderError) {
    alert("Error al guardar el pedido.");
    console.error(orderError);
    return;
  }

  const items = cart.map(item => ({
    order_id: order.id,
    product_id: item.id,
    product_name: item.name,
    price: item.price,
    quantity: 1
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(items);

  if (itemsError) {
    alert("Error al guardar los productos del pedido.");
    console.error(itemsError);
    return;
  }

  alert("Pedido guardado correctamente.");
  cart = [];
  updateCart();
  this.reset();
  paymentDetails.innerHTML = "";
});

searchInput.addEventListener("input", renderProducts);

loadProducts();
updateCart();

window.addToCart = addToCart;
window.removeFromCart = removeFromCart;