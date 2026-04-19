'use client';

export default function BillAuditTable({ audit, coverageMap }) {
  if (!audit) return null;

  return (
    <div className="space-y-4">
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
        <div className="text-xs text-amber-700 font-semibold uppercase tracking-wide mb-1">
          Bill audit complete
        </div>
        <div className="text-2xl font-bold text-gray-900">
          ₹{audit.totalOvercharge?.toLocaleString('en-IN')} in overcharges found
        </div>
        <div className="text-sm text-gray-600 mt-1">{audit.summary}</div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="text-xs text-gray-500 uppercase tracking-wide">Flagged items</div>
        </div>
        <div className="divide-y divide-gray-100">
          {(audit.flaggedItems || []).map((item, i) => (
            <div key={i} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900 text-sm">{item.description}</div>
                  <div className="text-xs text-gray-500 mt-1">{item.note}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500">Overcharge</div>
                  <div className="font-bold text-red-600 text-sm">
                    ₹{item.overcharge?.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-wide font-semibold px-2 py-0.5 rounded bg-teal-50 text-teal-700">
                  {item.benchmarkSource}
                </span>
                <span className="text-xs text-gray-500">
                  Billed ₹{item.billed?.toLocaleString('en-IN')} · Benchmark ₹{item.benchmark?.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {coverageMap && (
        <div className="bg-white rounded-2xl p-5 border border-gray-200">
          <div className="text-xs text-gray-500 uppercase tracking-wide mb-3">Coverage summary</div>
          <div className="grid grid-cols-3 gap-3 text-sm">
            <div>
              <div className="text-xs text-gray-500">Total billed</div>
              <div className="font-bold text-gray-900">₹{coverageMap.totalBilled?.toLocaleString('en-IN')}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Policy covers</div>
              <div className="font-bold text-teal-700">₹{coverageMap.totalCovered?.toLocaleString('en-IN')}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">You pay</div>
              <div className="font-bold text-amber-700">₹{coverageMap.totalPatientPays?.toLocaleString('en-IN')}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
