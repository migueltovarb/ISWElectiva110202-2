import { useState, useEffect } from 'react';
import { CheckCircle, AlertTriangle, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

// Código de verificación ficticio
const VERIFICATION_CODE = '123456';

export function RegistrationSuccess() {
  const navigate = useNavigate();
  const [emailStatus, setEmailStatus] = useState<'sending' | 'success' | 'error'>('sending');
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const sendEmail = () => {
      setTimeout(() => {
        setEmailStatus('success');
      }, 2000);
    };

    sendEmail();
  }, [retryCount]);

  const handleRetry = () => {
    setEmailStatus('sending');
    setRetryCount(prev => prev + 1);
  };

  const renderContent = () => {
    switch (emailStatus) {
      case 'sending':
        return (
          <>
            <div className="flex justify-center mb-4">
              <RotateCw className="h-16 w-16 text-blue-500 animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Enviando correo de verificación...
            </h2>
            <p className="text-gray-600 mb-6">
              Por favor, espere mientras enviamos el correo de verificación.
            </p>
          </>
        );
      case 'error':
        return (
          <>
            <div className="flex justify-center mb-4">
              <AlertTriangle className="h-16 w-16 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Error al enviar el correo
            </h2>
            <p className="text-gray-600 mb-6">
              No pudimos enviar el correo de verificación. Esto puede deberse a:
              <ul className="list-disc list-inside mt-2 text-left">
                <li>Problemas de conexión</li>
                <li>El servidor de correo no está disponible</li>
                <li>La dirección de correo no es válida</li>
              </ul>
            </p>
            <div className="space-y-3">
              <Button onClick={handleRetry} className="w-full">
                <RotateCw className="mr-2 h-4 w-4" />
                Intentar nuevamente
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/register')} 
                className="w-full"
              >
                Volver al registro
              </Button>
            </div>
          </>
        );
      case 'success':
        return (
          <>
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              ¡Registro Exitoso!
            </h2>
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <p className="text-blue-800 font-medium mb-2">
                Su código de verificación es:
              </p>
              <div className="bg-white p-3 rounded border border-blue-200 text-center">
                <span className="text-2xl font-mono font-bold tracking-wider text-blue-600">
                  {VERIFICATION_CODE}
                </span>
              </div>
              <p className="text-sm text-blue-600 mt-2">
                Use este código para verificar su cuenta en el siguiente paso
              </p>
            </div>
            <div className="space-y-3">
              <Button onClick={() => navigate('/login')} className="w-full">
                Ir al inicio de sesión
              </Button>
              <p className="text-sm text-gray-500">
                ¿No recibió el código? 
                <button 
                  onClick={handleRetry}
                  className="text-blue-600 hover:text-blue-800 ml-1"
                >
                  Reenviar código
                </button>
              </p>
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}