import { useState, useEffect } from 'react';
import { Plus, Router, Wifi, WifiOff, AlertTriangle, Search, Filter, Edit, Trash2 } from 'lucide-react';
import MainLayout from '../components/Layout/MainLayout';
import { devicesAPI, Device } from '../api/devices';

export default function Devices() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', device_id: '' });
  const [createdMqttData, setCreatedMqttData] = useState<any>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const data = await devicesAPI.getAll();
        setDevices(data);
      } catch (error) {
        console.error('Error cargando dispositivos:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDevices();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateDevice = async () => {
    try {
      const newDevice = await devicesAPI.create(formData);
      const updatedDevices = await devicesAPI.getAll();
      setDevices(updatedDevices);
      setFormData({ name: '', device_id: '' });
      setShowAddModal(false);
      setCreatedMqttData({
        name: newDevice.name,
        device_id: newDevice.device_id,
        mqtt_username: newDevice.mqtt_username,
        mqtt_password: newDevice.mqtt_password
      });
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error al crear dispositivo:', error);
    }
  };

  const filteredDevices = devices.filter(device => {
    const matchSearch =
      device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.device_id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'all' || device.status.toLowerCase() === statusFilter;
    return matchSearch && matchStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return <Wifi size={16} className="text-success" />;
      case 'offline': return <WifiOff size={16} className="text-secondary" />;
      case 'error': return <AlertTriangle size={16} className="text-error" />;
      default: return <WifiOff size={16} className="text-secondary" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      online: { label: 'Online', class: 'badge-success' },
      offline: { label: 'Offline', class: 'badge-secondary' },
      error: { label: 'Error', class: 'badge-error' }
    };
    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.offline;
    return <span className={`badge ${statusInfo.class}`}>{statusInfo.label}</span>;
  };

  const handleDeleteDevice = async (device_id: string) => {
    const confirmDelete = window.confirm("¿Estás seguro de eliminar este dispositivo?");
    if (!confirmDelete) return;

    try {
      await devicesAPI.delete(device_id);
      const updatedDevices = await devicesAPI.getAll();
      setDevices(updatedDevices);
    } catch (error) {
      console.error("Error eliminando el dispositivo:", error);
      alert("No se pudo eliminar el dispositivo");
    }
  };

  return (
    <MainLayout title="Gestión de Dispositivos">
      <div className="page-header">
        <div>
          <h1 className="page-title">Gestión de Dispositivos</h1>
          <p className="page-description">Administra y monitorea tus dispositivos IoT</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          <Plus size={16} /> Agregar Dispositivo
        </button>
      </div>

      <div className="grid grid-4" style={{ marginBottom: 'var(--spacing-lg)' }}>
        <div className="stat-card">
          <div className="stat-header"><div className="stat-title">Total</div><Router size={20} /></div>
          <div className="stat-value">{devices.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-header"><div className="stat-title">Online</div><Wifi size={20} /></div>
          <div className="stat-value text-success">{devices.filter(d => d.status === 'online').length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-header"><div className="stat-title">Offline</div><WifiOff size={20} /></div>
          <div className="stat-value text-secondary">{devices.filter(d => d.status === 'offline').length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-header"><div className="stat-title">Error</div><AlertTriangle size={20} /></div>
          <div className="stat-value text-error">{devices.filter(d => d.status === 'error').length}</div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 'var(--spacing-lg)' }}>
        <div className="card-content">
          <div className="flex items-center gap-md">
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
              <input
                type="text"
                className="form-input"
                placeholder="Buscar dispositivos..."
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
              <option value="all">Todos</option>
              <option value="online">Online</option>
              <option value="offline">Offline</option>
              <option value="error">Error</option>
            </select>
            <button className="btn btn-outline">
              <Filter size={16} /> Más filtros
            </button>
          </div>
        </div>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Dispositivo</th>
              <th>Estado</th>
              <th>ID</th>
              <th>MQTT</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredDevices.map((device) => (
              <tr key={device.id}>
                <td><strong>{device.name}</strong></td>
                <td>{getStatusBadge(device.status || 'offline')}</td>
                <td>{device.device_id}</td>
                <td>{device.mqtt_username || '-'}</td>
                <td>
                  <div className="flex items-center gap-sm">
                    <button className="btn btn-sm btn-outline"><Edit size={14} /></button>
                    <button
                      className="btn btn-sm btn-outline text-error"
                      onClick={() => handleDeleteDevice(device.device_id)}
                    >
                      <Trash2 size={14} />
                    </button>

                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredDevices.length === 0 && !isLoading && (
        <div className="empty-state">
          <Router className="empty-state-icon" />
          <h3>No se encontraron dispositivos</h3>
          <p>No hay dispositivos que coincidan con los filtros seleccionados.</p>
        </div>
      )}

      {showAddModal && (
        <div className="modal-overlay open">
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">Agregar Nuevo Dispositivo</h3>
              <button className="modal-close" onClick={() => setShowAddModal(false)}>×</button>
            </div>
            <div className="modal-content">
              <form>
                <div className="form-group">
                  <label>Nombre del Dispositivo</label>
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="form-input" placeholder="Ej: Sensor Temperatura" />
                </div>
                <div className="form-group">
                  <label>ID del Dispositivo</label>
                  <input type="text" name="device_id" value={formData.device_id} onChange={handleInputChange} className="form-input" placeholder="Ej: dev001" />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={handleCreateDevice}>Agregar Dispositivo</button>
            </div>
          </div>
        </div>
      )}

      {showSuccessModal && createdMqttData && (
        <div className="modal-overlay open">
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">✅ Dispositivo creado correctamente</h3>
              <button className="modal-close" onClick={() => setShowSuccessModal(false)}>×</button>
            </div>
            <div className="modal-content">
              <p><strong>Dispositivo:</strong> {createdMqttData.name} ({createdMqttData.device_id})</p>
              <p><strong>Usuario MQTT:</strong> {createdMqttData.mqtt_username}</p>
              <p><strong>Contraseña MQTT:</strong> {createdMqttData.mqtt_password}</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" onClick={() => setShowSuccessModal(false)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
