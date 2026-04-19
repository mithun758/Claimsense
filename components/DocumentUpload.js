'use client';

import { useState } from 'react';

function FileUploadBox({ label, description, accept, file, onFile, icon }) {
  const handleChange = (e) => {
    const f = e.target.files?.[0];
    if (f) onFile(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) onFile(f);
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className={`relative border-2 border-dashed rounded-2xl p-5 transition-all ${
        file
          ? 'border-teal-400 bg-teal-50'
          : 'border-gray-200 bg-white hover:border-teal-300 hover:bg-gray-50'
      }`}
    >
      <input
        type="file"
        accept={accept}
        onChange={handleChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      <div className="flex items-start gap-4">
        <div className={`text-2xl ${file ? 'opacity-100' : 'opacity-40'}`}>
          {file ? '✓' : icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-gray-900 text-sm">{label}</div>
          <div className="text-xs text-gray-500 mt-0.5">{description}</div>
          {file ? (
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs bg-teal-100 text-teal-700 font-semibold px-2 py-0.5 rounded-full">
                {file.name.length > 30 ? file.name.substring(0, 30) + '...' : file.name}
              </span>
              <span className="text-xs text-gray-400">
                {(file.size / 1024).toFixed(0)} KB
              </span>
            </div>
          ) : (
            <div className="mt-2 text-xs text-teal-600 font-medium">
              Tap to select or drag and drop
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function DocumentUpload({ onSubmit, onBack }) {
  const [policyFile, setPolicyFile] = useState(null);
  const [claimFile, setClaimFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = policyFile && claimFile;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 800));
    onSubmit({ policyFile, claimFile });
  };

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
          <h1 className="text-lg font-bold text-gray-900">Upload your documents</h1>
          <p className="text-xs text-gray-500">We need two documents to analyse your claim</p>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <FileUploadBox
          label="Your health insurance policy"
          description="The policy document from your insurer — PDF preferred"
          accept=".pdf,.jpg,.jpeg,.png"
          file={policyFile}
          onFile={setPolicyFile}
          icon="📄"
        />

        <FileUploadBox
          label="Rejection letter or hospital bill"
          description="The rejection letter, EOB, or hospital bill you want to dispute"
          accept=".pdf,.jpg,.jpeg,.png"
          file={claimFile}
          onFile={setClaimFile}
          icon="🏥"
        />
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
        <div className="text-xs font-semibold text-blue-700 mb-1">Your documents are private</div>
        <div className="text-xs text-blue-600">
          Documents are processed in memory only. Nothing is stored or shared. 
          Analysis runs on our secure servers and is deleted immediately after.
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={!canSubmit || submitting}
        className={`w-full py-4 rounded-2xl font-semibold text-sm transition-all ${
          canSubmit && !submitting
            ? 'bg-teal-600 hover:bg-teal-700 text-white shadow-sm'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
        }`}
      >
        {submitting
          ? 'Preparing analysis...'
          : canSubmit
          ? 'Analyse my claim →'
          : 'Upload both documents to continue'
        }
      </button>

      <div className="mt-4 text-center text-xs text-gray-400">
        Demo mode — analysis uses sample data for now
      </div>
    </div>
  );
}
