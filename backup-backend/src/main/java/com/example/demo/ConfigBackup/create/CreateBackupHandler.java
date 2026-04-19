package com.example.demo.ConfigBackup.create;

import com.example.demo.common.mediator.Handler;
import com.example.demo.common.entities.BackupConfig;
import com.example.demo.ConfigBackup.BackupMapper;
import com.example.demo.ConfigBackup.BackupRepository;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Handler
@RequiredArgsConstructor
public class CreateBackupHandler {

    private final BackupRepository repository;
    private final BackupMapper mapper;

    public CreateBackupResponse handle(CreateBackupRequest request) {
        BackupConfig config = mapper.toEntity(request);
        
        config.setOsType(System.getProperty("os.name"));
        config.setEnabled(true);
        config.setCreatedOn(LocalDateTime.now());

        if (request.isIncludeStandardPaths()) {
            List<String> paths = config.getSourcePaths();
            if (paths == null) paths = new ArrayList<>();
            paths.addAll(resolveStandardPaths());
            config.setSourcePaths(paths);
        }

        BackupConfig saved = repository.save(config);
        return mapper.toCreateResponse(saved);
    }

    private List<String> resolveStandardPaths() {
        List<String> paths = new ArrayList<>();
        String userHome = System.getProperty("user.home");
        String os = System.getProperty("os.name").toLowerCase();

        if (os.contains("win")) {
            paths.add(userHome + "\\Documents");
            paths.add(userHome + "\\Pictures");
            paths.add(userHome + "\\Videos");
            paths.add(userHome + "\\Desktop");
        } else {
            paths.add(userHome + "/Documents");
            paths.add(userHome + "/Pictures");
            paths.add(userHome + "/Videos");
            paths.add(userHome + "/Desktop");
        }
        return paths;
    }
}
