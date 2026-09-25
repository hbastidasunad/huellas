/**
 * EFP Platform - Master Datasets & Initial State
 * Contabilidad Determinista Huella Hídrica y de Carbono
 */

const EFP_DATA = {
  // Configuración oficial y conexión Supabase
  supabase: {
    defaultUrl: "https://pmtzrwdbgzufxemlwqaf.supabase.co",
    defaultKey: "sb_publishable_v9WMpFH0shnWEmzkTR8dCA_2a1UoP9K",
    projectRef: "pmtzrwdbgzufxemlwqaf"
  },

  // Perfiles de demostración rápidos
  demoUsers: [
    {
      id: "usr-admin-123",
      uid: "123123",
      usuario: "admin",
      nombre: "Administrador Principal",
      correo: "admin@corporacion.com",
      cargo: "Administrador General del Sistema",
      rol: "ADMIN_TI",
      sede_asignada: "multi-global",
      mfa_activo: true,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80",
      permisos: {
        todas_funcionalidades: true,
        super_admin: true,
        dashboard: true,
        ingesta: true,
        enmienda: true,
        notificaciones: true,
        subsanacion: true,
        auditoria: true,
        configuracion: true,
        exportar_reportes: true
      }
    },
    {
      id: "usr-elena-auditora",
      uid: "789456",
      usuario: "elena.v",
      nombre: "Dra. Elena Vásquez",
      correo: "elena.vasquez@auditoriahseq.com",
      cargo: "Auditora Externa Líder ISO 14064-3",
      rol: "AUDITOR_EXTERNO",
      sede_asignada: "multi-global",
      mfa_activo: true,
      avatar: "https://lh3.googleusercontent.com/aida/AEtjO1U8NJzip9adBozwhrpWLAwhscCkyoKK_vGkOHCAPcD6xsQGTM9DtxXdMTr4yEuxsTbutLGa1k1qOuvH1zNNhfrG81-Zg90NGjI-nXuG1e0QtCI0cwGOCEM59H1p8cYyNJMjfVupqNA2mw5LyxC8Ukra2b9x4Zhqu4LsBnMtaslUUfsrtUzOSrJ2ImMUKBSpZzIYpVwE_3J-IjT_bPTLILJJ93rodoQGAuiG_Q3SDsmBKSFTVQC60T_yHCY",
      permisos: {
        todas_funcionalidades: false,
        super_admin: false,
        dashboard: true,
        ingesta: false,
        enmienda: true,
        notificaciones: true,
        subsanacion: false,
        auditoria: true,
        configuracion: false,
        exportar_reportes: true
      }
    },
    {
      id: "usr-carlos-planta",
      uid: "456123",
      usuario: "carlos.m",
      nombre: "Ing. Carlos Mendoza",
      correo: "carlos.mendoza@corporacion.com",
      cargo: "Jefe de Operaciones Industriales Quilicura",
      rol: "RESPONSABLE_SEDE",
      sede_asignada: "CL-QLC-02",
      mfa_activo: true,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80",
      permisos: {
        todas_funcionalidades: false,
        super_admin: false,
        dashboard: true,
        ingesta: true,
        enmienda: false,
        notificaciones: true,
        subsanacion: true,
        auditoria: false,
        configuracion: false,
        exportar_reportes: true
      }
    },
    {
      id: "usr-sofia-esg",
      uid: "987654",
      usuario: "sofia.r",
      nombre: "Sofía Restrepo",
      correo: "sofia.restrepo@corporacion.com",
      cargo: "Directora Corporativa ESG & Sostenibilidad",
      rol: "LIDER_SOSTENIBILIDAD",
      sede_asignada: "multi-global",
      mfa_activo: true,
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80",
      permisos: {
        todas_funcionalidades: false,
        super_admin: false,
        dashboard: true,
        ingesta: true,
        enmienda: true,
        notificaciones: true,
        subsanacion: true,
        auditoria: true,
        configuracion: true,
        exportar_reportes: true
      }
    }
  ],

  // Resumen Corporativo de KPIs
  kpis: {
    all: {
      huella_carbono_total: 14285.74,
      carbono_variacion_vs_previo: 1.2,
      alcance_1_directo: 8920.12,
      alcance_1_porcentaje: 62.4,
      alcance_2_indirecto: 5365.62,
      alcance_2_porcentaje: 37.6,
      consumo_agua_total_m3: 128450.0,
      agua_variacion_vs_previo: -2.5,
      desbalance_agua_m3: 0.000,
      total_sedes_activas: 50,
      sedes_en_cumplimiento: 50,
      evidencias_custodiadas: 412,
      desglose: {
        combustibles_fijos: 5100.0,
        flota_movil: 3420.0,
        refrigerantes: 400.1,
        electricidad: 5365.62
      }
    },
    hq: {
      huella_carbono_total: 1240.50,
      carbono_variacion_vs_previo: -4.8,
      alcance_1_directo: 420.20,
      alcance_1_porcentaje: 33.8,
      alcance_2_indirecto: 820.30,
      alcance_2_porcentaje: 66.2,
      consumo_agua_total_m3: 8400.0,
      agua_variacion_vs_previo: -6.1,
      desbalance_agua_m3: 0.000,
      total_sedes_activas: 1,
      sedes_en_cumplimiento: 1,
      evidencias_custodiadas: 48,
      desglose: {
        combustibles_fijos: 200.0,
        flota_movil: 180.2,
        refrigerantes: 40.0,
        electricidad: 820.3
      }
    },
    planta1: {
      huella_carbono_total: 6840.10,
      carbono_variacion_vs_previo: 2.3,
      alcance_1_directo: 4800.10,
      alcance_1_porcentaje: 70.1,
      alcance_2_indirecto: 2040.00,
      alcance_2_porcentaje: 29.9,
      consumo_agua_total_m3: 74200.0,
      agua_variacion_vs_previo: -1.8,
      desbalance_agua_m3: 0.000,
      total_sedes_activas: 1,
      sedes_en_cumplimiento: 1,
      evidencias_custodiadas: 184,
      desglose: {
        combustibles_fijos: 3200.0,
        flota_movil: 1350.0,
        refrigerantes: 250.1,
        electricidad: 2040.0
      }
    },
    logistica: {
      huella_carbono_total: 3205.14,
      carbono_variacion_vs_previo: 0.8,
      alcance_1_directo: 2500.00,
      alcance_1_porcentaje: 78.0,
      alcance_2_indirecto: 705.14,
      alcance_2_porcentaje: 22.0,
      consumo_agua_total_m3: 22350.0,
      agua_variacion_vs_previo: -3.2,
      desbalance_agua_m3: 0.000,
      total_sedes_activas: 1,
      sedes_en_cumplimiento: 1,
      evidencias_custodiadas: 92,
      desglose: {
        combustibles_fijos: 500.0,
        flota_movil: 1950.0,
        refrigerantes: 50.0,
        electricidad: 705.14
      }
    }
  },

  // Sedes industriales y administrativas
  sedes: [
    {
      id: "sede-1",
      codigo_sede: "CL-SCL-01",
      nombre: "Campus Central y Labs",
      tipo_instalacion: "Oficinas / I+D",
      ciudad: "Santiago",
      pais: "Chile",
      huella_carbono_tco2e: 1240.50,
      balance_hidrico_m3: 8400.0,
      estado_auditoria: "VALIDADO_100",
      nivel_estres_hidrico: "BAJO",
      estado: "ACTIVO",
      responsable: "Dra. Elena Vásquez",
      capacidad_operativa: "1,200 colaboradores"
    },
    {
      id: "sede-2",
      codigo_sede: "CL-QLC-02",
      nombre: "Planta Quilicura Manuf.",
      tipo_instalacion: "Manufactura Pesada",
      ciudad: "Santiago",
      pais: "Chile",
      huella_carbono_tco2e: 6840.10,
      balance_hidrico_m3: 74200.0,
      estado_auditoria: "VALIDADO_100",
      nivel_estres_hidrico: "MEDIO",
      estado: "ACTIVO",
      responsable: "Ing. Carlos Mendoza",
      capacidad_operativa: "45,000 unidades/mes"
    },
    {
      id: "sede-3",
      codigo_sede: "CO-MED-04",
      nombre: "Centro Logístico Buenaventura",
      tipo_instalacion: "Distribución & Flota",
      ciudad: "Medellín",
      pais: "Colombia",
      huella_carbono_tco2e: 3205.14,
      balance_hidrico_m3: 22350.0,
      estado_auditoria: "COTEJO_FACTURAS",
      nivel_estres_hidrico: "BAJO",
      estado: "ACTIVO",
      responsable: "Mauricio Restrepo",
      capacidad_operativa: "120 tractomulas"
    },
    {
      id: "sede-4",
      codigo_sede: "CO-BOG-01",
      nombre: "Torre Administrativa Bogotá",
      tipo_instalacion: "Sede Corporativa",
      ciudad: "Bogotá",
      pais: "Colombia",
      huella_carbono_tco2e: 980.00,
      balance_hidrico_m3: 6500.0,
      estado_auditoria: "VALIDADO_100",
      nivel_estres_hidrico: "BAJO",
      estado: "ACTIVO",
      responsable: "Sofía Restrepo",
      capacidad_operativa: "850 estaciones"
    },
    {
      id: "sede-5",
      codigo_sede: "MX-MTY-03",
      nombre: "Planta Ensamblaje Monterrey",
      tipo_instalacion: "Ensamblaje Robótico",
      ciudad: "Monterrey",
      pais: "México",
      huella_carbono_tco2e: 2020.00,
      balance_hidrico_m3: 17000.0,
      estado_auditoria: "EN_REVISION",
      nivel_estres_hidrico: "ALTO",
      estado: "ACTIVO",
      responsable: "Rodrigo Peña",
      capacidad_operativa: "30,000 unidades/mes"
    }
  ],

  // Factores de emisión homologados
  factores: [
    {
      id: "fct-01",
      codigo_actividad: "ACT-GAS-NAT-IPCC",
      fuente: "Gas Natural Comercial (Combustión Fija)",
      categoria_ghg: "Alcance 1 (Fijo)",
      factor_valor: 0.00202,
      unidad: "tCO2e / m³",
      fuente_protocolo: "IPCC 2006 Guidelines Vol. 2",
      vigencia_ano: 2026,
      incertidumbre: "± 2.5%",
      estado: "APROBADO"
    },
    {
      id: "fct-02",
      codigo_actividad: "ACT-DSL-VEH-GHG",
      fuente: "Diésel B10 Automotriz (Flota Transporte)",
      categoria_ghg: "Alcance 1 (Móvil)",
      factor_valor: 2.68,
      unidad: "kgCO2e / Galón",
      fuente_protocolo: "GHG Protocol Mobile Combustion v2.6",
      vigencia_ano: 2026,
      incertidumbre: "± 1.8%",
      estado: "APROBADO"
    },
    {
      id: "fct-03",
      codigo_actividad: "ACT-RED-ELEC-COL",
      fuente: "Factor Marginal del Sistema Interconectado Nacional (UPME)",
      categoria_ghg: "Alcance 2 (Eléctrico)",
      factor_valor: 0.1642,
      unidad: "kgCO2e / kWh",
      fuente_protocolo: "UPME Colombia - FECOC 2026",
      vigencia_ano: 2026,
      incertidumbre: "± 0.9%",
      estado: "APROBADO"
    },
    {
      id: "fct-04",
      codigo_actividad: "ACT-RED-ELEC-CHL",
      fuente: "Factor Red Eléctrica SEN Chile",
      categoria_ghg: "Alcance 2 (Eléctrico)",
      factor_valor: 0.2850,
      unidad: "kgCO2e / kWh",
      fuente_protocolo: "Ministerio de Energía Chile 2026",
      vigencia_ano: 2026,
      incertidumbre: "± 1.2%",
      estado: "APROBADO"
    },
    {
      id: "fct-05",
      codigo_actividad: "ACT-REF-R410A-IPCC",
      fuente: "Gas Refrigerante R-410A (Fugas HVAC Chiller)",
      categoria_ghg: "Alcance 1 (Fijo)",
      factor_valor: 2088.0,
      unidad: "kgCO2e / kg fugado",
      fuente_protocolo: "IPCC 6to Informe de Evaluación (AR6)",
      vigencia_ano: 2026,
      incertidumbre: "± 0.0%",
      estado: "APROBADO"
    },
    {
      id: "fct-06",
      codigo_actividad: "ACT-TRP-AVN-DEFRA",
      fuente: "Transporte Aéreo Corporativo Vuelos Cortos",
      categoria_ghg: "Alcance 3 (Cadena)",
      factor_valor: 0.158,
      unidad: "kgCO2e / pasajero-km",
      fuente_protocolo: "DEFRA UK / GHG Protocol Scope 3",
      vigencia_ano: 2026,
      incertidumbre: "± 5.0%",
      estado: "APROBADO"
    }
  ],

  // Períodos de reporte y sellado criptográfico
  periodos: [
    {
      id: "prd-01",
      codigo_periodo: "2026-ANUAL",
      version: 1,
      version_label: "v1",
      estado: "CERRADO",
      es_vigente: true,
      es_inmutable: true,
      hash_ledger_sha256: "89c44e9102ab837f44a10e82cda991f83c18bb39f01e2ac9748b0213cd41fa90",
      fecha_cierre: "15-ENE-2026 18:42:09 UTC",
      cerrado_por: "Dra. Elena Vásquez (Oficial HSEQ)",
      justificacion_cierre: "Cierre anual ordinario validado bajo normas ISO 14064-1 e ISO 14046."
    },
    {
      id: "prd-02",
      codigo_periodo: "2026-ANUAL",
      version: 2,
      version_label: "v2 (Borrador Enmienda)",
      estado: "ENMIENDA_V2_BORRADOR",
      es_vigente: false,
      es_inmutable: false,
      hash_ledger_sha256: "Pendiente de Sellado Criptográfico SHA-256",
      fecha_cierre: "-",
      cerrado_por: "En proceso por Ing. Carlos Mendoza",
      justificacion_cierre: "Ajuste metodológico por reclasificación de flota diésel Euro VI."
    },
    {
      id: "prd-03",
      codigo_periodo: "2025-ANUAL",
      version: 1,
      version_label: "v1 (Definitivo)",
      estado: "CERRADO",
      es_vigente: false,
      es_inmutable: true,
      hash_ledger_sha256: "4a2176fe8901bce438812af09cba1198544e9102ab837f44a10e82cda991f83c",
      fecha_cierre: "20-ENE-2025 15:30:00 UTC",
      cerrado_por: "Comité Central HSEQ",
      justificacion_cierre: "Dictamen de aseguramiento razonable emitido sin salvedades."
    }
  ],

  // Registros rechazados que requieren subsanación
  filasSubsanacion: [
    {
      id: "sub-101",
      fila_numero: 142,
      campo_afectado: "consumo_unidad",
      valor_recibido: "GALONES",
      causa_error: "Unidad incompatible con factor UPME Gas Natural (requiere m³ estándar).",
      accion_recomendada: "Convertir a m³ usando densidad normalizada o cambiar factor a Combustible Líquido.",
      opciones_correccion: ["m³ (Gas)", "Litros (LPG)", "Ignorar Fila"],
      valor_corregido: "",
      estado: "PENDIENTE"
    },
    {
      id: "sub-102",
      fila_numero: 205,
      campo_afectado: "valor_lectura_agua",
      valor_recibido: "450,000 m³",
      causa_error: "Outlier estadístico: Lectura mensual supera en un 380% la capacidad de bombeo de la sede.",
      accion_recomendada: "Validar si se introdujo un cero adicional o verificar factura con el acueducto.",
      opciones_correccion: ["45,000 m³", "4,500 m³", "Cotejar Factura"],
      valor_corregido: "",
      estado: "PENDIENTE"
    },
    {
      id: "sub-103",
      fila_numero: 318,
      campo_afectado: "codigo_sede",
      valor_recibido: "CL-QLC-99",
      causa_error: "Código de sede no registrado en el catálogo maestro de plantas activas.",
      accion_recomendada: "Asignar a Planta Quilicura Manuf. (CL-QLC-02) o crear sede.",
      opciones_correccion: ["CL-QLC-02 (Quilicura)", "CL-SCL-01 (Campus Central)", "CO-MED-04"],
      valor_corregido: "",
      estado: "PENDIENTE"
    },
    {
      id: "sub-104",
      fila_numero: 410,
      campo_afectado: "balance_descarga",
      valor_recibido: "Descarga > Captación (Delta: -1,200 m³)",
      causa_error: "Violación de conservación de masa: El volumen descargado excede la suma de captación.",
      accion_recomendada: "Revisar medición de aguas lluvias acumuladas o reprocesar caudalímetros.",
      opciones_correccion: ["Ajustar a 8,200 m³", "Registrar Captación Pluvial", "Pendiente Auditoría"],
      valor_corregido: "",
      estado: "PENDIENTE"
    },
    {
      id: "sub-105",
      fila_numero: 529,
      campo_afectado: "evidencia_hash",
      valor_recibido: "ARCHIVO_SIN_METADATOS",
      causa_error: "Comprobante de factura no adjunto o corrupto. No supera ClamAV.",
      accion_recomendada: "Readjuntar PDF original con firma digital del proveedor.",
      opciones_correccion: ["Reemplazar Archivo PDF", "Solicitar a Proveedor", "Excluir de Ingesta"],
      valor_corregido: "",
      estado: "PENDIENTE"
    }
  ],

  // Eventos de auditoría y notificaciones forenses
  notificaciones: [
    {
      id: "notif-01",
      severidad: "CRITICA",
      codigo_error: "ERR-LEDGER-TAMPER-01",
      titulo: "Alerta de Integridad Criptográfica en Período Sellado",
      descripcion: "Se detectó intento de inserción directa de fila en tabla kpis_resumen para el período 2026-ANUAL v1. La restricción de inmutabilidad bloqueó la transacción.",
      sede_nombre: "Sede Central",
      traza_id: "TRZ-98210344",
      hace_cuanto: "Hace 12 minutos",
      bloque_ledger: "Bloque #0029-A",
      archivo_afectado: "ledger_immutable_trigger.sql",
      categoria_filtro: "critical"
    },
    {
      id: "notif-02",
      severidad: "ADVERTENCIA",
      codigo_error: "WRN-WATER-ANOMALY-04",
      titulo: "Desviación Telemétrica en Caudalímetro Principal",
      descripcion: "El sensor ultrasónico de descarga de Planta Quilicura reportó un desvío volumétrico del +8.4% durante la ventana horaria de cambio de turno.",
      sede_nombre: "Planta Quilicura",
      traza_id: "TRZ-98210190",
      hace_cuanto: "Hace 1 hora",
      bloque_ledger: "Bloque #0028-C",
      archivo_afectado: "telemetry_quilicura_stream.csv",
      categoria_filtro: "warning"
    },
    {
      id: "notif-03",
      severidad: "INFO",
      codigo_error: "INF-FACTOR-RENEWED-09",
      titulo: "Factor de Emisión UPME 2026 Actualizado y Homologado",
      descripcion: "El factor eléctrico de red marginal para Colombia (0.1642 kgCO2e/kWh) fue validado y sellado en el catálogo oficial de factores.",
      sede_nombre: "Global",
      traza_id: "TRZ-98209800",
      hace_cuanto: "Hace 3 horas",
      bloque_ledger: "Bloque #0028-B",
      archivo_afectado: "upme_resolucion_2026.pdf",
      categoria_filtro: "info"
    },
    {
      id: "notif-04",
      severidad: "ADVERTENCIA",
      codigo_error: "WRN-INGEST-REJECT-02",
      titulo: "5 Registros Requeridos en Bandeja de Subsanación",
      descripcion: "La última carga masiva de facturas de gas presentó 5 inconsistencias en unidades de medida que requieren aprobación manual.",
      sede_nombre: "Centro Logístico Buenaventura",
      traza_id: "TRZ-98209120",
      hace_cuanto: "Hace 5 horas",
      bloque_ledger: "Bloque #0027-F",
      archivo_afectado: "facturas_gas_q1_batch.xlsx",
      categoria_filtro: "warning"
    }
  ],

  // Evidencias custodiadas
  evidencias: [
    {
      id: "evi-01",
      nombre_archivo: "factura_gas_enero_sedeA.pdf",
      tamano_legible: "2.4 MB",
      modulo_asociado: "Alcance 1 (Fijos)",
      categoria_ghg: "Scope 1 Stationary Combustion",
      hash_sha256: "9a7bc310ef89a12401f89c44e9102ab837f44a10e82cda991f83c18bb39f01e2",
      estado_clamav: "LIMPIO",
      estado_auditoria: "VALIDADO",
      fecha_carga: "2026-09-22 14:10"
    },
    {
      id: "evi-02",
      nombre_archivo: "recibo_acueducto_q1.pdf",
      tamano_legible: "1.1 MB",
      modulo_asociado: "Balance Hídrico",
      categoria_ghg: "Water Balance Inflow",
      hash_sha256: "b48cf098ad234e6510f89c44e9102ab837f44a10e82cda991f83c18bb39f01e3",
      estado_clamav: "LIMPIO",
      estado_auditoria: "VALIDADO",
      fecha_carga: "2026-09-22 14:15"
    },
    {
      id: "evi-03",
      nombre_archivo: "cert_emisiones_alcance2.xlsx",
      tamano_legible: "840 KB",
      modulo_asociado: "Alcance 2 (Eléctrico)",
      categoria_ghg: "Grid Factor Certificate (UPME)",
      hash_sha256: "3819fa894018cf4410f89c44e9102ab837f44a10e82cda991f83c18bb39f01e4",
      estado_clamav: "LIMPIO",
      estado_auditoria: "VALIDADO",
      fecha_carga: "2026-09-22 14:20"
    }
  ],

  // Trazabilidad de operaciones
  trazabilidad: [
    {
      id: "tr-01",
      operacion: "Cálculo Determinista ISO 14064 Ejecutado",
      usuario_responsable: "admin (UID: 123123)",
      ip_origen: "190.144.12.88",
      hora: "14:40:12",
      estado: "EXITOSO",
      detalles: "14,285.74 tCO2e total calculadas sin redondeos flotantes",
      hash_bloque: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
    },
    {
      id: "tr-02",
      operacion: "Balance Hídrico ISO 14046 Validado",
      usuario_responsable: "elena.v (Auditor HSEQ)",
      ip_origen: "186.28.241.10",
      hora: "14:38:05",
      estado: "EXITOSO",
      detalles: "Desbalance de masa = 0.000 m³ verificado",
      hash_bloque: "ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb"
    },
    {
      id: "tr-03",
      operacion: "Escaneo Antivirus ClamAV y Hash SHA-256",
      usuario_responsable: "Daemon Automatizado",
      ip_origen: "10.0.4.12 (Internal)",
      hora: "14:35:50",
      estado: "EXITOSO",
      detalles: "3 evidencias procesadas sin código malicioso",
      hash_bloque: "3e23e8160039594a33894f6564e1b1348bbd7a0088d42c4acb73eeaed59c009d"
    }
  ],

  // Script SQL DDL Completo para Supabase PostgreSQL
  sqlDDL: `-- =====================================================================
-- EFP PLATFORM - DDL ESQUEMA COMPLETO PARA SUPABASE POSTGRESQL
-- Plataforma Determinista para Huella Hídrica y de Carbono
-- Normativas: ISO 14064-1, ISO 14064-3, ISO 14046, GHG Protocol
-- =====================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Catálogo Maestro de Sedes Operativas
CREATE TABLE IF NOT EXISTS sedes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo_sede VARCHAR(50) NOT NULL UNIQUE,
    nombre VARCHAR(150) NOT NULL,
    tipo_instalacion VARCHAR(100) NOT NULL,
    ciudad VARCHAR(100) NOT NULL,
    pais VARCHAR(100) NOT NULL,
    huella_carbono_tco2e NUMERIC(18, 6) DEFAULT 0.000000,
    balance_hidrico_m3 NUMERIC(18, 6) DEFAULT 0.000000,
    estado_auditoria VARCHAR(50) DEFAULT 'VALIDADO_100',
    nivel_estres_hidrico VARCHAR(50) DEFAULT 'BAJO',
    estado VARCHAR(20) DEFAULT 'ACTIVO',
    creado_en TIMESTAMPTZ DEFAULT NOW(),
    actualizado_en TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Usuarios y Control de Acceso RBAC
CREATE TABLE IF NOT EXISTS usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario VARCHAR(100) NOT NULL UNIQUE,
    correo VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    rol VARCHAR(50) NOT NULL DEFAULT 'ADMIN_TI',
    estado VARCHAR(20) NOT NULL DEFAULT 'ACTIVO',
    sede_id UUID,
    creado_en TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Perfil de Usuario con Permisos Granulares
CREATE TABLE IF NOT EXISTS perfil (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    nombre VARCHAR(150) NOT NULL,
    apellidos VARCHAR(150),
    cargo VARCHAR(150) NOT NULL DEFAULT 'Administrador General del Sistema',
    telefono VARCHAR(50) DEFAULT '+57 (300) 123-4567',
    avatar_url TEXT,
    sede_asignada VARCHAR(100) DEFAULT 'multi-global',
    mfa_activo BOOLEAN DEFAULT TRUE,
    permisos JSONB DEFAULT '{"todas_funcionalidades": true, "super_admin": true, "dashboard": true, "ingesta": true, "enmienda": true, "notificaciones": true, "subsanacion": true, "auditoria": true, "configuracion": true, "exportar_reportes": true}'::jsonb,
    creado_en TIMESTAMPTZ DEFAULT NOW(),
    actualizado_en TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Períodos Contables y Sellado Criptográfico
CREATE TABLE IF NOT EXISTS periodos_reporte (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo_periodo VARCHAR(50) NOT NULL,
    version INTEGER NOT NULL DEFAULT 1,
    version_label VARCHAR(50) NOT NULL DEFAULT 'v1',
    estado VARCHAR(50) NOT NULL DEFAULT 'CERRADO',
    es_vigente BOOLEAN NOT NULL DEFAULT TRUE,
    es_inmutable BOOLEAN NOT NULL DEFAULT FALSE,
    hash_ledger_sha256 VARCHAR(64),
    fecha_cierre VARCHAR(100),
    cerrado_por VARCHAR(150),
    justificacion_cierre TEXT,
    creado_en TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Resumen de Métricas Bento KPIs
CREATE TABLE IF NOT EXISTS kpis_resumen (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo_periodo VARCHAR(50) NOT NULL DEFAULT '2026-ANUAL',
    huella_carbono_total NUMERIC(18, 6) NOT NULL DEFAULT 14285.74,
    carbono_variacion_vs_previo NUMERIC(6, 2) NOT NULL DEFAULT 1.20,
    alcance_1_directo NUMERIC(18, 6) NOT NULL DEFAULT 8920.12,
    alcance_1_porcentaje NUMERIC(6, 2) NOT NULL DEFAULT 62.40,
    alcance_2_indirecto NUMERIC(18, 6) NOT NULL DEFAULT 5365.62,
    alcance_2_porcentaje NUMERIC(6, 2) NOT NULL DEFAULT 37.60,
    consumo_agua_total_m3 NUMERIC(18, 6) NOT NULL DEFAULT 128450.00,
    agua_variacion_vs_previo NUMERIC(6, 2) NOT NULL DEFAULT -2.50,
    desbalance_agua_m3 NUMERIC(18, 6) NOT NULL DEFAULT 0.000,
    total_sedes_activas INTEGER NOT NULL DEFAULT 50,
    sedes_en_cumplimiento INTEGER NOT NULL DEFAULT 50,
    evidencias_custodiadas INTEGER NOT NULL DEFAULT 412,
    actualizado_en TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Catálogo de Factores de Emisión Homologados
CREATE TABLE IF NOT EXISTS factores_emision (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo_actividad VARCHAR(100) NOT NULL,
    fuente VARCHAR(150) NOT NULL,
    categoria_ghg VARCHAR(100) NOT NULL,
    unidad VARCHAR(30) NOT NULL,
    factor_valor NUMERIC(18, 8) NOT NULL,
    fuente_protocolo VARCHAR(150) NOT NULL,
    vigencia_ano INTEGER NOT NULL DEFAULT 2026,
    incertidumbre VARCHAR(20) DEFAULT '± 2.0%',
    estado VARCHAR(30) DEFAULT 'APROBADO',
    creado_en TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Inserción de Administrador Inicial por defecto
INSERT INTO usuarios (usuario, correo, password, rol, estado)
VALUES ('admin', 'admin@corporacion.com', '123123', 'ADMIN_TI', 'ACTIVO')
ON CONFLICT (usuario) DO NOTHING;`
};
