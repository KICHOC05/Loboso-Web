// admin-servicios.js - LOBOSO Admin Servicios

var currentPage = 0;
var pageSize = 9;
var totalPages = 0;
var currentImageFile = null;

function showToast(message, type) {
    var toast = document.createElement('div');
    toast.className = 'toast toast-' + (type || 'success');
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(function() {
        toast.style.opacity = '0';
        setTimeout(function() { toast.remove(); }, 300);
    }, 3000);
}

function updateDateTime() {
    var dateElement = document.getElementById('current-date');
    if (dateElement) {
        var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateElement.textContent = new Date().toLocaleDateString('es-ES', options);
    }
}

function loadServicios() {
    var search = document.getElementById('searchInput') ? document.getElementById('searchInput').value : '';
    var url = '/api/admin/servicios?page=' + currentPage + '&size=' + pageSize;
    if (search) url += '&search=' + encodeURIComponent(search);
    
    fetch(url)
        .then(function(response) { return response.json(); })
        .then(function(data) {
            totalPages = data.totalPages;
            renderServicios(data.content);
            renderPagination();
        })
        .catch(function(error) {
            console.error('Error:', error);
            showToast('Error al cargar servicios', 'error');
        });
}

function renderServicios(servicios) {
    var grid = document.getElementById('serviciosGrid');
    if (!grid) return;
    
    if (!servicios || servicios.length === 0) {
        grid.innerHTML = '<div class="col-span-3 text-center py-12 text-gray-500"><span class="material-symbols-outlined text-4xl mb-2 block">inventory_2</span>No hay servicios registrados</div>';
        return;
    }
    
    var html = '';
    for (var i = 0; i < servicios.length; i++) {
        var s = servicios[i];
        var statusClass = s.activo ? 'badge-active' : 'badge-inactive';
        var statusText = s.activo ? 'Activo' : 'Inactivo';
        
        html += '<div class="servicio-card bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all">';
        html += '<div class="h-48 overflow-hidden bg-gray-100">';
        html += '<img src="' + (s.imagenUrl || 'https://via.placeholder.com/400x300?text=LOBOSO') + '" alt="' + escapeHtml(s.nombre) + '" class="w-full h-full object-cover">';
        html += '</div>';
        html += '<div class="p-4">';
        html += '<div class="flex justify-between items-start mb-2">';
        html += '<h3 class="text-lg font-bold text-gray-900">' + escapeHtml(s.nombre) + '</h3>';
        html += '<span class="px-2 py-1 rounded-full text-xs font-semibold ' + statusClass + '">' + statusText + '</span>';
        html += '</div>';
        html += '<p class="text-gray-600 text-sm mb-3">' + escapeHtml(s.descripcion || 'Sin descripción') + '</p>';
        if (s.precioBase) {
            html += '<p class="text-primary font-bold text-lg mb-3">$' + s.precioBase.toFixed(2) + ' MXN</p>';
        }
        html += '<div class="flex gap-2">';
        html += '<button onclick="viewDetail(' + s.id + ')" class="flex-1 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition text-sm">Ver Detalle</button>';
        html += '<button onclick="editServicio(' + s.id + ')" class="flex-1 px-3 py-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition text-sm">Editar</button>';
        html += '<button onclick="deleteServicio(' + s.id + ')" class="flex-1 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition text-sm">Eliminar</button>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
    }
    
    grid.innerHTML = html;
}

function renderPagination() {
    var pagination = document.getElementById('pagination');
    if (!pagination) return;
    
    if (totalPages === 0) {
        pagination.innerHTML = '';
        return;
    }
    
    var prevDisabled = currentPage === 0 ? 'disabled' : '';
    var prevClass = currentPage === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100';
    var nextDisabled = currentPage + 1 >= totalPages ? 'disabled' : '';
    var nextClass = currentPage + 1 >= totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100';
    
    var html = '<button onclick="changePage(' + (currentPage - 1) + ')" ' + prevDisabled + ' class="px-4 py-2 border border-gray-300 rounded-lg ' + prevClass + ' transition">';
    html += '<span class="material-symbols-outlined text-lg">chevron_left</span>';
    html += '</button>';
    html += '<span class="text-sm text-gray-600">Página <span class="font-semibold text-gray-900">' + (currentPage + 1) + '</span> de ' + totalPages + '</span>';
    html += '<button onclick="changePage(' + (currentPage + 1) + ')" ' + nextDisabled + ' class="px-4 py-2 border border-gray-300 rounded-lg ' + nextClass + ' transition">';
    html += '<span class="material-symbols-outlined text-lg">chevron_right</span>';
    html += '</button>';
    
    pagination.innerHTML = html;
}

function changePage(page) {
    if (page >= 0 && page < totalPages) {
        currentPage = page;
        loadServicios();
    }
}

function openServicioModal(id) {
    var modal = document.getElementById('servicioModal');
    if (!modal) return;
    
    modal.classList.remove('hidden');
    document.getElementById('servicioForm').reset();
    document.getElementById('imagenPreview').classList.add('hidden');
    currentImageFile = null;
    
    if (id) {
        editServicio(id);
    } else {
        document.getElementById('modalTitle').textContent = 'Nuevo Servicio';
        document.getElementById('servicioId').value = '';
    }
}

function closeServicioModal() {
    var modal = document.getElementById('servicioModal');
    if (modal) modal.classList.add('hidden');
    currentImageFile = null;
}

function viewDetail(id) {
    fetch('/api/admin/servicios/' + id)
        .then(function(response) { return response.json(); })
        .then(function(s) {
            var content = document.getElementById('detailContent');
            var caracteristicasHtml = '';
            if (s.caracteristicas && s.caracteristicas.length > 0) {
                caracteristicasHtml = '<div class="mb-4"><h4 class="font-semibold text-gray-900 mb-2">Características</h4><ul class="space-y-1">';
                for (var i = 0; i < s.caracteristicas.length; i++) {
                    caracteristicasHtml += '<li class="flex items-center gap-2 text-gray-600"><span class="material-symbols-outlined text-secondary text-sm">check_circle</span>' + escapeHtml(s.caracteristicas[i]) + '</li>';
                }
                caracteristicasHtml += '</ul></div>';
            }
            
            var whatsappNumber = '525519477201';
            var message = s.whatsappMessage ? s.whatsappMessage : 'Hola, me interesa el servicio de ' + s.nombre;
            var whatsappUrl = 'https://wa.me/' + whatsappNumber + '?text=' + encodeURIComponent(message);
            
            content.innerHTML = `
                <div class="flex flex-col md:flex-row gap-6">
                    <div class="md:w-1/2">
                        <img src="${s.imagenUrl || 'https://via.placeholder.com/500x400?text=LOBOSO'}" alt="${escapeHtml(s.nombre)}" class="w-full rounded-xl shadow-md">
                    </div>
                    <div class="md:w-1/2">
                        <h2 class="text-2xl font-bold text-gray-900 mb-2">${escapeHtml(s.nombre)}</h2>
                        ${s.precioBase ? '<p class="text-3xl font-bold text-primary mb-4">$' + s.precioBase.toFixed(2) + ' MXN</p>' : ''}
                        <p class="text-gray-600 mb-4">${escapeHtml(s.descripcionLarga || s.descripcion)}</p>
                        ${caracteristicasHtml}
                        <a href="${whatsappUrl}" target="_blank" class="inline-flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition mt-4">
                            <span class="material-symbols-outlined">chat</span>
                            Cotizar por WhatsApp
                        </a>
                    </div>
                </div>
            `;
            
            document.getElementById('detailTitle').textContent = s.nombre;
            document.getElementById('detailModal').classList.remove('hidden');
        });
}

function closeDetailModal() {
    document.getElementById('detailModal').classList.add('hidden');
}

function editServicio(id) {
    fetch('/api/admin/servicios/' + id)
        .then(function(response) { return response.json(); })
        .then(function(s) {
            document.getElementById('modalTitle').textContent = 'Editar Servicio';
            document.getElementById('servicioId').value = s.id;
            document.getElementById('nombre').value = s.nombre;
            document.getElementById('descripcion').value = s.descripcion || '';
            document.getElementById('descripcionLarga').value = s.descripcionLarga || '';
            document.getElementById('caracteristicas').value = s.caracteristicas ? s.caracteristicas.join('\n') : '';
            document.getElementById('precioBase').value = s.precioBase || '';
            document.getElementById('orden').value = s.orden || 0;
            document.getElementById('whatsappMessage').value = s.whatsappMessage || '';
            document.getElementById('activo').value = s.activo;
            
            if (s.imagenUrl) {
                document.getElementById('previewImg').src = s.imagenUrl;
                document.getElementById('imagenPreview').classList.remove('hidden');
            }
            
            document.getElementById('servicioModal').classList.remove('hidden');
        });
}

function deleteServicio(id) {
    if (confirm('¿Estás seguro de eliminar este servicio? Esta acción no se puede deshacer.')) {
        fetch('/api/admin/servicios/' + id, { method: 'DELETE' })
            .then(function() {
                showToast('Servicio eliminado correctamente', 'success');
                loadServicios();
            })
            .catch(function() {
                showToast('Error al eliminar servicio', 'error');
            });
    }
}

function escapeHtml(text) {
    if (!text) return '';
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

document.addEventListener('DOMContentLoaded', function() {
    updateDateTime();
    loadServicios();
    
    // Preview image
    var imagenInput = document.getElementById('imagen');
    if (imagenInput) {
        imagenInput.addEventListener('change', function(e) {
            var file = e.target.files[0];
            if (file) {
                currentImageFile = file;
                var reader = new FileReader();
                reader.onload = function(event) {
                    document.getElementById('previewImg').src = event.target.result;
                    document.getElementById('imagenPreview').classList.remove('hidden');
                };
                reader.readAsDataURL(file);
            }
        });
    }
    
    // Submit form
    var servicioForm = document.getElementById('servicioForm');
    if (servicioForm) {
        servicioForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            var id = document.getElementById('servicioId').value;
            var formData = new FormData();
            
            var servicioData = {
                nombre: document.getElementById('nombre').value,
                descripcion: document.getElementById('descripcion').value,
                descripcionLarga: document.getElementById('descripcionLarga').value,
                caracteristicas: document.getElementById('caracteristicas').value.split('\n').filter(function(c) { return c.trim(); }),
                precioBase: parseFloat(document.getElementById('precioBase').value) || null,
                orden: parseInt(document.getElementById('orden').value) || 0,
                whatsappMessage: document.getElementById('whatsappMessage').value,
                activo: document.getElementById('activo').value === 'true'
            };
            
            formData.append('servicio', new Blob([JSON.stringify(servicioData)], {type: 'application/json'}));
            if (currentImageFile) {
                formData.append('imagen', currentImageFile);
            }
            
            var url = id ? '/api/admin/servicios/' + id : '/api/admin/servicios';
            var method = id ? 'PUT' : 'POST';
            
            fetch(url, {
                method: method,
                body: formData
            })
            .then(function(response) { return response.json(); })
            .then(function() {
                closeServicioModal();
                loadServicios();
                showToast(id ? 'Servicio actualizado' : 'Servicio creado', 'success');
            })
            .catch(function() {
                showToast('Error al guardar servicio', 'error');
            });
        });
    }
    
    var searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function() { currentPage = 0; loadServicios(); });
    }
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeServicioModal();
            closeDetailModal();
        }
    });
});