import { useState, useEffect } from 'react';
import { X, Save, Plus, Trash2, CheckCircle, AlertCircle, Pencil } from 'lucide-react';
import type { BackupConfig } from '../types';

interface Props {
  config: BackupConfig;
  onClose: () => void;
  onSaved: (updated: BackupConfig) => void;
}

export const EditBackupModal: React.FC<Props> = ({ config, onClose, onSaved }) => {
  const [formData, setFormData] = useState({
    name: config.name ?? '',
    destinationPath: config.destinationPath ?? '',
    threadCount: config.threadCount ?? 1,
    includeStandardPaths: config.includeStandardPaths ?? true,
    maxSizeGb: config.maxSizeGb ?? 100.0,
  });

  const [sourcePaths, setSourcePaths] = useState<string[]>(
    config.sourcePaths?.length ? config.sourcePaths : ['']
  );
  const [includedExtensions, setIncludedExtensions] = useState<string>(
    (config.includedExtensions ?? []).join(', ')
  );
  const [excludedExtensions, setExcludedExtensions] = useState<string>(
    (config.excludedExtensions ?? []).join(', ')
  );

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  // Bloquear scroll del body mientras el modal está abierto
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) : value,
    }));
  };

  const handleSourcePathChange = (index: number, value: string) => {
    const paths = [...sourcePaths];
    paths[index] = value;
    setSourcePaths(paths);
  };

  const addSourcePath = () => setSourcePaths([...sourcePaths, '']);
  const removeSourcePath = (index: number) => {
    if (sourcePaths.length > 1) setSourcePaths(sourcePaths.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const payload = {
        ...formData,
        sourcePaths: sourcePaths.filter(p => p.trim() !== ''),
        includedExtensions: includedExtensions.split(',').map(s => s.trim()).filter(Boolean),
        excludedExtensions: excludedExtensions.split(',').map(s => s.trim()).filter(Boolean),
      };

      const res = await fetch(`/api/backups/${config.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);

      const data = await res.json();
      setStatus('success');
      setMessage(`"${data.name}" actualizado correctamente`);

      // Propagar la config actualizada al padre
      onSaved({ ...config, ...payload, name: data.name });

      setTimeout(() => onClose(), 1500);
    } catch (err: unknown) {
      setStatus('error');
      setMessage(err instanceof Error ? err.message : 'Error de conexión');
    }
  };

  return (
    /* Overlay */
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(2, 6, 23, 0.92)',
        backdropFilter: 'blur(10px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem',
        animation: 'fadeIn 0.2s ease',
      }}
    >
      {/* Panel */}
      <div
        onClick={e => e.stopPropagation()}
        className="glass-panel"
        style={{
          width: '100%', maxWidth: 680,
          maxHeight: '90vh', overflowY: 'auto',
          padding: '2rem',
          borderTop: '3px solid var(--primary)',
          animation: 'slideUp 0.25s ease',
          background: 'rgba(15, 23, 42, 0.97)',
          backdropFilter: 'none',
        }}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <div style={{ padding: '0.6rem', background: 'rgba(59,130,246,0.12)', borderRadius: 10 }}>
              <Pencil size={20} style={{ color: 'var(--primary)' }} />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.3rem' }}>Editar Configuración</h2>
              <p className="text-muted" style={{ margin: 0, fontSize: '0.8rem' }}>
                ID: <code style={{ fontSize: '0.72rem', opacity: 0.6 }}>{config.id}</code>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="btn-icon"
            title="Cerrar"
            style={{ flexShrink: 0 }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Feedback */}
        {status === 'success' && (
          <div className="mb-4 p-3 rounded flex items-center gap-2"
            style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid var(--success)' }}>
            <CheckCircle size={18} style={{ color: 'var(--success)', flexShrink: 0 }} />
            <span style={{ color: 'var(--success)' }}>{message}</span>
          </div>
        )}
        {status === 'error' && (
          <div className="mb-4 p-3 rounded flex items-center gap-2"
            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid var(--danger)' }}>
            <AlertCircle size={18} style={{ color: 'var(--danger)', flexShrink: 0 }} />
            <span style={{ color: 'var(--danger)' }}>{message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Nombre + Destino */}
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Nombre del Backup</label>
              <input
                type="text" name="name" className="form-control"
                placeholder="Ej: Backup Semanal Servidor"
                value={formData.name} onChange={handleInputChange} required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Ruta de Destino</label>
              <input
                type="text" name="destinationPath" className="form-control"
                placeholder="Ej: /mnt/backup_drive/2026"
                value={formData.destinationPath} onChange={handleInputChange} required
              />
            </div>
          </div>

          {/* Rutas de origen */}
          <div className="form-group">
            <label className="form-label">Rutas de Origen</label>
            {sourcePaths.map((path, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input
                  type="text" className="form-control"
                  placeholder="/ruta/a/respaldar"
                  value={path}
                  onChange={e => handleSourcePathChange(i, e.target.value)}
                />
                <button type="button" className="btn-icon" onClick={() => removeSourcePath(i)}>
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
            <button type="button" className="btn btn-secondary mt-2" onClick={addSourcePath}>
              <Plus size={18} /> Añadir Ruta
            </button>
          </div>

          {/* Hilos + MaxSize */}
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Cantidad de Hilos (Concurrencia)</label>
              <input
                type="number" name="threadCount" min="1" max="32"
                className="form-control"
                value={formData.threadCount} onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Tamaño Máximo (GB)</label>
              <input
                type="number" name="maxSizeGb" step="0.1"
                className="form-control"
                value={formData.maxSizeGb} onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Extensiones */}
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <div className="flex justify-between items-center mb-2">
                <label className="form-label" style={{ marginBottom: 0 }}>Extensiones Incluidas</label>
                <button
                  type="button"
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, color: 'var(--primary)', fontSize: '0.82rem' }}
                  onClick={() => setIncludedExtensions('jpg, png, pdf, docx, xlsx, txt')}
                >
                  + Cargar comunes
                </button>
              </div>
              <input
                type="text" className="form-control"
                placeholder="Ej: jpg, pdf, docx (separadas por coma)"
                value={includedExtensions}
                onChange={e => setIncludedExtensions(e.target.value)}
              />
            </div>
            <div className="form-group">
              <div className="flex justify-between items-center mb-2">
                <label className="form-label" style={{ marginBottom: 0 }}>Extensiones Excluidas</label>
                <button
                  type="button"
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, color: 'var(--primary)', fontSize: '0.82rem' }}
                  onClick={() => setExcludedExtensions('tmp, log, exe, bak')}
                >
                  + Cargar comunes
                </button>
              </div>
              <input
                type="text" className="form-control"
                placeholder="Ej: tmp, log, exe (separadas por coma)"
                value={excludedExtensions}
                onChange={e => setExcludedExtensions(e.target.value)}
              />
            </div>
          </div>

          {/* Checkbox rutas estándar */}
          <div className="form-group flex items-center gap-2 mt-2">
            <input
              type="checkbox" name="includeStandardPaths" id="editIncludeStandard"
              checked={formData.includeStandardPaths}
              onChange={handleInputChange}
              style={{ width: 18, height: 18 }}
            />
            <label htmlFor="editIncludeStandard" className="form-label" style={{ margin: 0, cursor: 'pointer' }}>
              Incluir rutas estándar del sistema operativo
            </label>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-4">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={status === 'loading' || status === 'success'}
            >
              {status === 'loading'
                ? 'Guardando...'
                : <><Save size={18} /> Guardar Cambios</>}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};
