// ============================================
// DASHBOARD LOBOSO - INTERACTIVIDAD MODERNA
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    
    // Set dynamic date in header - Formato mejorado
    const dateElement = document.getElementById('current-date');
    if (dateElement) {
        const dateOptions = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        let dateStr = new Date().toLocaleDateString('es-ES', dateOptions);
        // Capitalizar primera letra del día
        dateStr = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);
        dateElement.innerText = dateStr;
    }
    
    // Mobile menu
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const sidebar = document.querySelector('.sidebar-gradient');
    const overlay = document.getElementById('sidebarOverlay');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            sidebar.classList.toggle('mobile-open');
            overlay.classList.toggle('active');
            document.body.style.overflow = sidebar.classList.contains('mobile-open') ? 'hidden' : '';
        });
    }
    
    if (overlay) {
        overlay.addEventListener('click', function() {
            sidebar.classList.remove('mobile-open');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    // Cerrar sidebar en móvil al navegar
    const navLinks = document.querySelectorAll('.sidebar-gradient nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('mobile-open');
                overlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });
    
    // Hover effect para sidebar items
    const navItems = document.querySelectorAll('.sidebar-gradient nav a');
    navItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            if (!item.classList.contains('bg-white/10')) {
                item.style.borderColor = '#aaf68c44';
            }
        });
        item.addEventListener('mouseleave', () => {
            if (!item.classList.contains('bg-white/10')) {
                item.style.borderColor = 'transparent';
            }
        });
    });
    
    console.log("LOBOSO Dashboard Inicializado - " + new Date().toLocaleString());
});

// Modal de confirmación para logout
function confirmLogout() {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(8px);
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: fadeInModal 0.2s ease;
    `;
    
    modal.innerHTML = `
        <div style="background: white; border-radius: 2rem; padding: 2.5rem; max-width: 420px; width: 90%; text-align: center; animation: slideUpModal 0.3s cubic-bezier(0.2, 0.9, 0.4, 1.1); box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);">
            <div style="width: 64px; height: 64px; background: #fee2e2; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem;">
                <span class="material-symbols-outlined" style="font-size: 32px; color: #ba1a1a;">logout</span>
            </div>
            <h3 style="font-size: 1.5rem; font-weight: 700; color: #191c21; margin-bottom: 0.75rem;">Cerrar Sesión</h3>
            <p style="color: #717782; margin-bottom: 2rem; line-height: 1.5;">¿Estás seguro de que deseas salir del panel administrativo?</p>
            <div style="display: flex; gap: 1rem; justify-content: center;">
                <button id="confirmLogoutBtn" style="background: #004e8a; color: white; border: none; padding: 0.75rem 1.75rem; border-radius: 3rem; font-weight: 600; cursor: pointer; transition: all 0.2s;">Sí, salir</button>
                <button id="cancelLogoutBtn" style="background: #f1f5f9; color: #414751; border: none; padding: 0.75rem 1.75rem; border-radius: 3rem; font-weight: 600; cursor: pointer; transition: all 0.2s;">Cancelar</button>
            </div>
        </div>
    `;
    
    // Estilos de animación
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInModal {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes slideUpModal {
            from { opacity: 0; transform: translateY(20px) scale(0.95); }
            to { opacity: 1; transform: translateY(0) scale(1); }
        }
    `;
    document.head.appendChild(style);
    document.body.appendChild(modal);
    
    const confirmBtn = document.getElementById('confirmLogoutBtn');
    const cancelBtn = document.getElementById('cancelLogoutBtn');
    
    confirmBtn.onclick = () => {
        window.location.href = '/logout';
    };
    
    cancelBtn.onclick = () => {
        modal.remove();
    };
    
    modal.onclick = (e) => {
        if (e.target === modal) modal.remove();
    };
}