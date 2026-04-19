import { callGemini } from '../gemini.js';

export async function coverageBuilder(policy, procedures) {
  const kneeReplace = procedures.find(p => p.code === 'KNEE_REPLACE');
  const appendectomy = procedures.find(p => p.code === 'APPENDECTOMY');
  const angioplasty = procedures.find(p => p.code === 'ANGIOPLASTY');

  const prompt = `You are an Indian health insurance expert. Calculate coverage for these procedures and return JSON only. No markdown.

Policy: Sum insured ₹${policy.sumInsured}, Room rent cap ₹${policy.roomRentCap}/day, Joint replacement sub-limit ₹${policy.specificDiseaseLimits?.jointReplacement || 100000}, City: ${policy.city}

Procedure 1: Total Knee Replacement, estimated cost ₹${Math.round(kneeReplace.cghsRate * kneeReplace.privateMultiplier)}
Procedure 2: Appendectomy, estimated cost ₹${Math.round(appendectomy.cghsRate * appendectomy.privateMultiplier)}
Procedure 3: Coronary Angioplasty, estimated cost ₹${Math.round(angioplasty.cghsRate * angioplasty.privateMultiplier)}

For each procedure calculate what the policy covers and what the patient pays out of pocket. Account for room rent pro-rata impact and sub-limits.

Return this exact JSON:
{
  "scenarios": [
    {
      "procedure": "Total Knee Replacement",
      "totalCost": 304000,
      "policyCover": 100000,
      "patientPays": 204000,
      "keyRisk": "joint replacement sub-limit applies"
    },
    {
      "procedure": "Appendectomy",
      "totalCost": 78400,
      "policyCover": 61000,
      "patientPays": 17400,
      "keyRisk": "room rent pro-rata reduces all payouts"
    },
    {
      "procedure": "Coronary Angioplasty",
      "totalCost": 437500,
      "policyCover": 500000,
      "patientPays": 0,
      "keyRisk": "fully covered if room rent limit respected"
    }
  ]
}`;

  return await callGemini(prompt);
}
