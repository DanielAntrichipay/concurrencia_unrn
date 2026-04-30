package com.example.demo.ConfigBackup.create;

import com.example.demo.common.mediator.IRequest;
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
@Schema(description = "Solicitud para crear una nueva configuración de backup")
public class CreateBackupRequest implements IRequest<CreateBackupResponse> {

    @Schema(description = "Nombre descriptivo de la configuración", example = "Backup Semanal Servidor")
    private String name;

    @Schema(description = "Lista de directorios a respaldar", example = "[\"/home/user/documentos\", \"/var/www/html\"]")
    private List<String> sourcePaths;

    @Schema(description = "Directorio donde se guardará el backup", example = "/home/user/backups/manual")
    private String destinationPath;

    @Schema(description = "Cantidad de hilos para procesamiento paralelo", example = "4", defaultValue = "1")
    private Integer threadCount;

    @Schema(description = "Indica si se deben incluir carpetas estándar del SO (Documentos, Imágenes, etc.)", example = "true")
    private boolean includeStandardPaths;

    @Schema(description = "Tamaño máximo permitido para el backup en GB", example = "100.5")
    private Double maxSizeGb;

    @Schema(description = "Lista de extensiones permitidas (si está vacía, permite todas)", example = "[\"jpg\", \"pdf\", \"docx\"]")
    private List<String> includedExtensions;

    @Schema(description = "Lista de extensiones excluidas", example = "[\"tmp\", \"log\", \"exe\"]")
    private List<String> excludedExtensions;
}
