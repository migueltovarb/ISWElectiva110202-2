import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { jsPDF } from 'jspdf';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Download, FileSpreadsheet, File as FilePdf } from 'lucide-react';

export function ExportRecords() {
  const { t } = useTranslation();
  const [format, setFormat] = useState('csv');
  const [dateRange, setDateRange] = useState({
    start: '',
    end: '',
  });

  const handleExport = () => {
    // Simulated data for demonstration
    const data = [
      { timestamp: '2024-03-10 09:00', user: 'John Doe', action: 'Door Access', location: 'Main Entrance' },
      { timestamp: '2024-03-10 09:15', user: 'Jane Smith', action: 'Card Scan', location: 'Security Gate' },
      // Add more sample data as needed
    ];

    if (format === 'csv') {
      // Export as CSV
      const headers = ['Timestamp', 'User', 'Action', 'Location'];
      const csvContent = [
        headers.join(','),
        ...data.map(row => 
          [row.timestamp, row.user, row.action, row.location].join(',')
        )
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'access_records.csv';
      a.click();
      window.URL.revokeObjectURL(url);
    } else {
      // Export as PDF
      const doc = new jsPDF();
      
      doc.setFontSize(16);
      doc.text('Access Control Records', 20, 20);
      
      doc.setFontSize(12);
      let y = 40;
      data.forEach(row => {
        doc.text(`${row.timestamp} - ${row.user}`, 20, y);
        doc.text(`${row.action} at ${row.location}`, 20, y + 7);
        y += 20;
      });
      
      doc.save('access_records.pdf');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">{t('export.title')}</h2>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Export Format */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('export.format')}
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                className={`flex items-center justify-center p-4 rounded-lg border-2 ${
                  format === 'csv'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200'
                }`}
                onClick={() => setFormat('csv')}
              >
                <FileSpreadsheet className="h-6 w-6 mr-2" />
                <span>CSV</span>
              </button>
              <button
                className={`flex items-center justify-center p-4 rounded-lg border-2 ${
                  format === 'pdf'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200'
                }`}
                onClick={() => setFormat('pdf')}
              >
                <FilePdf className="h-6 w-6 mr-2" />
                <span>PDF</span>
              </button>
            </div>
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('export.dateRange')}
            </label>
            <div className="space-y-3">
              <Input
                type="date"
                value={dateRange.start}
                onChange={(e) =>
                  setDateRange((prev) => ({ ...prev, start: e.target.value }))
                }
              />
              <Input
                type="date"
                value={dateRange.end}
                onChange={(e) =>
                  setDateRange((prev) => ({ ...prev, end: e.target.value }))
                }
              />
            </div>
          </div>
        </div>

        {/* Export Button */}
        <div className="mt-6">
          <Button
            onClick={handleExport}
            className="w-full md:w-auto"
            size="lg"
          >
            <Download className="h-5 w-5 mr-2" />
            {t('common.export')}
          </Button>
        </div>
      </div>
    </div>
  );
}