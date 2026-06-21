// admin-usuarios.js - LOBOSO Admin Usuarios

// Variables globales
var currentPage = 0;
var pageSize = 10;
var totalPages = 0;
var currentUserId = null;

// Toast notification
function showToast(message, type) {
    if (type === undefined) type = 'success';
    var toast = document.createElement('div');
    toast.className = 'toast toast-' + type;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(function() {
        toast.style.opacity = '0';
        setTimeout(function() { toast.remove(); }, 300);
    }, 3000);
}

// Actualizar fecha en header
function updateDateTime() {
    var dateElement = document.getElementById('current-date');
    if (dateElement) {
        var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateElement.textContent = new Date().toLocaleDateString('es-ES', options);
    }
}

// Escapar HTML
function escapeHtml(text) {
    if (!text) return '';
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Cargar usuarios
function loadUsers() {
    var searchInput = document.getElementById('searchInput');
    var rolFilter = document.getElementById('rolFilter');
    var estadoFilter = document.getElementById('estadoFilter');
    
    var search = searchInput ? searchInput.value : '';
    var rol = rolFilter ? rolFilter.value : '';
    var estado = estadoFilter ? estadoFilter.value : '';
    
    var url = '/api/admin/usuarios?page=' + currentPage + '&size=' + pageSize;
    if (search) url = url + '&search=' + encodeURIComponent(search);
    if (rol) url = url + '&rol=' + rol;
    if (estado) url = url + '&activo=' + estado;
    
    fetch(url)
        .then(function(response) { return response.json(); })
        .then(function(data) {
            totalPages = data.totalPages;
            renderUsers(data.content);
            renderPagination();
        })
        .catch(function(error) {
            console.error('Error:', error);
            var tbody = document.getElementById('usersTableBody');
            if (tbody) {
                tbody.innerHTML = '<tr><td colspan="7" class="text-center py-12 text-red-500">Error al cargar usuarios. Verifica que el servidor esté corriendo.</td></tr>';
            }
        });
}

// Renderizar usuarios
function renderUsers(users) {
    var tbody = document.getElementById('usersTableBody');
    if (!tbody) return;
    
    if (!users || users.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center py-12 text-gray-500"><span class="material-symbols-outlined text-4xl mb-2 block">person_off</span>No hay usuarios registrados</td></tr>';
        return;
    }
    
    var html = '';
    for (var i = 0; i < users.length; i++) {
        var user = users[i];
        var rolClass = user.rol === 'ROLE_ADMIN' ? 'badge-admin' : 'badge-user';
        var rolText = user.rol === 'ROLE_ADMIN' ? 'Administrador' : 'Usuario';
        var statusClass = user.activo ? 'badge-active' : 'badge-inactive';
        var statusText = user.activo ? 'Activo' : 'Inactivo';
        var fechaRegistro = user.createdAt ? new Date(user.createdAt).toLocaleDateString('es-ES') : '-';
        
        html += '<tr class="hover:bg-gray-50 transition border-b border-gray-100">';
        html += '<td class="px-6 py-4 text-sm font-medium text-gray-900">' + user.id + '</td>';
        html += '<td class="px-6 py-4">';
        html += '<div class="flex items-center gap-3">';
        html += '<div class="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">';
        html += '<span class="material-symbols-outlined text-primary text-xl">person</span>';
        html += '</div>';
        html += '<div>';
        html += '<p class="font-semibold text-gray-900">' + escapeHtml(user.nombre) + '</p>';
        html += '<p class="text-xs text-gray-500">ID: ' + user.id + '</p>';
        html += '</div>';
        html += '</div>';
        html += '</td>';
        html += '<td class="px-6 py-4 text-sm text-gray-600">' + escapeHtml(user.email) + '</td>';
        html += '<td class="px-6 py-4">';
        html += '<span class="px-3 py-1 rounded-full text-xs font-semibold ' + rolClass + '">' + rolText + '</span>';
        html += '</td>';
        html += '<td class="px-6 py-4">';
        html += '<button onclick="toggleStatus(' + user.id + ', ' + user.activo + ')" class="px-3 py-1 rounded-full text-xs font-semibold transition-all ' + statusClass + ' hover:opacity-80">' + statusText + '</button>';
        html += '</td>';
        html += '<td class="px-6 py-4 text-sm text-gray-500">' + fechaRegistro + '</td>';
        html += '<td class="px-6 py-4">';
        html += '<div class="flex gap-2">';
        html += '<button onclick="viewUser(' + user.id + ')" class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Ver"><span class="material-symbols-outlined text-xl">visibility</span></button>';
        html += '<button onclick="editUser(' + user.id + ')" class="p-2 text-green-600 hover:bg-green-50 rounded-lg transition" title="Editar"><span class="material-symbols-outlined text-xl">edit</span></button>';
        html += '<button onclick="openPasswordModal(' + user.id + ')" class="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition" title="Cambiar contraseña"><span class="material-symbols-outlined text-xl">lock_reset</span></button>';
        html += '<button onclick="deleteUser(' + user.id + ')" class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition" title="Eliminar"><span class="material-symbols-outlined text-xl">delete</span></button>';
        html += '</div>';
        html += '</td>';
        html += '</tr>';
    }
    
    tbody.innerHTML = html;
}

// Renderizar paginación
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
    
    var paginationHtml = '<button onclick="changePage(' + (currentPage - 1) + ')" ' + prevDisabled + ' class="px-4 py-2 border border-gray-300 rounded-lg ' + prevClass + ' transition">';
    paginationHtml += '<span class="material-symbols-outlined text-lg">chevron_left</span>';
    paginationHtml += '</button>';
    paginationHtml += '<span class="text-sm text-gray-600">Página <span class="font-semibold text-gray-900">' + (currentPage + 1) + '</span> de ' + totalPages + '</span>';
    paginationHtml += '<button onclick="changePage(' + (currentPage + 1) + ')" ' + nextDisabled + ' class="px-4 py-2 border border-gray-300 rounded-lg ' + nextClass + ' transition">';
    paginationHtml += '<span class="material-symbols-outlined text-lg">chevron_right</span>';
    paginationHtml += '</button>';
    
    pagination.innerHTML = paginationHtml;
}

function changePage(page) {
    if (page >= 0 && page < totalPages) {
        currentPage = page;
        loadUsers();
    }
}

function openUserModal(userId) {
    var modal = document.getElementById('userModal');
    if (!modal) return;
    modal.classList.remove('hidden');
    
    if (userId) {
        editUser(userId);
    } else {
        document.getElementById('modalTitle').textContent = 'Nuevo Usuario';
        document.getElementById('userId').value = '';
        document.getElementById('userForm').reset();
        var passwordField = document.getElementById('passwordField');
        if (passwordField) passwordField.style.display = 'block';
        var passwordInput = document.getElementById('password');
        if (passwordInput) passwordInput.required = true;
    }
}

function closeUserModal() {
    var modal = document.getElementById('userModal');
    if (modal) modal.classList.add('hidden');
}

function viewUser(id) {
    fetch('/api/admin/usuarios/' + id)
        .then(function(response) { return response.json(); })
        .then(function(user) {
            var content = document.getElementById('viewContent');
            if (content) {
                var statusClass = user.activo ? 'badge-active' : 'badge-inactive';
                var statusText = user.activo ? 'Activo' : 'Inactivo';
                var rolText = user.rol === 'ROLE_ADMIN' ? 'Administrador' : 'Usuario';
                var fechaRegistro = user.createdAt ? new Date(user.createdAt).toLocaleDateString('es-ES') : '-';
                
                var viewHtml = '<div class="space-y-4">';
                viewHtml += '<div class="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">';
                viewHtml += '<div class="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">';
                viewHtml += '<span class="material-symbols-outlined text-primary text-3xl">person</span>';
                viewHtml += '</div>';
                viewHtml += '<div>';
                viewHtml += '<h4 class="font-bold text-gray-900">' + escapeHtml(user.nombre) + '</h4>';
                viewHtml += '<p class="text-sm text-gray-500">' + escapeHtml(user.email) + '</p>';
                viewHtml += '</div>';
                viewHtml += '</div>';
                viewHtml += '<div class="grid grid-cols-2 gap-3">';
                viewHtml += '<div class="p-3 bg-gray-50 rounded-lg">';
                viewHtml += '<p class="text-xs text-gray-500">ID de Usuario</p>';
                viewHtml += '<p class="font-semibold text-gray-900">' + user.id + '</p>';
                viewHtml += '</div>';
                viewHtml += '<div class="p-3 bg-gray-50 rounded-lg">';
                viewHtml += '<p class="text-xs text-gray-500">Rol</p>';
                viewHtml += '<p class="font-semibold text-gray-900">' + rolText + '</p>';
                viewHtml += '</div>';
                viewHtml += '<div class="p-3 bg-gray-50 rounded-lg">';
                viewHtml += '<p class="text-xs text-gray-500">Estado</p>';
                viewHtml += '<span class="px-2 py-1 rounded-full text-xs ' + statusClass + '">' + statusText + '</span>';
                viewHtml += '</div>';
                viewHtml += '<div class="p-3 bg-gray-50 rounded-lg">';
                viewHtml += '<p class="text-xs text-gray-500">Fecha Registro</p>';
                viewHtml += '<p class="font-semibold text-gray-900 text-sm">' + fechaRegistro + '</p>';
                viewHtml += '</div>';
                viewHtml += '</div>';
                viewHtml += '</div>';
                
                content.innerHTML = viewHtml;
            }
            var viewModal = document.getElementById('viewModal');
            if (viewModal) viewModal.classList.remove('hidden');
        })
        .catch(function(error) {
            showToast('Error al cargar usuario', 'error');
        });
}

function closeViewModal() {
    var viewModal = document.getElementById('viewModal');
    if (viewModal) viewModal.classList.add('hidden');
}

function editUser(id) {
    fetch('/api/admin/usuarios/' + id)
        .then(function(response) { return response.json(); })
        .then(function(user) {
            document.getElementById('modalTitle').textContent = 'Editar Usuario';
            document.getElementById('userId').value = user.id;
            document.getElementById('nombre').value = user.nombre;
            document.getElementById('email').value = user.email;
            document.getElementById('rol').value = user.rol;
            document.getElementById('activo').value = user.activo;
            var passwordField = document.getElementById('passwordField');
            if (passwordField) passwordField.style.display = 'none';
            var passwordInput = document.getElementById('password');
            if (passwordInput) passwordInput.required = false;
            var userModal = document.getElementById('userModal');
            if (userModal) userModal.classList.remove('hidden');
        })
        .catch(function(error) {
            showToast('Error al cargar usuario', 'error');
        });
}

function deleteUser(id) {
    if (confirm('¿Estás seguro de eliminar este usuario? Esta acción no se puede deshacer.')) {
        fetch('/api/admin/usuarios/' + id, { method: 'DELETE' })
            .then(function() {
                showToast('Usuario eliminado correctamente', 'success');
                loadUsers();
            })
            .catch(function() {
                showToast('Error al eliminar usuario', 'error');
            });
    }
}

function toggleStatus(id, currentStatus) {
    var newStatus = !currentStatus;
    var action = newStatus ? 'activar' : 'desactivar';
    
    if (confirm('¿Estás seguro de ' + action + ' este usuario?')) {
        fetch('/api/admin/usuarios/' + id + '/toggle-status', { method: 'PATCH' })
            .then(function() {
                showToast('Usuario ' + action + 'do correctamente', 'success');
                loadUsers();
            })
            .catch(function() {
                showToast('Error al cambiar estado', 'error');
            });
    }
}

function openPasswordModal(id) {
    currentUserId = id;
    var passwordModal = document.getElementById('passwordModal');
    if (passwordModal) passwordModal.classList.remove('hidden');
    var passwordForm = document.getElementById('passwordForm');
    if (passwordForm) passwordForm.reset();
}

function closePasswordModal() {
    var passwordModal = document.getElementById('passwordModal');
    if (passwordModal) passwordModal.classList.add('hidden');
    currentUserId = null;
}

// Inicializar event listeners
function initEventListeners() {
    var userForm = document.getElementById('userForm');
    if (userForm) {
        userForm.addEventListener('submit', function(e) {
            e.preventDefault();
            var id = document.getElementById('userId').value;
            var userData = {
                nombre: document.getElementById('nombre').value,
                email: document.getElementById('email').value,
                rol: document.getElementById('rol').value,
                activo: document.getElementById('activo').value === 'true'
            };
            
            if (!id) {
                var password = document.getElementById('password').value;
                if (!password || password.length < 6) {
                    showToast('La contraseña debe tener al menos 6 caracteres', 'error');
                    return;
                }
                userData.password = password;
            }
            
            var url = id ? '/api/admin/usuarios/' + id : '/api/admin/usuarios';
            var method = id ? 'PUT' : 'POST';
            
            fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            })
            .then(function(response) { return response.json(); })
            .then(function() {
                closeUserModal();
                loadUsers();
                showToast(id ? 'Usuario actualizado' : 'Usuario creado', 'success');
            })
            .catch(function() {
                showToast('Error al guardar usuario', 'error');
            });
        });
    }
    
    var passwordForm = document.getElementById('passwordForm');
    if (passwordForm) {
        passwordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            var newPassword = document.getElementById('newPassword').value;
            var confirmPassword = document.getElementById('confirmNewPassword').value;
            
            if (newPassword !== confirmPassword) {
                showToast('Las contraseñas no coinciden', 'error');
                return;
            }
            
            if (newPassword.length < 6) {
                showToast('La contraseña debe tener al menos 6 caracteres', 'error');
                return;
            }
            
            fetch('/api/admin/usuarios/' + currentUserId + '/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password: newPassword })
            })
            .then(function() {
                closePasswordModal();
                showToast('Contraseña actualizada correctamente', 'success');
            })
            .catch(function() {
                showToast('Error al actualizar contraseña', 'error');
            });
        });
    }
    
    var searchInput = document.getElementById('searchInput');
    var rolFilter = document.getElementById('rolFilter');
    var estadoFilter = document.getElementById('estadoFilter');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() { currentPage = 0; loadUsers(); });
    }
    if (rolFilter) {
        rolFilter.addEventListener('change', function() { currentPage = 0; loadUsers(); });
    }
    if (estadoFilter) {
        estadoFilter.addEventListener('change', function() { currentPage = 0; loadUsers(); });
    }
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeUserModal();
            closeViewModal();
            closePasswordModal();
        }
    });
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM cargado, inicializando...');
    updateDateTime();
    loadUsers();
    initEventListeners();
});