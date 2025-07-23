import { useState } from 'react';
import { BarChart3, ExternalLink, Plus, RefreshCw, Maximize2 } from 'lucide-react';
import MainLayout from '../components/Layout/MainLayout';
import '../styles/components.css';

interface Dashboard {
  id: string;
  name: string;
  description: string;
  url: string;
  isActive: boolean;
  lastUpdated: string;
  category: string;
}

export default function Grafana() {
  const [dashboards, setDashboards] = useState<Dashboard[]>([
    {
      id: '1',
      name: 'Monitoreo General IoT',
      description: 'Dashboard principal con métricas generales de todos los dispositivos',
      url: 'https://grafana.example.com/d/iot-general/iot-general',
      isActive: true,
      lastUpdated: '2024-01-15T10:30:00Z',
      category: 'General'
    },
    {
      id: '2',
      name: 'Sensores de Temperatura',
      description: 'Monitoreo específico de todos los sensores de temperatura',
      url: 'https://grafana.example.com/d/temperature/temperature',
      isActive: true,
      lastUpdated: '2024-01-15T09:45:00Z',
      category: 'Temperatura'
    },
    {
      id: '3',
      name: 'Análisis de Conectividad',
      description: 'Estado de conectividad y disponibilidad de dispositivos',
      url: 'https://grafana.example.com/d/connectivity/connectivity',
      isActive: true,
      lastUpdated: '2024-01-15T08:20:00Z',
      category: 'Conectividad'
    },
    {
      id: '4',
      name: 'Consumo Energético',
      description: 'Análisis del consumo energético de dispositivos IoT',
      url: 'https://grafana.example.com/d/energy/energy',
      isActive: false,
      lastUpdated: '2024-01-14T16:30:00Z',
      category: 'Energía'
    }
  ]);

  const [selectedDashboard, setSelectedDashboard] = useState<Dashboard | null>(dashboards[0]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simular refresh
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const openInNewTab = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const AddDashboardModal = () => (
    <div className={`modal-overlay ${showAddModal ? 'open' : ''}`}>
      <div className="modal">
        <div className="modal-header">
          <h3 className="modal-title">Agregar Dashboard de Grafana</h3>
          <button className="modal-close" onClick={() => setShowAddModal(false)}>×</button>
        </div>
        <div className="modal-content">
          <form>
            <div className="form-group">
              <label className="form-label">Nombre del Dashboard</label>
              <input type="text" className="form-input" placeholder="Ej: Análisis de Humedad" />
            </div>
            <div className="form-group">
              <label className="form-label">URL de Grafana</label>
              <input type="url" className="form-input" placeholder="https://grafana.example.com/d/dashboard-id/dashboard-name" />
            </div>
            <div className="form-group">
              <label className="form-label">Categoría</label>
              <select className="form-select">
                <option value="">Seleccionar categoría</option>
                <option value="General">General</option>
                <option value="Temperatura">Temperatura</option>
                <option value="Humedad">Humedad</option>
                <option value="Conectividad">Conectividad</option>
                <option value="Energía">Energía</option>
                <option value="Personalizado">Personalizado</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Descripción</label>
              <textarea className="form-textarea" placeholder="Descripción del dashboard..."></textarea>
            </div>
            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                <input type="checkbox" defaultChecked />
                Dashboard activo
              </label>
            </div>
          </form>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancelar</button>
          <button className="btn btn-primary">Agregar Dashboard</button>
        </div>
      </div>
    </div>
  );

  return (
    <MainLayout title="Dashboards de Grafana">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboards de Grafana</h1>
          <p className="page-description">
            Accede a tus dashboards externos de Grafana para análisis avanzado
          </p>
        </div>
        <div className="flex gap-sm">
          <button 
            className="btn btn-outline"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
            Actualizar
          </button>
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
            <Plus size={16} />
            Agregar Dashboard
          </button>
        </div>
      </div>

      <div className="flex gap-lg" style={{ height: 'calc(100vh - 200px)' }}>
        {/* Lista de dashboards */}
        <div style={{ minWidth: '300px', maxWidth: '300px' }}>
          <div className="card h-full">
            <div className="card-header">
              <h3 className="card-title">Dashboards Disponibles</h3>
              <p className="card-subtitle">{dashboards.filter(d => d.isActive).length} activos</p>
            </div>
            <div className="card-content" style={{ padding: 0, overflow: 'auto' }}>
              {dashboards.map((dashboard) => (
                <button
                  key={dashboard.id}
                  className={`w-full text-left p-md border-0 bg-transparent transition cursor-pointer ${
                    selectedDashboard?.id === dashboard.id 
                      ? 'bg-primary text-white' 
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedDashboard(dashboard)}
                  style={{
                    borderBottom: '1px solid var(--border-color)',
                    backgroundColor: selectedDashboard?.id === dashboard.id ? 'var(--primary-color)' : 'transparent',
                    color: selectedDashboard?.id === dashboard.id ? 'white' : 'inherit'
                  }}
                >
                  <div className="flex items-start justify-between mb-sm">
                    <div className="font-medium">{dashboard.name}</div>
                    <div className="flex items-center gap-xs">
                      {!dashboard.isActive && (
                        <span 
                          className="badge badge-secondary"
                          style={{ 
                            fontSize: '10px',
                            backgroundColor: selectedDashboard?.id === dashboard.id ? 'rgba(255,255,255,0.2)' : undefined
                          }}
                        >
                          Inactivo
                        </span>
                      )}
                    </div>
                  </div>
                  <div 
                    className="text-sm"
                    style={{ 
                      opacity: 0.8,
                      color: selectedDashboard?.id === dashboard.id ? 'rgba(255,255,255,0.9)' : 'var(--gray-600)'
                    }}
                  >
                    {dashboard.description}
                  </div>
                  <div 
                    className="text-xs mt-sm"
                    style={{ 
                      opacity: 0.7,
                      color: selectedDashboard?.id === dashboard.id ? 'rgba(255,255,255,0.8)' : 'var(--gray-500)'
                    }}
                  >
                    {dashboard.category} • Actualizado {new Date(dashboard.lastUpdated).toLocaleDateString()}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Visor de dashboard */}
        <div style={{ flex: 1 }}>
          <div className="card h-full">
            {selectedDashboard ? (
              <>
                <div className="card-header">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="card-title">{selectedDashboard.name}</h3>
                      <p className="card-subtitle">{selectedDashboard.description}</p>
                    </div>
                    <div className="flex gap-sm">
                      <button 
                        className="btn btn-outline btn-sm"
                        onClick={() => openInNewTab(selectedDashboard.url)}
                      >
                        <ExternalLink size={16} />
                        Abrir en nueva pestaña
                      </button>
                      <button 
                        className="btn btn-outline btn-sm"
                        onClick={() => {
                          // Toggle fullscreen iframe
                          const iframe = document.getElementById('grafana-iframe') as HTMLIFrameElement;
                          if (iframe) {
                            iframe.style.position = iframe.style.position === 'fixed' ? 'relative' : 'fixed';
                            iframe.style.top = iframe.style.position === 'fixed' ? '0' : 'auto';
                            iframe.style.left = iframe.style.position === 'fixed' ? '0' : 'auto';
                            iframe.style.width = iframe.style.position === 'fixed' ? '100vw' : '100%';
                            iframe.style.height = iframe.style.position === 'fixed' ? '100vh' : '100%';
                            iframe.style.zIndex = iframe.style.position === 'fixed' ? '9999' : 'auto';
                          }
                        }}
                      >
                        <Maximize2 size={16} />
                        Pantalla completa
                      </button>
                    </div>
                  </div>
                </div>
                <div className="card-content" style={{ padding: 0, height: 'calc(100% - 80px)' }}>
                  {selectedDashboard.isActive ? (
                    <iframe
                      id="grafana-iframe"
                      src={selectedDashboard.url}
                      style={{
                        width: '100%',
                        height: '100%',
                        border: 'none',
                        borderRadius: '0 0 var(--border-radius) var(--border-radius)'
                      }}
                      title={selectedDashboard.name}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-center">
                      <div>
                        <BarChart3 size={64} className="text-secondary mx-auto mb-md" />
                        <h3 className="mb-sm">Dashboard Inactivo</h3>
                        <p className="text-secondary mb-lg">
                          Este dashboard está marcado como inactivo. Actívalo para poder visualizarlo.
                        </p>
                        <button className="btn btn-primary">
                          Activar Dashboard
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="card-content flex items-center justify-center h-full text-center">
                <div>
                  <BarChart3 size={64} className="text-secondary mx-auto mb-md" />
                  <h3 className="mb-sm">Selecciona un Dashboard</h3>
                  <p className="text-secondary mb-lg">
                    Elige un dashboard de la lista para comenzar a visualizar tus datos.
                  </p>
                  <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
                    <Plus size={16} />
                    Agregar Primer Dashboard
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <AddDashboardModal />

      {/* Información adicional */}
      <div className="card" style={{ marginTop: 'var(--spacing-lg)' }}>
        <div className="card-header">
          <h3 className="card-title">Información sobre Grafana</h3>
        </div>
        <div className="card-content">
          <div className="grid grid-3">
            <div>
              <h4 className="font-semibold mb-sm">¿Qué es Grafana?</h4>
              <p className="text-sm text-secondary">
                Grafana es una plataforma de análisis y visualización de métricas que te permite 
                crear dashboards interactivos para monitorear tus dispositivos IoT.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-sm">Configuración</h4>
              <p className="text-sm text-secondary">
                Para conectar tus dashboards de Grafana, necesitas la URL completa del dashboard 
                y permisos de visualización en tu instancia de Grafana.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-sm">Soporte</h4>
              <p className="text-sm text-secondary">
                Si tienes problemas para cargar un dashboard, verifica que la URL sea correcta 
                y que tu instancia de Grafana permita embedding en iframes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}