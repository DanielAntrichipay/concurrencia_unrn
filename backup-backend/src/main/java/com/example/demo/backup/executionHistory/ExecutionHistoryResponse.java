package com.example.demo.backup.executionHistory;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.List;

@Getter
@Setter
@Schema(name = "ExecutionHistoryResponse", description = "Representa el registro histórico de una ejecución de backup con sus métricas")
public class ExecutionHistoryResponse {
    
    @Schema(description = "Identificador único del registro de ejecución", example = "550e8400-e29b-41d4-a716-446655440000")
    private String id;
    
    @Schema(description = "ID de la configuración de backup asociada", example = "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11")
    private String backupConfigId;
    
    @Schema(description = "Nombre descriptivo del backup", example = "Backup Semanal Documentos")
    private String backupName;
    
    @Schema(description = "Fecha y hora exacta en la que se inició la ejecución")
    private Instant executionDate;
    
    @Schema(description = "Indica si el proceso de copia finalizó correctamente")
    private boolean success;
    
    @Schema(description = "Mensaje detallado del estado final o error encontrado")
    private String message;
    
    @Schema(description = "Cantidad total de archivos que fueron procesados durante la ejecución")
    private Integer filesProcessed;
    
    @Schema(description = "Tamaño total en bytes de los datos que fueron efectivamente copiados")
    private Long bytesCopied;
    
    @Schema(description = "Tiempo total que tomó la ejecución expresado en milisegundos")
    private Long durationMs;
    
    @Schema(description = "Listado de rutas absolutas de los archivos que no pudieron ser procesados")
    private List<String> failedFiles;
}
