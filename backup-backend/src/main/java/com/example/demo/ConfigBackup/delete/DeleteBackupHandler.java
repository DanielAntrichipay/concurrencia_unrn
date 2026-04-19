package com.example.demo.ConfigBackup.delete;

import com.example.demo.ConfigBackup.BackupRepository;
import com.example.demo.common.entities.BackupConfig;
import com.example.demo.common.exceptions.BadRequestException;
import com.example.demo.common.exceptions.NotFoundException;
import com.example.demo.common.mediator.Handler;
import lombok.RequiredArgsConstructor;

@Handler
@RequiredArgsConstructor
public class DeleteBackupHandler {

    private final BackupRepository repository;

    public Void handle(DeleteBackupRequest request) {
        BackupConfig config = repository.findById(request.getId())
                .orElseThrow(() -> new NotFoundException("Configuración de backup no encontrada con el ID: " + request.getId()));

        if (!config.isEnabled()) {
            throw new BadRequestException("La configuración de backup ya se encuentra eliminada (borrado lógico).");
        }

        config.finishLifecycle();
        repository.save(config);
        
        return null;
    }
}
