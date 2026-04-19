package com.example.demo.ConfigBackup.update;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "Respuesta de la actualización de una configuración de backup")
public class UpdateBackupResponse {

    @Schema(description = "ID único de la configuración actualizada")
    private String id;

    @Schema(description = "Nombre de la configuración", example = "Backup Semanal Servidor Modificado")
    private String name;

    @Schema(description = "Estado actual de la configuración", example = "UPDATED")
    private String status;
}
