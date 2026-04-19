package com.example.demo.ConfigBackup.list;

import com.example.demo.common.mediator.JMediator;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/backups")
@Tag(name = "Backups", description = "Endpoints para la gestión de copias de seguridad")
public class ListBackupController {

    private final JMediator mediator;

    public ListBackupController(JMediator mediator) {
        this.mediator = mediator;
    }

    @GetMapping
    @Operation(summary = "Listar configuraciones de backup", description = "Retorna una lista de todas las configuraciones de backup registradas.")
    public List<ListBackupResponse> list() throws Throwable {
        return mediator.send(new ListBackupRequest());
    }
}
