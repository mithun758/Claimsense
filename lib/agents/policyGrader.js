import { callGemini } from '../gemini.js';

export async function policyGrader(policy) {
  const prompt = `You are an Indian health insurance expert. Grade this policy and return JSON only. No markdown.

Policy: ${policy.insurer} ${policy.plan}
Sum insured: ₹${policy.sumInsured}
Room rent cap: ₹${policy.roomRentCap}/day
Co-pay: ${policy.coPay}%
Pre-existing waiting: ${policy.preExistingWaitingPeriod} months
City: ${policy.city}
Joint replacement sub-limit: ₹${policy.specificDiseaseLimits?.jointReplacement || 'none'}

Return this exact JSON:
{
  "grade": "B-",
  "gradeReason": "one sentence why",
  "topGaps": ["gap 1", "gap 2", "gap 3"],
  "roomRentRisk": "high/medium/low",
  "lossEstimate": 32400,
  "lossReason": "one sentence explaining the ₹ risk"
}`;

  return await callGemini(prompt);
}
