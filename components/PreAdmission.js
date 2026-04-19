'use client';

export default function PreAdmission({ preAdmission, cashless }) {
  if (!preAdmission) return null;

  return (
    <div className="space-y-4">
      <div className={`rounded-2xl p-5 border ${preAdmission.hospitalStatus?.cashlessEligible ? 'bg-teal-50 border-teal-200' : 'bg-red-50 border-red-200'}`}>
        <div className="text-xs font-semibold uppercase tracking-wide mb-1 text-gray-600">
          Hospital status
        </div>
        <div className="font-bold text-gray-900">{preAdmission.hospitalStatus?.name}</div>
        <div className={`text-sm mt-1 ${preAdmission.hospitalStatus?.cashlessEligible ? 'text-teal-700' : 'text-red-700'}`}>
          {preAdmission.hospitalStatus?.cashlessEligible ? 'Cashless eligible' : 'Not cashless eligible'}
        </div>
        <div className="text-xs text-gray-600 mt-2">
          TPA: {preAdmission.hospitalStatus?.tpa} · Helpline: {preAdmission.hospitalStatus?.tpaHelpline}
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
        <div className="text-xs text-amber-700 font-semibold uppercase tracking-wide mb-1">
          Room rent trap warning
        </div>
        <div className="text-sm text-gray-900 font-medium mb-2">
          Your policy caps room rent at ₹{preAdmission.roomRentTrap?.policyCap?.toLocaleString('en-IN')}/day
        </div>
        <div className="text-sm text-gray-700 mb-2">{preAdmission.roomRentTrap?.warning}</div>
        <div className="text-xs text-gray-600 italic">{preAdmission.roomRentTrap?.recommendation}</div>
      </div>

      <div className="bg-white rounded-2xl p-5 border border-gray-200">
        <div className="text-xs text-gray-500 uppercase tracking-wide mb-3">Documents to carry</div>
        <ul className="space-y-2">
          {(preAdmission.documentsToCarry || []).map((doc, i) => (
            <li key={i} className="text-sm text-gray-700 flex gap-2">
              <span className="text-teal-600">✓</span>
              <span>{doc}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-navy-50 bg-blue-50 border border-blue-200 rounded-2xl p-5">
        <div className="text-xs text-blue-700 font-semibold uppercase tracking-wide mb-2">
          Your IRDAI rights
        </div>
        <div className="text-sm text-gray-900 mb-3">{preAdmission.irdaiRights}</div>
        <div className="text-xs text-gray-600 italic">{preAdmission.escalationIfDelayed}</div>
      </div>

      {cashless && (
        <div className="bg-white rounded-2xl p-5 border border-gray-200">
          <div className="text-xs text-gray-500 uppercase tracking-wide mb-3">Cashless process</div>
          <div className="space-y-3 text-sm">
            <div>
              <div className="text-gray-500 text-xs mb-1">What to tell the TPA desk</div>
              <div className="text-gray-900">{cashless.prepPack?.whatToTell}</div>
            </div>
            <div>
              <div className="text-gray-500 text-xs mb-1">If rejected at discharge</div>
              <div className="text-gray-900">{cashless.rightsAdvisory?.ifRejectedAtDischarge}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
