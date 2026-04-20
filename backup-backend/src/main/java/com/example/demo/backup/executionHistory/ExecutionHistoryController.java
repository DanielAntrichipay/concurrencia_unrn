package com.example.demo.backup.executionHistory;

import com.example.demo.common.mediator.JMediator;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/api/backups/execution-history")
@RequiredArgsConstructor
@Tag(name = "Backups")
public class ExecutionHistoryController {
    private final JMediator mediator;

    @GetMapping
    @Operation(summary = "Obtener historial global de ejecuciones")
    public List<ExecutionHistoryResponse> getHistory() throws Throwable {
        return mediator.send(new ExecutionHistoryRequest());
    }
}
