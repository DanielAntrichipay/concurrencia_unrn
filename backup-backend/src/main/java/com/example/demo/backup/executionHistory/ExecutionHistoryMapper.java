package com.example.demo.backup.executionHistory;

import com.example.demo.common.entities.BackupExecution;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;
import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ExecutionHistoryMapper {
    @Mapping(target = "backupConfigId", source = "config.id")
    @Mapping(target = "backupName", source = "config.name")
    ExecutionHistoryResponse toResponse(BackupExecution entity);
    List<ExecutionHistoryResponse> toResponseList(List<BackupExecution> entities);
}
