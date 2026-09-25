# EFP Platform - Versión HTML, Bootstrap y JavaScript

Versión completa y autónoma en **HTML5**, **Bootstrap 5.3** y **JavaScript Vanilla (ES6+)** de la plataforma corporativa para cálculo y contabilidad de **Huella de Carbono** (Alcance 1, 2 y 3) y **Balance Hídrico** (ISO 14046 / ISO 14064).

---

## 🚀 Cómo Ejecutar la Aplicación

No requiere instalación de Node.js, compilación ni dependencias pesadas:

1. **Opción Directa (Doble Clic):**
   - Navegue a la carpeta `html/` y haga doble clic en `index.html` para abrirlo en Google Chrome, Microsoft Edge, Mozilla Firefox o Safari.

2. **Opción Servidor Local (Recomendado para testing):**
   ```bash
   # Con Node / npx:
   npx serve html

   # O con Python:
   python -m http.server 8080 --directory html
   ```
   Luego abra su navegador en `http://localhost:8080` (o el puerto indicado).

---

## 🔑 Credenciales de Acceso por Defecto

| Rol / Persona | Usuario / UID | Contraseña | Perfil y Permisos |
| :--- | :--- | :--- | :--- |
| **Administrador General (Admin)** | `admin` (UID: `123123`) | `123123` | **ADMIN_TI** • Acceso total a todos los módulos y gestión de Supabase. |
| **Auditora Externa Líder** | `elena.v` (UID: `789456`) | `123123` | **AUDITOR_EXTERNO** • Revisión HSEQ, verificación ISO 14064-3 y dictámenes. |
| **Jefe de Planta Quilicura** | `carlos.m` (UID: `456123`) | `123123` | **RESPONSABLE_SEDE** • Carga masiva de telemetría y subsanación operativa. |
| **Directora Corporativa ESG** | `sofia.r` (UID: `987654`) | `123123` | **LIDER_SOSTENIBILIDAD** • Reportes ejecutivos consolidados e indicadores. |

> **Tip:** En la pantalla de Login puede pulsar el botón **"Auto-llenar Demo"** para cargar de inmediato las credenciales de administrador.

---

## 📦 Estructura del Directorio `html/`

```text
html/
│
├── index.html              # Aplicación Web SPA integral con navegación multi-vista y modales
├── README.md               # Este archivo de documentación
│
├── css/
│   ├── tailwind.css        # Bundle CSS compilado de la aplicación React original (Tailwind v4)
│   └── styles.css          # Estilos complementarios, barra lateral fija y glassmorphism
│
└── js/
    ├── data.js             # Modelos de datos maestros, sedes, factores, períodos y script DDL SQL
    └── app.js              # Controlador principal, enrutador SPA, visualizaciones y eventos
```

---

## 🌟 Módulos y Funcionalidades Incluidas

1. **Solución / Landing Corporativa (`#landing`)**:
   - Hero interactivo con efectos de brillo ambiental y badges de certificación ISO 14064-1 & ISO 14046.
   - Resumen ejecutivo de grado auditoría y los 4 pilares tecnológicos.
   - Formulario interactivo para agendar demostraciones técnicas.

2. **Autenticación y Control de Acceso (`#login`)**:
   - Formulario de login con validación de credenciales.
   - Botón de auto-completado de credenciales del Administrador TI.
   - Selector de sede operativa asignada y verificación MFA.

3. **Panel de Control Ejecutivo (`#dashboard`)**:
   - 4 tarjetas Bento KPI: Huella de Carbono Total, Alcance 1 Directo, Alcance 2 Indirecto y Consumo de Agua.
   - Gráfico de dona SVG interactivo de emisiones con subcategorías (Combustibles fijos, Flota móvil, Refrigerantes, Electricidad).
   - Balance Hídrico trimestral (Q1, Q2, Q3) con conservación de masas (Captación, Consumo, Descarga, Pérdidas).
   - Indicador de estrés hídrico de cuenca WRI Aqueduct 4.0.
   - Trazabilidad criptográfica SHA-256 y lista de evidencias con verificación ClamAV.
   - **Descarga de Resumen Ejecutivo Oficial en PDF/TXT** con efecto de confeti.

4. **Carga Masiva (`#ingesta`)**:
   - Zona de arrastrar y soltar (Drag and Drop) para archivos `.csv` y `.xlsx`.
   - Simulación de escaneo antivirus en tiempo real con ClamAV Daemon.
   - Carga de plantillas de prueba preconfiguradas (Facturas de gas, Telemetría caudalímetros, Certificados UPME).

5. **Subsanación de Inconsistencias (`#subsanacion`)**:
   - Tabla interactiva para corregir filas rechazadas en la ingesta (unidades no homologadas, outliers, desbalances).
   - Recálculo determinista en tiempo real y sellado al Ledger inmutable.

6. **Revisión y Enmienda Forense (`#enmienda`)**:
   - Procedimiento formal de Enmienda V2 bajo lineamientos de la norma ISO 14064-3.
   - Inspección del bloque sellado original (Hash SHA-256 copiable).
   - Justificación técnica obligatoria (mínimo 40 caracteres) y certificación del Oficial HSEQ.

7. **Forense / Alertas de Integridad (`#notificaciones`)**:
   - Registro cronológico de auditoría forense clasificado por severidad (Crítica, Advertencia, Info).
   - Búsqueda en tiempo real y filtros rápidos.
   - Exportación de logs en formato `.JSON`.

8. **Gestión de Usuarios RBAC (`#usuarios`)**:
   - Matriz de usuarios con avatares, roles, sedes asignadas y estado MFA.
   - Botón de cambio instantáneo de perfil ("Usar Perfil").

9. **Monitoreo de Sedes (`#sedes`)**:
   - Expedientes de instalaciones industriales y administrativas en Chile, Colombia y México.
   - Modal detallado con capacidad operativa, cuotas de carbono y balance de agua.

10. **Catálogo de Factores de Emisión (`#factores`)**:
    - Catálogo homologado (IPCC AR6, UPME Colombia, DEFRA, SEN Chile).

11. **Períodos Contables (`#periodos`)**:
    - Libro mayor con estado de sellado inmutable y fecha de cierre oficial.

12. **Panel de Administración Global (`#admin`)**:
    - Monitor de latencia del backend Supabase y recuento de registros.
    - Modal de configuración de conexión a Supabase (URL, Anon Key, Test de latencia y visor del script DDL SQL).

---

## 🛠️ Tecnologías Empleadas

- **HTML5 Semántico**: Accesibilidad, estructura modular y optimización SEO.
- **Bootstrap 5.3.3**: Grid responsivo, componentes y utilidades.
- **Bootstrap Icons 1.11.3**: Iconografía vectorial integrada.
- **Vanilla JavaScript (ES6+)**: Enrutamiento SPA, manipulación del DOM y persistencia `localStorage`.
- **Canvas-Confetti**: Efectos de celebración al completar acciones críticas de auditoría.
- **Google Fonts**: Plus Jakarta Sans (encabezados), Inter (lectura fluida), JetBrains Mono (auditoría técnica).
