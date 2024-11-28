import React from 'react';
import { AuthForm } from './components/AuthForm';
import { LogViewer } from './components/LogViewer';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <AuthForm />
      <LogViewer />
    </div>
  );
}

export default App;