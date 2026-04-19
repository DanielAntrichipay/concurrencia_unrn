package com.example.demo.ConfigBackup.create;

import com.example.demo.common.exceptions.BadRequestException;
import com.example.demo.common.mediator.Validator;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

@Validator
public class CreateBackupValidator {

    public void validate(CreateBackupRequest request) {
        if (!StringUtils.hasText(request.getName())) {
            throw new BadRequestException("El nombre del backup es obligatorio");
        }
        
        // Debe haber rutas manuales O estar activada la opción de rutas estándar
        if (CollectionUtils.isEmpty(request.getSourcePaths()) && !request.isIncludeStandardPaths()) {
            throw new BadRequestException("Debe definir al menos una ruta de origen o activar las rutas estándar");
        }

        if (!StringUtils.hasText(request.getDestinationPath())) {
            throw new BadRequestException("La ruta de destino es obligatoria");
        }
        
        if (request.getThreadCount() != null && request.getThreadCount() <= 0) {
            throw new BadRequestException("La cantidad de hilos debe ser mayor a 0");
        }

        if (request.getMaxSizeGb() != null && request.getMaxSizeGb() <= 0) {
            throw new BadRequestException("El tamaño máximo debe ser mayor a 0 GB");
        }
    }
}
