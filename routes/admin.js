// Inicializar el array de productos
let productos = [];

// Referencia al formulario y la tabla
const form = document.getElementById('productoForm');
const productosTableBody = document.getElementById('productosTable');

// Función para agregar un producto a la tabla
function agregarProductoTabla(producto) {
  console.log("Agregando producto a la tabla:", producto); // Depuración
  const row = document.createElement('tr');
  row.innerHTML = `
    <td>${producto.nombre}</td>
    <td>${producto.descripcion}</td>
    <td>${producto.precio.toFixed(2)}</td>
    <td>${producto.stock}</td>
    <td><img src="${producto.imagen}" alt="${producto.nombre}" style="width: 50px; height: auto;"></td>
    <td>
      <button class="btn btn-danger" onclick="eliminarProducto('${producto.nombre}')">Eliminar</button>
    </td>
  `;
  productosTableBody.appendChild(row);
}

// Función para agregar un producto al array y a la tabla
form.addEventListener('submit', function(e) {
  e.preventDefault();

  // Capturamos los valores del formulario
  const nombreProducto = document.getElementById('nombre').value.trim();
  const descripcionProducto = document.getElementById('descripcion').value.trim();
  const precioProducto = parseFloat(document.getElementById('precio').value);
  const imagenProducto = document.getElementById('imagen').value.trim();
  const stockProducto = parseInt(document.getElementById('stock').value);

  // Verificación simple para asegurarse de que todos los campos estén llenos
  if (!nombreProducto || !descripcionProducto || isNaN(precioProducto) || !imagenProducto || isNaN(stockProducto)) {
    alert('Por favor, completa todos los campos correctamente.');
    return;
  }

  // Creamos el nuevo producto
  const nuevoProducto = {
    nombre: nombreProducto,
    descripcion: descripcionProducto,
    precio: precioProducto,
    imagen: imagenProducto,
    stock: stockProducto
  };

  console.log("Producto agregado:", nuevoProducto); // Depuración

  // Agregamos el producto al array
  productos.push(nuevoProducto);

  // Renderizamos el nuevo producto en la tabla
  agregarProductoTabla(nuevoProducto);

  // Reseteamos el formulario
  form.reset();
});

// Función para eliminar un producto
function eliminarProducto(nombre) {
  // Filtrar el array de productos para eliminar el producto seleccionado
  productos = productos.filter(producto => producto.nombre !== nombre);

  // Limpiar la tabla actual
  productosTableBody.innerHTML = '';

  // Volver a renderizar todos los productos
  productos.forEach(producto => agregarProductoTabla(producto));
}
