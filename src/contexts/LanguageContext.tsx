import { createContext, useContext, useState, ReactNode } from 'react';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';


i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          common: {
            save: 'Save',
            cancel: 'Cancel',
            export: 'Export',
            monitor: 'Monitor',
            settings: 'Settings',
          },
          environmental: {
            title: 'Environmental Monitoring',
            temperature: 'Temperature',
            humidity: 'Humidity',
            alerts: 'Alerts',
          },
          export: {
            title: 'Export Records',
            format: 'Format',
            dateRange: 'Date Range',
            filters: 'Filters',
          },
        },
      },
      es: {
        translation: {
          common: {
            save: 'Guardar',
            cancel: 'Cancelar',
            export: 'Exportar',
            monitor: 'Monitorear',
            settings: 'Configuración',
          },
          environmental: {
            title: 'Monitoreo Ambiental',
            temperature: 'Temperatura',
            humidity: 'Humedad',
            alerts: 'Alertas',
          },
          export: {
            title: 'Exportar Registros',
            format: 'Formato',
            dateRange: 'Rango de Fechas',
            filters: 'Filtros',
          },
        },
      },
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState(i18n.language);

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    setLanguage(lang);
  };

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage: handleLanguageChange }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}