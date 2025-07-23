import { useEffect, useState } from 'react';
import { Router, Activity, Bell, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import MainLayout from '../components/Layout/MainLayout';
import { useApi } from '../hooks/useApi';
import { devicesAPI } from '../api/devices';
import { variablesAPI } from '../api/variables';
import { alarmsAPI } from '../api/alarms';
import '../styles/components.css';

interface DashboardStats {
  devices: {
    total: number;
    online: number;
    offline: number;
    error: number;
  };
  variables: {
    total: number;
    active: number;
  };
  alarms: {
    total: number;
    active: number;
    triggered: number;
  };
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    devices: { total: 0, online: 0, offline: 0, error: 0 },
    variables: { total: 0, active: 0 },
    alarms: { total: 0, active: 0, triggered: 0 }
  });

  // Simular datos mientras no hay backend real
  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setStats({
        devices: { total: 24, online: 18, offline: 4, error: 2 },
        variables: { total: 156, active: 142 },
        alarms: { total: 12, active: 8, triggered: 2 }
      });
    }, 1000);
  }, []);

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    change, 
    changeType 
  }: {
    title: string;
    value: string | number;
    icon: any;
    change?: string;
    changeType?: 'positive' | 'negative' | 'neutral';
  }) => (
    <div className="stat-card">
      <div className="stat-header">
        <div className="stat-title">{title}</div>
        <div className="stat-icon">
          <Icon size={20} />
        </div>
      </div>
      <div className="stat-value">{value}</div>
      {change && (
        <div className={`stat-change ${changeType}`}>
          {changeType === 'positive' && <TrendingUp size={14} />}
          {changeType === 'negative' && <TrendingDown size={14} />}
          {changeType === 'neutral' && <Minus size={14} />}
          {change}
        </div>
      )}
    </div>
  );

  const RecentActivity = () => (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Actividad Reciente</h3>
        <p className="card-subtitle">Últimos eventos del sistema</p>
      </div>
      <div className="card-content">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
          {[
            { type: 'device', message: 'Sensor temperatura #12 se conectó', time: 'Hace 5 min', status: 'success' },
            { type: 'alarm', message: 'Alarma de humedad activada en Lab A', time: 'Hace 15 min', status: 'warning' },
            { type: 'device', message: 'Dispositivo IoT-003 se desconectó', time: 'Hace 1 hora', status: 'error' },
            { type: 'variable', message: 'Nueva variable creada: Presión atm.', time: 'Hace 2 horas', status: 'info' },
          ].map((activity, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', padding: 'var(--spacing-sm)', backgroundColor: 'var(--gray-50)', borderRadius: 'var(--border-radius)' }}>
              <div 
                style={{ 
                  width: '8px', 
                  height: '8px', 
                  borderRadius: '50%',
                  backgroundColor: activity.status === 'success' ? 'var(--success-color)' : 
                                  activity.status === 'warning' ? 'var(--warning-color)' :
                                  activity.status === 'error' ? 'var(--error-color)' : 'var(--primary-color)'
                }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', fontWeight: 500 }}>{activity.message}</div>
                <div style={{ fontSize: '12px', color: 'var(--gray-500)' }}>{activity.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const QuickActions = () => (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Acciones Rápidas</h3>
        <p className="card-subtitle">Accesos directos más utilizados</p>
      </div>
      <div className="card-content">
        <div className="grid grid-2" style={{ gap: 'var(--spacing-sm)' }}>
          <button className="btn btn-outline" style={{ height: '60px', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
            <Router size={20} />
            <span style={{ fontSize: '12px' }}>Nuevo Dispositivo</span>
          </button>
          <button className="btn btn-outline" style={{ height: '60px', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
            <Activity size={20} />
            <span style={{ fontSize: '12px' }}>Nueva Variable</span>
          </button>
          <button className="btn btn-outline" style={{ height: '60px', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
            <Bell size={20} />
            <span style={{ fontSize: '12px' }}>Nueva Alarma</span>
          </button>
          <button className="btn btn-outline" style={{ height: '60px', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
            <TrendingUp size={20} />
            <span style={{ fontSize: '12px' }}>Ver Dashboard</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <MainLayout title="Dashboard Principal">
      <div className="page-header">
        <h1 className="page-title">Dashboard Principal</h1>
        <p className="page-description">
          Resumen general de tu plataforma IoT
        </p>
      </div>

      {/* Estadísticas principales */}
      <div className="grid grid-4" style={{ marginBottom: 'var(--spacing-lg)' }}>
        <StatCard
          title="Dispositivos Online"
          value={stats.devices.online}
          icon={Router}
          change="+12% vs mes anterior"
          changeType="positive"
        />
        <StatCard
          title="Variables Activas"
          value={stats.variables.active}
          icon={Activity}
          change="+5% vs mes anterior"
          changeType="positive"
        />
        <StatCard
          title="Alarmas Activas"
          value={stats.alarms.triggered}
          icon={Bell}
          change="Sin cambios"
          changeType="neutral"
        />
        <StatCard
          title="Total Dispositivos"
          value={stats.devices.total}
          icon={Router}
          change="+2 nuevos este mes"
          changeType="positive"
        />
      </div>

      {/* Estado de dispositivos */}
      <div className="grid grid-3" style={{ marginBottom: 'var(--spacing-lg)' }}>
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Estado de Dispositivos</h3>
          </div>
          <div className="card-content">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--success-color)' }}></div>
                  Online
                </span>
                <span className="font-semibold">{stats.devices.online}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--gray-400)' }}></div>
                  Offline
                </span>
                <span className="font-semibold">{stats.devices.offline}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--error-color)' }}></div>
                  Error
                </span>
                <span className="font-semibold">{stats.devices.error}</span>
              </div>
            </div>
          </div>
        </div>

        <RecentActivity />
        <QuickActions />
      </div>

      {/* Sistema de alertas recientes */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Alertas Recientes</h3>
          <p className="card-subtitle">Últimas alertas y notificaciones del sistema</p>
        </div>
        <div className="card-content">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
            {[
              { message: 'Temperatura alta en Sensor-Lab-A', severity: 'high', time: 'Hace 10 min' },
              { message: 'Pérdida de conectividad en IoT-Device-15', severity: 'medium', time: 'Hace 25 min' },
              { message: 'Batería baja en Sensor-Field-03', severity: 'low', time: 'Hace 1 hora' },
            ].map((alert, index) => (
              <div key={index} className="alert alert-warning" style={{ margin: 0 }}>
                <Bell size={16} />
                <div style={{ flex: 1 }}>
                  <div>{alert.message}</div>
                  <div style={{ fontSize: '12px', opacity: 0.8 }}>{alert.time}</div>
                </div>
                <span className={`badge badge-${alert.severity === 'high' ? 'error' : alert.severity === 'medium' ? 'warning' : 'secondary'}`}>
                  {alert.severity === 'high' ? 'Alta' : alert.severity === 'medium' ? 'Media' : 'Baja'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}