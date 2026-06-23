import { TerminalLog } from "../types";
import { useEffect, useRef } from "react";

interface TerminalLogsProps {
  logs: TerminalLog[];
}

export default function TerminalLogs({ logs }: TerminalLogsProps) {
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  return (
    <div className="flex-1 bg-black/80 rounded-2xl p-4 border border-emerald-500/10 flex flex-col font-mono text-xs h-64 overflow-hidden shadow-inner">
      <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-3 text-gray-500 uppercase tracking-widest text-[9px] select-none">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"></span>
          <span>لوحة العمليات والشبكات النيورونية</span>
        </span>
        <span>نشط • Live</span>
      </div>
      <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 text-left scrollbar-thin">
        {logs.map((log) => (
          <div key={log.id} className="leading-relaxed">
            <span className="text-gray-600 mr-1.5">[{log.timestamp}]</span>
            <span className="text-emerald-500 mr-1">&gt;</span>
            <span
              className={
                log.type === "success"
                  ? "text-emerald-400 font-bold"
                  : log.type === "error"
                  ? "text-red-400 font-bold"
                  : log.type === "warning"
                  ? "text-yellow-400"
                  : "text-gray-300"
              }
            >
              {log.text}
            </span>
          </div>
        ))}
        <div ref={terminalEndRef} />
      </div>
    </div>
  );
}
