let adminProducts = [
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
    stock: 3,
    category: "Frenos",
    image: "https://via.placeholder.com/600x400?text=Pastillas+de+freno",
    description: "Juego delantero de alta durabilidad."
  }
];

const loginForm = document.getElementById("loginForm");
const dashboard = document.getElementById("dashboard");
const loginPanel = document.getElementById("loginPanel");
const adminProductList = document.getElementById("adminProductList");

function renderAdminProducts() {
  adminProductList.innerHTML = "";

  adminProducts.forEach(product => {
    const lowStock = product.stock <= 3;

    adminProductList.innerHTML += `
      <div class="card">
        <img src="${product.image}" alt="${product.name}">
        <div class="card-body">
          <h3 class="product-title">${product.name}</h3>
          <div class="meta">${product.category}</div>
          <div class="price">$${Number(product.price).toFixed(2)}</div>
          <div class="stock ${product.stock > 0 ? "available" : "unavailable"}">
            ${product.stock > 0 ? `Disponible (${product.stock})` : "Sin stock"}
          </div>
          <p class="meta">${product.description}</p>
          <div style="display:flex; gap:8px; flex-wrap:wrap;">
            <button class="btn btn-primary" onclick="editProduct(${product.id})">Editar</button>
            <button class="btn btn-secondary" onclick="deleteProduct(${product.id})">Eliminar</button>
          </div>
        </div>
      </div>
    `;
  });

  document.getElementById("metricProducts").textContent = adminProducts.filter(p => p.stock > 0).length;
  document.getElementById("metricLowStock").textContent = adminProducts.filter(p => p.stock > 0 && p.stock <= 3).length;
  document.getElementById("metricSales").textContent = "$0.00";
  document.getElementById("metricOrders").textContent = "0";
}

function editProduct(id) {
  const product = adminProducts.find(p => p.id === id);
  if (!product) return;

  const newName = prompt("Nombre:", product.name);
  const newPrice = prompt("Precio:", product.price);
  const newStock = prompt("Stock:", product.stock);
  const newCategory = prompt("Categoría:", product.category);
  const newImage = prompt("URL imagen:", product.image);
  const newDescription = prompt("Descripción:", product.description);

  if (newName) product.name = newName;
  if (newPrice) product.price = Number(newPrice);
  if (newStock) product.stock = Number(newStock);
  if (newCategory) product.category = newCategory;
  if (newImage) product.image = newImage;
  if (newDescription) product.description = newDescription;

  renderAdminProducts();
}

function deleteProduct(id) {
  if (!confirm("¿Eliminar este producto?")) return;
  adminProducts = adminProducts.filter(p => p.id !== id);
  renderAdminProducts();
}

loginForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("adminEmail").value;
  const password = document.getElementById("adminPassword").value;

  if (email && password) {
    loginPanel.style.display = "none";
    dashboard.style.display = "grid";
    renderAdminProducts();
  } else {
    alert("Credenciales inválidas.");
  }
});

document.getElementById("createProductForm").addEventListener("submit", function (e) {
  e.preventDefault();

  adminProducts.unshift({
    id: Date.now(),
    name: document.getElementById("pName").value,
    price: Number(document.getElementById("pPrice").value),
    stock: Number(document.getElementById("pStock").value),
    category: document.getElementById("pCategory").value,
    image: document.getElementById("pImage").value,
    description: document.getElementById("pDescription").value
  });

  this.reset();
  renderAdminProducts();
  alert("Producto creado.");
});