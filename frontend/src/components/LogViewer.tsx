import { useEffect, useState } from "react";

interface LogEntry {
  timestamp: string;
  level: "log" | "error" | "warn";
  message: string;
}

export function LogViewer() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Original console methods
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;

    // Override console methods
    console.log = (...args) => {
      originalLog(...args);
      addLog("log", args.map(arg => String(arg)).join(" "));
    };

    console.error = (...args) => {
      originalError(...args);
      addLog("error", args.map(arg => String(arg)).join(" "));
    };

    console.warn = (...args) => {
      originalWarn(...args);
      addLog("warn", args.map(arg => String(arg)).join(" "));
    };

    const addLog = (level: "log" | "error" | "warn", message: string) => {
      setLogs(prev => [
        ...prev,
        {
          timestamp: new Date().toLocaleTimeString(),
          level,
          message,
        },
      ].slice(-50)); // Keep last 50 logs
    };

    return () => {
      console.log = originalLog;
      console.error = originalError;
      console.warn = originalWarn;
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-vcf-orange text-white px-4 py-2 rounded-lg font-bold shadow-lg hover:bg-vcf-orange/90 transition-all"
      >
        {isOpen ? "Close Logs" : "View Logs"}
      </button>

      {/* Log viewer modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-96 flex flex-col">
            {/* Header */}
            <div className="bg-vcf-orange text-white px-6 py-4 flex justify-between items-center rounded-t-lg">
              <h2 className="font-bold text-lg">Debug Logs</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white font-bold text-xl hover:opacity-75"
              >
                ×
              </button>
            </div>

            {/* Logs content */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50 font-mono text-sm">
              {logs.length === 0 ? (
                <p className="text-gray-400">No logs yet...</p>
              ) : (
                logs.map((log, idx) => (
                  <div
                    key={idx}
                    className={`py-1 ${
                      log.level === "error"
                        ? "text-red-600"
                        : log.level === "warn"
                        ? "text-yellow-600"
                        : "text-gray-800"
                    }`}
                  >
                    <span className="text-gray-500">[{log.timestamp}]</span>{" "}
                    <span className="font-bold">[{log.level.toUpperCase()}]</span> {log.message}
                  </div>
                ))
              )}
            </div>

            {/* Clear button */}
            <div className="border-t p-4 bg-white rounded-b-lg flex justify-end">
              <button
                onClick={() => setLogs([])}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded font-bold hover:bg-gray-400 transition-all"
              >
                Clear Logs
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
