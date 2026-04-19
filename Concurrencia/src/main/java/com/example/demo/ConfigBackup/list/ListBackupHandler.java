package com.example.demo.ConfigBackup.list;

import com.example.demo.ConfigBackup.BackupMapper;
import com.example.demo.ConfigBackup.BackupRepository;
import com.example.demo.common.entities.BackupConfig;
import com.example.demo.common.mediator.Handler;
import lombok.RequiredArgsConstructor;

import java.util.List;

@Handler
@RequiredArgsConstructor
public class ListBackupHandler {

    private final BackupRepository repository;
    private final BackupMapper mapper;

    public List<ListBackupResponse> handle(ListBackupRequest request) {
        List<BackupConfig> configs = repository.findAll();
        return mapper.toListResponseList(configs);
    }
}
