package com.example.demo.common.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;

@Entity
@Getter
@Setter
public class BackupExecution extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "backup_config_id", nullable = false)
    private BackupConfig config;

    private Instant executionDate;
    private boolean success;
    private String message;
    private Integer filesProcessed;
    private Long bytesCopied;
    private Long durationMs;

    @ElementCollection
    @CollectionTable(name = "backup_execution_failed_paths", joinColumns = @JoinColumn(name = "backup_execution_id"))
    @Column(name = "path", length = 2048)
    private List<String> failedFiles = new ArrayList<>();
}
