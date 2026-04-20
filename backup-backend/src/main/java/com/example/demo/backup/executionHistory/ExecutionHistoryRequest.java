package com.example.demo.backup.executionHistory;

import io.swagger.v3.oas.annotations.media.Schema;
import com.example.demo.common.mediator.IRequest;
import java.util.List;

@Schema(name = "ExecutionHistoryRequest", description = "Petición para obtener el listado global de ejecuciones históricas")
public class ExecutionHistoryRequest implements IRequest<List<ExecutionHistoryResponse>> {
}
