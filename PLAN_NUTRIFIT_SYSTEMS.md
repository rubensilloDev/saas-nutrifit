# 🥗 NutriFit Systems — Plan de Desarrollo

## 🎯 1. ¿Qué se quiere hacer en la web?

**NutriFit Systems** es una aplicación web (SaaS) diseñada específicamente para **nutricionistas**. Su propósito principal es servir como un panel de control (Dashboard) donde el profesional pueda gestionar a sus pacientes de forma rápida y visual, sirviendo como una demo interactiva.

### Funcionalidades principales y Páginas:
- **Inicio:** Dashboard principal con una vista general de la actividad y estadísticas rápidas.
- **Registros:** Sección centralizada para el seguimiento, dividida en:
  - **Entrenamiento:** Control de rutinas, ejercicios y progreso físico.
  - **Nutrición:** Gestión de planes alimenticios, dietas y seguimiento nutricional.
- **Mensajes:** Centro de comunicación interactivo:
  - **Chat de IA:** Asistente virtual para resolución de dudas y soporte.
  - **Chat Profesional:** Comunicación directa con el Entrenador o Nutricionista.
- **Perfil:** Gestión de la cuenta y datos del usuario:
  - **Datos Personales:** Nombre de usuario y correo electrónico.
  - **Métricas de Salud:** Registro de peso, altura y otros indicadores biológicos.
  - **Configuración:** Apartado dedicado que redirige a una pestaña de ajustes avanzados para editar toda la información del perfil.
- **Datos Simulados:** La aplicación funcionará **sin backend**. Todos los datos (mock) se cargarán y gestionarán directamente desde la memoria en el frontend.

---

## 🎨 2. Diseño y Paleta de Colores

El diseño general debe transmitir salud, limpieza y profesionalidad.

- **Estilo Visual:** **Minimalista**, limpio y moderno. Uso de espacios amplios para dejar respirar la interfaz y bordes suavemente redondeados.
- **Paleta de Colores:** Basada principalmente en tonos **verdes y blancos**.
  - **Fondo / Superficies:** Blancos y tonos muy claros para mantener la limpieza visual.
  - **Primario (Verdes):** Tonos verdes para los botones, enlaces, acentos y acciones destacadas.
  - **Textos:** Grises oscuros o negros suaves para máxima legibilidad, evitando el negro puro.

---

## 📂 3. Estructura de Carpetas

La arquitectura del proyecto está pensada para ser modular y fácil de mantener, separando los archivos por tecnología y dedicando un espacio a los componentes reutilizables.

```text
SaaS/
│
├── index.html                        # Punto de entrada (Redirige al Dashboard)
│
├── pages/                            # Archivos HTML: Una carpeta por pantalla
│   ├── inicio/
│   │   └── index.html                # Dashboard principal
│   ├── registros/
│   │   ├── entrenamiento.html        # Seguimiento de entrenamientos
│   │   └── nutricion.html            # Seguimiento de nutrición
│   ├── mensajes/
│   │   └── index.html                # Centro de mensajes (IA y Profesional)
│   └── perfil/
│       ├── index.html                # Vista de perfil y datos de salud
│       └── configuracion.html         # Ajustes de cuenta
│
├── css/                              # Archivos de Estilos
│   ├── global.css                    # Estilos globales, variables y tipografías
│   ├── inicio.css                    # Estilos específicos del dashboard
│   ├── registros.css                 # Estilos para entrenamiento y nutrición
│   ├── mensajes.css                  # Estilos del chat
│   └── perfil.css                    # Estilos del perfil y configuración
│
├── js/                               # Lógica de páginas y datos
│   ├── mockData.js                   # Array de datos simulados
│   ├── inicio.js                     # Lógica del dashboard
│   ├── registros.js                  # Lógica de registros
│   ├── mensajes.js                   # Lógica del sistema de mensajes
│   └── perfil.js                     # Lógica del perfil y ajustes
│
└── src/
    └── components/                   # Componentes reutilizables para cualquier página
        ├── sidebar.js                # Menú de navegación lateral
        ├── stat-card.js              # Tarjeta de estadísticas
        ├── patient-card.js           # Tarjeta de resumen de paciente
        └── modal.js                  # Ventanas emergentes genéricas
```

---

## 🛠️ 4. Stack Tecnológico

La aplicación se construirá utilizando las tecnologías base de la web, con la libertad de añadir herramientas extra según sea necesario:

- **HTML:** Para la estructura de todas las páginas y componentes.
- **CSS:** Para todo el diseño visual, maquetación y animaciones.
- **JavaScript:** Para la interactividad, el manejo de los datos (mock) y la inyección de los componentes de la carpeta `src/components/`.
- **Cualquier framework deseado:** Se permite la integración de **cualquier framework o librería** que facilite el trabajo (como Tailwind CSS para utilidades rápidas, Bootstrap, React, Vue, etc.), siempre y cuando se respete la estructura de carpetas propuesta y el diseño minimalista en verde/blanco.

---

## 💻 5. Guía de Estilo de Código y Ejemplos

Para mantener la coherencia y calidad del proyecto, se deben seguir las siguientes directrices:

### Estándares de Codificación:
1. **Limpio y Ordenado:** El código debe ser fácil de leer y seguir una estructura lógica.
2. **Comentarios en Español:** Todos los comentarios deben ser claros, directos y estar en español.
3. **Nomenclatura Semántica:** Las clases e IDs deben estar perfectamente relacionados con su función (ej: `sidebar-nav`, `btn-save-patient`).
4. **CSS Multilínea:** Las propiedades CSS no deben escribirse en la misma línea para mejorar la legibilidad.

### Ejemplo de Implementación (Menú Lateral):

#### HTML (`src/components/sidebar.html`)
```html
<!-- Estructura principal del menú de navegación lateral -->
<aside id="main-sidebar" class="sidebar-container glass">
    <div class="sidebar-header">
        <h2 class="brand-title">NutriFit Systems</h2>
    </div>
    
    <nav class="sidebar-menu">
        <!-- Enlace al Dashboard -->
        <a href="/pages/dashboard/index.html" class="menu-link active" id="link-dashboard">
            <span class="icon">🏠</span>
            <span class="label">Panel de Control</span>
        </a>
        
        <!-- Enlace a la Lista de Pacientes -->
        <a href="/pages/patients/index.html" class="menu-link" id="link-patients">
            <span class="icon">👥</span>
            <span class="label">Gestión de Pacientes</span>
        </a>
    </nav>
</aside>
```

#### CSS (`css/sidebar.css`)
```css
/* Estilos para el contenedor del sidebar */
.sidebar-container {
    width: 280px;
    height: 100vh;
    padding: var(--spacing-lg);
    display: flex;
    flex-direction: column;
    border-right: 1px solid var(--outline-variant);
    position: fixed;
    left: 0;
    top: 0;
}

/* Título de la marca en el encabezado */
.brand-title {
    font-size: 1.5rem;
    margin-bottom: var(--spacing-xl);
    color: var(--primary);
}

/* Contenedor de la navegación */
.sidebar-menu {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
}

/* Estilos base para los enlaces del menú */
.menu-link {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    padding: var(--spacing-md);
    text-decoration: none;
    color: var(--on-surface-variant);
    border-radius: var(--radius-md);
    transition: var(--transition-base);
}

/* Efecto hover para interactividad */
.menu-link:hover {
    background-color: var(--secondary-container);
    color: var(--primary);
}

/* Estado activo para la página actual */
.menu-link.active {
    background-color: var(--primary);
    color: var(--on-primary);
}
```

#### JavaScript (`src/components/sidebar.js`)
```javascript
/**
 * Lógica para gestionar la navegación lateral
 */
document.addEventListener('DOMContentLoaded', () => {
    const sidebarLinks = document.querySelectorAll('.menu-link');

    // Función para actualizar el estado visual del menú
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Eliminar estado activo de otros enlaces
            sidebarLinks.forEach(l => l.classList.remove('active'));
            
            // Aplicar estado activo al enlace seleccionado
            this.classList.add('active');
            
            // Nota: En una app real, esto se manejaría por la URL actual
        });
    });
});
```

