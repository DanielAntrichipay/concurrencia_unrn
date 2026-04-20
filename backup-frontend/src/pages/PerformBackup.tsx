import { useState, useEffect } from 'react';
import { Play, RefreshCw, HardDrive, CheckCircle, Clock, File, AlertTriangle, Trash2, Pencil } from 'lucide-react';
import type { BackupConfig, BackupExecutionResponse } from '../types';
import { EditBackupModal } from '../components/EditBackupModal';

export const PerformBackup: React.FC = () => {
  const [configs, setConfigs] = useState<BackupConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [selectedConfigId, setSelectedConfigId] = useState<string>('');
  const [destinationOverride, setDestinationOverride] = useState('');
  
  const [executing, setExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<BackupExecutionResponse | null>(null);
  const [editingConfig, setEditingConfig] = useState<BackupConfig | null>(null);

  const fetchConfigs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/backups');
      if (!res.ok) throw new Error('Error al obtener configuraciones');
      const data = await res.json();
      setConfigs(data);
      if (data.length > 0 && !selectedConfigId) {
        setSelectedConfigId(data[0].id);
      }
    } catch (err: any) {
      setError(err.message || 'Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfigs();
  }, []);

  const handleDeleteConfig = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta configuración?')) return;
    
    try {
      const res = await fetch(`/api/backups/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Error al eliminar configuración');
      
      const newConfigs = configs.filter(c => c.id !== id);
      setConfigs(newConfigs);
      if (selectedConfigId === id) {
        setSelectedConfigId(newConfigs.length > 0 ? newConfigs[0].id : '');
        setExecutionResult(null);
      }
    } catch (err: any) {
      setError(err.message || 'Error al eliminar');
    }
  };

  const handleSaved = (updated: BackupConfig) => {
    setConfigs(prev => prev.map(c => c.id === updated.id ? updated : c));
    setEditingConfig(null);
  };

  const handleExecute = async () => {
    if (!selectedConfigId) return;
    
    setExecuting(true);
    setExecutionResult(null);
    
    try {
      const payload = {
        configId: selectedConfigId,
        destinationOverride: destinationOverride.trim() || undefined
      };

      const res = await fetch('/api/backups/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      setExecutionResult(data);
    } catch (err: any) {
      setExecutionResult({
        success: false,
        message: err.message || 'Error de ejecución',
        filesProcessed: 0,
        bytesCopied: 0,
        durationMs: 0
      });
    } finally {
      setExecuting(false);
    }
  };

  const selectedConfig = configs.find(c => c.id === selectedConfigId);

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-gradient">Ejecutar Backup</h1>
        <button className="btn btn-secondary" onClick={fetchConfigs} disabled={loading}>
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          Actualizar Lista
        </button>
      </div>

      {error && (
        <div className="glass-panel mb-4 text-center">
          <p className="text-danger">⚠️ {error}</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-6">
        <div className="glass-panel">
          <h2 className="mb-4">Configuraciones Disponibles</h2>
          
          {loading ? (
            <p className="text-muted text-center py-4">Cargando configuraciones...</p>
          ) : configs.length === 0 ? (
            <p className="text-muted text-center py-4">No hay configuraciones. Crea una primero.</p>
          ) : (
            <div className="flex flex-col gap-4 scrollable-list" style={{ paddingTop: '4px' }}>
              {configs.map(config => (
                <div 
                  key={config.id}
                  onClick={() => setSelectedConfigId(config.id)}
                  className={`config-item ${selectedConfigId === config.id ? 'active' : ''}`}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="config-item-title">{config.name}</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); setEditingConfig(config); }}
                        className="btn flex items-center gap-2"
                        title="Editar configuración"
                        style={{
                          background: 'rgba(59,130,246,0.08)',
                          color: 'var(--primary)',
                          border: '1px solid rgba(59,130,246,0.25)',
                          padding: '0.4rem 0.75rem',
                          fontSize: '0.85rem',
                          borderRadius: '6px',
                        }}
                      >
                        <Pencil size={14} /> Editar
                      </button>
                      <button 
                        onClick={(e) => handleDeleteConfig(e, config.id)}
                        className="btn btn-danger-outline flex items-center gap-2"
                        title="Borrar configuración"
                      >
                        <Trash2 size={15} /> Borrar
                      </button>
                    </div>
                  </div>
                  <div className="text-muted mt-2 text-sm flex items-center gap-2">
                    <HardDrive size={16} /> 
                    {config.destinationPath}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column' }}>
          <h2 className="mb-4 text-gradient">Detalles de Ejecución</h2>
          
          {selectedConfig ? (
            <div className="flex-grow">
              <div className="mb-4 p-4 rounded bg-black/20">
                <h4 className="mb-2 text-muted">Backup Seleccionado</h4>
                <p className="font-semibold text-lg">{selectedConfig.name}</p>
                <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
                  <div>
                    <span className="text-muted">Hilos:</span> {selectedConfig.threadCount}
                  </div>
                  <div>
                    <span className="text-muted">OS:</span> {selectedConfig.osType || 'Detectado auto.'}
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Sobreescribir Destino (Opcional)</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Ej: /home/user/backups/manual" 
                  value={destinationOverride}
                  onChange={(e) => setDestinationOverride(e.target.value)}
                />
                <p className="text-muted mt-1 text-sm">
                  Dejar en blanco para usar el destino predeterminado: {selectedConfig.destinationPath}
                </p>
              </div>

              <button 
                className="btn btn-primary w-full mt-4 justify-center py-3"
                onClick={handleExecute}
                disabled={executing}
                style={{ width: '100%' }}
              >
                {executing ? (
                  <><RefreshCw size={20} className="animate-spin" /> Ejecutando Backup...</>
                ) : (
                  <><Play size={20} /> Iniciar Backup Ahora</>
                )}
              </button>
            </div>
          ) : (
            <div className="flex-grow flex items-center justify-center text-muted">
              Selecciona una configuración para ejecutar
            </div>
          )}
        </div>
      </div>

      {executionResult && (
        <div className="glass-panel mt-6 animate-fade-in">
          <h2 className="mb-4 flex items-center gap-2">
            {executionResult.success ? (
              <><CheckCircle className="text-success" /> Resultado Exitoso</>
            ) : (
              <><AlertTriangle className="text-danger" /> Error en la Ejecución</>
            )}
          </h2>
          
          <p className="mb-4" style={{ fontSize: '1.1rem' }}>{executionResult.message}</p>
          
          {executionResult.success && (
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 rounded bg-black/20 text-center">
                <File size={40} className="mx-auto mb-3 text-primary" />
                <h4 className="text-muted">Archivos Procesados</h4>
                <p className="text-2xl font-bold">{executionResult.filesProcessed}</p>
              </div>
              <div className="p-4 rounded bg-black/20 text-center">
                <HardDrive size={40} className="mx-auto mb-3 text-secondary" />
                <h4 className="text-muted">Bytes Copiados</h4>
                <p className="text-2xl font-bold">
                  {(() => {
                    const bytes = executionResult.bytesCopied;
                    if (bytes === 0) return '0 Bytes';
                    const k = 1024;
                    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
                    const i = Math.floor(Math.log(bytes) / Math.log(k));
                    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
                  })()}
                </p>
              </div>
              <div className="p-4 rounded bg-black/20 text-center">
                <Clock size={40} className="mx-auto mb-3 text-warning" />
                <h4 className="text-muted">Duración</h4>
                <p className="text-2xl font-bold">
                  {executionResult.durationMs < 1000 
                    ? `${executionResult.durationMs} ms` 
                    : `${(executionResult.durationMs / 1000).toFixed(2)} s`}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {editingConfig && (
        <EditBackupModal
          config={editingConfig}
          onClose={() => setEditingConfig(null)}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
};
