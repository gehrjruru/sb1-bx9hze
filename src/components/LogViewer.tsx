import React from 'react';
import { logger } from '../utils/logger';
import type { LogEntry } from '../types/logger';

export function LogViewer() {
  const [logs, setLogs] = React.useState<LogEntry[]>([]);
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setLogs(logger.getLogs());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getLevelColor = (level: LogEntry['level']) => {
    switch (level) {
      case 'error': return 'text-red-600';
      case 'warn': return 'text-yellow-600';
      case 'info': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  if (logs.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gray-800 text-white px-4 py-2 rounded-md shadow-lg hover:bg-gray-700"
      >
        {isOpen ? 'Hide Logs' : 'Show Logs'}
      </button>

      {isOpen && (
        <div className="absolute bottom-12 right-0 w-96 max-h-96 overflow-auto bg-white rounded-lg shadow-xl border border-gray-200">
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Connection Logs</h3>
              <button
                onClick={() => logger.clearLogs()}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Clear
              </button>
            </div>
            <div className="space-y-2">
              {logs.map((log, index) => (
                <div key={index} className="text-sm">
                  <span className="text-gray-500">
                    {log.timestamp.toLocaleTimeString()}
                  </span>
                  {' '}
                  <span className={getLevelColor(log.level)}>
                    [{log.level.toUpperCase()}]
                  </span>
                  {' '}
                  <span>{log.message}</span>
                  {log.data && (
                    <pre className="mt-1 text-xs bg-gray-50 p-2 rounded">
                      {JSON.stringify(log.data, null, 2)}
                    </pre>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}