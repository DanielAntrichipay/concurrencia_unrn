package com.example.demo.ConfigBackup;

import com.example.demo.ConfigBackup.create.CreateBackupRequest;
import com.example.demo.ConfigBackup.create.CreateBackupResponse;
import com.example.demo.ConfigBackup.list.ListBackupResponse;
import com.example.demo.ConfigBackup.update.UpdateBackupRequest;
import com.example.demo.ConfigBackup.update.UpdateBackupResponse;
import com.example.demo.common.entities.BackupConfig;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface BackupMapper {

    BackupConfig toEntity(CreateBackupRequest request);

    @Mapping(target = "status", constant = "CREATED")
    CreateBackupResponse toCreateResponse(BackupConfig config);

    ListBackupResponse toListResponse(BackupConfig config);

    List<ListBackupResponse> toListResponseList(List<BackupConfig> configs);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "enabled", ignore = true)
    @Mapping(target = "createdOn", ignore = true)
    @Mapping(target = "deletedOn", ignore = true)
    void updateEntityFromRequest(UpdateBackupRequest request, @MappingTarget BackupConfig config);

    @Mapping(target = "status", constant = "UPDATED")
    UpdateBackupResponse toUpdateResponse(BackupConfig config);
}
