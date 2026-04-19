package com.example.demo.ConfigBackup.delete;

import com.example.demo.common.mediator.IRequest;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DeleteBackupRequest implements IRequest<Void> {
    @Schema(description = "ID de la configuración de backup a eliminar")
    private String id;
}
