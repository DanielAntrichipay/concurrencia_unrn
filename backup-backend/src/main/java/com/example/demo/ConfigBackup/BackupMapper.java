package com.example.demo.ConfigBackup;

import com.example.demo.ConfigBackup.create.CreateBackupRequest;
import com.example.demo.ConfigBackup.create.CreateBackupResponse;
import com.example.demo.ConfigBackup.list.ListBackupResponse;
import com.example.demo.common.entities.BackupConfig;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface BackupMapper {

    BackupConfig toEntity(CreateBackupRequest request);

    @Mapping(target = "status", constant = "CREATED")
    CreateBackupResponse toCreateResponse(BackupConfig config);

    ListBackupResponse toListResponse(BackupConfig config);

    List<ListBackupResponse> toListResponseList(List<BackupConfig> configs);
}
