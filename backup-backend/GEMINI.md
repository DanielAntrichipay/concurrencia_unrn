# Descripción General del Proyecto: Concurrencia

Este proyecto es una aplicación Spring Boot diseñada para realizar copias de seguridad de forma simple y útil, aprovechando el procesamiento multihilo para maximizar la eficiencia en backups de PCs o servidores.

## Tecnologías Utilizadas
- **Java:** 21
- **Framework:** Spring Boot 4.0.5
- **Base de Datos:** H2 (En memoria, accesible en `/h2-console`)
- **Documentación:** OpenAPI 3 / Swagger (Accesible en `/swagger-ui.html`)
- **Mapeo:** MapStruct 1.6.3
- **Patrones:** Mediator (Personalizado) y Vertical Slice Architecture.

## Conceptos Clave

### Vertical Slice Architecture
Cada funcionalidad (ej. `ConfigBackups`) se organiza en su propio paquete conteniendo su controlador, requests, responses, handlers y validadores. Esto minimiza el acoplamiento y facilita la mantenibilidad.

### Patrón Mediator
Se utiliza `JMediator` para despachar peticiones de forma desacoplada. El controlador solo conoce el `mediador` y el `Request`, mientras que el `Handler` correspondiente es descubierto automáticamente en tiempo de ejecución.

### Configuración Flexible de Backups
- **Múltiples Orígenes:** Capacidad de definir una lista ilimitada de directorios.
- **Detección Automática:** Opción para incluir carpetas estándar del sistema (Documentos, Imágenes, etc.) según el SO detectado.
- **Control de Concurrencia:** Definición manual del número de hilos.
- **Filtros:** Inclusión/Exclusión de archivos por extensión y límite de tamaño total en GB.

## Flujos de Trabajo de Desarrollo

### Ejecución y Monitoreo
1. Arrancar la aplicación con `./mvnw spring-boot:run`.
2. Verificar los enlaces de acceso en la consola al inicio.
3. Probar los endpoints mediante Swagger UI.

### Creación de Nuevas Funcionalidades
1. Definir la entidad en `common.entities` si es necesario.
2. Crear un nuevo paquete bajo `features` o similar para el slice.
3. Implementar Request (implementando `IRequest`), Handler (anotado con `@Handler`) y Validator (anotado con `@Validator`).
4. Definir el Mapper en el paquete de la funcionalidad.

## Bitácora - 16 de Abril, 2026

### Tareas Realizadas:
- **Corrección de Infraestructura:** Se arregló un import estático roto en `JMediator` y se configuró correctamente el orden de procesamiento de Lombok y MapStruct en el `pom.xml`.
- **Implementación de Slice "ConfigBackups":**
    - Creación de la entidad `BackupConfig` con soporte para listas de rutas, filtros de extensión y detección de carpetas de usuario por SO.
    - Implementación del flujo completo: `Controller` -> `JMediator` -> `Validator` -> `Handler`.
- **Integración de MapStruct:** Sustitución del mapeo manual por interfaces de MapStruct para una transformación de datos más limpia.
- **Documentación OpenAPI:** Se anotaron los DTOs y controladores con `@Schema` y `@Operation` para generar un Swagger detallado y útil.
- **Mejora de Experiencia de Usuario (Consola):** Se añadió un `EventListener` para imprimir las URLs de Swagger y H2 Console al iniciar la aplicación.
- **Resolución de Conflictos:** Se eliminaron archivos y entidades duplicadas generadas durante la reorganización de paquetes, estabilizando el contexto de persistencia de Hibernate.

## Bitácora - 17 de Abril, 2026

### Tareas Realizadas:
- **Estabilización del Slice de Configuración:**
    - Corregido error de Jackson (`InvalidDefinitionException`) en `CreateBackupRequest` mediante la adición de `@NoArgsConstructor` y `@AllArgsConstructor`, permitiendo la deserialización correcta de JSON en peticiones POST.
    - Verificación de persistencia exitosa: confirmación mediante logs de Hibernate de la inserción correcta de `BackupConfig` y sus tablas asociadas (`source_paths`, `extensions`).
    - Clarificación de la configuración de acceso a **H2 Console** para evitar errores de base de datos no encontrada.
- **Validación del Patrón Mediator:** Se comprobó el flujo completo `Controller -> JMediator -> Handler -> Repository`, asegurando que el descubrimiento automático de handlers funciona según lo previsto.

## Bitácora - 19 de Abril, 2026

### Tareas Realizadas:
- **Implementación de Slice de Listado:**
    - Creación del endpoint `GET /api/backups` para listar todas las configuraciones.
    - Corrección de error de tipos en DTO (`Long` a `String`) para compatibilidad con el `UUID` de la entidad.
    - Documentación completa de respuestas con `@Schema` de OpenAPI.
- **Implementación de Slice de Ejecución de Backup:**
    - Creación del endpoint `POST /api/backups/execute` para disparar el proceso.
    - Desarrollo de lógica de escaneo recursivo con soporte para filtros de inclusión y exclusión por extensión.
    - Implementación de motor de copia multihilo utilizando `CompletableFuture` y `FixedThreadPool` basado en la configuración.
    - Preservación de la estructura de directorios relativa en el destino.
    - Captura de métricas de ejecución (archivos procesados, bytes copiados y duración).

- **Implementación de Historial y Validación:**
    - Creación de la entidad `BackupExecution` y su repositorio para registrar métricas de cada backup.
    - Implementación de validación de tamaño máximo (`maxSizeGb`) antes de la ejecución.
- **Optimización para Discos Externos (NTFS/FUSE):**
    - Resolución de problemas de escritura mediante el uso de `FileDescriptor.sync()` para forzar la persistencia física al hardware.
    - Sustitución de NIO por `FileOutputStream` para mayor compatibilidad con drivers FUSE en Linux.
    - Mejora en la resolución de rutas relativas y normalización de paths absolutos.

- **Refactorización de Arquitectura (Separación de Responsabilidades):**
    - Extracción de toda la lógica de validación de negocio y escaneo de disco desde `ExecuteBackupHandler` hacia `ExecuteBackupValidator`.
    - Implementación de caché en memoria dentro del `ExecuteBackupRequest` usando `@JsonIgnore` y `transient` (`resolvedConfig` y `resolvedFilesToCopy`) para evitar consultas redundantes a BD y escaneos de disco.
    - Simplificación del `ExecuteBackupHandler`, dejándolo exclusivamente responsable de la orquestación multihilo y guardado del historial.
    - Actualización de anotaciones de Swagger OpenAPI (`requiredMode`) y limpieza de advertencias obsoletas en la invocación polimórfica del `JMediator`.

## Estado del Proyecto
- **Compilación:** EXITOSA.
- **Persistencia:** Verificada y funcional (Configuraciones e Historial).
- **Motor de Ejecución:** Robusto, compatible con unidades externas y verificado físicamente con `sync()`.
- **Pendiente:** Gestión de borrado/actualización de configs y endpoints de consulta de historial.
