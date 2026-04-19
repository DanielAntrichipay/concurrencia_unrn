package com.example.demo.ConfigBackup;

import com.example.demo.common.entities.BackupExecution;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BackupExecutionRepository extends JpaRepository<BackupExecution, String> {
}
