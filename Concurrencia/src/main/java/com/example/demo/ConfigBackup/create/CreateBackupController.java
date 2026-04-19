package com.example.demo.ConfigBackup.create;

import com.example.demo.common.mediator.JMediator;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/backups")

@Tag(name = "Backups", description = "Endpoints para la gestión de copias de seguridad")
public class CreateBackupController {

    private final JMediator mediator;

    public CreateBackupController(JMediator mediator) {
        this.mediator = mediator;
    }

    @PostMapping
    @Operation(summary = "Crear configuración de backup", description = "Crea una nueva configuración de backup con soporte para múltiples rutas y filtros.")
    public CreateBackupResponse create(@RequestBody CreateBackupRequest request) throws Throwable {
        return mediator.send(request);
    }
}
