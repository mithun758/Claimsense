'use client';

export default function LossEstimate({ grade, audit, coverageMap, onContinue }) {
  const lossAmount = audit?.totalOvercharge || coverageMap?.totalPatientPays || grade?.lossEstimate || 0;
  const reason = audit?.summary || grade?.lossReason || '';

  return (
    <div className="slide-up bg-white rounded-2xl p-6 border border-amber-200 shadow-sm">
      <div className="text-xs text-amber-700 font-semibold uppercase tracking-wide mb-2">
        Our analysis found
      </div>
      <div className="text-4xl font-bold text-gray-900 mb-2">
        ₹{Number(lossAmount).toLocaleString('en-IN')}
      </div>
      <div className="text-sm text-gray-600 mb-4">
        {reason}
      </div>
      <button
        onClick={onContinue}
        className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-xl transition-colors"
      >
        See how to recover this
      </button>
      <div className="mt-3 text-[11px] text-center text-gray-400">
        Demo mode — no payment required
      </div>
    </div>
  );
}
