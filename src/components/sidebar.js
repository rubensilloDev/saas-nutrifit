/**
 * Componente Sidebar - NutriFit Systems
 * Inyecta el menú de navegación lateral en el DOM y gestiona los estados activos y de colapso.
 */

// === LOADING SCREEN PREMIUM ===
(function() {
    // Inyectar el overlay de carga inmediatamente (antes de que el DOM termine)
    if (!document.getElementById('nutrifit-loader')) {
        const loader = document.createElement('div');
        loader.id = 'nutrifit-loader';
        loader.innerHTML = `
            <div class="loader-logo"><img src="/img/icono-nutrifit.webp" alt="NutriFit"></div>
            <div class="loader-spinner"></div>
            <div class="loader-brand">NutriFit</div>
        `;
        document.documentElement.appendChild(loader);

        // Ocultar el loader cuando el DOM esté listo
        const hideLoader = () => {
            requestAnimationFrame(() => {
                loader.classList.add('hidden');
                setTimeout(() => { loader.remove(); }, 700);
            });
        };

        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            setTimeout(hideLoader, 250);
        } else {
            document.addEventListener('DOMContentLoaded', () => setTimeout(hideLoader, 250));
            window.addEventListener('load', hideLoader);
        }
    }

    // Interceptar clics en enlaces de navegación para mostrar loading
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a[href]');
        if (!link) return;
        const href = link.getAttribute('href');
        if (!href || href === '#' || href.startsWith('http') || href.startsWith('//')) return;

        // Mostrar loader antes de navegar
        const loader = document.getElementById('nutrifit-loader');
        if (loader) {
            loader.classList.remove('hidden');
            loader.style.opacity = '1';
            loader.style.pointerEvents = 'all';
        }
    });
})();

function initSidebar() {
    const isMobile = window.innerWidth <= 768;
    const defaultCollapsed = isMobile ? true : localStorage.getItem('sidebar-collapsed') === 'true';
    const role = (() => { try { return localStorage.getItem('nutrifit-role'); } catch (e) { return null; } })();
    const isPro = role === 'profesional';

    const userMenu = isPro ? `
        <nav class="sidebar-menu">
            <a href="/pages/profesional/dashboard.html" class="menu-link" id="link-inicio">
                <i class="ri-home-5-line icon"></i>
                <span class="label">Inicio</span>
            </a>
            <a href="/pages/profesional/clientes.html?mode=chat" class="menu-link">
                <i class="ri-message-3-line icon"></i>
                <span class="label">Chat</span>
            </a>
            <a href="/pages/profesional/clientes.html?mode=entreno" class="menu-link">
                <i class="ri-run-line icon"></i>
                <span class="label">Entrenamiento</span>
            </a>
            <a href="/pages/profesional/clientes.html?mode=nutricion" class="menu-link">
                <i class="ri-restaurant-2-line icon"></i>
                <span class="label">Nutrición</span>
            </a>
            <div class="menu-group">
                <button class="menu-link dropdown-toggle" id="btn-perfil-pro">
                    <i class="ri-user-3-line icon"></i>
                    <span class="label">Perfil</span>
                    <i class="ri-arrow-down-s-line arrow-icon"></i>
                </button>
                <div class="submenu" id="submenu-perfil-pro">
                    <a href="/pages/profesional/perfil.html" class="submenu-link">
                        <i class="ri-profile-line icon"></i>
                        <span class="label">Mi Perfil</span>
                    </a>
                    <a href="/pages/profesional/configuracion.html" class="submenu-link">
                        <i class="ri-settings-5-line icon"></i>
                        <span class="label">Configuración</span>
                    </a>
                </div>
            </div>
        </nav>
    ` : `
        <nav class="sidebar-menu">
            <a href="/pages/dashboard/index.html" class="menu-link" id="link-inicio">
                <i class="ri-home-4-line icon"></i>
                <span class="label">Inicio</span>
            </a>
            
            <div class="menu-group">
                <button class="menu-link dropdown-toggle" id="btn-registros">
                    <i class="ri-book-read-line icon"></i>
                    <span class="label">Registros</span>
                    <i class="ri-arrow-down-s-line arrow-icon"></i>
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
                    <i class="ri-arrow-down-s-line arrow-icon"></i>
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
                    <i class="ri-arrow-down-s-line arrow-icon"></i>
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
    `;

    const sidebarHTML = `
        <aside id="main-sidebar" class="sidebar-container ${defaultCollapsed ? 'collapsed' : ''}">
            <div class="sidebar-header">
                <div class="brand-logo">
                    <img src="/img/icono-nutrifit.webp" alt="NutriFit">
                </div>
                <img class="brand-title" src="/img/Logo_NutriFit_Systems_.webp" alt="NutriFit Systems">
            </div>
            
            ${userMenu}

            <div class="sidebar-footer">
                <button id="sidebar-toggle" class="toggle-btn" title="${isMobile ? 'Cerrar menú' : 'Contraer menú'}">
                    <i class="ri-arrow-left-wide-line"></i>
                    <span class="label">${isMobile ? 'Cerrar menú' : 'Contraer menú'}</span>
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
        <button id="mobile-menu-btn" class="mobile-menu-btn" aria-label="Menú">
            <i class="ri-menu-line"></i>
        </button>
        <div id="mobile-menu-overlay" class="mobile-menu-overlay"></div>
    `;

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
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const overlay = document.getElementById('mobile-menu-overlay');
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');

    function isMobile() { return window.innerWidth <= 768; }

    function closeSidebar() {
        sidebar.classList.add('collapsed');
        if (isMobile()) {
            mobileBtn.innerHTML = '<i class="ri-menu-line"></i>';
            overlay.classList.remove('active');
        }
    }

    function openSidebar() {
        sidebar.classList.remove('collapsed');
        if (isMobile()) {
            mobileBtn.innerHTML = '<i class="ri-close-line"></i>';
            overlay.classList.add('active');
        }
    }

    function toggleSidebar() {
        const collapsed = sidebar.classList.contains('collapsed');
        if (collapsed) {
            openSidebar();
        } else {
            closeSidebar();
        }
        if (!isMobile()) {
            localStorage.setItem('sidebar-collapsed', sidebar.classList.contains('collapsed'));
            window.dispatchEvent(new CustomEvent('sidebarToggle', { detail: { collapsed: sidebar.classList.contains('collapsed') } }));
        }
    }

    // Botón de toggle dentro del sidebar (escritorio)
    if (toggleBtn) toggleBtn.addEventListener('click', toggleSidebar);

    // Botón hamburguesa fuera del sidebar (móvil)
    if (mobileBtn) mobileBtn.addEventListener('click', toggleSidebar);

    // Overlay: cerrar menú al tocar el fondo oscuro
    if (overlay) overlay.addEventListener('click', closeSidebar);

    // En móvil: cerrar sidebar al hacer clic en cualquier enlace del menú
    document.querySelectorAll('.sidebar-menu a').forEach(link => {
        link.addEventListener('click', () => {
            if (isMobile()) closeSidebar();
        });
    });

    // Lógica de submenús: abrir/cerrar grupos hijos
    dropdownToggles.forEach(btn => {
        btn.addEventListener('click', () => {
            const group = btn.closest('.menu-group');
            group.classList.toggle('open');
        });
    });

    // Re-evaluar al cambiar tamaño de ventana
    window.addEventListener('resize', () => {
        if (!isMobile()) {
            overlay.classList.remove('active');
            mobileBtn.innerHTML = '<i class="ri-menu-line"></i>';
            const saved = localStorage.getItem('sidebar-collapsed') === 'true';
            if (saved) {
                sidebar.classList.add('collapsed');
            } else {
                sidebar.classList.remove('collapsed');
            }
        } else {
            // En móvil, si no está colapsado, aseguramos overlay
            if (!sidebar.classList.contains('collapsed')) {
                overlay.classList.add('active');
                mobileBtn.innerHTML = '<i class="ri-close-line"></i>';
            }
        }
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


