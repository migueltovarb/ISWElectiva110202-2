import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Lock, Check, X } from 'lucide-react';

interface PasswordRequirement {
  id: string;
  label: string;
  met: boolean;
}

export function PasswordPolicy() {
  const { t } = useTranslation();
  const [policy, setPolicy] = useState({
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecial: true,
    expiryDays: 90,
  });

  const [samplePassword, setSamplePassword] = useState('');
  const [requirements, setRequirements] = useState<PasswordRequirement[]>([
    { id: 'length', label: 'Minimum 8 characters', met: false },
    { id: 'uppercase', label: 'At least one uppercase letter', met: false },
    { id: 'lowercase', label: 'At least one lowercase letter', met: false },
    { id: 'number', label: 'At least one number', met: false },
    { id: 'special', label: 'At least one special character', met: false },
  ]);

  useEffect(() => {
    checkPassword(samplePassword);
  }, [policy.minLength]);

  const checkPassword = (password: string) => {
    const newRequirements: PasswordRequirement[] = [
      {
        id: 'length',
        label: `Minimum ${policy.minLength} characters`,
        met: password.length >= policy.minLength,
      },
      {
        id: 'uppercase',
        label: 'At least one uppercase letter',
        met: policy.requireUppercase ? /[A-Z]/.test(password) : true,
      },
      {
        id: 'lowercase',
        label: 'At least one lowercase letter',
        met: policy.requireLowercase ? /[a-z]/.test(password) : true,
      },
      {
        id: 'number',
        label: 'At least one number',
        met: policy.requireNumbers ? /[0-9]/.test(password) : true,
      },
      {
        id: 'special',
        label: 'At least one special character',
        met: policy.requireSpecial ? /[!@#$%^&*(),.?":{}|<>]/.test(password) : true,
      },
    ];
    setRequirements(newRequirements);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    setSamplePassword(password);
    checkPassword(password);
  };

  const handlePolicyChange = (field: string, value: number | boolean) => {
    const newPolicy = { ...policy, [field]: value };
    setPolicy(newPolicy);
    checkPassword(samplePassword);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">
        {t('passwordPolicy.title')}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Policy Configuration */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {t('passwordPolicy.configuration')}
          </h3>
          
          <div className="space-y-4">
            <div>
              <label 
                htmlFor="minLength" 
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {t('passwordPolicy.minLength')}
              </label>
              <Input
                id="minLength"
                type="number"
                value={policy.minLength}
                onChange={(e) => handlePolicyChange('minLength', parseInt(e.target.value))}
                min="8"
                max="32"
                data-testid="min-length-input"
              />
            </div>

            <div>
              <label 
                htmlFor="expiryDays" 
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {t('passwordPolicy.expiryDays')}
              </label>
              <Input
                id="expiryDays"
                type="number"
                value={policy.expiryDays}
                onChange={(e) => handlePolicyChange('expiryDays', parseInt(e.target.value))}
                min="0"
                max="365"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={policy.requireUppercase}
                  onChange={(e) => handlePolicyChange('requireUppercase', e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                  data-testid="uppercase-checkbox"
                />
                <span>{t('passwordPolicy.requireUppercase')}</span>
              </label>

              <label className="flex items-center space-x-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={policy.requireLowercase}
                  onChange={(e) => handlePolicyChange('requireLowercase', e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                  data-testid="lowercase-checkbox"
                />
                <span>{t('passwordPolicy.requireLowercase')}</span>
              </label>

              <label className="flex items-center space-x-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={policy.requireNumbers}
                  onChange={(e) => handlePolicyChange('requireNumbers', e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                  data-testid="numbers-checkbox"
                />
                <span>{t('passwordPolicy.requireNumbers')}</span>
              </label>

              <label className="flex items-center space-x-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={policy.requireSpecial}
                  onChange={(e) => handlePolicyChange('requireSpecial', e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                  data-testid="special-checkbox"
                />
                <span>{t('passwordPolicy.requireSpecial')}</span>
              </label>
            </div>
          </div>
        </div>

        {/* Password Tester */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {t('passwordPolicy.testerTitle')}
          </h3>
          
          <div className="space-y-4">
            <div>
              <label 
                htmlFor="testPassword" 
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {t('passwordPolicy.testPassword')}
              </label>
              <div className="relative">
                <Input
                  id="testPassword"
                  type="text"
                  value={samplePassword}
                  onChange={handlePasswordChange}
                  placeholder={t('passwordPolicy.testPlaceholder')}
                  data-testid="password-input"
                />
                <Lock className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
              </div>
            </div>

            <div className="space-y-2" data-testid="requirements-list">
              {requirements.map((req) => (
                <div
                  key={req.id}
                  className={`flex items-center space-x-2 text-sm ${
                    req.met ? 'text-green-600' : 'text-red-600'
                  }`}
                  data-testid={`requirement-${req.id}`}
                >
                  {req.met ? (
                    <Check className="h-4 w-4" data-testid="check-icon" />
                  ) : (
                    <X className="h-4 w-4" data-testid="x-icon" />
                  )}
                  <span>{req.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Button variant="outline" data-testid="cancel-button">
          {t('common.cancel')}
        </Button>
        <Button data-testid="save-button">
          {t('common.save')}
        </Button>
      </div>
    </div>
  );
}