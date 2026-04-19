package com.example.demo.backup.execute;

import com.example.demo.common.mediator.JMediator;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/backups/execute")
@Tag(name = "Backups", description = "Endpoints para la gestión de copias de seguridad")
@RequiredArgsConstructor
public class ExecuteBackupController {

    private final JMediator mediator;

    @PostMapping
    @Operation(summary = "Ejecutar proceso de backup", description = "Inicia el escaneo y copia de archivos multihilo para la configuración especificada.")
    public ExecuteBackupResponse execute(@RequestBody ExecuteBackupRequest request) throws Throwable {
        return mediator.send(request);
    }
}
