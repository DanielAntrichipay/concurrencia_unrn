import { Link } from 'react-router-dom';
import { Settings, PlayCircle, ShieldCheck, Zap, Server } from 'lucide-react';

export const Home: React.FC = () => {
  return (
    <div className="animate-fade-in">
      <div className="text-center mb-5 mt-4">
        <div className="flex justify-center mb-3">
          <ShieldCheck size={64} className="text-gradient" />
        </div>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>
          Protege tus datos con <span className="text-gradient">BackupPro</span>
        </h1>
        <p className="text-muted" style={{ fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
          Solución empresarial para realizar copias de seguridad de alta velocidad, concurrentes y seguras en múltiples destinos.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6 mt-5">
        <Link to="/configure" className="glass-panel" style={{ textDecoration: 'none', display: 'block', transition: 'transform 0.3s ease' }}>
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div className="mb-3">
              <div style={{ display: 'inline-flex', padding: '1rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px' }}>
                <Settings size={32} className="text-gradient" />
              </div>
            </div>
            <h2 className="mb-2 text-gradient">Configurar Backup</h2>
            <p className="text-muted mb-4" style={{ flexGrow: 1 }}>
              Define rutas de origen, destinos, hilos de ejecución, extensiones permitidas y más detalles operativos.
            </p>
            <div className="btn btn-primary" style={{ width: 'fit-content' }}>
              Empezar Configuración
            </div>
          </div>
        </Link>

        <Link to="/perform" className="glass-panel" style={{ textDecoration: 'none', display: 'block', transition: 'transform 0.3s ease' }}>
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div className="mb-3">
              <div style={{ display: 'inline-flex', padding: '1rem', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '12px' }}>
                <PlayCircle size={32} style={{ color: 'var(--secondary)' }} />
              </div>
            </div>
            <h2 className="mb-2" style={{ color: 'var(--secondary)' }}>Ejecutar Backup</h2>
            <p className="text-muted mb-4" style={{ flexGrow: 1 }}>
              Monitoriza y ejecuta backups concurrentes de forma manual utilizando las configuraciones guardadas.
            </p>
            <div className="btn" style={{ background: 'linear-gradient(135deg, var(--secondary), var(--secondary-hover))', color: 'white', width: 'fit-content' }}>
              Ir a Ejecución
            </div>
          </div>
        </Link>
      </div>

      <div className="mt-5 glass-panel text-center">
        <h3 className="mb-4">Características Principales</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Zap size={24} className="mb-2 text-gradient" style={{ margin: '0 auto' }} />
            <h4>Concurrencia</h4>
            <p className="text-muted mt-1" style={{ fontSize: '0.9rem' }}>Multihilo para máxima velocidad</p>
          </div>
          <div>
            <Server size={24} className="mb-2 text-gradient" style={{ margin: '0 auto' }} />
            <h4>Multidestino</h4>
            <p className="text-muted mt-1" style={{ fontSize: '0.9rem' }}>Guarda en cualquier ruta</p>
          </div>
          <div>
            <ShieldCheck size={24} className="mb-2 text-gradient" style={{ margin: '0 auto' }} />
            <h4>Confiabilidad</h4>
            <p className="text-muted mt-1" style={{ fontSize: '0.9rem' }}>Manejo robusto de errores</p>
          </div>
        </div>
      </div>
    </div>
  );
};
