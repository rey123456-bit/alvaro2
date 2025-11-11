// ========== PANEL DE ADMINISTRACIÓN ==========

document.addEventListener('DOMContentLoaded', function() {
    cargarConfiguracion();
    cargarDatosActuales();
    cargarReservasRecibidas();
    
    // Actualizar reservas cada 30 segundos
    setInterval(cargarReservasRecibidas, 30000);
});

// ========== PREVISUALIZACIÓN DE IMÁGENES ==========

function previewImage(input, previewId) {
    const preview = document.getElementById(previewId);
    
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            preview.innerHTML = `<img src="${e.target.result}" alt="Vista previa">`;
        };
        
        reader.readAsDataURL(input.files[0]);
    }
}

// ========== CONFIGURACIÓN ==========

function cargarConfiguracion() {
    const config = JSON.parse(localStorage.getItem('pensionGenesis_config')) || {};
    
    const emailInput = document.getElementById('adminEmail');
    const whatsappInput = document.getElementById('adminWhatsApp');
    
    if (emailInput && config.adminEmail) {
        emailInput.value = config.adminEmail;
    }
    
    if (whatsappInput && config.adminWhatsApp) {
        whatsappInput.value = config.adminWhatsApp;
    }
}

function guardarConfiguracion() {
    const email = document.getElementById('adminEmail').value.trim();
    const whatsapp = document.getElementById('adminWhatsApp').value.trim();
    
    if (!email || !validarEmail(email)) {
        mostrarToast('Por favor ingresa un email válido', 'error');
        return;
    }
    
    if (!whatsapp || !validarTelefono(whatsapp)) {
        mostrarToast('Por favor ingresa un teléfono válido', 'error');
        return;
    }
    
    const config = {
        adminEmail: email,
        adminWhatsApp: whatsapp
    };
    
    localStorage.setItem('pensionGenesis_config', JSON.stringify(config));
    mostrarToast('Configuración guardada exitosamente', 'success');
}

// ========== CARGAR DATOS ACTUALES ==========

function cargarDatosActuales() {
    // Cargar platos únicos
    const desayunos = JSON.parse(localStorage.getItem('pensionGenesis_desayunos')) || [];
    if (desayunos[0]) {
        document.getElementById('des1_nombre').value = desayunos[0].nombre || '';
        document.getElementById('des1_precio').value = desayunos[0].precio || '';
        document.getElementById('des1_ingredientes').value = Array.isArray(desayunos[0].ingredientes) 
            ? desayunos[0].ingredientes.join(', ') 
            : desayunos[0].ingredientes || '';
        document.getElementById('des1_stock').value = desayunos[0].stock || 0;
        document.getElementById('des1_imagen_url').value = desayunos[0].imagen || '';
        
        // Mostrar preview de imagen
        if (desayunos[0].imagen) {
            document.getElementById('preview_des1').innerHTML = `<img src="${desayunos[0].imagen}" alt="Preview">`;
        }
    }
    
    if (desayunos[1]) {
        document.getElementById('des2_nombre').value = desayunos[1].nombre || '';
        document.getElementById('des2_precio').value = desayunos[1].precio || '';
        document.getElementById('des2_ingredientes').value = Array.isArray(desayunos[1].ingredientes) 
            ? desayunos[1].ingredientes.join(', ') 
            : desayunos[1].ingredientes || '';
        document.getElementById('des2_stock').value = desayunos[1].stock || 0;
        document.getElementById('des2_imagen_url').value = desayunos[1].imagen || '';
        
        if (desayunos[1].imagen) {
            document.getElementById('preview_des2').innerHTML = `<img src="${desayunos[1].imagen}" alt="Preview">`;
        }
    }
    
    // Cargar almuerzos (sopa y segundo)
    const almuerzos = JSON.parse(localStorage.getItem('pensionGenesis_almuerzos')) || [];
    if (almuerzos[0]) {
        document.getElementById('alm_nombre').value = almuerzos[0].nombre || '';
        document.getElementById('alm_precio').value = almuerzos[0].precio || '';
        document.getElementById('alm_ingredientes').value = Array.isArray(almuerzos[0].ingredientes) 
            ? almuerzos[0].ingredientes.join(', ') 
            : almuerzos[0].ingredientes || '';
        document.getElementById('alm_stock').value = almuerzos[0].stock || 0;
        document.getElementById('alm_imagen_url').value = almuerzos[0].imagen || '';
        
        if (almuerzos[0].imagen) {
            document.getElementById('preview_alm').innerHTML = `<img src="${almuerzos[0].imagen}" alt="Preview">`;
        }
    }
    
    if (almuerzos[1]) {
        document.getElementById('alm2_nombre').value = almuerzos[1].nombre || '';
        document.getElementById('alm2_precio').value = almuerzos[1].precio || '';
        document.getElementById('alm2_ingredientes').value = Array.isArray(almuerzos[1].ingredientes) 
            ? almuerzos[1].ingredientes.join(', ') 
            : almuerzos[1].ingredientes || '';
        document.getElementById('alm2_stock').value = almuerzos[1].stock || 0;
        document.getElementById('alm2_imagen_url').value = almuerzos[1].imagen || '';
        
        if (almuerzos[1].imagen) {
            document.getElementById('preview_alm2').innerHTML = `<img src="${almuerzos[1].imagen}" alt="Preview">`;
        }
    }
    
    // Cargar bebidas
    const bebidas = JSON.parse(localStorage.getItem('pensionGenesis_bebidas')) || [];
    bebidas.forEach(bebida => {
        if (bebida.id === 'refresco') {
            document.getElementById('beb_refresco_precio').value = bebida.precio || '';
            document.getElementById('beb_refresco_stock').value = bebida.stock || 0;
            document.getElementById('beb_refresco_imagen').value = bebida.imagen || '';
        } else if (bebida.id === 'agua') {
            document.getElementById('beb_agua_precio').value = bebida.precio || '';
            document.getElementById('beb_agua_stock').value = bebida.stock || 0;
            document.getElementById('beb_agua_imagen').value = bebida.imagen || '';
        } else if (bebida.id === 'jugo') {
            document.getElementById('beb_jugo_precio').value = bebida.precio || '';
            document.getElementById('beb_jugo_stock').value = bebida.stock || 0;
            document.getElementById('beb_jugo_imagen').value = bebida.imagen || '';
        }
    });
}

// ========== ACTUALIZAR DESAYUNOS ==========

function actualizarDesayunos() {
    // Obtener imagen del desayuno 1
    const des1File = document.getElementById('des1_imagen').files[0];
    const des1Url = document.getElementById('des1_imagen_url').value.trim();
    let des1Imagen = des1Url;
    
    if (des1File) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const desayuno1 = {
                id: 1,
                nombre: document.getElementById('des1_nombre').value.trim(),
                precio: parseFloat(document.getElementById('des1_precio').value) || 0,
                ingredientes: document.getElementById('des1_ingredientes').value.split(',').map(i => i.trim()),
                stock: parseInt(document.getElementById('des1_stock').value) || 0,
                imagen: e.target.result,
                tipo: 'desayuno'
            };
            
            procesarDesayuno2(desayuno1);
        };
        reader.readAsDataURL(des1File);
    } else {
        const desayuno1 = {
            id: 1,
            nombre: document.getElementById('des1_nombre').value.trim(),
            precio: parseFloat(document.getElementById('des1_precio').value) || 0,
            ingredientes: document.getElementById('des1_ingredientes').value.split(',').map(i => i.trim()),
            stock: parseInt(document.getElementById('des1_stock').value) || 0,
            imagen: des1Imagen,
            tipo: 'desayuno'
        };
        
        procesarDesayuno2(desayuno1);
    }
}

function procesarDesayuno2(desayuno1) {
    const des2File = document.getElementById('des2_imagen').files[0];
    const des2Url = document.getElementById('des2_imagen_url').value.trim();
    let des2Imagen = des2Url;
    
    if (des2File) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const desayuno2 = {
                id: 2,
                nombre: document.getElementById('des2_nombre').value.trim(),
                precio: parseFloat(document.getElementById('des2_precio').value) || 0,
                ingredientes: document.getElementById('des2_ingredientes').value.split(',').map(i => i.trim()),
                stock: parseInt(document.getElementById('des2_stock').value) || 0,
                imagen: e.target.result,
                tipo: 'desayuno'
            };
            
            guardarDesayunos(desayuno1, desayuno2);
        };
        reader.readAsDataURL(des2File);
    } else {
        const desayuno2 = {
            id: 2,
            nombre: document.getElementById('des2_nombre').value.trim(),
            precio: parseFloat(document.getElementById('des2_precio').value) || 0,
            ingredientes: document.getElementById('des2_ingredientes').value.split(',').map(i => i.trim()),
            stock: parseInt(document.getElementById('des2_stock').value) || 0,
            imagen: des2Imagen,
            tipo: 'desayuno'
        };
        
        guardarDesayunos(desayuno1, desayuno2);
    }
}

function guardarDesayunos(desayuno1, desayuno2) {
    // Validar
    if (!desayuno1.nombre || !desayuno2.nombre) {
        mostrarToast('Por favor completa todos los nombres de los platos únicos', 'error');
        return;
    }
    
    if (desayuno1.precio <= 0 || desayuno2.precio <= 0) {
        mostrarToast('Los precios deben ser mayores a 0', 'error');
        return;
    }
    
    const desayunos = [desayuno1, desayuno2];
    localStorage.setItem('pensionGenesis_desayunos', JSON.stringify(desayunos));
    
    mostrarToast('Platos únicos actualizados exitosamente', 'success');
}

// ========== ACTUALIZAR ALMUERZO ==========

function actualizarAlmuerzo() {
    const almFile = document.getElementById('alm_imagen').files[0];
    const almUrl = document.getElementById('alm_imagen_url').value.trim();
    
    const alm2File = document.getElementById('alm2_imagen').files[0];
    const alm2Url = document.getElementById('alm2_imagen_url').value.trim();
    
    if (almFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            procesarSegundo(e.target.result, alm2File, alm2Url);
        };
        reader.readAsDataURL(almFile);
    } else {
        procesarSegundo(almUrl, alm2File, alm2Url);
    }
}

function procesarSegundo(sopaImagen, alm2File, alm2Url) {
    if (alm2File) {
        const reader = new FileReader();
        reader.onload = function(e) {
            guardarAlmuerzos(sopaImagen, e.target.result);
        };
        reader.readAsDataURL(alm2File);
    } else {
        guardarAlmuerzos(sopaImagen, alm2Url);
    }
}

function guardarAlmuerzos(sopaImagen, segundoImagen) {
    const sopa = {
        id: 3,
        nombre: document.getElementById('alm_nombre').value.trim(),
        precio: parseFloat(document.getElementById('alm_precio').value) || 0,
        ingredientes: document.getElementById('alm_ingredientes').value.split(',').map(i => i.trim()),
        stock: parseInt(document.getElementById('alm_stock').value) || 0,
        imagen: sopaImagen,
        tipo: 'almuerzo'
    };
    
    const segundo = {
        id: 4,
        nombre: document.getElementById('alm2_nombre').value.trim(),
        precio: parseFloat(document.getElementById('alm2_precio').value) || 0,
        ingredientes: document.getElementById('alm2_ingredientes').value.split(',').map(i => i.trim()),
        stock: parseInt(document.getElementById('alm2_stock').value) || 0,
        imagen: segundoImagen,
        tipo: 'almuerzo'
    };
    
    // Validar
    if (!sopa.nombre || !segundo.nombre) {
        mostrarToast('Por favor completa los nombres de la sopa y el segundo', 'error');
        return;
    }
    
    if (sopa.precio <= 0 || segundo.precio <= 0) {
        mostrarToast('Los precios deben ser mayores a 0', 'error');
        return;
    }
    
    const almuerzos = [sopa, segundo];
    localStorage.setItem('pensionGenesis_almuerzos', JSON.stringify(almuerzos));
    
    mostrarToast('Almuerzo actualizado exitosamente', 'success');
}

// ========== ACTUALIZAR BEBIDAS ==========

function actualizarBebidas() {
    const bebidas = [
        {
            id: 'refresco',
            nombre: 'Refresco',
            precio: parseFloat(document.getElementById('beb_refresco_precio').value) || 0,
            stock: parseInt(document.getElementById('beb_refresco_stock').value) || 0,
            imagen: document.getElementById('beb_refresco_imagen').value.trim() || 'https://images.unsplash.com/photo-1581006852262-e4307cf6283a?w=400',
            tipo: 'bebida'
        },
        {
            id: 'agua',
            nombre: 'Agua',
            precio: parseFloat(document.getElementById('beb_agua_precio').value) || 0,
            stock: parseInt(document.getElementById('beb_agua_stock').value) || 0,
            imagen: document.getElementById('beb_agua_imagen').value.trim() || 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400',
            tipo: 'bebida'
        },
        {
            id: 'jugo',
            nombre: 'Jugo Natural',
            precio: parseFloat(document.getElementById('beb_jugo_precio').value) || 0,
            stock: parseInt(document.getElementById('beb_jugo_stock').value) || 0,
            imagen: document.getElementById('beb_jugo_imagen').value.trim() || 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400',
            tipo: 'bebida'
        }
    ];
    
    // Validar
    if (bebidas.some(b => b.precio <= 0)) {
        mostrarToast('Todos los precios deben ser mayores a 0', 'error');
        return;
    }
    
    localStorage.setItem('pensionGenesis_bebidas', JSON.stringify(bebidas));
    mostrarToast('Bebidas actualizadas exitosamente', 'success');
}

// ========== CARGAR RESERVAS ==========

function cargarReservasRecibidas() {
    const reservasList = document.getElementById('reservasList');
    if (!reservasList) return;
    
    const reservas = JSON.parse(localStorage.getItem('pensionGenesis_reservas')) || [];
    
    // Filtrar reservas de hoy o futuras
    const hoy = new Date().toISOString().split('T')[0];
    const reservasActuales = reservas.filter(r => r.fecha >= hoy && r.estado !== 'completada');
    
    if (reservasActuales.length === 0) {
        reservasList.innerHTML = '<p style="text-align: center; color: #7f8c8d;">No hay reservas pendientes</p>';
        return;
    }
    
    reservasList.innerHTML = reservasActuales.map(reserva => `
        <div style="background: var(--light-color); padding: 1.5rem; border-radius: 10px; margin-bottom: 1rem; border-left: 4px solid var(--primary-color);">
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                <div>
                    <h4 style="color: var(--primary-color); margin-bottom: 0.5rem;">
                        ${reserva.nombre}
                    </h4>
                    <p style="color: var(--dark-color); font-size: 0.9rem;">
                        📞 ${reserva.telefono} | 📧 ${reserva.email}
                    </p>
                </div>
                <span style="background: var(--success); color: white; padding: 0.3rem 0.8rem; border-radius: 20px; font-size: 0.8rem;">
                    ${reserva.estado}
                </span>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; margin-bottom: 1rem;">
                <div>
                    <strong style="color: var(--primary-color);">📅 Fecha:</strong>
                    <p>${reserva.fecha}</p>
                </div>
                <div>
                    <strong style="color: var(--primary-color);">⏰ Hora:</strong>
                    <p>${reserva.hora}</p>
                </div>
                <div>
                    <strong style="color: var(--primary-color);">💳 Pago:</strong>
                    <p>${reserva.metodoPago}</p>
                </div>
                <div>
                    <strong style="color: var(--primary-color);">💰 Total:</strong>
                    <p style="font-size: 1.2rem; font-weight: bold;">${formatearPrecio(reserva.total)}</p>
                </div>
            </div>
            
            <div style="background: white; padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
                <strong style="color: var(--primary-color);">🛒 Pedido:</strong>
                <ul style="margin-top: 0.5rem; padding-left: 1.5rem;">
                    ${reserva.items.map(item => `
                        <li>${item.nombre} x${item.cantidad} - ${formatearPrecio(item.precio * item.cantidad)}</li>
                    `).join('')}
                </ul>
            </div>
            
            ${reserva.notas ? `
                <div style="background: white; padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
                    <strong style="color: var(--primary-color);">📝 Notas:</strong>
                    <p style="margin-top: 0.5rem;">${reserva.notas}</p>
                </div>
            ` : ''}
            
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                <button 
                    onclick="marcarCompletada(${reserva.id})" 
                    class="btn-secondary"
                    style="flex: 1; min-width: 150px;"
                >
                    ✅ Marcar Completada
                </button>
                <button 
                    onclick="eliminarReserva(${reserva.id})" 
                    class="btn-danger"
                    style="flex: 1; min-width: 150px;"
                >
                    🗑️ Eliminar
                </button>
                <a 
                    href="https://wa.me/${reserva.telefono.replace(/\D/g, '')}?text=Hola ${reserva.nombre}, tu pedido está listo!" 
                    target="_blank"
                    class="btn-secondary"
                    style="flex: 1; min-width: 150px; text-align: center; text-decoration: none;"
                >
                    💬 Contactar
                </a>
            </div>
        </div>
    `).join('');
}

// Marcar reserva como completada
function marcarCompletada(reservaId) {
    const reservas = JSON.parse(localStorage.getItem('pensionGenesis_reservas')) || [];
    const reserva = reservas.find(r => r.id === reservaId);
    
    if (reserva) {
        reserva.estado = 'completada';
        localStorage.setItem('pensionGenesis_reservas', JSON.stringify(reservas));
        mostrarToast('Reserva marcada como completada', 'success');
        cargarReservasRecibidas();
    }
}

// Eliminar reserva
function eliminarReserva(reservaId) {
    if (!confirm('¿Estás seguro de eliminar esta reserva?')) return;
    
    let reservas = JSON.parse(localStorage.getItem('pensionGenesis_reservas')) || [];
    reservas = reservas.filter(r => r.id !== reservaId);
    localStorage.setItem('pensionGenesis_reservas', JSON.stringify(reservas));
    
    mostrarToast('Reserva eliminada', 'success');
    cargarReservasRecibidas();
}

// ========== ACCIONES RÁPIDAS ==========

function cargarDatosIniciales() {
    if (!confirm('¿Deseas cargar los datos de ejemplo? Esto sobrescribirá los datos actuales.')) return;
    
    // Limpiar todo
    localStorage.removeItem('pensionGenesis_desayunos');
    localStorage.removeItem('pensionGenesis_almuerzos');
    localStorage.removeItem('pensionGenesis_bebidas');
    
    // Reinicializar
    inicializarDatos();
    
    // Recargar datos
    cargarDatosActuales();
    
    mostrarToast('Datos de ejemplo cargados exitosamente', 'success');
}

function limpiarReservas() {
    if (!confirm('¿Estás seguro de limpiar todas las reservas? Esta acción no se puede deshacer.')) return;
    
    localStorage.setItem('pensionGenesis_reservas', JSON.stringify([]));
    cargarReservasRecibidas();
    mostrarToast('Reservas limpiadas', 'success');
}

function exportarDatos() {
    const datos = {
        desayunos: JSON.parse(localStorage.getItem('pensionGenesis_desayunos')),
        almuerzos: JSON.parse(localStorage.getItem('pensionGenesis_almuerzos')),
        bebidas: JSON.parse(localStorage.getItem('pensionGenesis_bebidas')),
        reservas: JSON.parse(localStorage.getItem('pensionGenesis_reservas')),
        config: JSON.parse(localStorage.getItem('pensionGenesis_config'))
    };
    
    const dataStr = JSON.stringify(datos, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `pension-genesis-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    mostrarToast('Datos exportados exitosamente', 'success');
}