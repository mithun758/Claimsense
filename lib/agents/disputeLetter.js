import { callGemini } from '../gemini.js';

export async function disputeLetter(policy, auditResult, coverageMap) {
  const topFlag = auditResult.flaggedItems[0];

  const prompt = `You are an expert in Indian health insurance disputes. Write a formal dispute letter and return JSON only. No markdown.

Context:
- Insurer: ${policy.insurer}
- Policy number: ${policy.policyNumber}
- TPA: ${policy.tpa}
- Total overcharge found: ₹${auditResult.totalOvercharge}
- Main issue: ${topFlag?.note || 'claim underpaid'}
- Patient owes after mapping: ₹${coverageMap.totalPatientPays}

Write a 3-paragraph dispute letter that:
1. States the policy number and claim details
2. References the specific NPPA/CGHS/IRDAI violation found
3. Demands review and correct settlement within 15 days

Make it firm but professional. Vary the sentence structure — do not use a template.

Return this exact JSON:
{
  "subject": "Dispute regarding claim settlement — Policy ${policy.policyNumber}",
  "body": "full letter text here as a single string with \\n for line breaks",
  "escalationPath": "If no response in 15 days, escalate to IRDAI Grievance Cell at igms.irda.gov.in",
  "ombudsmanNote": "Further escalation available via Insurance Ombudsman — 65-70% resolution rate in policyholder favour"
}`;

  return await callGemini(prompt);
}
