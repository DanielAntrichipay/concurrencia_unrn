package com.example.demo.ConfigBackup.delete;

import com.example.demo.common.mediator.JMediator;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/backups")
@Tag(name = "Backups", description = "Endpoints para la gestión de copias de seguridad")
public class DeleteBackupController {

    private final JMediator mediator;

    public DeleteBackupController(JMediator mediator) {
        this.mediator = mediator;
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar configuración de backup", description = "Realiza un borrado lógico de una configuración de backup.")
    public ResponseEntity<Void> delete(@PathVariable String id) throws Throwable {
        mediator.send(new DeleteBackupRequest(id));
        return ResponseEntity.noContent().build();
    }
}
