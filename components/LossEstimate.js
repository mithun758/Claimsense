'use client';

export default function LossEstimate({ grade, audit, coverageMap, journey, onContinue }) {
  const getLossData = () => {
    if (journey === 'dispute' && audit?.totalOvercharge) {
      return {
        amount: audit.totalOvercharge,
        label: 'in potential overcharges found on your bill',
        cta: 'See your dispute letter',
        color: 'amber',
      };
    }
    if (journey === 'billAudit' && audit?.totalOvercharge) {
      return {
        amount: audit.totalOvercharge,
        label: 'in overcharges found on your hospital bill',
        cta: 'See full bill audit',
        color: 'amber',
      };
    }
    if (journey === 'preAdmission' && grade?.lossEstimate) {
      return {
        amount: grade.lossEstimate,
        label: 'you may overpay if you go in unprepared',
        cta: 'See your pre-admission pack',
        color: 'blue',
      };
    }
    if (journey === 'report' && grade?.lossEstimate) {
      return {
        amount: grade.lossEstimate,
        label: 'at risk based on your policy gaps',
        cta: 'See your full policy report',
        color: 'teal',
      };
    }
    return {
      amount: grade?.lossEstimate || 0,
      label: 'potential financial exposure identified',
      cta: 'See full analysis',
      color: 'teal',
    };
  };

  const { amount, label, cta, color } = getLossData();

  const colorMap = {
    amber: { bg: 'bg-amber-50', border: 'border-amber-200', badge: 'text-amber-700', btn: 'bg-teal-600 hover:bg-teal-700' },
    blue: { bg: 'bg-blue-50', border: 'border-blue-200', badge: 'text-blue-700', btn: 'bg-teal-600 hover:bg-teal-700' },
    teal: { bg: 'bg-teal-50', border: 'border-teal-200', badge: 'text-teal-700', btn: 'bg-teal-600 hover:bg-teal-700' },
  };

  const c = colorMap[color] || colorMap.teal;

  return (
    <div className={`rounded-2xl p-6 border ${c.bg} ${c.border}`}>
      <div className={`text-xs font-semibold uppercase tracking-wide mb-3 ${c.badge}`}>
        Analysis complete
      </div>
      <div className="text-4xl font-bold text-gray-900 mb-2">
        ₹{Number(amount).toLocaleString('en-IN')}
      </div>
      <div className="text-sm text-gray-600 mb-6">
        {label}
      </div>
      <button
        onClick={onContinue}
        className={`w-full ${c.btn} text-white font-semibold py-3 rounded-xl transition-colors text-sm`}
      >
        {cta} →
      </button>
      <div className="mt-3 text-center text-xs text-gray-400">
        Demo mode — Star Health policy, Manipal Hospital Whitefield
      </div>
    </div>
  );
}
