let adminProducts = [];

const loginForm = document.getElementById("loginForm");
const dashboard = document.getElementById("dashboard");
const loginPanel = document.getElementById("loginPanel");
const adminProductList = document.getElementById("adminProductList");

async function loadAdminProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  adminProducts = data;
  renderAdminProducts();
}

function renderAdminProducts() {
  adminProductList.innerHTML = "";

  adminProducts.forEach(product => {
    adminProductList.innerHTML += `
      <div class="card">
        <img src="${product.image_url}" alt="${product.name}">
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

async function editProduct(id) {
  const product = adminProducts.find(p => p.id === id);
  if (!product) return;

  const newName = prompt("Nombre:", product.name);
  const newPrice = prompt("Precio:", product.price);
  const newStock = prompt("Stock:", product.stock);
  const newCategory = prompt("Categoría:", product.category);
  const newImage = prompt("URL imagen:", product.image_url);
  const newDescription = prompt("Descripción:", product.description);

  if (!newName || !newPrice || !newStock || !newCategory || !newImage || !newDescription) return;

  const { error } = await supabase
    .from("products")
    .update({
      name: newName,
      price: Number(newPrice),
      stock: Number(newStock),
      category: newCategory,
      image_url: newImage,
      description: newDescription
    })
    .eq("id", id);

  if (error) {
    alert("Error al actualizar producto.");
    console.error(error);
    return;
  }

  loadAdminProducts();
}

async function deleteProduct(id) {
  if (!confirm("¿Eliminar este producto?")) return;

  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id);

  if (error) {
    alert("Error al eliminar producto.");
    console.error(error);
    return;
  }

  loadAdminProducts();
}

loginForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = document.getElementById("adminEmail").value;
  const password = document.getElementById("adminPassword").value;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    alert("Error de acceso.");
    console.error(error);
    return;
  }

  const userId = data.user.id;

  const { data: adminData, error: adminError } = await supabase
    .from("admins")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (adminError || !adminData) {
    alert("Este usuario no tiene permisos de administrador.");
    await supabase.auth.signOut();
    return;
  }

  loginPanel.style.display = "none";
  dashboard.style.display = "block";
  loadAdminProducts();
});

document.getElementById("createProductForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const { error } = await supabase
    .from("products")
    .insert({
      name: document.getElementById("pName").value,
      price: Number(document.getElementById("pPrice").value),
      stock: Number(document.getElementById("pStock").value),
      category: document.getElementById("pCategory").value,
      image_url: document.getElementById("pImage").value,
      description: document.getElementById("pDescription").value,
      active: true
    });

  if (error) {
    alert("Error al crear producto.");
    console.error(error);
    return;
  }

  this.reset();
  loadAdminProducts();
});

window.editProduct = editProduct;
window.deleteProduct = deleteProduct;