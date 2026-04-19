package com.example.demo.ConfigBackup.list;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Respuesta con los detalles de una configuración de backup")
public class ListBackupResponse {
    @Schema(description = "ID único de la configuración")
    private String id;

    @Schema(description = "Nombre descriptivo de la configuración", example = "Backup Fotos")
    private String name;

    @Schema(description = "Lista de rutas de origen a respaldar")
    private List<String> sourcePaths;

    @Schema(description = "Ruta de destino donde se guardará el backup")
    private String destinationPath;

    @Schema(description = "Cantidad de hilos configurados para el procesamiento")
    private Integer threadCount;

    @Schema(description = "Sistema operativo donde se creó la configuración")
    private String osType;

    @Schema(description = "Indica si la configuración está activa")
    private boolean enabled;

    @Schema(description = "Fecha y hora de creación")
    private LocalDateTime createdOn;
}
