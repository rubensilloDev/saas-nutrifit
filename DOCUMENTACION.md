# NutriFit Systems — Documentación Completa

> **Versión:** 2.0.1  
> **Plataforma:** SaaS de salud y fitness integral  
> **Público objetivo:** Usuarios particulares, nutricionistas y entrenadores personales

---

## Índice

1. [Visión General](#1-visión-general)
2. [Arquitectura del Proyecto](#2-arquitectura-del-proyecto)
3. [Páginas y Funcionalidades](#3-páginas-y-funcionalidades)
   - [3.1. Pantalla de Autenticación (Inicio)](#31-pantalla-de-autenticación-inicio)
   - [3.2. Dashboard (Inicio)](#32-dashboard-inicio)
   - [3.3. Registro de Nutrición](#33-registro-de-nutrición)
   - [3.4. Registro de Entrenamiento](#34-registro-de-entrenamiento)
   - [3.5. Chat de IA](#35-chat-de-ia)
   - [3.6. Chat Profesional](#36-chat-profesional)
   - [3.7. Perfil de Usuario](#37-perfil-de-usuario)
   - [3.8. Configuración](#38-configuración)
4. [Componentes Compartidos](#4-componentes-compartidos)
   - [4.1. Sidebar (Menú Lateral)](#41-sidebar-menú-lateral)
   - [4.2. Loading Screen](#42-loading-screen)
   - [4.3. Notificaciones Toast](#43-notificaciones-toast)
5. [Sistema de Persistencia](#5-sistema-de-persistencia)
6. [Design System](#6-design-system)
7. [Responsive Design](#7-responsive-design)
8. [Futuras Mejoras](#8-futuras-mejoras)

---

## 1. Visión General

NutriFit Systems es una plataforma SaaS integral para la gestión de salud y fitness. Permite a los usuarios registrar su alimentación, hacer seguimiento de entrenamientos, chatear con un asistente de IA o con un entrenador personal real, y visualizar su progreso a través de un dashboard interactivo.

### Roles de Usuario

- **Usuario particular:** Registra comidas, entrenos, visualiza progreso.
- **Nutricionista / Entrenador:** Gestiona clientes, crea planes, hace seguimiento profesional (próximamente).

---

## 2. Arquitectura del Proyecto

```
├── index.html                     # Pantalla de autenticación (Login/Registro)
├── DOCUMENTACION.md               # Este documento
│
├── css/
│   ├── global.css                 # Design tokens, reset, loading screen
│   ├── auth.css                   # Estilos de autenticación + selector de rol
│   ├── sidebar.css                # Sidebar + componentes móviles
│   ├── dashboard.css              # Dashboard principal
│   ├── profile.css                # Perfil + configuración
│   ├── nutrition.css              # Registro de nutrición
│   ├── training.css               # Registro de entrenamiento
│   ├── chat.css                   # Chat de IA
│   └── profesional.css            # Chat con entrenador
│
├── pages/
│   ├── dashboard/index.html       # Página de inicio principal
│   ├── registros/
│   │   ├── nutricion.html         # Registro detallado de alimentos
│   │   └── entrenamiento.html     # Registro de ejercicios y rutinas
│   ├── mensajes/
│   │   ├── chat-ia.html           # Asistente NutriFit AI
│   │   └── profesional.html       # Chat con entrenador personal
│   └── perfil/
│       ├── index.html             # Datos personales, objetivos, foto
│       └── configuracion.html     # Ajustes de la aplicación
│
├── src/
│   ├── components/
│   │   └── sidebar.js             # Componente sidebar (inyección en todas las páginas)
│   └── pages/
│       ├── nutrition.js           # Lógica de registro de alimentos
│       └── training.js            # Lógica de registro de entrenamientos
│
├── img/
│   ├── icono-nutrifit.webp        # Icono de la marca
│   └── Logo_NutriFit_Systems_.webp # Logotipo completo (icono + texto)
│
└── SKILLS/.agents/skills/         # Skills para asistentes de IA
```

### Tecnologías

- **HTML5** semántico
- **CSS3** con variables personalizadas (Design Tokens), Flexbox y Grid
- **JavaScript** vanilla (sin frameworks)
- **Remix Icon** para iconografía
- **Google Fonts** (Lexend + Nunito Sans)
- **localStorage** para persistencia de datos

---

## 3. Páginas y Funcionalidades

### 3.1. Pantalla de Autenticación (Inicio)

**Ruta:** `/index.html`

Pantalla de bienvenida con sistema de tabs (CSS puro) para Iniciar Sesión / Registrarse.

**Campos:**
- **Login:** Correo electrónico, Contraseña
- **Registro:** Nombre completo, Correo, Contraseña, Confirmar contraseña

**Flujo de registro:**
1. El usuario completa el formulario de registro
2. Aparece un modal de selección de rol con dos opciones:
   - **Nutricionista / Entrenador Personal** — Gestión profesional de clientes
   - **Usuario** — Seguimiento personal de comidas y entrenos
3. Al seleccionar un rol, se guarda en `localStorage` y redirige al Dashboard

**Elementos adicionales:**
- Botones de inicio social (Google, Apple) — demo visual
- Enlace "Entrar sin registrarse" — acceso directo al dashboard
- Fondos decorativos con círculos animados

---

### 3.2. Dashboard (Inicio)

**Ruta:** `/pages/dashboard/index.html`

Página principal después de iniciar sesión. Muestra un resumen completo del estado actual del usuario.

**Secciones:**

| Sección | Descripción |
|---------|-------------|
| **Resumen de Calorías** | Círculo de progreso SVG con calorías consumidas vs. meta diaria. Desglose de macros (proteína, carbohidratos, grasas) con barras de progreso individuales. |
| **Comidas de Hoy** | Lista dinámica de alimentos registrados, sincronizada con la página de Registro Nutricional mediante `localStorage`. |
| **Agua** | Widget con efecto de ola animada que muestra el consumo de agua y la meta diaria. |
| **Registrar Entrenamiento** | Botón de acceso directo a la página de registro de entrenamientos. |
| **Último Entrenamiento** | Tabla con los ejercicios de la última sesión registrada (series, repeticiones, carga, descanso, intensidad RIR). |
| **Historial Semanal** | Barras de progreso con el consumo calórico de los últimos días. |

**Sincronización:**
- Los datos de nutrición se actualizan automáticamente al volver a la página (evento `visibilitychange`).
- Lee de `localStorage` las claves `nutrifit-meals`, `nutrifit-water` y `nutrifit-nutrition`.

---

### 3.3. Registro de Nutrición

**Ruta:** `/pages/registros/nutricion.html`

Registro detallado de alimentos con base de datos integrada.

**Funcionalidades:**
- **Barra de estadísticas rápidas:** Calorías, proteína, agua con progreso visual.
- **Selector de fecha:** Navegación entre días con flechas.
- **4 categorías de comidas:** Desayuno, Almuerzo, Cena, Snacks.
- **Añadir alimentos:** Modal de búsqueda con base de datos de alimentos (pollo, arroz, aguacate, huevos, salmón, batata, avena, brócoli, quinoa, yogur griego, plátano, almendras, etc.).
- **Selector de cantidad:** Al seleccionar un alimento, se abre un selector con la cantidad en gramos y vista previa de macros (kcal, proteínas, carbohidratos, grasas, fibra, sodio).
- **Toasts de notificación:** Confirmaciones visuales al añadir/eliminar alimentos y al ajustar agua.
- **Control de agua:** Botones +250ml / -250ml con actualización en tiempo real.
- **Persistencia:** Guarda en `localStorage` las claves `nutrifit-meals` y `nutrifit-water`.

**Base de datos de alimentos (14+):**
Pollo, Arroz blanco, Aguacate, Huevos, Salmón, Batata, Avena, Brócoli, Quinoa, Yogur griego, Plátano, Almendras, Atún, Espinacas, Aceite de oliva.

---

### 3.4. Registro de Entrenamiento

**Ruta:** `/pages/registros/entrenamiento.html`

Gestor completo de rutinas y sesiones de entrenamiento.

**Funcionalidades:**
- **Estadísticas rápidas:** Racha semanal, PRs batidos, tiempo total, series totales.
- **Pestañas de rutinas:** Push, Pull, Piernas, Full Body con ejercicios predefinidos.
- **Constructor de ejercicios:** Añade ejercicios con nombre, series, repeticiones y RIR.
- **Temporizador integrado:** Cronómetro para controlar tiempos de descanso entre series.
- **Historial de entrenamientos:** Registro de sesiones completadas con fecha, ejercicios y tiempo total.
- **Toasts de notificación:** Confirmaciones al completar rutinas.

**Rutinas predefinidas:**
- **Push:** Press banca, Press inclinado, Press militar, Fondos, Aperturas, Extensiones tríceps.
- **Pull:** Dominadas, Remo con barra, Face pulls, Curl bíceps, Pájaros.
- **Piernas:** Sentadilla, Prensa, Curl femoral, Extensiones cuádriceps, Gemelos.
- **Full Body:** Peso muerto, Press banca, Dominadas, Sentadilla, Press militar.

---

### 3.5. Chat de IA

**Ruta:** `/pages/mensajes/chat-ia.html`

Asistente virtual NutriFit AI con respuestas automáticas contextuales.

**Funcionalidades:**
- **Interfaz de chat:** Burbujas tipo WhatsApp con diseño glassmorphism.
- **Mensajes de bienvenida:** Saludo inicial del coach AI con opciones de consulta.
- **Indicador de escritura:** Animación de "Escribiendo..." mientras el AI procesa.
- **Respuestas contextuales:** 5 respuestas predefinidas sobre nutrición, entrenamiento e hidratación.
- **Limpiar conversación:** Botón para reiniciar el chat.
- **Auto-resize del textarea:** El campo de entrada se expande automáticamente.

---

### 3.6. Chat Profesional

**Ruta:** `/pages/mensajes/profesional.html`

Canal de comunicación directa con el entrenador personal.

**Funcionalidades:**
- **Perfil del entrenador:** Foto, nombre, certificación, rating y experiencia.
- **Panel lateral:**
  - **Próxima Sesión:** Fecha y botón para unirse a videollamada.
  - **Plan Actual:** Nombre del plan, progreso semanal con barra.
  - **Recursos:** Enlaces a PDFs de dieta y rutina.
  - **Últimos Resultados:** Estadísticas de peso, grasa corporal y músculo.
- **Burbujas de mensaje:** Diferenciadas (entrenador vs. usuario) con marcas de tiempo.
- **Respuestas automáticas:** El entrenador responde con 6 mensajes predefinidos.
- **Input con adjuntos:** Botón de adjuntar archivos (demo visual).
- **Sidebar responsive:** Se oculta en pantallas menores a 1024px.

---

### 3.7. Perfil de Usuario

**Ruta:** `/pages/perfil/index.html`

Gestión de datos personales, objetivos y estadísticas.

**Secciones:**

| Sección | Descripción |
|---------|-------------|
| **Avatar** | Foto de perfil con cámara para cambiar la imagen (FileReader + localStorage). |
| **Datos Personales** | Nombre, correo (no editable), peso, altura, fecha de nacimiento. |
| **Mis Objetivos** | Calorías diarias, proteína, carbohidratos, grasas y agua. **Todos editables** con auto-cálculo: al cambiar calorías se recalculan macros (30% P/4, 40% C/4, 30% G/9), y viceversa. |
| **Estadísticas** | Días de racha, adherencia, entrenos del mes, kcal promedio. |
| **Cerrar sesión** | Redirige a la pantalla de autenticación. |

**Persistencia:**
- `nutrifit-goals`: Objetivos de macros y agua
- `nutrifit-avatar`: Foto de perfil en base64

---

### 3.8. Configuración

**Ruta:** `/pages/perfil/configuracion.html`

Ajustes generales de la aplicación organizados por categorías.

**Secciones:**

| Categoría | Ajustes |
|-----------|---------|
| **Perfil** | Nombre completo, correo, teléfono, fecha de nacimiento |
| **Notificaciones** | Toggles para correo, push, SMS, recordatorio de comidas |
| **Privacidad y Seguridad** | Cambiar contraseña, 2FA, perfil público, eliminar datos |
| **Preferencias de Nutrición** | Tipo de dieta (equilibrada, low-carb, keto, vegana, mediterránea), unidad de peso, recordatorio de agua, sugerencias de recetas |
| **Preferencias de Entrenamiento** | Días por semana, duración ideal, recordatorio de entreno, auto-descanso |
| **Apariencia** | Tema (claro/oscuro/sistema), tamaño de fuente |
| **Información de la App** | Versión, última actualización, plan actual, soporte |

---

## 4. Componentes Compartidos

### 4.1. Sidebar (Menú Lateral)

**Script:** `/src/components/sidebar.js`  
**Estilos:** `/css/sidebar.css`

Menú de navegación lateral que se inyecta automáticamente en todas las páginas.

**Características:**
- **Inyección dinámica:** Se inserta en el elemento `#sidebar-target` de cada página.
- **Estados:** Expandido (280px) y colapsado (80px, solo iconos).
- **Persistencia:** El estado de colapso se guarda en `localStorage`.
- **Submenús desplegables:** Registros, Mensajes y Perfil con flechas animadas.
- **Enlace activo:** Detecta la URL actual y resalta el elemento correspondiente.
- **Perfil de usuario:** Avatar, nombre y correo en el footer del sidebar.
- **Modo oscuro de colapso:** Al colapsar, solo se ven los iconos y el logo se oculta.

**Menú de navegación:**
| Icono | Label | Enlace |
|-------|-------|--------|
| 🏠 | Inicio | `/pages/dashboard/index.html` |
| 📖 | Registros → Entrenamiento | `/pages/registros/entrenamiento.html` |
| | Registros → Nutrición | `/pages/registros/nutricion.html` |
| 💬 | Mensajes → Chat de IA | `/pages/mensajes/chat-ia.html` |
| | Mensajes → Chat Profesional | `/pages/mensajes/profesional.html` |
| 👤 | Perfil → Mis Datos | `/pages/perfil/index.html` |
| | Perfil → Configuración | `/pages/perfil/configuracion.html` |

**Comportamiento responsive (móvil):**
- Se oculta fuera de la pantalla (`translateX(-100%)`)
- Botón hamburguesa fijo en la esquina superior izquierda
- Overlay oscuro con blur al abrir
- Al hacer clic en un enlace, se cierra automáticamente

---

### 4.2. Loading Screen

**Script:** `/src/components/sidebar.js` (IIFE al inicio)  
**Estilos:** `/css/global.css`

Pantalla de carga premium que aparece al navegar entre páginas.

**Comportamiento:**
- Se inyecta inmediatamente al cargar el script (antes del DOM)
- Muestra el icono de NutriFit con animación de pulso + spinner giratorio
- Al estar el DOM listo, fade out y se elimina tras 700ms
- Al hacer clic en cualquier enlace de navegación, se muestra de nuevo antes de la redirección

---

### 4.3. Notificaciones Toast

**Estilos:** `/css/nutrition.css`, `/css/training.css`

Sistema de notificaciones emergentes para confirmar acciones.

**Características:**
- Posición: esquina inferior derecha
- Animación: slide in desde la derecha, slide out al desaparecer
- Borde izquierdo verde (color primario)
- Icono + texto descriptivo
- Auto-destrucción tras 2.5 segundos

---

## 5. Sistema de Persistencia

Toda la aplicación utiliza `localStorage` del navegador para mantener los datos entre sesiones.

| Clave | Contenido | Origen |
|-------|-----------|--------|
| `nutrifit-meals` | Objeto con arrays de alimentos por comida (breakfast, lunch, dinner, snacks) | nutrition.js |
| `nutrifit-water` | Objeto `{current, goal}` con consumo de agua en ml | nutrition.js |
| `nutrifit-nutrition` | Resumen de kcal, macros, agua calculado | nutrition.js (recalculateAll) |
| `nutrifit-goals` | Calorías y macros objetivo | perfil/index.html |
| `nutrifit-avatar` | Foto de perfil en base64 | perfil/index.html |
| `nutrifit-role` | Rol seleccionado (profesional/usuario) | index.html |
| `sidebar-collapsed` | Estado del sidebar (true/false) | sidebar.js |

---

## 6. Design System

### Paleta de Colores

| Token | Valor | Uso |
|-------|-------|-----|
| `--primary` | `#0d631b` | Verde corporativo, botones, acentos |
| `--primary-container` | `#2e7d32` | Fondos de elementos destacados |
| `--background` | `#f7fbf0` | Fondo general de la app |
| `--surface` | `#f7fbf0` | Superficie de tarjetas |
| `--on-surface` | `#181d17` | Texto sobre superficies |
| `--outline-variant` | `#bfcaba` | Bordes y separadores |

### Tipografía

- **Títulos:** Lexend (sans-serif geométrica)
- **Cuerpo:** Nunito Sans (sans-serif legible)

### Iconografía

- **Remix Icon** v4.2.0 — más de 2000 iconos de código abierto

### Efectos Visuales

- **Glassmorphism:** Fondos semitransparentes con blur
- **Gradientes:** Lineales y radiales para profundidad
- **Sombras suaves:** Elevación tipo Material Design 3
- **Animaciones:** Transiciones CSS en hover, entradas con fade/scale

---

## 7. Responsive Design

La plataforma está optimizada para tres rangos de pantalla:

| Rango | Comportamiento |
|-------|----------------|
| > 1024px (Desktop) | Sidebar fijo, grid de 12 columnas, layout completo |
| 768px - 1024px (Tablet) | Grid simplificado, sidebar overlay, elementos más compactos |
| < 768px (Móvil) | Sidebar oculto con botón hamburguesa, todo en una columna, tamaños reducidos |

**Media queries principales:**
- `@media (max-width: 768px)` — Móvil (sidebar overlay, layout 1 columna)
- `@media (max-width: 1024px)` — Tablet y móvil grande

---

## 8. Futuras Mejoras

- [ ] **Autenticación real** con backend (JWT, OAuth)
- [ ] **Panel de entrenador** con gestión de clientes
- [ ] **Gráficos interactivos** de progreso (Chart.js)
- [ ] **Exportación de datos** (PDF, CSV)
- [ ] **Modo oscuro** completo
- [ ] **Recordatorios push** vía Service Workers
- [ ] **Integración con APIs** de alimentos (base de datos externa)
- [ ] **Múltiples idiomas** (i18n)
- [ ] **Subida de fotos de progreso** con galería
- [ ] **Planes de pago** (Freemium / Premium)
