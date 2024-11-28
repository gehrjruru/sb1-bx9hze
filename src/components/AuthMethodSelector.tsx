import React from 'react';
import type { AuthMethod } from '../types/mikrotik';
import { Wifi, Globe } from 'lucide-react';

interface AuthMethodSelectorProps {
  selectedMethod: AuthMethod;
  onMethodChange: (method: AuthMethod) => void;
}

export function AuthMethodSelector({ selectedMethod, onMethodChange }: AuthMethodSelectorProps) {
  return (
    <div className="flex gap-4">
      <button
        onClick={() => onMethodChange('local')}
        className={`flex-1 p-4 rounded-lg border-2 transition-all ${
          selectedMethod === 'local'
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-200 hover:border-blue-200'
        }`}
      >
        <div className="flex flex-col items-center gap-2">
          <Wifi className={`w-6 h-6 ${selectedMethod === 'local' ? 'text-blue-500' : 'text-gray-500'}`} />
          <span className={`text-sm font-medium ${selectedMethod === 'local' ? 'text-blue-700' : 'text-gray-700'}`}>
            Local Network
          </span>
        </div>
      </button>

      <button
        onClick={() => onMethodChange('pptp')}
        className={`flex-1 p-4 rounded-lg border-2 transition-all ${
          selectedMethod === 'pptp'
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-200 hover:border-blue-200'
        }`}
      >
        <div className="flex flex-col items-center gap-2">
          <Globe className={`w-6 h-6 ${selectedMethod === 'pptp' ? 'text-blue-500' : 'text-gray-500'}`} />
          <span className={`text-sm font-medium ${selectedMethod === 'pptp' ? 'text-blue-700' : 'text-gray-700'}`}>
            PPTP Server
          </span>
        </div>
      </button>
    </div>
  );
}