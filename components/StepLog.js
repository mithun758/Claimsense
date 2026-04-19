'use client';

export default function StepLog({ steps, isRunning }) {
  return (
    <div className="bg-gray-900 rounded-xl p-4 text-xs font-mono">
      <div className="flex items-center justify-between mb-3">
        <span className="text-gray-400">AI agents working</span>
        {isRunning && (
          <span className="flex items-center gap-2 text-teal-400">
            <span className="w-2 h-2 bg-teal-400 rounded-full animate-pulse"></span>
            Live
          </span>
        )}
      </div>
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {steps.map((s, i) => (
          <div key={i} className="flex gap-2">
            <span className={s.status === 'done' ? 'text-teal-400' : s.status === 'failed' ? 'text-red-400' : 'text-amber-400'}>
              {s.status === 'done' ? '✓' : s.status === 'failed' ? '✗' : '·'}
            </span>
            <div className="flex-1">
              <div className="text-gray-200">{s.agent}</div>
              <div className="text-gray-500 text-[11px]">{s.summary}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
