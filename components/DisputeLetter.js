'use client';

import { useState } from 'react';

export default function DisputeLetter({ letter }) {
  const [copied, setCopied] = useState(false);

  if (!letter) return null;

  const handleCopy = async () => {
    const full = `Subject: ${letter.subject}\n\n${letter.body}`;
    await navigator.clipboard.writeText(full);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="text-xs text-gray-500 uppercase tracking-wide">Your dispute letter</div>
        <button
          onClick={handleCopy}
          className="text-xs bg-teal-600 hover:bg-teal-700 text-white px-3 py-1.5 rounded-lg font-semibold transition-colors"
        >
          {copied ? 'Copied!' : 'Copy letter'}
        </button>
      </div>
      <div className="text-sm font-semibold text-gray-900 mb-3 pb-3 border-b border-gray-100">
        {letter.subject}
      </div>
      <div className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
        {letter.body}
      </div>
      <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
        <div className="text-xs text-gray-600">
          <span className="font-semibold">Next step: </span>{letter.escalationPath}
        </div>
        <div className="text-xs text-gray-500 italic">
          {letter.ombudsmanNote}
        </div>
      </div>
    </div>
  );
}
