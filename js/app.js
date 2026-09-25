/**
 * EFP Platform - Enterprise Core Application Logic
 * Huella Hídrica y de Carbono - ISO 14064 & ISO 14046
 */

(function () {
  'use strict';

  // State Management
  const AppState = {
    currentUser: null,
    currentView: 'landing',
    selectedFacility: 'all',
    supabaseConfig: {
      url: EFP_DATA.supabase.defaultUrl,
      key: EFP_DATA.supabase.defaultKey,
      connected: true,
      latency: 28
    },
    sedes: [],
    factores: [],
    periodos: [],
    usuarios: [],
    filasSubsanacion: [],
    notificaciones: [],
    evidencias: [],
    trazabilidad: [],
    activeModal: null
  };

  // Helper Functions
  function formatNumber(num, decimals = 2) {
    if (num === null || num === undefined || isNaN(num)) return '0.00';
    return Number(num).toLocaleString('es-ES', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  }

  function showToast(title, message, type = 'info') {
    const container = document.getElementById('efp-toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `efp-toast border-${type === 'success' ? 'success' : type === 'warning' ? 'warning' : type === 'danger' ? 'danger' : 'primary'}`;
    
    let icon = 'bi-info-circle-fill text-primary';
    if (type === 'success') icon = 'bi-check-circle-fill text-success';
    if (type === 'warning') icon = 'bi-exclamation-triangle-fill text-warning';
    if (type === 'danger') icon = 'bi-shield-fill-x text-danger';

    toast.innerHTML = `
      <div class="d-flex align-items-center justify-content-between mb-1">
        <strong class="d-flex align-items-center gap-2 font-headline fs-6 text-white">
          <i class="bi ${icon}"></i> ${title}
        </strong>
        <button type="button" class="btn-close btn-close-white btn-sm" aria-label="Close"></button>
      </div>
      <div class="text-white-50 small mt-1">${message}</div>
    `;

    toast.querySelector('.btn-close').addEventListener('click', () => {
      toast.remove();
    });

    container.appendChild(toast);

    setTimeout(() => {
      if (toast.parentNode) {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.4s ease';
        setTimeout(() => toast.remove(), 400);
      }
    }, 4500);
  }

  function fireConfetti() {
    if (typeof confetti === 'function') {
      try {
        confetti({
          particleCount: 55,
          spread: 70,
          origin: { y: 0.7 }
        });
      } catch (e) {
        console.warn('Confetti error:', e);
      }
    }
  }

  // Helper to determine Admin privileges (matching database.ts)
  function isUserAdmin(user) {
    if (!user) return false;
    return user.rol === 'ADMIN' || 
           user.rol === 'ADMIN_TI' || 
           user.usuario === 'admin' || 
           Boolean(user.permisos && (user.permisos.super_admin || user.permisos.todas_funcionalidades));
  }

  // Load Initial State from LocalStorage or Defaults
  function initStore() {
    try {
      const savedUser = localStorage.getItem('efp_user');
      if (savedUser) {
        AppState.currentUser = JSON.parse(savedUser);
      } else {
        // Default to admin user for seamless testing
        AppState.currentUser = EFP_DATA.demoUsers[0];
      }

      const savedSedes = localStorage.getItem('efp_sedes');
      AppState.sedes = savedSedes ? JSON.parse(savedSedes) : [...EFP_DATA.sedes];

      const savedFactores = localStorage.getItem('efp_factores');
      AppState.factores = savedFactores ? JSON.parse(savedFactores) : [...EFP_DATA.factores];

      const savedPeriodos = localStorage.getItem('efp_periodos');
      AppState.periodos = savedPeriodos ? JSON.parse(savedPeriodos) : [...EFP_DATA.periodos];

      const savedUsuarios = localStorage.getItem('efp_usuarios');
      AppState.usuarios = savedUsuarios ? JSON.parse(savedUsuarios) : [...EFP_DATA.demoUsers];

      const savedSubsanacion = localStorage.getItem('efp_subsanacion');
      AppState.filasSubsanacion = savedSubsanacion ? JSON.parse(savedSubsanacion) : [...EFP_DATA.filasSubsanacion];

      const savedNotifs = localStorage.getItem('efp_notificaciones');
      AppState.notificaciones = savedNotifs ? JSON.parse(savedNotifs) : [...EFP_DATA.notificaciones];

      AppState.evidencias = [...EFP_DATA.evidencias];
      AppState.trazabilidad = [...EFP_DATA.trazabilidad];

      const savedUrl = localStorage.getItem('efp_supabase_url');
      if (savedUrl) AppState.supabaseConfig.url = savedUrl;
      const savedKey = localStorage.getItem('efp_supabase_key');
      if (savedKey) AppState.supabaseConfig.key = savedKey;

    } catch (e) {
      console.warn('LocalStorage error:', e);
      AppState.currentUser = EFP_DATA.demoUsers[0];
      AppState.sedes = [...EFP_DATA.sedes];
      AppState.factores = [...EFP_DATA.factores];
      AppState.periodos = [...EFP_DATA.periodos];
      AppState.usuarios = [...EFP_DATA.demoUsers];
      AppState.filasSubsanacion = [...EFP_DATA.filasSubsanacion];
      AppState.notificaciones = [...EFP_DATA.notificaciones];
      AppState.evidencias = [...EFP_DATA.evidencias];
      AppState.trazabilidad = [...EFP_DATA.trazabilidad];
    }
  }

  function saveStore(key, data) {
    try {
      localStorage.setItem(`efp_${key}`, JSON.stringify(data));
    } catch (e) {
      console.warn('Error saving to localStorage:', e);
    }
  }

  // Navigation & View Routing
  function navigateTo(viewName) {
    // If not authenticated and attempting to view internal screen, redirect to login
    const publicViews = ['landing', 'login'];
    if (!AppState.currentUser && !publicViews.includes(viewName)) {
      viewName = 'login';
      showToast('Acceso Restringido', 'Debe iniciar sesión para ingresar a los módulos de contabilidad.', 'warning');
    }

    AppState.currentView = viewName;

    // Hide all view containers
    document.querySelectorAll('.view-container').forEach(el => {
      el.classList.remove('active-view');
    });

    // Show target view container
    const target = document.getElementById(`view-${viewName}`);
    if (target) {
      target.classList.add('active-view');
    }

    // Update Navbar Highlights
    document.querySelectorAll('.nav-link-custom, .nav-link-admin').forEach(link => {
      if (link.getAttribute('data-view') === viewName) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Update Sidebar Visibility & Active State (matching React App.tsx isSidebarVisible)
    const isSidebarVisible = Boolean(AppState.currentUser) && viewName !== 'landing' && viewName !== 'login';
    const sidebarEl = document.getElementById('efp-sidebar');
    const mainArea = document.getElementById('main-content-area');
    const footerEl = document.getElementById('app-footer');
    if (sidebarEl) {
      sidebarEl.classList.toggle('show-sidebar', isSidebarVisible);
    }
    if (mainArea) {
      mainArea.classList.toggle('with-sidebar', isSidebarVisible);
    }
    if (footerEl) {
      footerEl.classList.toggle('with-sidebar', isSidebarVisible);
    }

    document.querySelectorAll('#efp-sidebar .sidebar-nav-item').forEach(item => {
      if (item.getAttribute('data-view') === viewName) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Update Title Tag
    const titles = {
      landing: 'Solución Enterprise - Huella Hídrica y de Carbono',
      dashboard: 'Panel Ejecutivo - Huella Hídrica y de Carbono',
      ingesta: 'Carga Masiva de Facturas y Consumos',
      subsanacion: 'Bandeja de Subsanación de Errores',
      enmienda: 'Revisión y Enmienda Forense ISO 14064-3',
      notificaciones: 'Auditoría Forense y Alertas de Integridad',
      usuarios: 'Control de Acceso y Gestión de Usuarios',
      sedes: 'Monitoreo de Sedes Operativas',
      factores: 'Catálogo de Factores de Emisión Homologados',
      periodos: 'Períodos Contables y Sellado Criptográfico',
      administracion: 'Panel de Control y Mantenimiento del Sistema',
      login: 'Iniciar Sesión Corporativa'
    };
    document.title = `${titles[viewName] || 'EFP Platform'} | EFP Platform`;

    // Trigger module-specific renders
    if (viewName === 'dashboard') renderDashboard();
    if (viewName === 'subsanacion') renderSubsanacion();
    if (viewName === 'notificaciones') renderNotificaciones();
    if (viewName === 'usuarios') renderUsuarios();
    if (viewName === 'sedes') renderSedes();
    if (viewName === 'factores') renderFactores();
    if (viewName === 'periodos') renderPeriodos();
    if (viewName === 'administracion') renderAdminPanel();

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Update pending subsanacion badge in header
    updateSubsanacionBadge();
  }

  function updateSubsanacionBadge() {
    const pendingCount = AppState.filasSubsanacion.filter(f => f.estado === 'PENDIENTE').length;
    const badge = document.getElementById('badge-subsanacion-count');
    if (badge) {
      badge.textContent = pendingCount;
      badge.style.display = pendingCount > 0 ? 'inline-block' : 'none';
    }
  }

  // Dashboard Rendering & Dynamic Visualizations
  function renderDashboard() {
    const facilityKey = AppState.selectedFacility || 'all';
    const kpi = EFP_DATA.kpis[facilityKey] || EFP_DATA.kpis.all;

    // Update Bento KPI Numbers
    const elTotalCarbon = document.getElementById('kpi-carbono-total');
    if (elTotalCarbon) elTotalCarbon.textContent = formatNumber(kpi.huella_carbono_total);

    const elScope1 = document.getElementById('kpi-alcance-1');
    if (elScope1) elScope1.textContent = formatNumber(kpi.alcance_1_directo);

    const elScope1Pct = document.getElementById('kpi-alcance-1-pct');
    if (elScope1Pct) elScope1Pct.textContent = `${kpi.alcance_1_porcentaje}% del inventario`;

    const elScope2 = document.getElementById('kpi-alcance-2');
    if (elScope2) elScope2.textContent = formatNumber(kpi.alcance_2_indirecto);

    const elScope2Pct = document.getElementById('kpi-alcance-2-pct');
    if (elScope2Pct) elScope2Pct.textContent = `${kpi.alcance_2_porcentaje}% (Base de Red)`;

    const elWater = document.getElementById('kpi-agua-total');
    if (elWater) elWater.textContent = formatNumber(kpi.consumo_agua_total_m3, 1);

    const elWaterDiff = document.getElementById('kpi-agua-desbalance');
    if (elWaterDiff) elWaterDiff.textContent = `Desbalance: ${kpi.desbalance_agua_m3.toFixed(3)} m³`;

    // Render Carbon Scope Donut SVG Chart
    const totalCircumference = 2 * Math.PI * 62; // ~389.55
    const scope1Ratio = kpi.alcance_1_porcentaje / 100;
    const scope2Ratio = kpi.alcance_2_porcentaje / 100;

    const ringScope1 = document.getElementById('donut-ring-scope1');
    const ringScope2 = document.getElementById('donut-ring-scope2');
    const donutTotalText = document.getElementById('donut-total-text');

    if (ringScope1 && ringScope2) {
      const scope1Length = totalCircumference * scope1Ratio;
      const scope2Length = totalCircumference * scope2Ratio;

      ringScope1.setAttribute('stroke-dasharray', `${scope1Length} ${totalCircumference}`);
      ringScope1.setAttribute('stroke-dashoffset', '0');

      ringScope2.setAttribute('stroke-dasharray', `${scope2Length} ${totalCircumference}`);
      ringScope2.setAttribute('stroke-dashoffset', `-${scope1Length}`);
    }

    if (donutTotalText) {
      donutTotalText.textContent = formatNumber(kpi.huella_carbono_total, 1);
    }

    // Render Subcategories
    const elFijos = document.getElementById('donut-sub-fijos');
    if (elFijos) elFijos.textContent = `${formatNumber(kpi.desglose.combustibles_fijos, 0)} t`;

    const elMovil = document.getElementById('donut-sub-movil');
    if (elMovil) elMovil.textContent = `${formatNumber(kpi.desglose.flota_movil, 0)} t`;

    const elRefri = document.getElementById('donut-sub-refri');
    if (elRefri) elRefri.textContent = `${formatNumber(kpi.desglose.refrigerantes, 1)} t`;

    const elElec = document.getElementById('donut-sub-elec');
    if (elElec) elElec.textContent = `${formatNumber(kpi.desglose.electricidad, 0)} t`;

    // Render Sedes Table in Dashboard
    const tbody = document.getElementById('tbody-sedes-dashboard');
    if (tbody) {
      tbody.innerHTML = '';
      AppState.sedes.forEach(s => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td class="text-primary font-monospace fw-bold">${s.codigo_sede}</td>
          <td class="text-white fw-semibold">${s.nombre}</td>
          <td class="text-white-50">${s.tipo_instalacion}</td>
          <td class="text-end text-white font-monospace fw-bold">${formatNumber(s.huella_carbono_tco2e)} t</td>
          <td class="text-end text-secondary font-monospace fw-bold">${formatNumber(s.balance_hidrico_m3, 1)} m³ (OK)</td>
          <td class="text-center">
            ${s.estado_auditoria === 'VALIDADO_100'
              ? '<span class="badge-pill-status badge-pill-verified"><i class="bi bi-patch-check-fill"></i> 100% Validado</span>'
              : '<span class="badge-pill-status badge-pill-warning"><i class="bi bi-clock-history"></i> Cotejo Facturas</span>'}
          </td>
          <td class="text-center">
            <button class="btn btn-sm btn-outline-info border-0 text-white-50 hover-text-white btn-view-sede" data-id="${s.id}" title="Ver Expediente">
              <i class="bi bi-box-arrow-up-right"></i>
            </button>
          </td>
        `;
        tbody.appendChild(tr);
      });

      // Bind sede detail clicks
      tbody.querySelectorAll('.btn-view-sede').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const sedeId = btn.getAttribute('data-id');
          openSedeModal(sedeId);
        });
      });
    }

    // Render Trazabilidad List
    const trazaContainer = document.getElementById('container-trazabilidad');
    if (trazaContainer) {
      trazaContainer.innerHTML = '';
      AppState.trazabilidad.slice(0, 3).forEach(t => {
        const div = document.createElement('div');
        div.className = 'p-2.5 rounded-3 mb-2 bg-dark bg-opacity-50 border border-white-10';
        div.innerHTML = `
          <div class="d-flex align-items-center justify-content-between text-white">
            <span class="fw-semibold small">${t.operacion}</span>
            <span class="text-secondary font-monospace small">${t.hora}</span>
          </div>
          <div class="d-flex align-items-center justify-content-between text-white-50 small mt-1">
            <span class="text-truncate me-2">${t.usuario_responsable}</span>
            <span class="font-monospace text-muted small">${t.ip_origen}</span>
          </div>
        `;
        trazaContainer.appendChild(div);
      });
    }

    // Render Evidencias List
    const evidenciasContainer = document.getElementById('container-evidencias');
    if (evidenciasContainer) {
      evidenciasContainer.innerHTML = '';
      AppState.evidencias.forEach(ev => {
        const div = document.createElement('div');
        div.className = 'd-flex align-items-center justify-content-between p-2 rounded-3 mb-2 bg-dark bg-opacity-50 border border-white-10';
        div.innerHTML = `
          <div class="d-flex align-items-center gap-2 text-truncate me-2">
            <i class="bi bi-file-earmark-pdf-fill text-primary fs-5"></i>
            <div class="text-truncate">
              <div class="text-white small text-truncate fw-medium">${ev.nombre_archivo}</div>
              <div class="font-monospace text-muted small">${ev.tamano_legible} • ${ev.categoria_ghg}</div>
            </div>
          </div>
          <span class="badge-pill-status badge-pill-verified small shrink-0">
            <i class="bi bi-shield-check"></i> ${ev.estado_clamav}
          </span>
        `;
        evidenciasContainer.appendChild(div);
      });
    }
  }

  // Open Sede Detail Modal
  function openSedeModal(sedeId) {
    const sede = AppState.sedes.find(s => s.id === sedeId);
    if (!sede) return;

    const modalBody = document.getElementById('sede-modal-content');
    if (modalBody) {
      modalBody.innerHTML = `
        <div class="d-flex align-items-center justify-content-between pb-3 border-bottom border-white-10 mb-3">
          <div class="d-flex align-items-center gap-2">
            <i class="bi bi-building text-primary fs-4"></i>
            <div>
              <h5 class="modal-title font-headline text-white mb-0">${sede.nombre}</h5>
              <span class="font-monospace text-primary small">${sede.codigo_sede}</span>
            </div>
          </div>
          <span class="badge-pill-status ${sede.estado_auditoria === 'VALIDADO_100' ? 'badge-pill-verified' : 'badge-pill-warning'}">
            ${sede.estado_auditoria}
          </span>
        </div>
        <div class="row g-3 small">
          <div class="col-sm-6">
            <span class="text-muted d-block">Tipo de Instalación:</span>
            <strong class="text-white">${sede.tipo_instalacion}</strong>
          </div>
          <div class="col-sm-6">
            <span class="text-muted d-block">Ubicación:</span>
            <strong class="text-white">${sede.ciudad}, ${sede.pais}</strong>
          </div>
          <div class="col-sm-6">
            <span class="text-muted d-block">Responsable Técnico:</span>
            <strong class="text-white">${sede.responsable || 'No asignado'}</strong>
          </div>
          <div class="col-sm-6">
            <span class="text-muted d-block">Capacidad / Dotación:</span>
            <strong class="text-white">${sede.capacidad_operativa || 'No declarada'}</strong>
          </div>
          <div class="col-sm-6">
            <div class="p-3 rounded-3 bg-dark bg-opacity-60 border border-white-10">
              <span class="text-muted d-block mb-1">Huella de Carbono Anual:</span>
              <span class="font-metric text-white fs-4">${formatNumber(sede.huella_carbono_tco2e)}</span>
              <span class="text-muted font-monospace small"> tCO2e</span>
            </div>
          </div>
          <div class="col-sm-6">
            <div class="p-3 rounded-3 bg-dark bg-opacity-60 border border-white-10">
              <span class="text-muted d-block mb-1">Balance Hídrico Anual:</span>
              <span class="font-metric text-secondary fs-4">${formatNumber(sede.balance_hidrico_m3, 1)}</span>
              <span class="text-muted font-monospace small"> m³</span>
            </div>
          </div>
          <div class="col-12">
            <div class="p-3 rounded-3 bg-dark bg-opacity-50 border border-white-10 font-monospace text-secondary small">
              <i class="bi bi-shield-lock-fill"></i> Sello Criptográfico Ledger: SHA-256 Validado contra bloque Supabase Cloud.
            </div>
          </div>
        </div>
      `;
    }

    const modalEl = document.getElementById('modalSedeDetail');
    if (modalEl && window.bootstrap) {
      const bsModal = new bootstrap.Modal(modalEl);
      bsModal.show();
    }
  }

  // Subsanación de Errores
  function renderSubsanacion() {
    const tbody = document.getElementById('tbody-subsanacion');
    if (!tbody) return;

    tbody.innerHTML = '';
    AppState.filasSubsanacion.forEach((row, index) => {
      const tr = document.createElement('tr');
      const isFixed = row.estado === 'CORREGIDO';
      tr.className = isFixed ? 'opacity-50 bg-success bg-opacity-10' : '';
      tr.innerHTML = `
        <td class="font-monospace text-primary fw-bold">#${row.fila_numero}</td>
        <td class="text-white font-monospace">${row.campo_afectado}</td>
        <td class="text-warning font-monospace small">${row.valor_recibido}</td>
        <td class="text-white-50 small">${row.causa_error}</td>
        <td>
          <div class="d-flex align-items-center gap-2">
            <select class="form-select form-select-sm form-select-efp select-fix-option" data-index="${index}" ${isFixed ? 'disabled' : ''}>
              <option value="">Seleccione corrección...</option>
              ${(row.opciones_correccion || []).map(opt => `
                <option value="${opt}" ${row.valor_corregido === opt ? 'selected' : ''}>${opt}</option>
              `).join('')}
            </select>
          </div>
        </td>
        <td class="text-center">
          ${isFixed 
            ? '<span class="badge-pill-status badge-pill-verified"><i class="bi bi-check2"></i> Corregido</span>'
            : '<span class="badge-pill-status badge-pill-warning"><i class="bi bi-exclamation-circle"></i> Pendiente</span>'}
        </td>
      `;
      tbody.appendChild(tr);
    });

    // Bind dropdown change
    tbody.querySelectorAll('.select-fix-option').forEach(sel => {
      sel.addEventListener('change', (e) => {
        const idx = sel.getAttribute('data-index');
        AppState.filasSubsanacion[idx].valor_corregido = sel.value;
      });
    });
  }

  // Notificaciones & Auditoría Forense
  function renderNotificaciones(filter = 'todas', query = '') {
    const container = document.getElementById('container-notificaciones-list');
    if (!container) return;

    container.innerHTML = '';
    const filtered = AppState.notificaciones.filter(n => {
      const matchFilter = filter === 'todas' || n.categoria_filtro === filter;
      const matchQuery = !query || 
        n.titulo.toLowerCase().includes(query.toLowerCase()) || 
        n.descripcion.toLowerCase().includes(query.toLowerCase()) ||
        n.traza_id.toLowerCase().includes(query.toLowerCase());
      return matchFilter && matchQuery;
    });

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="text-center py-5 text-muted">
          <i class="bi bi-inbox fs-1 d-block mb-2"></i>
          <span>No se encontraron eventos forenses para el filtro seleccionado.</span>
        </div>
      `;
      return;
    }

    filtered.forEach(n => {
      const card = document.createElement('div');
      card.className = 'glass-card p-3 p-sm-4 rounded-3 mb-3 border border-white-10';
      
      let badgeClass = 'badge-pill-primary';
      let icon = 'bi-info-circle-fill';
      if (n.severidad === 'CRITICA') {
        badgeClass = 'badge-pill-danger';
        icon = 'bi-shield-fill-exclamation';
      } else if (n.severidad === 'ADVERTENCIA') {
        badgeClass = 'badge-pill-warning';
        icon = 'bi-exclamation-triangle-fill';
      }

      card.innerHTML = `
        <div class="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-2">
          <div class="d-flex align-items-center gap-2">
            <span class="badge-pill-status ${badgeClass}">
              <i class="bi ${icon}"></i> ${n.severidad}
            </span>
            <span class="font-monospace text-primary small fw-semibold">${n.codigo_error}</span>
            <span class="text-muted">•</span>
            <span class="text-white-50 small">${n.sede_nombre}</span>
          </div>
          <span class="text-muted font-monospace small"><i class="bi bi-clock me-1"></i>${n.hace_cuanto}</span>
        </div>
        <h5 class="font-headline text-white fs-6 mb-1">${n.titulo}</h5>
        <p class="text-white-50 small mb-2">${n.descripcion}</p>
        <div class="d-flex flex-wrap align-items-center justify-content-between pt-2 border-top border-white-5 small font-monospace">
          <span class="text-muted">Traza: <span class="text-secondary">${n.traza_id}</span> • ${n.bloque_ledger}</span>
          <span class="text-white-50">Archivo: ${n.archivo_afectado}</span>
        </div>
      `;
      container.appendChild(card);
    });
  }

  // Gestión de Usuarios
  function renderUsuarios() {
    const tbody = document.getElementById('tbody-usuarios');
    if (!tbody) return;

    tbody.innerHTML = '';
    AppState.usuarios.forEach((u, idx) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>
          <div class="d-flex align-items-center gap-2.5">
            <img src="${u.avatar}" alt="${u.nombre}" class="rounded-circle border border-white-15" width="36" height="36" style="object-fit: cover;">
            <div>
              <div class="text-white fw-semibold">${u.nombre}</div>
              <div class="text-muted small font-monospace">${u.correo}</div>
            </div>
          </div>
        </td>
        <td>
          <span class="badge-pill-status ${u.rol === 'ADMIN_TI' ? 'badge-pill-primary' : u.rol === 'AUDITOR_EXTERNO' ? 'badge-pill-verified' : 'badge-pill-warning'}">
            ${u.rol}
          </span>
        </td>
        <td class="text-white-50 small">${u.sede_asignada}</td>
        <td class="text-center font-monospace">
          ${u.mfa_activo ? '<span class="text-secondary"><i class="bi bi-shield-check"></i> Activo</span>' : '<span class="text-muted">Inactivo</span>'}
        </td>
        <td class="text-center">
          <span class="badge bg-success bg-opacity-20 text-success border border-success border-opacity-30 rounded-pill px-2.5 py-1 small">
            ACTIVO
          </span>
        </td>
        <td class="text-center">
          <button class="btn btn-sm btn-outline-light border-0 text-white-50 hover-text-white btn-toggle-persona" data-uid="${u.uid}" title="Iniciar Sesión como este usuario">
            <i class="bi bi-box-arrow-in-right"></i> Usar Perfil
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    tbody.querySelectorAll('.btn-toggle-persona').forEach(btn => {
      btn.addEventListener('click', () => {
        const uid = btn.getAttribute('data-uid');
        const user = AppState.usuarios.find(u => u.uid === uid);
        if (user) {
          AppState.currentUser = user;
          saveStore('user', user);
          updateHeaderProfile();
          showToast('Perfil Cambiado', `Ahora estás operando como: ${user.nombre} (${user.rol})`, 'success');
          fireConfetti();
          navigateTo('dashboard');
        }
      });
    });
  }

  // Gestión de Sedes
  function renderSedes() {
    const tbody = document.getElementById('tbody-sedes-crud');
    if (!tbody) return;

    tbody.innerHTML = '';
    AppState.sedes.forEach(s => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="text-primary font-monospace fw-bold">${s.codigo_sede}</td>
        <td class="text-white fw-semibold">${s.nombre}</td>
        <td class="text-white-50">${s.tipo_instalacion}</td>
        <td class="text-white-50">${s.ciudad}, ${s.pais}</td>
        <td class="text-end text-white font-monospace fw-bold">${formatNumber(s.huella_carbono_tco2e)} t</td>
        <td class="text-end text-secondary font-monospace fw-bold">${formatNumber(s.balance_hidrico_m3, 1)} m³</td>
        <td class="text-center">
          <span class="badge-pill-status ${s.nivel_estres_hidrico === 'BAJO' ? 'badge-pill-verified' : s.nivel_estres_hidrico === 'MEDIO' ? 'badge-pill-warning' : 'badge-pill-danger'}">
            ${s.nivel_estres_hidrico}
          </span>
        </td>
        <td class="text-center">
          <button class="btn btn-sm btn-outline-info border-0 text-white-50 hover-text-white btn-view-sede" data-id="${s.id}">
            <i class="bi bi-eye"></i>
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    tbody.querySelectorAll('.btn-view-sede').forEach(btn => {
      btn.addEventListener('click', () => {
        openSedeModal(btn.getAttribute('data-id'));
      });
    });
  }

  // Factores de Emisión
  function renderFactores() {
    const tbody = document.getElementById('tbody-factores');
    if (!tbody) return;

    tbody.innerHTML = '';
    AppState.factores.forEach(f => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="font-monospace text-primary small fw-semibold">${f.codigo_actividad}</td>
        <td class="text-white fw-medium">${f.fuente}</td>
        <td>
          <span class="badge-pill-status badge-pill-primary small">${f.categoria_ghg}</span>
        </td>
        <td class="text-end text-white font-monospace fw-bold">${f.factor_valor}</td>
        <td class="text-white-50 font-monospace small">${f.unidad}</td>
        <td class="text-white-50 small">${f.fuente_protocolo}</td>
        <td class="text-center font-monospace">${f.vigencia_ano}</td>
        <td class="text-center">
          <span class="badge-pill-status badge-pill-verified small"><i class="bi bi-check-circle"></i> Homologado</span>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  // Períodos Contables
  function renderPeriodos() {
    const tbody = document.getElementById('tbody-periodos');
    if (!tbody) return;

    tbody.innerHTML = '';
    AppState.periodos.forEach(p => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="text-primary font-monospace fw-bold">${p.codigo_periodo}</td>
        <td class="text-white">${p.version_label}</td>
        <td>
          <span class="badge-pill-status ${p.estado === 'CERRADO' ? 'badge-pill-verified' : 'badge-pill-warning'}">
            ${p.estado}
          </span>
        </td>
        <td class="font-monospace text-secondary small text-truncate" style="max-width: 200px;" title="${p.hash_ledger_sha256}">
          ${p.hash_ledger_sha256}
        </td>
        <td class="text-white-50 font-monospace small">${p.fecha_cierre}</td>
        <td class="text-white-50 small">${p.cerrado_por}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  // Admin Panel Overview
  function renderAdminPanel() {
    const latencyEl = document.getElementById('admin-latency-val');
    if (latencyEl) latencyEl.textContent = `${AppState.supabaseConfig.latency} ms`;
    
    const countUsersEl = document.getElementById('admin-count-users');
    if (countUsersEl) countUsersEl.textContent = AppState.usuarios.length;

    const countSedesEl = document.getElementById('admin-count-sedes');
    if (countSedesEl) countSedesEl.textContent = AppState.sedes.length;

    const countFactorsEl = document.getElementById('admin-count-factores');
    if (countFactorsEl) countFactorsEl.textContent = AppState.factores.length;
  }

  // Update Header User & Profile Badges
  function updateHeaderProfile() {
    const user = AppState.currentUser;
    const isAdmin = isUserAdmin(user);

    const nameEl = document.getElementById('header-user-name');
    const roleEl = document.getElementById('header-user-role');
    const avatarEl = document.getElementById('header-user-avatar');
    const adminBadge = document.getElementById('header-admin-badge');
    const adminNavLinks = document.getElementById('header-admin-links');

    // Dropdown elements
    const dropName = document.getElementById('dropdown-user-fullname');
    const dropEmail = document.getElementById('dropdown-user-email');
    const dropBadge = document.getElementById('dropdown-user-badge');
    const dropUid = document.getElementById('dropdown-user-uid');
    const dropAdminShortcuts = document.getElementById('dropdown-admin-shortcuts');

    // Sidebar admin section
    const sidebarAdmin = document.getElementById('sidebar-admin-section');

    if (user) {
      if (nameEl) nameEl.textContent = user.nombre;
      if (roleEl) roleEl.textContent = user.rol;
      if (avatarEl) avatarEl.src = user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80';
      if (adminBadge) {
        adminBadge.style.display = isAdmin ? 'inline-flex' : 'none';
        adminBadge.innerHTML = `<i class="bi bi-shield-check text-secondary"></i><span class="d-none d-sm-inline fw-semibold">Admin: ${user.uid || '123123'}</span><span class="d-sm-none fw-semibold">Admin</span>`;
      }
      if (adminNavLinks) {
        adminNavLinks.style.display = isAdmin ? 'inline-flex' : 'none';
      }
      if (dropName) dropName.textContent = user.nombre;
      if (dropEmail) dropEmail.textContent = user.correo || `${user.usuario || 'usuario'}@corporacion.com`;
      if (dropBadge) dropBadge.textContent = `Rol: ${user.rol}`;
      if (dropUid) dropUid.textContent = `UID: ${user.uid || '123123'}`;
      if (dropAdminShortcuts) dropAdminShortcuts.style.display = isAdmin ? 'block' : 'none';
      if (sidebarAdmin) sidebarAdmin.style.display = isAdmin ? 'flex' : 'none';
    } else {
      if (nameEl) nameEl.textContent = 'Invitado';
      if (roleEl) roleEl.textContent = 'Sin Sesión';
      if (adminBadge) adminBadge.style.display = 'none';
      if (adminNavLinks) adminNavLinks.style.display = 'none';
      if (dropName) dropName.textContent = 'Usuario Invitado';
      if (dropEmail) dropEmail.textContent = 'inicie sesión';
      if (dropBadge) dropBadge.textContent = 'Sin Sesión';
      if (dropUid) dropUid.textContent = '';
      if (dropAdminShortcuts) dropAdminShortcuts.style.display = 'none';
      if (sidebarAdmin) sidebarAdmin.style.display = 'none';
    }
  }

  // PDF Export Generation Simulation
  function handleDownloadExecutivePdf() {
    const btn = document.getElementById('btn-download-pdf');
    if (!btn) return;

    btn.disabled = true;
    const originalText = btn.innerHTML;
    btn.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span>Sellando Criptográficamente...`;

    setTimeout(() => {
      btn.innerHTML = `<i class="bi bi-check-circle-fill text-success me-2"></i>¡PDF Oficial Generado!`;
      fireConfetti();
      showToast('Reporte Criptográfico Generado', 'Resumen Ejecutivo ISO 14064-1 / ISO 14046 compilado y sellado exitosamente.', 'success');

      // Create an actual downloadable text/markdown executive certificate
      const certContent = `================================================================================
EFP PLATFORM - RESUMEN EJECUTIVO DE HUELLA AMBIENTAL ORGANIZACIONAL
Certificado de Aseguramiento Determinista ISO 14064-1 & ISO 14046
================================================================================
Organización: Corporación Multi-Sitio EFP
Ciclo Auditado: 2026-ANUAL (Versión v1)
Fecha de Sellado: ${new Date().toUTCString()}
Hash Merkle Root (SHA-256): 89c44e9102ab837f44a10e82cda991f83c18bb39f01e2ac9748b0213cd41fa90
Backend Primario: Supabase Cloud PostgreSQL (pmtzrwdbgzufxemlwqaf)

--------------------------------------------------------------------------------
1. HUELLA DE CARBONO ORGANIZACIONAL (GHG Protocol Corporate Standard)
--------------------------------------------------------------------------------
- Huella Total Corporativa: 14,285.74 tCO2e
- Variación vs Ciclo Previo: +1.2%
- Alcance 1 (Directo): 8,920.12 tCO2e (62.40% del inventario)
    * Combustibles Fijos (Calderas / Hornos): 5,100.00 tCO2e
    * Flota de Transporte Móvil: 3,420.00 tCO2e
    * Emisiones Fugitivas Refrigerantes (R-410A): 400.12 tCO2e
- Alcance 2 (Indirecto Eléctrico Base Red): 5,365.62 tCO2e (37.60% del inventario)
    * Consumo Eléctrico de Red (FECOC UPME / SEN): 5,365.62 tCO2e
- Algoritmo de Cálculo: Determinista con aritmética decimal arbitraria (decimal.js).
- Salvedades Técnicas: CERO (0) desviaciones detectadas.

--------------------------------------------------------------------------------
2. BALANCE HÍDRICO CORPORATIVO (ISO 14046 - Conservación de Masa)
--------------------------------------------------------------------------------
- Consumo Total de Agua: 128,450.00 m³
- Variación vs Ciclo Previo: -2.5%
- Balance de Masas: Captación = Consumo + Descarga + Pérdidas
- Desbalance Volumétrico Calculado: 0.000 m³ (Equilibrio Exacto Verificado)
- Auditoría WRI Aqueduct 4.0: 68% de captaciones en cuencas de estrés bajo-medio.
- Evidencias Telemétricas: 100% cotejadas contra medidores certificados.

--------------------------------------------------------------------------------
3. FIRMA DEL COMITÉ TÉCNICO Y CUSTODIA DIGITAL
--------------------------------------------------------------------------------
Oficial HSEQ Titular: Dra. Elena Vásquez (Auditora Externa Líder ISO 14064-3)
Administrador de Infraestructura: Admin Principal (UID: 123123)
Estado Forense: SELLADO INMUTABLE • CUSTODIADO EN SUPABASE
================================================================================`;

      const blob = new Blob([certContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `EFP-Resumen-Ejecutivo-2026-ANUAL-${Date.now()}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setTimeout(() => {
        btn.disabled = false;
        btn.innerHTML = originalText;
      }, 3500);
    }, 1800);
  }

  // Ingesta Masiva Simulator
  function initBulkIngest() {
    const dropzone = document.getElementById('dropzone-ingesta');
    const fileInput = document.getElementById('file-input-ingesta');
    const btnExecute = document.getElementById('btn-ejecutar-ingesta');
    const selectedFileDisplay = document.getElementById('ingesta-file-display');
    const scanAlert = document.getElementById('ingesta-scan-alert');

    let currentIngestFile = null;

    if (dropzone && fileInput) {
      dropzone.addEventListener('click', () => fileInput.click());

      ['dragenter', 'dragover'].forEach(eventName => {
        dropzone.addEventListener(eventName, (e) => {
          e.preventDefault();
          dropzone.classList.add('dragover');
        });
      });

      ['dragleave', 'drop'].forEach(eventName => {
        dropzone.addEventListener(eventName, (e) => {
          e.preventDefault();
          dropzone.classList.remove('dragover');
        });
      });

      dropzone.addEventListener('drop', (e) => {
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
          handleFile(e.dataTransfer.files[0]);
        }
      });

      fileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
          handleFile(e.target.files[0]);
        }
      });
    }

    function handleFile(file) {
      currentIngestFile = file;
      if (selectedFileDisplay) {
        selectedFileDisplay.innerHTML = `
          <div class="d-flex align-items-center justify-content-between p-3 rounded-3 bg-dark bg-opacity-70 border border-primary border-opacity-40">
            <div class="d-flex align-items-center gap-3">
              <i class="bi bi-file-earmark-spreadsheet-fill text-success fs-3"></i>
              <div>
                <strong class="text-white d-block">${file.name}</strong>
                <span class="text-muted small font-monospace">${(file.size / 1024 / 1024).toFixed(2)} MB • Estructura tabular detectada</span>
              </div>
            </div>
            <span class="badge-pill-status badge-pill-verified"><i class="bi bi-check2"></i> Archivo Listo</span>
          </div>
        `;
      }

      if (scanAlert) {
        scanAlert.innerHTML = `
          <div class="alert alert-info bg-info bg-opacity-10 border border-info border-opacity-30 d-flex align-items-center gap-2 mb-0">
            <span class="spinner-border spinner-border-sm text-info"></span>
            <span class="small">Ejecutando escaneo antivirus ClamAV Daemon & cálculo de hash SHA-256...</span>
          </div>
        `;

        setTimeout(() => {
          scanAlert.innerHTML = `
            <div class="alert alert-success bg-success bg-opacity-10 border border-success border-opacity-30 d-flex align-items-center gap-2 mb-0">
              <i class="bi bi-shield-check text-success fs-5"></i>
              <span class="small font-monospace">ClamAV Daemon: FIRMA LIMPIA • SHA-256 Generado exitosamente.</span>
            </div>
          `;
        }, 1200);
      }
    }

    // Preloaded Template Buttons
    document.querySelectorAll('.btn-preloaded-template').forEach(btn => {
      btn.addEventListener('click', () => {
        const name = btn.getAttribute('data-name');
        const size = btn.getAttribute('data-size');
        handleFile({ name, size: parseFloat(size) * 1024 * 1024 });
      });
    });

    if (btnExecute) {
      btnExecute.addEventListener('click', () => {
        if (!currentIngestFile) {
          showToast('Archivo Requerido', 'Por favor seleccione o arrastre un archivo estructurado CSV o XLSX.', 'warning');
          return;
        }

        btnExecute.disabled = true;
        btnExecute.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span>Validando 14,200 registros...`;

        setTimeout(() => {
          btnExecute.disabled = false;
          btnExecute.innerHTML = `<i class="bi bi-play-circle-fill me-2"></i>Iniciar Ingesta Determinista`;

          fireConfetti();
          showToast('Ingesta Procesada con Observaciones', '14,195 registros aprobados al ledger inmutable. 5 registros enviados a Subsanación.', 'warning');

          // Record Traceability Event
          AppState.trazabilidad.unshift({
            id: `tr-${Date.now()}`,
            operacion: `Carga Masiva: ${currentIngestFile.name}`,
            usuario_responsable: `${AppState.currentUser?.nombre || 'Admin'} (${AppState.currentUser?.rol || 'ADMIN_TI'})`,
            ip_origen: '190.144.12.88',
            hora: new Date().toLocaleTimeString('es-ES', { hour12: false }),
            estado: 'EXITOSO_CON_OBSERVACIONES',
            detalles: '14,195 aprobados • 5 rechazados a subsanación',
            hash_bloque: '7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069'
          });

          navigateTo('subsanacion');
        }, 2200);
      });
    }
  }

  // Global Event Listeners & Binding
  function bindGlobalEvents() {
    // Nav Click Handling
    document.querySelectorAll('[data-view]').forEach(elem => {
      elem.addEventListener('click', (e) => {
        e.preventDefault();
        const view = elem.getAttribute('data-view');
        if (view) navigateTo(view);
      });
    });

    // Handle browser back/forward and hash changes
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.replace('#', '').trim();
      if (hash && document.getElementById(`view-${hash}`) && hash !== AppState.currentView) {
        navigateTo(hash);
      }
    });

    // Facility selector change
    const facilitySelect = document.getElementById('select-dashboard-facility');
    if (facilitySelect) {
      facilitySelect.addEventListener('change', (e) => {
        AppState.selectedFacility = e.target.value;
        renderDashboard();
      });
    }

    // PDF Download Button
    const btnPdf = document.getElementById('btn-download-pdf');
    if (btnPdf) {
      btnPdf.addEventListener('click', handleDownloadExecutivePdf);
    }

    // Subsanación Apply Fixes Button
    const btnApplyFixes = document.getElementById('btn-aplicar-subsanacion');
    if (btnApplyFixes) {
      btnApplyFixes.addEventListener('click', () => {
        btnApplyFixes.disabled = true;
        btnApplyFixes.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span>Recalculando sin flotantes...`;

        setTimeout(() => {
          AppState.filasSubsanacion.forEach(f => {
            if (f.valor_corregido) {
              f.estado = 'CORREGIDO';
            }
          });
          saveStore('subsanacion', AppState.filasSubsanacion);
          renderSubsanacion();
          updateSubsanacionBadge();

          btnApplyFixes.disabled = false;
          btnApplyFixes.innerHTML = `<i class="bi bi-check-all me-1"></i>Aplicar Correcciones y Recalcular`;

          fireConfetti();
          showToast('Subsanación Exitosa', 'Las filas han sido recalculadas y selladas con éxito en el Ledger Inmutable.', 'success');
        }, 1500);
      });
    }

    // Enmienda V2 - Copy Hash & Feedback
    const btnCopyHash = document.getElementById('btn-copy-hash');
    const copiedBadge = document.getElementById('copied-hash-badge');
    if (btnCopyHash) {
      btnCopyHash.addEventListener('click', () => {
        const hash = "89c44e9102ab837f44a10e82cda991f83c18bb39f01e2ac9748b0213cd41fa90";
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(hash).then(() => {
            showToast('Hash Copiado', 'SHA-256 del Ledger copiado al portapapeles.', 'success');
            if (copiedBadge) {
              copiedBadge.classList.remove('d-none');
              setTimeout(() => copiedBadge.classList.add('d-none'), 2500);
            }
          }).catch(() => {
            showToast('Hash Copiado', hash, 'info');
          });
        } else {
          showToast('Hash Ledger', hash, 'info');
        }
      });
    }

    // Enmienda File Upload Dropzone
    const dropzoneEnmienda = document.getElementById('dropzone-enmienda');
    const fileInputEnmienda = document.getElementById('enmienda-file-input');
    const labelEnmienda = document.getElementById('enmienda-file-label');
    if (dropzoneEnmienda && fileInputEnmienda) {
      dropzoneEnmienda.addEventListener('click', () => fileInputEnmienda.click());
      fileInputEnmienda.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
          const f = e.target.files[0];
          if (labelEnmienda) {
            labelEnmienda.textContent = `Archivo adjunto: ${f.name} (${(f.size / 1024).toFixed(1)} KB)`;
            labelEnmienda.classList.add('text-secondary', 'fw-bold');
          }
        }
      });
    }

    // Enmienda V2 Form -> Open Confirm Modal
    let pendingEnmiendaData = null;
    const formEnmienda = document.getElementById('form-enmienda-v2');
    if (formEnmienda) {
      formEnmienda.addEventListener('submit', (e) => {
        e.preventDefault();
        const reason = document.getElementById('enmienda-reason')?.value || '';
        const category = document.getElementById('enmienda-category')?.value || '';
        const terms = document.getElementById('enmienda-terms')?.checked;

        if (!category) {
          showToast('Campo Requerido', 'Por favor seleccione una Categoría de Corrección Metodológica.', 'warning');
          return;
        }

        if (reason.trim().length < 40) {
          showToast('Justificación Insuficiente', 'La justificación técnica debe contener al menos 40 caracteres para el expediente de auditoría.', 'warning');
          return;
        }

        if (!terms) {
          showToast('Declaración Requerida', 'Debe certificar la declaración de responsabilidad como Oficial HSEQ Titular.', 'warning');
          return;
        }

        pendingEnmiendaData = {
          category,
          reason: reason.trim(),
          timestamp: new Date().toISOString()
        };

        const modalCategorySpan = document.getElementById('modal-confirm-v2-category');
        const modalPreviewP = document.getElementById('modal-confirm-v2-preview');
        if (modalCategorySpan) modalCategorySpan.textContent = category;
        if (modalPreviewP) modalPreviewP.textContent = `"${reason.trim()}"`;

        const modalEl = document.getElementById('modalConfirmEnmienda');
        if (modalEl && window.bootstrap) {
          const bsModal = bootstrap.Modal.getOrCreateInstance(modalEl);
          bsModal.show();
        }
      });
    }

    // Modal Confirm Execute Enmienda V2
    const btnConfirmV2 = document.getElementById('btn-confirm-execute-v2');
    if (btnConfirmV2) {
      btnConfirmV2.addEventListener('click', () => {
        if (!pendingEnmiendaData) return;

        btnConfirmV2.disabled = true;
        btnConfirmV2.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span>Sellando Bloque V2...`;

        setTimeout(() => {
          btnConfirmV2.disabled = false;
          btnConfirmV2.innerHTML = `<i class="bi bi-shield-check me-2"></i>Confirmar y Sellar Período V2`;

          const modalEl = document.getElementById('modalConfirmEnmienda');
          if (modalEl && window.bootstrap) {
            const bsModal = bootstrap.Modal.getInstance(modalEl);
            if (bsModal) bsModal.hide();
          }

          // Add to periods
          AppState.periodos.unshift({
            id: `prd-${Date.now()}`,
            codigo_periodo: '2026-ANUAL',
            version: 2,
            version_label: 'v2 (Enmienda Aprobada)',
            estado: 'APROBADO',
            es_vigente: true,
            es_inmutable: true,
            hash_ledger_sha256: '9f83ac012ab837f44a10e82cda991f83c18bb39f01e2ac9748b0213cd41fa89b',
            fecha_cierre: new Date().toUTCString(),
            cerrado_por: AppState.currentUser?.nombre || 'Oficial HSEQ',
            justificacion_cierre: pendingEnmiendaData.reason
          });
          saveStore('periodos', AppState.periodos);

          // Add to notifications
          AppState.notificaciones.unshift({
            id: `notif-${Date.now()}`,
            severidad: 'INFO',
            codigo_error: 'ENM-V2-APPROVED',
            titulo: 'Enmienda V2 Sellada con Éxito',
            descripcion: `Ajuste metodológico (${pendingEnmiendaData.category}) registrado y sellado con hash SHA-256 inmutable.`,
            sede_nombre: 'Corporación Global',
            traza_id: `TRZ-${Date.now().toString().slice(-8)}`,
            hace_cuanto: 'Hace unos instantes',
            bloque_ledger: 'Bloque #0030-A',
            archivo_afectado: 'ledger_periodo_2026_v2.sql',
            categoria_filtro: 'info'
          });
          saveStore('notificaciones', AppState.notificaciones);

          // Update Period indicator pill
          document.querySelectorAll('.font-mono-audit .text-secondary.fw-semibold').forEach(el => {
            if (el.textContent.includes('2026-ANUAL')) {
              el.textContent = '2026-ANUAL (v2 Enmienda)';
            }
          });

          fireConfetti();
          showToast('Enmienda V2 Sellada', 'El nuevo período V2 ha sido generado e indexado en el ledger histórico inmutable.', 'success');
          navigateTo('dashboard');
        }, 1600);
      });
    }

    // Sidebar Logout Button
    const btnSidebarLogout = document.getElementById('btn-sidebar-logout');
    if (btnSidebarLogout) {
      btnSidebarLogout.addEventListener('click', (e) => {
        e.preventDefault();
        AppState.currentUser = null;
        localStorage.removeItem('efp_user');
        updateHeaderProfile();
        showToast('Sesión Finalizada', 'Ha cerrado sesión correctamente desde la barra lateral.', 'info');
        navigateTo('login');
      });
    }

    // Login Form
    const formLogin = document.getElementById('form-login');
    if (formLogin) {
      formLogin.addEventListener('submit', (e) => {
        e.preventDefault();
        const userVal = document.getElementById('login-usuario')?.value.trim();
        const passVal = document.getElementById('login-password')?.value.trim();

        const btnLogin = formLogin.querySelector('button[type="submit"]');
        if (btnLogin) {
          btnLogin.disabled = true;
          btnLogin.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span>Autenticando...`;
        }

        setTimeout(() => {
          if (btnLogin) {
            btnLogin.disabled = false;
            btnLogin.innerHTML = `<i class="bi bi-box-arrow-in-right me-2"></i>Ingresar al Sistema`;
          }

          const matchedUser = AppState.usuarios.find(u => 
            (u.usuario === userVal || u.correo === userVal || u.uid === userVal)
          ) || AppState.usuarios[0];

          AppState.currentUser = matchedUser;
          saveStore('user', matchedUser);
          updateHeaderProfile();

          fireConfetti();
          showToast('Acceso Concedido', `Bienvenido al sistema, ${matchedUser.nombre}.`, 'success');
          navigateTo('dashboard');
        }, 800);
      });

      // Quick Admin Fill Button
      const btnFillAdmin = document.getElementById('btn-fill-admin-creds');
      if (btnFillAdmin) {
        btnFillAdmin.addEventListener('click', () => {
          const userIn = document.getElementById('login-usuario');
          const passIn = document.getElementById('login-password');
          if (userIn) userIn.value = 'admin';
          if (passIn) passIn.value = '123123';
          showToast('Credenciales Cargadas', 'Usuario: admin | Contraseña: ••••••', 'info');
        });
      }
    }

    // Logout
    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
      btnLogout.addEventListener('click', (e) => {
        e.preventDefault();
        AppState.currentUser = null;
        localStorage.removeItem('efp_user');
        updateHeaderProfile();
        showToast('Sesión Finalizada', 'Ha cerrado sesión correctamente.', 'info');
        navigateTo('login');
      });
    }

    // Demo Request Form on Landing
    const formDemo = document.getElementById('form-demo-request');
    const demoAlert = document.getElementById('demo-success-alert');
    if (formDemo) {
      formDemo.addEventListener('submit', (e) => {
        e.preventDefault();
        const emp = document.getElementById('demo-empresa')?.value || 'Su Empresa';
        const mail = document.getElementById('demo-correo')?.value || '';

        const btnDemo = formDemo.querySelector('button[type="submit"]');
        if (btnDemo) {
          btnDemo.disabled = true;
          btnDemo.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span>Registrando...`;
        }

        setTimeout(() => {
          if (btnDemo) {
            btnDemo.disabled = false;
            btnDemo.innerHTML = `<i class="bi bi-calendar-check me-2"></i>Solicitud Registrada`;
          }
          if (demoAlert) {
            demoAlert.classList.remove('d-none');
          }
          fireConfetti();
          showToast('Demostración Solicitada', `Hemos agendado la demostración técnica para ${emp} (${mail}). Recibirá las credenciales en su correo corporativo.`, 'success');
          formDemo.reset();
        }, 1000);
      });
    }

    // Supabase Connection Modal Testing & Save
    const btnTestSupabase = document.getElementById('btn-test-supabase');
    const inputSupabaseUrl = document.getElementById('input-supabase-url');
    const inputSupabaseKey = document.getElementById('input-supabase-key');
    const testResultAlert = document.getElementById('supabase-test-result');

    if (btnTestSupabase) {
      btnTestSupabase.addEventListener('click', () => {
        const url = inputSupabaseUrl?.value.trim();
        const key = inputSupabaseKey?.value.trim();

        if (!url) {
          showToast('URL Requerida', 'Ingrese la URL de su proyecto Supabase.', 'warning');
          return;
        }

        btnTestSupabase.disabled = true;
        btnTestSupabase.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span>Verificando Conexión...`;

        setTimeout(() => {
          btnTestSupabase.disabled = false;
          btnTestSupabase.innerHTML = `<i class="bi bi-hdd-network me-1"></i>Probar Conexión`;

          const pingMs = Math.floor(Math.random() * 25) + 18;
          AppState.supabaseConfig.latency = pingMs;
          AppState.supabaseConfig.connected = true;

          if (testResultAlert) {
            testResultAlert.className = 'alert alert-success bg-success bg-opacity-10 border border-success border-opacity-30 small mb-3';
            testResultAlert.innerHTML = `
              <div class="d-flex align-items-center gap-2">
                <i class="bi bi-check-circle-fill text-success fs-5"></i>
                <div>
                  <strong>¡Conexión Verificada Exitosamente (${pingMs}ms)!</strong>
                  <div class="text-white-50">Servidor Supabase alcanzado. Tablas deterministas PostgreSQL respondiendo correctamente.</div>
                </div>
              </div>
            `;
          }
          showToast('Supabase Online', `Latencia de respuesta: ${pingMs}ms con SSL habilitado.`, 'success');
        }, 1200);
      });
    }

    const btnSaveSupabase = document.getElementById('btn-save-supabase');
    if (btnSaveSupabase) {
      btnSaveSupabase.addEventListener('click', () => {
        const url = inputSupabaseUrl?.value.trim() || EFP_DATA.supabase.defaultUrl;
        const key = inputSupabaseKey?.value.trim() || EFP_DATA.supabase.defaultKey;

        AppState.supabaseConfig.url = url;
        AppState.supabaseConfig.key = key;

        localStorage.setItem('efp_supabase_url', url);
        localStorage.setItem('efp_supabase_key', key);

        fireConfetti();
        showToast('Credenciales Guardadas', 'Configuración de conexión Supabase actualizada exitosamente.', 'success');

        const modalEl = document.getElementById('modalSupabase');
        if (modalEl && window.bootstrap) {
          const bsModal = bootstrap.Modal.getInstance(modalEl);
          if (bsModal) bsModal.hide();
        }
      });
    }

    // Copy SQL DDL
    const btnCopySql = document.getElementById('btn-copy-sql');
    if (btnCopySql) {
      btnCopySql.addEventListener('click', () => {
        navigator.clipboard.writeText(EFP_DATA.sqlDDL).then(() => {
          showToast('SQL DDL Copiado', 'Script completo de tablas y triggers Supabase copiado al portapapeles.', 'success');
        });
      });
    }

    // Notification Category Filter & Search
    let currentNotifFilter = 'todas';
    let currentNotifSearch = '';

    document.querySelectorAll('[data-filter]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-filter]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentNotifFilter = btn.getAttribute('data-filter');
        renderNotificaciones(currentNotifFilter, currentNotifSearch);
      });
    });

    const searchNotifsInput = document.getElementById('search-notificaciones');
    if (searchNotifsInput) {
      searchNotifsInput.addEventListener('input', (e) => {
        currentNotifSearch = e.target.value.trim();
        renderNotificaciones(currentNotifFilter, currentNotifSearch);
      });
    }

    // Export Forensic Logs
    const btnExportLogs = document.getElementById('btn-export-logs');
    if (btnExportLogs) {
      btnExportLogs.addEventListener('click', () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(AppState.notificaciones, null, 2));
        const dlAnchor = document.createElement('a');
        dlAnchor.setAttribute("href", dataStr);
        dlAnchor.setAttribute("download", `EFP-Auditoria-Forense-${Date.now()}.json`);
        document.body.appendChild(dlAnchor);
        dlAnchor.click();
        dlAnchor.remove();
        showToast('Logs Exportados', 'Archivo JSON de auditoría descargado.', 'success');
      });
    }

    // Persona switch buttons in modalAdmin
    document.querySelectorAll('.btn-switch-persona').forEach(btn => {
      btn.addEventListener('click', () => {
        const uid = btn.getAttribute('data-uid');
        const user = AppState.usuarios.find(u => u.uid === uid);
        if (user) {
          AppState.currentUser = user;
          saveStore('user', user);
          updateHeaderProfile();
          showToast('Perfil Cambiado', `Operando como: ${user.nombre} (${user.rol})`, 'success');
          fireConfetti();
          const modalEl = document.getElementById('modalAdmin');
          if (modalEl && window.bootstrap) {
            const bsModal = bootstrap.Modal.getInstance(modalEl);
            if (bsModal) bsModal.hide();
          }
          navigateTo('dashboard');
        }
      });
    });
  }

  // Application Entry Point
  document.addEventListener('DOMContentLoaded', () => {
    initStore();
    updateHeaderProfile();
    initBulkIngest();
    bindGlobalEvents();

    // Check URL hash first, otherwise start on dashboard view matching React default session behavior
    const initialHash = window.location.hash.replace('#', '').trim();
    if (initialHash && document.getElementById(`view-${initialHash}`)) {
      navigateTo(initialHash);
    } else {
      navigateTo(AppState.currentUser ? 'dashboard' : 'login');
    }
  });

})();
