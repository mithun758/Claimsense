'use client';

import { useState } from 'react';
import RoutingQuestion from '../components/RoutingQuestion';
import DocumentUpload from '../components/DocumentUpload';
import ClaimDetails from '../components/ClaimDetails';
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
  const [claimDetails, setClaimDetails] = useState(null);
  const [error, setError] = useState(null);

  const reset = () => {
    setJourney(null);
    setScreen('routing');
    setResult(null);
    setSteps([]);
    setError(null);
    setClaimDetails(null);
  };

  const handleJourneySelect = (journeyId) => {
    setJourney(journeyId);
    if (journeyId === 'dispute') {
      setScreen('upload');
    } else {
      runAnalysis(journeyId, null);
    }
  };

  const handleUploadSubmit = ({ policyFile, claimFile }) => {
    setScreen('claimDetails');
  };

  const handleClaimDetailsSubmit = (details) => {
    setClaimDetails(details);
    runAnalysis('dispute', details);
  };

  const runAnalysis = async (journeyId, details) => {
    setScreen('loading');
    setLoading(true);
    setSteps([]);
    setResult(null);
    setError(null);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          journey: journeyId,
          claimDetails: details,
        }),
      });
      const data = await res.json();

      if (data.success) {
        setSteps(data.data.steps);
        setResult(data.data.result);
        setPolicy(data.data.policy);
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

  const Header = ({ subtitle }) => (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-lg font-bold text-gray-900">ClaimSense</h1>
        {subtitle && <div className="text-xs text-gray-500">{subtitle}</div>}
      </div>
      <button onClick={reset} className="text-xs text-gray-500 hover:text-gray-900 transition-colors">
        ← Start over
      </button>
    </div>
  );

  if (screen === 'routing') {
    return <RoutingQuestion onSelect={handleJourneySelect} />;
  }

  if (screen === 'upload') {
    return (
      <DocumentUpload
        onSubmit={handleUploadSubmit}
        onBack={reset}
      />
    );
  }

  if (screen === 'claimDetails') {
    return (
      <ClaimDetails
        onSubmit={handleClaimDetailsSubmit}
        onBack={() => setScreen('upload')}
      />
    );
  }

  if (screen === 'loading') {
    return (
      <div className="min-h-screen px-5 py-6 max-w-md mx-auto">
        <Header subtitle={JOURNEY_LABELS[journey]} />
        <StepLog steps={steps} isRunning={true} />
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-3 text-sm text-gray-600">
            <div className="w-4 h-4 border-2 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
            Analysing your claim — this takes 15-30 seconds
          </div>
        </div>
        {claimDetails && (
          <div className="mt-6 bg-gray-50 rounded-2xl p-4">
            <div className="text-xs text-gray-500 uppercase tracking-wide mb-2">Claim being analysed</div>
            <div className="text-sm text-gray-900 font-semibold">{claimDetails.insurer}</div>
            <div className="text-sm text-gray-600">₹{Number(claimDetails.claimAmount).toLocaleString('en-IN')} claim</div>
            <div className="text-xs text-gray-500 mt-1">{claimDetails.rejectionReason}</div>
          </div>
        )}
      </div>
    );
  }

  if (screen === 'error') {
    return (
      <div className="min-h-screen px-5 py-6 max-w-md mx-auto">
        <Header />
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
          <div className="text-sm font-semibold text-red-700 mb-2">Analysis failed</div>
          <div className="text-sm text-red-600 mb-4">{error}</div>
          <button onClick={reset} className="text-sm text-teal-600 font-semibold">
            ← Try again
          </button>
        </div>
      </div>
    );
  }

  if (screen === 'lossEstimate') {
    return (
      <div className="min-h-screen px-5 py-6 max-w-md mx-auto">
        <Header subtitle={JOURNEY_LABELS[journey]} />
        <StepLog steps={steps} isRunning={false} />
        <div className="mt-6">
          <LossEstimate
            grade={result?.grade}
            audit={result?.audit}
            coverageMap={result?.coverageMap}
            journey={journey}
            claimDetails={claimDetails}
            onContinue={() => setScreen('results')}
          />
        </div>
      </div>
    );
  }

  if (screen === 'results') {
    return (
      <div className="min-h-screen px-5 py-6 max-w-md mx-auto pb-12">
        <Header subtitle={JOURNEY_LABELS[journey]} />
        <div className="space-y-4">
          {claimDetails && (
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                Claim analysed
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-gray-900">{claimDetails.insurer}</div>
                  <div className="text-xs text-gray-500">{claimDetails.rejectionReason}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-gray-900">
                    ₹{Number(claimDetails.claimAmount).toLocaleString('en-IN')}
                  </div>
                  <div className="text-xs text-gray-500">claim amount</div>
                </div>
              </div>
            </div>
          )}

          <ReportCard grade={result?.grade} coverage={result?.coverage} />

          {(journey === 'dispute' || journey === 'billAudit') && result?.audit && (
            <BillAuditTable audit={result.audit} coverageMap={result.coverageMap} />
          )}

          {journey === 'preAdmission' && result?.preAdmission && (
            <PreAdmission preAdmission={result.preAdmission} cashless={result.cashless} />
          )}

          {journey === 'dispute' && result?.letter && (
            <DisputeLetter letter={result.letter} />
          )}

          <ShareableArtifact
            grade={result?.grade}
            audit={result?.audit}
            policy={policy}
            journey={journey}
            claimDetails={claimDetails}
          />
        </div>
      </div>
    );
  }

  return null;
}
