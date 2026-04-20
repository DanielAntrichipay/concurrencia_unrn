package com.example.demo.backup.executionHistory;

import com.example.demo.backup.execute.BackupExecutionRepository;
import com.example.demo.common.exceptions.NotFoundException;
import com.example.demo.common.mediator.Handler;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.Optional;

@Handler
@RequiredArgsConstructor
public class ExecutionHistoryHandler {
    private final BackupExecutionRepository repository;
    private final ExecutionHistoryMapper mapper;

    public List<ExecutionHistoryResponse> handle(ExecutionHistoryRequest request) {
        return Optional.of(repository.findAllByOrderByExecutionDateDesc())
                .filter(list -> !list.isEmpty())
                .map(mapper::toResponseList)
                .orElseThrow(() -> new NotFoundException("No se registraron ejecuciones en el historial todavía."));
    }
}
