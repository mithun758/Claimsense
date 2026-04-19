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

export default function Home() {
  const [journey, setJourney] = useState(null);
  const [loading, setLoading] = useState(false);
  const [steps, setSteps] = useState([]);
  const [result, setResult] = useState(null);
  const [policy, setPolicy] = useState(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const [paid, setPaid] = useState(false);

  const handleSelect = async (journeyId) => {
    setJourney(journeyId);
    setLoading(true);
    setSteps([]);
    setResult(null);
    setPaid(false);
    setShowPaywall(false);

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
        setShowPaywall(true);
      } else {
        alert('Error: ' + data.error);
      }
    } catch (e) {
      alert('Failed to analyse: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setJourney(null);
    setResult(null);
    setSteps([]);
    setShowPaywall(false);
    setPaid(false);
  };

  if (!journey) {
    return <RoutingQuestion onSelect={handleSelect} />;
  }

  return (
    <div className="min-h-screen px-5 py-6 max-w-md mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg font-bold text-gray-900">ClaimSense</h1>
        <button
          onClick={reset}
          className="text-xs text-gray-500 hover:text-gray-900"
        >
          ← Start over
        </button>
      </div>

      <StepLog steps={steps} isRunning={loading} />

      {loading && (
        <div className="mt-6 text-center text-sm text-gray-500">
          Running analysis — this takes 10-30 seconds
        </div>
      )}

      {showPaywall && !paid && result && (
        <div className="mt-6">
          <LossEstimate
            grade={result.grade}
            audit={result.audit}
            coverageMap={result.coverageMap}
            onContinue={() => setPaid(true)}
          />
        </div>
      )}

      {paid && result && (
        <div className="mt-6 space-y-4">
          <ReportCard grade={result.grade} coverage={result.coverage} />
          {result.audit && <BillAuditTable audit={result.audit} coverageMap={result.coverageMap} />}
          {result.preAdmission && <PreAdmission preAdmission={result.preAdmission} cashless={result.cashless} />}
          {result.letter && <DisputeLetter letter={result.letter} />}
          <ShareableArtifact grade={result.grade} audit={result.audit} policy={policy} />
        </div>
      )}
    </div>
  );
}
