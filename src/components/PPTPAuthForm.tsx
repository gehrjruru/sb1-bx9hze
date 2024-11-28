import React, { useState } from 'react';
import { Input } from './ui/Input';
import { Button } from './ui/Button';

interface PPTPAuthFormProps {
  onSubmit: (data: { serverAddress: string; username: string; password: string; tunnelName?: string }) => void;
  loading: boolean;
}

export function PPTPAuthForm({ onSubmit, loading }: PPTPAuthFormProps) {
  const [formData, setFormData] = useState({
    serverAddress: '',
    username: '',
    password: '',
    tunnelName: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="PPTP Server Address"
        id="serverAddress"
        name="serverAddress"
        type="text"
        placeholder="vpn.example.com"
        value={formData.serverAddress}
        onChange={handleChange}
        required
      />

      <Input
        label="Username"
        id="username"
        name="username"
        type="text"
        placeholder="vpnuser"
        value={formData.username}
        onChange={handleChange}
        required
      />

      <Input
        label="Password"
        id="password"
        name="password"
        type="password"
        placeholder="Enter password"
        value={formData.password}
        onChange={handleChange}
        required
      />

      <Input
        label="Tunnel Name (Optional)"
        id="tunnelName"
        name="tunnelName"
        type="text"
        placeholder="pptp-out1"
        value={formData.tunnelName}
        onChange={handleChange}
      />

      <Button
        type="submit"
        loading={loading}
        loadingText="Connecting..."
      >
        Connect to PPTP Server
      </Button>
    </form>
  );
}