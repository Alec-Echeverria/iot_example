import { useState, useEffect } from 'react';
import { Plus, Search, Filter, Edit, Trash2, ListTree } from 'lucide-react';
import MainLayout from '../components/Layout/MainLayout';
import { variablesAPI, CreateVariableInput } from '../api/variables';
import { devicesAPI, Device } from '../api/devices';

export default function VariablesPage() {
  const [variables, setVariables] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState<CreateVariableInput>({
    device_id: '',
    variable_name: '',
    unit: '',
    description: '',
    sampling_ms: 1000
  });
  const [devices, setDevices] = useState<Device[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [variablesData, devicesData] = await Promise.all([
          variablesAPI.getAll(),
          devicesAPI.getAll()
        ]);
        setVariables(
        variablesData.map(v => ({
          ...v,
          id: v._id  // 👈 esto asegura que tenga el campo `id`
        }))
      );
        setDevices(devicesData);
      } catch (error) {
        console.error('Error al cargar datos:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateVariable = async () => {
    if (!formData.device_id) {
      alert("Por favor selecciona un dispositivo.");
      return;
    }

    try {
      await variablesAPI.create(formData);
      const updatedVariables = await variablesAPI.getAll();

      setVariables(
        updatedVariables.map(v => ({
          ...v,
          id: v._id,
        }))
      );

      setFormData({ device_id: '', variable_name: '', unit: '', description: '', sampling_ms: 1000 });
      setShowAddModal(false);
    } catch (error) {
      console.error('Error al crear variable:', error);
    }
  };

  const handleDeleteVariable = async (id: string) => {
  if (!confirm('¿Estás seguro de que deseas eliminar esta variable?')) return;

  try {
    await variablesAPI.delete(id);
    const updatedVariables = await variablesAPI.getAll();

    setVariables(
      updatedVariables.map(v => ({
        ...v,
        id: v._id,
      }))
    );
  } catch (error) {
    console.error('Error al eliminar variable:', error);
  }
};


  const filteredVariables = variables.filter((variable) => {
    return (
      variable.variable_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      variable.device_id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <MainLayout title="Variables">
      <div className="page-header">
        <div>
          <h1 className="page-title">Variables</h1>
          <p className="page-description">Listado de variables asociadas a tus dispositivos</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          <Plus size={16} /> Agregar Variable
        </button>
      </div>

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
              <th>Variable</th>
              <th>Unidad</th>
              <th>Descripción</th>
              <th>Frecuencia (ms)</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredVariables.map((variable) => (
              <tr key={variable.id}>
                <td>{variable.device_id}</td>
                <td>{variable.variable_name}</td>
                <td>{variable.unit}</td>
                <td>{variable.description}</td>
                <td>{variable.sampling_ms}</td>
                <td>
                  <div className="flex items-center gap-sm">
                    <button className="btn btn-sm btn-outline">
                      <Edit size={14} />
                    </button>
                    <button className="btn btn-sm btn-outline text-error"
                      onClick={() => handleDeleteVariable(variable.id)}

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

      {filteredVariables.length === 0 && !isLoading && (
        <div className="empty-state">
          <ListTree className="empty-state-icon" />
          <h3>No se encontraron variables</h3>
          <p>No hay variables que coincidan con los filtros seleccionados.</p>
        </div>
      )}

      {showAddModal && (
        <div className="modal-overlay open">
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">Agregar Nueva Variable</h3>
              <button className="modal-close" onClick={() => setShowAddModal(false)}>×</button>
            </div>
            <div className="modal-content">
              <form>
                <div className="form-group">
                  <label>Dispositivo</label>
                  
                  <select name="device_id" className="form-select" value={formData.device_id} onChange={handleInputChange}>
                    <option value="">Selecciona un dispositivo</option>
                    {devices.map((d) => (
                      <option key={d.device_id} value={d.device_id}>{d.name}</option>
                    ))}
                  </select>

                </div>
                <div className="form-group">
                  <label>Nombre de la Variable</label>
                  <input
                    type="text"
                    name="variable_name"
                    className="form-input"
                    value={formData.variable_name}
                    onChange={handleInputChange}
                    placeholder="Ej: Temperatura"
                  />
                </div>
                <div className="form-group">
                  <label>Unidad</label>
                  <input
                    type="text"
                    name="unit"
                    className="form-input"
                    value={formData.unit}
                    onChange={handleInputChange}
                    placeholder="Ej: °C"
                  />
                </div>
                <div className="form-group">
                  <label>Descripción</label>
                  <input
                    type="text"
                    name="description"
                    className="form-input"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Breve descripción"
                  />
                </div>
                <div className="form-group">
                  <label>Frecuencia de Muestreo (ms)</label>
                  <input
                    type="number"
                    name="sampling_ms"
                    className="form-input"
                    value={formData.sampling_ms}
                    onChange={handleInputChange}
                    min={100}
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={handleCreateVariable}>Agregar Variable</button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}

