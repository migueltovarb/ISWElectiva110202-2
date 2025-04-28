import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Building, Users, Shield, ArrowRight, QrCode, Key, X } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface AppointmentForm {
  name: string;
  email: string;
  company: string;
  visitPurpose: string;
  hostName: string;
  date: string;
  startTime: string;
  endTime: string;
}

interface AppointmentVoucher extends AppointmentForm {
  pin: string;
  qrCode: string;
  appointmentId: string;
}

export function Home() {
  const [showForm, setShowForm] = useState(false);
  const [showVoucher, setShowVoucher] = useState(false);
  const [voucher, setVoucher] = useState<AppointmentVoucher | null>(null);
  const [formData, setFormData] = useState<AppointmentForm>({
    name: '',
    email: '',
    company: '',
    visitPurpose: '',
    hostName: '',
    date: '',
    startTime: '',
    endTime: '',
  });

  const generatePin = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const generateAppointmentId = () => {
    return Math.random().toString(36).substr(2, 9).toUpperCase();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const appointmentId = generateAppointmentId();
    const pin = generatePin();
    const qrCode = `VERKADA-VISIT-${appointmentId}`;
    
    const newVoucher: AppointmentVoucher = {
      ...formData,
      pin,
      qrCode,
      appointmentId,
    };
    
    setVoucher(newVoucher);
    setShowForm(false);
    setShowVoucher(true);

   
  };

  const handleClose = () => {
    setShowVoucher(false);
    setVoucher(null);
    setFormData({
      name: '',
      email: '',
      company: '',
      visitPurpose: '',
      hostName: '',
      date: '',
      startTime: '',
      endTime: '',
    });
  };

  const formatDate = (date: string) => {
    return format(new Date(date), "EEEE d 'de' MMMM 'de' yyyy", { locale: es });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <span className="text-2xl font-['Playfair_Display'] tracking-wider text-gray-900">
            Verkada
          </span>
          <div className="flex items-center space-x-4">
            <Link to="/login">
              <Button variant="outline">Iniciar Sesión</Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
             Verkada IT
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Especialistas en desarrollo de software, ¿Deseas contratar nuestros servicios?
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <Button
              size="lg"
              onClick={() => setShowForm(true)}
              className="w-full sm:w-auto"
            >
              Agendar Visita Here
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center text-center p-6">
              <div className="p-3 bg-indigo-100 rounded-full">
                <Shield className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Software seguro</h3>
              <p className="mt-2 text-gray-500">
                lorem ipsum  
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6">
              <div className="p-3 bg-green-100 rounded-full">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Muchas personas confian en nosotros</h3>
              <p className="mt-2 text-gray-500">
                lorem ipsum
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6">
              <div className="p-3 bg-blue-100 rounded-full">
                <Building className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Tú tienes el control</h3>
              <p className="mt-2 text-gray-500">
                lorem ipsum
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Appointment Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  Agendar Visita Aqui
                </h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre Completo
                  </label>
                  <Input
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Correo Electrónico
                  </label>
                  <Input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Empresa
                  </label>
                  <Input
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Motivo de la Visita
                  </label>
                  <Input
                    required
                    value={formData.visitPurpose}
                    onChange={(e) => setFormData({ ...formData, visitPurpose: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Persona a Visitar
                  </label>
                  <Input
                    required
                    value={formData.hostName}
                    onChange={(e) => setFormData({ ...formData, hostName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha de Visita
                  </label>
                  <Input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hora de Entrada
                    </label>
                    <Input
                      type="time"
                      required
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hora de Salida
                    </label>
                    <Input
                      type="time"
                      required
                      value={formData.endTime}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowForm(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit">
                    Agendar Visita Final
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Voucher Modal */}
      {showVoucher && voucher && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
            <div className="p-8">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-3xl font-['Playfair_Display'] tracking-wider text-gray-900">
                    Verkada
                  </h2>
                  <p className="text-gray-500 mt-1">Sistema de Control de Acceso</p>
                </div>
                <button
                  onClick={handleClose}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="mt-8 border-t pt-8">
                <div className="flex justify-between items-start">
                  <div className="space-y-6 flex-1">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Detalles de la Visita
                      </h3>
                      <p className="text-gray-600 mt-1">ID: {voucher.appointmentId}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Visitante</p>
                        <p className="mt-1 text-gray-900">{voucher.name}</p>
                        <p className="text-gray-600">{voucher.email}</p>
                        <p className="text-gray-600">{voucher.company}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Anfitrión</p>
                        <p className="mt-1 text-gray-900">{voucher.hostName}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-500">Fecha y Hora</p>
                      <p className="mt-1 text-gray-900">{formatDate(voucher.date)}</p>
                      <p className="text-gray-600">
                        {voucher.startTime} - {voucher.endTime}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-500">Motivo de la Visita</p>
                      <p className="mt-1 text-gray-900">{voucher.visitPurpose}</p>
                    </div>
                  </div>

                  <div className="ml-8 flex flex-col items-center space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <QRCodeSVG value={voucher.qrCode} size={128} />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-500">PIN de Acceso</p>
                      <p className="mt-1 text-2xl font-mono font-bold tracking-wider text-indigo-600">
                        {voucher.pin}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Importante:</strong> Se ha enviado una copia de este comprobante a su correo electrónico. 
                  Por favor, guarde el PIN y el código QR, los necesitará para acceder al edificio.
                </p>
              </div>

              <div className="mt-8 flex justify-end space-x-3">
                <Button variant="outline" onClick={handleClose}>
                  Cerrar
                </Button>
                <Button onClick={() => window.print()}>
                  Imprimir
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}