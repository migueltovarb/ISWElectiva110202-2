import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Thermometer, Droplets, AlertTriangle, DoorOpen, Filter } from 'lucide-react';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface SensorData {
  timestamp: string;
  temperature: number;
  humidity: number;
}

interface DoorSensorData extends SensorData {
  doorId: string;
  doorName: string;
}

export function EnvironmentalMonitoring() {
  const { t } = useTranslation();
  const [selectedDoor, setSelectedDoor] = useState<string>('all');
  const [sensorData, setSensorData] = useState<DoorSensorData[]>([]);
  const [alerts, setAlerts] = useState<string[]>([]);
  const [view, setView] = useState<'general' | 'detailed'>('general');

  const doors = [
    { id: '1', name: 'Entrada Principal' },
    { id: '2', name: 'Sala de Servidores' },
    { id: '3', name: 'Cafetería' },
    { id: '4', name: 'Sala de Reuniones' },
  ];

  // Simulate real-time sensor data for all doors
  useEffect(() => {
    const interval = setInterval(() => {
      const newDataPoints = doors.map(door => ({
        doorId: door.id,
        doorName: door.name,
        timestamp: new Date().toLocaleTimeString(),
        temperature: 20 + Math.random() * 5,
        humidity: 40 + Math.random() * 20,
      }));

      setSensorData(prev => {
        const updated = [...prev, ...newDataPoints].slice(-80); // Keep last 80 readings
        
        // Check for abnormal conditions
        newDataPoints.forEach(data => {
          if (data.temperature > 24) {
            setAlerts(prev => [
              `Alta temperatura en ${data.doorName}: ${data.temperature.toFixed(1)}°C`,
              ...prev,
            ].slice(0, 5));
          }
          if (data.humidity > 55) {
            setAlerts(prev => [
              `Alta humedad en ${data.doorName}: ${data.humidity.toFixed(1)}%`,
              ...prev,
            ].slice(0, 5));
          }
        });
        
        return updated;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const filteredData = selectedDoor === 'all' 
    ? sensorData 
    : sensorData.filter(data => data.doorId === selectedDoor);

  const getAverageReadings = () => {
    if (sensorData.length === 0) return { temp: 0, humidity: 0 };
    
    const currentReadings = doors.map(door => 
      sensorData.filter(data => data.doorId === door.id).slice(-1)[0]
    ).filter(Boolean);

    return {
      temp: currentReadings.reduce((acc, curr) => acc + curr.temperature, 0) / currentReadings.length,
      humidity: currentReadings.reduce((acc, curr) => acc + curr.humidity, 0) / currentReadings.length,
    };
  };

  const averageReadings = getAverageReadings();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          {t('environmental.title')}
        </h2>
        <div className="flex items-center space-x-4">
          <Button
            variant={view === 'general' ? 'primary' : 'outline'}
            onClick={() => setView('general')}
          >
            Vista General
          </Button>
          <Button
            variant={view === 'detailed' ? 'primary' : 'outline'}
            onClick={() => setView('detailed')}
          >
            Vista Detallada
          </Button>
        </div>
      </div>

      {view === 'general' ? (
        <>
          {/* Vista General - Promedios */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
                  <Thermometer className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-500">Temperatura Promedio</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {averageReadings.temp.toFixed(1)}°C
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
                  <Droplets className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="text-sm text-gray-500">Humedad Promedio</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {averageReadings.humidity.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center space-x-2 mb-4">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Alertas Generales
                </h3>
              </div>
              <div className="space-y-2">
                {alerts.map((alert, index) => (
                  <div
                    key={index}
                    className="p-3 bg-amber-50 text-amber-700 rounded-md text-sm"
                  >
                    {alert}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Gráfico General */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Tendencias Generales
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={sensorData.slice(-20)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis yAxisId="temp" domain={[15, 30]} />
                <YAxis yAxisId="humidity" orientation="right" domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="temp"
                  type="monotone"
                  dataKey="temperature"
                  stroke="#3b82f6"
                  name="Temperatura (°C)"
                />
                <Line
                  yAxisId="humidity"
                  type="monotone"
                  dataKey="humidity"
                  stroke="#22c55e"
                  name="Humedad (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      ) : (
        <>
          {/* Vista Detallada - Por Puerta */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center space-x-4 mb-6">
              <Filter className="h-5 w-5 text-gray-500" />
              <Select
                value={selectedDoor}
                onChange={(e) => setSelectedDoor(e.target.value)}
                className="w-64"
              >
                <option value="all">Todas las puertas</option>
                {doors.map(door => (
                  <option key={door.id} value={door.id}>
                    {door.name}
                  </option>
                ))}
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {doors.map(door => {
                const doorData = sensorData.find(data => data.doorId === door.id);
                if (!doorData || selectedDoor !== 'all' && door.id !== selectedDoor) return null;

                return (
                  <div key={door.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <DoorOpen className="h-5 w-5 text-gray-600" />
                      <h4 className="font-medium text-gray-900">{door.name}</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-blue-50 rounded p-2">
                        <p className="text-xs text-gray-500">Temperatura</p>
                        <p className="text-lg font-semibold text-blue-700">
                          {doorData.temperature.toFixed(1)}°C
                        </p>
                      </div>
                      <div className="bg-green-50 rounded p-2">
                        <p className="text-xs text-gray-500">Humedad</p>
                        <p className="text-lg font-semibold text-green-700">
                          {doorData.humidity.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Historial Detallado
              </h3>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={filteredData.slice(-20)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" />
                  <YAxis yAxisId="temp" domain={[15, 30]} />
                  <YAxis yAxisId="humidity" orientation="right" domain={[0, 100]} />
                  <Tooltip content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white p-3 shadow-lg rounded-lg border">
                          <p className="text-sm font-medium text-gray-900">
                            {payload[0].payload.doorName}
                          </p>
                          <p className="text-sm text-blue-600">
                          Temperatura: {Number(payload[0].value).toFixed(1)}°C
                          </p>
                          <p className="text-sm text-green-600">
                          Humedad: {Number(payload[1].value).toFixed(1)}%
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }} />
                  <Legend />
                  <Line
                    yAxisId="temp"
                    type="monotone"
                    dataKey="temperature"
                    stroke="#3b82f6"
                    name="Temperatura (°C)"
                  />
                  <Line
                    yAxisId="humidity"
                    type="monotone"
                    dataKey="humidity"
                    stroke="#22c55e"
                    name="Humedad (%)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
}