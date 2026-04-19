package com.example.demo.ConfigBackup.create;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "Respuesta de la creación de una configuración de backup")
public class CreateBackupResponse {

    @Schema(description = "ID único de la configuración creada")
    private String id;

    @Schema(description = "Nombre de la configuración", example = "Backup Semanal Servidor")
    private String name;

    @Schema(description = "Estado actual de la configuración", example = "CREATED")
    private String status;
}
