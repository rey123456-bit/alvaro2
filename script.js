// ========== FUNCIONES GLOBALES Y NAVEGACIÓN ==========

// Menú hamburguesa para móviles
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            
            // Animación del hamburguesa
            const spans = hamburger.querySelectorAll('span');
            spans.forEach((span, index) => {
                if (navMenu.classList.contains('active')) {
                    if (index === 0) span.style.transform = 'rotate(45deg) translateY(10px)';
                    if (index === 1) span.style.opacity = '0';
                    if (index === 2) span.style.transform = 'rotate(-45deg) translateY(-10px)';
                } else {
                    span.style.transform = 'none';
                    span.style.opacity = '1';
                }
            });
        });

        // Cerrar menú al hacer clic en un enlace
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                const spans = hamburger.querySelectorAll('span');
                spans.forEach(span => {
                    span.style.transform = 'none';
                    span.style.opacity = '1';
                });
            });
        });
    }

    // Inicializar datos si no existen
    inicializarDatos();
    
    // Cargar carrito count si estamos en cualquier página
    actualizarCartBadge();
});

// ========== GESTIÓN DE DATOS ==========

// Inicializar datos de ejemplo si no existen
function inicializarDatos() {
    if (!localStorage.getItem('pensionGenesis_desayunos')) {
        const desayunosEjemplo = [
            {
                id: 1,
                nombre: 'Tostadas con Jamón',
                precio: 18.50,
                ingredientes: ['Pan de pueblo', 'Jamón serrano', 'Tomate natural', 'Aceite de oliva'],
                stock: 20,
                imagen: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400',
                tipo: 'desayuno'
            },
            {
                id: 2,
                nombre: 'Huevos Revueltos',
                precio: 15.50,
                ingredientes: ['Huevos frescos', 'Jamón york', 'Pan tostado', 'Mantequilla'],
                stock: 15,
                imagen: 'https://images.unsplash.com/photo-1525351326368-efbb5cb6814d?w=400',
                tipo: 'desayuno'
            }
        ];
        localStorage.setItem('pensionGenesis_desayunos', JSON.stringify(desayunosEjemplo));
    }

    if (!localStorage.getItem('pensionGenesis_almuerzos')) {
        const almuerzosEjemplo = [
            {
                id: 3,
                nombre: 'Sopa de Maní',
                precio: 20.00,
                ingredientes: ['Maní', 'Papa', 'Carne', 'Verduras', 'Especias'],
                stock: 25,
                imagen: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400',
                tipo: 'almuerzo'
            },
            {
                id: 4,
                nombre: 'Pollo al Horno',
                precio: 28.00,
                ingredientes: ['Pollo', 'Papas', 'Ensalada', 'Arroz', 'Ají'],
                stock: 25,
                imagen: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400',
                tipo: 'almuerzo'
            }
        ];
        localStorage.setItem('pensionGenesis_almuerzos', JSON.stringify(almuerzosEjemplo));
    }

    if (!localStorage.getItem('pensionGenesis_bebidas')) {
        const bebidasEjemplo = [
            {
                id: 'refresco',
                nombre: 'Refresco',
                precio: 7.00,
                stock: 50,
                imagen: 'https://images.unsplash.com/photo-1581006852262-e4307cf6283a?w=400',
                tipo: 'bebida'
            },
            {
                id: 'agua',
                nombre: 'Agua',
                precio: 5.00,
                stock: 60,
                imagen: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400',
                tipo: 'bebida'
            },
            {
                id: 'jugo',
                nombre: 'Jugo Natural',
                precio: 8.50,
                stock: 30,
                imagen: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400',
                tipo: 'bebida'
            }
        ];
        localStorage.setItem('pensionGenesis_bebidas', JSON.stringify(bebidasEjemplo));
    }

    if (!localStorage.getItem('pensionGenesis_carrito')) {
        localStorage.setItem('pensionGenesis_carrito', JSON.stringify([]));
    }

    if (!localStorage.getItem('pensionGenesis_reservas')) {
        localStorage.setItem('pensionGenesis_reservas', JSON.stringify([]));
    }

    if (!localStorage.getItem('pensionGenesis_config')) {
        const configEjemplo = {
            adminEmail: 'admin@pensiongenesis.com',
            adminWhatsApp: '+59171234567'
        };
        localStorage.setItem('pensionGenesis_config', JSON.stringify(configEjemplo));
    }
}

// ========== GESTIÓN DEL CARRITO ==========

// Obtener carrito
function obtenerCarrito() {
    const carrito = localStorage.getItem('pensionGenesis_carrito');
    return carrito ? JSON.parse(carrito) : [];
}

// Guardar carrito
function guardarCarrito(carrito) {
    localStorage.setItem('pensionGenesis_carrito', JSON.stringify(carrito));
    actualizarCartBadge();
}

// Agregar al carrito
function agregarAlCarrito(item) {
    let carrito = obtenerCarrito();
    
    // Verificar si el item ya existe
    const itemExistente = carrito.find(i => i.id === item.id);
    
    if (itemExistente) {
        itemExistente.cantidad++;
    } else {
        carrito.push({
            ...item,
            cantidad: 1
        });
    }
    
    guardarCarrito(carrito);
    mostrarToast('¡Producto agregado al carrito!', 'success');
    
    // Actualizar stock en el menú
    actualizarStockEnMenu(item.id, item.tipo);
}

// Eliminar del carrito
function eliminarDelCarrito(itemId) {
    let carrito = obtenerCarrito();
    carrito = carrito.filter(item => item.id !== itemId);
    guardarCarrito(carrito);
}

// Actualizar cantidad en carrito
function actualizarCantidadCarrito(itemId, nuevaCantidad) {
    let carrito = obtenerCarrito();
    const item = carrito.find(i => i.id === itemId);
    
    if (item) {
        if (nuevaCantidad <= 0) {
            eliminarDelCarrito(itemId);
        } else {
            item.cantidad = nuevaCantidad;
            guardarCarrito(carrito);
        }
    }
}

// Vaciar carrito
function vaciarCarrito() {
    localStorage.setItem('pensionGenesis_carrito', JSON.stringify([]));
    actualizarCartBadge();
}

// Calcular total del carrito
function calcularTotalCarrito() {
    const carrito = obtenerCarrito();
    return carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
}

// Actualizar badge del carrito
function actualizarCartBadge() {
    const badge = document.getElementById('cartBadge');
    if (badge) {
        const carrito = obtenerCarrito();
        const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
        badge.textContent = totalItems;
        badge.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

// ========== NOTIFICACIONES TOAST ==========

function mostrarToast(mensaje, tipo = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    
    if (toast && toastMessage) {
        toastMessage.textContent = mensaje;
        toast.className = `toast ${tipo}`;
        toast.style.display = 'block';
        
        setTimeout(() => {
            toast.style.display = 'none';
        }, 3000);
    }
}

// ========== GESTIÓN DE STOCK ==========

function actualizarStockEnMenu(itemId, tipo) {
    let items;
    let key;
    
    if (tipo === 'desayuno') {
        key = 'pensionGenesis_desayunos';
    } else if (tipo === 'almuerzo') {
        key = 'pensionGenesis_almuerzos';
    } else if (tipo === 'bebida') {
        key = 'pensionGenesis_bebidas';
    }
    
    items = JSON.parse(localStorage.getItem(key));
    const item = items.find(i => i.id === itemId);
    
    if (item && item.stock > 0) {
        item.stock--;
        localStorage.setItem(key, JSON.stringify(items));
    }
}

// ========== ENVÍO DE NOTIFICACIONES ==========

function enviarNotificacionReserva(reserva) {
    const config = JSON.parse(localStorage.getItem('pensionGenesis_config'));
    
    // Construir mensaje
    const mensaje = `
🔔 NUEVA RESERVA - Pensión Genesis

👤 Cliente: ${reserva.nombre}
📞 Teléfono: ${reserva.telefono}
📧 Email: ${reserva.email}
📅 Fecha: ${reserva.fecha}
⏰ Hora: ${reserva.hora}
💳 Pago: ${reserva.metodoPago}

🛒 Pedido:
${reserva.items.map(item => `- ${item.nombre} x${item.cantidad} (Bs ${(item.precio * item.cantidad).toFixed(2)})`).join('\n')}

💰 TOTAL: Bs ${reserva.total.toFixed(2)}

${reserva.notas ? `📝 Notas: ${reserva.notas}` : ''}
    `.trim();
    
    // Notificación por Email (simulado - en producción se usaría un servicio backend)
    console.log('📧 Email enviado a:', config.adminEmail);
    console.log(mensaje);
    
    // Link directo a WhatsApp
    const whatsappMessage = encodeURIComponent(mensaje);
    const whatsappNumber = config.adminWhatsApp.replace(/\D/g, '');
    
    // En un entorno real, esto abriría WhatsApp automáticamente
    // window.open(`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`, '_blank');
    
    console.log('💬 WhatsApp preparado para:', config.adminWhatsApp);
    console.log(`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`);
    
    mostrarToast('Notificación enviada al administrador', 'success');
}

// ========== UTILIDADES ==========

// Formatear precio en bolivianos
function formatearPrecio(precio) {
    return `Bs ${precio.toFixed(2)}`;
}

// Obtener fecha actual
function obtenerFechaActual() {
    const hoy = new Date();
    return hoy.toISOString().split('T')[0];
}

// Validar email
function validarEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Validar teléfono
function validarTelefono(telefono) {
    const re = /^[+]?[\d\s()-]+$/;
    return re.test(telefono) && telefono.replace(/\D/g, '').length >= 8;
}

// Ir a página de reservas
function goToReservas() {
    window.location.href = 'reservas.html';
}