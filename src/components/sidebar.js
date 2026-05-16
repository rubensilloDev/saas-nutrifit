/**
 * Componente Sidebar - NutriFit Systems
 * Inyecta el menú de navegación lateral en el DOM y gestiona los estados activos y de colapso.
 */

function initSidebar() {
    // PERSISTENCIA: Recuperar el estado de colapso guardado en el navegador
    const isCollapsed = localStorage.getItem('sidebar-collapsed') === 'true';
    
    const sidebarHTML = `
        <aside id="main-sidebar" class="sidebar-container ${isCollapsed ? 'collapsed' : ''}">
            <div class="sidebar-header">
                <div class="brand-logo">
                    <i class="ri-leaf-line"></i>
                </div>
                <h2 class="brand-title">NutriFit</h2>
            </div>
            
            <nav class="sidebar-menu">
                <a href="/pages/dashboard/index.html" class="menu-link" id="link-inicio">
                    <i class="ri-home-4-line icon"></i>
                    <span class="label">Inicio</span>
                </a>
                
                <!-- Grupos con Dropdowns para navegación organizada -->
                <div class="menu-group">
                    <button class="menu-link dropdown-toggle" id="btn-registros">
                        <i class="ri-book-read-line icon"></i>
                        <span class="label">Registros</span>
                        <i class="ri-arrow-down-s-line arrow"></i>
                    </button>
                    <div class="submenu" id="submenu-registros">
                        <a href="/pages/registros/entrenamiento.html" class="submenu-link">
                            <i class="ri-run-line icon"></i>
                            <span class="label">Entrenamiento</span>
                        </a>
                        <a href="/pages/registros/nutricion.html" class="submenu-link">
                            <i class="ri-restaurant-line icon"></i>
                            <span class="label">Nutrición</span>
                        </a>
                    </div>
                </div>

                <div class="menu-group">
                    <button class="menu-link dropdown-toggle" id="btn-mensajes">
                        <i class="ri-message-3-line icon"></i>
                        <span class="label">Mensajes</span>
                        <i class="ri-arrow-down-s-line arrow"></i>
                    </button>
                    <div class="submenu" id="submenu-mensajes">
                        <a href="/pages/mensajes/chat-ia.html" class="submenu-link">
                            <i class="ri-robot-line icon"></i>
                            <span class="label">Chat de IA</span>
                        </a>
                        <a href="/pages/mensajes/profesional.html" class="submenu-link">
                            <i class="ri-user-voice-line icon"></i>
                            <span class="label">Chat Profesional</span>
                        </a>
                    </div>
                </div>

                <div class="menu-group">
                    <button class="menu-link dropdown-toggle" id="btn-perfil">
                        <i class="ri-user-3-line icon"></i>
                        <span class="label">Perfil</span>
                        <i class="ri-arrow-down-s-line arrow"></i>
                    </button>
                    <div class="submenu" id="submenu-perfil">
                        <a href="/pages/perfil/index.html" class="submenu-link">
                            <i class="ri-profile-line icon"></i>
                            <span class="label">Mis Datos</span>
                        </a>
                        <a href="/pages/perfil/configuracion.html" class="submenu-link">
                            <i class="ri-settings-5-line icon"></i>
                            <span class="label">Configuración</span>
                        </a>
                    </div>
                </div>
            </nav>

            <div class="sidebar-footer">
                <button id="sidebar-toggle" class="toggle-btn" title="Contraer menú">
                    <i class="ri-arrow-left-wide-line"></i>
                    <span class="label">Contraer menú</span>
                </button>
                <div class="user-profile">
                    <div class="user-avatar">
                        <img src="https://ui-avatars.com/api/?name=Usuario+Fit&background=4CAF50&color=fff" alt="User Avatar">
                    </div>
                    <div class="user-info">
                        <span class="user-name">Usuario Fit</span>
                        <span class="user-email">hola@nutrifit.com</span>
                    </div>
                </div>
            </div>
        </aside>
    `;

    // INYECCIÓN DINÁMICA: Asegura que el sidebar aparezca en todas las páginas
    const target = document.getElementById('sidebar-target');
    if (target) {
        target.innerHTML = sidebarHTML;
    } else {
        document.body.insertAdjacentHTML('afterbegin', sidebarHTML);
    }

    setupEventListeners();
    setActiveLink();
}

/**
 * Configura los eventos de clic para el toggle y los dropdowns
 */
function setupEventListeners() {
    const sidebar = document.getElementById('main-sidebar');
    const toggleBtn = document.getElementById('sidebar-toggle');
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');

    // Gestión del botón de contraer/expandir
    toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
        const isCollapsed = sidebar.classList.contains('collapsed');
        localStorage.setItem('sidebar-collapsed', isCollapsed);
        
        // EVENTO PERSONALIZADO: Permite que otros elementos (como el dashboard) 
        // ajusten sus márgenes automáticamente al mover el sidebar.
        window.dispatchEvent(new CustomEvent('sidebarToggle', { detail: { collapsed: isCollapsed } }));
    });

    // Lógica de submenús: expande el sidebar si está cerrado al intentar abrir un dropdown
    dropdownToggles.forEach(btn => {
        btn.addEventListener('click', () => {
            if (sidebar.classList.contains('collapsed')) {
                sidebar.classList.remove('collapsed');
                localStorage.setItem('sidebar-collapsed', 'false');
            }
            
            const group = btn.closest('.menu-group');
            group.classList.toggle('open');
        });
    });
}

/**
 * MARCADOR DE RUTA: Resalta el enlace actual basado en la URL de la página
 */
function setActiveLink() {
    const currentPath = window.location.pathname;
    const allLinks = document.querySelectorAll('.menu-link, .submenu-link');

    allLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href !== '#' && (currentPath === href || currentPath.endsWith(href))) {
            link.classList.add('active');
            
            // Si el enlace está dentro de un submenú, abre el grupo padre automáticamente
            const parentGroup = link.closest('.menu-group');
            if (parentGroup) {
                parentGroup.classList.add('open');
            }
        }
    });
}

// Iniciar ejecución cuando el navegador termine de cargar el HTML
document.addEventListener('DOMContentLoaded', initSidebar);


