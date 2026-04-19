package com.example.demo.ConfigBackup.delete;

import com.example.demo.common.exceptions.BadRequestException;
import com.example.demo.common.mediator.Validator;
import org.springframework.util.StringUtils;

@Validator
public class DeleteBackupValidator {

    public void validate(DeleteBackupRequest request) {
        if (!StringUtils.hasText(request.getId())) {
            throw new BadRequestException("El ID es obligatorio para eliminar.");
        }
    }
}
