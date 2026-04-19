import { callGemini } from '../gemini.js';

export async function cashlessFlow(policy) {
  const prompt = `You are an Indian health insurance expert. Create a cashless hospitalisation rights guide and return JSON only. No markdown.

Policy: ${policy.insurer}, TPA: ${policy.tpa}, helpline: ${policy.tpaHelpline}

Return this exact JSON:
{
  "prepPack": {
    "whatToTell": "one sentence on what to tell the hospital TPA desk",
    "whatHospitalDoes": "one sentence explaining the hospital submits pre-auth on your behalf",
    "yourRole": "one sentence on patient's role during cashless process"
  },
  "rightsAdvisory": {
    "preAuthDeadline": "1 hour",
    "legalBasis": "IRDAI Health Insurance Regulations 2024",
    "ifDelayed": "Call ${policy.tpaHelpline} immediately and cite IRDAI regulation",
    "ifRejectedAtDischarge": "Do not sign the final bill until you receive a written rejection reason with specific policy clause cited",
    "ombudsmanRight": "You can escalate to Insurance Ombudsman if grievance is not resolved in 15 days"
  }
}`;

  return await callGemini(prompt);
}
