package com.example.demo.ConfigBackup.update;

import com.example.demo.common.mediator.IRequest;
import com.fasterxml.jackson.annotation.JsonIgnore;
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
@Schema(description = "Solicitud para actualizar una configuración de backup")
public class UpdateBackupRequest implements IRequest<UpdateBackupResponse> {

    @JsonIgnore
    @Schema(hidden = true)
    private String id;

    @Schema(description = "Nombre descriptivo de la configuración", example = "Backup Semanal Servidor Modificado")
    private String name;

    @Schema(description = "Lista de directorios a respaldar", example = "[\"/home/user/documentos\", \"/var/www/html\"]")
    private List<String> sourcePaths;

    @Schema(description = "Directorio donde se guardará el backup", example = "/mnt/backup_drive/2026")
    private String destinationPath;

    @Schema(description = "Cantidad de hilos para procesamiento paralelo", example = "4")
    private Integer threadCount;

    @Schema(description = "Indica si se deben incluir carpetas estándar del SO", example = "true")
    private boolean includeStandardPaths;

    @Schema(description = "Tamaño máximo permitido para el backup en GB", example = "100.5")
    private Double maxSizeGb;

    @Schema(description = "Lista de extensiones permitidas", example = "[\"jpg\", \"pdf\"]")
    private List<String> includedExtensions;

    @Schema(description = "Lista de extensiones excluidas", example = "[\"tmp\"]")
    private List<String> excludedExtensions;
}
