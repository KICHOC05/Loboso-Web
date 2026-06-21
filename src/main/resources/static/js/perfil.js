// ============================================================
// PERFIL - LOBOSO
// ============================================================

// Variables
let currentUser = null;
let csrfToken = null;

// ── Obtener CSRF token ──
function getCsrfToken() {
    const meta = document.querySelector('meta[name="_csrf"]');
    if (meta) {
        csrfToken = meta.getAttribute('content');
    }
}

// ── Toast Notification ──
function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(20px)';
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

// ── Actualizar fecha en header ──
function updateDateTime() {
    const dateElement = document.getElementById('current-date');
    if (!dateElement) return;
    
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    const dateStr = new Date().toLocaleDateString('es-ES', options);
    dateElement.textContent = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);
}

// ── Mostrar/ocultar loading ──
function setLoading(loading) {
    const indicator = document.getElementById('loadingIndicator');
    const content = document.getElementById('profileContent');
    if (indicator) indicator.classList.toggle('hidden', !loading);
    if (content) content.classList.toggle('hidden', loading);
}

// ── Cargar perfil del usuario ──
function loadPerfil() {
    setLoading(true);
    
    fetch('/api/perfil', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        return response.json();
    })
    .then(user => {
        currentUser = user;
        renderPerfil(user);
        setLoading(false);
    })
    .catch(error => {
        console.error('❌ Error al cargar perfil:', error);
        setLoading(false);
        showToast('Error al cargar perfil: ' + error.message, 'error');
    });
}

// ── Renderizar datos del perfil ──
function renderPerfil(user) {
    // Datos principales
    document.getElementById('perfilNombre').textContent = user.nombre || 'Sin nombre';
    document.getElementById('perfilEmail').textContent = user.email || 'Sin email';
    document.getElementById('nombre').value = user.nombre || '';
    document.getElementById('email').value = user.email || '';
    
    // Avatar
    const initial = user.nombre ? user.nombre.charAt(0).toUpperCase() : 'U';
    document.getElementById('avatarInitial').textContent = initial;
    
    // Rol
    const rolMap = {
        'ROLE_ADMIN': 'Administrador',
        'ROLE_USER': 'Usuario',
        'ROLE_EMPLOYEE': 'Empleado'
    };
    const rol = user.rol || 'ROLE_USER';
    const rolLabel = rolMap[rol] || rol;
    document.getElementById('perfilRol').textContent = rolLabel;
    document.getElementById('perfilRol').className = `text-xs font-medium px-3 py-1 rounded-full ${
        rol === 'ROLE_ADMIN' ? 'bg-primary/10 text-primary' : 
        rol === 'ROLE_USER' ? 'bg-gray-100 text-gray-700' : 
        'bg-secondary/10 text-secondary'
    }`;
    
    // Estado
    const estado = user.activo !== undefined ? user.activo : true;
    const estadoEl = document.getElementById('perfilEstado');
    if (estado) {
        estadoEl.textContent = '● Activo';
        estadoEl.className = 'text-xs font-medium px-3 py-1 rounded-full bg-green-100 text-green-700';
    } else {
        estadoEl.textContent = '● Inactivo';
        estadoEl.className = 'text-xs font-medium px-3 py-1 rounded-full bg-red-100 text-red-700';
    }
}

// ── Actualizar perfil ──
function updatePerfil(event) {
    event.preventDefault();
    
    const nombre = document.getElementById('nombre').value.trim();
    const email = document.getElementById('email').value.trim();
    
    if (!nombre || !email) {
        showToast('Todos los campos son requeridos', 'error');
        return;
    }
    
    const btn = document.getElementById('btnActualizarPerfil');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Guardando...';
    btn.disabled = true;
    
    const userData = { nombre, email };
    
    fetch('/api/perfil', {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData),
        credentials: 'include'
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => {
                throw new Error(err.error || err.message || `HTTP ${response.status}`);
            });
        }
        return response.json();
    })
    .then(user => {
        currentUser = user;
        renderPerfil(user);
        showToast('Perfil actualizado correctamente', 'success');
        
        // Mostrar mensaje de éxito
        const msg = document.getElementById('perfilMensaje');
        msg.textContent = '✅ Perfil actualizado correctamente';
        msg.className = 'text-sm font-medium text-green-600 mt-2';
        msg.classList.remove('hidden');
        setTimeout(() => msg.classList.add('hidden'), 4000);
    })
    .catch(error => {
        console.error('❌ Error al actualizar perfil:', error);
        showToast('Error: ' + error.message, 'error');
        
        const msg = document.getElementById('perfilMensaje');
        msg.textContent = '❌ ' + error.message;
        msg.className = 'text-sm font-medium text-red-600 mt-2';
        msg.classList.remove('hidden');
        setTimeout(() => msg.classList.add('hidden'), 5000);
    })
    .finally(() => {
        btn.innerHTML = originalText;
        btn.disabled = false;
    });
}

// ── Cambiar contraseña ──
function updatePassword(event) {
    event.preventDefault();
    
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Validaciones
    if (!currentPassword || !newPassword || !confirmPassword) {
        showToast('Todos los campos son requeridos', 'error');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        showToast('Las contraseñas no coinciden', 'error');
        return;
    }
    
    if (newPassword.length < 6) {
        showToast('La nueva contraseña debe tener al menos 6 caracteres', 'error');
        return;
    }
    
    const btn = document.getElementById('btnCambiarPassword');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Actualizando...';
    btn.disabled = true;
    
    const passwordData = {
        currentPassword: currentPassword,
        newPassword: newPassword,
        confirmPassword: confirmPassword
    };
    
    fetch('/api/perfil/change-password', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(passwordData),
        credentials: 'include'
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => {
                throw new Error(err.error || err.message || `HTTP ${response.status}`);
            });
        }
        return response.json();
    })
    .then(data => {
        showToast('✅ Contraseña actualizada correctamente', 'success');
        document.getElementById('passwordForm').reset();
        
        const msg = document.getElementById('passwordMensaje');
        msg.textContent = '✅ Contraseña actualizada correctamente';
        msg.className = 'text-sm font-medium text-green-600 mt-2';
        msg.classList.remove('hidden');
        setTimeout(() => msg.classList.add('hidden'), 4000);
    })
    .catch(error => {
        console.error('❌ Error al cambiar contraseña:', error);
        showToast('Error: ' + error.message, 'error');
        
        const msg = document.getElementById('passwordMensaje');
        msg.textContent = '❌ ' + error.message;
        msg.className = 'text-sm font-medium text-red-600 mt-2';
        msg.classList.remove('hidden');
        setTimeout(() => msg.classList.add('hidden'), 5000);
    })
    .finally(() => {
        btn.innerHTML = originalText;
        btn.disabled = false;
    });
}

// ── Mobile Menu ──
function initMobileMenu() {
    const menuBtn = document.getElementById('mobileMenuBtn');
    const sidebar = document.querySelector('.sidebar-gradient');
    const overlay = document.getElementById('sidebarOverlay');
    
    if (!menuBtn || !sidebar) return;
    
    menuBtn.addEventListener('click', () => {
        sidebar.classList.toggle('mobile-open');
        if (overlay) overlay.classList.toggle('active');
        document.body.style.overflow = sidebar.classList.contains('mobile-open') ? 'hidden' : '';
    });
    
    if (overlay) {
        overlay.addEventListener('click', () => {
            sidebar.classList.remove('mobile-open');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
}

// ── Inicializar ──
function init() {
    console.log('🚀 LOBOSO - Perfil Inicializado');
    
    getCsrfToken();
    updateDateTime();
    loadPerfil();
    initMobileMenu();
    
    // Event listeners
    const perfilForm = document.getElementById('perfilForm');
    if (perfilForm) {
        perfilForm.addEventListener('submit', updatePerfil);
    }
    
    const passwordForm = document.getElementById('passwordForm');
    if (passwordForm) {
        passwordForm.addEventListener('submit', updatePassword);
    }
    
    // Cerrar sidebar al hacer click en enlaces (mobile)
    document.querySelectorAll('.sidebar-gradient nav a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                const sidebar = document.querySelector('.sidebar-gradient');
                const overlay = document.getElementById('sidebarOverlay');
                sidebar?.classList.remove('mobile-open');
                overlay?.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });
}

// ── Iniciar cuando el DOM esté listo ──
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}