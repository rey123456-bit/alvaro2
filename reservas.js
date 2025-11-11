// ========== PÁGINA DE RESERVAS ==========

document.addEventListener('DOMContentLoaded', function() {
    cargarResumenCarrito();
    configurarFechaMinima();
    configurarMetodosPago();
    configurarFormulario();
});

// Cargar resumen del carrito en la página de reservas
function cargarResumenCarrito() {
    const reservaCartItems = document.getElementById('reservaCartItems');
    const reservaTotal = document.getElementById('reservaTotal');
    
    if (!reservaCartItems || !reservaTotal) return;
    
    const carrito = obtenerCarrito();
    
    if (carrito.length === 0) {
        reservaCartItems.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <p style="color: #7f8c8d; margin-bottom: 1rem;">No hay productos en el carrito</p>
                <a href="menu.html" class="btn-primary">Ver Menú</a>
            </div>
        `;
        reservaTotal.innerHTML = 'Total: Bs 0.00';
        
        // Deshabilitar el formulario
        const form = document.getElementById('reservaForm');
        if (form) {
            const inputs = form.querySelectorAll('input, select, textarea, button');
            inputs.forEach(input => input.disabled = true);
        }
        return;
    }
    
    reservaCartItems.innerHTML = carrito.map(item => `
        <div class="cart-item">
            <div>
                <strong>${item.nombre}</strong>
                <p style="color: #7f8c8d; font-size: 0.9rem;">
                    ${formatearPrecio(item.precio)} x ${item.cantidad}
                </p>
            </div>
            <strong style="color: var(--primary-color);">
                ${formatearPrecio(item.precio * item.cantidad)}
            </strong>
        </div>
    `).join('');
    
    const total = calcularTotalCarrito();
    reservaTotal.innerHTML = `Total: ${formatearPrecio(total)}`;
}

// Configurar fecha mínima (hoy)
function configurarFechaMinima() {
    const fechaInput = document.getElementById('fecha');
    if (fechaInput) {
        const hoy = new Date();
        const fechaMin = hoy.toISOString().split('T')[0];
        fechaInput.min = fechaMin;
        fechaInput.value = fechaMin;
    }
}

// Configurar selección de métodos de pago
function configurarMetodosPago() {
    const paymentOptions = document.querySelectorAll('.payment-option');
    const metodoPagoInput = document.getElementById('metodoPago');
    
    paymentOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remover selección anterior
            paymentOptions.forEach(opt => opt.classList.remove('selected'));
            
            // Agregar selección actual
            this.classList.add('selected');
            
            // Actualizar valor del input oculto
            const metodo = this.getAttribute('data-payment');
            if (metodoPagoInput) {
                metodoPagoInput.value = metodo;
            }
        });
    });
}

// Configurar envío del formulario
function configurarFormulario() {
    const form = document.getElementById('reservaForm');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            procesarReserva();
        });
    }
}

// Procesar la reserva
function procesarReserva() {
    // Validar que hay items en el carrito
    const carrito = obtenerCarrito();
    if (carrito.length === 0) {
        mostrarToast('El carrito está vacío', 'error');
        return;
    }
    
    // Obtener datos del formulario
    const nombre = document.getElementById('nombre').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const email = document.getElementById('email').value.trim();
    const fecha = document.getElementById('fecha').value;
    const hora = document.getElementById('hora').value;
    const metodoPago = document.getElementById('metodoPago').value;
    const notas = document.getElementById('notas').value.trim();
    
    // Validaciones
    if (!nombre) {
        mostrarToast('Por favor ingresa tu nombre', 'error');
        return;
    }
    
    if (!telefono || !validarTelefono(telefono)) {
        mostrarToast('Por favor ingresa un teléfono válido', 'error');
        return;
    }
    
    if (!email || !validarEmail(email)) {
        mostrarToast('Por favor ingresa un email válido', 'error');
        return;
    }
    
    if (!fecha) {
        mostrarToast('Por favor selecciona una fecha', 'error');
        return;
    }
    
    if (!hora) {
        mostrarToast('Por favor selecciona una hora', 'error');
        return;
    }
    
    if (!metodoPago) {
        mostrarToast('Por favor selecciona un método de pago', 'error');
        return;
    }
    
    // Crear objeto de reserva
    const reserva = {
        id: Date.now(),
        nombre: nombre,
        telefono: telefono,
        email: email,
        fecha: fecha,
        hora: hora,
        metodoPago: metodoPago,
        notas: notas,
        items: carrito,
        total: calcularTotalCarrito(),
        fechaCreacion: new Date().toISOString(),
        estado: 'pendiente'
    };
    
    // Guardar reserva
    const reservas = JSON.parse(localStorage.getItem('pensionGenesis_reservas')) || [];
    reservas.push(reserva);
    localStorage.setItem('pensionGenesis_reservas', JSON.stringify(reservas));
    
    // Enviar notificación al administrador
    enviarNotificacionReserva(reserva);
    
    // Mostrar confirmación con opción de WhatsApp
    mostrarConfirmacionReserva(reserva);
    
    // Vaciar carrito
    vaciarCarrito();
    
    // Resetear formulario
    document.getElementById('reservaForm').reset();
    
    // Redirigir después de 3 segundos
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 4000);
}

// Mostrar confirmación de reserva
function mostrarConfirmacionReserva(reserva) {
    const config = JSON.parse(localStorage.getItem('pensionGenesis_config'));
    
    // Crear mensaje de confirmación
    const mensajeCliente = `
✅ ¡Reserva Confirmada!

Tu pedido ha sido registrado con éxito.

📅 Fecha: ${reserva.fecha}
⏰ Hora: ${reserva.hora}
💰 Total: ${formatearPrecio(reserva.total)}

Te esperamos en Pensión Genesis.
¡Gracias por tu preferencia!
    `.trim();
    
    mostrarToast(mensajeCliente.split('\n')[0], 'success');
    
    // Crear enlace de WhatsApp para el cliente (opcional)
    const whatsappClienteMsg = encodeURIComponent(`Hola, tengo una reserva para el ${reserva.fecha} a las ${reserva.hora}. Mi nombre es ${reserva.nombre}.`);
    const whatsappNumber = config.adminWhatsApp.replace(/\D/g, '');
    
    // Mostrar modal de confirmación con opción de WhatsApp
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    `;
    
    modal.innerHTML = `
        <div style="background: white; padding: 3rem; border-radius: 20px; max-width: 500px; text-align: center; animation: slideUp 0.3s ease;">
            <div style="font-size: 4rem; margin-bottom: 1rem;">✅</div>
            <h2 style="color: var(--primary-color); margin-bottom: 1rem;">¡Reserva Confirmada!</h2>
            <p style="margin-bottom: 1rem; color: var(--dark-color);">
                Tu pedido ha sido registrado exitosamente.
            </p>
            <div style="background: var(--light-color); padding: 1rem; border-radius: 10px; margin-bottom: 1.5rem; text-align: left;">
                <p><strong>📅 Fecha:</strong> ${reserva.fecha}</p>
                <p><strong>⏰ Hora:</strong> ${reserva.hora}</p>
                <p><strong>💰 Total:</strong> ${formatearPrecio(reserva.total)}</p>
                <p><strong>📝 Referencia:</strong> #${reserva.id}</p>
            </div>
            <a 
                href="https://wa.me/${whatsappNumber}?text=${whatsappClienteMsg}" 
                target="_blank"
                style="display: inline-block; background: #25D366; color: white; padding: 1rem 2rem; border-radius: 10px; text-decoration: none; margin-bottom: 1rem; font-weight: bold;"
            >
                💬 Contactar por WhatsApp
            </a>
            <p style="font-size: 0.9rem; color: #7f8c8d;">
                Serás redirigido al inicio en unos segundos...
            </p>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Cerrar modal al hacer clic fuera
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
    
    // Remover modal después de 4 segundos
    setTimeout(() => {
        if (document.body.contains(modal)) {
            document.body.removeChild(modal);
        }
    }, 4000);
}