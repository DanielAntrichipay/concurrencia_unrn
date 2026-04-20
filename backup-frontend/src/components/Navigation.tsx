import { Link, useLocation } from 'react-router-dom';
import { HardDrive, Settings, PlayCircle, Home, BarChart2 } from 'lucide-react';

export const Navigation: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Inicio', icon: Home },
    { path: '/configure', label: 'Configurar', icon: Settings },
    { path: '/perform', label: 'Ejecutar', icon: PlayCircle },
    { path: '/history', label: 'Métricas', icon: BarChart2 },
  ];

  return (
    <nav className="glass-panel" style={{ marginBottom: '2rem', padding: '1rem 2rem' }}>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <HardDrive size={28} className="text-gradient" />
          <h2 style={{ margin: 0 }} className="text-gradient">BackupPro</h2>
        </div>
        
        <div className="flex gap-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link 
                key={item.path} 
                to={item.path}
                className={`btn ${isActive ? 'btn-primary' : 'btn-secondary'}`}
                style={{ padding: '0.5rem 1rem' }}
              >
                <Icon size={18} />
                <span style={{ display: 'none' }} className="nav-label">{item.label}</span>
                {/* Responsive text display - we could use media queries in CSS for better handling */}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
