package com.example.demo.backup.execute;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Respuesta del resultado de la ejecución del backup")
public class ExecuteBackupResponse {
    
    @Schema(description = "Indica si el proceso fue exitoso")
    private boolean success;
    
    @Schema(description = "Mensaje informativo o de error")
    private String message;
    
    @Schema(description = "Total de archivos procesados")
    private int filesProcessed;
    
    @Schema(description = "Total de bytes copiados")
    private long bytesCopied;
    
    @Schema(description = "Tiempo total de ejecución en milisegundos")
    private long durationMs;

    @Schema(description = "Lista de archivos que fallaron al copiarse")
    private List<String> failedFiles;
}
