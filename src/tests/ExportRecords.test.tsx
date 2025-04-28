import { render, screen, fireEvent } from '@testing-library/react';
import { ExportarRegistros } from './ExportarRegistros';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import i18n from 'i18next';

// Inicialización de i18n para pruebas (puedes omitir esta parte si ya tienes un archivo de traducción en español)
beforeAll(() => {
  i18n.use(initReactI18next).init({
    resources: {
      es: {
        translation: {
          "export.title": "Exportar Registros",
          "export.format": "Formato de exportación",
          "export.dateRange": "Rango de fechas",
          "common.export": "Exportar",
        },
      },
    },
    lng: 'es',
    fallbackLng: 'es',
  });
});

describe('ExportarRegistros', () => {
  it('debe renderizar el componente y mostrar el título', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <ExportarRegistros />
      </I18nextProvider>
    );

    // Verificar que el título "Exportar Registros" esté en el documento
    expect(screen.getByText('Exportar Registros')).toBeInTheDocument();
  });

  it('debe cambiar el formato de exportación a CSV y PDF', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <ExportarRegistros />
      </I18nextProvider>
    );

    // Verificar que los botones estén en el documento
    expect(screen.getByText('CSV')).toBeInTheDocument();
    expect(screen.getByText('PDF')).toBeInTheDocument();

    // Cambiar a formato CSV
    fireEvent.click(screen.getByText('CSV'));
    expect(screen.getByText('CSV')).toHaveClass('border-blue-500 bg-blue-50');

    // Cambiar a formato PDF
    fireEvent.click(screen.getByText('PDF'));
    expect(screen.getByText('PDF')).toHaveClass('border-blue-500 bg-blue-50');
  });

  it('debe cambiar el rango de fechas', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <ExportarRegistros />
      </I18nextProvider>
    );

    // Cambiar las fechas
    const fechaInicio = screen.getByLabelText('Rango de fechas').parentElement?.querySelectorAll('input')[0];
    const fechaFin = screen.getByLabelText('Rango de fechas').parentElement?.querySelectorAll('input')[1];

    fireEvent.change(fechaInicio, { target: { value: '2024-03-01' } });
    fireEvent.change(fechaFin, { target: { value: '2024-03-31' } });

    expect(fechaInicio).toHaveValue('2024-03-01');
    expect(fechaFin).toHaveValue('2024-03-31');
  });

  it('debe ejecutar la exportación al hacer clic en el botón de exportación', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <ExportarRegistros />
      </I18nextProvider>
    );

    // Simular la exportación
    const botonExportar = screen.getByText('Exportar');
    fireEvent.click(botonExportar);

    // Aquí deberías verificar si se ha llamado a la función de exportación, si es que hay una forma de mockearla.
    // Por ejemplo, si la función `manejarExportacion` es un servicio o función que debes mockear para comprobar su invocación.
    // Si solo se verifica el cambio de estado, no necesitarías mockearla, pero en el caso de un mock:
    // expect(mockExportFunction).toHaveBeenCalled();
  });
});
