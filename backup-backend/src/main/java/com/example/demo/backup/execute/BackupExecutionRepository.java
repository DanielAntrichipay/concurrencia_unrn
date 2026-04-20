package com.example.demo.backup.execute;

import com.example.demo.common.entities.BackupExecution;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BackupExecutionRepository extends JpaRepository<BackupExecution, String> {
    List<BackupExecution> findAllByOrderByExecutionDateDesc();
    List<BackupExecution> findByConfigIdOrderByExecutionDateDesc(String configId);
}
