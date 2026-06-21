// Sidebar Functionality
(function() {
    'use strict';
    
    // DOM Elements
    const sidebar = document.getElementById('sidebar');
    const collapseBtn = document.getElementById('collapse-btn');
    const mainContent = document.querySelector('.main-content');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileSidebar = document.getElementById('mobile-sidebar');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    const closeSidebarBtn = document.getElementById('close-sidebar-btn');
    
    // Collapse/Expand functionality
    function toggleSidebar() {
        if (!sidebar) return;
        
        const isCollapsed = sidebar.classList.contains('sidebar-collapsed');
        
        if (isCollapsed) {
            // Expand
            sidebar.classList.remove('sidebar-collapsed');
            if (mainContent && window.innerWidth > 768) {
                mainContent.style.marginLeft = '280px';
            }
            localStorage.setItem('sidebarCollapsed', 'false');
        } else {
            // Collapse
            sidebar.classList.add('sidebar-collapsed');
            if (mainContent && window.innerWidth > 768) {
                mainContent.style.marginLeft = '80px';
            }
            localStorage.setItem('sidebarCollapsed', 'true');
        }
    }
    
    // Load saved collapsed state
    function loadSavedState() {
        if (!sidebar) return;
        
        const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
        
        if (isCollapsed && window.innerWidth > 768) {
            sidebar.classList.add('sidebar-collapsed');
            if (mainContent) {
                mainContent.style.marginLeft = '80px';
            }
        } else if (window.innerWidth > 768) {
            if (mainContent) {
                mainContent.style.marginLeft = '280px';
            }
        }
    }
    
    // Adjust main content margin on window resize
    function adjustMargin() {
        if (!mainContent || !sidebar) return;
        
        if (window.innerWidth > 768) {
            const isCollapsed = sidebar.classList.contains('sidebar-collapsed');
            mainContent.style.marginLeft = isCollapsed ? '80px' : '280px';
        } else {
            mainContent.style.marginLeft = '0';
        }
    }
    
    // Mobile sidebar functions
    function openMobileSidebar() {
        if (mobileSidebar) {
            mobileSidebar.classList.add('open');
            mobileSidebar.style.transform = 'translateX(0)';
        }
        if (sidebarOverlay) {
            sidebarOverlay.style.display = 'block';
        }
        document.body.style.overflow = 'hidden';
    }
    
    function closeMobileSidebar() {
        if (mobileSidebar) {
            mobileSidebar.classList.remove('open');
            mobileSidebar.style.transform = 'translateX(-100%)';
        }
        if (sidebarOverlay) {
            sidebarOverlay.style.display = 'none';
        }
        document.body.style.overflow = '';
    }
    
    // Event Listeners
    if (collapseBtn) {
        collapseBtn.addEventListener('click', toggleSidebar);
    }
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', openMobileSidebar);
    }
    
    if (closeSidebarBtn) {
        closeSidebarBtn.addEventListener('click', closeMobileSidebar);
    }
    
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', closeMobileSidebar);
    }
    
    window.addEventListener('resize', function() {
        adjustMargin();
        
        // Close mobile sidebar on resize if open
        if (window.innerWidth > 768 && mobileSidebar) {
            closeMobileSidebar();
        }
    });
    
    // Initialize
    loadSavedState();
    
    // Close mobile sidebar on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileSidebar && mobileSidebar.classList.contains('open')) {
            closeMobileSidebar();
        }
    });
})();