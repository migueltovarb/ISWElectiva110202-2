import { useState } from 'react';
import { jsPDF } from 'jspdf';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Download, FileSpreadsheet, File as FilePdf } from 'lucide-react';

export function ExportarRegistros() {
  const [formato, setFormato] = useState('csv');
  const [rangoFechas, setRangoFechas] = useState({
    inicio: '',
    fin: '',
  });

  const manejarExportacion = () => {

    const datos = [
      { timestamp: '2024-03-10 09:00', usuario: 'John Doe', accion: 'Acceso a puerta', ubicacion: 'Entrada principal' },
      { timestamp: '2024-03-10 09:15', usuario: 'Jane Smith', accion: 'Escaneo de tarjeta', ubicacion: 'Puerta de seguridad' },
     
    ];

    if (formato === 'csv') {
      // Exportar como CSV
      const encabezados = ['Fecha y hora', 'Usuario', 'Acción', 'Ubicación'];
      const contenidoCsv = [
        encabezados.join(','),
        ...datos.map(row => 
          [row.timestamp, row.usuario, row.accion, row.ubicacion].join(',')
        )
      ].join('\n');

      const blob = new Blob([contenidoCsv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'registros_de_acceso.csv';
      a.click();
      window.URL.revokeObjectURL(url);
    } else {
    
      const doc = new jsPDF();
      
      doc.setFontSize(16);
      doc.text('Registros de Control de Acceso', 20, 20);
      
      doc.setFontSize(12);
      let y = 40;
      datos.forEach(row => {
        doc.text(`${row.timestamp} - ${row.usuario}`, 20, y);
        doc.text(`${row.accion} en ${row.ubicacion}`, 20, y + 7);
        y += 20;
      });
      
      doc.save('registros_de_acceso.pdf');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Exportar Registros</h2>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Formato de exportación */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Formato de exportación
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                className={`flex items-center justify-center p-4 rounded-lg border-2 ${formato === 'csv' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                onClick={() => setFormato('csv')}
              >
                <FileSpreadsheet className="h-6 w-6 mr-2" />
                <span>CSV</span>
              </button>
              <button
                className={`flex items-center justify-center p-4 rounded-lg border-2 ${formato === 'pdf' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                onClick={() => setFormato('pdf')}
              >
                <FilePdf className="h-6 w-6 mr-2" />
                <span>PDF</span>
              </button>
            </div>
          </div>

          {/* Rango de fechas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rango de fechas
            </label>
            <div className="space-y-3">
              <Input
                type="date"
                value={rangoFechas.inicio}
                onChange={(e) =>
                  setRangoFechas((prev) => ({ ...prev, inicio: e.target.value }))
                }
              />
              <Input
                type="date"
                value={rangoFechas.fin}
                onChange={(e) =>
                  setRangoFechas((prev) => ({ ...prev, fin: e.target.value }))
                }
              />
            </div>
          </div>
        </div>

        {/* Botón de exportación */}
        <div className="mt-6">
          <Button onClick={manejarExportacion} className="w-full md:w-auto" size="lg">
            <Download className="h-5 w-5 mr-2" />
            Exportar
          </Button>
        </div>
      </div>
    </div>
  );
}
