// ========== PÁGINA DE MENÚ ==========

document.addEventListener('DOMContentLoaded', function() {
    cargarMenu();
    inicializarCarritoModal();
});

// Cargar todo el menú
function cargarMenu() {
    cargarDesayunos();
    cargarAlmuerzos();
    cargarBebidas();
}

// Cargar desayunos
function cargarDesayunos() {
    const desayunosGrid = document.getElementById('desayunosGrid');
    if (!desayunosGrid) return;
    
    const desayunos = JSON.parse(localStorage.getItem('pensionGenesis_desayunos')) || [];
    
    if (desayunos.length === 0) {
        desayunosGrid.innerHTML = '<p style="text-align: center; grid-column: 1/-1;">No hay platos únicos disponibles hoy</p>';
        return;
    }
    
    desayunosGrid.innerHTML = desayunos.map(plato => crearTarjetaPlato(plato)).join('');
}

// Cargar almuerzos
function cargarAlmuerzos() {
    const almuerzosGrid = document.getElementById('almuerzosGrid');
    if (!almuerzosGrid) return;
    
    const almuerzos = JSON.parse(localStorage.getItem('pensionGenesis_almuerzos')) || [];
    
    if (almuerzos.length === 0) {
        almuerzosGrid.innerHTML = '<p style="text-align: center; grid-column: 1/-1;">No hay almuerzos disponibles hoy</p>';
        return;
    }
    
    almuerzosGrid.innerHTML = almuerzos.map(plato => crearTarjetaPlato(plato)).join('');
}

// Cargar bebidas
function cargarBebidas() {
    const bebidasGrid = document.getElementById('bebidasGrid');
    if (!bebidasGrid) return;
    
    const bebidas = JSON.parse(localStorage.getItem('pensionGenesis_bebidas')) || [];
    
    if (bebidas.length === 0) {
        bebidasGrid.innerHTML = '<p style="text-align: center; grid-column: 1/-1;">No hay bebidas disponibles</p>';
        return;
    }
    
    bebidasGrid.innerHTML = bebidas.map(bebida => crearTarjetaBebida(bebida)).join('');
}

// Crear tarjeta de plato
function crearTarjetaPlato(plato) {
    const disponible = plato.stock > 0;
    const ingredientesList = Array.isArray(plato.ingredientes) 
        ? plato.ingredientes 
        : plato.ingredientes.split(',').map(i => i.trim());
    
    const imagenUrl = plato.imagen || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400';
    
    return `
        <div class="menu-item" data-id="${plato.id}">
            <span class="stock-badge ${disponible ? 'disponible' : 'agotado'}">
                ${disponible ? `Disponible (${plato.stock})` : 'Agotado'}
            </span>
            <div class="menu-item-image">
                <img src="${imagenUrl}" alt="${plato.nombre}" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'">
            </div>
            <div class="menu-item-content">
                <div class="menu-item-header">
                    <h4>${plato.nombre}</h4>
                    <span class="price">${formatearPrecio(plato.precio)}</span>
                </div>
                <div class="ingredients">
                    <h5>Ingredientes:</h5>
                    <ul>
                        ${ingredientesList.map(ing => `<li>${ing}</li>`).join('')}
                    </ul>
                </div>
                <button 
                    class="btn-add" 
                    onclick="agregarPlatoAlCarrito(${plato.id}, '${plato.tipo}')"
                    ${!disponible ? 'disabled' : ''}
                >
                    ${disponible ? '🛒 Agregar al Carrito' : '❌ No Disponible'}
                </button>
            </div>
        </div>
    `;
}

// Crear tarjeta de bebida
function crearTarjetaBebida(bebida) {
    const disponible = bebida.stock > 0;
    const imagenUrl = bebida.imagen || 'https://images.unsplash.com/photo-1581006852262-e4307cf6283a?w=400';
    
    return `
        <div class="bebida-item" data-id="${bebida.id}">
            <span class="stock-badge ${disponible ? 'disponible' : 'agotado'}">
                ${disponible ? `${bebida.stock} und.` : 'Agotado'}
            </span>
            <div class="bebida-image">
                <img src="${imagenUrl}" alt="${bebida.nombre}" onerror="this.src='https://images.unsplash.com/photo-1581006852262-e4307cf6283a?w=400'">
            </div>
            <h4>${bebida.nombre}</h4>
            <p class="price">${formatearPrecio(bebida.precio)}</p>
            <button 
                class="btn-add" 
                onclick="agregarPlatoAlCarrito('${bebida.id}', '${bebida.tipo}')"
                ${!disponible ? 'disabled' : ''}
                style="margin-top: 1rem;"
            >
                ${disponible ? '➕' : '❌'}
            </button>
        </div>
    `;
}

// Agregar plato al carrito
function agregarPlatoAlCarrito(itemId, tipo) {
    let item;
    
    if (tipo === 'desayuno') {
        const desayunos = JSON.parse(localStorage.getItem('pensionGenesis_desayunos'));
        item = desayunos.find(d => d.id === itemId);
    } else if (tipo === 'almuerzo') {
        const almuerzos = JSON.parse(localStorage.getItem('pensionGenesis_almuerzos'));
        item = almuerzos.find(a => a.id === itemId);
    } else if (tipo === 'bebida') {
        const bebidas = JSON.parse(localStorage.getItem('pensionGenesis_bebidas'));
        item = bebidas.find(b => b.id === itemId);
    }
    
    if (!item || item.stock <= 0) {
        mostrarToast('Producto no disponible', 'error');
        return;
    }
    
    agregarAlCarrito(item);
    
    // Recargar el menú para actualizar el stock
    setTimeout(() => {
        cargarMenu();
    }, 100);
}

// ========== MODAL DEL CARRITO ==========

function inicializarCarritoModal() {
    const cartFloat = document.getElementById('cartFloat');
    const cartModal = document.getElementById('cartModal');
    const closeCart = document.getElementById('closeCart');
    
    if (cartFloat) {
        cartFloat.addEventListener('click', function() {
            mostrarCarrito();
            cartModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    }
    
    if (closeCart) {
        closeCart.addEventListener('click', function() {
            cartModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }
    
    if (cartModal) {
        cartModal.addEventListener('click', function(e) {
            if (e.target === cartModal) {
                cartModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }
}

// Mostrar carrito
function mostrarCarrito() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (!cartItems || !cartTotal) return;
    
    const carrito = obtenerCarrito();
    
    if (carrito.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: #7f8c8d;">El carrito está vacío</p>';
        cartTotal.innerHTML = 'Total: Bs 0.00';
        return;
    }
    
    cartItems.innerHTML = carrito.map(item => `
        <div class="cart-item">
            <div>
                <strong>${item.nombre}</strong>
                <p style="color: #7f8c8d; font-size: 0.9rem;">
                    ${formatearPrecio(item.precio)} x ${item.cantidad}
                </p>
            </div>
            <div style="display: flex; align-items: center; gap: 1rem;">
                <div style="display: flex; gap: 0.5rem; align-items: center;">
                    <button 
                        onclick="cambiarCantidadItem(${JSON.stringify(item.id).replace(/"/g, '&quot;')}, ${item.cantidad - 1})"
                        style="width: 30px; height: 30px; border: none; background: var(--primary-color); color: white; border-radius: 5px; cursor: pointer; font-size: 1.2rem;"
                    >-</button>
                    <span style="min-width: 30px; text-align: center;">${item.cantidad}</span>
                    <button 
                        onclick="cambiarCantidadItem(${JSON.stringify(item.id).replace(/"/g, '&quot;')}, ${item.cantidad + 1})"
                        style="width: 30px; height: 30px; border: none; background: var(--primary-color); color: white; border-radius: 5px; cursor: pointer; font-size: 1.2rem;"
                    >+</button>
                </div>
                <strong style="color: var(--primary-color); min-width: 80px; text-align: right;">
                    ${formatearPrecio(item.precio * item.cantidad)}
                </strong>
                <button 
                    onclick="eliminarItemCarrito(${JSON.stringify(item.id).replace(/"/g, '&quot;')})"
                    style="background: var(--danger); color: white; border: none; padding: 0.5rem; border-radius: 5px; cursor: pointer;"
                >🗑️</button>
            </div>
        </div>
    `).join('');
    
    const total = calcularTotalCarrito();
    cartTotal.innerHTML = `Total: ${formatearPrecio(total)}`;
}

// Cambiar cantidad de item
function cambiarCantidadItem(itemId, nuevaCantidad) {
    if (nuevaCantidad <= 0) {
        eliminarItemCarrito(itemId);
    } else {
        actualizarCantidadCarrito(itemId, nuevaCantidad);
        mostrarCarrito();
    }
}

// Eliminar item del carrito
function eliminarItemCarrito(itemId) {
    eliminarDelCarrito(itemId);
    mostrarCarrito();
    mostrarToast('Producto eliminado del carrito', 'success');
}