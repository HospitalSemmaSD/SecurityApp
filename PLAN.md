# Plan de Revisión y Alineación del Proyecto (HDSSD)

Este archivo sirve como referencia de las tareas identificadas para mantener la consistencia con las directrices técnicas del proyecto definidas en `GEMINI.md`.

---

## 1. Estado Actual y Diagnóstico del Proyecto

### 🏗️ Arquitectura y Compilación
*   **Backend (.NET Core 8 Web API):** Compila correctamente. Se detectó una advertencia de compilación en `DashboardService.cs` en la línea 52 (posible desreferencia de referencia nula al agrupar por `Rank.Name` ya que la relación puede ser nula).
*   **Frontend (Angular 19):** Compila con éxito. Genera el bundle correctamente y utiliza reactividad moderna basada en **Signals** en varios módulos clave (Agent list, User form, etc.).

---

## 2. Alineación con las Directrices de `GEMINI.md`

| Directriz de GEMINI.md | Estado en el Proyecto | Observaciones / Tareas Pendientes |
| :--- | :---: | :--- |
| **Estandarización de FormData** | 🟢 Conforme | Se utiliza `FormDataUtil.toFormData()` en `AgentFormComponent` (el único formulario que maneja carga de archivos físicos). Los demás envían JSON nativo según lo esperado por los controladores. |
| **Gestión de Archivos** | 🟢 Conforme | Las imágenes por defecto (`default-male.jpg` y `default-female.jpg`) se sirven desde `wwwroot/agents` en el backend y el frontend maneja correctamente el fallback en `getProfileImage()`. |
| **Caché (Output Caching)** | 🟢 Conforme | Implementado en el backend con invalidación automática basada en tags (`agents`, `institutions`, `ranks`) en los respectivos servicios al realizar operaciones de escritura. |
| **Validación de Errores (ModelState)** | 🟡 Parcial | **Solo** el formulario de Agentes (`agent-form.component.ts`) implementa el mapeo dinámico de errores 400 (ModelState) a los campos del formulario usando `setErrors({ serverError: ... })`. Los demás formularios (`user-form`, `incident-form`, `notice-form`, `institution-list`, `rank-list`) muestran mensajes genéricos o alertas `ngx-toastr` en lugar de marcar los inputs del formulario dinámicamente. |

---

## 3. Plan de Acción (Checklist de Tareas)

### 🖥️ Backend (.NET API)
- [x] **Resolver advertencia CS8602 en `DashboardService.cs`:**
  - Modificar la consulta LINQ en `GetRankDistributionAsync()` para proteger la desreferencia nula utilizando un fallback (ej: `a.Rank != null ? a.Rank.Name : "Sin Rango"` o `a.Rank!.Name` con la supresión de null-safety en EF Core).

### 🎨 Frontend (Angular 19)
- [x] **Estandarizar Mapeo de Errores de Validación (ModelState):**
  - Implementar la función `mapServerErrors` en los siguientes formularios para inyectar los errores de validación de la API directamente a los inputs:
    - [x] `UserFormComponent` (`sec-app-front/src/app/features/users/user-form/user-form.component.ts`)
    - [x] `IncidentFormComponent` (`sec-app-front/src/app/features/incidents/incident-form/incident-form.component.ts`)
    - [x] `NoticeFormComponent` (`sec-app-front/src/app/features/notices/notice-form/notice-form.component.ts`)
    - [x] `InstitutionListComponent` (`sec-app-front/src/app/features/institutions/institution-list/institution-list.component.ts`)
    - [x] `RankListComponent` (`sec-app-front/src/app/features/ranks/rank-list/rank-list.component.ts`)
  - Asegurar que los componentes de la interfaz de usuario muestren la clase `is-invalid` y contengan la correspondiente visualización del error en un bloque `<div class="invalid-feedback">` en sus archivos HTML.

---

## 4. Nuevas Funcionalidades Propuestas (Roadmap de Desarrollo)

### 📈 Auditoría y Trazabilidad Completa
- [ ] **Registrar Acciones de Agentes:** Inyectar `IAuditService` en `AgentService` y registrar en la bitácora la creación, modificación y desactivación de agentes.
- [ ] **Registrar Acciones de Usuarios:** Registrar el inicio y cierre de sesión de los usuarios de la plataforma en `AuditLogs`.

### 🌓 Modo Oscuro (UI/UX para Monitoreo Nocturno)
- [ ] **Soporte de Estilos CSS:** Diseñar los tokens de color del modo oscuro y agregarlos al sistema CSS.
- [ ] **Toggle de Modo Oscuro:** Añadir un botón o selector de tema (Claro / Oscuro) en la barra superior o menú lateral (`main-layout`).

### 📊 Exportación Completa a Excel (.xlsx)
- [ ] **Instalar Librería de Excel:** Configurar `xlsx` (SheetJS) en el frontend.
- [ ] **Exportación de Catálogo de Agentes:** Botón para descargar el listado filtrado de personal.
- [ ] **Exportación de Bitácora:** Botón para exportar el historial de auditoría de seguridad.
- [ ] **Exportación de Lista de Servicios:** Botón para exportar a planilla excel la guardia de la semana.

### 🛡️ Seguridad Avanzada (Autenticación)
- [ ] **Refresh Tokens:** Implementar la lógica para refrescar tokens JWT automáticamente sin obligar al usuario a iniciar sesión repetidamente.
- [ ] **Bloqueo Temporal de Cuentas:** Añadir control de intentos fallidos en el backend para bloquear la cuenta temporalmente.

### 📝 Registro de Logs del Servidor (Logging)
- [ ] **Configurar Serilog/NLog:** Configurar un framework de logs en el backend (.NET Core) para registrar excepciones y trazas operativas en archivos físicos diarios rotativos (ej. `logs/log-YYYY-MM-DD.txt`).

---

## 5. Plan de Verificación

*   **Pruebas de Compilación:**
    *   Ejecutar `dotnet build SecAppBack/SecApp.sln` para certificar que el backend compila con 0 advertencias.
    *   Ejecutar `npm run build` en `sec-app-front` para validar que el frontend compila correctamente y no tiene errores de TypeScript o plantillas.
