package com.example.demo.ConfigBackup;

import com.example.demo.common.entities.BackupConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BackupRepository extends JpaRepository<BackupConfig, String> {
}
