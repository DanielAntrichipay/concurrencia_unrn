export interface BackupConfig {
  id: string;
  name: string;
  sourcePaths: string[];
  destinationPath: string;
  threadCount: number;
  osType?: string;
  enabled?: boolean;
  createdOn?: string;
}

export interface BackupExecutionResponse {
  success: boolean;
  message: string;
  filesProcessed: number;
  bytesCopied: number;
  durationMs: number;
}
