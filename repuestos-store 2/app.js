const paymentData = {
  Banesco: {
    title: "Transferencia Banesco",
    bank: "Banesco",
    holder: "Todo Importado",
    account: "Coloca aquí tu número de cuenta Banesco",
    note: "Enviar comprobante por WhatsApp al finalizar el pedido."
  },
  Provincial: {
    title: "Transferencia Provincial",
    bank: "Banco Provincial",
    holder: "Todo Importado",
    account: "Coloca aquí tu número de cuenta Provincial",
    note: "Enviar comprobante por WhatsApp al finalizar el pedido."
  },
  Mercantil: {
    title: "Transferencia Mercantil",
    bank: "Banco Mercantil",
    holder: "Todo Importado",
    account: "Coloca aquí tu número de cuenta Mercantil",
    note: "Enviar comprobante por WhatsApp al finalizar el pedido."
  },
  BanescoPanama: {
    title: "Transferencia Banesco Panamá",
    bank: "Banesco Panamá",
    holder: "Todo Importado",
    account: "Coloca aquí tu cuenta de Banesco Panamá",
    note: "Ideal para pagos internacionales."
  },
  PagoMovil: {
    title: "Pago móvil",
    bank: "Pago móvil",
    holder: "Todo Importado",
    account: "Coloca aquí tu número de pago móvil",
    note: "Incluye cédula, teléfono y referencia."
  },
  Zelle: {
    title: "Zelle",
    bank: "Zelle",
    holder: "Todo Importado",
    account: "Coloca aquí tu correo Zelle",
    note: "Confirma el monto exacto antes de pagar."
  },
  Binance: {
    title: "Binance",
    bank: "Binance",
    holder: "Todo Importado",
    account: "Coloca aquí tu cuenta Binance / USDT",
    note: "Indica red y monto exacto."
  }
};

let products = [
  {
    id: 1,
    name: "Filtro de aceite",
    price: 25,
    stock: 12,
    category: "Motor",
    image: "https://via.placeholder.com/600x400?text=Filtro+de+aceite",
    description: "Filtro para mantenimiento preventivo."
  },
  {
    id: 2,
    name: "Pastillas de freno",
    price: 45,
    stock: 0,
    category: "Frenos",
    image: "https://via.placeholder.com/600x400?text=Pastillas+de+freno",
    description: "Juego delantero de alta durabilidad."
  },
  {
    id: 3,
    name: "Bujías",
    price: 18,
    stock: 7,
    category: "Encendido",
    image: "https://via.placeholder.com/600x400?text=Bujias",
    description: "Bujías para distintos modelos de vehículo."
  }
];

let cart = [];

const productList = document.getElementById("productList");
const cartList = document.getElementById("cartList");
const cartTotal = document.getElementById("cartTotal");
const cartCount = document.getElementById("cartCount");
const productCount = document.getElementById("productCount");
const searchInput = document.getElementById("searchInput");
const checkoutSection = document.getElementById("checkoutSection");
const paymentDetails = document.getElementById("paymentDetails");
const whatsappBtn = document.getElementById("whatsappBtn");

function renderProducts() {
  const query = searchInput.value.toLowerCase();

  const filtered = products.filter(product =>
    product.name.toLowerCase().includes(query) ||
    product.category.toLowerCase().includes(query) ||
    product.description.toLowerCase().includes(query)
  );

  productCount.textContent = filtered.length;
  productList.innerHTML = "";

  filtered.forEach(product => {
    const inStock = product.stock > 0;

    productList.innerHTML += `
      <div class="card">
        <img src="${product.image}" alt="${product.name}">
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

function renderPaymentDetails(method) {
  const data = paymentData[method];
  if (!data) {
    paymentDetails.innerHTML = "";
    return;
  }

  paymentDetails.innerHTML = `
    <div class="payment-box">
      <h3>${data.title}</h3>
      <p><strong>Banco / método:</strong> ${data.bank}</p>
      <p><strong>Titular:</strong> ${data.holder}</p>
      <p><strong>Cuenta / dato:</strong> ${data.account}</p>
      <p><strong>Nota:</strong> ${data.note}</p>
    </div>
  `;
}

document.getElementById("checkoutBtn").addEventListener("click", showCheckout);

document.getElementById("paymentMethod").addEventListener("change", function () {
  renderPaymentDetails(this.value);
});

document.getElementById("checkoutForm").addEventListener("submit", function (e) {
  e.preventDefault();

  if (cart.length === 0) {
    alert("Tu carrito está vacío.");
    return;
  }

  const name = document.getElementById("customerName").value;
  const email = document.getElementById("customerEmail").value;
  const phone = document.getElementById("customerPhone").value;
  const address = document.getElementById("customerAddress").value;
  const paymentMethod = document.getElementById("paymentMethod").value;

  if (!paymentMethod) {
    alert("Selecciona un método de pago.");
    return;
  }

  const orderTotal = cart.reduce((sum, item) => sum + Number(item.price), 0);

  const orderText = `
Pedido nuevo - Todo Importado
Nombre: ${name}
Email: ${email}
Teléfono: ${phone}
Dirección: ${address}
Método de pago: ${paymentMethod}
Total: $${orderTotal.toFixed(2)}
Productos:
${cart.map(item => `- ${item.name} ($${Number(item.price).toFixed(2)})`).join("\n")}
  `.trim();

  const whatsappNumber = "584141234567";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(orderText)}`;

  whatsappBtn.href = whatsappUrl;
  window.open(whatsappUrl, "_blank");

  alert("Pedido generado. Ahora puedes enviar el comprobante por WhatsApp.");
});

document.getElementById("searchInput").addEventListener("input", renderProducts);

renderProducts();
updateCart();