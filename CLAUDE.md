# Contexto del Proyecto: Sistema de Gestión de Agentes (HDSSD)

## Finalidad
Plataforma para la gestión integral de perfiles de Agentes y Oficiales de seguridad del Hospital SEMMA Santo Domingo. Permite el control de datos personales, rangos, instituciones y expedientes visuales, además de la generación de listados de guardia basados en zonas y turnos.

## Arquitectura y Patrones
*   **Modelo de Capas (Backend):** 
    *   **Controllers:** Delgados (Thin), encargados solo de la orquestación HTTP.
    *   **Services:** Capa de lógica de negocio pura (Inyección de `IOutputCacheStore`, `IFileSaver`, `IMapper`, `UserManager`).
    *   **Repositories:** Acceso a datos centralizado mediante `BaseRepository<T>` genérico para operaciones CRUD estándar.
*   **Manejo de Errores:** Middleware global (`GlobalExceptionMiddleware`) que estandariza las respuestas de error bajo el estándar RFC 7807 (Problem Details).
*   **Seguridad y Roles:** Gestión dinámica de roles (`Admin`, `Operator`, `Viewer`) integrada en `UserManagementService`.
*   **Comunicación:** RESTful API con uso intensivo de DTOs y AutoMapper.

## Stack Tecnológico
*   **Frontend:** Angular 19.
    *   **Estado:** Uso de **Signals** (`signal`, `computed`) para la reactividad de la UI, incluyendo la gestión reactiva de roles de usuario.
    *   **Formularios:** Reactive Forms vinculados a una utilidad centralizada (`FormDataUtil`) para la conversión a `multipart/form-data`.
    *   **Control Flow:** Uso de sintaxis moderna (`@if`, `@for`, `@empty`).
    *   **UI:** Bootstrap 5 + ngx-toastr + ngx-mask.
*   **Backend:** .NET Core 8 Web API.
    *   **ORM:** Entity Framework Core.
    *   **Seguridad:** ASP.NET Core Identity + JWT Authentication.
    *   **Caché:** Output Caching con invalidación por tags (`EvictByTagAsync`).

## Convenciones y Decisiones Técnicas
*   **Estandarización de FormData:** Toda conversión de formulario a `FormData` debe pasar por `FormDataUtil.toFormData()`. Esta utilidad se encarga de:
    *   Formatear fechas a `YYYY-MM-DD`.
    *   Omitir strings vacíos o nulos (para forzar `null` en el backend y evitar errores de validación).
    *   Manejar la carga de archivos físicos.
*   **Gestión de Archivos:** Las imágenes se guardan en el servidor y se sirven desde `wwwroot`. El frontend debe manejar fallbacks a imágenes por defecto (`default-male.jpg`, `default-female.jpg`) en caso de error o ausencia de ruta.
*   **Validación de Errores:** Las validaciones del `ModelState` (400 Bad Request) se mapean dinámicamente a los campos del `FormGroup` en Angular usando `setErrors({ serverError: ... })`.
*   **Caché:** Las listas de agentes, instituciones y rangos usan caché de salida. Cualquier operación de escritura (POST, PUT, DELETE) debe invalidar el tag correspondiente (`agents`, `institutions`, `ranks`).

## Infraestructura (Target)
*   **Base de Datos:** SQL Server (On-premise).
*   **Despliegue:** Contenedores Docker en servidor virtual.


## Testing Conventions

### TDD Workflow
- Always write failing tests BEFORE implementation
- Use AAA pattern: Arrange-Act-Assert
- One assertion per test when possible
- Test names describe behavior: "should_return_empty_when_no_items"

### Test-First Rules
- When I ask for a feature, write tests first
- Tests should FAIL initially (no implementation exists)
- Only after tests are written, implement minimal code to pass