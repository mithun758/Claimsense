'use client';

import { useState } from 'react';

export default function ShareableArtifact({ grade, audit, policy }) {
  const [copied, setCopied] = useState(false);

  let text = '';
  if (audit?.totalOvercharge) {
    text = `ClaimSense found ₹${audit.totalOvercharge.toLocaleString('en-IN')} in overcharges on my ${policy?.insurer} hospital bill. Try it: claimsense.vercel.app`;
  } else if (grade) {
    text = `My ${policy?.insurer} policy scored ${grade.grade}. ${grade.gradeReason} Try ClaimSense: claimsense.vercel.app`;
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-5 text-white">
      <div className="text-xs uppercase tracking-wide opacity-75 mb-2">Share your result</div>
      <div className="text-sm mb-4 italic">"{text}"</div>
      <button
        onClick={handleCopy}
        className="w-full bg-white text-teal-700 font-semibold py-2 rounded-lg text-sm hover:bg-teal-50 transition-colors"
      >
        {copied ? 'Copied to clipboard' : 'Copy to share'}
      </button>
    </div>
  );
}
