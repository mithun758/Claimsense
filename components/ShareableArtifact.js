'use client';

import { useState } from 'react';

export default function ShareableArtifact({ grade, audit, policy, journey }) {
  const [copied, setCopied] = useState(false);

  const getText = () => {
    if (journey === 'dispute' && audit?.totalOvercharge) {
      return `ClaimSense found ₹${audit.totalOvercharge.toLocaleString('en-IN')} in overcharges on my ${policy?.insurer} hospital bill. The NPPA ceiling was breached on 3 items. Try it: claimsense.vercel.app`;
    }
    if (journey === 'billAudit' && audit?.totalOvercharge) {
      return `ClaimSense audited my ${policy?.insurer} hospital bill and found ₹${audit.totalOvercharge.toLocaleString('en-IN')} in overcharges. Try it: claimsense.vercel.app`;
    }
    if (journey === 'preAdmission') {
      return `I used ClaimSense before my procedure. My ${policy?.insurer} policy has a ₹${policy?.roomRentCap}/day room rent cap that could cost me ₹${grade?.lossEstimate?.toLocaleString('en-IN')} extra if I pick the wrong room. Try it: claimsense.vercel.app`;
    }
    if (journey === 'report' && grade) {
      return `My ${policy?.insurer} policy scored ${grade.grade}. ${grade.gradeReason} Try ClaimSense: claimsense.vercel.app`;
    }
    return `ClaimSense analysed my ${policy?.insurer} health insurance policy. Try it: claimsense.vercel.app`;
  };

  const text = getText();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gradient-to-br from-teal-600 to-teal-800 rounded-2xl p-5 text-white">
      <div className="text-xs uppercase tracking-wide opacity-75 mb-2 font-semibold">
        Share your result
      </div>
      <div className="text-sm mb-5 opacity-90 italic leading-relaxed">
        "{text}"
      </div>
      <button
        onClick={handleCopy}
        className="w-full bg-white text-teal-700 font-semibold py-2.5 rounded-xl text-sm hover:bg-teal-50 transition-colors"
      >
        {copied ? 'Copied to clipboard' : 'Copy to share'}
      </button>
    </div>
  );
}
