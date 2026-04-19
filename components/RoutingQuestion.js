'use client';

export default function RoutingQuestion({ onSelect }) {
  const options = [
    { id: 'dispute', label: 'My claim was rejected or underpaid', urgency: 'high' },
    { id: 'billAudit', label: 'I have a hospital bill I do not understand', urgency: 'high' },
    { id: 'preAdmission', label: 'I have a procedure coming up', urgency: 'medium' },
    { id: 'report', label: 'I just want to understand my policy', urgency: 'low' },
  ];

  return (
    <div className="min-h-screen flex flex-col px-5 py-8 max-w-md mx-auto">
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">ClaimSense</h1>
        <p className="text-sm text-gray-500">India's health insurance copilot</p>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          What is happening with your health insurance right now?
        </h2>
        <p className="text-sm text-gray-600">
          Your answer helps us show you exactly what you need.
        </p>
      </div>

      <div className="space-y-3">
        {options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => onSelect(opt.id)}
            className="w-full text-left p-4 rounded-xl border border-gray-200 bg-white hover:border-teal-500 hover:shadow-sm transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-gray-900 font-medium text-sm">{opt.label}</span>
              <span className="text-teal-600 text-lg">→</span>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-auto pt-8 text-xs text-gray-400 text-center">
        Demo mode — using sample Star Health policy
      </div>
    </div>
  );
}
