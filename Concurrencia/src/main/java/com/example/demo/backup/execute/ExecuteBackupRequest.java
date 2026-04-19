package com.example.demo.backup.execute;

import com.example.demo.common.mediator.IRequest;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.example.demo.common.entities.BackupConfig;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.io.File;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Solicitud para ejecutar un proceso de backup")
public class ExecuteBackupRequest implements IRequest<ExecuteBackupResponse> {

    @Schema(description = "ID de la configuración de backup a ejecutar", requiredMode = Schema.RequiredMode.REQUIRED)
    private String configId;

    @Schema(description = "Ruta de destino opcional (sobreescribe la configurada)", example = "/home/user/backups/manual")
    private String destinationOverride;

    @JsonIgnore
    private transient BackupConfig resolvedConfig;

    @JsonIgnore
    private transient List<File> resolvedFilesToCopy;
}
