'use client';

import { useState } from 'react';
import RoutingQuestion from '../components/RoutingQuestion';
import StepLog from '../components/StepLog';
import LossEstimate from '../components/LossEstimate';
import ReportCard from '../components/ReportCard';
import BillAuditTable from '../components/BillAuditTable';
import PreAdmission from '../components/PreAdmission';
import DisputeLetter from '../components/DisputeLetter';
import ShareableArtifact from '../components/ShareableArtifact';

const JOURNEY_LABELS = {
  dispute: 'Claim Dispute',
  billAudit: 'Bill Audit',
  preAdmission: 'Pre-Admission',
  report: 'Policy Report Card',
};

export default function Home() {
  const [journey, setJourney] = useState(null);
  const [screen, setScreen] = useState('routing');
  const [loading, setLoading] = useState(false);
  const [steps, setSteps] = useState([]);
  const [result, setResult] = useState(null);
  const [policy, setPolicy] = useState(null);
  const [bill, setBill] = useState(null);
  const [error, setError] = useState(null);

  const handleSelect = async (journeyId) => {
    setJourney(journeyId);
    setScreen('loading');
    setLoading(true);
    setSteps([]);
    setResult(null);
    setError(null);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ journey: journeyId }),
      });
      const data = await res.json();

      if (data.success) {
        setSteps(data.data.steps);
        setResult(data.data.result);
        setPolicy(data.data.policy);
        setBill(data.data.bill);
        setScreen('lossEstimate');
      } else {
        setError(data.error || 'Analysis failed');
        setScreen('error');
      }
    } catch (e) {
      setError(e.message);
      setScreen('error');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setJourney(null);
    setScreen('routing');
    setResult(null);
    setSteps([]);
    setError(null);
  };

  // SCREEN: Routing Question
  if (screen === 'routing') {
    return <RoutingQuestion onSelect={handleSelect} />;
  }

  // SCREEN: Loading
  if (screen === 'loading') {
    return (
      <div className="min-h-screen px-5 py-6 max-w-md mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-lg font-bold text-gray-900">ClaimSense</h1>
          <button onClick={reset} className="text-xs text-gray-500 hover:text-gray-900">← Start over</button>
        </div>
        <StepLog steps={steps} isRunning={true} />
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-3 text-sm text-gray-600">
            <div className="w-4 h-4 border-2 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
            Analysing your policy — this takes 15-30 seconds
          </div>
        </div>
      </div>
    );
  }

  // SCREEN: Error
  if (screen === 'error') {
    return (
      <div className="min-h-screen px-5 py-6 max-w-md mx-auto">
        <h1 className="text-lg font-bold text-gray-900 mb-6">ClaimSense</h1>
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
          <div className="text-sm font-semibold text-red-700 mb-2">Analysis failed</div>
          <div className="text-sm text-red-600 mb-4">{error}</div>
          <button onClick={reset} className="text-sm text-teal-600 font-semibold">← Try again</button>
        </div>
      </div>
    );
  }

  // SCREEN: Loss Estimate (before paywall)
  if (screen === 'lossEstimate') {
    return (
      <div className="min-h-screen px-5 py-6 max-w-md mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-lg font-bold text-gray-900">ClaimSense</h1>
            <div className="text-xs text-gray-500">{JOURNEY_LABELS[journey]}</div>
          </div>
          <button onClick={reset} className="text-xs text-gray-500 hover:text-gray-900">← Start over</button>
        </div>

        <StepLog steps={steps} isRunning={false} />

        <div className="mt-6">
          <LossEstimate
            grade={result?.grade}
            audit={result?.audit}
            coverageMap={result?.coverageMap}
            journey={journey}
            onContinue={() => setScreen('results')}
          />
        </div>
      </div>
    );
  }

  // SCREEN: Full Results
  if (screen === 'results') {
    return (
      <div className="min-h-screen px-5 py-6 max-w-md mx-auto pb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-lg font-bold text-gray-900">ClaimSense</h1>
            <div className="text-xs text-gray-500">{JOURNEY_LABELS[journey]}</div>
          </div>
          <button onClick={reset} className="text-xs text-gray-500 hover:text-gray-900">← Start over</button>
        </div>

        <div className="space-y-4">
          {/* Report Card — all journeys */}
          <ReportCard grade={result?.grade} coverage={result?.coverage} />

          {/* Bill Audit — dispute and billAudit journeys */}
          {(journey === 'dispute' || journey === 'billAudit') && result?.audit && (
            <BillAuditTable audit={result.audit} coverageMap={result.coverageMap} />
          )}

          {/* Pre-Admission — preAdmission journey */}
          {journey === 'preAdmission' && result?.preAdmission && (
            <PreAdmission preAdmission={result.preAdmission} cashless={result.cashless} />
          )}

          {/* Dispute Letter — dispute journey only */}
          {journey === 'dispute' && result?.letter && (
            <DisputeLetter letter={result.letter} />
          )}

          {/* Shareable artifact — all journeys */}
          <ShareableArtifact
            grade={result?.grade}
            audit={result?.audit}
            policy={policy}
            journey={journey}
          />
        </div>
      </div>
    );
  }

  return null;
}
