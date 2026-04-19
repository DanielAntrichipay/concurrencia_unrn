# TP 1 Concurrencia 2026 - UNRN

Este proyecto es el Trabajo Práctico N° 1 de la materia Programación Concurrente (2026) en la Universidad Nacional de Río Negro.

## Contexto del Proyecto

- **Lenguaje:** Java 25
- **Gestor de Dependencias:** Maven
- **Objetivo:** Implementación de soluciones concurrentes.

## Guías de Desarrollo

### Estándares de Código
- Seguir las convenciones de nomenclatura de Java.
- Documentar el código utilizando Javadoc donde sea necesario, especialmente en secciones complejas de concurrencia.
- Utilizar las características de Java 25 (como Virtual Threads si es aplicable).

### Concurrencia
- Priorizar el uso de abstracciones de alto nivel (`java.util.concurrent`) sobre el uso directo de `Thread` si es posible.
- Evitar condiciones de carrera y deadlocks.
- Validar la seguridad de hilos (thread-safety) en todas las implementaciones.

### Flujo de Trabajo para Gemini CLI
- **Investigación:** Antes de proponer cambios, analizar el impacto en la sincronización de datos.
- **Pruebas:** Siempre crear tests unitarios para verificar la correctitud de los algoritmos concurrentes.
- **Validación:** Ejecutar `mvn clean verify` para asegurar que el proyecto compila y los tests pasan.

## Comandos Útiles

- Compilar: `mvn compile`
- Ejecutar tests: `mvn test`
- Empaquetar: `mvn package`
- Ejecutar Main: `mvn exec:java -Dexec.mainClass="org.example.Main"`
