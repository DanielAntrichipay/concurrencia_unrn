package com.example.demo.backup.execute;

import com.example.demo.ConfigBackup.BackupRepository;
import com.example.demo.common.entities.BackupConfig;
import com.example.demo.common.exceptions.BadRequestException;
import com.example.demo.common.mediator.Validator;
import lombok.RequiredArgsConstructor;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

@Validator
@RequiredArgsConstructor
public class ExecuteBackupValidator {

    private final BackupRepository repository;

    public void validate(ExecuteBackupRequest request) {
        if (request.getConfigId() == null || request.getConfigId().isEmpty()) {
            throw new BadRequestException("El ID de configuración es obligatorio.");
        }

        BackupConfig config = repository.findById(request.getConfigId())
                .orElseThrow(() -> new BadRequestException("Configuración de backup no encontrada: " + request.getConfigId()));

        request.setResolvedConfig(config);

        String destinationPath = request.getDestinationOverride() != null ? 
                request.getDestinationOverride() : config.getDestinationPath();

        if (destinationPath == null || destinationPath.isEmpty()) {
            throw new BadRequestException("No se ha definido una ruta de destino. Especifique una en la configuración o envíe 'destinationOverride'.");
        }

        List<File> filesToCopy = new ArrayList<>();
        long totalSizeToCopy = 0;
        if (config.getSourcePaths() != null) {
            for (String sourcePath : config.getSourcePaths()) {
                totalSizeToCopy += scanFiles(new File(sourcePath), filesToCopy, config);
            }
        }

        if (filesToCopy.isEmpty()) {
            throw new BadRequestException("No se encontraron archivos para copiar. Verifique las rutas de origen y filtros.");
        }

        if (config.getMaxSizeGb() != null) {
            double totalSizeGb = (double) totalSizeToCopy / (1024 * 1024 * 1024);
            if (totalSizeGb > config.getMaxSizeGb()) {
                throw new BadRequestException(String.format("El backup excede el tamaño máximo permitido. Requerido: %.2f GB, Límite: %.2f GB", 
                        totalSizeGb, config.getMaxSizeGb()));
            }
        }

        request.setResolvedFilesToCopy(filesToCopy);
    }

    private long scanFiles(File root, List<File> result, BackupConfig config) {
        long size = 0;
        if (!root.exists()) return 0;

        if (root.isDirectory()) {
            File[] children = root.listFiles();
            if (children != null) {
                for (File child : children) {
                    size += scanFiles(child, result, config);
                }
            }
        } else {
            if (shouldInclude(root, config)) {
                result.add(root);
                size += root.length();
            }
        }
        return size;
    }

    private boolean shouldInclude(File file, BackupConfig config) {
        String name = file.getName().toLowerCase();
        int lastDot = name.lastIndexOf('.');
        String ext = (lastDot == -1) ? "" : name.substring(lastDot + 1);

        if (config.getIncludedExtensions() != null && !config.getIncludedExtensions().isEmpty()) {
            if (!config.getIncludedExtensions().stream().anyMatch(e -> e.equalsIgnoreCase(ext))) {
                return false;
            }
        }

        if (config.getExcludedExtensions() != null && !config.getExcludedExtensions().isEmpty()) {
            if (config.getExcludedExtensions().stream().anyMatch(e -> e.equalsIgnoreCase(ext))) {
                return false;
            }
        }

        return true;
    }
}
