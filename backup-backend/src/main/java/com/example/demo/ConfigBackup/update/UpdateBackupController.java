package com.example.demo.ConfigBackup.update;

import com.example.demo.common.mediator.JMediator;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/backups")
@Tag(name = "Backups", description = "Endpoints para la gestión de copias de seguridad")
public class UpdateBackupController {

    private final JMediator mediator;

    public UpdateBackupController(JMediator mediator) {
        this.mediator = mediator;
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar configuración de backup", description = "Actualiza los datos de una configuración existente.")
    public UpdateBackupResponse update(@PathVariable String id, @RequestBody UpdateBackupRequest request) throws Throwable {
        request.setId(id);
        return mediator.send(request);
    }
}
