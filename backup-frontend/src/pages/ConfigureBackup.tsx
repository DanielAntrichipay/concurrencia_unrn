import { useState } from 'react';
import { Save, Plus, Trash2, CheckCircle, AlertCircle } from 'lucide-react';

export const ConfigureBackup: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    destinationPath: '',
    threadCount: 1,
    includeStandardPaths: true,
    maxSizeGb: 100.0,
  });

  const [sourcePaths, setSourcePaths] = useState<string[]>(['']);
  const [includedExtensions, setIncludedExtensions] = useState<string>('');
  const [excludedExtensions, setExcludedExtensions] = useState<string>('');
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) : value
    }));
  };

  const handleSourcePathChange = (index: number, value: string) => {
    const newPaths = [...sourcePaths];
    newPaths[index] = value;
    setSourcePaths(newPaths);
  };

  const addSourcePath = () => setSourcePaths([...sourcePaths, '']);
  const removeSourcePath = (index: number) => {
    if (sourcePaths.length > 1) {
      setSourcePaths(sourcePaths.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      const payload = {
        ...formData,
        sourcePaths: sourcePaths.filter(p => p.trim() !== ''),
        includedExtensions: includedExtensions.split(',').map(e => e.trim()).filter(e => e),
        excludedExtensions: excludedExtensions.split(',').map(e => e.trim()).filter(e => e),
      };

      const response = await fetch('/api/backups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Error al guardar la configuración');
      
      const data = await response.json();
      setStatus('success');
      setMessage(`Configuración "${data.name}" guardada con éxito`);
      
      // Clear form
      setFormData({
        name: '',
        destinationPath: '',
        threadCount: 1,
        includeStandardPaths: true,
        maxSizeGb: 100.0,
      });
      setSourcePaths(['']);
      setIncludedExtensions('');
      setExcludedExtensions('');
      
      // Reset after 5 seconds
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error: any) {
      setStatus('error');
      setMessage(error.message || 'Error de conexión');
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-3 mb-4">
        <h1 className="text-gradient">Configurar Nuevo Backup</h1>
      </div>

      <div className="glass-panel">
        {status === 'success' && (
          <div className="mb-4 p-3 rounded" style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--success)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle className="text-gradient" style={{ color: 'var(--success)' }} />
            <span style={{ color: 'var(--success)' }}>{message}</span>
          </div>
        )}

        {status === 'error' && (
          <div className="mb-4 p-3 rounded" style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--danger)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle style={{ color: 'var(--danger)' }} />
            <span style={{ color: 'var(--danger)' }}>{message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Nombre del Backup</label>
              <input 
                type="text" 
                name="name" 
                className="form-control" 
                placeholder="Ej: Backup Semanal Servidor" 
                value={formData.name}
                onChange={handleInputChange}
                required 
              />
            </div>
            <div className="form-group">
              <label className="form-label">Ruta de Destino</label>
              <input 
                type="text" 
                name="destinationPath" 
                className="form-control" 
                placeholder="Ej: /mnt/backup_drive/2026" 
                value={formData.destinationPath}
                onChange={handleInputChange}
                required 
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Rutas de Origen</label>
            {sourcePaths.map((path, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="/ruta/a/respaldar" 
                  value={path}
                  onChange={(e) => handleSourcePathChange(index, e.target.value)}
                  required 
                />
                <button type="button" className="btn-icon" onClick={() => removeSourcePath(index)}>
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
            <button type="button" className="btn btn-secondary mt-2" onClick={addSourcePath}>
              <Plus size={18} /> Añadir Ruta
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Cantidad de Hilos (Concurrencia)</label>
              <input 
                type="number" 
                name="threadCount" 
                min="1" max="32" 
                className="form-control" 
                value={formData.threadCount}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Tamaño Máximo (GB)</label>
              <input 
                type="number" 
                name="maxSizeGb" 
                step="0.1" 
                className="form-control" 
                value={formData.maxSizeGb}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <div className="flex justify-between items-center mb-2">
                <label className="form-label" style={{ marginBottom: 0 }}>Extensiones Incluidas</label>
                <button 
                  type="button" 
                  className="text-primary text-sm hover:underline" 
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
                  onClick={() => setIncludedExtensions('jpg, png, pdf, docx, xlsx, txt')}
                >
                  + Cargar comunes
                </button>
              </div>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Ej: jpg, pdf, docx (separadas por coma)"
                value={includedExtensions}
                onChange={(e) => setIncludedExtensions(e.target.value)}
              />
            </div>
            <div className="form-group">
              <div className="flex justify-between items-center mb-2">
                <label className="form-label" style={{ marginBottom: 0 }}>Extensiones Excluidas</label>
                <button 
                  type="button" 
                  className="text-primary text-sm hover:underline" 
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
                  onClick={() => setExcludedExtensions('tmp, log, exe, bak')}
                >
                  + Cargar comunes
                </button>
              </div>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Ej: tmp, log, exe (separadas por coma)"
                value={excludedExtensions}
                onChange={(e) => setExcludedExtensions(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group flex items-center gap-2 mt-2">
            <input 
              type="checkbox" 
              name="includeStandardPaths" 
              id="includeStandard"
              checked={formData.includeStandardPaths}
              onChange={handleInputChange}
              style={{ width: '18px', height: '18px' }}
            />
            <label htmlFor="includeStandard" className="form-label" style={{ margin: 0, cursor: 'pointer' }}>
              Incluir rutas estándar del sistema operativo
            </label>
          </div>

          <div className="flex justify-end mt-4">
            <button type="submit" className="btn btn-primary" disabled={status === 'loading'}>
              {status === 'loading' ? 'Guardando...' : <><Save size={18} /> Guardar Configuración</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
