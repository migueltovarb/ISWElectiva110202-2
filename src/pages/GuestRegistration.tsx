import { useState } from 'react';
import { User, Clock, Calendar, Key, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import type { UserRole } from '@/contexts/AuthContext';

interface GuestFormData {
  name: string;
  email: string;
  company: string;
  visitPurpose: string;
  hostName: string;
  startTime: string;
  endTime: string;
  selectedDoors: string[];
}

export function GuestRegistration() {
  const [formData, setFormData] = useState<GuestFormData>({
    name: '',
    email: '',
    company: '',
    visitPurpose: '',
    hostName: '',
    startTime: '',
    endTime: '',
    selectedDoors: [],
  });

  const [temporaryPin, setTemporaryPin] = useState<string>('');
  const [showSuccess, setShowSuccess] = useState(false);

  const availableDoors = [
    { id: '1', name: 'Entrada Principal' },
    { id: '2', name: 'Sala de Reuniones A' },
    { id: '3', name: 'Sala de Reuniones B' },
    { id: '4', name: 'Cafetería' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generar PIN temporal (en producción, esto debería ser más seguro)
    const pin = Math.floor(100000 + Math.random() * 900000).toString();
    setTemporaryPin(pin);
    setShowSuccess(true);
    
    // Aquí iría la lógica para guardar en la base de datos
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDoorSelection = (doorId: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedDoors: prev.selectedDoors.includes(doorId)
        ? prev.selectedDoors.filter(id => id !== doorId)
        : [...prev.selectedDoors, doorId]
    }));
  };

  if (showSuccess) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="text-center mb-6">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              ¡Visitante Registrado!
            </h2>
            <p className="text-gray-600">
              El visitante ha sido registrado exitosamente en el sistema.
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-gray-900 mb-2">
              Credenciales Temporales
            </h3>
            <div className="bg-white p-4 rounded-md border border-gray-200">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">PIN Temporal:</p>
                <p className="text-3xl font-mono font-bold tracking-wider text-indigo-600">
                  {temporaryPin}
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Este PIN es válido solo durante el período especificado.
            </p>
          </div>

          <div className="space-y-4">
            <div className="border-t pt-4">
              <h4 className="font-medium text-gray-900 mb-2">Detalles del Visitante</h4>
              <dl className="grid grid-cols-1 gap-2 text-sm">
                <div className="flex justify-between py-1">
                  <dt className="text-gray-500">Nombre:</dt>
                  <dd className="text-gray-900">{formData.name}</dd>
                </div>
                <div className="flex justify-between py-1">
                  <dt className="text-gray-500">Email:</dt>
                  <dd className="text-gray-900">{formData.email}</dd>
                </div>
                <div className="flex justify-between py-1">
                  <dt className="text-gray-500">Horario:</dt>
                  <dd className="text-gray-900">{formData.startTime} - {formData.endTime}</dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => {
                setShowSuccess(false);
                setFormData({
                  name: '',
                  email: '',
                  company: '',
                  visitPurpose: '',
                  hostName: '',
                  startTime: '',
                  endTime: '',
                  selectedDoors: [],
                });
              }}
            >
              Registrar otro visitante
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-indigo-500 to-purple-600">
          <h2 className="text-2xl font-bold text-white">Registro de Visitantes</h2>
          <p className="text-indigo-100 mt-1">
            Complete el formulario para registrar un nuevo visitante
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre Completo
              </label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Correo Electrónico
              </label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Empresa
              </label>
              <Input
                name="company"
                value={formData.company}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Motivo de la Visita
              </label>
              <Input
                name="visitPurpose"
                value={formData.visitPurpose}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Persona que Visita
              </label>
              <Input
                name="hostName"
                value={formData.hostName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hora de Entrada
                </label>
                <Input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hora de Salida
                </label>
                <Input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Accesos Permitidos
              </label>
              <div className="grid grid-cols-2 gap-3">
                {availableDoors.map((door) => (
                  <button
                    key={door.id}
                    type="button"
                    onClick={() => handleDoorSelection(door.id)}
                    className={`p-3 rounded-lg border text-left transition-colors ${
                      formData.selectedDoors.includes(door.id)
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center">
                      <Key className={`h-4 w-4 mr-2 ${
                        formData.selectedDoors.includes(door.id)
                          ? 'text-indigo-500'
                          : 'text-gray-400'
                      }`} />
                      <span className="text-sm font-medium">{door.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t flex justify-end space-x-3">
            <Button type="submit">
              Registrar Visitante
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}