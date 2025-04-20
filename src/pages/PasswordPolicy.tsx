import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
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

  const checkPassword = (password: string) => {
    setSamplePassword(password);
    setRequirements([
      {
        id: 'length',
        label: 'Minimum 8 characters',
        met: password.length >= 8,
      },
      {
        id: 'uppercase',
        label: 'At least one uppercase letter',
        met: /[A-Z]/.test(password),
      },
      {
        id: 'lowercase',
        label: 'At least one lowercase letter',
        met: /[a-z]/.test(password),
      },
      {
        id: 'number',
        label: 'At least one number',
        met: /[0-9]/.test(password),
      },
      {
        id: 'special',
        label: 'At least one special character',
        met: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      },
    ]);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Password Policy Settings</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Policy Configuration */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Policy Configuration
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Minimum Password Length
              </label>
              <Input
                type="number"
                value={policy.minLength}
                onChange={(e) =>
                  setPolicy((prev) => ({
                    ...prev,
                    minLength: parseInt(e.target.value),
                  }))
                }
                min="8"
                max="32"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password Expiry (Days)
              </label>
              <Input
                type="number"
                value={policy.expiryDays}
                onChange={(e) =>
                  setPolicy((prev) => ({
                    ...prev,
                    expiryDays: parseInt(e.target.value),
                  }))
                }
                min="0"
                max="365"
              />
            </div>

            <div className="space-y-2">
              {Object.entries({
                requireUppercase: 'Require Uppercase Letters',
                requireLowercase: 'Require Lowercase Letters',
                requireNumbers: 'Require Numbers',
                requireSpecial: 'Require Special Characters',
              }).map(([key, label]) => (
                <label
                  key={key}
                  className="flex items-center space-x-2 text-sm text-gray-700"
                >
                  <input
                    type="checkbox"
                    checked={policy[key as keyof typeof policy] as boolean}
                    onChange={(e) =>
                      setPolicy((prev) => ({
                        ...prev,
                        [key]: e.target.checked,
                      }))
                    }
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Password Tester */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Password Requirement Tester
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Test Password
              </label>
              <div className="relative">
                <Input
                  type="text"
                  value={samplePassword}
                  onChange={(e) => checkPassword(e.target.value)}
                  placeholder="Enter a password to test"
                />
                <Lock className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
              </div>
            </div>

            <div className="space-y-2">
              {requirements.map((req) => (
                <div
                  key={req.id}
                  className={`flex items-center space-x-2 text-sm ${
                    req.met ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {req.met ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <X className="h-4 w-4" />
                  )}
                  <span>{req.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <Button variant="outline">Cancel</Button>
        <Button>Save Policy</Button>
      </div>
    </div>
  );
}