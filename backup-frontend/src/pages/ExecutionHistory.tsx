import { useEffect, useState } from 'react';
import {
  BarChart2,
  CheckCircle2,
  XCircle,
  Clock,
  HardDrive,
  FileText,
  RefreshCw,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Activity,
} from 'lucide-react';

interface ExecutionRecord {
  id: string;
  backupConfigId: string;
  backupName: string;
  executionDate: string;
  success: boolean;
  message: string;
  filesProcessed: number;
  bytesCopied: number;
  durationMs: number;
  failedFiles: string[];
}

const API_BASE = '';

function formatBytes(bytes: number): string {
  if (bytes == null) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

function formatDuration(ms: number): string {
  if (ms == null) return '—';
  if (ms < 1000) return `${ms} ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(2)} s`;
  const mins = Math.floor(ms / 60000);
  const secs = ((ms % 60000) / 1000).toFixed(0);
  return `${mins}m ${secs}s`;
}

function formatDate(iso: string): string {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleString('es-AR', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
}

// ── Stat card ────────────────────────────────────────────────────────────────
interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  accent: string;
  sub?: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, accent, sub }) => (
  <div
    className="glass-panel"
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
      borderTop: `3px solid ${accent}`,
      padding: '1.25rem 1.5rem',
    }}
  >
    <div className="flex items-center gap-2" style={{ color: accent }}>
      {icon}
      <span style={{ fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
        {label}
      </span>
    </div>
    <p style={{ fontSize: '2rem', fontWeight: 700, fontFamily: "'Outfit', sans-serif", margin: 0 }}>{value}</p>
    {sub && <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>{sub}</p>}
  </div>
);

// ── Row detail ────────────────────────────────────────────────────────────────
const HistoryRow: React.FC<{ record: ExecutionRecord }> = ({ record }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <tr
        onClick={() => setExpanded((p) => !p)}
        style={{ cursor: 'pointer', transition: 'background 0.2s' }}
        className="history-row"
      >
        <td>
          <span
            className={`badge ${record.success ? 'badge-success' : 'badge-danger'}`}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
          >
            {record.success
              ? <CheckCircle2 size={13} />
              : <XCircle size={13} />}
            {record.success ? 'Exitoso' : 'Fallido'}
          </span>
        </td>
        <td style={{ fontWeight: 600, fontFamily: "'Outfit', sans-serif" }}>{record.backupName}</td>
        <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{formatDate(record.executionDate)}</td>
        <td style={{ textAlign: 'right' }}>{record.filesProcessed ?? '—'}</td>
        <td style={{ textAlign: 'right' }}>{formatBytes(record.bytesCopied)}</td>
        <td style={{ textAlign: 'right' }}>{formatDuration(record.durationMs)}</td>
        <td style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </td>
      </tr>

      {expanded && (
        <tr>
          <td
            colSpan={7}
            style={{
              background: 'rgba(0,0,0,0.25)',
              padding: '1rem 1.5rem',
              borderRadius: '0 0 10px 10px',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <strong style={{ color: 'var(--text-main)' }}>ID ejecución:</strong>{' '}
                <code style={{ fontSize: '0.78rem', opacity: 0.7 }}>{record.id}</code>
              </p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <strong style={{ color: 'var(--text-main)' }}>ID configuración:</strong>{' '}
                <code style={{ fontSize: '0.78rem', opacity: 0.7 }}>{record.backupConfigId}</code>
              </p>
              <p style={{ fontSize: '0.85rem' }}>
                <strong style={{ color: 'var(--text-main)' }}>Mensaje:</strong>{' '}
                <span style={{ color: record.success ? 'var(--success)' : 'var(--danger)' }}>{record.message || '—'}</span>
              </p>

              {record.failedFiles && record.failedFiles.length > 0 && (
                <div>
                  <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--warning)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
                    <AlertTriangle size={14} /> Archivos con error ({record.failedFiles.length}):
                  </p>
                  <ul style={{ listStyle: 'none', padding: '0.5rem 0.75rem', background: 'rgba(239,68,68,0.05)', borderRadius: 8, border: '1px solid rgba(239,68,68,0.15)', margin: 0 }}>
                    {record.failedFiles.map((f, i) => (
                      <li key={i} style={{ fontSize: '0.78rem', fontFamily: 'monospace', color: 'var(--danger)', padding: '0.15rem 0' }}>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

// ── Main page ────────────────────────────────────────────────────────────────
export const ExecutionHistory: React.FC = () => {
  const [records, setRecords] = useState<ExecutionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/backups/execution-history`);
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      const data: ExecutionRecord[] = await res.json();
      // Ordenar por fecha descendente
      data.sort((a, b) => new Date(b.executionDate).getTime() - new Date(a.executionDate).getTime());
      setRecords(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHistory(); }, []);

  // ── Derived metrics ──────────────────────────────────────────────────────
  const total = records.length;
  const successful = records.filter((r) => r.success).length;
  const failed = total - successful;
  const successRate = total > 0 ? Math.round((successful / total) * 100) : 0;
  const totalBytes = records.reduce((acc, r) => acc + (r.bytesCopied ?? 0), 0);
  const totalFiles = records.reduce((acc, r) => acc + (r.filesProcessed ?? 0), 0);
  const avgDuration = total > 0
    ? records.reduce((acc, r) => acc + (r.durationMs ?? 0), 0) / total
    : 0;

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-4" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <div className="flex items-center gap-3">
          <div style={{ padding: '0.75rem', background: 'rgba(59,130,246,0.12)', borderRadius: 12 }}>
            <Activity size={28} className="text-gradient" />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.75rem' }}>
              Historial de <span className="text-gradient">Ejecuciones</span>
            </h1>
            <p className="text-muted" style={{ margin: 0, fontSize: '0.9rem' }}>
              Métricas y detalle de cada backup ejecutado
            </p>
          </div>
        </div>
        <button className="btn btn-secondary" onClick={fetchHistory} disabled={loading} style={{ gap: '0.5rem' }}>
          <RefreshCw size={16} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
          Actualizar
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-4 mb-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
        <StatCard
          icon={<BarChart2 size={18} />}
          label="Total ejecuciones"
          value={total}
          accent="var(--primary)"
        />
        <StatCard
          icon={<CheckCircle2 size={18} />}
          label="Exitosas"
          value={successful}
          accent="var(--success)"
          sub={`${successRate}% de éxito`}
        />
        <StatCard
          icon={<XCircle size={18} />}
          label="Fallidas"
          value={failed}
          accent="var(--danger)"
          sub={failed > 0 ? `${100 - successRate}% de fallo` : 'Sin fallos 🎉'}
        />
        <StatCard
          icon={<HardDrive size={18} />}
          label="Total copiado"
          value={formatBytes(totalBytes)}
          accent="var(--secondary)"
        />
        <StatCard
          icon={<FileText size={18} />}
          label="Archivos procesados"
          value={totalFiles.toLocaleString('es-AR')}
          accent="var(--warning)"
        />
        <StatCard
          icon={<Clock size={18} />}
          label="Duración promedio"
          value={formatDuration(Math.round(avgDuration))}
          accent="var(--primary)"
        />
      </div>

      {/* Progress bar success rate */}
      {total > 0 && (
        <div className="glass-panel mb-4" style={{ padding: '1rem 1.5rem' }}>
          <div className="flex justify-between items-center mb-2">
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Tasa de éxito global
            </span>
            <span style={{ fontWeight: 700, fontSize: '1.1rem', color: successRate >= 80 ? 'var(--success)' : successRate >= 50 ? 'var(--warning)' : 'var(--danger)' }}>
              {successRate}%
            </span>
          </div>
          <div style={{ height: 8, background: 'rgba(255,255,255,0.08)', borderRadius: 999, overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: `${successRate}%`,
                borderRadius: 999,
                background: successRate >= 80
                  ? 'linear-gradient(90deg, var(--success), #34d399)'
                  : successRate >= 50
                    ? 'linear-gradient(90deg, var(--warning), #fbbf24)'
                    : 'linear-gradient(90deg, var(--danger), #f87171)',
                transition: 'width 0.8s ease',
              }}
            />
          </div>
        </div>
      )}

      {/* Table */}
      <div className="glass-panel" style={{ padding: '1.5rem', overflowX: 'auto' }}>
        <h2 style={{ margin: '0 0 1.25rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <BarChart2 size={18} style={{ color: 'var(--primary)' }} />
          Detalle de ejecuciones
        </h2>

        {/* Loading */}
        {loading && (
          <div className="text-center" style={{ padding: '3rem 0', color: 'var(--text-muted)' }}>
            <RefreshCw size={32} style={{ margin: '0 auto 1rem', display: 'block', animation: 'spin 1s linear infinite' }} />
            <p>Cargando historial…</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--danger)', background: 'rgba(239,68,68,0.07)', borderRadius: 12, border: '1px solid rgba(239,68,68,0.2)' }}>
            <XCircle size={32} style={{ marginBottom: '0.75rem' }} />
            <p style={{ fontWeight: 600 }}>No se pudo cargar el historial</p>
            <p style={{ fontSize: '0.85rem', marginTop: '0.25rem', color: 'var(--text-muted)' }}>{error}</p>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && records.length === 0 && (
          <div style={{ padding: '3rem 0', textAlign: 'center', color: 'var(--text-muted)' }}>
            <BarChart2 size={40} style={{ margin: '0 auto 1rem', display: 'block', opacity: 0.4 }} />
            <p style={{ fontWeight: 600 }}>Sin registros disponibles</p>
            <p style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>Ejecuta un backup para ver métricas aquí.</p>
          </div>
        )}

        {/* Table data */}
        {!loading && !error && records.length > 0 && (
          <div className="scrollable-list" style={{ maxHeight: '520px', overflowY: 'auto', paddingRight: '0.25rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', position: 'sticky', top: 0, background: 'var(--glass-bg)', zIndex: 1 }}>
                  {['Estado', 'Nombre', 'Fecha', 'Archivos', 'Copiado', 'Duración', ''].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: '0.6rem 0.75rem',
                        textAlign: h === 'Archivos' || h === 'Copiado' || h === 'Duración' ? 'right' : 'left',
                        color: 'var(--text-muted)',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {records.map((rec) => (
                  <HistoryRow key={rec.id} record={rec} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Spin keyframe inline */}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .history-row:hover td { background: rgba(255,255,255,0.04); }
        .history-row td { padding: 0.75rem 0.75rem; border-bottom: 1px solid rgba(255,255,255,0.05); vertical-align: middle; }
      `}</style>
    </div>
  );
};
