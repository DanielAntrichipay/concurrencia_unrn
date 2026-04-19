package com.example.demo.ConfigBackup.update;

import com.example.demo.ConfigBackup.BackupMapper;
import com.example.demo.ConfigBackup.BackupRepository;
import com.example.demo.common.entities.BackupConfig;
import com.example.demo.common.exceptions.NotFoundException;
import com.example.demo.common.mediator.Handler;
import lombok.RequiredArgsConstructor;

@Handler
@RequiredArgsConstructor
public class UpdateBackupHandler {

    private final BackupRepository repository;
    private final BackupMapper mapper;

    public UpdateBackupResponse handle(UpdateBackupRequest request) {
        BackupConfig config = repository.findById(request.getId())
                .orElseThrow(() -> new NotFoundException("Configuración de backup no encontrada con el ID: " + request.getId()));

        mapper.updateEntityFromRequest(request, config);
        BackupConfig savedConfig = repository.save(config);

        return mapper.toUpdateResponse(savedConfig);
    }
}
