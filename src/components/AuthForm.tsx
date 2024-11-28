import React, { useState } from 'react';
import { authenticateLocal, setupPPTPConnection } from '../utils/api';
import { AuthMethodSelector } from './AuthMethodSelector';
import { LocalAuthForm } from './LocalAuthForm';
import { PPTPAuthForm } from './PPTPAuthForm';
import type { AuthMethod } from '../types/mikrotik';

export function AuthForm() {
  const [authMethod, setAuthMethod] = useState<AuthMethod>('local');
  const [error, setError] = useState<string | null>(null);
  const [routerInfo, setRouterInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleLocalAuth = async (data: { ipAddress: string; username: string; password: string }) => {
    setLoading(true);
    setError(null);
    setRouterInfo(null);

    try {
      const result = await authenticateLocal(data);
      if (result.success && result.data) {
        setRouterInfo(result.data);
      } else {
        setError(result.error || 'Failed to connect to router');
      }
    } catch (err) {
      setError('Failed to authenticate. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePPTPAuth = async (data: { serverAddress: string; username: string; password: string; tunnelName?: string }) => {
    setLoading(true);
    setError(null);
    setRouterInfo(null);

    try {
      const result = await setupPPTPConnection(data);
      if (result.success) {
        setRouterInfo({
          pptp: result.data,
          message: 'PPTP connection configured successfully'
        });
      } else {
        setError(result.error || 'Failed to configure PPTP connection');
      }
    } catch (err) {
      setError('Failed to set up PPTP connection. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        MikroTik Router Connection
      </h2>

      <AuthMethodSelector
        selectedMethod={authMethod}
        onMethodChange={setAuthMethod}
      />

      <div className="mt-6">
        {authMethod === 'local' ? (
          <LocalAuthForm
            onSubmit={handleLocalAuth}
            loading={loading}
          />
        ) : (
          <PPTPAuthForm
            onSubmit={handlePPTPAuth}
            loading={loading}
          />
        )}

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
            {error}
          </div>
        )}

        {routerInfo && (
          <div className="mt-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
            <h3 className="font-semibold mb-2">Connection Successful</h3>
            {authMethod === 'local' ? (
              <>
                <p className="text-sm mb-1">Router Name: {routerInfo.identity?.name}</p>
                <p className="text-sm mb-1">CPU Load: {routerInfo.resources?.cpu_load}%</p>
                <p className="text-sm mb-1">Memory: {routerInfo.resources?.free_memory} free of {routerInfo.resources?.total_memory}</p>
                <p className="text-sm">Version: {routerInfo.resources?.version}</p>
              </>
            ) : (
              <p className="text-sm">{routerInfo.message}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}