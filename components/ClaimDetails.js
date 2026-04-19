'use client';

import { useState } from 'react';

export default function ClaimDetails({ onSubmit, onBack }) {
  const [claimAmount, setClaimAmount] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [insurer, setInsurer] = useState('');

  const insurers = [
    'Star Health',
    'HDFC ERGO',
    'Niva Bupa',
    'ICICI Lombard',
    'Bajaj Allianz',
    'Care Health',
    'New India Assurance',
    'United India',
    'Other',
  ];

  const rejectionReasons = [
    'Waiting period not completed',
    'Pre-existing disease exclusion',
    'Document incomplete',
    'Treatment not covered',
    'Room rent limit exceeded',
    'Policy lapsed',
    'Fraud / misrepresentation alleged',
    'Other / not stated clearly',
  ];

  const canSubmit = claimAmount && rejectionReason && insurer;

  return (
    <div className="min-h-screen px-5 py-6 max-w-md mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={onBack}
          className="text-gray-400 hover:text-gray-700 transition-colors"
        >
          ←
        </button>
        <div>
          <h1 className="text-lg font-bold text-gray-900">Tell us about your claim</h1>
          <p className="text-xs text-gray-500">Takes 30 seconds — helps us focus the analysis</p>
        </div>
      </div>

      <div className="space-y-5 mb-8">
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Your insurer
          </label>
          <div className="grid grid-cols-2 gap-2">
            {insurers.map(i => (
              <button
                key={i}
                onClick={() => setInsurer(i)}
                className={`text-left px-3 py-2.5 rounded-xl border text-sm transition-all ${
                  insurer === i
                    ? 'border-teal-500 bg-teal-50 text-teal-700 font-semibold'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                {i}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Claim amount (₹)
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">₹</span>
            <input
              type="number"
              value={claimAmount}
              onChange={e => setClaimAmount(e.target.value)}
              placeholder="e.g. 230000"
              className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
            />
          </div>
          {claimAmount && (
            <div className="mt-1 text-xs text-gray-500">
              ₹{Number(claimAmount).toLocaleString('en-IN')}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Reason given for rejection
          </label>
          <div className="space-y-2">
            {rejectionReasons.map(r => (
              <button
                key={r}
                onClick={() => setRejectionReason(r)}
                className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all ${
                  rejectionReason === r
                    ? 'border-teal-500 bg-teal-50 text-teal-700 font-semibold'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={() => canSubmit && onSubmit({ claimAmount, rejectionReason, insurer })}
        disabled={!canSubmit}
        className={`w-full py-4 rounded-2xl font-semibold text-sm transition-all ${
          canSubmit
            ? 'bg-teal-600 hover:bg-teal-700 text-white shadow-sm'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
        }`}
      >
        {canSubmit ? 'Run analysis →' : 'Complete all fields to continue'}
      </button>
    </div>
  );
}
