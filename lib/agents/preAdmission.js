import { callGemini } from '../gemini.js';
import hospitals from '../../data/network_hospitals.json' assert { type: 'json' };

export async function preAdmission(policy, hospitalName, procedure) {
  const hospital = hospitals.hospitals.find(h =>
    h.name.toLowerCase().includes(hospitalName.toLowerCase()) &&
    h.insurers.includes(policy.insurer)
  );

  const isNetworkHospital = !!hospital;
  const roomRentWarning = policy.roomRentCap;

  const prompt = `You are an Indian health insurance expert. Create a pre-admission checklist and return JSON only. No markdown.

Policy: ${policy.insurer}, sum insured ₹${policy.sumInsured}, room rent cap ₹${policy.roomRentCap}/day, TPA: ${policy.tpa}
Hospital: ${hospitalName}, Cashless eligible: ${isNetworkHospital ? 'YES' : 'NO'}
Procedure: ${procedure}

Return this exact JSON:
{
  "hospitalStatus": {
    "name": "${hospitalName}",
    "cashlessEligible": ${isNetworkHospital},
    "tpa": "${policy.tpa}",
    "tpaHelpline": "${policy.tpaHelpline}"
  },
  "roomRentTrap": {
    "policyCap": ${roomRentWarning},
    "warning": "one sentence warning about room selection",
    "recommendation": "one sentence on which room to book"
  },
  "documentsToCarry": ["doc 1", "doc 2", "doc 3", "doc 4", "doc 5"],
  "irdaiRights": "Your insurer must approve or reject pre-auth within 1 hour of receiving complete documents under IRDAI Health Insurance Regulations 2024",
  "escalationIfDelayed": "one sentence on what to do if pre-auth takes more than 1 hour"
}`;

  return await callGemini(prompt);
}
