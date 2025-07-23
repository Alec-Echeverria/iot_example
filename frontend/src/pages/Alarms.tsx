import { useState, useEffect } from 'react';
import { Bell, Plus, Search, AlertTriangle, CheckCircle, Clock, Zap } from 'lucide-react';
import MainLayout from '../components/Layout/MainLayout';
import '../styles/components.css';

interface Alarm {
  id: string;
  name: string;
  description?: string;
  variableName: string;
  deviceName: string;
  condition: string;
  value: number;
  valueMax?: number;
  isActive: boolean;
  isTriggered: boolean;
  triggeredAt?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  currentValue?: number;
}

export default function Alarms() {
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [filteredAlarms, setFilteredAlarms] = useState<Alarm[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      const mockAlarms: Alarm[] = [
        {
          id: '1',
          name: 'Temperatura Alta Lab A',
          description: 'Alerta cuando la temperatura supera los 25°C',
          variableName: 'Temperatura Ambiente',
          deviceName: 'Sensor Temperatura Lab A',
          condition: 'greater_than',
          value: 25,
          isActive: true,
          isTriggered: true,
          triggeredAt: '2024-01-15T09:15:00Z',
          severity: 'high',
          currentValue: 26.8
        },
        {
          id: '2',
          name: 'Humedad Baja Invernadero',
          description: 'Alerta cuando la humedad es menor a 30%',
          variableName: 'Humedad Relativa',
          deviceName: 'Sensor Humedad Invernadero',
          condition: 'less_than',
          value: 30,
          isActive: true,
          isTriggered: false,
          severity: 'medium',
          currentValue: 45.2
        },
        {
          id: '3',
          name: 'Pérdida de Conexión Crítica',
          description: 'Dispositivo crítico desconectado',
          variableName: 'Estado Conexión',
          deviceName: 'Monitor Calidad Aire',
          condition: 'equals',
          value: 0,
          isActive: true,
          isTriggered: true,
          triggeredAt: '2024-01-15T07:45:00Z',
          severity: 'critical',
          currentValue: 0
        },
        {
          id: '4',
          name: 'Presión Anormal',
          description: 'Presión fuera del rango normal',
          variableName: 'Presión Atmosférica',
          deviceName: 'Monitor Calidad Aire',
          condition: 'between',
          value: 990,
          valueMax: 1030,
          isActive: false,
          isTriggered: false,
          severity: 'low',
          currentValue: 1013.25
        }
      ];
      setAlarms(mockAlarms);
      setFilteredAlarms(mockAlarms);
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = alarms;

    if (searchTerm) {
      filtered = filtered.filter(alarm =>
        alarm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alarm.deviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alarm.variableName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      if (statusFilter === 'active') {
        filtered = filtered.filter(alarm => alarm.isActive);
      } else if (statusFilter === 'triggered') {
        filtered = filtered.filter(alarm => alarm.isTriggered);
      } else if (statusFilter === 'inactive') {
        filtered = filtered.filter(alarm => !alarm.isActive);
      }
    }

    if (severityFilter !== 'all') {
      filtered = filtered.filter(alarm => alarm.severity === severityFilter);
    }

    setFilteredAlarms(filtered);
  }, [alarms, searchTerm, statusFilter, severityFilter]);

  const getSeverityBadge = (severity: string) => {
    const severityMap = {
      low: { label: 'Baja', class: 'badge-secondary' },
      medium: { label: 'Media', class: 'badge-warning' },
      high: { label: 'Alta', class: 'badge-error' },
      critical: { label: 'Crítica', class: 'badge-error' }
    };
    const info = severityMap[severity as keyof typeof severityMap] || severityMap.low;
    return <span className={`badge ${info.class}`}>{info.label}</span>;
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <Zap size={16} className="text-error" />;
      case 'high':
        return <AlertTriangle size={16} className="text-error" />;
      case 'medium':
        return <Clock size={16} className="text-warning" />;
      default:
        return <Bell size={16} className="text-secondary" />;
    }
  };

  const getConditionText = (condition: string, value: number, valueMax?: number) => {
    switch (condition) {
      case 'greater_than':
        return `> ${value}`;
      case 'less_than':
        return `< ${value}`;
      case 'equals':
        return `= ${value}`;
      case 'not_equals':
        return `≠ ${value}`;
      case 'between':
        return `${value} - ${valueMax}`;
      default:
        return `${value}`;
    }
  };

  const toggleAlarmActive = (id: string) => {
    setAlarms(prev => prev.map(alarm => 
      alarm.id === id ? { ...alarm, isActive: !alarm.isActive } : alarm
    ));
  };

  const acknowledgeAlarm = (id: string) => {
    setAlarms(prev => prev.map(alarm => 
      alarm.id === id ? { ...alarm, isTriggered: false, triggeredAt: undefined } : alarm
    ));
  };

  const AddAlarmModal = () => (
    <div className={`modal-overlay ${showAddModal ? 'open' : ''}`}>
      <div className="modal">
        <div className="modal-header">
          <h3 className="modal-title">Configurar Nueva Alarma</h3>
          <button className="modal-close" onClick={() => setShowAddModal(false)}>×</button>
        </div>
        <div className="modal-content">
          <form>
            <div className="form-group">
              <label className="form-label">Nombre de la Alarma</label>
              <input type="text" className="form-input" placeholder="Ej: Temperatura Crítica Servidor" />
            </div>
            <div className="form-group">
              <label className="form-label">Variable a Monitorear</label>
              <select className="form-select">
                <option value="">Seleccionar variable</option>
                <option value="1">Temperatura Ambiente - Sensor Lab A</option>
                <option value="2">Humedad Relativa - Sensor Lab A</option>
                <option value="3">Presión Atmosférica - Monitor Aire</option>
              </select>
            </div>
            <div className="grid grid-2">
              <div className="form-group">
                <label className="form-label">Condición</label>
                <select className="form-select">
                  <option value="greater_than">Mayor que</option>
                  <option value="less_than">Menor que</option>
                  <option value="equals">Igual a</option>
                  <option value="not_equals">Diferente de</option>
                  <option value="between">Entre valores</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Severidad</label>
                <select className="form-select">
                  <option value="low">Baja</option>
                  <option value="medium">Media</option>
                  <option value="high">Alta</option>
                  <option value="critical">Crítica</option>
                </select>
              </div>
            </div>
            <div className="grid grid-2">
              <div className="form-group">
                <label className="form-label">Valor</label>
                <input type="number" className="form-input" placeholder="25" />
              </div>
              <div className="form-group">
                <label className="form-label">Valor Máximo (para "entre")</label>
                <input type="number" className="form-input" placeholder="30" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Descripción</label>
              <textarea className="form-textarea" placeholder="Descripción de la alarma..."></textarea>
            </div>
            <div className="form-group">
              <label className="form-label">Notificaciones</label>
              <div className="flex gap-md">
                <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                  <input type="checkbox" />
                  Email
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                  <input type="checkbox" />
                  SMS
                </label>
              </div>
            </div>
          </form>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancelar</button>
          <button className="btn btn-primary">Crear Alarma</button>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <MainLayout title="Configuración de Alarmas">
        <div className="loading">
          <div className="spinner"></div>
          <span>Cargando alarmas...</span>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Configuración de Alarmas">
      <div className="page-header">
        <div>
          <h1 className="page-title">Configuración de Alarmas</h1>
          <p className="page-description">Configura y gestiona las alarmas de tu sistema IoT</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          <Plus size={16} />
          Nueva Alarma
        </button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-4" style={{ marginBottom: 'var(--spacing-lg)' }}>
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-title">Total Alarmas</div>
            <div className="stat-icon"><Bell size={20} /></div>
          </div>
          <div className="stat-value">{alarms.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-title">Activas</div>
            <div className="stat-icon"><CheckCircle size={20} /></div>
          </div>
          <div className="stat-value text-success">{alarms.filter(a => a.isActive).length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-title">Disparadas</div>
            <div className="stat-icon"><AlertTriangle size={20} /></div>
          </div>
          <div className="stat-value text-error">{alarms.filter(a => a.isTriggered).length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-title">Críticas</div>
            <div className="stat-icon"><Zap size={20} /></div>
          </div>
          <div className="stat-value text-error">{alarms.filter(a => a.severity === 'critical').length}</div>
        </div>
      </div>

      {/* Filtros */}
      <div className="card" style={{ marginBottom: 'var(--spacing-lg)' }}>
        <div className="card-content">
          <div className="flex items-center gap-md">
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
              <input
                type="text"
                className="form-input"
                placeholder="Buscar alarmas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ paddingLeft: '40px' }}
              />
            </div>
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ minWidth: '150px' }}
            >
              <option value="all">Todos los estados</option>
              <option value="active">Activas</option>
              <option value="triggered">Disparadas</option>
              <option value="inactive">Inactivas</option>
            </select>
            <select
              className="form-select"
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              style={{ minWidth: '150px' }}
            >
              <option value="all">Todas las severidades</option>
              <option value="critical">Crítica</option>
              <option value="high">Alta</option>
              <option value="medium">Media</option>
              <option value="low">Baja</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de alarmas */}
      <div className="grid grid-2">
        {filteredAlarms.map((alarm) => (
          <div key={alarm.id} className={`card ${alarm.isTriggered ? 'border' : ''}`} style={alarm.isTriggered ? { borderColor: 'var(--error-color)' } : {}}>
            <div className="card-header">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-sm">
                  {getSeverityIcon(alarm.severity)}
                  <div>
                    <h3 className="card-title" style={{ margin: 0, fontSize: '16px' }}>{alarm.name}</h3>
                    <p className="card-subtitle">{alarm.deviceName} • {alarm.variableName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-sm">
                  {getSeverityBadge(alarm.severity)}
                  {alarm.isTriggered && (
                    <span className="badge badge-error">DISPARADA</span>
                  )}
                </div>
              </div>
            </div>
            <div className="card-content">
              <div className="mb-md">
                <div className="text-sm text-secondary mb-sm">Condición:</div>
                <div className="font-medium">{getConditionText(alarm.condition, alarm.value, alarm.valueMax)}</div>
              </div>

              {alarm.currentValue !== undefined && (
                <div className="mb-md">
                  <div className="text-sm text-secondary mb-sm">Valor actual:</div>
                  <div className={`font-medium ${alarm.isTriggered ? 'text-error' : 'text-success'}`}>
                    {alarm.currentValue}
                  </div>
                </div>
              )}

              {alarm.description && (
                <div className="mb-md">
                  <div className="text-sm text-secondary mb-sm">Descripción:</div>
                  <div className="text-sm">{alarm.description}</div>
                </div>
              )}

              {alarm.triggeredAt && (
                <div className="mb-md">
                  <div className="text-sm text-secondary mb-sm">Disparada:</div>
                  <div className="text-sm">{new Date(alarm.triggeredAt).toLocaleString()}</div>
                </div>
              )}
            </div>
            <div className="card-footer">
              <div className="flex justify-between items-center">
                <div className="flex gap-sm">
                  <button 
                    className={`btn btn-sm ${alarm.isActive ? 'btn-outline text-error' : 'btn-primary'}`}
                    onClick={() => toggleAlarmActive(alarm.id)}
                  >
                    {alarm.isActive ? 'Desactivar' : 'Activar'}
                  </button>
                  {alarm.isTriggered && (
                    <button 
                      className="btn btn-sm btn-success"
                      onClick={() => acknowledgeAlarm(alarm.id)}
                    >
                      Reconocer
                    </button>
                  )}
                </div>
                <button className="btn btn-sm btn-outline">Editar</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredAlarms.length === 0 && !isLoading && (
        <div className="empty-state">
          <Bell className="empty-state-icon" />
          <h3>No se encontraron alarmas</h3>
          <p>No hay alarmas configuradas que coincidan con los filtros.</p>
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
            <Plus size={16} />
            Configurar primera alarma
          </button>
        </div>
      )}

      <AddAlarmModal />
    </MainLayout>
  );
}