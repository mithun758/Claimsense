'use client';

export default function ReportCard({ grade, coverage }) {
  const gradeColors = {
    'A': 'bg-green-100 text-green-800',
    'A+': 'bg-green-100 text-green-800',
    'A-': 'bg-green-100 text-green-800',
    'B+': 'bg-teal-100 text-teal-800',
    'B': 'bg-teal-100 text-teal-800',
    'B-': 'bg-amber-100 text-amber-800',
    'C+': 'bg-amber-100 text-amber-800',
    'C': 'bg-amber-100 text-amber-800',
    'C-': 'bg-orange-100 text-orange-800',
    'D': 'bg-red-100 text-red-800',
    'F': 'bg-red-100 text-red-800',
  };

  const gradeColor = gradeColors[grade?.grade] || 'bg-gray-100 text-gray-800';

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <div className="flex items-center gap-4 mb-4">
          <div className={`grade-pill ${gradeColor}`}>
            {grade?.grade || '—'}
          </div>
          <div className="flex-1">
            <div className="text-xs text-gray-500 uppercase tracking-wide">Policy grade</div>
            <div className="text-sm text-gray-700 mt-1">{grade?.gradeReason}</div>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-4">
          <div className="text-xs text-gray-500 uppercase tracking-wide mb-2">Top gaps</div>
          <ul className="space-y-2">
            {(grade?.topGaps || []).map((gap, i) => (
              <li key={i} className="text-sm text-gray-700 flex gap-2">
                <span className="text-amber-600">•</span>
                <span>{gap}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {coverage?.scenarios && (
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <div className="text-xs text-gray-500 uppercase tracking-wide mb-3">
            Procedure cost scenarios
          </div>
          <div className="space-y-3">
            {coverage.scenarios.map((s, i) => (
              <div key={i} className="border-b border-gray-100 pb-3 last:border-0">
                <div className="font-semibold text-gray-900 text-sm">{s.procedure}</div>
                <div className="grid grid-cols-3 gap-2 mt-2 text-xs">
                  <div>
                    <div className="text-gray-500">Total cost</div>
                    <div className="font-semibold text-gray-900">₹{s.totalCost?.toLocaleString('en-IN')}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Covered</div>
                    <div className="font-semibold text-teal-700">₹{s.policyCover?.toLocaleString('en-IN')}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">You pay</div>
                    <div className="font-semibold text-amber-700">₹{s.patientPays?.toLocaleString('en-IN')}</div>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-1">{s.keyRisk}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
