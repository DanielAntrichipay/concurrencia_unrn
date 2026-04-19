package com.example.demo.backup.execute;

import com.example.demo.ConfigBackup.BackupExecutionRepository;
import com.example.demo.common.entities.BackupConfig;
import com.example.demo.common.entities.BackupExecution;
import com.example.demo.common.mediator.Handler;
import lombok.RequiredArgsConstructor;

import java.io.File;
import java.io.IOException;
import java.nio.file.*;
import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

@Handler
@RequiredArgsConstructor
public class ExecuteBackupHandler {

    private final BackupExecutionRepository executionRepository;

    public ExecuteBackupResponse handle(ExecuteBackupRequest request) {
        BackupConfig config = request.getResolvedConfig();
        List<File> filesToCopy = request.getResolvedFilesToCopy();

        Instant start = Instant.now();
        AtomicInteger filesProcessed = new AtomicInteger(0);
        AtomicLong bytesCopied = new AtomicLong(0);
        ConcurrentLinkedQueue<String> failedFilesList = new ConcurrentLinkedQueue<>();
        String finalMessage = "Backup completado exitosamente";
        boolean success = true;

        try {
            Path destRoot = getDestinationRoot(request, config);
            executeCopy(config, destRoot, filesToCopy, filesProcessed, bytesCopied, failedFilesList);
            
        } catch (Exception e) {
            success = false;
            finalMessage = "Error durante el backup: " + e.getMessage();
        }

        long duration = Duration.between(start, Instant.now()).toMillis();
        saveExecutionHistory(config, start, success, finalMessage, filesProcessed.get(), bytesCopied.get(), duration, failedFilesList);

        return ExecuteBackupResponse.builder()
                .success(success)
                .message(finalMessage)
                .filesProcessed(filesProcessed.get())
                .bytesCopied(bytesCopied.get())
                .durationMs(duration)
                .failedFiles(new ArrayList<>(failedFilesList))
                .build();
    }

    private Path getDestinationRoot(ExecuteBackupRequest request, BackupConfig config) throws IOException {
        String destinationPath = request.getDestinationOverride() != null ? 
                request.getDestinationOverride() : config.getDestinationPath();
        
        Path destRoot = Paths.get(destinationPath).toAbsolutePath().normalize();
        if (!Files.exists(destRoot)) {
            Files.createDirectories(destRoot);
        }
        return destRoot;
    }

    private void executeCopy(BackupConfig config, Path destRoot, List<File> filesToCopy, 
                             AtomicInteger filesProcessed, AtomicLong bytesCopied, 
                             ConcurrentLinkedQueue<String> failedFilesList) {
        int threads = config.getThreadCount() != null ? config.getThreadCount() : 1;
        ExecutorService executor = Executors.newFixedThreadPool(threads);
        List<CompletableFuture<Void>> futures = new ArrayList<>();

        for (File file : filesToCopy) {
            futures.add(CompletableFuture.runAsync(() -> 
                copySingleFile(file, config, destRoot, filesProcessed, bytesCopied, failedFilesList), 
            executor));
        }

        CompletableFuture.allOf(futures.toArray(new CompletableFuture[0])).join();
        executor.shutdown();
    }

    private void copySingleFile(File file, BackupConfig config, Path destRoot, 
                                AtomicInteger filesProcessed, AtomicLong bytesCopied, 
                                ConcurrentLinkedQueue<String> failedFilesList) {
        try {
            Path relPath = resolveRelativePath(file, config.getSourcePaths());
            File targetFile = new File(destRoot.toFile(), relPath.toString());
            
            File parent = targetFile.getParentFile();
            if (parent != null && !parent.exists()) {
                parent.mkdirs();
            }
            
            try (java.io.FileInputStream in = new java.io.FileInputStream(file);
                 java.io.FileOutputStream out = new java.io.FileOutputStream(targetFile)) {
                
                byte[] buffer = new byte[65536];
                int length;
                while ((length = in.read(buffer)) > 0) {
                    out.write(buffer, 0, length);
                }
                
                out.flush();
                out.getFD().sync(); 
            }
            
            if (targetFile.exists() && targetFile.length() == file.length()) {
                filesProcessed.incrementAndGet();
                bytesCopied.addAndGet(file.length());
            } else {
                failedFilesList.add(file.getAbsolutePath());
            }
        } catch (IOException e) {
            failedFilesList.add(file.getAbsolutePath());
        }
    }

    private void saveExecutionHistory(BackupConfig config, Instant start, boolean success, String message, 
                                      int filesProcessed, long bytesCopied, long duration, 
                                      ConcurrentLinkedQueue<String> failedFilesList) {
        BackupExecution execution = new BackupExecution();
        execution.setConfig(config);
        execution.setExecutionDate(start);
        execution.setSuccess(success);
        execution.setMessage(message);
        execution.setFilesProcessed(filesProcessed);
        execution.setBytesCopied(bytesCopied);
        execution.setDurationMs(duration);
        execution.setFailedFiles(new ArrayList<>(failedFilesList));
        executionRepository.save(execution);
    }

    private Path resolveRelativePath(File file, List<String> sourcePaths) {
        for (String source : sourcePaths) {
            Path sourcePath = Paths.get(source).toAbsolutePath().normalize();
            Path filePath = file.toPath().toAbsolutePath().normalize();
            
            if (filePath.startsWith(sourcePath)) {
                Path parentPath = sourcePath.getParent();
                if (parentPath == null) return Paths.get(file.getName());
                return parentPath.relativize(filePath);
            }
        }
        return Paths.get(file.getName());
    }
}
