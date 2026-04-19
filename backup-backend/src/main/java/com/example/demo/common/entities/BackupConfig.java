package com.example.demo.common.entities;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.SQLRestriction;

@Entity
@Getter
@Setter
@SQLRestriction("enabled  = true")
public class BackupConfig extends Lifecycle {
    private String name;

    @ElementCollection
    @CollectionTable(name = "backup_source_paths", joinColumns = @JoinColumn(name = "backup_config_id"))
    @Column(name = "path")
    private List<String> sourcePaths = new ArrayList<>();

    private String destinationPath;
    private Integer threadCount;
    private String osType;

    private boolean includeStandardPaths; // Para activar Carpetas de Usuario (Imágenes, Docs, etc.)
    private Double maxSizeGb;

    @ElementCollection
    @CollectionTable(name = "backup_included_extensions", joinColumns = @JoinColumn(name = "backup_config_id"))
    @Column(name = "extension")
    private List<String> includedExtensions = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "backup_excluded_extensions", joinColumns = @JoinColumn(name = "backup_config_id"))
    @Column(name = "extension")
    private List<String> excludedExtensions = new ArrayList<>();
}
