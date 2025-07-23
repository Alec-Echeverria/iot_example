import { useState, useEffect } from 'react';
import { Activity, Plus, Search, TrendingUp, TrendingDown, Thermometer, Droplets, Gauge } from 'lucide-react';
import MainLayout from '../components/Layout/MainLayout';
import '../styles/components.css';

interface Variable {
  id: string;
  name: string;
  deviceId: string;
  deviceName: string;
  type: 'number' | 'string' | 'boolean';
  unit?: string;
  value: any;
  timestamp: string;
  minValue?: number;
  maxValue?: number;
  description?: string;
}

export default function Variables() {
  const [variables, setVariables] = useState<Variable[]>([]);
  const [filteredVariables, setFilteredVariables] = useState<Variable[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      const mockVariables: Variable[] = [
        {
          id: '1',
          name: 'Temperatura Ambiente',
          deviceId: '1',
          deviceName: 'Sensor Temperatura Lab A',
          type: 'number',
          unit: '°C',
          value: 22.5,
          timestamp: '2024-01-15T10:30:00Z',
          minValue: -10,
          maxValue: 50,
          description: 'Temperatura ambiente del laboratorio'
        },
        {
          id: '2',
          name: 'Humedad Relativa',
          deviceId: '1',
          deviceName: 'Sensor Temperatura Lab A',
          type: 'number',
          unit: '%',
          value: 45.2,
          timestamp: '2024-01-15T10:30:00Z',
          minValue: 0,
          maxValue: 100
        },
        {
          id: '3',
          name: 'Estado Conexión',
          deviceId: '2',
          deviceName: 'Controlador IoT Oficina',
          type: 'boolean',
          value: true,
          timestamp: '2024-01-15T10:29:00Z'
        },
        {
          id: '4',
          name: 'Presión Atmosférica',
          deviceId: '4',
          deviceName: 'Monitor Calidad Aire',
          type: 'number',
          unit: 'hPa',
          value: 1013.25,
          timestamp: '2024-01-15T10:28:00Z',
          minValue: 950,
          maxValue: 1050
        },
        {
          id: '5',
          name: 'Modo Operación',
          deviceId: '5',
          deviceName: 'Actuador Riego Campo 1',
          type: 'string',
          value: 'Automático',
          timestamp: '2024-01-15T10:27:00Z'
        }
      ];
      setVariables(mockVariables);
      setFilteredVariables(mockVariables);
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = variables;

    if (searchTerm) {
      filtered = filtered.filter(variable =>
        variable.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        variable.deviceName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(variable => variable.type === typeFilter);
    }

    setFilteredVariables(filtered);
  }, [variables, searchTerm, typeFilter]);

  const getVariableIcon = (type: string, name: string) => {
    if (name.toLowerCase().includes('temperatura')) return <Thermometer size={16} />;
    if (name.toLowerCase().includes('humedad')) return <Droplets size={16} />;
    if (name.toLowerCase().includes('presión')) return <Gauge size={16} />;
    return <Activity size={16} />;
  };

  const formatValue = (variable: Variable) => {
    if (variable.type === 'boolean') {
      return variable.value ? 'Verdadero' : 'Falso';
    }
    if (variable.type === 'number' && variable.unit) {
      return `${variable.value} ${variable.unit}`;
    }
    return variable.value?.toString() || 'N/A';
  };

  const getValueTrend = (value: number, min?: number, max?: number) => {
    if (min === undefined || max === undefined) return null;
    const percentage = ((value - min) / (max - min)) * 100;
    if (percentage > 75) return { icon: TrendingUp, color: 'var(--error-color)' };
    if (percentage < 25) return { icon: TrendingDown, color: 'var(--warning-color)' };
    return { icon: Activity, color: 'var(--success-color)' };
  };

  const AddVariableModal = () => (
    <div className={`modal-overlay ${showAddModal ? 'open' : ''}`}>
      <div className="modal">
        <div className="modal-header">
          <h3 className="modal-title">Agregar Nueva Variable</h3>
          <button className="modal-close" onClick={() => setShowAddModal(false)}>×</button>
        </div>
        <div className="modal-content">
          <form>
            <div className="form-group">
              <label className="form-label">Nombre de la Variable</label>
              <input type="text" className="form-input" placeholder="Ej: Temperatura Exterior" />
            </div>
            <div className="form-group">
              <label className="form-label">Dispositivo</label>
              <select className="form-select">
                <option value="">Seleccionar dispositivo</option>
                <option value="1">Sensor Temperatura Lab A</option>
                <option value="2">Controlador IoT Oficina</option>
                <option value="3">Sensor Humedad Invernadero</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Tipo de Dato</label>
              <select className="form-select">
                <option value="number">Número</option>
                <option value="string">Texto</option>
                <option value="boolean">Verdadero/Falso</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Unidad de Medida</label>
              <input type="text" className="form-input" placeholder="Ej: °C, %, hPa" />
            </div>
            <div className="grid grid-2">
              <div className="form-group">
                <label className="form-label">Valor Mínimo</label>
                <input type="number" className="form-input" placeholder="0" />
              </div>
              <div className="form-group">
                <label className="form-label">Valor Máximo</label>
                <input type="number" className="form-input" placeholder="100" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Descripción</label>
              <textarea className="form-textarea" placeholder="Descripción de la variable..."></textarea>
            </div>
          </form>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancelar</button>
          <button className="btn btn-primary">Agregar Variable</button>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <MainLayout title="Gestión de Variables">
        <div className="loading">
          <div className="spinner"></div>
          <span>Cargando variables...</span>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Gestión de Variables">
      <div className="page-header">
        <div>
          <h1 className="page-title">Gestión de Variables</h1>
          <p className="page-description">Administra las variables de tus dispositivos IoT</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          <Plus size={16} />
          Agregar Variable
        </button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-4" style={{ marginBottom: 'var(--spacing-lg)' }}>
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-title">Total Variables</div>
            <div className="stat-icon"><Activity size={20} /></div>
          </div>
          <div className="stat-value">{variables.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-title">Numéricas</div>
            <div className="stat-icon"><TrendingUp size={20} /></div>
          </div>
          <div className="stat-value">{variables.filter(v => v.type === 'number').length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-title">Booleanas</div>
            <div className="stat-icon"><Activity size={20} /></div>
          </div>
          <div className="stat-value">{variables.filter(v => v.type === 'boolean').length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-title">Texto</div>
            <div className="stat-icon"><Activity size={20} /></div>
          </div>
          <div className="stat-value">{variables.filter(v => v.type === 'string').length}</div>
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
                placeholder="Buscar variables..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ paddingLeft: '40px' }}
              />
            </div>
            <select
              className="form-select"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              style={{ minWidth: '150px' }}
            >
              <option value="all">Todos los tipos</option>
              <option value="number">Número</option>
              <option value="string">Texto</option>
              <option value="boolean">Verdadero/Falso</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid de variables */}
      <div className="grid grid-3">
        {filteredVariables.map((variable) => {
          const trend = variable.type === 'number' ? getValueTrend(variable.value, variable.minValue, variable.maxValue) : null;
          
          return (
            <div key={variable.id} className="card">
              <div className="card-header">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-sm">
                    {getVariableIcon(variable.type, variable.name)}
                    <h3 className="card-title" style={{ margin: 0, fontSize: '16px' }}>{variable.name}</h3>
                  </div>
                  {trend && (
                    <trend.icon size={16} style={{ color: trend.color }} />
                  )}
                </div>
                <p className="card-subtitle">{variable.deviceName}</p>
              </div>
              <div className="card-content">
                <div className="flex items-center justify-between mb-md">
                  <span className="text-2xl font-bold">{formatValue(variable)}</span>
                  <span className={`badge badge-${variable.type === 'number' ? 'primary' : variable.type === 'boolean' ? 'success' : 'secondary'}`}>
                    {variable.type === 'number' ? 'NUM' : variable.type === 'boolean' ? 'BOOL' : 'STR'}
                  </span>
                </div>
                
                {variable.type === 'number' && variable.minValue !== undefined && variable.maxValue !== undefined && (
                  <div style={{ marginBottom: 'var(--spacing-sm)' }}>
                    <div className="flex justify-between text-sm text-secondary mb-sm">
                      <span>{variable.minValue}{variable.unit}</span>
                      <span>{variable.maxValue}{variable.unit}</span>
                    </div>
                    <div style={{ width: '100%', height: '4px', backgroundColor: 'var(--gray-200)', borderRadius: '2px', overflow: 'hidden' }}>
                      <div 
                        style={{
                          width: `${((variable.value - variable.minValue) / (variable.maxValue - variable.minValue)) * 100}%`,
                          height: '100%',
                          backgroundColor: 'var(--primary-color)',
                          transition: 'width 0.3s ease'
                        }}
                      />
                    </div>
                  </div>
                )}

                <div className="text-sm text-secondary">
                  Actualizado: {new Date(variable.timestamp).toLocaleString()}
                </div>
              </div>
              <div className="card-footer">
                <div className="flex justify-between">
                  <button className="btn btn-sm btn-outline">Ver Historial</button>
                  <button className="btn btn-sm btn-outline">Configurar</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredVariables.length === 0 && !isLoading && (
        <div className="empty-state">
          <Activity className="empty-state-icon" />
          <h3>No se encontraron variables</h3>
          <p>No hay variables que coincidan con los filtros seleccionados.</p>
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
            <Plus size={16} />
            Agregar primera variable
          </button>
        </div>
      )}

      <AddVariableModal />
    </MainLayout>
  );
}